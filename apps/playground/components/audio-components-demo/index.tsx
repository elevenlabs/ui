'use client';
import { ConversationBar1 } from '@/components/audio-components-demo/demo-1';
import {
  FooterStripTranscribing,
  InlineStatusChipLive,
} from '@/components/audio-components-demo/variants';
import { Demo2 } from '@/components/audio-components-demo/demo-2';
import { Card } from '@elevenlabs/ui/components/card';
import { PlayerDemoWrapper } from './player-demo';

export function AudioComponentsDemo() {
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="space-y-4">
        {/* Top row - ConversationBar1 */}
        <div className="flex justify-center">
          <ConversationBar1 />
        </div>

        {/* Middle row - Live and Transcribing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-3">
            <Card className="shadow-lg border p-2 m-0">
              <PlayerDemoWrapper />
            </Card>
          </div>
          <div className="col-span-1">
            <InlineStatusChipLive />
          </div>
          <div className="col-span-1 md:col-span-2">
            <FooterStripTranscribing />
          </div>
        </div>

        {/* Bar Visualizer States */}
        <Demo2 />
      </div>
    </div>
  );
}
