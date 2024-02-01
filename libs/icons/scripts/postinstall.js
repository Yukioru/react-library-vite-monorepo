import { existsSync, unlinkSync, symlinkSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import fse from 'fs-extra';
import { sync } from 'glob';

const __dirname = join(dirname(fileURLToPath(import.meta.url)), '..');
const cwd = process.cwd();

const [commandMode, mode] = (process.argv[2] || '=').split('=');

if (commandMode !== '--mode') {
  console.error('Invalid command mode');
  process.exit(1);
}

const folderName = '.uikit';
const devPath = `public/${folderName}`;
const buildPath = `dist/${folderName}`;

const publicPaths = sync('**/public', {
  cwd: cwd,
  absolute: true,
  maxDepth: 4,
  ignore: [
    '**/node_modules/**',
    '**/dist/**',
    '**/.git/**',
    '**/.next/**',
    '**/.vercel/**',
    '**/.vscode/**',
    '**/.idea/**',
    '**/build/**',
  ],
});
console.log(publicPaths);
const closestPublicPath = publicPaths[0];

const destination = join(closestPublicPath, folderName);

try {
  if (mode === 'dev') {
    if (existsSync(destination)) {
      unlinkSync(destination);
    }
    symlinkSync(join(__dirname, devPath), destination, 'dir');
  } else {
    fse.copySync(join(__dirname, buildPath), destination);
  }
} catch (error) {
  console.error(error);
  process.exit(1);
}
