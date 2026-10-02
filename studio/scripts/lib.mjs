import {bundle} from '@remotion/bundler';
import {readFileSync} from 'node:fs';
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

/**
 * Eingaben aus `--props=datei.json` (Ersteller-Beispiele) und `--format=…`.
 * Steuerfelder der Datei (vorlage, formate) werden entfernt.
 */
export const loadInputProps = (flags) => {
  const props = flags.props ? JSON.parse(readFileSync(resolve(String(flags.props)), 'utf8')) : {};
  delete props.vorlage;
  delete props.formate;
  if (flags.format) props.format = String(flags.format);
  return props;
};
