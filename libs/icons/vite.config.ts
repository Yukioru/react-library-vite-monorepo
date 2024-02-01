import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { rmSync, existsSync } from 'node:fs';

import fse from 'fs-extra';
import { UserConfig, defineConfig } from 'vitest/config';
import viteConfig from '@uikit/configs/vite';

export default defineConfig(
  viteConfig({
    currentDir: dirname(fileURLToPath(import.meta.url)),
    fileToURL: (file: string) => new URL(file, import.meta.url),
    callbacks: {
      buildStart() {
        if (existsSync('dist/.uikit')) {
          rmSync('dist/.uikit', { recursive: true });
        }
        if (existsSync('dist/scripts')) {
          rmSync('dist/scripts', { recursive: true });
        }
      },
      closeBundle() {
        fse.copySync(
          join(__dirname, 'public/.uikit'),
          join(__dirname, 'dist/.uikit'),
        );
        fse.copySync(
          join(__dirname, 'scripts'),
          join(__dirname, 'dist/scripts'),
        );

        console.log('Copied .uikit and scripts to dist/');
      },
    },
  }) as UserConfig,
);
