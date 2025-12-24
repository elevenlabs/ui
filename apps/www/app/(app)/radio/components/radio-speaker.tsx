"use client"

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react"
import Hls from "hls.js"
import { Volume, Volume1, Volume2, VolumeX } from "lucide-react"

import { cn } from "@/registry/elevenlabs-ui/lib/utils"
import {
  AudioPlayerButton,
  AudioPlayerProvider,
  useAudioPlayer,
} from "@/registry/elevenlabs-ui/ui/audio-player"
import { Card } from "@/registry/elevenlabs-ui/ui/card"
import { Orb } from "@/registry/elevenlabs-ui/ui/orb"
import { ShimmeringText } from "@/registry/elevenlabs-ui/ui/shimmering-text"

const RADIO_STREAM_URL = "https://radio.cube.fm/hls/stream.m3u8"

const globalAudioState = {
  isPlaying: false,
  volume: 0.7,
  isDark: false,
}

const PlayButton = memo(() => {
  const player = useAudioPlayer()
  return (
    <AudioPlayerButton
      variant="outline"
      size="icon"
      className={cn(
        "border-border h-14 w-14 rounded-full transition-all duration-300",
        player.isPlaying
          ? "bg-foreground/10 hover:bg-foreground/15 border-foreground/30 dark:bg-primary/20 dark:hover:bg-primary/30 dark:border-primary/50"
          : "bg-background hover:bg-muted"
      )}
    />
  )
})

PlayButton.displayName = "PlayButton"

const SpeakerContextBridge = ({ className }: { className?: string }) => {
  const player = useAudioPlayer()
  const playerRefStatic = useRef(player)

  playerRefStatic.current = player

  return <SpeakerControls className={className} playerRef={playerRefStatic} />
}

export function RadioSpeaker({ className }: { className?: string }) {
  return (
    <AudioPlayerProvider>
      <SpeakerContextBridge className={className} />
    </AudioPlayerProvider>
  )
}

const SpeakerOrb = memo(
  ({
    seed,
    side,
    isDark,
    audioDataRef,
  }: {
    seed: number
    side: "left" | "right"
    isDark: boolean
    audioDataRef: React.RefObject<number[]>
  }) => {
    const getInputVolume = useCallback(() => {
      const audioData = audioDataRef?.current || []
      if (
        !globalAudioState.isPlaying ||
        globalAudioState.volume === 0 ||
        audioData.length === 0
      )
        return 0
      const lowFreqEnd = Math.floor(audioData.length * 0.25)
      let sum = 0
      for (let i = 0; i < lowFreqEnd; i++) {
        sum += audioData[i]
      }
      const avgLow = sum / lowFreqEnd
      const amplified = Math.pow(avgLow, 0.5) * 3.5
      return Math.max(0.2, Math.min(1.0, amplified))
    }, [audioDataRef])

    const getOutputVolume = useCallback(() => {
      const audioData = audioDataRef?.current || []
      if (
        !globalAudioState.isPlaying ||
        globalAudioState.volume === 0 ||
        audioData.length === 0
      )
        return 0
      const midStart = Math.floor(audioData.length * 0.25)
      const midEnd = Math.floor(audioData.length * 0.75)
      let sum = 0
      for (let i = midStart; i < midEnd; i++) {
        sum += audioData[i]
      }
      const avgMid = sum / (midEnd - midStart)
      const modifier = side === "left" ? 0.9 : 1.1
      const amplified = Math.pow(avgMid, 0.5) * 4.0
      return Math.max(0.25, Math.min(1.0, amplified * modifier))
    }, [side, audioDataRef])

    const colors: [string, string] = useMemo(
      () => (isDark ? ["#A0A0A0", "#232323"] : ["#F4F4F4", "#E0E0E0"]),
      [isDark]
    )

    return (
      <Orb
        colors={colors}
        seed={seed}
        volumeMode="manual"
        getInputVolume={getInputVolume}
        getOutputVolume={getOutputVolume}
        className="relative h-full w-full"
      />
    )
  },
  (prevProps, nextProps) => {
    return (
      prevProps.isDark === nextProps.isDark &&
      prevProps.seed === nextProps.seed &&
      prevProps.side === nextProps.side
    )
  }
)

SpeakerOrb.displayName = "SpeakerOrb"

const SpeakerOrbsSection = memo(
  ({
    isDark,
    audioDataRef,
  }: {
    isDark: boolean
    audioDataRef: React.RefObject<number[]>
  }) => {
    return (
      <div className="mt-8 grid grid-cols-2 gap-8">
        <div className="relative aspect-square">
          <div className="bg-muted relative h-full w-full rounded-full p-1 shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]">
            <div className="bg-background h-full w-full overflow-hidden rounded-full shadow-[inset_0_0_12px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_0_12px_rgba(0,0,0,0.3)]">
              <SpeakerOrb
                key={`left-${isDark}`}
                seed={100}
                side="left"
                isDark={isDark}
                audioDataRef={audioDataRef}
              />
            </div>
          </div>
        </div>

        <div className="relative aspect-square">
          <div className="bg-muted relative h-full w-full rounded-full p-1 shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]">
            <div className="bg-background h-full w-full overflow-hidden rounded-full shadow-[inset_0_0_12px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_0_12px_rgba(0,0,0,0.3)]">
              <SpeakerOrb
                key={`right-${isDark}`}
                seed={2000}
                side="right"
                isDark={isDark}
                audioDataRef={audioDataRef}
              />
            </div>
          </div>
        </div>
      </div>
    )
  },
  (prevProps, nextProps) => {
    return prevProps.isDark === nextProps.isDark
  }
)

SpeakerOrbsSection.displayName = "SpeakerOrbsSection"

const VolumeSlider = memo(
  ({
    volume,
    setVolume,
  }: {
    volume: number
    setVolume: (value: number | ((prev: number) => number)) => void
  }) => {
    const [isDragging, setIsDragging] = useState(false)

    const getVolumeIcon = () => {
      if (volume === 0) return VolumeX
      if (volume <= 0.33) return Volume
      if (volume <= 0.66) return Volume1
      return Volume2
    }

    const VolumeIcon = getVolumeIcon()

    return (
      <div className="flex items-center justify-center gap-4 pt-4">
        <button
          onClick={() => setVolume((prev: number) => (prev > 0 ? 0 : 0.7))}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <VolumeIcon
            className={cn(
              "h-4 w-4 transition-all",
              volume === 0 && "text-muted-foreground/50"
            )}
          />
        </button>
        <div
          className="volume-slider bg-foreground/10 group relative h-1 w-48 cursor-pointer rounded-full"
          onClick={(e) => {
            if (isDragging) return
            const rect = e.currentTarget.getBoundingClientRect()
            const x = Math.max(
              0,
              Math.min(1, (e.clientX - rect.left) / rect.width)
            )
            setVolume(x)
          }}
          onMouseDown={(e) => {
            e.preventDefault()
            setIsDragging(true)
            const sliderRect = e.currentTarget.getBoundingClientRect()

            const initialX = Math.max(
              0,
              Math.min(1, (e.clientX - sliderRect.left) / sliderRect.width)
            )
            setVolume(initialX)

            const handleMove = (e: MouseEvent) => {
              const x = Math.max(
                0,
                Math.min(1, (e.clientX - sliderRect.left) / sliderRect.width)
              )
              setVolume(x)
            }
            const handleUp = () => {
              setIsDragging(false)
              document.removeEventListener("mousemove", handleMove)
              document.removeEventListener("mouseup", handleUp)
            }
            document.addEventListener("mousemove", handleMove)
            document.addEventListener("mouseup", handleUp)
          }}
        >
          <div
            className={cn(
              "bg-primary absolute top-0 left-0 h-full rounded-full",
              !isDragging && "transition-all duration-150"
            )}
            style={{ width: `${volume * 100}%` }}
          />
        </div>
        <span className="text-muted-foreground w-12 text-right font-mono text-xs">
          {Math.round(volume * 100)}%
        </span>
      </div>
    )
  }
)

VolumeSlider.displayName = "VolumeSlider"

const SpeakerControls = memo(function SpeakerControls({
  className,
  playerRef,
}: {
  className?: string
  playerRef: React.RefObject<ReturnType<typeof useAudioPlayer>>
}) {
  const playerApiRef = playerRef
  const isPlayingRef = useRef(false)

  const [volume, setVolume] = useState(0.7)
  const audioDataRef = useRef<number[]>([])
  const [isDark, setIsDark] = useState(false)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  const hlsRef = useRef<Hls | null>(null)

  useEffect(() => {
    const checkTheme = () => {
      const isDarkMode = document.documentElement.classList.contains("dark")
      setIsDark(isDarkMode)
    }

    checkTheme()

    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [])

  const setupAudioContext = useCallback(() => {
    if (!playerApiRef.current.ref.current) {
      return
    }

    if (audioContextRef.current && sourceRef.current && analyserRef.current) {
      // Already set up
      return
    }

    try {
      let audioContext = audioContextRef.current
      let source = sourceRef.current
      let analyser = analyserRef.current

      if (!audioContext) {
        audioContext = new (window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext)()
        audioContextRef.current = audioContext
      }

      if (audioContext.state === "suspended") {
        audioContext.resume()
      }

      if (!source) {
        try {
          source = audioContext.createMediaElementSource(
            playerApiRef.current.ref.current
          )
          sourceRef.current = source
        } catch (error) {
          console.error("Error creating media source:", error)
          return
        }
      }

      if (!analyser) {
        analyser = audioContext.createAnalyser()
        analyser.fftSize = 512
        analyser.smoothingTimeConstant = 0.7
        analyserRef.current = analyser
      }

      try {
        source.disconnect()
      } catch {
        // First time connecting, no need to disconnect
      }

      source.connect(analyser)
      analyser.connect(audioContext.destination)
    } catch (error) {
      console.error("Error setting up audio context:", error)
    }
  }, [playerApiRef])

  useEffect(() => {
    const audioEl = playerApiRef.current.ref.current
    if (!audioEl) return

    // Set up HLS streaming
    if (Hls.isSupported()) {
      // Use hls.js for browsers that don't support HLS natively
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
      })
      hlsRef.current = hls

      hls.loadSource(RADIO_STREAM_URL)
      hls.attachMedia(audioEl)

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log("HLS manifest parsed, ready to play")
      })

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error("HLS error:", data)
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.log("Network error, trying to recover...")
              hls.startLoad()
              break
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log("Media error, trying to recover...")
              hls.recoverMediaError()
              break
            default:
              console.log("Fatal error, destroying HLS instance")
              hls.destroy()
              break
          }
        }
      })
    } else if (audioEl.canPlayType("application/vnd.apple.mpegurl")) {
      // Native HLS support (Safari)
      audioEl.src = RADIO_STREAM_URL
      console.log("Using native HLS support")
    } else {
      console.error("HLS is not supported in this browser")
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
    }
  }, [playerApiRef, setupAudioContext])

  useEffect(() => {
    const playerApi = playerApiRef.current

    const handlePlay = () => {
      isPlayingRef.current = true
      globalAudioState.isPlaying = true

      // Set up audio context when playing starts
      if (!analyserRef.current) {
        setTimeout(() => {
          setupAudioContext()
        }, 100)
      }

      // Resume context if suspended
      setTimeout(() => {
        if (
          audioContextRef.current &&
          audioContextRef.current.state === "suspended"
        ) {
          audioContextRef.current.resume()
        }
      }, 150)
    }
    const handlePause = () => {
      isPlayingRef.current = false
      globalAudioState.isPlaying = false
    }

    const handleCanPlay = () => {
      // Media is ready, we'll set up audio context on play
      console.log("HLS stream ready to play")
    }

    const checkInterval = setInterval(() => {
      const audioEl = playerApi.ref.current
      if (audioEl) {
        clearInterval(checkInterval)

        audioEl.addEventListener("play", handlePlay)
        audioEl.addEventListener("pause", handlePause)
        audioEl.addEventListener("ended", handlePause)
        audioEl.addEventListener("canplay", handleCanPlay)
        audioEl.addEventListener("loadedmetadata", handleCanPlay)

        if (!audioEl.paused) {
          handlePlay()
        }
      }
    }, 100)

    return () => {
      clearInterval(checkInterval)
      const audioEl = playerApi.ref.current
      if (audioEl) {
        audioEl.removeEventListener("play", handlePlay)
        audioEl.removeEventListener("pause", handlePause)
        audioEl.removeEventListener("ended", handlePause)
        audioEl.removeEventListener("canplay", handleCanPlay)
        audioEl.removeEventListener("loadedmetadata", handleCanPlay)
      }
    }
  }, [setupAudioContext, playerApiRef])

  useEffect(() => {
    globalAudioState.isDark = isDark
  }, [isDark])

  useEffect(() => {
    if (playerApiRef.current.ref.current) {
      playerApiRef.current.ref.current.volume = volume
    }
    globalAudioState.volume = volume
  }, [volume, playerApiRef])

  useEffect(() => {
    let animationId: number

    const updateWaveform = () => {
      if (analyserRef.current && isPlayingRef.current) {
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
        analyserRef.current.getByteFrequencyData(dataArray)

        const normalizedData = Array.from(dataArray).map((value) => {
          const normalized = value / 255
          return normalized
        })

        audioDataRef.current = normalizedData

        // Debug logging to see if we're getting audio data
        const hasData = normalizedData.some((v) => v > 0.01)
        if (!hasData && Date.now() % 2000 < 50) {
          console.log("No audio data detected", {
            analyserExists: !!analyserRef.current,
            isPlaying: isPlayingRef.current,
            dataLength: normalizedData.length,
          })
        }
      } else if (!isPlayingRef.current && audioDataRef.current.length > 0) {
        audioDataRef.current = audioDataRef.current.map((v) => v * 0.9)
      }

      animationId = requestAnimationFrame(updateWaveform)
    }

    animationId = requestAnimationFrame(updateWaveform)

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [])

  return (
    <Card className={cn("relative", className)}>
      <div className="bg-muted-foreground/30 absolute top-0 left-1/2 h-3 w-48 -translate-x-1/2 rounded-b-full" />
      <div className="bg-muted-foreground/20 absolute top-0 left-1/2 h-2 w-44 -translate-x-1/2 rounded-b-full" />

      <div className="relative space-y-6 p-4">
        <div className="border-border rounded-lg border bg-black/5 p-4 backdrop-blur-sm dark:bg-black/50">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-medium">
                  <ShimmeringText
                    text="Halloween Radio"
                    duration={2.5}
                    startOnView={false}
                    once={false}
                    className="text-sm font-medium"
                  />
                </h3>
                <p className="text-muted-foreground truncate text-xs">
                  Hosted by Dr. Eleven
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  Live
                </p>
              </div>
            </div>

            <div className="bg-foreground/10 relative flex items-center justify-center rounded-lg p-2 dark:bg-black/80">
              <PlayButton />
            </div>
          </div>
        </div>

        <SpeakerOrbsSection isDark={isDark} audioDataRef={audioDataRef} />

        <VolumeSlider volume={volume} setVolume={setVolume} />

        <div className="pt-2 text-center">
          <p className="text-muted-foreground text-xs">
            Powered by{" "}
            <a
              href="https://elevenlabs.io/music"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary font-medium transition-colors"
            >
              ElevenLabs Music
            </a>
          </p>
        </div>
      </div>
    </Card>
  )
})

SpeakerControls.displayName = "SpeakerControls"
