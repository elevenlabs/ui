"use client"

import { memo, type ComponentProps } from "react"
import { Streamdown } from "streamdown"

import { cn } from "@/lib/utils"

/**
 * Props for the Response component - a streaming text display with markdown support.
 * 
 * Renders streaming text content with markdown support and proper typography.
 * Built on top of the Streamdown library for real-time text streaming.
 * 
 * @example
 * ```tsx
 * <Response>
 *   # Welcome to ElevenLabs UI
 *   
 *   This is a **streaming response** with markdown support.
 * </Response>
 * ```
 */
type ResponseProps = ComponentProps<typeof Streamdown>

/**
 * A component for displaying streaming text responses with markdown support.
 * 
 * Renders text content that can be streamed in real-time with proper
 * markdown formatting and typography. Built on the Streamdown library
 * for efficient streaming text rendering.
 * 
 * @example
 * ```tsx
 * <Response>
 *   # Welcome to ElevenLabs UI
 *   
 *   This is a **streaming response** with markdown support.
 *   - Lists are supported
 *   - **Bold text** works
 *   - `Code blocks` are rendered
 * </Response>
 * ```
 */
export const Response = memo(
  ({ className, ...props }: ResponseProps) => (
    <Streamdown
      className={cn(
        "size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        className
      )}
      {...props}
    />
  ),
  (prevProps, nextProps) => prevProps.children === nextProps.children
)

Response.displayName = "Response"
