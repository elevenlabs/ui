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
  {
    name: 'bar-visualizer',
    description: 'Audio visualizer with animated bars for voice assistants.',
    type: 'registry:block',
    registryDependencies: [],
    files: [
      {
        path: 'blocks/bar-visualizer/page.tsx',
        target: 'app/bar-visualizer/page.tsx',
        type: 'registry:page',
      },
      {
        path: 'blocks/bar-visualizer/components/bar-visualizer.tsx',
        type: 'registry:component',
      },
      {
        path: 'hooks/use-bar-animator.tsx',
        type: 'registry:component',
      },
      {
        path: 'hooks/use-audio-volume.tsx',
        type: 'registry:component',
      },
    ],
    categories: ['audio-visualization'],
  },
];
