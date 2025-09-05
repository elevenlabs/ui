import { type Registry } from 'shadcn/schema';

export const blocks: Registry['items'] = [
  {
    name: 'dashboard-01',
    type: 'registry:block',
    description: 'A dashboard with sidebar, charts and data table.',
    dependencies: [
      '@dnd-kit/core',
      '@dnd-kit/modifiers',
      '@dnd-kit/sortable',
      '@dnd-kit/utilities',
      '@tanstack/react-table',
      'zod',
    ],
    registryDependencies: [
      'sidebar',
      'breadcrumb',
      'separator',
      'label',
      'chart',
      'card',
      'select',
      'tabs',
      'table',
      'toggle-group',
      'badge',
      'button',
      'checkbox',
      'dropdown-menu',
      'drawer',
      'input',
      'avatar',
      'sheet',
      'sonner',
    ],
    files: [
      {
        path: 'blocks/dashboard-01/page.tsx',
        type: 'registry:page',
        target: 'app/dashboard/page.tsx',
      },
      {
        path: 'blocks/dashboard-01/data.json',
        type: 'registry:file',
        target: 'app/dashboard/data.json',
      },
      {
        path: 'blocks/dashboard-01/components/app-sidebar.tsx',
        type: 'registry:component',
      },
      {
        path: 'blocks/dashboard-01/components/nav-main.tsx',
        type: 'registry:component',
      },
      {
        path: 'blocks/dashboard-01/components/nav-secondary.tsx',
        type: 'registry:component',
      },
      {
        path: 'blocks/dashboard-01/components/nav-user.tsx',
        type: 'registry:component',
      },
      {
        path: 'blocks/dashboard-01/components/section-cards.tsx',
        type: 'registry:component',
      },
      {
        path: 'blocks/dashboard-01/components/site-header.tsx',
        type: 'registry:component',
      },
    ],
    categories: ['dashboard'],
    meta: {
      iframeHeight: '1000px',
    },
  },
];
