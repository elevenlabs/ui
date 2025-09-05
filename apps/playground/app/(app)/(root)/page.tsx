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

      <div className="container-wrapper section-soft flex-1 pb-6">
        <div className="container">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4 lg:grid-cols-6">
            {/* Large card spanning 2 columns and 2 rows with SkiperMarquee */}
            <MinimalCard className="col-span-1 md:col-span-2 lg:col-span-3 md:row-span-2 overflow-hidden">
              <MinimalCardImage
                src="https://elevenlabs.io/assets/images/convai/convai-gradient.svg"
                alt="AI Audio Innovation"
              />
            </MinimalCard>

            {/* Medium card with image */}
            <MinimalCard className="col-span-1 md:col-span-2 lg:col-span-2">
              <MinimalCardImage
                src="https://images.unsplash.com/photo-1590935217281-8f102120d683?w=800&h=600&fit=crop"
                alt="Voice Synthesis"
              />
              <div className="p-4">
                <MinimalCardTitle>Voice Synthesis</MinimalCardTitle>
                <MinimalCardDescription>
                  Generate natural-sounding speech in multiple languages
                </MinimalCardDescription>
              </div>
            </MinimalCard>

            {/* Small card */}
            <MinimalCard className="col-span-1">
              <div className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <svg
                    className="h-6 w-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                </div>
                <MinimalCardTitle>Real-time</MinimalCardTitle>
                <MinimalCardDescription>
                  Ultra-low latency for seamless conversations
                </MinimalCardDescription>
              </div>
            </MinimalCard>

            {/* Wide card */}
            <MinimalCard className="col-span-1 md:col-span-3 lg:col-span-2">
              <div className="p-6">
                <MinimalCardTitle>Multilingual Support</MinimalCardTitle>
                <MinimalCardDescription className="mb-4">
                  Support for 29+ languages with natural accents and dialects
                </MinimalCardDescription>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-secondary/20 px-3 py-1 text-xs">
                    English
                  </span>
                  <span className="rounded-full bg-secondary/20 px-3 py-1 text-xs">
                    Spanish
                  </span>
                  <span className="rounded-full bg-secondary/20 px-3 py-1 text-xs">
                    French
                  </span>
                  <span className="rounded-full bg-secondary/20 px-3 py-1 text-xs">
                    German
                  </span>
                  <span className="rounded-full bg-secondary/20 px-3 py-1 text-xs">
                    +25 more
                  </span>
                </div>
              </div>
            </MinimalCard>

            {/* Small card with stats */}
            <MinimalCard className="col-span-1">
              <div className="flex h-full flex-col justify-between p-6">
                <div>
                  <div className="text-3xl font-bold">99.9%</div>
                  <MinimalCardDescription>Uptime SLA</MinimalCardDescription>
                </div>
                <div className="mt-4 h-px bg-border" />
                <div className="mt-4">
                  <div className="text-2xl font-semibold"> 500ms</div>
                  <MinimalCardDescription>
                    Average latency
                  </MinimalCardDescription>
                </div>
              </div>
            </MinimalCard>

            {/* Medium card with feature list */}
            <MinimalCard className="col-span-1 md:col-span-2">
              <div className="p-6">
                <MinimalCardTitle>Developer First</MinimalCardTitle>
                <MinimalCardDescription className="mb-4">
                  Built with developers in mind
                </MinimalCardDescription>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Simple REST API
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    WebSocket support
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    TypeScript SDK
                  </li>
                </ul>
              </div>
            </MinimalCard>

            {/* Call to action card */}
            <MinimalCard className="col-span-1 bg-primary text-primary-foreground hover:bg-primary/90">
              <div className="flex h-full flex-col justify-between p-6">
                <div>
                  <MinimalCardTitle className="text-primary-foreground">
                    Start Building
                  </MinimalCardTitle>
                  <MinimalCardDescription className="text-primary-foreground/80">
                    Get your API key and start creating amazing voice
                    experiences
                  </MinimalCardDescription>
                </div>
                <Button
                  asChild
                  size="sm"
                  variant="secondary"
                  className="mt-4 w-full"
                >
                  <Link href="/playground">Try Playground</Link>
                </Button>
              </div>
            </MinimalCard>
          </div>
        </div>

        <div className="container overflow-hidden">
          <section className="border-border/50 -mx-4 w-[160vw] overflow-hidden rounded-lg border md:hidden md:w-[150vw]"></section>
        </div>
      </div>
    </div>
  );
}
