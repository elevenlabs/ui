"use client";

import { PlaygroundSidebar } from "@/components/playground-sidebar";
import { RightSidebarProvider } from "@/hooks/use-playground-sidebar";
import { SidebarInset } from "@elevenlabs/ui/components/sidebar";
import * as React from "react";

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RightSidebarProvider>
      <PlaygroundSidebar variant="inset" />
      <SidebarInset>{children}</SidebarInset>
    </RightSidebarProvider>
  );
}
