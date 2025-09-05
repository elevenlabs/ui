export const siteConfig = {
  name: 'ElevenLabs Showcase',
  url: 'https://showcase.elevenlabs.io',
  ogImage: 'https://showcase.elevenlabs.io/og.jpg',
  description: 'A showcase of projects built with ElevenLabs',
  links: {
    twitter: 'https://twitter.com/elevenlabs',
    github: 'https://github.com/elevenlabs/showcase',
  },
  navItems: [
    {
      href: '/playground',
      label: 'Playground',
      includeSubPaths: true,
    },
    {
      href: '/docs',
      label: 'Docs',
      includeSubPaths: true,
    },
    {
      href: '/blocks',
      label: 'Audio Components',
      includeSubPaths: true,
    },
  ],
};

export const META_THEME_COLORS = {
  light: '#ffffff',
  dark: '#09090b',
};
