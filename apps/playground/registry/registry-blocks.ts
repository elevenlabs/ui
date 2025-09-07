import { type Registry } from 'shadcn/schema';

export const blocks: Registry['items'] = [
  {
    name: 'music-player',
    description: 'A music player with form and image.',
    type: 'registry:block',
    registryDependencies: ['button', 'card', 'input', 'label'],
    files: [
      {
        path: 'blocks/music-player/page.tsx',
        target: 'app/music/page.tsx',
        type: 'registry:page',
      },
      {
        path: 'blocks/music-player/components/music-player.tsx',
        type: 'registry:component',
      },
    ],
    categories: ['music'],
  },
];
