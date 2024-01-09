import { resolve, extname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';
import { glob } from 'glob';
import react from '@vitejs/plugin-react-swc';
import dts from 'vite-plugin-dts';
import { libInjectCss } from 'vite-plugin-lib-inject-css';

const isProd = process.env.NODE_ENV === 'production';

const libraryName = 'uikit';
const scopeDevName = '[name]-[local]_[hash:base64:4]';
const scopeProdName = `${libraryName}-[local]_[hash:base64:12]`;
const ignoreList = [
  'src/**/*.story.tsx',
  'src/**/*.test.tsx',
  'src/setupTest.ts',
];

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  plugins: [
    react(),
    libInjectCss(),
    dts({
      exclude: ignoreList,
    }),
  ],
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
      generateScopedName: isProd ? scopeProdName : scopeDevName,
    },
  },
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime', 'react-dom'],
      input: Object.fromEntries(
        glob
          .sync('src/**/*.{ts,tsx}', {
            ignore: ignoreList,
          })
          .map(file => {
            console.log('file', file);
            return [
              relative(
                'src',
                file.slice(0, file.length - extname(file).length),
              ),
              fileURLToPath(new URL(file, import.meta.url)),
            ];
          }),
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
