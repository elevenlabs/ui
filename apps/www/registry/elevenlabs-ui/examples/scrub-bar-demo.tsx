"use client"

import * as React from "react"

import {
  ScrubBarContainer,
  ScrubBarProgress,
  ScrubBarThumb,
  ScrubBarTimeLabel,
  ScrubBarTrack,
} from "@/registry/elevenlabs-ui/ui/scrub-bar"

const ScrubBarDemo = () => {
  const [value, setValue] = React.useState(30)
  const [isScrubbing, setIsScrubbing] = React.useState(false)
  const duration = 100

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4 p-4">
      <ScrubBarContainer
        duration={duration}
        value={value}
        onScrub={setValue}
        onScrubStart={() => setIsScrubbing(true)}
        onScrubEnd={() => setIsScrubbing(false)}
        className="w-full"
      >
        <ScrubBarTimeLabel time={value} className="w-10 text-center" />
        <ScrubBarTrack className="mx-2">
          <ScrubBarProgress />
          <ScrubBarThumb className="bg-primary" data-scrubbing={isScrubbing} />
        </ScrubBarTrack>
        <ScrubBarTimeLabel time={duration} className="w-10 text-center" />
      </ScrubBarContainer>
    </div>
  )
}

export default ScrubBarDemo
