import type { StorybookConfig } from "@storybook/nextjs";
// Removed Node.js-specific path resolution logic for Storybook v9 compatibility

const config: StorybookConfig = {
  stories: [
    "../apps/www/registry/elevenlabs-ui/ui/**/*.mdx",
    "../apps/www/registry/elevenlabs-ui/ui/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest"
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {
      nextConfigPath: "../apps/www/next.config.mjs"
    }
  },
  webpackFinal: async (config) => {
    if (config.resolve) {
      const path = require('path');
      config.resolve.alias = {
        ...config.resolve.alias,
        "@": path.resolve(__dirname, '../apps/www'),
      };
    }
    return config;
  },
};
export default config;