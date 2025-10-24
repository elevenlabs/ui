"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Copy } from "lucide-react"
import { Streamdown } from "streamdown"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/elevenlabs-ui/ui/button"
import { ScrollArea } from "@/registry/elevenlabs-ui/ui/scroll-area"
import { ShimmeringText } from "@/registry/elevenlabs-ui/ui/shimmering-text"

interface RecordingState {
  isRecording: boolean
  isProcessing: boolean
  isConnecting: boolean
  transcript: string
  partialTranscript: string
  error: string
}

// ElevenLabs WebSocket message types
interface InputAudioChunk {
  message_type: "input_audio_chunk"
  audio_base_64: string
  commit: boolean
}

interface PartialTranscriptMessage {
  message_type: "partial_transcript"
  transcript: string
}

interface FinalTranscriptMessage {
  message_type: "final_transcript"
  transcript: string
}

interface ErrorMessage {
  message_type: "error"
  error: string
}

type WebSocketMessage =
  | { message_type: "session_started" }
  | PartialTranscriptMessage
  | FinalTranscriptMessage
  | ErrorMessage

// WebSocket proxy URL - set via environment variable or use default local dev server
const WEBSOCKET_PROXY_URL =
  process.env.NEXT_PUBLIC_STT_PROXY_URL || "ws://localhost:3001"

export default function RealtimeTranscriber01() {
  const [recording, setRecording] = useState<RecordingState>({
    isRecording: false,
    isProcessing: false,
    isConnecting: false,
    transcript: "",
    partialTranscript: "",
    error: "",
  })

  const audioContextRef = useRef<AudioContext | null>(null)
  const processorRef = useRef<ScriptProcessorNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const websocketRef = useRef<WebSocket | null>(null)

  // Audio refs for sound effects
  const startSoundRef = useRef<HTMLAudioElement | null>(null)
  const endSoundRef = useRef<HTMLAudioElement | null>(null)
  const errorSoundRef = useRef<HTMLAudioElement | null>(null)
  const prevRecordingRef = useRef(false)
  const prevErrorRef = useRef("")

  const updateRecording = useCallback((updates: Partial<RecordingState>) => {
    setRecording((prev) => ({ ...prev, ...updates }))
  }, [])

  const cleanupStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }, [])

  const cleanupWebSocket = useCallback(() => {
    if (websocketRef.current) {
      websocketRef.current.close()
      websocketRef.current = null
    }
  }, [])

  const stopRecording = useCallback(() => {
    console.log("[Client] Stopping recording...")

    // Stop audio processing
    if (processorRef.current) {
      processorRef.current.disconnect()
      processorRef.current = null
    }

    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }

    // Send commit to finalize transcription
    if (websocketRef.current?.readyState === WebSocket.OPEN) {
      const commitMessage: InputAudioChunk = {
        message_type: "input_audio_chunk",
        audio_base_64: "",
        commit: true,
      }
      websocketRef.current.send(JSON.stringify(commitMessage))
    }

    cleanupStream()
    updateRecording({ isRecording: false, isProcessing: true })
  }, [cleanupStream, updateRecording])

  const startRecording = useCallback(async () => {
    try {
      console.log("[Client] Starting recording...")
      updateRecording({
        transcript: "",
        partialTranscript: "",
        error: "",
        isConnecting: true,
      })

      // Get user media
      console.log("[Client] Requesting microphone access...")
      const stream =
        await navigator.mediaDevices.getUserMedia(AUDIO_CONSTRAINTS)
      streamRef.current = stream
      console.log("[Client] Microphone access granted")

      // Connect to WebSocket proxy
      console.log("[Client] Connecting to WebSocket proxy...")
      const websocket = new WebSocket(WEBSOCKET_PROXY_URL)
      websocketRef.current = websocket

      websocket.onopen = () => {
        console.log("[Client] WebSocket connected")
      }

      websocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as WebSocketMessage

          switch (data.message_type) {
            case "session_started":
              console.log("[Client] Session started")
              updateRecording({ isConnecting: false, isRecording: true })

              // Start AudioContext to capture raw PCM audio
              const audioContext = new AudioContext({ sampleRate: 16000 })
              audioContextRef.current = audioContext

              const source = audioContext.createMediaStreamSource(stream)
              const processor = audioContext.createScriptProcessor(4096, 1, 1)
              processorRef.current = processor

              let chunkCount = 0
              processor.onaudioprocess = (event) => {
                if (websocket.readyState === WebSocket.OPEN) {
                  const inputBuffer = event.inputBuffer
                  const inputData = inputBuffer.getChannelData(0)

                  // Convert Float32Array to PCM16
                  const pcmData = new Int16Array(inputData.length)
                  for (let i = 0; i < inputData.length; i++) {
                    pcmData[i] =
                      Math.max(-1, Math.min(1, inputData[i])) * 0x7fff
                  }

                  // Convert to base64
                  const uint8Array = new Uint8Array(pcmData.buffer)
                  const base64 = btoa(String.fromCharCode(...uint8Array))

                  chunkCount++
                  if (chunkCount % 10 === 0) {
                    console.log(`[Client] Sent ${chunkCount} PCM audio chunks`)
                  }

                  const message: InputAudioChunk = {
                    message_type: "input_audio_chunk",
                    audio_base_64: base64,
                    commit: false,
                  }

                  websocket.send(JSON.stringify(message))
                }
              }

              source.connect(processor)
              processor.connect(audioContext.destination)

              console.log(
                "[Client] AudioContext started, capturing PCM audio..."
              )
              break

            case "partial_transcript":
              console.log("[Client] Partial transcript:", data.transcript)
              updateRecording({ partialTranscript: data.transcript })
              break

            case "final_transcript":
              console.log("[Client] Final transcript:", data.transcript)
              updateRecording({
                transcript: data.transcript,
                partialTranscript: "",
                isProcessing: false,
              })
              cleanupWebSocket()
              break

            case "error":
              console.error("[Client] Error from server:", data.error)
              updateRecording({
                error: data.error,
                isProcessing: false,
                isRecording: false,
                isConnecting: false,
              })
              cleanupWebSocket()
              break
          }
        } catch (err) {
          console.error("[Client] Failed to parse message:", err)
        }
      }

      websocket.onerror = (error) => {
        console.error("[Client] WebSocket error:", error)
        updateRecording({
          error: "Connection error",
          isRecording: false,
          isConnecting: false,
          isProcessing: false,
        })
        cleanupStream()
        cleanupWebSocket()
      }

      websocket.onclose = (event) => {
        console.log("[Client] WebSocket closed:", event.code, event.reason)
        if (event.code === 1008) {
          // Policy violation - likely quota exceeded
          updateRecording({
            error: "Quota exceeded. Please try again later.",
            isRecording: false,
            isConnecting: false,
            isProcessing: false,
          })
        }
      }
    } catch (err) {
      console.error("[Client] Start recording error:", err)
      updateRecording({
        error: err instanceof Error ? err.message : "Failed to start recording",
        isRecording: false,
        isConnecting: false,
      })
      cleanupStream()
      cleanupWebSocket()
    }
  }, [cleanupStream, cleanupWebSocket, updateRecording])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger on Alt key, not when typing in input fields
      if (
        e.altKey &&
        !recording.isRecording &&
        !recording.isConnecting &&
        !recording.isProcessing &&
        e.target instanceof HTMLElement &&
        !["INPUT", "TEXTAREA"].includes(e.target.tagName)
      ) {
        e.preventDefault()
        startRecording()
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.altKey && recording.isRecording) {
        stopRecording()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [
    recording.isRecording,
    recording.isConnecting,
    recording.isProcessing,
    startRecording,
    stopRecording,
  ])

  useEffect(() => {
    return () => {
      cleanupStream()
      cleanupWebSocket()
    }
  }, [cleanupStream, cleanupWebSocket])

  // Preload audio files on mount
  useEffect(() => {
    startSoundRef.current = new Audio(
      "https://ui.elevenlabs.io/sounds/transcriber-start.mp3"
    )
    endSoundRef.current = new Audio(
      "https://ui.elevenlabs.io/sounds/transcriber-end.mp3"
    )
    errorSoundRef.current = new Audio(
      "https://ui.elevenlabs.io/sounds/transcriber-error.mp3"
    )

    // Preload by setting volume and loading
    ;[
      startSoundRef.current,
      endSoundRef.current,
      errorSoundRef.current,
    ].forEach((audio) => {
      audio.volume = 0.6
      audio.load()
    })
  }, [])

  // Play start sound when recording begins
  useEffect(() => {
    if (recording.isRecording && !prevRecordingRef.current) {
      startSoundRef.current?.play().catch(() => {
        // Ignore play errors (e.g., user hasn't interacted with page yet)
      })
    }

    // Play end sound when recording stops
    if (!recording.isRecording && prevRecordingRef.current) {
      endSoundRef.current?.play().catch(() => {
        // Ignore play errors
      })
    }

    prevRecordingRef.current = recording.isRecording
  }, [recording.isRecording])

  // Play error sound when error occurs
  useEffect(() => {
    if (recording.error && recording.error !== prevErrorRef.current) {
      errorSoundRef.current?.play().catch(() => {
        // Ignore play errors
      })
    }
    prevErrorRef.current = recording.error
  }, [recording.error])

  const displayText =
    recording.error || recording.partialTranscript || recording.transcript
  const hasContent = Boolean(displayText)

  return (
    <div className="relative mx-auto flex h-full w-full max-w-4xl flex-col items-center justify-center">
      {/* Bottom aura effect - Multi-layered prismatic glow */}
      <div
        className={cn(
          "pointer-events-none fixed inset-0 opacity-0 transition-opacity duration-700 ease-out",
          recording.isConnecting && "opacity-40 duration-500 ease-in",
          recording.isRecording && "opacity-100 duration-700 ease-in"
        )}
      >
        {/* Center bottom pool - main glow */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2"
          style={{
            width: "130%",
            height: "20vh",
            background:
              "radial-gradient(ellipse 100% 100% at 50% 100%, rgba(34, 211, 238, 0.5) 0%, rgba(168, 85, 247, 0.4) 35%, rgba(251, 146, 60, 0.5) 70%, transparent 100%)",
            filter: "blur(80px)",
          }}
        />

        {/* Pulsing layer */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 animate-pulse"
          style={{
            width: "100%",
            height: "18vh",
            background:
              "radial-gradient(ellipse 100% 100% at 50% 100%, rgba(134, 239, 172, 0.5) 0%, rgba(192, 132, 252, 0.4) 50%, transparent 100%)",
            filter: "blur(60px)",
            animationDuration: "4s",
          }}
        />

        {/* Left corner bloom */}
        <div
          className="absolute bottom-0 left-0"
          style={{
            width: "25vw",
            height: "30vh",
            background:
              "radial-gradient(circle at 0% 100%, rgba(34, 211, 238, 0.5) 0%, rgba(134, 239, 172, 0.3) 30%, transparent 60%)",
            filter: "blur(70px)",
          }}
        />

        {/* Left rising glow - organic curve */}
        <div
          className="absolute bottom-0 -left-8"
          style={{
            width: "20vw",
            height: "45vh",
            background:
              "radial-gradient(ellipse 50% 100% at 10% 100%, rgba(34, 211, 238, 0.4) 0%, rgba(134, 239, 172, 0.25) 25%, transparent 60%)",
            filter: "blur(60px)",
            animation: "pulseGlow 5s ease-in-out infinite alternate",
          }}
        />

        {/* Right corner bloom */}
        <div
          className="absolute right-0 bottom-0"
          style={{
            width: "25vw",
            height: "30vh",
            background:
              "radial-gradient(circle at 100% 100%, rgba(251, 146, 60, 0.5) 0%, rgba(251, 146, 60, 0.3) 30%, transparent 60%)",
            filter: "blur(70px)",
          }}
        />

        {/* Right rising glow - organic curve */}
        <div
          className="absolute -right-8 bottom-0"
          style={{
            width: "20vw",
            height: "45vh",
            background:
              "radial-gradient(ellipse 50% 100% at 90% 100%, rgba(251, 146, 60, 0.4) 0%, rgba(192, 132, 252, 0.25) 25%, transparent 60%)",
            filter: "blur(60px)",
            animation: "pulseGlow 5s ease-in-out infinite alternate-reverse",
          }}
        />

        {/* Shimmer overlay */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2"
          style={{
            width: "100%",
            height: "15vh",
            background:
              "linear-gradient(90deg, rgba(34, 211, 238, 0.3) 0%, rgba(168, 85, 247, 0.3) 30%, rgba(251, 146, 60, 0.3) 60%, rgba(134, 239, 172, 0.3) 100%)",
            filter: "blur(30px)",
            animation: "shimmer 8s linear infinite",
          }}
        />
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-20%) scale(1);
          }
          50% {
            transform: translateX(20%) scale(1.1);
          }
          100% {
            transform: translateX(-20%) scale(1);
          }
        }
        @keyframes drift {
          0% {
            transform: translateX(-10%) scale(1);
          }
          100% {
            transform: translateX(10%) scale(1.05);
          }
        }
        @keyframes pulseGlow {
          0% {
            opacity: 0.5;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0.8;
            transform: translateY(-5%) scale(1.02);
          }
        }
      `}</style>

      <div className="relative flex h-full w-full flex-col items-center justify-center gap-8 px-8 py-12">
        {/* Main transcript area */}
        <div className="flex min-h-[350px] w-full flex-1 items-center justify-center">
          {hasContent && (
            <TranscriberTranscript
              transcript={displayText}
              error={recording.error}
              isPartial={Boolean(recording.partialTranscript)}
            />
          )}

          {!hasContent && (
            <div className="flex flex-col items-center gap-8">
              {/* Main instruction text - transitions smoothly between states */}
              <div className="relative flex min-h-[48px] min-w-[500px] items-center justify-center">
                <div
                  className={cn(
                    "absolute inset-0 flex items-center justify-center transition-opacity duration-500",
                    recording.isConnecting
                      ? "opacity-100"
                      : "pointer-events-none opacity-0"
                  )}
                >
                  <ShimmeringText
                    text="Connecting..."
                    className="text-2xl font-light tracking-wide whitespace-nowrap"
                  />
                </div>
                <div
                  className={cn(
                    "absolute inset-0 flex items-center justify-center transition-opacity duration-500",
                    recording.isRecording
                      ? "opacity-100"
                      : "pointer-events-none opacity-0"
                  )}
                >
                  <ShimmeringText
                    text="Start talking"
                    className="text-3xl font-light tracking-wide whitespace-nowrap"
                  />
                </div>
                <div
                  className={cn(
                    "absolute inset-0 flex items-center justify-center transition-opacity duration-500",
                    !recording.isConnecting && !recording.isRecording && !recording.isProcessing
                      ? "opacity-100"
                      : "pointer-events-none opacity-0"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-foreground text-2xl font-light tracking-wide whitespace-nowrap">
                      Press and hold
                    </span>
                    <kbd className="border-border inline-flex h-8 items-center rounded-md border bg-muted/50 px-3 font-mono text-base font-medium shadow-sm select-none">
                      <ShimmeringText text="⌥ Option" className="text-base" />
                    </kbd>
                  </div>
                </div>
              </div>

              {/* Secondary text - always present but fades out */}
              <p
                className={cn(
                  "text-muted-foreground text-center text-sm font-light transition-opacity duration-500",
                  recording.isConnecting || recording.isRecording || recording.isProcessing
                    ? "opacity-0"
                    : "opacity-100"
                )}
              >
                Release when finished
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const TranscriberTranscript = ({
  transcript,
  error,
  isPartial,
}: {
  transcript: string
  error: string
  isPartial?: boolean
}) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 relative w-full duration-700">
      <ScrollArea className="max-h-[450px] w-full">
        <div
          className={cn(
            "text-foreground/90 px-12 py-8 text-center text-xl leading-relaxed font-light",
            error && "text-red-500",
            isPartial && "text-foreground/60"
          )}
        >
          <Streamdown>{transcript}</Streamdown>
        </div>
      </ScrollArea>
      {transcript && !error && !isPartial && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 h-8 w-8 opacity-0 transition-opacity hover:opacity-60"
          onClick={() => {
            navigator.clipboard.writeText(transcript)
          }}
          aria-label="Copy transcript"
        >
          <Copy className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

const AUDIO_CONSTRAINTS: MediaStreamConstraints = {
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
    channelCount: 1,
  },
}
