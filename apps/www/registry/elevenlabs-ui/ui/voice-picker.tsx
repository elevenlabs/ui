"use client"

import * as React from "react"
import type { ElevenLabs } from "@elevenlabs/elevenlabs-js"
import { Check, ChevronsUpDown, Pause, Play } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  AudioPlayerProvider,
  useAudioPlayer,
} from "@/registry/elevenlabs-ui/ui/audio-player"
import { Button } from "@/registry/elevenlabs-ui/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/registry/elevenlabs-ui/ui/command"
import { Orb } from "@/registry/elevenlabs-ui/ui/orb"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/elevenlabs-ui/ui/popover"

/**
 * Props for the VoicePicker component - a voice selection dropdown with audio previews.
 * 
 * Displays a list of ElevenLabs voices with interactive orb previews and
 * audio playback capabilities for voice selection.
 * 
 * @example
 * ```tsx
 * <VoicePicker
 *   voices={availableVoices}
 *   value={selectedVoiceId}
 *   onValueChange={(voiceId) => setSelectedVoice(voiceId)}
 *   placeholder="Select a voice..."
 * />
 * ```
 */
interface VoicePickerProps {
  /**
   * Array of ElevenLabs voice objects to display in the picker.
   * Each voice should have voiceId, name, and previewUrl properties.
   */
  voices: ElevenLabs.Voice[]

  /**
   * Currently selected voice ID.
   * Should match the voiceId of one of the voices in the voices array.
   */
  value?: string

  /**
   * Callback fired when a voice is selected.
   * @param value - The voiceId of the selected voice
   * 
   * @example
   * ```tsx
   * onValueChange={(voiceId) => {
   *   setSelectedVoice(voiceId);
   *   console.log(`Selected voice: ${voiceId}`);
   * }}
   * ```
   */
  onValueChange?: (value: string) => void

  /**
   * Placeholder text shown when no voice is selected.
   * @default "Select a voice..."
   */
  placeholder?: string

  /**
   * Additional CSS classes for the picker container.
   */
  className?: string

  /**
   * Whether the picker dropdown is open (controlled mode).
   * If not provided, the picker manages its own open state.
   */
  open?: boolean

  /**
   * Callback fired when the picker open state changes.
   * @param open - Whether the picker is now open
   * 
   * @example
   * ```tsx
   * onOpenChange={(open) => {
   *   console.log(`Picker ${open ? 'opened' : 'closed'}`);
   * }}
   * ```
   */
  onOpenChange?: (open: boolean) => void
}

function VoicePicker({
  voices,
  value,
  onValueChange,
  placeholder = "Select a voice...",
  className,
  open,
  onOpenChange,
}: VoicePickerProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isControlled = open !== undefined
  const isOpen = isControlled ? open : internalOpen
  const setIsOpen = isControlled ? onOpenChange : setInternalOpen

  const selectedVoice = voices.find((v) => v.voiceId === value)

  return (
    <AudioPlayerProvider>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            className={cn("w-full justify-between", className)}
          >
            {selectedVoice ? (
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="relative size-6 shrink-0 overflow-visible">
                  <Orb agentState="thinking" className="absolute inset-0" />
                </div>
                <span className="truncate">{selectedVoice.name}</span>
              </div>
            ) : (
              placeholder
            )}
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command>
            <CommandInput placeholder="Search voices..." />
            <CommandList>
              <CommandEmpty>No voice found.</CommandEmpty>
              <CommandGroup>
                {voices.map((voice) => (
                  <VoicePickerItem
                    key={voice.voiceId}
                    voice={voice}
                    isSelected={value === voice.voiceId}
                    onSelect={() => {
                      onValueChange?.(voice.voiceId!)
                    }}
                  />
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </AudioPlayerProvider>
  )
}

/**
 * Props for the VoicePickerItem component - an individual voice option in the picker.
 * 
 * Displays voice information with an interactive orb preview and audio playback.
 * 
 * @example
 * ```tsx
 * <VoicePickerItem
 *   voice={voiceObject}
 *   isSelected={selectedVoiceId === voiceObject.voiceId}
 *   onSelect={() => setSelectedVoice(voiceObject.voiceId)}
 * />
 * ```
 */
interface VoicePickerItemProps {
  /**
   * ElevenLabs voice object containing voice metadata.
   * Should include voiceId, name, previewUrl, and optional labels.
   */
  voice: ElevenLabs.Voice

  /**
   * Whether this voice item is currently selected.
   */
  isSelected: boolean

  /**
   * Callback fired when this voice item is selected.
   * Typically updates the parent component's selected voice state.
   */
  onSelect: () => void
}

function VoicePickerItem({
  voice,
  isSelected,
  onSelect,
}: VoicePickerItemProps) {
  const [isHovered, setIsHovered] = React.useState(false)
  const player = useAudioPlayer()

  const preview = voice.previewUrl
  const audioItem = React.useMemo(
    () => (preview ? { id: voice.voiceId!, src: preview, data: voice } : null),
    [preview, voice]
  )

  const isPlaying =
    audioItem && player.isItemActive(audioItem.id) && player.isPlaying

  const handlePreview = React.useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      if (!audioItem) return

      if (isPlaying) {
        player.pause()
      } else {
        player.play(audioItem)
      }
    },
    [audioItem, isPlaying, player]
  )

  return (
    <CommandItem
      value={voice.voiceId!}
      onSelect={onSelect}
      className="flex items-center gap-3"
    >
      <div
        className="relative z-10 size-8 shrink-0 cursor-pointer overflow-visible"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handlePreview}
      >
        <Orb
          agentState={isPlaying ? "talking" : undefined}
          className="pointer-events-none absolute inset-0"
        />
        {preview && isHovered && (
          <div className="pointer-events-none absolute inset-0 flex size-8 shrink-0 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition-opacity hover:bg-black/50">
            {isPlaying ? (
              <Pause className="size-3 text-white" />
            ) : (
              <Play className="size-3 text-white" />
            )}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-0.5">
        <span className="font-medium">{voice.name}</span>
        {voice.labels && (
          <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
            {voice.labels.accent && <span>{voice.labels.accent}</span>}
            {voice.labels.gender && <span>•</span>}
            {voice.labels.gender && (
              <span className="capitalize">{voice.labels.gender}</span>
            )}
            {voice.labels.age && <span>•</span>}
            {voice.labels.age && (
              <span className="capitalize">{voice.labels.age}</span>
            )}
          </div>
        )}
      </div>

      <Check
        className={cn(
          "ml-auto size-4 shrink-0",
          isSelected ? "opacity-100" : "opacity-0"
        )}
      />
    </CommandItem>
  )
}

export { VoicePicker, VoicePickerItem }
