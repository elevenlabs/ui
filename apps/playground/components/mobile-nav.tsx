'use client';

import * as React from 'react';
import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';

import { showMcpDocs } from '@/lib/flags';
import { source } from '@/lib/source';
import { cn } from '@/lib/utils';
import { Button } from '@elevenlabs/ui/components/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@elevenlabs/ui/components/popover';

const TOP_LEVEL_SECTIONS = [
  { name: 'Featured', href: '/projects' },
  {
    name: 'Agents',
    href: '/projects/category/agents',
  },
  {
    name: 'Music',
    href: '/projects/category/music',
  },
  {
    name: 'Text to Speech',
    href: '/projects/category/text-to-speech',
  },
  {
    name: 'Speech to Text',
    href: '/projects/category/speech-to-text',
  },
  {
    name: 'Voices',
    href: '/projects/category/voices',
  },
];

export function MobileNav({
  tree,
  items,
  className,
}: {
  tree: typeof source.pageTree;
  items: { href: string; label: string }[];
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            'extend-touch-target h-8 touch-manipulation items-center justify-start gap-3 !px-0 hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 active:bg-transparent dark:hover:bg-transparent',
            className,
          )}
        >
          <div className="flex h-8 items-center gap-2">
            {/* ElevenLabs Logo Icon - matching the actual logo component */}
            <div className="relative flex h-8 w-8 items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className={cn(
                  'text-foreground h-[70%] w-[70%] transition-all duration-200',
                  open && 'rotate-45',
                )}
                fill="currentColor"
              >
                {open ? (
                  <>
                    <rect x="11" y="4" width="2" height="16" rx="0.2" />
                    <rect x="4" y="11" width="16" height="2" rx="0.2" />
                  </>
                ) : (
                  <>
                    <rect x="6" y="4" width="4" height="16" rx="0.2" />
                    <rect x="14" y="4" width="4" height="16" rx="0.2" />
                  </>
                )}
              </svg>
            </div>
            <div className="bg-border h-4 w-px" />
            <span className="text-secondary-foreground text-sm font-medium tracking-tight opacity-75">
              Menu
            </span>
            <span className="sr-only">Toggle Menu</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="bg-background/90 no-scrollbar h-(--radix-popper-available-height) w-(--radix-popper-available-width) overflow-y-auto rounded-none border-none p-0 shadow-none backdrop-blur duration-100"
        align="start"
        side="bottom"
        alignOffset={-16}
        sideOffset={14}
      >
        <div className="flex flex-col gap-12 overflow-auto px-6 py-6">
          <div className="flex flex-col gap-4">
            <div className="text-muted-foreground text-sm font-medium">
              Menu
            </div>
            <div className="flex flex-col gap-3">
              <MobileLink href="/" onOpenChange={setOpen}>
                Home
              </MobileLink>
              {items.map((item, index) => (
                <MobileLink key={index} href={item.href} onOpenChange={setOpen}>
                  {item.label}
                </MobileLink>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="text-muted-foreground text-sm font-medium">
              Projects
            </div>
            <div className="flex flex-col gap-3">
              {TOP_LEVEL_SECTIONS.map(({ name, href }) => {
                if (!showMcpDocs && href.includes('/mcp')) {
                  return null;
                }
                return (
                  <MobileLink key={name} href={href} onOpenChange={setOpen}>
                    {name}
                  </MobileLink>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col gap-8">
            {tree?.children?.map((group, index) => {
              if (group.type === 'folder') {
                return (
                  <div key={index} className="flex flex-col gap-4">
                    <div className="text-muted-foreground text-sm font-medium">
                      {group.name}
                    </div>
                    <div className="flex flex-col gap-3">
                      {group.children.map(item => {
                        if (item.type === 'page') {
                          if (!showMcpDocs && item.url.includes('/mcp')) {
                            return null;
                          }
                          return (
                            <MobileLink
                              key={`${item.url}-${index}`}
                              href={item.url}
                              onOpenChange={setOpen}
                            >
                              {item.name}
                            </MobileLink>
                          );
                        }
                      })}
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: LinkProps & {
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString());
        onOpenChange?.(false);
      }}
      className={cn('text-2xl font-medium', className)}
      {...props}
    >
      {children}
    </Link>
  );
}
