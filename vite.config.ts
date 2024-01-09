import { resolve, extname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vite';
import { glob } from 'glob';
import react from '@vitejs/plugin-react-swc';
import dts from 'vite-plugin-dts';
import { libInjectCss } from 'vite-plugin-lib-inject-css';

const isProd = process.env.NODE_ENV === 'production';

const libraryName = 'uikit';
const scopeDevName = '[name]-[local]_[hash:base64:4]';
const scopeProdName = `${libraryName}-[local]_[hash:base64:12]`;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    libInjectCss(),
    dts({
      exclude: ['**/*.story.tsx', '**/*.test.tsx'],
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
            ignore: ['src/**/*.story.tsx', 'src/**/*.test.tsx'],
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
});
