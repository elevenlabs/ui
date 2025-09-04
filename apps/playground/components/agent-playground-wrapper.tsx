"use client";

import { usePlaygroundSidebar } from "@/hooks/use-playground-sidebar";
import { AgentPlaygroundSidebar } from "@/components/agent-playground-sidebar";
import { cn } from "@elevenlabs/ui/lib/utils";
import { useIsMobile } from "@elevenlabs/ui/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@elevenlabs/ui/components/sheet";

export function AgentPlaygroundWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen, setIsOpen } = usePlaygroundSidebar();
  const isMobile = useIsMobile();

  // For mobile, use Sheet component as an overlay
  if (isMobile) {
    return (
      <div className="relative flex flex-1 overflow-hidden">
        <div className="relative flex flex-1 flex-col overflow-hidden">
          {children}
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent
            side="right"
            className="w-[300px] sm:w-[400px] p-0 overflow-hidden"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Logs</SheetTitle>
              <SheetDescription>View conversation logs</SheetDescription>
            </SheetHeader>
            <AgentPlaygroundSidebar side="right" className="h-full border-0" />
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  // For desktop, use the existing approach with responsive improvements
  return (
    <div className="relative flex flex-1 overflow-hidden">
      <div
        className={cn(
          "relative flex flex-1 flex-col overflow-hidden transition-all duration-200 ease-in-out"
        )}
        style={{
          marginRight: isOpen
            ? "min(var(--sidebar-secondary-width), 40vw)"
            : "0",
        }}
      >
        {children}
      </div>

      <div
        className={cn(
          "absolute top-0 right-0 bottom-0 bg-background border-l transition-transform duration-200 ease-in-out overflow-hidden",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        style={{
          width: "min(var(--sidebar-secondary-width), 40vw)",
        }}
      >
        <AgentPlaygroundSidebar side="right" className="h-full" />
      </div>
    </div>
  );
}
