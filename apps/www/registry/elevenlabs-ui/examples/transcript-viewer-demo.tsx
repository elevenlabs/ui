"use client"

import { useEffect, useState } from "react"
import { PauseIcon, PlayIcon } from "lucide-react"

import {
  TranscriptViewerAudio,
  TranscriptViewerContainer,
  TranscriptViewerPlayPauseButton,
  TranscriptViewerScrubBar,
  TranscriptViewerWords,
  type CharacterAlignmentResponseModel,
} from "@/registry/elevenlabs-ui/ui/transcript-viewer"

import { Skeleton } from "../ui/skeleton"

const TranscriptViewerDemo = () => {
  const audioSrc = "/sounds/transcript-viewer/transcript-viewer-audio.mp3"
  const [alignment, setAlignment] = useState<
    CharacterAlignmentResponseModel | undefined
  >(undefined)

  useEffect(() => {
    fetch("/sounds/transcript-viewer/transcript-viewer-alignment.json")
      .then((res) => res.json())
      .then((data) => setAlignment(data))
  }, [])

  return (
    <div className="flex w-full flex-col gap-4">
      <TranscriptViewerContainer
        key={audioSrc}
        className="bg-card w-full rounded-xl border p-4"
        audioSrc={audioSrc}
        audioType="audio/mpeg"
        alignment={
          alignment ?? {
            characters: [],
            characterStartTimesSeconds: [],
            characterEndTimesSeconds: [],
          }
        }
      >
        <TranscriptViewerAudio className="sr-only" />
        {alignment ? (
          <>
            <TranscriptViewerWords />
            <div className="flex items-center gap-3">
              <TranscriptViewerScrubBar />
            </div>
          </>
        ) : (
          <div className="flex w-full flex-col gap-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="mb-4 h-5 w-1/2" />
            <Skeleton className="h-2 w-full" />
            <div className="-mt-1 flex items-center justify-between">
              <Skeleton className="h-2 w-6" />
              <Skeleton className="h-2 w-6" />
            </div>
          </div>
        )}
        <TranscriptViewerPlayPauseButton
          className="w-full cursor-pointer"
          size="default"
          disabled={!alignment}
        >
          {({ isPlaying }) => (
            <>
              {isPlaying ? (
                <>
                  <PauseIcon className="size-4" /> Pause
                </>
              ) : (
                <>
                  <PlayIcon className="size-4" /> Play
                </>
              )}
            </>
          )}
        </TranscriptViewerPlayPauseButton>
      </TranscriptViewerContainer>
    </div>
  )
}
export default TranscriptViewerDemo
