import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { copyFile } from 'node:fs/promises';

import { glob } from 'glob';
import { UserConfig, defineConfig } from 'vitest/config';
import viteConfig from '@uikit/configs/vite';

export default defineConfig(
  viteConfig({
    currentDir: dirname(fileURLToPath(import.meta.url)),
    fileToURL: (file: string) => new URL(file, import.meta.url),
    callbacks: {
      async closeBundle() {
        const urls = glob.sync('src/**/*.css').map(file => {
          const url = new URL(file, import.meta.url);
          return url.pathname;
        });

        await Promise.all(
          urls.map(url => {
            const dest = url.replace('src', 'dist');
            return copyFile(url, dest);
          }),
        );

        console.log(
          urls
            .map(url => {
              const file = url.split('/src/')[1];
              return `dist/${file}`;
            })
            .join('\n'),
        );
      },
    },
  }) as UserConfig,
);
