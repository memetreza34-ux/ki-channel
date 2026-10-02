import {bundle} from '@remotion/bundler';
import {resolve} from 'node:path';

export const ROOT = resolve(import.meta.dirname, '..', '..');
export const STUDIO = resolve(ROOT, 'studio');
export const OUT = resolve(STUDIO, 'out');

/** Liest `--name=wert` und freie Argumente. */
export const parseArgs = (argv) => {
  const flags = {};
  const rest = [];
  for (const arg of argv) {
    const m = arg.match(/^--([^=]+)(?:=(.*))?$/);
    if (m) flags[m[1]] = m[2] ?? true;
    else rest.push(arg);
  }
  return {flags, rest};
};

export const bundleStudio = async () => {
  process.stdout.write('Bundle wird gebaut … ');
  const serveUrl = await bundle({
    entryPoint: resolve(STUDIO, 'index.ts'),
    publicDir: resolve(STUDIO, 'public'),
  });
  console.log('fertig');
  return serveUrl;
};

/** "120-240" → [120, 240] */
export const parseRange = (value, max) => {
  if (!value) return [0, max - 1];
  const [a, b] = String(value).split('-').map(Number);
  return [Math.max(0, a), Math.min(max - 1, Number.isFinite(b) ? b : max - 1)];
};
