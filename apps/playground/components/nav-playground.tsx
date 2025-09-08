'use client';

import { type Icon } from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@elevenlabs/ui/components/sidebar';

export function NavPlayground({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon | React.ReactElement;
    disabled?: boolean;
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Playground</SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map(item => {
            const isActive =
              pathname === item.url || pathname.startsWith(item.url + '/');

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  isActive={isActive}
                  asChild
                  disabled={item.disabled}
                >
                  <Link href={item.url}>
                    {item.icon &&
                      (React.isValidElement(item.icon) ? (
                        item.icon
                      ) : (
                        <item.icon />
                      ))}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
