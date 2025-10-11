import type { ComponentProps, HTMLAttributes } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/elevenlabs-ui/ui/avatar"

/**
 * Props for the Message component - a chat message container with sender alignment.
 * 
 * Provides the layout structure for chat messages with automatic alignment
 * based on the sender type (user messages on right, assistant on left).
 * 
 * @example
 * ```tsx
 * <Message from="user">
 *   <MessageContent variant="contained">
 *     Hello, how can I help you today?
 *   </MessageContent>
 *   <MessageAvatar src="/user-avatar.jpg" name="John Doe" />
 * </Message>
 * ```
 */
export type MessageProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * Sender of the message, determines alignment and styling.
   * - "user": Message aligned to the right (user's side)
   * - "assistant": Message aligned to the left (assistant's side)
   */
  from: "user" | "assistant"
}

/**
 * A chat message container that handles sender-based alignment and styling.
 * 
 * Automatically aligns messages based on the sender type and applies
 * appropriate CSS classes for styling. Use with MessageContent and MessageAvatar.
 * 
 * @example
 * ```tsx
 * <Message from="user">
 *   <MessageContent variant="contained">
 *     Hello, how can I help you today?
 *   </MessageContent>
 *   <MessageAvatar src="/user-avatar.jpg" name="John Doe" />
 * </Message>
 * ```
 */
export const Message = ({ className, from, ...props }: MessageProps) => (
  <div
    className={cn(
      "group flex w-full items-end justify-end gap-2 py-4",
      from === "user" ? "is-user" : "is-assistant flex-row-reverse justify-end",
      className
    )}
    {...props}
  />
)

const messageContentVariants = cva(
  "is-user:dark flex flex-col gap-2 overflow-hidden rounded-lg text-sm",
  {
    variants: {
      variant: {
        contained: [
          "max-w-[80%] px-4 py-3",
          "group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground",
          "group-[.is-assistant]:bg-secondary group-[.is-assistant]:text-foreground",
        ],
        flat: [
          "group-[.is-user]:max-w-[80%] group-[.is-user]:bg-secondary group-[.is-user]:px-4 group-[.is-user]:py-3 group-[.is-user]:text-foreground",
          "group-[.is-assistant]:text-foreground",
        ],
      },
    },
    defaultVariants: {
      variant: "contained",
    },
  }
)

/**
 * Props for the MessageContent component - the content area of a chat message.
 * 
 * Provides styling variants for message content with different visual treatments.
 * 
 * @example
 * ```tsx
 * <MessageContent variant="contained">
 *   <p>Hello, how can I help you today?</p>
 * </MessageContent>
 * 
 * <MessageContent variant="flat">
 *   <p>This is a flat message style</p>
 * </MessageContent>
 * ```
 */
export type MessageContentProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof messageContentVariants>

/**
 * The content area of a chat message with styling variants.
 * 
 * Provides different visual treatments for message content:
 * - "contained": Messages in styled containers with backgrounds
 * - "flat": Messages with minimal styling for a cleaner look
 * 
 * @example
 * ```tsx
 * <MessageContent variant="contained">
 *   <p>Hello, how can I help you today?</p>
 * </MessageContent>
 * 
 * <MessageContent variant="flat">
 *   <p>This is a flat message style</p>
 * </MessageContent>
 * ```
 */
export const MessageContent = ({
  children,
  className,
  variant,
  ...props
}: MessageContentProps) => (
  <div
    className={cn(messageContentVariants({ variant, className }))}
    {...props}
  >
    {children}
  </div>
)

/**
 * Props for the MessageAvatar component - an avatar for chat messages.
 * 
 * Displays a user or assistant avatar with fallback initials.
 * 
 * @example
 * ```tsx
 * <MessageAvatar
 *   src="/user-avatar.jpg"
 *   name="John Doe"
 *   className="ring-2 ring-blue-500"
 * />
 * ```
 */
export type MessageAvatarProps = ComponentProps<typeof Avatar> & {
  /**
   * URL or path to the avatar image.
   * Should be a valid image URL or path to an image file.
   */
  src: string

  /**
   * Display name for generating fallback initials.
   * If provided, uses the first 2 characters as fallback text.
   * If not provided, defaults to "ME".
   * @example "John Doe" -> "JO"
   */
  name?: string
}

/**
 * An avatar component for chat messages with fallback initials.
 * 
 * Displays a user or assistant avatar image with automatic fallback
 * to initials when the image fails to load.
 * 
 * @example
 * ```tsx
 * <MessageAvatar
 *   src="/user-avatar.jpg"
 *   name="John Doe"
 *   className="ring-2 ring-blue-500"
 * />
 * ```
 */
export const MessageAvatar = ({
  src,
  name,
  className,
  ...props
}: MessageAvatarProps) => (
  <Avatar className={cn("ring-border size-8 ring-1", className)} {...props}>
    <AvatarImage alt="" className="mt-0 mb-0" src={src} />
    <AvatarFallback>{name?.slice(0, 2) || "ME"}</AvatarFallback>
  </Avatar>
)
