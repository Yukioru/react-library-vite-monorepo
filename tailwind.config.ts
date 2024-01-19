import path from 'node:path';

import type { Config } from 'tailwindcss';

import tailwindTheme from '@uikit/theme/tailwind-theme';

const config: Config = {
  content: [path.join(__dirname, 'libs/**/*.{js,ts,jsx,tsx}')],
  presets: [tailwindTheme],
};

export default config;
