import { source } from '@/lib/source';
import { DocsSidebar } from '@/components/docs-sidebar';
import { SidebarInset } from '@elevenlabs/ui/components/sidebar';
import * as React from 'react';

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DocsSidebar tree={source.pageTree} variant="inset" />
      <SidebarInset className="flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">{children}</div>
      </SidebarInset>
    </>
  );
}
