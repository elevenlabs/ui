"use client";

import { Terminal } from "lucide-react";
import * as React from "react";

import { EmptyState } from "@/components/empty-state";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@elevenlabs/ui/components/sidebar";

interface LogItem {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  time: string;
}

interface LogGroup {
  name: string;
  items: LogItem[];
}

const data: { logs: LogGroup[] } = {
  logs: [],
};

export function AgentPlaygroundSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="none"
      className={cn("h-full !bg-background overflow-hidden", props.className)}
      widthVar="--sidebar-secondary-width"
      {...props}
    >
      <SidebarHeader className="!bg-background">
        <div className="flex items-center justify-between px-2 py-2">
          <h2 className="text-sm font-bold">Logs</h2>
        </div>
      </SidebarHeader>
      <SidebarContent className="!bg-background overflow-y-auto">
        {data.logs.length === 0 ? (
          <EmptyState icon={Terminal} message="Logs will appear here" />
        ) : (
          data.logs.map((group) => (
            <SidebarGroup key={group.name}>
              <SidebarGroupLabel>{group.name}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton>
                        <item.icon className="size-4 shrink-0" />
                        <div className="flex flex-col items-start min-w-0">
                          <span className="text-sm truncate w-full">
                            {item.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {item.time}
                          </span>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))
        )}
      </SidebarContent>
    </Sidebar>
  );
}
