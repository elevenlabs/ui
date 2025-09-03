import { PlaygroundSidebar } from "@/components/playground-sidebar";
import { PageHeader } from "@/components/page-header";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@elevenlabs/ui/components/button";
import {
  SidebarInset,
  SidebarProvider,
} from "@elevenlabs/ui/components/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background relative z-10 flex h-svh flex-col overflow-hidden">
      <SiteHeader />
      <main className="flex flex-1 flex-col overflow-hidden">
        <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
        >
          {children}
        </SidebarProvider>
      </main>
    </div>
  );
}
