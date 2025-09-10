'use client';

import * as React from 'react';
import { Card } from '@elevenlabs/ui/components/card';
import {
  BarVisualizer,
  type AgentState,
} from '@/registry/audio-components/ui/bar-visualizer';

const states: { state: AgentState; label: string }[] = [
  { state: 'connecting', label: 'Connecting' },
  { state: 'initializing', label: 'Initializing' },
  { state: 'listening', label: 'Listening' },
  { state: 'thinking', label: 'Thinking' },
  { state: 'speaking', label: 'Speaking' },
];

export function Demo2() {
  return (
    <div className="space-y-4">
      {/* Bottom-aligned bars (default) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {states.map(({ state, label }, index) => (
          <Card key={state} className="shadow-lg border p-3">
            <div className="space-y-2">
              <div className="h-20 flex items-end">
                <BarVisualizer
                  state={state}
                  barCount={5}
                  demo={true}
                  className="h-full w-full bg-transparent p-0 rounded-sm"
                  minHeight={15}
                  maxHeight={85}
                />
              </div>
              <p className="text-xs text-center text-muted-foreground font-medium">
                {label}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Center-aligned bars example */}
      <Card className="shadow-lg border p-4">
        <div className="space-y-3">
          <p className="text-xs text-center text-muted-foreground font-medium">
            Center-Aligned Visualizer
          </p>
          <div className="h-24">
            <BarVisualizer
              state="speaking"
              barCount={12}
              demo={true}
              centerAlign={true}
              className="h-full w-full bg-transparent p-0 rounded-sm"
              minHeight={10}
              maxHeight={90}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
