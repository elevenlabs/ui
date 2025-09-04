"use client";

import { Button } from "@elevenlabs/ui/components/button";
import { usePlaygroundSidebar } from "@/app/(app)/playground/layout";
import { IconLogs } from "@tabler/icons-react";
export function ViewLogsButton() {
  const { toggle, isOpen } = usePlaygroundSidebar();

  return (
    <Button variant="secondary" size="sm" onClick={toggle}>
      <IconLogs className="size-4" />
      {isOpen ? "Hide Logs" : "View Logs"}
    </Button>
  );
}
