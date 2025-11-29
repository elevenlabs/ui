"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"
import { MicIcon, SquareIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  useScribe,
  type AudioFormat,
  type CommitStrategy,
} from "@/registry/elevenlabs-ui/hooks/use-scribe"
import { Button } from "@/registry/elevenlabs-ui/ui/button"
import { Skeleton } from "@/registry/elevenlabs-ui/ui/skeleton"

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

type ButtonSize = VariantProps<typeof buttonVariants>["size"]

export interface SpeechInputData {
  /** The current partial (in-progress) transcript */
  partialTranscript: string
  /** Array of all committed (finalized) transcripts */
  committedTranscripts: string[]
  /** Full transcript combining committed and partial transcripts */
  transcript: string
}

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
  size: ButtonSize
}

const SpeechInputContext = React.createContext<SpeechInputContextValue | null>(
  null
)

function useSpeechInput() {
  const context = React.useContext(SpeechInputContext)
  if (!context) {
    throw new Error(
      "SpeechInput compound components must be used within a SpeechInput"
    )
  }
  return context
}

function buildTranscript({
  partialTranscript,
  committedTranscripts,
}: {
  partialTranscript: string
  committedTranscripts: string[]
}): string {
  const committed = committedTranscripts.join(" ").trim()
  const partial = partialTranscript.trim()

  if (committed && partial) {
    return `${committed} ${partial}`
  }
  return committed || partial
}

function buildData({
  partialTranscript,
  committedTranscripts,
}: {
  partialTranscript: string
  committedTranscripts: string[]
}): SpeechInputData {
  return {
    partialTranscript,
    committedTranscripts,
    transcript: buildTranscript({ partialTranscript, committedTranscripts }),
  }
}

export interface SpeechInputProps {
  children: React.ReactNode

  /**
   * Function that returns a token for authenticating with the speech service.
   * This should be an async function that fetches a token from your backend.
   */
  getToken: () => Promise<string>

  /**
   * Called whenever the transcript changes (partial or committed)
   */
  onChange?: (data: SpeechInputData) => void

  /**
   * Called when recording is cancelled
   */
  onCancel?: (data: SpeechInputData) => void

  /**
   * Called when recording starts
   */
  onStart?: (data: SpeechInputData) => void

  /**
   * Called when recording stops
   */
  onStop?: (data: SpeechInputData) => void

  /**
   * Additional CSS classes for the root container
   */
  className?: string

  /**
   * Size variant for the component buttons
   * @default "default"
   */
  size?: ButtonSize

  /**
   * Model ID for the speech recognition service
   * @default "scribe_v2_realtime"
   */
  modelId?: string

  /**
   * Base URI for the speech recognition service
   */
  baseUri?: string

  /**
   * Strategy for committing transcripts
   */
  commitStrategy?: CommitStrategy

  /**
   * Silence threshold in seconds for VAD
   */
  vadSilenceThresholdSecs?: number

  /**
   * VAD threshold value
   */
  vadThreshold?: number

  /**
   * Minimum speech duration in milliseconds
   */
  minSpeechDurationMs?: number

  /**
   * Minimum silence duration in milliseconds
   */
  minSilenceDurationMs?: number

  /**
   * Language code for transcription (e.g., "en", "es", "fr")
   */
  languageCode?: string

  /**
   * Microphone configuration options
   */
  microphone?: {
    deviceId?: string
    echoCancellation?: boolean
    noiseSuppression?: boolean
    autoGainControl?: boolean
    channelCount?: number
  }

  /**
   * Audio format for manual audio mode
   */
  audioFormat?: AudioFormat

  /**
   * Sample rate for manual audio mode
   */
  sampleRate?: number

  /**
   * Called when an error occurs
   */
  onError?: (error: Error | Event) => void

  /**
   * Called when an authentication error occurs
   */
  onAuthError?: (data: { error: string }) => void

  /**
   * Called when a quota exceeded error occurs
   */
  onQuotaExceededError?: (data: { error: string }) => void
}

const SpeechInput = React.forwardRef<HTMLDivElement, SpeechInputProps>(
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
    const transcriptsRef = React.useRef({
      partialTranscript: "",
      committedTranscripts: [] as string[],
    })
    const startRequestIdRef = React.useRef(0)

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
        onChange?.(buildData(transcriptsRef.current))
      },
      onCommittedTranscript: (data) => {
        transcriptsRef.current.committedTranscripts.push(data.text)
        transcriptsRef.current.partialTranscript = ""
        onChange?.(buildData(transcriptsRef.current))
      },
      onError,
      onAuthError,
      onQuotaExceededError,
    })

    const isConnecting = scribe.status === "connecting"

    const start = React.useCallback(async () => {
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
        onStart?.(buildData(transcriptsRef.current))
      } catch (error) {
        onError?.(error instanceof Error ? error : new Error(String(error)))
      }
    }, [getToken, scribe, onStart, onError])

    const stop = React.useCallback(() => {
      startRequestIdRef.current += 1
      scribe.disconnect()
      onStop?.(buildData(transcriptsRef.current))
    }, [scribe, onStop])

    const cancel = React.useCallback(() => {
      startRequestIdRef.current += 1
      const data = buildData(transcriptsRef.current)
      scribe.disconnect()
      scribe.clearTranscripts()
      transcriptsRef.current = {
        partialTranscript: "",
        committedTranscripts: [],
      }
      onCancel?.(data)
    }, [scribe, onCancel])

    const contextValue: SpeechInputContextValue = React.useMemo(
      () => ({
        isConnected: scribe.isConnected,
        isConnecting,
        start,
        stop,
        cancel,
        error: scribe.error,
        size,
        ...buildData({
          partialTranscript: scribe.partialTranscript,
          committedTranscripts: scribe.committedTranscripts.map((t) => t.text),
        }),
      }),
      [
        scribe.isConnected,
        scribe.error,
        scribe.partialTranscript,
        scribe.committedTranscripts,
        isConnecting,
        start,
        stop,
        cancel,
        size,
      ]
    )

    React.useEffect(() => {
      return () => {
        startRequestIdRef.current += 1
        scribe.disconnect()
      }
    }, [scribe.disconnect])

    return (
      <SpeechInputContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(
            "relative inline-flex items-center overflow-hidden rounded-md transition-all duration-200",
            scribe.isConnected
              ? "bg-background dark:bg-muted shadow-[inset_0_0_0_1px_var(--color-input),0_1px_2px_0_rgba(0,0,0,0.05)]"
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

SpeechInput.displayName = "SpeechInput"

export type SpeechInputRecordButtonProps = Omit<
  React.ComponentPropsWithoutRef<typeof Button>,
  "size"
>

/**
 * Toggle button for starting/stopping speech recording.
 * Shows a microphone icon when idle and a stop icon when recording.
 */
const SpeechInputRecordButton = React.forwardRef<
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
      type="button"
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
        "relative flex items-center justify-center transition-all",
        speechInput.isConnected && "scale-[80%]",
        className
      )}
      aria-label={
        speechInput.isConnected ? "Stop recording" : "Start recording"
      }
      {...props}
    >
      <Skeleton
        className={cn(
          "absolute h-4 w-4 rounded-full transition-all duration-200",
          speechInput.isConnecting
            ? "bg-primary scale-90"
            : "scale-[60%] bg-transparent"
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

SpeechInputRecordButton.displayName = "SpeechInputRecordButton"

export interface SpeechInputPreviewProps
  extends React.ComponentPropsWithoutRef<"div"> {
  /**
   * Text to show when no transcript is available
   * @default "Listening..."
   */
  placeholder?: string
}

/**
 * Displays the current transcript with a placeholder when empty.
 * Only visible when actively recording.
 */
const SpeechInputPreview = React.forwardRef<
  HTMLDivElement,
  SpeechInputPreviewProps
>(function SpeechInputPreview(
  { className, placeholder = "Listening...", ...props },
  ref
) {
  const speechInput = useSpeechInput()

  const displayText = speechInput.transcript || placeholder
  const showPlaceholder = !speechInput.transcript.trim()

  return (
    <div
      ref={ref}
      inert={speechInput.isConnected ? undefined : true}
      className={cn(
        "relative self-stretch text-sm transition-[opacity,transform,width] duration-200 ease-out",
        showPlaceholder
          ? "text-muted-foreground italic"
          : "text-muted-foreground",
        speechInput.isConnected ? "w-28 opacity-100" : "w-0 opacity-0",
        className
      )}
      title={displayText}
      aria-hidden={!speechInput.isConnected}
      {...props}
    >
      <div className="absolute inset-y-0 -right-1 -left-1 [mask-image:linear-gradient(to_right,transparent,black_10px,black_calc(100%-10px),transparent)]">
        <motion.p
          key="text"
          layout="position"
          className="absolute top-0 right-0 bottom-0 flex h-full min-w-full items-center px-1 whitespace-nowrap"
        >
          {displayText}
        </motion.p>
      </div>
    </div>
  )
})

SpeechInputPreview.displayName = "SpeechInputPreview"

export type SpeechInputCancelButtonProps = Omit<
  React.ComponentPropsWithoutRef<typeof Button>,
  "size"
>

/**
 * Button to cancel the current recording and discard the transcript.
 * Only visible when actively recording.
 */
const SpeechInputCancelButton = React.forwardRef<
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
      type="button"
      variant={variant}
      inert={speechInput.isConnected ? undefined : true}
      onClick={(e) => {
        speechInput.cancel()
        onClick?.(e)
      }}
      className={cn(
        buttonVariants({ size: speechInput.size }),
        "transition-[opacity,transform,width] duration-200 ease-out",
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

SpeechInputCancelButton.displayName = "SpeechInputCancelButton"

export {
  SpeechInput,
  SpeechInputRecordButton,
  SpeechInputPreview,
  SpeechInputCancelButton,
  useSpeechInput,
}
