import { AppSidebar } from "@/components/app-sidebar";
import { PageHeader } from "@/components/page-header";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
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
          <AppSidebar variant="inset" />
          <SidebarInset>
            <PageHeader />
            <div className="flex flex-1 flex-col overflow-hidden">
              <div className="@container/main flex flex-1 flex-col gap-2 overflow-auto">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                  <SectionCards />
                  {/* <div className="px-4 lg:px-6">
                    <ChartAreaInteractive />
                  </div>
                  <DataTable data={data} /> */}
                </div>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </main>
    </div>
  );
}
