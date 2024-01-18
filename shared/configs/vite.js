import { resolve, extname, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { glob } from 'glob';
import react from '@vitejs/plugin-react-swc';
import dts from 'vite-plugin-dts';
import browserslistToEsbuild from 'browserslist-to-esbuild';

const isProd = process.env.NODE_ENV === 'production';
const browserslistConfig = 'last 3 versions, not dead';
const ignoreList = ['src/**/*.story.tsx', 'src/**/*.test.tsx', 'src/**/*.d.ts'];

const jsTargets = browserslistToEsbuild(browserslistConfig);
const outputFormats = ['es', 'cjs'];

function generateOutputRules(formats = []) {
  const rest = {
    assetFileNames: '[name][extname]',
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
  };

  const mapping = {
    es: 'js',
    cjs: 'cjs',
  };

  return formats.map(format => ({
    format,
    entryFileNames: `[name].${mapping[format]}`,
    ...rest,
  }));
}

export default ({ currentDir, fileToURL }) => ({
  resolve: {
    alias: {
      '@': resolve(currentDir, './src'),
    },
  },
  plugins: [
    react(),
    dts({
      exclude: ignoreList,
      insertTypesEntry: true,
    }),
  ],
  build: {
    copyPublicDir: false,
    cssCodeSplit: false,
    ssrEmitAssets: true,
    minify: isProd,
    target: jsTargets,
    lib: {
      entry: resolve(currentDir, 'src/index.ts'),
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime', 'react-dom'],
      input: Object.fromEntries(
        glob
          .sync('src/**/*.{ts,tsx}', {
            ignore: ignoreList,
          })
          .map(file => [
            relative('src', file.slice(0, file.length - extname(file).length)),
            fileURLToPath(fileToURL(file)),
          ]),
      ),
      output: generateOutputRules(outputFormats),
    },
  },
  test: {
    testTimeout: 60_000,
    hookTimeout: 60_000,
    setupFiles: resolve(
      dirname(fileURLToPath(import.meta.url)),
      'setupTest.js',
    ),
    environment: 'jsdom',
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: ['**/*.story.tsx'],
    },
  },
});
