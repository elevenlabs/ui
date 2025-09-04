import { SiteHeader } from "@/components/site-header";
import { SidebarProvider } from "@elevenlabs/ui/components/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background relative z-10 flex h-svh flex-col overflow-hidden">
      <SiteHeader />
      <main className="flex flex-1 flex-col overflow-hidden">
        <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 55)",
              "--sidebar-secondary-width": "calc(var(--spacing) * 150)",
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
