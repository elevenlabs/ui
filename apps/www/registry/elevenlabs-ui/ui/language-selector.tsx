"use client"

import * as React from "react"
import { Check, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/elevenlabs-ui/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/registry/elevenlabs-ui/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/elevenlabs-ui/ui/popover"

interface Language {
  code: string
  name: string
  flag: string
}

const LANGUAGES: Language[] = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "id", name: "Indonesian", flag: "🇮🇩" },
  { code: "nl", name: "Dutch", flag: "🇳🇱" },
  { code: "tr", name: "Turkish", flag: "🇹🇷" },
  { code: "fil", name: "Filipino", flag: "🇵🇭" },
  { code: "pl", name: "Polish", flag: "🇵🇱" },
  { code: "sv", name: "Swedish", flag: "🇸🇪" },
  { code: "bg", name: "Bulgarian", flag: "🇧🇬" },
  { code: "ro", name: "Romanian", flag: "🇷🇴" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "cs", name: "Czech", flag: "🇨🇿" },
  { code: "el", name: "Greek", flag: "🇬🇷" },
  { code: "fi", name: "Finnish", flag: "🇫🇮" },
  { code: "hr", name: "Croatian", flag: "🇭🇷" },
  { code: "ms", name: "Malay", flag: "🇲🇾" },
  { code: "sk", name: "Slovak", flag: "🇸🇰" },
  { code: "da", name: "Danish", flag: "🇩🇰" },
  { code: "ta", name: "Tamil", flag: "🇮🇳" },
  { code: "uk", name: "Ukrainian", flag: "🇺🇦" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "hu", name: "Hungarian", flag: "🇭🇺" },
  { code: "no", name: "Norwegian", flag: "🇳🇴" },
  { code: "vi", name: "Vietnamese", flag: "🇻🇳" },
]

interface LanguageSelectorProps {
  value?: string
  onValueChange?: (code: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

function LanguageSelector({
  value,
  onValueChange,
  placeholder = "Select language...",
  className,
  disabled = false,
}: LanguageSelectorProps) {
  const [open, setOpen] = React.useState(false)

  const selectedLanguage = LANGUAGES.find((lang) => lang.code === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn("w-full justify-between", className)}
        >
          {selectedLanguage ? (
            <span className="flex items-center gap-2">
              <span>{selectedLanguage.flag}</span>
              <span>{selectedLanguage.name}</span>
            </span>
          ) : (
            placeholder
          )}
          <ChevronDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder="Search languages..." />
          <CommandList>
            <CommandEmpty>No language found.</CommandEmpty>
            <CommandGroup>
              {LANGUAGES.map((language) => (
                <CommandItem
                  key={language.code}
                  value={language.code}
                  keywords={[language.name]}
                  onSelect={() => {
                    onValueChange?.(language.code)
                    setOpen(false)
                  }}
                  className="flex items-center gap-2"
                >
                  <span>{language.flag}</span>
                  <span className="flex-1">{language.name}</span>
                  <Check
                    className={cn(
                      "ml-auto size-4 shrink-0",
                      value === language.code ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { LanguageSelector, LANGUAGES }
export type { Language, LanguageSelectorProps }
