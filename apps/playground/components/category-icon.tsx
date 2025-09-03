import Image from "next/image"

import { cn } from "@/lib/utils"

interface CategoryIconProps {
  src: string
  alt?: string
  className?: string
  size?: "sm" | "md" | "lg"
}

export function CategoryIcon({
  src,
  alt = "",
  className,
  size = "md",
}: CategoryIconProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-8 w-8",
  }

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center",
        sizeClasses[size],
        className
      )}
      aria-hidden="true"
    >
      <Image
        src={src}
        alt={alt}
        width={32}
        height={32}
        className="h-full w-full dark:brightness-0 dark:invert"
      />
    </span>
  )
}
