#!/usr/bin/env node
/**
 * Wissens-Shorts rendern oder prüfen – ohne ffmpeg vom System, mit einem einzigen Bundle.
 *
 *   node studio/scripts/wissen-render.mjs <ID> --bilder=0,60,120   → Probebilder (halbe Größe)
 *   node studio/scripts/wissen-render.mjs <ID>                     → MP4
 *
 * Ergebnis: studio/out/wissen/<ID>.mp4 bzw. <ID>-<frame>.jpg. Bundle wird danach gelöscht.
 */
import {renderMedia, renderStill, selectComposition} from '@remotion/renderer';
import {mkdirSync, rmSync} from 'node:fs';
import {resolve} from 'node:path';
import {bundleStudio, CHROMIUM, OUT, parseArgs} from './lib.mjs';

const {flags, rest} = parseArgs(process.argv.slice(2));
const id = rest[0];
if (!id) {
  console.error('Bitte Composition-ID angeben, z. B.: node studio/scripts/wissen-render.mjs Faecher-Beispiele --bilder=0,100');
  process.exit(1);
}
const dir = resolve(OUT, 'wissen');
mkdirSync(dir, {recursive: true});
const serveUrl = await bundleStudio();
try {
  const composition = await selectComposition({serveUrl, id, chromiumOptions: CHROMIUM});
  if (flags.bilder) {
    for (const frame of String(flags.bilder).split(',').map(Number)) {
      const output = resolve(dir, `${id}-${frame}.jpg`);
      await renderStill({serveUrl, composition, chromiumOptions: CHROMIUM, frame, output, imageFormat: 'jpeg', scale: 0.5});
      console.log(output);
    }
  } else {
    const output = resolve(dir, `${id}.mp4`);
    await renderMedia({serveUrl, composition, chromiumOptions: CHROMIUM, codec: 'h264', crf: 18, outputLocation: output, imageFormat: 'jpeg'});
    console.log(output);
  }
} finally {
  rmSync(serveUrl, {recursive: true, force: true});
}
