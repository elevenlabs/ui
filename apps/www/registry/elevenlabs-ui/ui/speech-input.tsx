"use client"

import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react"
import { cva, VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"
import { MicIcon, SquareIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  useScribe,
  type AudioFormat,
  type CommitStrategy,
} from "@/registry/elevenlabs-ui/hooks/use-scribe"
import { Button } from "@/registry/elevenlabs-ui/ui/button"

const buttonVariants = cva("!px-0", {
  variants: {
    size: {
      default: "h-9 w-9",
      sm: "h-8 w-8",
      lg: "h-10 w-10",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

// Context for sharing state between compound components
interface SpeechInputContextValue {
  isConnected: boolean
  isConnecting: boolean
  transcript: string
  partialTranscript: string
  committedTranscripts: string[]
  error: string | null
  start: () => Promise<void>
  stop: () => void
  cancel: () => void
  size: VariantProps<typeof buttonVariants>["size"]
}

const SpeechInputContext = createContext<SpeechInputContextValue | null>(null)

function useSpeechInput() {
  const context = useContext(SpeechInputContext)
  if (!context) {
    throw new Error(
      "SpeechInput compound components must be used within a SpeechInput"
    )
  }
  return context
}

// Root component
interface SpeechInputEvent {
  partialTranscript: string
  committedTranscripts: string[]
  transcript: string
}

interface SpeechInputProps {
  children: ReactNode
  getToken: () => Promise<string>
  onChange?: (event: SpeechInputEvent) => void
  onCancel?: (event: SpeechInputEvent) => void
  onStart?: (event: SpeechInputEvent) => void
  onStop?: (event: SpeechInputEvent) => void
  className?: string
  size?: VariantProps<typeof buttonVariants>["size"]

  // Connection options
  modelId?: string
  baseUri?: string

  // VAD options
  commitStrategy?: CommitStrategy
  vadSilenceThresholdSecs?: number
  vadThreshold?: number
  minSpeechDurationMs?: number
  minSilenceDurationMs?: number
  languageCode?: string

  // Microphone options (for automatic microphone mode)
  microphone?: {
    deviceId?: string
    echoCancellation?: boolean
    noiseSuppression?: boolean
    autoGainControl?: boolean
    channelCount?: number
  }

  // Manual audio options
  audioFormat?: AudioFormat
  sampleRate?: number

  // Error callbacks
  onError?: (error: Error | Event) => void
  onAuthError?: (data: { error: string }) => void
  onQuotaExceededError?: (data: { error: string }) => void
}

const buildTranscript = ({
  partialTranscript,
  committedTranscripts,
}: {
  partialTranscript: string
  committedTranscripts: string[]
}): string => {
  const committed = committedTranscripts.join(" ").trim()
  const partial = partialTranscript.trim()

  if (committed && partial) {
    return `${committed} ${partial}`
  }
  return committed || partial
}

const buildEvent = ({
  partialTranscript,
  committedTranscripts,
}: {
  partialTranscript: string
  committedTranscripts: string[]
}): SpeechInputEvent => {
  return {
    partialTranscript,
    committedTranscripts,
    transcript: buildTranscript({ partialTranscript, committedTranscripts }),
  }
}

const SpeechInput = forwardRef<HTMLDivElement, SpeechInputProps>(
  function SpeechInput(
    {
      children,
      getToken,
      onChange,
      onCancel,
      onStart,
      onStop,
      className,
      size = "default",
      modelId = "scribe_v2_realtime",
      baseUri,
      commitStrategy,
      vadSilenceThresholdSecs,
      vadThreshold,
      minSpeechDurationMs,
      minSilenceDurationMs,
      languageCode,
      microphone = {
        echoCancellation: true,
        noiseSuppression: true,
      },
      audioFormat,
      sampleRate,
      onError,
      onAuthError,
      onQuotaExceededError,
    },
    ref
  ) {
    const transcriptsRef = useRef({
      partialTranscript: "",
      committedTranscripts: [] as string[],
    })
    const startRequestIdRef = useRef(0)

    const scribe = useScribe({
      modelId,
      baseUri,
      commitStrategy,
      vadSilenceThresholdSecs,
      vadThreshold,
      minSpeechDurationMs,
      minSilenceDurationMs,
      languageCode,
      audioFormat,
      sampleRate,
      microphone,
      onPartialTranscript: (data) => {
        transcriptsRef.current.partialTranscript = data.text
        onChange?.(buildEvent(transcriptsRef.current))
      },
      onCommittedTranscript: (data) => {
        transcriptsRef.current.committedTranscripts.push(data.text)
        transcriptsRef.current.partialTranscript = ""
        onChange?.(buildEvent(transcriptsRef.current))
      },
      onError,
      onAuthError,
      onQuotaExceededError,
    })

    const isConnecting = scribe.status === "connecting"

    const start = useCallback(async () => {
      const requestId = startRequestIdRef.current + 1
      startRequestIdRef.current = requestId

      transcriptsRef.current = {
        partialTranscript: "",
        committedTranscripts: [],
      }
      scribe.clearTranscripts()

      try {
        const token = await getToken()
        if (startRequestIdRef.current !== requestId) {
          return
        }

        await scribe.connect({
          token,
        })
        if (startRequestIdRef.current !== requestId) {
          scribe.disconnect()
          return
        }
        onStart?.(buildEvent(transcriptsRef.current))
      } catch {
        // Error is handled by onError callback
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getToken, scribe, onStart, microphone])

    const stop = () => {
      startRequestIdRef.current += 1
      scribe.disconnect()
      onStop?.(buildEvent(transcriptsRef.current))
    }

    const cancel = () => {
      startRequestIdRef.current += 1
      const event = buildEvent(transcriptsRef.current)
      scribe.disconnect()
      scribe.clearTranscripts()
      transcriptsRef.current = {
        partialTranscript: "",
        committedTranscripts: [],
      }
      onCancel?.(event)
    }

    const contextValue: SpeechInputContextValue = {
      isConnected: scribe.isConnected,
      isConnecting,
      start,
      stop,
      cancel,
      error: scribe.error,
      size,
      ...buildEvent({
        partialTranscript: scribe.partialTranscript,
        committedTranscripts: scribe.committedTranscripts.map((t) => t.text),
      }),
    }

    useEffect(() => {
      return () => {
        startRequestIdRef.current += 1
        scribe.disconnect()
      }
    }, [scribe.disconnect])

    const childArray = Children.toArray(children)
    const firstChild = childArray[0]
    const isRecordButtonFirst =
      isValidElement(firstChild) && firstChild.type === SpeechInputRecordButton

    return (
      <SpeechInputContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(
            "relative inline-flex items-center overflow-hidden rounded-lg border border-transparent transition-all duration-200",
            isRecordButtonFirst ? "justify-start" : "justify-end",
            scribe.isConnected
              ? "bg-background dark:bg-muted border-input shadow-sm"
              : "",
            className
          )}
        >
          {children}
        </div>
      </SpeechInputContext.Provider>
    )
  }
)

// Record button - toggles between mic icon and stop icon
type SpeechInputRecordButtonProps = Omit<
  ComponentPropsWithoutRef<typeof Button>,
  "size"
>

const SpeechInputRecordButton = forwardRef<
  HTMLButtonElement,
  SpeechInputRecordButtonProps
>(function SpeechInputRecordButton(
  { className, onClick, variant = "ghost", disabled, ...props },
  ref
) {
  const speechInput = useSpeechInput()

  return (
    <Button
      ref={ref}
      variant={variant}
      onClick={(e) => {
        if (speechInput.isConnected) {
          speechInput.stop()
        } else {
          speechInput.start()
        }
        onClick?.(e)
      }}
      disabled={disabled ?? speechInput.isConnecting}
      className={cn(
        buttonVariants({ size: speechInput.size }),
        "relative flex flex-shrink-0 items-center justify-center transition-all",
        speechInput.isConnected && "scale-[80%]",
        className
      )}
      aria-label={
        speechInput.isConnected ? "Stop recording" : "Start recording"
      }
      {...props}
    >
      <div
        className={cn(
          "bg-primary absolute h-4 w-4 rounded-full transition-all duration-200",
          speechInput.isConnecting
            ? "scale-90 opacity-100"
            : "scale-[60%] opacity-0"
        )}
      />
      <SquareIcon
        className={cn(
          "text-destructive absolute h-4 w-4 fill-current transition-all duration-200",
          !speechInput.isConnecting && speechInput.isConnected
            ? "scale-100 opacity-100"
            : "scale-[60%] opacity-0"
        )}
      />
      <MicIcon
        className={cn(
          "absolute h-4 w-4 transition-all duration-200",
          !speechInput.isConnecting && !speechInput.isConnected
            ? "scale-100 opacity-100"
            : "scale-[60%] opacity-0"
        )}
      />
    </Button>
  )
})

// Preview - shows the current transcript with partial
type SpeechInputPreviewProps = ComponentPropsWithoutRef<"div"> & {
  placeholder?: string
}

const SpeechInputPreview = forwardRef<HTMLDivElement, SpeechInputPreviewProps>(
  function SpeechInputPreview(
    { className, placeholder = "Listening...", ...props },
    ref
  ) {
    const speechInput = useSpeechInput()

    const displayText =
      speechInput.transcript || speechInput.partialTranscript || placeholder
    const showPlaceholder = !speechInput.transcript.trim()

    return (
      <div
        ref={ref}
        // @ts-expect-error inert is not yet in React types
        inert={speechInput.isConnected ? undefined : ""}
        className={cn(
          "relative flex h-8 flex-shrink-0 items-center overflow-hidden text-sm transition-[opacity,transform,width] duration-200 ease-out",
          showPlaceholder
            ? "text-muted-foreground italic"
            : "text-muted-foreground [mask-image:linear-gradient(to_right,transparent,black_16px,black_calc(100%-16px),transparent)]",
          speechInput.isConnected ? "w-28 opacity-100" : "w-0 opacity-0",
          className
        )}
        title={displayText}
        aria-hidden={!speechInput.isConnected}
        {...props}
      >
        <motion.p
          key="text"
          layout="position"
          className={`absolute top-0 right-0 bottom-0 flex h-full min-w-full items-center px-0 whitespace-nowrap`}
        >
          {displayText}
        </motion.p>
      </div>
    )
  }
)

// Cancel button
type SpeechInputCancelButtonProps = Omit<
  ComponentPropsWithoutRef<typeof Button>,
  "size"
>

const SpeechInputCancelButton = forwardRef<
  HTMLButtonElement,
  SpeechInputCancelButtonProps
>(function SpeechInputCancelButton(
  { className, onClick, variant = "ghost", ...props },
  ref
) {
  const speechInput = useSpeechInput()

  return (
    <Button
      ref={ref}
      variant={variant}
      // @ts-expect-error inert is not yet in React types
      inert={speechInput.isConnected ? undefined : ""}
      onClick={(e) => {
        speechInput.cancel()
        onClick?.(e)
      }}
      className={cn(
        buttonVariants({ size: speechInput.size }),
        "flex-shrink-0 transition-[opacity,transform,width] duration-200 ease-out",
        speechInput.isConnected
          ? "scale-[80%] opacity-100"
          : "pointer-events-none w-0 scale-100 opacity-0",
        className
      )}
      aria-label="Cancel recording"
      {...props}
    >
      <XIcon className="h-3 w-3" />
    </Button>
  )
})

// Export compound components
export {
  SpeechInput,
  SpeechInputRecordButton,
  SpeechInputPreview,
  SpeechInputCancelButton,
  useSpeechInput,
}
