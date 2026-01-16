"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Disc, Pause, Play, Trash2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/elevenlabs-ui/ui/button"
import { Card } from "@/registry/elevenlabs-ui/ui/card"
import { LiveWaveform } from "@/registry/elevenlabs-ui/ui/live-waveform"
import { MicSelector } from "@/registry/elevenlabs-ui/ui/mic-selector"
import { Separator } from "@/registry/elevenlabs-ui/ui/separator"

type RecordingState = "idle" | "loading" | "recording" | "recorded" | "playing"

export default function MicSelectorDemo() {
  const [selectedDevice, setSelectedDevice] = useState<string>("")
  const [isMuted, setIsMuted] = useState(false)
  const [state, setState] = useState<RecordingState>("idle")
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioElementRef = useRef<HTMLAudioElement | null>(null)

  const startRecording = useCallback(async () => {
    try {
      setState("loading")

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: selectedDevice ? { deviceId: { exact: selectedDevice } } : true,
      })

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        setAudioBlob(blob)
        stream.getTracks().forEach((track) => track.stop())
        setState("recorded")
      }

      mediaRecorder.start()
      setState("recording")
    } catch (error) {
      console.error("Error starting recording:", error)
      setState("idle")
    }
  }, [selectedDevice])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && state === "recording") {
      mediaRecorderRef.current.stop()
    }
  }, [state])

  const playRecording = useCallback(() => {
    if (!audioBlob) return

    const audio = new Audio(URL.createObjectURL(audioBlob))
    audioElementRef.current = audio

    audio.onended = () => {
      setState("recorded")
    }

    audio.play()
    setState("playing")
  }, [audioBlob])

  const pausePlayback = useCallback(() => {
    if (audioElementRef.current) {
      audioElementRef.current.pause()
      setState("recorded")
    }
  }, [])

  const restart = useCallback(() => {
    if (audioElementRef.current) {
      audioElementRef.current.pause()
      audioElementRef.current = null
    }
    setAudioBlob(null)
    audioChunksRef.current = []
    setState("idle")
  }, [])

  // Stop recording when muted
  useEffect(() => {
    if (isMuted && state === "recording") {
      stopRecording()
    }
  }, [isMuted, state, stopRecording])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop()
      }
      if (audioElementRef.current) {
        audioElementRef.current.pause()
      }
    }
  }, [])

  const showWaveform = state === "recording" && !isMuted
  const showProcessing = state === "loading" || state === "playing"
  const showRecorded = state === "recorded"

  return (
    <div className="flex min-h-[200px] w-full items-center justify-center p-4">
      <Card className="m-0 w-full max-w-2xl border p-0 shadow-lg">
        <div className="flex w-full flex-wrap items-center justify-between gap-2 p-2">
          <div className="h-8 w-full min-w-0 flex-1 md:w-[200px] md:flex-none">
            <div
              className={cn(
                "flex h-full items-center gap-2 rounded-md py-1",
                "bg-foreground/5 text-foreground/70"
              )}
            >
              <div className="h-full min-w-0 flex-1">
                <div className="relative flex h-full w-full shrink-0 items-center justify-center overflow-hidden rounded-sm">
                  <LiveWaveform
                    key={state}
                    active={showWaveform}
                    processing={showProcessing}
                    deviceId={selectedDevice}
                    barWidth={3}
                    barGap={1}
                    barRadius={4}
                    fadeEdges={true}
                    fadeWidth={24}
                    sensitivity={1.8}
                    smoothingTimeConstant={0.85}
                    height={20}
                    mode="scrolling"
                    className={cn(
                      "h-full w-full transition-opacity duration-300",
                      state === "idle" && "opacity-0"
                    )}
                  />
                  {state === "idle" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-foreground/50 text-xs font-medium">
                        Start Recording
                      </span>
                    </div>
                  )}
                  {showRecorded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-foreground/50 text-xs font-medium">
                        Ready to Play
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-wrap items-center justify-center gap-1 md:w-auto">
            <MicSelector
              value={selectedDevice}
              onValueChange={setSelectedDevice}
              muted={isMuted}
              onMutedChange={setIsMuted}
              disabled={state === "recording" || state === "loading"}
            />
            <Separator orientation="vertical" className="mx-1 -my-2.5" />
            <div className="flex">
              {state === "idle" && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={startRecording}
                  disabled={isMuted}
                  aria-label="Start recording"
                >
                  <Disc className="size-5" />
                </Button>
              )}
              {(state === "loading" || state === "recording") && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={stopRecording}
                  disabled={state === "loading"}
                  aria-label="Stop recording"
                >
                  <Pause className="size-5" />
                </Button>
              )}
              {showRecorded && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={playRecording}
                  aria-label="Play recording"
                >
                  <Play className="size-5" />
                </Button>
              )}
              {state === "playing" && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={pausePlayback}
                  aria-label="Pause playback"
                >
                  <Pause className="size-5" />
                </Button>
              )}
              <Separator orientation="vertical" className="mx-1 -my-2.5" />
              <Button
                variant="ghost"
                size="icon"
                onClick={restart}
                disabled={
                  state === "idle" ||
                  state === "loading" ||
                  state === "recording"
                }
                aria-label="Delete recording"
              >
                <Trash2 className="size-5" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
