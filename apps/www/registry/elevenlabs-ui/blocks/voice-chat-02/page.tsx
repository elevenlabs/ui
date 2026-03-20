"use client"

import { useCallback, useState } from "react"
import {
  ConversationProvider,
  useConversationControls,
  useConversationStatus,
} from "@elevenlabs/react"
import { AnimatePresence, motion } from "framer-motion"
import { Loader2Icon, PhoneIcon, PhoneOffIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/elevenlabs-ui/ui/button"
import { Card } from "@/registry/elevenlabs-ui/ui/card"
import { Orb } from "@/registry/elevenlabs-ui/ui/orb"
import { ShimmeringText } from "@/registry/elevenlabs-ui/ui/shimmering-text"

const DEFAULT_AGENT = {
  agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID!,
  name: "Customer Support",
  description: "Tap to start voice chat",
}

export default function Page() {
  return (
    <ConversationProvider
      onConnect={() => console.log("Connected")}
      onDisconnect={() => console.log("Disconnected")}
      onMessage={(message) => console.log("Message:", message)}
      onError={(error) => console.error("Error:", error)}
    >
      <VoiceChat />
    </ConversationProvider>
  )
}

export function VoiceChat() {
  const { status } = useConversationStatus()
  const { startSession, endSession, getInputVolume, getOutputVolume } =
    useConversationControls()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const startConversation = useCallback(async () => {
    try {
      setErrorMessage(null)
      await navigator.mediaDevices.getUserMedia({ audio: true })
      startSession({
        agentId: DEFAULT_AGENT.agentId,
        connectionType: "webrtc",
      })
    } catch (error) {
      console.error("Error starting conversation:", error)
      if (error instanceof DOMException && error.name === "NotAllowedError") {
        setErrorMessage("Please enable microphone permissions in your browser.")
      }
    }
  }, [startSession])

  const handleCall = useCallback(() => {
    if (status === "disconnected" || status === "error") {
      startConversation()
    } else if (status === "connected") {
      endSession()
    }
  }, [status, endSession, startConversation])

  const isCallActive = status === "connected"
  const isTransitioning = status === "connecting"

  const scaledInputVolume = useCallback(() => {
    try {
      const rawValue = getInputVolume() ?? 0
      return Math.min(1.0, Math.pow(rawValue, 0.5) * 2.5)
    } catch {
      return 0
    }
  }, [getInputVolume])

  const scaledOutputVolume = useCallback(() => {
    try {
      const rawValue = getOutputVolume() ?? 0
      return Math.min(1.0, Math.pow(rawValue, 0.5) * 2.5)
    } catch {
      return 0
    }
  }, [getOutputVolume])

  return (
    <Card className="flex h-[400px] w-full flex-col items-center justify-center overflow-hidden p-6">
      <div className="flex flex-col items-center gap-6">
        <div className="relative size-32">
          <div className="bg-muted relative h-full w-full rounded-full p-1 shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]">
            <div className="bg-background h-full w-full overflow-hidden rounded-full shadow-[inset_0_0_12px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_0_12px_rgba(0,0,0,0.3)]">
              <Orb
                className="h-full w-full"
                volumeMode="manual"
                getInputVolume={scaledInputVolume}
                getOutputVolume={scaledOutputVolume}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <h2 className="text-xl font-semibold">{DEFAULT_AGENT.name}</h2>
          <AnimatePresence mode="wait">
            {errorMessage ? (
              <motion.p
                key="error"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="text-destructive text-center text-sm"
              >
                {errorMessage}
              </motion.p>
            ) : status === "disconnected" || status === "error" ? (
              <motion.p
                key="disconnected"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="text-muted-foreground text-sm"
              >
                {DEFAULT_AGENT.description}
              </motion.p>
            ) : (
              <motion.div
                key="status"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex items-center gap-2"
              >
                <div
                  className={cn(
                    "h-2 w-2 rounded-full transition-all duration-300",
                    status === "connected" && "bg-green-500",
                    isTransitioning && "bg-primary/60 animate-pulse"
                  )}
                />
                <span className="text-sm capitalize">
                  {isTransitioning ? (
                    <ShimmeringText text={status} />
                  ) : (
                    <span className="text-green-600">Connected</span>
                  )}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Button
          onClick={handleCall}
          disabled={isTransitioning}
          size="icon"
          variant={isCallActive ? "secondary" : "default"}
          className="h-12 w-12 rounded-full"
        >
          <AnimatePresence mode="wait">
            {isTransitioning ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, rotate: 0 }}
                animate={{ opacity: 1, rotate: 360 }}
                exit={{ opacity: 0 }}
                transition={{
                  rotate: { duration: 1, repeat: Infinity, ease: "linear" },
                }}
              >
                <Loader2Icon className="h-5 w-5" />
              </motion.div>
            ) : isCallActive ? (
              <motion.div
                key="end"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
              >
                <PhoneOffIcon className="h-5 w-5" />
              </motion.div>
            ) : (
              <motion.div
                key="start"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
              >
                <PhoneIcon className="h-5 w-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </div>
    </Card>
  )
}
