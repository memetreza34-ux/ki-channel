#!/usr/bin/env node
/**
 * Rendert eine Composition als MP4 nach studio/out/<ID>.mp4.
 *
 *   npm run render -- So-Antwortet-KI
 *   npm run render -- So-Antwortet-KI --range=0-300   nur ein Ausschnitt (Probe)
 */
import {renderMedia, selectComposition} from '@remotion/renderer';
import {mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {bundleStudio, OUT, parseArgs, parseRange} from './lib.mjs';

const {flags, rest} = parseArgs(process.argv.slice(2));
const id = rest[0];
if (!id) {
  console.error('Bitte Composition-ID angeben, z. B.: npm run render -- So-Antwortet-KI');
  process.exit(1);
}

const serveUrl = await bundleStudio();
const composition = await selectComposition({serveUrl, id});
const frameRange = flags.range ? parseRange(flags.range, composition.durationInFrames) : null;
mkdirSync(OUT, {recursive: true});
const outputLocation = resolve(OUT, frameRange ? `${id}_${frameRange[0]}-${frameRange[1]}.mp4` : `${id}.mp4`);

let last = -1;
await renderMedia({
  serveUrl,
  composition,
  codec: 'h264',
  crf: 18,
  jpegQuality: 92,
  frameRange,
  outputLocation,
  onProgress: ({progress}) => {
    const pct = Math.floor(progress * 100);
    if (pct % 10 === 0 && pct !== last) {
      last = pct;
      process.stdout.write(`${pct}% `);
    }
  },
});
console.log(`\nVideo: ${outputLocation}`);
