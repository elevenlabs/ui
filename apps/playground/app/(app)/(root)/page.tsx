import { Metadata } from 'next';
import Link from 'next/link';

// Use shadcn/ui components for a more Vercel-like, developer-focused feel
import { AvatarStack } from '@elevenlabs/ui/components/ui/kibo-ui/avatar-stack';
// Keep your existing ElevenLabs UI bits for the Bento grid content
import { BlockDeveloperToolkit } from '@/components/block-developer-toolkit';
import { CopyCodeButton } from '@/components/copy-code-button';
import { AgentsCarousel } from '@/components/agents-carousel';
import { MinimalCardDemo } from '@/components/hero-cards';
import { Avatar, AvatarFallback } from '@elevenlabs/ui/components/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@elevenlabs/ui/components/tooltip';
import BlurVignette from '@elevenlabs/ui/components/ui/blur-vignette';
import {
  MinimalCard,
  MinimalCardDescription,
  MinimalCardImage,
  MinimalCardTitle,
} from '@elevenlabs/ui/components/ui/minimal-card';
import { SkiperMarquee } from '@elevenlabs/ui/components/ui/skiper-marquee';
import {
  IconBrandJavascript,
  IconBrandNextjs,
  IconBrandPython,
  IconBrandReact,
  IconBrandSvelte,
  IconBrandSwift,
  IconBrandTypescript,
} from '@tabler/icons-react';
import { Announcement } from '@/components/announcement';

const title = 'ElevenLabs Agents';
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
          <div className="w-screen max-w-none blur-xl opacity-30 [&>section]:!p-0 [&_div.container]:!max-w-none [&_div.container]:!px-0">
            <SkiperMarquee />
          </div>
        </div>

        {/* Foreground content */}
        <div className="relative z-10 container mx-auto px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <div className="mx-auto flex max-w-6xl flex-col items-center text-center py-20 md:py-28 lg:py-36">
            <Announcement />
            <h1 className="tracking-tight text-balance text-4xl font-semibold leading-[1.05] sm:text-5xl md:text-6xl text-foreground">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
              {description}
            </p>

            <div className="mt-6 mb-8 flex flex-wrap items-center justify-center gap-2 opacity-80">
              <AvatarStack>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/docs/typescript">
                      <Avatar className="h-6 w-6 border border-border/50 transition-all hover:opacity-100 hover:border-border cursor-pointer">
                        <AvatarFallback className="bg-background/30">
                          <IconBrandTypescript className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>TypeScript SDK</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/docs/react">
                      <Avatar className="h-6 w-6 border border-border/50 transition-all hover:opacity-100 hover:border-border cursor-pointer">
                        <AvatarFallback className="bg-background/30">
                          <IconBrandReact className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>React Integration</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/docs/nextjs">
                      <Avatar className="h-6 w-6 border border-border/50 transition-all hover:opacity-100 hover:border-border cursor-pointer">
                        <AvatarFallback className="bg-background/30">
                          <IconBrandNextjs className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Next.js Guide</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/docs/swift">
                      <Avatar className="h-6 w-6 border border-border/50 transition-all hover:opacity-100 hover:border-border cursor-pointer">
                        <AvatarFallback className="bg-background/30">
                          <IconBrandSwift className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Swift SDK</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/docs/python">
                      <Avatar className="h-6 w-6 border border-border/50 transition-all hover:opacity-100 hover:border-border cursor-pointer">
                        <AvatarFallback className="bg-background/30">
                          <IconBrandPython className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Python SDK</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/docs/svelte">
                      <Avatar className="h-6 w-6 border border-border/50 transition-all hover:opacity-100 hover:border-border cursor-pointer">
                        <AvatarFallback className="bg-background/30">
                          <IconBrandSvelte className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Svelte Integration</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/docs/javascript">
                      <Avatar className="h-6 w-6 border border-border/50 transition-all hover:opacity-100 hover:border-border cursor-pointer">
                        <AvatarFallback className="bg-background/30">
                          <IconBrandJavascript className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>JavaScript SDK</p>
                  </TooltipContent>
                </Tooltip>
              </AvatarStack>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <CopyCodeButton />
            </div>

            {/* Quick install button - updated to match blocks viewer */}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <BlockDeveloperToolkit />
      </section>

      {/* Footer-ish spacer */}
      <div className="h-20 md:h-[100px] lg:h-[140px]" />
    </div>
  );
}
