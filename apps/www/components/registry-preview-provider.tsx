"use client"

import type { ReactNode } from "react"
import { ConversationProvider } from "@elevenlabs/react"

export function RegistryPreviewProvider({ children }: { children: ReactNode }) {
  return <ConversationProvider>{children}</ConversationProvider>
}
