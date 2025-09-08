'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ScrollArea, ScrollBar } from '@elevenlabs/ui/components/scroll-area';
import { registryCategories } from '@/registry/registry-categories';

export function TemplatesNav() {
  const pathname = usePathname();

  return (
    <div className="relative overflow-hidden">
      <ScrollArea className="max-w-none">
        <div className="flex items-center">
          <TemplatesNavLink
            category={{ name: 'Tools', slug: '', hidden: false }}
            isActive={pathname === '/templates'}
          />
          <TemplatesNavLink
            category={{ name: 'Agents', slug: 'agents', hidden: false }}
            isActive={pathname === '/templates/agents'}
          />
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  );
}

function TemplatesNavLink({
  category,
  isActive,
}: {
  category: (typeof registryCategories)[number];
  isActive: boolean;
}) {
  if (category.hidden) {
    return null;
  }

  return (
    <Link
      href={`/templates/${category.slug}`}
      key={category.slug}
      className="text-muted-foreground hover:text-primary data-[active=true]:text-primary flex h-7 items-center justify-center px-4 text-center text-base font-medium transition-colors"
      data-active={isActive}
    >
      {category.name}
    </Link>
  );
}
