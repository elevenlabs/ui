import { cn } from "@/lib/utils"
import {
  ScrubBarContainer,
  ScrubBarProgress,
  ScrubBarThumb,
  ScrubBarTrack,
} from "@/registry/elevenlabs-ui/ui/scrub-bar"
import {
  TranscriptViewerAudio,
  TranscriptViewerContainer,
  TranscriptViewerPlayPauseButton,
  TranscriptViewerWords,
  useTranscriptViewerContext,
  type CharacterAlignmentResponseModel,
} from "@/registry/elevenlabs-ui/ui/transcript-viewer"

type Props = {
  audioSrc: string
  alignment: CharacterAlignmentResponseModel
}

export function Example({ audioSrc, alignment }: Props) {
  return (
    <TranscriptViewerContainer
      className="max-w-2xl rounded-xl border bg-white p-4"
      audioSrc={audioSrc}
      alignment={alignment}
    >
      <TranscriptViewerAudio className="sr-only" />
      <TranscriptViewerWords />
      <div className="flex items-center gap-3">
        <TranscriptViewerPlayPauseButton />
        <CustomScrubBar />
      </div>
    </TranscriptViewerContainer>
  )
}

// Note that the custom scrub bar is a separate component, this is intentional to ensure the context is defined.
function CustomScrubBar() {
  const {
    duration,
    currentTime,
    seekToTime,
    startScrubbing,
    endScrubbing,
    isScrubbing,
  } = useTranscriptViewerContext()

  return (
    <ScrubBarContainer
      duration={duration}
      value={currentTime}
      onScrub={seekToTime}
      onScrubStart={startScrubbing}
      onScrubEnd={endScrubbing}
    >
      <ScrubBarTrack className="group/scrub-bar">
        <ScrubBarProgress />
        <ScrubBarThumb
          className={cn(
            "bg-black opacity-0 transition-opacity duration-75 group-hover/scrub-bar:opacity-100",
            isScrubbing && "opacity-100"
          )}
        />
      </ScrubBarTrack>
    </ScrubBarContainer>
  )
}

export default Example
