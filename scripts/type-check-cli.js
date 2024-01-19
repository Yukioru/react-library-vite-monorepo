import { readFileSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const checkingFile = process.argv[2];

if (!checkingFile) {
  process.exit(0);
}

const configFile = import.meta.resolve('@uikit/configs/tsconfig.json');
const { pathname } = new URL(configFile, import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url)).replace(
  '/scripts',
  '/',
);
const pathToConfigsDir = pathname
  .replace('/tsconfig.json', '/')
  .replace(__dirname, './');
const config = JSON.parse(readFileSync(pathname, 'utf8'));

function getIndexOfRelativePath(array) {
  if (!Array.isArray(array)) return -1;
  return array.findIndex(
    val => val.startsWith('./') && !val.includes('node_modules'),
  );
}

const flagsArr = Object.entries(config.compilerOptions).map(([key, value]) => {
  if (typeof value === 'boolean') {
    return `--${key}`;
  }

  const indexRelative = getIndexOfRelativePath(value);
  if (Array.isArray(value) && indexRelative >= 0) {
    value[indexRelative] = value[indexRelative].replace('./', pathToConfigsDir);
  }

  return `--${key} ${value}`;
});

exec(
  `./node_modules/.bin/tsc --noEmit ${flagsArr.join(' ')} ${checkingFile}`,
  (err, stdout, stderr) => {
    process.stdout.write(stdout);
    if (stderr || err) {
      process.exit(1);
    }
  },
);
