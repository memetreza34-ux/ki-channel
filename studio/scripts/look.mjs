#!/usr/bin/env node
/**
 * Kontaktbogen: rendert Einzelbilder einer Composition und legt sie
 * beschriftet nebeneinander. So lässt sich ein Video in Sekunden ansehen.
 *
 *   npm run look -- So-Antwortet-KI                  12 Bilder über das ganze Video
 *   npm run look -- So-Antwortet-KI --count=8 --range=220-340   nur eine Szene
 *   npm run look -- So-Antwortet-KI --frames=0,45,90 einzelne Frames
 *
 * Ergebnis: studio/out/<ID>/look/sheet.jpg (+ Einzelbilder daneben)
 */
import {renderStill, selectComposition} from '@remotion/renderer';
import {execFileSync} from 'node:child_process';
import {mkdirSync, rmSync} from 'node:fs';
import {resolve} from 'node:path';
import {bundleStudio, OUT, parseArgs, parseRange} from './lib.mjs';

const {flags, rest} = parseArgs(process.argv.slice(2));
const id = rest[0];
if (!id) {
  console.error('Bitte Composition-ID angeben, z. B.: npm run look -- So-Antwortet-KI');
  process.exit(1);
}

const serveUrl = await bundleStudio();
const composition = await selectComposition({serveUrl, id});
const total = composition.durationInFrames;
const [from, to] = parseRange(flags.range, total);
const count = Number(flags.count ?? 12);
const frames = flags.frames
  ? String(flags.frames).split(',').map(Number)
  : Array.from({length: count}, (_, i) => Math.round(from + ((to - from) * (i + 0.5)) / count));

const dir = resolve(OUT, id, 'look');
rmSync(dir, {recursive: true, force: true});
mkdirSync(dir, {recursive: true});

const scale = Number(flags.scale ?? 0.5);
const labelled = [];
for (const frame of frames) {
  const raw = resolve(dir, `raw-${String(frame).padStart(5, '0')}.jpg`);
  const out = resolve(dir, `frame-${String(frame).padStart(5, '0')}.jpg`);
  await renderStill({serveUrl, composition, frame, output: raw, imageFormat: 'jpeg', jpegQuality: 88, scale});
  const label = `${frame}  ·  ${(frame / composition.fps).toFixed(1)}s`;
  execFileSync('ffmpeg', [
    '-loglevel', 'error', '-y', '-i', raw,
    '-vf', `drawbox=x=0:y=0:w=iw:h=44:color=black@0.55:t=fill,drawtext=text='${label}':x=14:y=10:fontsize=26:fontcolor=white`,
    out,
  ]);
  rmSync(raw);
  labelled.push(out);
  process.stdout.write(`${frame} `);
}
console.log('');

const vertical = composition.height > composition.width;
const cols = Math.min(frames.length, vertical ? 6 : 4);
const rows = Math.ceil(frames.length / cols);
const sheet = resolve(dir, 'sheet.jpg');
// Leere Kacheln im letzten Raster bleiben schwarz.
const tiles = [...labelled];
if (tiles.length < cols * rows) {
  const blank = resolve(dir, 'blank.jpg');
  const w = Math.round(composition.width * scale);
  const h = Math.round(composition.height * scale);
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'lavfi', '-i', `color=black:s=${w}x${h}`, '-frames:v', '1', blank]);
  while (tiles.length < cols * rows) tiles.push(blank);
}
const inputs = tiles.flatMap((f) => ['-i', f]);
const filter =
  tiles.map((_, i) => `[${i}]`).join('') +
  `xstack=inputs=${cols * rows}:layout=${Array.from({length: cols * rows}, (_, i) => {
    const c = i % cols;
    const r = Math.floor(i / cols);
    const x = c === 0 ? '0' : Array.from({length: c}, () => 'w0').join('+');
    const y = r === 0 ? '0' : Array.from({length: r}, () => 'h0').join('+');
    return `${x}_${y}`;
  }).join('|')}:fill=black`;
if (tiles.length === 1) execFileSync('cp', [tiles[0], sheet]);
else execFileSync('ffmpeg', ['-loglevel', 'error', '-y', ...inputs, '-filter_complex', filter, '-frames:v', '1', '-q:v', '3', sheet]);
console.log(`Kontaktbogen: ${sheet}`);
