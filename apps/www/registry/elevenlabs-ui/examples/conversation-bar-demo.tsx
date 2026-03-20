"use client"

import { ConversationProvider } from "@elevenlabs/react"

import { ConversationBar } from "@/registry/elevenlabs-ui/ui/conversation-bar"

const DEFAULT_AGENT = {
  agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID!,
}

export default function ConversationBarDemo() {
  return (
    <ConversationProvider
      onConnect={() => console.log("Connected")}
      onDisconnect={() => console.log("Disconnected")}
      onMessage={(message) => console.log("Message:", message)}
      onError={(error) => console.error("Error:", error)}
    >
      <div className="flex min-h-[200px] w-full items-center justify-center">
        <div className="w-full max-w-md">
          <ConversationBar agentId={DEFAULT_AGENT.agentId} />
        </div>
      </div>
    </ConversationProvider>
  )
}
