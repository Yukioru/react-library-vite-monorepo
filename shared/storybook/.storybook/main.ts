import { resolve } from 'node:path';
import type { StorybookConfig } from '@storybook/react-vite';
import { withoutVitePlugins } from '@storybook/builder-vite';

const config: StorybookConfig = {
  stories: ['../../../**/*.story.@(ts|tsx)'],
  staticDirs: ['../public'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  viteFinal: async config => {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...(config.resolve?.alias || {}),
          '@theme.css': resolve(
            __dirname,
            '../node_modules/@uikit/theme/src/theme.css',
          ),
          '@tailwind-globals.css': resolve(
            __dirname,
            '../node_modules/@uikit/theme/src/tailwind-globals.css',
          ),
        },
      },
      plugins: await withoutVitePlugins(config.plugins, [
        'vite:lib-inject-css',
      ]),
    };
  },
};

export default config;
