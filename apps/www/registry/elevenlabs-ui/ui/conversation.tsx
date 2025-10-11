"use client"

import type { ComponentProps } from "react"
import { useCallback } from "react"
import { ArrowDownIcon } from "lucide-react"
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/elevenlabs-ui/ui/button"

/**
 * Props for the Conversation component - a scrollable chat container with auto-scroll.
 * 
 * Provides a conversation view that automatically scrolls to the bottom when
 * new messages are added, with smooth scrolling behavior.
 * 
 * @example
 * ```tsx
 * <Conversation className="h-96 border rounded-lg">
 *   <ConversationContent>
 *     <Message from="user">Hello!</Message>
 *     <Message from="assistant">Hi there!</Message>
 *   </ConversationContent>
 * </Conversation>
 * ```
 */
export type ConversationProps = ComponentProps<typeof StickToBottom>

/**
 * A scrollable conversation container with automatic scroll-to-bottom behavior.
 * 
 * Wraps chat content and automatically scrolls to show the latest messages
 * when new content is added. Uses smooth scrolling for better UX.
 * 
 * @example
 * ```tsx
 * <Conversation className="h-96 border rounded-lg">
 *   <ConversationContent>
 *     <Message from="user">Hello!</Message>
 *     <Message from="assistant">Hi there!</Message>
 *   </ConversationContent>
 * </Conversation>
 * ```
 */
export const Conversation = ({ className, ...props }: ConversationProps) => (
  <StickToBottom
    className={cn("relative flex-1 overflow-y-auto", className)}
    initial="smooth"
    resize="smooth"
    role="log"
    {...props}
  />
)

/**
 * Props for the ConversationContent component - the content area of a conversation.
 * 
 * Provides the inner content container for conversation messages with padding.
 * 
 * @example
 * ```tsx
 * <ConversationContent className="space-y-4">
 *   <Message from="user">Hello!</Message>
 *   <Message from="assistant">Hi there!</Message>
 * </ConversationContent>
 * ```
 */
export type ConversationContentProps = ComponentProps<
  typeof StickToBottom.Content
>

/**
 * The content area of a conversation with proper spacing.
 * 
 * Wraps the actual conversation messages and provides consistent padding.
 * Should be used inside a Conversation component.
 * 
 * @example
 * ```tsx
 * <ConversationContent className="space-y-4">
 *   <Message from="user">Hello!</Message>
 *   <Message from="assistant">Hi there!</Message>
 * </ConversationContent>
 * ```
 */
export const ConversationContent = ({
  className,
  ...props
}: ConversationContentProps) => (
  <StickToBottom.Content className={cn("p-4", className)} {...props} />
)

/**
 * Props for the ConversationEmptyState component - an empty state for conversations.
 * 
 * Displays a centered empty state when there are no messages in a conversation.
 * Provides customizable title, description, and icon.
 * 
 * @example
 * ```tsx
 * <ConversationEmptyState
 *   title="Start a conversation"
 *   description="Send a message to begin chatting"
 *   icon={<MessageCircle className="h-8 w-8" />}
 * />
 * ```
 */
export type ConversationEmptyStateProps = Omit<
  ComponentProps<"div">,
  "title"
> & {
  /**
   * Title text for the empty state.
   * Can be a string or React node for custom styling.
   * @default "No messages yet"
   */
  title?: React.ReactNode

  /**
   * Description text for the empty state.
   * Can be a string or React node for custom styling.
   * @default "Start a conversation to see messages here"
   */
  description?: React.ReactNode

  /**
   * Icon or visual element to display above the title.
   * Can be any React node (icon component, image, etc.).
   */
  icon?: React.ReactNode
}

/**
 * An empty state component for conversations with no messages.
 * 
 * Displays a centered message with customizable title, description, and icon.
 * Provides a clean empty state when conversations have no content.
 * 
 * @example
 * ```tsx
 * <ConversationEmptyState
 *   title="Start a conversation"
 *   description="Send a message to begin chatting"
 *   icon={<MessageCircle className="h-8 w-8" />}
 * />
 * ```
 */
export const ConversationEmptyState = ({
  className,
  title = "No messages yet",
  description = "Start a conversation to see messages here",
  icon,
  children,
  ...props
}: ConversationEmptyStateProps) => (
  <div
    className={cn(
      "flex size-full flex-col items-center justify-center gap-3 p-8 text-center",
      className
    )}
    {...props}
  >
    {children ?? (
      <>
        {icon && <div className="text-muted-foreground">{icon}</div>}
        <div className="space-y-1">
          <h3 className="text-sm font-medium">{title}</h3>
          {description && (
            <p className="text-muted-foreground text-sm">{description}</p>
          )}
        </div>
      </>
    )}
  </div>
)

/**
 * Props for the ConversationScrollButton component - a scroll-to-bottom button.
 * 
 * Extends Button props with automatic scroll-to-bottom functionality.
 * Only appears when the conversation is not scrolled to the bottom.
 * 
 * @example
 * ```tsx
 * <ConversationScrollButton
 *   variant="outline"
 *   size="icon"
 *   className="fixed bottom-4 right-4"
 * />
 * ```
 */
export type ConversationScrollButtonProps = ComponentProps<typeof Button>

/**
 * A floating button that scrolls the conversation to the bottom.
 * 
 * Automatically appears when the user has scrolled up from the bottom
 * of the conversation and disappears when at the bottom. Must be used
 * within a Conversation component context.
 * 
 * @example
 * ```tsx
 * <ConversationScrollButton
 *   variant="outline"
 *   size="icon"
 *   className="fixed bottom-4 right-4"
 * />
 * ```
 */
export const ConversationScrollButton = ({
  className,
  ...props
}: ConversationScrollButtonProps) => {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext()

  const handleScrollToBottom = useCallback(() => {
    scrollToBottom()
  }, [scrollToBottom])

  return (
    !isAtBottom && (
      <Button
        className={cn(
          "bg-background dark:bg-background absolute bottom-4 left-[50%] translate-x-[-50%] rounded-full shadow-md",
          className
        )}
        onClick={handleScrollToBottom}
        size="icon"
        type="button"
        variant="outline"
        {...props}
      >
        <ArrowDownIcon className="size-4" />
      </Button>
    )
  )
}
