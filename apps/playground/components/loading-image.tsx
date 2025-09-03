"use client"

import * as React from "react"
import { useState } from "react"
import Image from "next/image"
import { Image as ImageIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface LoadingImageProps {
  src: string
  alt: string
  className?: string
  containerClassName?: string
  priority?: boolean
  quality?: number
  sizes?: string
  aspectRatio?: string
}

export function LoadingImage({
  src,
  alt,
  className,
  containerClassName,
  priority = false,
  quality = 75,
  sizes = "(max-width: 768px) 100vw, 768px",
  aspectRatio = "16/9",
}: LoadingImageProps) {
  const [imageLoaded, setImageLoaded] = useState(priority)
  const [hasError, setHasError] = useState(false)

  // Create shimmer placeholder
  const shimmer = (w: number, h: number) => `
    <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#e5e7eb" offset="20%" />
          <stop stop-color="#f3f4f6" offset="50%" />
          <stop stop-color="#e5e7eb" offset="70%" />
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="#e5e7eb" />
      <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
    </svg>`

  const toBase64 = (str: string) =>
    typeof window === "undefined"
      ? Buffer.from(str).toString("base64")
      : btoa(str)

  const dataUrl = `data:image/svg+xml;base64,${toBase64(shimmer(1920, 1080))}`

  return (
    <div
      className={cn(
        "bg-muted relative w-full overflow-hidden rounded-xl",
        containerClassName
      )}
      style={{ aspectRatio }}
    >
      {!hasError && (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className={cn(
            "object-cover transition-all duration-300 ease-out",
            imageLoaded ? "opacity-100" : "opacity-0",
            className
          )}
          placeholder="blur"
          blurDataURL={dataUrl}
          priority={priority}
          quality={quality}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setHasError(true)
          }}
        />
      )}
      {hasError && (
        <div className="bg-muted text-muted-foreground flex h-full w-full flex-col items-center justify-center gap-2">
          <ImageIcon className="h-8 w-8 opacity-50" />
        </div>
      )}
    </div>
  )
}
