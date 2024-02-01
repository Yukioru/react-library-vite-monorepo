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
const defaultExternals = ['react', 'react/jsx-runtime', 'react-dom'];

// https://rollupjs.org/plugin-development/#build-hooks
const rollupHooks = [
  'buildStart',
  'buildEnd',
  'closeWatcher',
  'load',
  'moduleParsed',
  'onLog',
  'options',
  'resolveDynamicImport',
  'resolveId',
  'shouldTransformCachedModule',
  'transform',
  'watchChange',
  'augmentChunkHash',
  'banner',
  'closeBundle',
  'footer',
  'generateBundle',
  'intro',
  'outputOptions',
  'outro',
  'renderChunk',
  'renderDynamicImport',
  'renderError',
  'renderStart',
  'resolveFileUrl',
  'resolveImportMeta',
  'writeBundle',
];

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

function composeRollupHooks(callbacks = {}, defaultCallbacks = {}) {
  const output = defaultCallbacks;
  const composed = rollupHooks.reduce((acc, hook) => {
    if (callbacks[hook]) {
      acc[hook] = callbacks[hook];
    }

    return acc;
  }, {});

  Object.entries(composed).forEach(([hook, handler]) => {
    if (defaultCallbacks[hook]) {
      const parentHandler = defaultCallbacks[hook].handler;
      const newHandler = handler;
      output[hook] = {
        ...defaultCallbacks[hook],
        handler: async (...args) => {
          await newHandler(...args);
          await parentHandler(...args);
        },
      };
    } else {
      output[hook] = {
        order: 'post',
        handler,
      };
    }
  });

  return output;
}

/** @type {import('vitest/config').UserConfig} */
export default ({
  currentDir,
  fileToURL,
  cssCodeSplit = false,
  externals = defaultExternals,
  callbacks = {},
  plugins = [],
}) => ({
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
    {
      name: 'custom-plugin',
      ...composeRollupHooks(callbacks),
    },
    ...plugins,
  ],
  build: {
    copyPublicDir: false,
    cssCodeSplit,
    ssrEmitAssets: true,
    minify: isProd,
    target: jsTargets,
    lib: {
      entry: resolve(currentDir, 'src/index.ts'),
    },
    rollupOptions: {
      external: Array.from(new Set([...externals, ...defaultExternals])),
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
