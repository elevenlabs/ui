"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type ScrollHandler = (event: Event) => void
type ResizeHandler = (entry: ResizeObserverEntry) => void

interface FrameContextValue {
  html: React.RefObject<HTMLElement | null>
  body: React.RefObject<HTMLElement | null>
  width: number
  height: number
  onScroll: (handler: ScrollHandler) => () => void
  onResize: (handler: ResizeHandler) => () => void
  getBoundingClientRect: (el: HTMLElement) => DOMRect
}

// ---------------------------------------------------------------------------
// Default context — delegates to the real browser viewport
// ---------------------------------------------------------------------------

function createLazyRef(
  getElement: () => HTMLElement | null
): React.RefObject<HTMLElement | null> {
  return {
    get current() {
      return getElement()
    },
    set current(_) {},
  } as React.RefObject<HTMLElement | null>
}

const defaultFrameContext: FrameContextValue = {
  html: createLazyRef(() =>
    typeof document !== "undefined" ? document.documentElement : null
  ),
  body: createLazyRef(() =>
    typeof document !== "undefined" ? document.body : null
  ),
  get width() {
    return typeof window !== "undefined" ? window.innerWidth : 0
  },
  get height() {
    return typeof window !== "undefined" ? window.innerHeight : 0
  },
  onScroll(handler: ScrollHandler) {
    if (typeof window === "undefined") return () => {}
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  },
  onResize(handler: ResizeHandler) {
    if (typeof document === "undefined") return () => {}
    const ro = new ResizeObserver((entries) => {
      if (entries[0]) handler(entries[0])
    })
    ro.observe(document.documentElement)
    return () => ro.disconnect()
  },
  getBoundingClientRect: (el: HTMLElement) => el.getBoundingClientRect(),
}

// ---------------------------------------------------------------------------
// Context & hook
// ---------------------------------------------------------------------------

const FrameContext = React.createContext<FrameContextValue>(defaultFrameContext)

function useFrame(): FrameContextValue {
  return React.useContext(FrameContext)
}

// ---------------------------------------------------------------------------
// Frame.Viewport
// ---------------------------------------------------------------------------

interface FrameViewportProps extends React.ComponentProps<"div"> {
  name?: string
}

function FrameViewport({
  children,
  className,
  name,
  style,
  ...props
}: FrameViewportProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const htmlRef = React.useRef<HTMLDivElement>(null)
  const bodyRef = React.useRef<HTMLDivElement>(null)

  const [size, setSize] = React.useState({ width: 0, height: 0 })

  const scrollHandlers = React.useRef(new Set<ScrollHandler>())
  const resizeHandlers = React.useRef(new Set<ResizeHandler>())

  React.useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      const { width, height } = entry.contentRect
      setSize({ width, height })
      el.style.setProperty("--fvw", `${width / 100}px`)
      el.style.setProperty("--fvh", `${height / 100}px`)
      for (const h of resizeHandlers.current) h(entry)
    })

    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  React.useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return

    const handleScroll = (e: Event) => {
      for (const h of scrollHandlers.current) h(e)
    }

    el.addEventListener("scroll", handleScroll, { passive: true })
    return () => el.removeEventListener("scroll", handleScroll)
  }, [])

  const onScroll = React.useCallback((handler: ScrollHandler) => {
    scrollHandlers.current.add(handler)
    return () => {
      scrollHandlers.current.delete(handler)
    }
  }, [])

  const onResize = React.useCallback((handler: ResizeHandler) => {
    resizeHandlers.current.add(handler)
    return () => {
      resizeHandlers.current.delete(handler)
    }
  }, [])

  const getBoundingClientRect = React.useCallback(
    (el: HTMLElement): DOMRect => {
      const vp = containerRef.current
      if (!vp) return el.getBoundingClientRect()
      const vpRect = vp.getBoundingClientRect()
      const elRect = el.getBoundingClientRect()
      return new DOMRect(
        elRect.x - vpRect.x,
        elRect.y - vpRect.y,
        elRect.width,
        elRect.height
      )
    },
    []
  )

  const ctx = React.useMemo<FrameContextValue>(
    () => ({
      html: htmlRef,
      body: bodyRef,
      width: size.width,
      height: size.height,
      onScroll,
      onResize,
      getBoundingClientRect,
    }),
    [size.width, size.height, onScroll, onResize, getBoundingClientRect]
  )

  const containerName = name ?? "frame"

  return (
    <FrameContext.Provider value={ctx}>
      <div
        ref={containerRef}
        data-slot="frame-viewport"
        data-frame={name}
        className={cn("relative overflow-auto", className)}
        style={
          {
            containerType: "size",
            containerName,
            ...style,
          } as React.CSSProperties
        }
        {...props}
      >
        {children}
      </div>
    </FrameContext.Provider>
  )
}

// ---------------------------------------------------------------------------
// Frame.Html
// ---------------------------------------------------------------------------

function FrameHtml({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { html } = useFrame()

  return (
    <div
      ref={html as React.RefObject<HTMLDivElement>}
      data-slot="frame-html"
      className={cn(className)}
      {...props}
    >
      {children}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Frame.Body
// ---------------------------------------------------------------------------

function FrameBody({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { body } = useFrame()

  return (
    <div
      ref={body as React.RefObject<HTMLDivElement>}
      data-slot="frame-body"
      className={cn(className)}
      {...props}
    >
      {children}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Compound export
// ---------------------------------------------------------------------------

const Frame = {
  Viewport: FrameViewport,
  Html: FrameHtml,
  Body: FrameBody,
}

export { Frame, useFrame }
export type { FrameContextValue, FrameViewportProps }
