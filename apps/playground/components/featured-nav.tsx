"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@elevenlabs/ui/components/scroll-area";
import { CategoryIcon } from "@/components/category-icon";

const categories = [
  {
    id: "agents",
    name: "Agents",
    href: "/showcase/agents",
    iconSrc: "/icons/agents.svg",
    hidden: false,
  },
  {
    id: "music",
    name: "Music",
    href: "/showcase/music",
    iconSrc: "/icons/music.svg",
    hidden: false,
  },
  {
    id: "text-to-speech",
    name: "Text to Speech",
    href: "/showcase/text-to-speech",
    iconSrc: "/icons/text-to-speech.svg",
    hidden: false,
  },
  {
    id: "voices",
    name: "Voices",
    href: "/showcase/voices",
    iconSrc: "/icons/voices.svg",
    hidden: false,
  },
  {
    id: "speech-to-text",
    name: "Speech to Text",
    href: "/showcase/speech-to-text",
    iconSrc: "/icons/speech-to-text.svg",
    hidden: false,
  },
];

export function FeaturedNav({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const pathname = usePathname();

  return (
    <div
      className={cn("flex items-center justify-center", className)}
      {...props}
    >
      <ScrollArea className="w-full max-w-[96%] md:max-w-[800px] lg:max-w-none">
        <div className="flex h-auto min-w-max gap-1 rounded-none bg-transparent p-0 sm:gap-2 md:w-full md:flex-wrap md:justify-center lg:justify-center">
          <ExampleLink
            example={{
              id: "featured",
              name: "Featured",
              href: "/",
              iconSrc: "",
              hidden: false,
            }}
            isActive={pathname === "/"}
          />
          {categories.map((example) => (
            <ExampleLink
              key={example.href}
              example={example}
              isActive={pathname?.startsWith(example.href) ?? false}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  );
}

function ExampleLink({
  example,
  isActive,
}: {
  example: (typeof categories)[number];
  isActive: boolean;
}) {
  if (example.hidden) {
    return null;
  }

  return (
    <Link
      href={example.href}
      key={example.href}
      className={cn(
        "inline-flex items-center justify-center rounded-full px-3 py-1.5 text-sm whitespace-nowrap transition-all duration-200",
        "focus-visible:ring-ring focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        "text-muted-foreground hover:text-foreground",
        isActive && "bg-secondary text-foreground",
        "gap-2"
      )}
      data-active={isActive}
    >
      {example.id === "featured" ? (
        <Sparkles className="h-4 w-4" />
      ) : example.iconSrc ? (
        <CategoryIcon src={example.iconSrc} size="sm" />
      ) : null}
      {example.name}
    </Link>
  );
}
