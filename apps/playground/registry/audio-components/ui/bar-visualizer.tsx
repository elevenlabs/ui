'use client';

import * as React from 'react';
import { cn } from '@/registry/audio-components/lib/utils';
import { useBarAnimator } from '@/registry/audio-components/hooks/use-bar-animator';
import { useMultibandVolume } from '@/registry/audio-components/hooks/use-audio-volume';

export type AgentState =
  | 'connecting'
  | 'initializing'
  | 'listening'
  | 'speaking'
  | 'thinking';

export interface BarVisualizerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Voice assistant state */
  state?: AgentState;
  /** Number of bars to display */
  barCount?: number;
  /** Audio source */
  mediaStream?: MediaStream | null;
  /** Min/max height as percentage */
  minHeight?: number;
  maxHeight?: number;
  /** Enable demo mode with fake audio data */
  demo?: boolean;
  /** Align bars from center instead of bottom */
  centerAlign?: boolean;
}

const BarVisualizer = React.forwardRef<HTMLDivElement, BarVisualizerProps>(
  (
    {
      state,
      barCount = 15,
      mediaStream,
      minHeight = 20,
      maxHeight = 100,
      demo = false,
      centerAlign = false,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    // Audio processing
    const realVolumeBands = useMultibandVolume(mediaStream, {
      bands: barCount,
      loPass: 100,
      hiPass: 200,
    });

    // Generate fake volume data for demo mode
    const [fakeVolumeBands, setFakeVolumeBands] = React.useState<number[]>(
      new Array(barCount).fill(0.2),
    );

    // Animate fake volume bands for speaking and listening states
    React.useEffect(() => {
      if (!demo) return;

      if (state !== 'speaking' && state !== 'listening') {
        setFakeVolumeBands(new Array(barCount).fill(0.2));
        return;
      }

      const interval = setInterval(() => {
        const newBands = new Array(barCount).fill(0).map((_, i) => {
          // Create wave-like motion across bars
          const time = Date.now() / 1000;
          const waveOffset = i * 0.5;
          const baseVolume = Math.sin(time * 2 + waveOffset) * 0.3 + 0.5;
          const randomNoise = Math.random() * 0.2;
          return Math.max(0.1, Math.min(1, baseVolume + randomNoise));
        });
        setFakeVolumeBands(newBands);
      }, 50);

      return () => clearInterval(interval);
    }, [demo, state, barCount]);

    // Use fake or real volume data based on demo mode
    const volumeBands = demo ? fakeVolumeBands : realVolumeBands;

    // Animation sequencing
    const highlightedIndices = useBarAnimator(
      state,
      barCount,
      state === 'connecting'
        ? 2000 / barCount
        : state === 'thinking'
          ? 150
          : state === 'listening'
            ? 500
            : 1000,
    );

    return (
      <div
        ref={ref}
        data-state={state}
        className={cn(
          'relative flex justify-center gap-1.5',
          centerAlign ? 'items-center' : 'items-end',
          'h-32 w-full rounded-lg bg-muted/30 p-4',
          className,
        )}
        style={{
          ...style,
        }}
        {...props}
      >
        {volumeBands.map((volume, index) => {
          const heightPct = Math.min(
            maxHeight,
            Math.max(minHeight, volume * 100 + 5),
          );
          const isHighlighted = highlightedIndices.includes(index);

          return (
            <div
              key={index}
              data-highlighted={isHighlighted}
              className={cn(
                // Base styles
                'w-3 transition-all duration-150',
                // Shape based on alignment
                'rounded-full',
                // Colors
                'bg-muted data-[highlighted=true]:bg-primary',
                // Speaking state - all bars active
                state === 'speaking' && 'bg-primary',
                // Thinking state - fast pulse
                state === 'thinking' && isHighlighted && 'animate-pulse',
              )}
              style={{
                height: `${heightPct}%`,
                animationDuration: state === 'thinking' ? '300ms' : undefined,
              }}
            />
          );
        })}
      </div>
    );
  },
);

BarVisualizer.displayName = 'BarVisualizer';

export { BarVisualizer };
