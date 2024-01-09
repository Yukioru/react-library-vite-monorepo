import { resolve, extname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';
import { glob } from 'glob';
import react from '@vitejs/plugin-react-swc';
import dts from 'vite-plugin-dts';
import browserslist from 'browserslist';
import { browserslistToTargets } from 'lightningcss';
import browserslistToEsbuild from 'browserslist-to-esbuild';

import pkg from './package.json';

const isProd = process.env.NODE_ENV === 'production';
const browserslistConfig = 'last 3 versions, not dead';
const scopeDevName = '[hash]_[name]_[local]';
const scopeProdName = `${pkg.name}-[hash]_[local]`;
const ignoreList = [
  'src/**/*.story.tsx',
  'src/**/*.test.tsx',
  'src/setupTest.ts',
  'src/**/*.d.ts',
];

const jsTargets = browserslistToEsbuild(browserslistConfig);
const cssTargets = browserslistToTargets(browserslist(browserslistConfig));

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  plugins: [
    react(),
    dts({
      exclude: ignoreList,
    }),
  ],
  css: {
    transformer: 'lightningcss',
    lightningcss: {
      targets: cssTargets,
      cssModules: {
        pattern: isProd ? scopeProdName : scopeDevName,
        dashedIdents: true,
      },
    },
  },
  build: {
    copyPublicDir: false,
    cssCodeSplit: false,
    ssrEmitAssets: true,
    cssMinify: 'lightningcss',
    minify: isProd,
    target: jsTargets,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime', 'react-dom', 'clsx'],
      input: Object.fromEntries(
        glob
          .sync('src/**/*.{ts,tsx}', {
            ignore: ignoreList,
          })
          .map(file => [
            relative('src', file.slice(0, file.length - extname(file).length)),
            fileURLToPath(new URL(file, import.meta.url)),
          ]),
      ),
      output: {
        assetFileNames: 'assets/[name][extname]',
        entryFileNames: '[name].js',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
  test: {
    testTimeout: 60_000,
    hookTimeout: 60_000,
    setupFiles: resolve(__dirname, 'src/setupTest.ts'),
    environment: 'jsdom',
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: ['**/*.story.tsx'],
    },
  },
});
