"use client"

import Link from "next/link"

import { cn } from "@/lib/utils"

interface CategoryPillProps {
  children: React.ReactNode
  iconSrc?: string
  className?: string
  href?: string
  asLink?: boolean
}

export function CategoryPill({
  children,
  iconSrc,
  className,
  href,
  asLink = false,
}: CategoryPillProps) {
  const content = (
    <>
      {iconSrc && (
        <span
          className="inline-block h-4 w-4 bg-current"
          style={{
            WebkitMaskImage: `url(${iconSrc})`,
            maskImage: `url(${iconSrc})`,
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskPosition: "center",
            WebkitMaskSize: "contain",
            maskSize: "contain",
          }}
        />
      )}
      {children}
    </>
  )

  const classes = cn(
    "inline-flex items-center justify-center rounded-full px-3 py-1.5 text-sm whitespace-nowrap transition-all duration-200",
    "text-muted-foreground",
    "bg-secondary/50",
    "gap-2",
    asLink && "hover:bg-secondary hover:text-foreground",
    className
  )

  if (asLink && href) {
    return (
      <Link href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {content}
      </Link>
    )
  }

  return <span className={classes}>{content}</span>
}
