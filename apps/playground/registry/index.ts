import { registryItemSchema, type Registry } from 'shadcn/schema';
import { z } from 'zod';

import { blocks } from '@/registry/registry-blocks';

// Shared between index and style for backward compatibility.
const NEW_YORK_V4_STYLE = {
  type: 'registry:style',
  dependencies: ['class-variance-authority', 'lucide-react'],
  devDependencies: ['tw-animate-css'],
  registryDependencies: ['utils'],
  cssVars: {},
  files: [],
};

export const registry = {
  name: 'shadcn/ui',
  homepage: 'https://ui.shadcn.com',
  items: z.array(registryItemSchema).parse(
    [
      {
        name: 'index',
        ...NEW_YORK_V4_STYLE,
      },
      {
        name: 'style',
        ...NEW_YORK_V4_STYLE,
      },
      ...blocks,
    ].map(item => {
      // Temporary fix for dashboard-01.
      if (item.name === 'dashboard-01') {
        item.dependencies?.push('@tabler/icons-react');
      }

      if (item.name === 'accordion' && 'tailwind' in item) {
        delete item.tailwind;
      }

      return item;
    }),
  ),
} satisfies Registry;
