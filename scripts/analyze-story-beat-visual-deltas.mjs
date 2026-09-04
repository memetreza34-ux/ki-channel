#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import sharp from 'sharp';

const args = process.argv.slice(2);
const manifestArg = args.find((arg) => !arg.startsWith('--'));
if (!manifestArg) {
  console.error('Usage: node scripts/analyze-story-beat-visual-deltas.mjs <story-beat-manifest.json> [--threshold=0.012] [--strict]');
  process.exit(1);
}
const option = (name, fallback) => {
  const prefix = `--${name}=`;
  const found = args.find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : fallback;
};
const threshold = Number(option('threshold', '0.012'));
const strict = args.includes('--strict');
if (!Number.isFinite(threshold) || threshold <= 0 || threshold >= 1) throw new Error(`Invalid threshold: ${threshold}`);

const root = process.cwd();
const manifestPath = path.resolve(root, manifestArg);
if (!existsSync(manifestPath)) throw new Error(`Manifest not found: ${manifestPath}`);
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const beats = Array.isArray(manifest?.beats) ? manifest.beats : [];
if (beats.length < 2) throw new Error('At least two rendered story beats are required.');

const load = async (relativeFile) => {
  const file = path.resolve(root, relativeFile);
  if (!existsSync(file)) throw new Error(`Beat image missing: ${file}`);
  const {data, info} = await sharp(file)
    .resize({width: 180, height: 320, fit: 'fill'})
    .removeAlpha()
    .raw()
    .toBuffer({resolveWithObject: true});
  return {data, info};
};

const classify = (score) => {
  if (score < threshold) return 'SUSPICIOUS_STATIC';
  if (score < 0.025) return 'SUBTLE_CHANGE';
  if (score < 0.06) return 'VISIBLE_CHANGE';
  return 'STRONG_CHANGE';
};

const pairs = [];
let suspicious = 0;
let previousImage = await load(beats[0].file);
for (let i = 1; i < beats.length; i += 1) {
  const currentImage = await load(beats[i].file);
  if (currentImage.data.length !== previousImage.data.length) throw new Error('Normalized image buffer sizes differ unexpectedly.');
  let absSum = 0;
  let changed = 0;
  const pixelThreshold = 8;
  for (let offset = 0; offset < currentImage.data.length; offset += 1) {
    const delta = Math.abs(currentImage.data[offset] - previousImage.data[offset]);
    absSum += delta;
    if (delta > pixelThreshold) changed += 1;
  }
  const normalizedMeanAbsoluteDelta = absSum / currentImage.data.length / 255;
  const changedChannelRatio = changed / currentImage.data.length;
  const classification = classify(normalizedMeanAbsoluteDelta);
  if (classification === 'SUSPICIOUS_STATIC') suspicious += 1;
  pairs.push({
    from: beats[i - 1].id,
    to: beats[i].id,
    fromFrame: beats[i - 1].frame,
    toFrame: beats[i].frame,
    sameScene: beats[i - 1].sceneId === beats[i].sceneId,
    normalizedMeanAbsoluteDelta: Number(normalizedMeanAbsoluteDelta.toFixed(5)),
    changedChannelRatio: Number(changedChannelRatio.toFixed(5)),
    classification,
  });
  previousImage = currentImage;
}

const report = {
  version: 1,
  sourceManifest: path.relative(root, manifestPath),
  generatedAt: new Date().toISOString(),
  method: {
    normalizedSize: '180x320',
    score: 'mean absolute RGB channel delta normalized to 0..1',
    suspiciousThreshold: threshold,
    note: 'This is a diagnostic signal only. A high pixel delta does not prove good storytelling, and a low delta may be intentional if manually justified.'
  },
  summary: {
    comparedPairs: pairs.length,
    suspiciousStaticPairs: suspicious,
    strict,
  },
  pairs,
};

const outputPath = path.join(path.dirname(manifestPath), 'visual-delta-report.json');
await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

for (const pair of pairs) {
  console.log(`${pair.from} -> ${pair.to}: ${pair.normalizedMeanAbsoluteDelta.toFixed(5)} ${pair.classification}${pair.sameScene ? '' : ' [SCENE CHANGE]'}`);
}
console.log(`VISUAL DELTA REPORT: ${path.relative(root, outputPath)}`);
console.log(`suspicious static pairs: ${suspicious}/${pairs.length}`);

if (strict && suspicious > 0) process.exit(2);
