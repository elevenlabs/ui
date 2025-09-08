import { Metadata } from 'next';

import { Announcement } from '@/components/announcement';
import { BlocksNav } from '@/components/blocks-nav';
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from '@/components/page-actions';
import { PageNav } from '@/components/page-nav';

const title = 'Building Blocks for Audio';
const description =
  'Clean, open source modern building blocks for audio. Copy and paste into your apps. Works with all React frameworks.';

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
      <PageHeader>
        <Announcement />
        <PageHeaderHeading>{title}</PageHeaderHeading>
        <PageHeaderDescription>{description}</PageHeaderDescription>
      </PageHeader>

      <PageNav id="blocks">
        <BlocksNav />
      </PageNav>
      <div className="container-wrapper section-soft flex-1 md:py-12">
        <div className="container">{children}</div>
      </div>
    </>
  );
}
