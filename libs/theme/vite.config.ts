import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { UserConfig, defineConfig } from 'vitest/config';
import viteConfig from '@uikit/configs/vite';

export default defineConfig(
  viteConfig({
    currentDir: dirname(fileURLToPath(import.meta.url)),
    fileToURL: (file: string) => new URL(file, import.meta.url),
  }) as UserConfig,
);
