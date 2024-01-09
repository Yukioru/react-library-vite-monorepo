# React Library Vite template

Charged with Storybook, CSS Modules, Husky, Lint-staged, Vite, LightningCSS and more.

## How to ..

### ..install

1. `pnpm i`
2. `pnpm dev`
3. `pnpm test`
4. `pnpm build`

### ..use

1. Import `style.css` into your project

```js
import 'uikit/assets/style.css';
```

2. Import and use components

```js
import { Button } from 'uikit';
...

return (
  <Button>Example</Button>
);
```

## Structure

```
src
├── components
│   ├── Button
│   │   ├── Button.module.css - // CSS Modules styles for component
│   │   ├── Button.story.tsx - -// Stories docs for component
│   │   ├── Button.test.tsx - - // Unit tests for component
│   │   ├── Button.tsx - - - - -// React Component
│   │   └── index.ts - - - - - -// Barrel file with re-exports
│   └── Surface
│       ├── Surface.module.css -// CSS Modules styles for component
│       ├── Surface.story.tsx - // Stories docs for component
│       ├── Surface.test.tsx - -// Unit tests for component
│       ├── Surface.tsx - - - - // React Component
│       └── index.ts - - - - - -// Barrel file with re-exports
├── styles
│    └── theme.css - - - - - - - // Theme with CSS variables
│
├── global.d.ts - - - - - - - - // Global typings for correct CSS Modules types
├── index.ts - - - - - - - - - -// Entry Barrel file with re-exports
└── setupTest.ts - - - - - - - -// Utility file to set-up tests environment

```
