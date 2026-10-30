#!/usr/bin/env node
/**
 * Alle Shorts mit EINEM Bundle rendern (spart Platz und Zeit), Bundle danach löschen.
 *
 *   node studio/scripts/shorts-render.mjs [Short-Strom-Video …]
 *
 * Ergebnis: studio/out/shorts/<ID>.mp4
 */
import {renderMedia, selectComposition} from '@remotion/renderer';
import {mkdirSync, rmSync} from 'node:fs';
import {resolve} from 'node:path';
import {bundleStudio, CHROMIUM, OUT} from './lib.mjs';

const ALLE = ['Strom-Teewasser', 'Strom-Video', 'Strom-Atom', 'Luegt-Anwalt', 'Luegt-Raten', 'Luegt-Eiffel', 'Luegt-Sicher', 'Gpt6-Werkzeug'].map((s) => `Short-${s}`);
const ids = process.argv.slice(2).length ? process.argv.slice(2) : ALLE;
const dir = resolve(OUT, 'shorts');
mkdirSync(dir, {recursive: true});
const serveUrl = await bundleStudio();
try {
  for (const id of ids) {
    const composition = await selectComposition({serveUrl, id, chromiumOptions: CHROMIUM});
    const output = resolve(dir, `${id}.mp4`);
    await renderMedia({serveUrl, composition, chromiumOptions: CHROMIUM, codec: 'h264', crf: 20, outputLocation: output, imageFormat: 'jpeg', offthreadVideoCacheSizeInBytes: 150 * 1024 * 1024});
    console.log(`fertig: ${output}`);
  }
} finally {
  rmSync(serveUrl, {recursive: true, force: true});
}
