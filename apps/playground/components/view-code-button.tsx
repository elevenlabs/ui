"use client";

import { Button } from "@elevenlabs/ui/components/button";
import { usePlaygroundSidebar } from "@/hooks/use-playground-sidebar";
import { IconCode, IconLogs } from "@tabler/icons-react";
export function ViewCodeButton() {
  const { toggle, isOpen } = usePlaygroundSidebar();

  return (
    <Button variant="secondary" size="sm" onClick={toggle}>
      <IconCode className="size-4" />
      {isOpen ? "Hide Code" : "View Code"}
    </Button>
  );
}
