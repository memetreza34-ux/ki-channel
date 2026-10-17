#!/usr/bin/env node
/**
 * Einzelbild als PNG – für Thumbnails, Cover-Bilder, Vorschau.
 *
 *   npm run still -- So-Antwortet-KI --frame=90
 *
 * Ergebnis: studio/out/<ID>/still-<frame>.png in voller Auflösung.
 */
import {renderStill, selectComposition} from '@remotion/renderer';
import {mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {bundleStudio, CHROMIUM, loadInputProps, OUT, parseArgs} from './lib.mjs';

const {flags, rest} = parseArgs(process.argv.slice(2));
const id = rest[0];
if (!id) {
  console.error('Bitte Composition-ID angeben, z. B.: npm run still -- So-Antwortet-KI --frame=90');
  process.exit(1);
}
const frame = Number(flags.frame ?? 0);
const serveUrl = await bundleStudio();
const inputProps = loadInputProps(flags);
const composition = await selectComposition({serveUrl, id, inputProps, chromiumOptions: CHROMIUM});
const dir = resolve(OUT, id);
mkdirSync(dir, {recursive: true});
const output = resolve(dir, `still-${frame}.png`);
await renderStill({serveUrl, composition, chromiumOptions: CHROMIUM, inputProps, frame, output, imageFormat: 'png'});
console.log(`Bild: ${output}`);
