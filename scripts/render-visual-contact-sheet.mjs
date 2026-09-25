#!/usr/bin/env node

import {spawn} from 'node:child_process';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import {
  classifyFramePair,
  classifyVisualFrame,
  edgeDensity,
  meanAbsoluteRgbDifference,
  whitePixelRatio,
} from './visual-contact-metrics.mjs';
import {getVisualReviewPreset} from './visual-review-presets.mjs';

const args = new Map(
  process.argv.slice(2).map((entry) => {
    const [key, ...rest] = entry.replace(/^--/, '').split('=');
    return [key, rest.join('=') || 'true'];
  }),
);

const presetName = args.get('preset');
const preset = presetName ? getVisualReviewPreset(presetName) : null;
const compositionId = args.get('composition') ?? preset?.compositionId;
const framesRaw = args.get('frames');
const frames = framesRaw
  ? framesRaw.split(',').map((value) => Number(value.trim())).filter(Number.isInteger)
  : preset?.frames;
const outputDir = path.resolve(args.get('output') ?? preset?.outputDir ?? `out/visual-review/${compositionId ?? 'unknown'}`);
const entryPoint = path.resolve('ki/src/production-entry.tsx');

if (!compositionId) {
  throw new Error('missing --composition=<id> or --preset=<name>');
}
if (!frames || frames.length < 2) {
  throw new Error('visual review needs at least two sample frames');
}

const run = (command, commandArgs, label) => new Promise((resolvePromise, reject) => {
  console.log(`\n=== ${label} ===`);
  console.log(`$ ${command} ${commandArgs.join(' ')}`);
  const child = spawn(command, commandArgs, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: process.env,
  });
  child.on('error', reject);
  child.on('exit', (code, signal) => {
    if (code === 0) resolvePromise();
    else reject(new Error(`${label} failed (code=${code ?? 'null'}, signal=${signal ?? 'none'})`));
  });
});

await mkdir(outputDir, {recursive: true});
const frameDir = path.join(outputDir, 'frames');
await mkdir(frameDir, {recursive: true});

const frameFiles = [];
for (const frame of frames) {
  const file = path.join(frameDir, `frame-${String(frame).padStart(4, '0')}.png`);
  await run(
    'npx',
    ['--no-install', 'remotion', 'still', entryPoint, compositionId, file, `--frame=${frame}`, '--overwrite'],
    `Visual review frame ${frame}`,
  );
  frameFiles.push({frame, file});
}

const THUMB_W = 270;
const THUMB_H = 480;
const LABEL_H = 52;
const GAP = 18;
const COLS = frames.length <= 8 ? 2 : 3;
const ROWS = Math.ceil(frameFiles.length / COLS);
const sheetWidth = GAP + COLS * (THUMB_W + GAP);
const sheetHeight = GAP + ROWS * (THUMB_H + LABEL_H + GAP);

const composites = [];
const reports = [];
const normalizedBuffers = [];

for (let index = 0; index < frameFiles.length; index += 1) {
  const {frame, file} = frameFiles[index];
  const column = index % COLS;
  const row = Math.floor(index / COLS);
  const left = GAP + column * (THUMB_W + GAP);
  const top = GAP + row * (THUMB_H + LABEL_H + GAP);

  const thumb = await sharp(file).resize(THUMB_W, THUMB_H, {fit: 'cover'}).png().toBuffer();
  composites.push({input: thumb, left, top});
  const labelSvg = Buffer.from(`<svg width="${THUMB_W}" height="${LABEL_H}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#171421"/><text x="18" y="34" fill="#ffffff" font-size="22" font-family="Arial, sans-serif" font-weight="700">Frame ${frame}</text></svg>`);
  composites.push({input: labelSvg, left, top: top + THUMB_H});

  const normalized = await sharp(file)
    .resize(135, 240, {fit: 'cover'})
    .removeAlpha()
    .raw()
    .toBuffer({resolveWithObject: true});
  normalizedBuffers.push(normalized.data);
  const whiteRatio = whitePixelRatio(normalized.data, normalized.info.channels);
  const edgeRatio = edgeDensity(normalized.data, normalized.info.width, normalized.info.height, normalized.info.channels);
  reports.push({
    frame,
    whiteRatio: Number(whiteRatio.toFixed(4)),
    edgeDensity: Number(edgeRatio.toFixed(4)),
    warnings: classifyVisualFrame({whiteRatio, edgeRatio}),
  });
}

const pairReports = [];
for (let index = 1; index < normalizedBuffers.length; index += 1) {
  const difference = meanAbsoluteRgbDifference(normalizedBuffers[index - 1], normalizedBuffers[index], 3);
  pairReports.push({
    fromFrame: frames[index - 1],
    toFrame: frames[index],
    meanAbsoluteRgbDifference: Number(difference.toFixed(3)),
    warnings: classifyFramePair(difference),
  });
}

const sheetFile = path.join(outputDir, 'contact-sheet.jpg');
await sharp({create: {width: sheetWidth, height: sheetHeight, channels: 3, background: '#f2eff8'}})
  .composite(composites)
  .jpeg({quality: 90})
  .toFile(sheetFile);

const allWarnings = [
  ...reports.flatMap((entry) => entry.warnings.map((warning) => ({type: warning, frame: entry.frame}))),
  ...pairReports.flatMap((entry) => entry.warnings.map((warning) => ({type: warning, fromFrame: entry.fromFrame, toFrame: entry.toFrame}))),
];

const reportFile = path.join(outputDir, 'visual-review.json');
await writeFile(
  reportFile,
  `${JSON.stringify({compositionId, frames, sheetFile, frameReports: reports, pairReports, warnings: allWarnings}, null, 2)}\n`,
  'utf8',
);

console.log(`\nVISUAL CONTACT SHEET: ${sheetFile}`);
console.log(`VISUAL REVIEW REPORT: ${reportFile}`);
console.log(`Warnings: ${allWarnings.length}`);
console.log('These metrics are review signals, not an automatic creative PASS. Open the contact sheet and inspect it.');
