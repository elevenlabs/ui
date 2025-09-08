'use client';

import { AudioVisualizer } from '@/components/audio-components-demo/audio-visualizer';
import { Button } from '@elevenlabs/ui/components/button';
import { Card } from '@elevenlabs/ui/components/card';
import { Mic, MicOff } from 'lucide-react';
import React from 'react';

export function PillMicButton() {
  const [listening, setListening] = React.useState(false);
  return (
    <Card>
      <div className="flex w-full items-center justify-center p-4">
        <Button
          onClick={() => setListening(v => !v)}
          className="inline-flex h-10 items-center gap-3 rounded-full border bg-background px-4"
          variant="outline"
        >
          {listening ? (
            <MicOff className="h-4 w-4" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
          <span className="text-sm font-medium">
            {listening ? 'Stop' : 'Start'} Listening
          </span>
          <div className="h-5 w-[120px] rounded-full bg-foreground/5 px-2 py-1">
            <AudioVisualizer
              height="h-full"
              className="rounded-full"
              barGap="sm"
              barWidth={3}
              speed={44}
              animated={listening}
              useMicrophone={listening}
              sensitivity={1.6}
              minUnit={0.03}
            />
          </div>
        </Button>
      </div>
    </Card>
  );
}

export function InlineStatusChipLive() {
  return (
    <Card>
      <div className="flex items-center justify-between gap-3 p-4">
        <span className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs">
          <span className="relative inline-flex h-2 w-2 items-center justify-center">
            <span className="absolute inline-flex h-2 w-2 rounded-full bg-red-500/30" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>
          Live
        </span>
        <span className="inline-flex h-4 w-[96px] items-center rounded-full bg-red-500/10 px-2 text-red-600">
          <AudioVisualizer
            height="h-full"
            className="rounded-full"
            barGap="sm"
            barWidth={3}
            speed={50}
            useTextColor
            animated
          />
        </span>
      </div>
    </Card>
  );
}

export function FooterStripTranscribing() {
  return (
    <Card>
      <div className="flex items-center gap-3 p-4">
        <span className="text-xs text-foreground/70">Transcribing…</span>
        <div className="h-3 flex-1 rounded bg-foreground/5 px-2">
          <AudioVisualizer
            height="h-full"
            className="rounded"
            barGap="sm"
            barWidth={3}
            speed={56}
            animated
          />
        </div>
      </div>
    </Card>
  );
}
