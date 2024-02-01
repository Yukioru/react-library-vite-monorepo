import { existsSync, rmSync } from 'node:fs';

import { buildSprites } from '@neodx/svg';

if (existsSync('public/.uikit')) {
  rmSync('public/.uikit', { recursive: true });
}

await buildSprites({
  root: 'src/assets',
  group: true,
  input: '**/*.svg',
  output: 'public/.uikit/sprites',
  fileName: '{name}.{hash:8}.svg',
  metadata: {
    path: 'src/sprite.gen.ts',
    runtime: {
      size: true,
      viewBox: true,
    },
  },
  resetColors: {
    exclude: [/^flags/, /^logos/, /-colored\.svg$/],
    replaceUnknown: 'currentColor',
  },
});
