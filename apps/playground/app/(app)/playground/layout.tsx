"use client";

import { PlaygroundSidebar } from "@/components/playground-sidebar";
import { SidebarInset } from "@elevenlabs/ui/components/sidebar";
import * as React from "react";

type RightSidebarContextProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggle: () => void;
};

const RightSidebarContext =
  React.createContext<RightSidebarContextProps | null>(null);

export function usePlaygroundSidebar() {
  const context = React.useContext(RightSidebarContext);
  if (!context) {
    throw new Error(
      "usePlaygroundSidebar must be used within a RightSidebarProvider."
    );
  }
  return context;
}

function RightSidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggle = React.useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const contextValue = React.useMemo(
    () => ({
      isOpen,
      setIsOpen,
      toggle,
    }),
    [isOpen, setIsOpen, toggle]
  );

  return (
    <RightSidebarContext.Provider value={contextValue}>
      {children}
    </RightSidebarContext.Provider>
  );
}
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
