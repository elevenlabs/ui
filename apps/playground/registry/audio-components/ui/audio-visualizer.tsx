'use client';

import { cn } from '@/registry/audio-components/lib/utils';
import * as React from 'react';

export interface VisualizerBar {
  height: number;
  color?: string;
  active?: boolean;
}

export interface AudioVisualizerProps {
  currentTime?: number;
  duration?: number;
  barCount?: number;
  height?: 'sm' | 'md' | 'lg' | 'xl' | string;
  showTime?: boolean;
  timeFormat?: 'mm:ss' | 'hh:mm:ss';
  className?: string;
  variant?: 'default' | 'muted' | 'accent';
  barGap?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  speed?: number;
  onBarClick?: (index: number, bar: VisualizerBar) => void;
  bars?: VisualizerBar[];
  useMicrophone?: boolean;
  micFftSize?: number;
  micSmoothing?: number;
  barWidth?: number;
  sensitivity?: number;
  minUnit?: number;
  useTextColor?: boolean;
}

const randomUnitHeight = () => 0.2 + Math.random() * 0.8;

const getComputedColor = (cssVar: string, fallback = '#666666') => {
  try {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(cssVar)
      .trim();
    return value || fallback;
  } catch {
    return fallback;
  }
};

export function AudioVisualizer({
  bars,
  barCount = 40,
  height = 'md',
  className,
  variant = 'default',
  barGap = 'sm',
  animated = true,
  speed = 72,
  useMicrophone = false,
  micFftSize = 256,
  micSmoothing = 0.8,
  barWidth = 4,
  sensitivity = 1.4,
  minUnit = 0.03,
  useTextColor = false,
}: AudioVisualizerProps) {
  const BAR_WIDTH = Math.max(2, Math.floor(barWidth));
  const GAP_MAP = { sm: 4, md: 6, lg: 8 } as const;
  const GAP = GAP_MAP[barGap];
  const STEP = BAR_WIDTH + GAP;
  const MIN_BAR_PX = BAR_WIDTH;
  const MAX_INTENSITY = 0.85; // Cap at 85% of available height
  const FADE_ZONE = 24; // Narrower default edge fade in px

  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const wrapRef = React.useRef<HTMLDivElement | null>(null);
  const latestBarsRef = React.useRef<VisualizerBar[] | undefined>(bars);
  const skipInitialReseedRef = React.useRef(true);

  const resizeTimeoutRef = React.useRef<number | null>(null);
  const lastWidthRef = React.useRef<number>(0);
  const isResizingRef = React.useRef(false);
  const pendingResizeRef = React.useRef(false);
  const lastFrameDataRef = React.useRef<ImageData | null>(null);

  const audioCtxRef = React.useRef<any>(null);
  const analyserRef = React.useRef<any>(null);
  const mediaStreamRef = React.useRef<any>(null);
  const micDataRef = React.useRef<any>(null);
  const micBinsRef = React.useRef<any>([]);

  React.useEffect(() => {
    latestBarsRef.current = bars;
  }, [bars]);

  const getBarColor = () => {
    if (useTextColor) {
      const el = wrapRef.current;
      if (el) {
        const c = getComputedStyle(el).color;
        if (c) return c;
      }
    }
    switch (variant) {
      case 'accent':
        return getComputedColor('--accent-foreground', '#1f2937');
      case 'muted':
        return getComputedColor('--muted-foreground', '#6b7280');
      default:
        return getComputedColor('--foreground', '#111827');
    }
  };

  type Dot = { x: number; h: number };
  const dotsRef = React.useRef<Dot[]>([]);
  const spawnAccRef = React.useRef(0);

  const pickSafeUnit = (): number => {
    const mic = micBinsRef.current;
    if (mic && mic.length) {
      const rawValue = Math.max(
        0.05,
        Math.min(1, mic[Math.floor(Math.random() * mic.length)]),
      );
      return Math.min(rawValue, MAX_INTENSITY);
    }
    const arr = latestBarsRef.current;
    if (arr && arr.length) {
      const candidate = arr[Math.floor(Math.random() * arr.length)];
      const raw = Number(candidate?.height);
      if (Number.isFinite(raw)) {
        const unit = raw / 100;
        if (Number.isFinite(unit)) {
          return Math.max(0.05, Math.min(unit, MAX_INTENSITY));
        }
      }
    }
    return Math.min(randomUnitHeight(), MAX_INTENSITY);
  };

  const fillRoundedRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
    color: string,
  ) => {
    const radius = Math.max(0, Math.min(r, w / 2, h / 2));

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
    ctx.fill();
  };

  const reseedDots = (cssW: number) => {
    const targetCount = Math.max(barCount || 0, Math.ceil(cssW / STEP) + 2);
    const next: Dot[] = [];
    for (let i = 0; i < targetCount; i++) {
      const bx = cssW - i * STEP;
      const unit = pickSafeUnit();
      next.push({ x: bx, h: unit });
    }
    next.sort((a, b) => a.x - b.x);
    dotsRef.current = next;
    spawnAccRef.current = 0;
  };

  const regridDots = (cssW: number) => {
    if (Math.abs(cssW - lastWidthRef.current) < 10) return;

    const targetCount = Math.max(barCount || 0, Math.ceil(cssW / STEP) + 2);
    const sortedExisting = [...dotsRef.current].sort((a, b) => b.x - a.x);
    const heights: number[] = sortedExisting.map(d => d.h);
    const next: Dot[] = [];
    for (let i = 0; i < targetCount; i++) {
      const bx = cssW - i * STEP;
      const h = i < heights.length ? heights[i] : pickSafeUnit();
      next.push({ x: bx, h });
    }
    next.sort((a, b) => a.x - b.x);
    dotsRef.current = next;
    spawnAccRef.current = 0;
    lastWidthRef.current = cssW;
  };

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!useMicrophone) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        if (cancelled) return;
        const ctx = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = micFftSize;
        analyser.smoothingTimeConstant = micSmoothing;
        const source = ctx.createMediaStreamSource(stream);
        source.connect(analyser);
        audioCtxRef.current = ctx;
        analyserRef.current = analyser;
        mediaStreamRef.current = stream;
        micDataRef.current = new Uint8Array(analyser.frequencyBinCount);
      } catch (err) {
        console.warn('Microphone access denied or unavailable');
      }
    })();

    return () => {
      cancelled = true;
      const ctx = audioCtxRef.current;
      const stream = mediaStreamRef.current;
      if (stream) {
        for (const track of stream.getTracks()) track.stop();
      }
      if (ctx) {
        ctx.close();
      }
      audioCtxRef.current = null;
      analyserRef.current = null;
      mediaStreamRef.current = null;
      micBinsRef.current = [];
      micDataRef.current = null;
    };
  }, [useMicrophone, micFftSize, micSmoothing]);

  React.useEffect(() => {
    const el = wrapRef.current;
    const cvs = canvasRef.current;
    if (!el || !cvs) return;

    const handleResize = () => {
      isResizingRef.current = true;
      pendingResizeRef.current = true;

      const ctx = cvs.getContext('2d')!;
      try {
        lastFrameDataRef.current = ctx.getImageData(
          0,
          0,
          cvs.width,
          cvs.height,
        );
      } catch (e) {}

      if (resizeTimeoutRef.current !== null) {
        window.clearTimeout(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = window.setTimeout(() => {
        const dpr = Math.max(1, window.devicePixelRatio || 1);
        const r = el.getBoundingClientRect();

        const newWidth = Math.floor(r.width * dpr);
        const newHeight = Math.floor(r.height * dpr);

        cvs.width = newWidth;
        cvs.height = newHeight;
        cvs.style.width = `${r.width}px`;
        cvs.style.height = `${r.height}px`;

        const ctx = cvs.getContext('2d')!;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        if (skipInitialReseedRef.current) {
          skipInitialReseedRef.current = false;
        } else {
          regridDots(r.width);
        }

        pendingResizeRef.current = false;
        isResizingRef.current = false;
        lastFrameDataRef.current = null;
      }, 150);
    };

    const ro = new ResizeObserver(handleResize);
    ro.observe(el);
    return () => {
      ro.disconnect();
      if (resizeTimeoutRef.current !== null) {
        window.clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, []);

  React.useEffect(() => {
    if (!animated) return;
    const cvs = canvasRef.current;
    const el = wrapRef.current;
    if (!cvs || !el) return;
    const ctx = cvs.getContext('2d')!;

    let raf = 0;
    let last = performance.now();

    const loop = (now: number) => {
      if (pendingResizeRef.current) {
        raf = requestAnimationFrame(loop);
        return;
      }

      const dt = Math.min(80, now - last) / 1000;
      last = now;

      const analyser = analyserRef.current;
      const micBuffer = micDataRef.current;
      if (analyser && micBuffer) {
        analyser.getByteFrequencyData(micBuffer);
        const bins: number[] = [];
        for (let i = 0; i < micBuffer.length; i++) {
          const v = (micBuffer[i] / 255) * sensitivity;
          bins.push(Math.max(minUnit, Math.min(1, v)));
        }
        micBinsRef.current = bins;
      }

      const { width: cssW, height: cssH } = el.getBoundingClientRect();

      if (!isResizingRef.current) {
        ctx.clearRect(0, 0, cssW, cssH);

        const vx = speed;
        for (let i = 0; i < dotsRef.current.length; i++) {
          dotsRef.current[i].x -= vx * dt;
        }

        while (dotsRef.current.length && dotsRef.current[0].x + BAR_WIDTH < 0) {
          dotsRef.current.shift();
        }

        spawnAccRef.current += vx * dt;
        while (spawnAccRef.current >= STEP) {
          spawnAccRef.current -= STEP;
          const unit = pickSafeUnit();
          dotsRef.current.push({
            x: cssW + (STEP - spawnAccRef.current),
            h: unit,
          });
        }

        const baseH = cssH * 0.6;
        const color = getBarColor();

        for (let i = 0; i < dotsRef.current.length; i++) {
          const d = dotsRef.current[i];
          const unit = Number.isFinite(d.h) ? d.h : 0.1;
          const hPx = baseH * unit;
          const rh = Math.max(MIN_BAR_PX, Math.round(hPx));
          const y = Math.round(cssH / 2 - rh / 2);
          const x = Math.round(d.x);
          const radius = BAR_WIDTH / 2;
          const prevAlpha = ctx.globalAlpha;
          ctx.globalAlpha = Math.max(0.25, Math.min(1, 0.35 + unit * 0.65));
          fillRoundedRect(ctx, x, y, BAR_WIDTH, rh, radius, color);
          ctx.globalAlpha = prevAlpha;
        }

        // Edge fade – guard against non-finite/zero width and clamp stops
        if (Number.isFinite(cssW) && cssW > 0) {
          const safeW = Math.max(1, cssW);
          const f = Math.min(0.12, Math.max(0, FADE_ZONE / safeW));
          ctx.globalCompositeOperation = 'destination-out';
          const fadeGradient = ctx.createLinearGradient(0, 0, cssW, 0);
          fadeGradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
          fadeGradient.addColorStop(f, 'rgba(0, 0, 0, 0)');
          fadeGradient.addColorStop(1 - f, 'rgba(0, 0, 0, 0)');
          fadeGradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
          ctx.fillStyle = fadeGradient;
          ctx.fillRect(0, 0, cssW, cssH);
          ctx.globalCompositeOperation = 'source-over';
        }
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [animated, speed, bars, useMicrophone, micFftSize, micSmoothing, variant]);

  const heightClasses = {
    sm: 'h-20',
    md: 'h-32',
    lg: 'h-40',
    xl: 'h-48',
  } as const;

  const cardHeight =
    typeof height === 'string' && height in heightClasses
      ? heightClasses[height as keyof typeof heightClasses]
      : height;

  return (
    <div className={cn(cardHeight, className)}>
      <div className="flex items-stretch h-full">
        <div ref={wrapRef} className="relative flex-1 overflow-hidden">
          <canvas ref={canvasRef} className="absolute inset-0 block" />
        </div>
      </div>
    </div>
  );
}
