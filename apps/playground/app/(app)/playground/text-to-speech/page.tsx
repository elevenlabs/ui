import { ChatBotDemo } from '@/components/chat-bot-demo';
import { AgentPlaygroundWrapper } from '@/components/agent-playground-wrapper';
import { PageHeader } from '@/components/page-header';
import { ViewLogsButton } from '@/components/view-logs-button';
import { Metadata } from 'next';

const title = 'Text to Speech SDK';
const description =
  'Explore a curated gallery of voice and audio experiences powered by ElevenLabs. Discover what developers and teams are shipping today.';

export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    images: [
      {
        url: `/og?title=${encodeURIComponent(
          title,
        )}&description=${encodeURIComponent(description)}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [
      {
        url: `/og?title=${encodeURIComponent(
          title,
        )}&description=${encodeURIComponent(description)}`,
      },
    ],
  },
};

export default function PlaygroundPage() {
  return (
    <div className="relative flex flex-col h-[calc(100vh-var(--header-height))]">
      <div className="flex flex-col flex-1 bg-background md:rounded-xl md:overflow-hidden md:mb-2">
        <PageHeader>
          <h1 className="text-base font-medium">Text to Speech</h1>
          <div className="ml-auto flex items-center gap-2">
            <ViewLogsButton />
          </div>
        </PageHeader>
        <div className="flex flex-col flex-1 overflow-hidden">
          <AgentPlaygroundWrapper>
            <ChatBotDemo />
          </AgentPlaygroundWrapper>
        </div>
      </div>
    </div>
  );
}
