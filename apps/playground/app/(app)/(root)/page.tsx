import { Metadata } from 'next';
import Link from 'next/link';

// Use shadcn/ui components for a more Vercel-like, developer-focused feel
import { Button } from '@elevenlabs/ui/components/button';
import { Badge } from '@elevenlabs/ui/components/badge';
import { Separator } from '@elevenlabs/ui/components/separator';

// Keep your existing ElevenLabs UI bits for the Bento grid content
import {
  MinimalCard,
  MinimalCardDescription,
  MinimalCardImage,
  MinimalCardTitle,
} from '@elevenlabs/ui/components/ui/minimal-card';
import { SkiperMarquee } from '@elevenlabs/ui/components/ui/skiper-marquee';
import { CopyCodeButton } from '@/components/copy-code-button';
import BlurVignette from '@elevenlabs/ui/components/ui/blur-vignette';
import { BlockDeveloperToolkit } from '@/components/block-developer-toolkit';

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
        url: `/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(
          description,
        )}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [
      {
        url: `/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(
          description,
        )}`,
      },
    ],
  },
};

// --- Full-bleed wrapper helper (escapes container to span viewport) ---
function FullBleed({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen">
      {children}
    </div>
  );
}

export default function IndexPage() {
  return (
    <div className="flex-1 overflow-y-auto">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] bg-background">
        {/* Background marquee */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <div className="w-full blur-xl opacity-30">
            <SkiperMarquee />
          </div>
        </div>

        {/* Foreground content */}
        <div className="relative z-10 container mx-auto px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <div className="mx-auto flex max-w-6xl flex-col items-center text-center py-20 md:py-28 lg:py-36">
            <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
              <Badge
                variant="secondary"
                className="rounded-full px-3 py-1 text-xs"
              >
                TypeScript-first
              </Badge>
              <Badge
                variant="outline"
                className="rounded-full px-3 py-1 text-xs"
              >
                Edge-ready
              </Badge>
            </div>

            <h1 className="tracking-tight text-balance text-4xl font-semibold leading-[1.05] sm:text-5xl md:text-6xl text-foreground">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
              {description}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <CopyCodeButton />
            </div>

            {/* Quick install button - updated to match blocks viewer */}
          </div>
        </div>
      </section>

      {/* Developer Toolkit Section - moved up */}
      <section className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <BlockDeveloperToolkit />
      </section>

      {/* Clean Bento Grid (content intact) */}
      <section className="flex-1 pb-10 md:pb-16 mt-0 px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="mx-auto max-w-[700px] lg:max-w-full">
          {/**
           * Design goals:
           * - Exactly 6 cards (clean, focused)
           * - Consistent row heights via aspect ratios to avoid masonry "sticking"
           * - Uses provided media assets
           */}
          <div className="grid grid-cols-1 gap-0 md:grid-cols-6 border-x border-b border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
            {/* 1) Lead Feature (spans 4) */}
            <MinimalCard className="group relative col-span-1 overflow-hidden md:col-span-6 lg:col-span-4 border-b border-r border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] rounded-none bg-background">
              <BlurVignette>
                <div className="relative aspect-[16/9]">
                  <MinimalCardImage
                    src="https://elevenlabs.io/assets/images/convai/convai-gradient.svg"
                    alt="Industry-leading voice agents"
                    className="h-full w-full object-cover"
                  />

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent" />
                  <div className="absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-6">
                    <MinimalCardTitle className="text-xl sm:text-2xl">
                      Industry‑leading Voice Agents
                    </MinimalCardTitle>
                    <MinimalCardDescription className="max-w-xl text-foreground/60">
                      ElevenLabs Agents talk, type, and take action with
                      ultra‑low latency — grounded in your data and tailored to
                      your workflows.
                    </MinimalCardDescription>
                  </div>
                </div>
              </BlurVignette>
            </MinimalCard>

            <MinimalCard className="col-span-1 overflow-hidden md:col-span-3 lg:col-span-2 border-b border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] rounded-none bg-background">
              <MinimalCardImage
                src="https://elevenlabs.io/assets/images/convai/convai-gradient.svg"
                alt="Industry-leading voice agents"
                className="h-full w-full object-cover"
              />
              <div className="p-4">
                <MinimalCardTitle className="text-xl sm:text-2xl">
                  Industry‑leading Voice Agents
                </MinimalCardTitle>
                <MinimalCardDescription className="max-w-xl text-foreground/60">
                  ElevenLabs Agents talk, type, and take action with ultra‑low
                  latency — grounded in your data and tailored to your
                  workflows.
                </MinimalCardDescription>
              </div>
            </MinimalCard>

            {/* 4) Multilingual (spans 3) */}
            <MinimalCard className="col-span-1 md:col-span-3 lg:col-span-3 border-b border-r border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] rounded-none">
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
            <MinimalCard className="col-span-1 md:col-span-3 lg:col-span-3 border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] rounded-none bg-background">
              <div className="flex h-full flex-col items-center justify-between gap-4 p-6 sm:flex-row sm:gap-6">
                <div className="text-center sm:text-left">
                  <div className="text-2xl font-bold leading-none sm:text-3xl">
                    99.9%
                  </div>
                  <MinimalCardDescription>Uptime SLA</MinimalCardDescription>
                </div>
                <div className="hidden h-10 w-px bg-border sm:block" />
                <div className="text-center sm:text-left">
                  <div className="text-2xl font-bold leading-none sm:text-3xl">
                    ~500ms
                  </div>
                  <MinimalCardDescription>
                    Avg. end‑to‑end latency
                  </MinimalCardDescription>
                </div>
                <div className="hidden h-10 w-px bg-border sm:block" />
                <div className="text-center sm:text-left">
                  <div className="text-2xl font-bold leading-none sm:text-3xl">
                    5,000+
                  </div>
                  <MinimalCardDescription>
                    Voices to choose from
                  </MinimalCardDescription>
                </div>
              </div>
            </MinimalCard>
          </div>
        </div>

        {/* Mobile marquee separator kept for parity; hidden above md */}
        <div className="container mx-auto px-6 md:hidden">
          <section className="w-full rounded-lg border border-border/50" />
        </div>
      </section>

      {/* Footer-ish spacer */}
      <div className="h-20 md:h-[100px] lg:h-[140px]" />
    </div>
  );
}
