'use client';

import { Icons } from '@/components/icons';
import {
  IconCamera,
  IconFileAi,
  IconFileDescription,
  IconHelp,
  IconSearch,
  IconSettings,
} from '@tabler/icons-react';
import * as React from 'react';

import { NavPlayground } from '@/components/nav-playground';
import { NavSecondary } from '@/components/nav-secondary';
import { Sidebar, SidebarContent } from '@elevenlabs/ui/components/sidebar';

const data = {
  navMain: [
    {
      title: 'Agents',
      url: '/playground/agents',
      icon: <Icons.orb className="text-foreground" />,
    },
    {
      title: 'Text to Speech',
      url: '/playground/text-to-speech',
      icon: <Icons.textToSpeech className="text-foreground" />,
    },

    {
      title: 'Speech to Text',
      url: '/playground/speech-to-text',
      icon: <Icons.speechToText className="text-foreground" />,
    },
  ],
  navClouds: [
    {
      title: 'Capture',
      icon: IconCamera,
      isActive: true,
      url: '#',
      items: [
        {
          title: 'Active Proposals',
          url: '#',
        },
        {
          title: 'Archived',
          url: '#',
        },
      ],
    },
    {
      title: 'Proposal',
      icon: IconFileDescription,
      url: '#',
      items: [
        {
          title: 'Active Proposals',
          url: '#',
        },
        {
          title: 'Archived',
          url: '#',
        },
      ],
    },
    {
      title: 'Prompts',
      icon: IconFileAi,
      url: '#',
      items: [
        {
          title: 'Active Proposals',
          url: '#',
        },
        {
          title: 'Archived',
          url: '#',
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: 'Settings',
      url: '#',
      icon: IconSettings,
    },
    {
      title: 'Get Help',
      url: '#',
      icon: IconHelp,
    },
    {
      title: 'Search',
      url: '#',
      icon: IconSearch,
    },
  ],
  navPlayground: [
    {
      name: 'Capture',
      url: '#',
      icon: IconCamera,
    },
  ],
};

export function PlaygroundSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarContent>
        <NavPlayground items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  );
}
