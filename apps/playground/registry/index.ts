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
  name: '@elevenlabs/audio-components',
  homepage: 'https://elevenlabs.io',
  items: z.array(registryItemSchema).parse([
    {
      name: 'index',
      ...NEW_YORK_V4_STYLE,
    },
    {
      name: 'style',
      ...NEW_YORK_V4_STYLE,
    },
    ...blocks,
  ]),
} satisfies Registry;
