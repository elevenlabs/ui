import { Metadata } from 'next';
import Link from 'next/link';

import { BlocksNav } from '@/components/blocks-nav';
import { PageNav } from '@/components/page-nav';
import { Button } from '@elevenlabs/ui/components/button';

const title = 'Agent Templates';
const description = '1-click agent templates for every use case';

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

export default function BlocksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageNav id="blocks" className="border-b">
        <BlocksNav />
        <Button
          asChild
          variant="secondary"
          size="sm"
          className="mr-7 hidden shadow-none lg:flex"
        >
          <Link href="/blocks/sidebar">Browse all blocks</Link>
        </Button>
      </PageNav>
      <div className="flex-1">{children}</div>
    </>
  );
}
