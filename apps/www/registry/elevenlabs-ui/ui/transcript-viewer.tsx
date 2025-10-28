"use client"

import {
  createContext,
  useContext,
  useMemo,
  type ComponentPropsWithoutRef,
  type ComponentPropsWithRef,
  type HTMLAttributes,
  type ReactNode,
} from "react"
import type { CharacterAlignmentResponseModel } from "@elevenlabs/elevenlabs-js/api/types/CharacterAlignmentResponseModel"
import { Pause, Play } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  useTranscriptViewer,
  type SegmentComposer,
  type TranscriptSegment,
  type TranscriptWord as TranscriptWordType,
  type UseTranscriptViewerResult,
} from "@/registry/elevenlabs-ui/hooks/use-transcript-viewer"
import { Button } from "@/registry/elevenlabs-ui/ui/button"
import ScrubBar from "@/registry/elevenlabs-ui/ui/scrub-bar"

type TranscriptGap = Extract<TranscriptSegment, { kind: "gap" }>

type TranscriptViewerContextValue = UseTranscriptViewerResult & {
  audioProps: Omit<ComponentPropsWithRef<"audio">, "children" | "src">
}

const TranscriptViewerContext =
  createContext<TranscriptViewerContextValue | null>(null)

function useTranscriptViewerContext() {
  const context = useContext(TranscriptViewerContext)
  if (!context) {
    throw new Error(
      "useTranscriptViewerContext must be used within a TranscriptViewer"
    )
  }
  return context
}

type TranscriptViewerProviderProps = {
  value: TranscriptViewerContextValue
  children: ReactNode
}

function TranscriptViewerProvider({
  value,
  children,
}: TranscriptViewerProviderProps) {
  return (
    <TranscriptViewerContext.Provider value={value}>
      {children}
    </TranscriptViewerContext.Provider>
  )
}

export type TranscriptViewerRootProps = {
  audioSrc: string
  alignment: CharacterAlignmentResponseModel
  segmentComposer?: SegmentComposer
  hideAudioTags?: boolean
  children?: ReactNode
} & Omit<ComponentPropsWithoutRef<"div">, "children"> &
  Pick<
    Parameters<typeof useTranscriptViewer>[0],
    "onPlay" | "onPause" | "onTimeUpdate" | "onEnded" | "onDurationChange"
  >

function TranscriptViewerRoot({
  audioSrc,
  alignment,
  segmentComposer,
  hideAudioTags = true,
  children,
  className,
  onPlay,
  onPause,
  onTimeUpdate,
  onEnded,
  onDurationChange,
  ...props
}: TranscriptViewerRootProps) {
  const viewerState = useTranscriptViewer({
    alignment,
    hideAudioTags,
    segmentComposer,
    onPlay,
    onPause,
    onTimeUpdate,
    onEnded,
    onDurationChange,
  })

  const { audioRef } = viewerState

  const audioProps = useMemo(
    () => ({
      ref: audioRef,
      controls: false,
      children: <source src={audioSrc} type="audio/mpeg" />,
    }),
    [audioRef, audioSrc]
  )

  const contextValue = useMemo(
    () => ({
      ...viewerState,
      audioProps,
    }),
    [viewerState, audioProps]
  )

  return (
    <TranscriptViewerProvider value={contextValue}>
      <div
        data-slot="transcript-viewer-root"
        className={cn("space-y-4 p-4", className)}
        {...props}
      >
        {children}
      </div>
    </TranscriptViewerProvider>
  )
}

export type TranscriptWordStatus = "spoken" | "unspoken" | "current"

export interface TranscriptWordProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  word: TranscriptWordType
  status: TranscriptWordStatus
  children?: ReactNode
}

function TranscriptWord({
  word,
  status,
  className,
  children,
  ...props
}: TranscriptWordProps) {
  return (
    <span
      data-slot="transcript-word"
      data-kind="word"
      data-status={status}
      className={cn(
        "rounded-sm px-0.5 transition-colors",
        status === "spoken" && "text-foreground",
        status === "unspoken" && "text-muted-foreground",
        status === "current" && "bg-primary text-primary-foreground",
        className
      )}
      {...props}
    >
      {children ?? word.text}
    </span>
  )
}

export interface TranscriptWordsProps extends HTMLAttributes<HTMLDivElement> {
  renderWord?: (props: {
    word: TranscriptWordType
    status: TranscriptWordStatus
  }) => ReactNode
  renderGap?: (props: {
    segment: TranscriptGap
    status: TranscriptWordStatus
  }) => ReactNode
  wordClassNames?: string
  gapClassNames?: string
}

function TranscriptWords({
  className,
  renderWord,
  renderGap,
  wordClassNames,
  gapClassNames,
  ...props
}: TranscriptWordsProps) {
  const {
    spokenSegments,
    unspokenSegments,
    currentWord,
    segments,
    duration,
    currentTime,
  } = useTranscriptViewerContext()

  const nearEnd = useMemo(() => {
    if (!duration) return false
    return currentTime >= duration - 0.01
  }, [currentTime, duration])

  const segmentsWithStatus = useMemo(() => {
    if (nearEnd) {
      return segments.map((segment) => ({ segment, status: "spoken" as const }))
    }

    const entries: Array<{
      segment: TranscriptSegment
      status: TranscriptWordStatus
    }> = []

    for (const segment of spokenSegments) {
      entries.push({ segment, status: "spoken" })
    }

    if (currentWord) {
      entries.push({ segment: currentWord, status: "current" })
    }

    for (const segment of unspokenSegments) {
      entries.push({ segment, status: "unspoken" })
    }

    return entries
  }, [spokenSegments, unspokenSegments, currentWord, nearEnd, segments])

  return (
    <div
      data-slot="transcript-words"
      className={cn("text-xl leading-relaxed", className)}
      {...props}
    >
      {segmentsWithStatus.map(({ segment, status }) => {
        if (segment.kind === "gap") {
          const content = renderGap
            ? renderGap({ segment, status })
            : segment.text
          return (
            <span
              key={`gap-${segment.segmentIndex}`}
              data-kind="gap"
              data-status={status}
              className={cn(gapClassNames)}
            >
              {content}
            </span>
          )
        }

        if (renderWord) {
          return (
            <span
              key={`word-${segment.segmentIndex}`}
              data-kind="word"
              data-status={status}
              className={cn(wordClassNames)}
            >
              {renderWord({ word: segment, status })}
            </span>
          )
        }

        return (
          <TranscriptWord
            key={`word-${segment.segmentIndex}`}
            word={segment}
            status={status}
            className={wordClassNames}
          />
        )
      })}
    </div>
  )
}

function TranscriptAudio(props: ComponentPropsWithoutRef<"audio">) {
  const { audioProps } = useTranscriptViewerContext()
  return (
    <audio
      data-slot="transcript-audio"
      {...audioProps}
      {...props}
      ref={audioProps.ref}
    />
  )
}

export type TranscriptPlayPauseButtonProps = ComponentPropsWithoutRef<
  typeof Button
>

function TranscriptPlayPauseButton({
  className,
  children,
  onClick,
  ...props
}: TranscriptPlayPauseButtonProps) {
  const { isPlaying, play, pause } = useTranscriptViewerContext()
  const Icon = isPlaying ? Pause : Play

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isPlaying) pause()
    else play()
    onClick?.(event)
  }

  return (
    <Button
      data-slot="transcript-play-pause-button"
      type="button"
      variant="outline"
      size="icon"
      aria-label={isPlaying ? "Pause audio" : "Play audio"}
      className={cn("cursor-pointer", className)}
      onClick={handleClick}
      {...props}
    >
      {children || <Icon className="size-5" />}
    </Button>
  )
}

type TranscriptScrubBarProps = Omit<
  ComponentPropsWithoutRef<typeof ScrubBar.Root>,
  "duration" | "value" | "onScrub" | "onScrubStart" | "onScrubEnd"
> & {
  showTimeLabels?: boolean
  labelsClassName?: string
  trackClassName?: string
  progressClassName?: string
  thumbClassName?: string
}

/**
 * A context-aware implementation of the scrub bar specific to the transcript viewer.
 */
function TranscriptScrubBar({
  className,
  showTimeLabels = true,
  labelsClassName,
  trackClassName,
  progressClassName,
  thumbClassName,
  ...props
}: TranscriptScrubBarProps) {
  const { duration, currentTime, seekToTime, startScrubbing, endScrubbing } =
    useTranscriptViewerContext()
  return (
    <ScrubBar.Root
      data-slot="transcript-scrub-bar"
      duration={duration}
      value={currentTime}
      onScrubStart={startScrubbing}
      onScrubEnd={endScrubbing}
      onScrub={seekToTime}
      className={className}
      {...props}
    >
      <div className="flex flex-1 flex-col gap-1">
        <ScrubBar.Track className={trackClassName}>
          <ScrubBar.Progress className={progressClassName} />
          <ScrubBar.Thumb className={thumbClassName} />
        </ScrubBar.Track>
        {showTimeLabels && (
          <div
            className={cn(
              "text-muted-foreground flex items-center justify-between text-xs",
              labelsClassName
            )}
          >
            <ScrubBar.TimeLabel time={currentTime} />
            <ScrubBar.TimeLabel time={duration - currentTime} />
          </div>
        )}
      </div>
    </ScrubBar.Root>
  )
}

const TranscriptViewer = {
  Root: TranscriptViewerRoot,
  Words: TranscriptWords,
  Word: TranscriptWord,
  Audio: TranscriptAudio,
  PlayPauseButton: TranscriptPlayPauseButton,
  ScrubBar: TranscriptScrubBar,
  Provider: TranscriptViewerProvider,
}

export default TranscriptViewer
export { useTranscriptViewerContext }
