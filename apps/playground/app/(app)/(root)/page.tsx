import { Metadata } from 'next';
import Link from 'next/link';

import { ExamplesNav } from '@/components/examples-nav';
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from '@/components/page-actions';
import { PageNav } from '@/components/page-nav';
import { Button } from '@elevenlabs/ui/components/button';
import { SkiperMarquee } from '@elevenlabs/ui/components/ui/skiper-marquee';

const title = 'ElevenLabs Agents SDK';
const description = 'An AI Audio Research & Deployment company';

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

export default function IndexPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="relative">
        <div className="absolute inset-0 -z-10 w-full overflow-hidden">
          <div className="h-full w-full [filter:blur(3px)_opacity(0.4)] [&>section]:!p-0 [&_#cta>div]:!max-w-none [&_#cta>div]:!px-0">
            <SkiperMarquee />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-transparent to-background/80" />
        </div>

        <PageHeader>
          <PageHeaderHeading className="max-w-4xl opacity-90">
            {title}
          </PageHeaderHeading>
          <PageHeaderDescription>{description}</PageHeaderDescription>
          <PageActions>
            <Button asChild size="sm">
              <Link href="/docs/installation">Get Started</Link>
            </Button>
            <Button asChild size="sm" variant="ghost">
              <Link href="/docs/components">View Components</Link>
            </Button>
          </PageActions>
        </PageHeader>
      </div>
      <PageNav className="hidden md:flex">
        <ExamplesNav className="[&>a:first-child]:text-primary flex-1 overflow-hidden" />
      </PageNav>

      <div className="container-wrapper section-soft flex-1 pb-6">
        <div className="container"></div>

        <div className="container overflow-hidden">
          <section className="border-border/50 -mx-4 w-[160vw] overflow-hidden rounded-lg border md:hidden md:w-[150vw]"></section>
        </div>
      </div>
    </div>
  );
}
