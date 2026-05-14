"use client"

import type { ReactNode } from "react"
import { ConversationProvider } from "@elevenlabs/react"

export function RegistryViewProvider({ children }: { children: ReactNode }) {
  return <ConversationProvider>{children}</ConversationProvider>
}
