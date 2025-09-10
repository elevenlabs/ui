import { Metadata } from 'next';
import { AgentPlaygroundConversation } from '@/components/agent-playground-conversation';

const title = 'Agents';
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
  return <AgentPlaygroundConversation />;
}
