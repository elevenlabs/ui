import { Metadata } from 'next';
import Link from 'next/link';

import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from '@/components/page-actions';
import { Button } from '@elevenlabs/ui/components/button';
import {
  MinimalCard,
  MinimalCardDescription,
  MinimalCardImage,
  MinimalCardTitle,
} from '@elevenlabs/ui/components/ui/minimal-card';
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
        url: `/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [
      {
        url: `/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`,
      },
    ],
  },
};

export default function IndexPage() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Hero */}
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

      {/* Clean Bento Grid */}
      <div className="container-wrapper section-soft flex-1 pb-6">
        <div className="container">
          {/*
            Design goals:
            - Exactly 6 cards (clean, focused)
            - Consistent row heights via aspect ratios to avoid masonry "sticking"
            - Uses provided media assets
          */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
            {/* 1) Lead Feature (spans 4) */}
            <MinimalCard className="group relative col-span-1 md:col-span-6 lg:col-span-4 overflow-hidden">
              <div className="relative aspect-[16/9]">
                <MinimalCardImage
                  src="https://elevenlabs.io/assets/images/convai/convai-gradient.svg"
                  alt="Industry-leading voice agents"
                  className="h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-background/10 to-transparent" />
                <div className="absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-6">
                  <MinimalCardTitle className="text-xl sm:text-2xl">
                    Industry‑leading Voice Agents
                  </MinimalCardTitle>
                  <MinimalCardDescription className="max-w-xl">
                    ElevenLabs Agents talk, type, and take action with ultra‑low
                    latency — grounded in your data and tailored to your
                    workflows.
                  </MinimalCardDescription>
                </div>
              </div>
            </MinimalCard>

            {/* 2) Video (spans 2) */}
            <MinimalCard className="col-span-1 md:col-span-3 lg:col-span-2 overflow-hidden">
              <div className="relative aspect-[16/9]">
                <video
                  className="absolute inset-0 h-full w-full object-cover"
                  src="https://storage.googleapis.com/eleven-public-cdn/marketing_website/assets/convai/Use%20case%20videos/Scheduling_FIXED.webm"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                <div className="absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-6">
                  <MinimalCardTitle>Deploy anywhere</MinimalCardTitle>
                  <MinimalCardDescription>
                    Phone, web, or in‑app — real‑time voice or chat.
                  </MinimalCardDescription>
                </div>
              </div>
            </MinimalCard>

            {/* 3) Workflows & Testing (spans 3) */}
            <MinimalCard className="col-span-1 md:col-span-3 lg:col-span-3 overflow-hidden">
              <div className="relative aspect-[16/9]">
                <MinimalCardImage
                  src="https://elevenlabs.io/_next/image?url=https%3A%2F%2Feleven-public-cdn.elevenlabs.io%2Fpayloadcms%2Fy843ykzoy2-Workflows%20UI.webp&w=1920&q=100"
                  alt="Workflows and testing UI"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/10 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <MinimalCardTitle>Workflows & Testing</MinimalCardTitle>
                  <MinimalCardDescription>
                    Build multi‑agent flows with guardrails. Track results with
                    in‑depth analytics.
                  </MinimalCardDescription>
                </div>
              </div>
            </MinimalCard>

            {/* 4) Multilingual (spans 3) */}
            <MinimalCard className="col-span-1 md:col-span-3 lg:col-span-3">
              <div className="flex h-full flex-col justify-between p-6">
                <div>
                  <MinimalCardTitle>Global by default</MinimalCardTitle>
                  <MinimalCardDescription>
                    Natural, human‑sounding conversations in 32 languages with
                    automatic detection & instant switching.
                  </MinimalCardDescription>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    'English',
                    'Spanish',
                    'French',
                    'German',
                    'Portuguese',
                    'Japanese',
                    'Italian',
                    'Chinese',
                    'Hindi',
                    '+23 more',
                  ].map(t => (
                    <span
                      key={t}
                      className="rounded-full border px-3 py-1 text-xs opacity-80"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </MinimalCard>

            {/* 5) Reliability Stats (spans 3) */}
            <MinimalCard className="col-span-1 md:col-span-3 lg:col-span-3">
              <div className="flex h-full items-center justify-between gap-6 p-6">
                <div>
                  <div className="text-3xl font-bold leading-none">99.9%</div>
                  <MinimalCardDescription>Uptime SLA</MinimalCardDescription>
                </div>
                <div className="h-10 w-px bg-border" />
                <div>
                  <div className="text-3xl font-bold leading-none">~500ms</div>
                  <MinimalCardDescription>
                    Avg. end‑to‑end latency
                  </MinimalCardDescription>
                </div>
                <div className="h-10 w-px bg-border" />
                <div>
                  <div className="text-3xl font-bold leading-none">5,000+</div>
                  <MinimalCardDescription>
                    Voices to choose from
                  </MinimalCardDescription>
                </div>
              </div>
            </MinimalCard>

            {/* 6) CTA (spans 3) */}
            <MinimalCard className="col-span-1 md:col-span-3 lg:col-span-3">
              <div className="flex h-full flex-col justify-between p-6">
                <div>
                  <MinimalCardTitle>Create an AI Agent</MinimalCardTitle>
                  <MinimalCardDescription>
                    Get your API key and deploy natural, real‑time agents in
                    minutes.
                  </MinimalCardDescription>
                </div>
                <div className="mt-4 flex gap-3">
                  <Button asChild size="sm" variant="secondary">
                    <Link href="/playground">Try Playground</Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    variant="ghost"
                    className="text-primary-foreground"
                  >
                    <Link href="/contact">Talk to Sales</Link>
                  </Button>
                </div>
              </div>
            </MinimalCard>
          </div>
        </div>

        {/* Mobile marquee separator kept for parity; hidden above md */}
        <div className="container overflow-hidden">
          <section className="border-border/50 -mx-4 w-[160vw] overflow-hidden rounded-lg border md:hidden md:w-[150vw]" />
        </div>
      </div>
    </div>
  );
}
