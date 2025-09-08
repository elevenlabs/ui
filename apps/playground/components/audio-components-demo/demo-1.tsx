'use client';

import { Button } from '@elevenlabs/ui/components/button';
import { Card } from '@elevenlabs/ui/components/card';
import { ChevronDown, Keyboard, Mic, MicOff, XIcon } from 'lucide-react';
import React, { useState } from 'react';
import { AudioVisualizer } from '@/components/audio-components-demo/audio-visualizer';

export function ConversationBar1() {
  const [isMuted, setIsMuted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [timerId, setTimerId] = useState<number | null>(null);
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  const toggleMute = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  // Manage a local timer when mic is active
  React.useEffect(() => {
    if (timerId == null) {
      const id = window.setInterval(() => setElapsed(e => e + 1), 1000);
      setTimerId(id);
    }

    return () => {
      if (timerId != null) window.clearInterval(timerId);
    };
  }, [timerId]);

  return (
    <div className="flex justify-center p-4">
      <Card className="shadow-lg border p-2 m-0">
        <div className="flex items-center gap-2">
          <div className="w-[140px] h-8 md:h-10">
            <div className="h-full flex items-center rounded-md bg-foreground/5 px-2 py-1 gap-2 text-foreground/70">
              <span className="font-mono text-xs tabular-nums">
                {formatTime(elapsed)}
              </span>
              <div className="flex-1 h-full py-[2px]">
                <AudioVisualizer
                  height="h-full"
                  className="rounded-sm"
                  animated
                  barGap="sm"
                  barWidth={3}
                  sensitivity={1.8}
                  minUnit={0.02}
                  useTextColor
                  speed={40}
                />
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setKeyboardOpen(v => !v)}
            aria-pressed={keyboardOpen}
            className="relative"
          >
            <Keyboard
              className={
                'h-5 w-5 transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] transform-gpu ' +
                (keyboardOpen ? 'opacity-0 scale-75' : 'opacity-100 scale-100')
              }
            />
            <ChevronDown
              className={
                'absolute inset-0 m-auto h-5 w-5 transition-all duration-200 delay-50 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform-gpu ' +
                (keyboardOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-75')
              }
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            aria-pressed={isMuted}
            className={isMuted ? 'bg-foreground/150' : ''}
          >
            {isMuted ? <MicOff /> : <Mic />}
          </Button>
          <Button variant="ghost" size="icon">
            <XIcon />
          </Button>
        </div>
      </Card>
    </div>
  );
}
