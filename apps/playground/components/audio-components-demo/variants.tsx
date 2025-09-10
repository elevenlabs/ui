'use client';

import { AudioVisualizer } from '@/registry/audio-components/ui/audio-visualizer';
import { Card } from '@elevenlabs/ui/components/card';
import React from 'react';

export function InlineStatusChipLive() {
  return (
    <Card className="shadow-lg border h-full min-h-[140px] flex flex-col items-center justify-center p-6 space-y-3">
      <span className="inline-flex items-center gap-2 rounded-full bg-red-500/5 border border-red-500/20 px-3 py-1.5 text-sm">
        <span className="relative inline-flex h-2 w-2 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-40" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
        </span>
        <span className="text-red-600/90 font-medium">Live</span>
      </span>
      <div className="h-8 w-full max-w-[140px] flex items-center rounded-md bg-red-500/5 px-2">
        <div className="h-full w-full py-1">
          <style jsx>{`
            .red-bars > * {
              background-color: rgb(239, 68, 68, 0.6) !important;
            }
          `}</style>
          <AudioVisualizer
            height="h-full"
            className="rounded-sm red-bars"
            barGap="sm"
            barWidth={3}
            speed={50}
            animated
            sensitivity={2.0}
            minUnit={0.15}
            barCount={20}
          />
        </div>
      </div>
    </Card>
  );
}

export function FooterStripTranscribing() {
  return (
    <Card className="shadow-lg border p-0 h-full flex flex-col justify-center">
      <div className="h-full w-full rounded-md bg-foreground/5 px-2 py-1">
        <AudioVisualizer
          height="h-full"
          className="rounded-sm"
          barGap="sm"
          barWidth={3}
          speed={56}
          animated
          sensitivity={1.8}
          minUnit={0.02}
          useTextColor
        />
      </div>
    </Card>
  );
}
