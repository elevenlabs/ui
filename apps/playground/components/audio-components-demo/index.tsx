import { ConversationBar1 } from '@/components/audio-components-demo/demo-1';
import {
  FooterStripTranscribing,
  InlineStatusChipLive,
  PillMicButton,
} from '@/components/audio-components-demo/variants';

export function AudioComponentsDemo() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div className="col-span-full">
        <ConversationBar1 />
      </div>
      <PillMicButton />
      <InlineStatusChipLive />
      <FooterStripTranscribing />
    </div>
  );
}
