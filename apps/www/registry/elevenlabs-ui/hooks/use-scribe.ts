"use client"

import { useCallback, useRef, useState } from "react"

export enum AudioFormat {
  PCM_8000 = "pcm_8000",
  PCM_16000 = "pcm_16000",
  PCM_22050 = "pcm_22050",
  PCM_24000 = "pcm_24000",
  PCM_44100 = "pcm_44100",
  PCM_48000 = "pcm_48000",
  ULAW_8000 = "ulaw_8000",
}

export enum CommitStrategy {
  MANUAL = "manual",
  VAD = "vad",
}

export interface CommittedTranscript {
  text: string
}

export interface UseScribeOptions {
  modelId?: string
  baseUri?: string
  commitStrategy?: CommitStrategy
  vadSilenceThresholdSecs?: number
  vadThreshold?: number
  minSpeechDurationMs?: number
  minSilenceDurationMs?: number
  languageCode?: string
  audioFormat?: AudioFormat
  sampleRate?: number
  microphone?: {
    deviceId?: string
    echoCancellation?: boolean
    noiseSuppression?: boolean
    autoGainControl?: boolean
    channelCount?: number
  }
  onPartialTranscript?: (data: { text: string }) => void
  onCommittedTranscript?: (data: { text: string }) => void
  onError?: (error: Error | Event) => void
  onAuthError?: (data: { error: string }) => void
  onQuotaExceededError?: (data: { error: string }) => void
}

export interface UseScribeReturn {
  status: "disconnected" | "connecting" | "connected"
  isConnected: boolean
  error: string | null
  partialTranscript: string
  committedTranscripts: CommittedTranscript[]
  connect: (options: { token: string }) => Promise<void>
  disconnect: () => void
  clearTranscripts: () => void
}

interface ScribeConnection {
  close: () => void
}

const AUDIO_FORMAT_SAMPLE_RATES: Record<AudioFormat, number> = {
  [AudioFormat.PCM_8000]: 8000,
  [AudioFormat.PCM_16000]: 16000,
  [AudioFormat.PCM_22050]: 22050,
  [AudioFormat.PCM_24000]: 24000,
  [AudioFormat.PCM_44100]: 44100,
  [AudioFormat.PCM_48000]: 48000,
  [AudioFormat.ULAW_8000]: 8000,
}

/**
 * A hook for real-time speech-to-text transcription using ElevenLabs Scribe.
 *
 * This hook wraps the ScribeRealtime class from @elevenlabs/react and provides
 * a React-friendly interface for managing transcription state.
 */
export function useScribe(options: UseScribeOptions): UseScribeReturn {
  const {
    modelId = "scribe_v2_realtime",
    baseUri,
    commitStrategy = CommitStrategy.VAD,
    vadSilenceThresholdSecs,
    vadThreshold,
    minSpeechDurationMs,
    minSilenceDurationMs,
    languageCode,
    audioFormat,
    sampleRate,
    microphone,
    onPartialTranscript,
    onCommittedTranscript,
    onError,
    onAuthError,
    onQuotaExceededError,
  } = options

  const [status, setStatus] = useState<
    "disconnected" | "connecting" | "connected"
  >("disconnected")
  const [error, setError] = useState<string | null>(null)
  const [partialTranscript, setPartialTranscript] = useState("")
  const [committedTranscripts, setCommittedTranscripts] = useState<
    CommittedTranscript[]
  >([])

  const connectionRef = useRef<ScribeConnection | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const workletNodeRef = useRef<AudioWorkletNode | null>(null)

  const clearTranscripts = useCallback(() => {
    setPartialTranscript("")
    setCommittedTranscripts([])
    setError(null)
  }, [])

  const disconnect = useCallback(() => {
    // Stop audio worklet
    if (workletNodeRef.current) {
      workletNodeRef.current.disconnect()
      workletNodeRef.current = null
    }

    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {})
      audioContextRef.current = null
    }

    // Stop media stream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop())
      mediaStreamRef.current = null
    }

    // Close WebSocket connection
    if (connectionRef.current) {
      connectionRef.current.close()
      connectionRef.current = null
    }

    setStatus("disconnected")
  }, [])

  const connect = useCallback(
    async ({ token }: { token: string }) => {
      // Disconnect any existing connection
      disconnect()

      setStatus("connecting")
      setError(null)

      try {
        // Build WebSocket URL
        const base = baseUri || "wss://api.elevenlabs.io"
        const params = new URLSearchParams()
        params.set("model_id", modelId)
        params.set("token", token)

        if (commitStrategy) {
          params.set("commit_strategy", commitStrategy)
        }
        if (vadSilenceThresholdSecs !== undefined) {
          params.set(
            "vad_silence_threshold_secs",
            vadSilenceThresholdSecs.toString()
          )
        }
        if (vadThreshold !== undefined) {
          params.set("vad_threshold", vadThreshold.toString())
        }
        if (minSpeechDurationMs !== undefined) {
          params.set("min_speech_duration_ms", minSpeechDurationMs.toString())
        }
        if (minSilenceDurationMs !== undefined) {
          params.set("min_silence_duration_ms", minSilenceDurationMs.toString())
        }
        if (languageCode) {
          params.set("language_code", languageCode)
        }

        const wsUrl = `${base}/v1/speech-to-text/realtime-beta?${params.toString()}`

        // Create WebSocket connection
        const ws = new WebSocket(wsUrl)

        // Set up connection promise
        const connectionPromise = new Promise<void>((resolve, reject) => {
          let isSettled = false
          const timeout = setTimeout(() => {
            if (!isSettled) {
              isSettled = true
              reject(new Error("Connection timeout"))
            }
          }, 30000)
          const resolveOnce = () => {
            if (isSettled) return
            isSettled = true
            clearTimeout(timeout)
            resolve()
          }
          const rejectOnce = (error: Error) => {
            if (isSettled) return
            isSettled = true
            clearTimeout(timeout)
            reject(error)
          }

          ws.onmessage = (event) => {
            try {
              const data = JSON.parse(event.data)
              const messageType = data.type || data.message_type

              switch (messageType) {
                case "session_started":
                  setStatus("connected")
                  resolveOnce()
                  break

                case "auth_error":
                  setError(data.error || "Authentication failed")
                  onAuthError?.({
                    error: data.error || "Authentication failed",
                  })
                  rejectOnce(new Error(data.error || "Authentication failed"))
                  break

                case "quota_exceeded":
                  setError(data.error || "Quota exceeded")
                  onQuotaExceededError?.({
                    error: data.error || "Quota exceeded",
                  })
                  rejectOnce(new Error(data.error || "Quota exceeded"))
                  break

                case "partial_transcript":
                  setPartialTranscript(data.text || "")
                  onPartialTranscript?.({ text: data.text || "" })
                  break

                case "final_transcript":
                case "final_transcript_with_timestamps":
                  setCommittedTranscripts((prev) => [
                    ...prev,
                    { text: data.text || "" },
                  ])
                  setPartialTranscript("")
                  onCommittedTranscript?.({ text: data.text || "" })
                  break

                case "error":
                  {
                    const errorMessage = data.error || "Unknown error"
                    const error = new Error(errorMessage)
                    setError(errorMessage)
                    onError?.(error)
                    rejectOnce(error)
                  }
                  break
              }
            } catch {
              // Ignore JSON parse errors
            }
          }

          ws.onerror = (event) => {
            setError("WebSocket error")
            onError?.(event)
            rejectOnce(new Error("WebSocket error"))
          }

          ws.onclose = () => {
            setStatus("disconnected")
            if (!isSettled) {
              rejectOnce(new Error("WebSocket closed before session started"))
            }
          }
        })

        connectionRef.current = { close: () => ws.close() }

        // Wait for authentication
        await connectionPromise

        // Get microphone stream
        const micConfig = microphone || {}
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            deviceId: micConfig.deviceId,
            echoCancellation: micConfig.echoCancellation ?? true,
            noiseSuppression: micConfig.noiseSuppression ?? true,
            autoGainControl: micConfig.autoGainControl,
            channelCount: micConfig.channelCount || 1,
          },
        })
        mediaStreamRef.current = stream

        // Set up audio processing
        const targetSampleRate =
          sampleRate ||
          (audioFormat ? AUDIO_FORMAT_SAMPLE_RATES[audioFormat] : undefined) ||
          16000

        const audioContext = new AudioContext({
          sampleRate: targetSampleRate,
        })
        audioContextRef.current = audioContext

        const source = audioContext.createMediaStreamSource(stream)

        // Create script processor for audio data
        const bufferSize = 4096
        const processor = audioContext.createScriptProcessor(bufferSize, 1, 1)

        processor.onaudioprocess = (e) => {
          if (ws.readyState !== WebSocket.OPEN) return

          const inputData = e.inputBuffer.getChannelData(0)

          // Convert Float32 to Int16
          const int16Data = new Int16Array(inputData.length)
          for (let i = 0; i < inputData.length; i++) {
            const s = Math.max(-1, Math.min(1, inputData[i]))
            int16Data[i] = s < 0 ? s * 0x8000 : s * 0x7fff
          }

          // Send audio data as base64
          const uint8Array = new Uint8Array(int16Data.buffer)
          const base64 = btoa(String.fromCharCode(...uint8Array))

          ws.send(
            JSON.stringify({
              message_type: "input_audio_chunk",
              audio_base_64: base64,
              sample_rate: audioContext.sampleRate,
              commit: false,
            })
          )
        }

        source.connect(processor)
        processor.connect(audioContext.destination)
      } catch (err) {
        setStatus("disconnected")
        const message = err instanceof Error ? err.message : "Connection failed"
        setError(message)
        onError?.(err instanceof Error ? err : new Error(message))
        throw err
      }
    },
    [
      baseUri,
      modelId,
      commitStrategy,
      vadSilenceThresholdSecs,
      vadThreshold,
      minSpeechDurationMs,
      minSilenceDurationMs,
      languageCode,
      audioFormat,
      sampleRate,
      microphone,
      onPartialTranscript,
      onCommittedTranscript,
      onError,
      onAuthError,
      onQuotaExceededError,
      disconnect,
    ]
  )

  return {
    status,
    isConnected: status === "connected",
    error,
    partialTranscript,
    committedTranscripts,
    connect,
    disconnect,
    clearTranscripts,
  }
}
