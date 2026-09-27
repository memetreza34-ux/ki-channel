#!/usr/bin/env node

import {spawn} from 'node:child_process';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {dirname, resolve, join} from 'node:path';
import sharp from 'sharp';
import {
  activeVisualCellRatio,
  classifyVisualFrameV4,
  edgeDensity,
  luminanceStdDev,
  meanAbsoluteRgbDifference,
  meanChroma,
  whitePixelRatio,
} from './visual-contact-metrics.mjs';
import {validateVisualQualityV4Manifest} from './visual-quality-v4-contract.mjs';
import {evaluateHookReview, evaluateSceneReview, summarizeV4Review} from './visual-quality-v4-review-contract.mjs';

const args = new Map(process.argv.slice(2).map((entry) => {
  const [key, ...rest] = entry.replace(/^--/, '').split('=');
  return [key, rest.join('=') || 'true'];
}));
const manifestArg = args.get('manifest');
if (!manifestArg) throw new Error('missing --manifest=<path-to-visual-quality-v4.json>');
const failOnSevere = args.get('fail-on-severe') !== 'false';
const manifestPath = resolve(manifestArg);
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const contractErrors = validateVisualQualityV4Manifest(manifest, {label: manifestArg});
if (contractErrors.length) throw new Error(`Visual Quality V4 contract invalid:\n${contractErrors.map((item) => `- ${item}`).join('\n')}`);

const projectDir = dirname(manifestPath);
const reelRoot = dirname(projectDir);
const outputDir = resolve(args.get('output') ?? join(reelRoot, '05-export', 'visual-review-v4'));
const frameDir = join(outputDir, 'frames');
await mkdir(frameDir, {recursive: true});
const entryPoint = resolve('ki/src/production-entry.tsx');

const run = (command, commandArgs, label) => new Promise((resolvePromise, reject) => {
  console.log(`\n=== ${label} ===`);
  console.log(`$ ${command} ${commandArgs.join(' ')}`);
  const child = spawn(command, commandArgs, {stdio: 'inherit', shell: process.platform === 'win32', env: process.env});
  child.on('error', reject);
  child.on('exit', (code, signal) => code === 0 ? resolvePromise() : reject(new Error(`${label} failed (code=${code ?? 'null'}, signal=${signal ?? 'none'})`)));
});

const clampFrame = (value) => Math.max(0, Math.round(value));
const uniqueSorted = (values) => [...new Set(values.map(clampFrame))].sort((a, b) => a - b);
const earlyHookFrames = uniqueSorted([0, manifest.fps * 0.2, manifest.fps * 0.5, manifest.fps]);
const sceneProgresses = [0.05, 0.33, 0.66, 0.92];
const sceneFrameMap = new Map();
for (const scene of manifest.scenes) {
  const last = Math.max(0, scene.durationFrames - 1);
  sceneFrameMap.set(scene.sceneId, uniqueSorted(sceneProgresses.map((progress) => scene.startFrame + Math.min(last, Math.round(last * progress)))));
}
const frames = uniqueSorted([...earlyHookFrames, ...[...sceneFrameMap.values()].flat()]);

for (const frame of frames) {
  const file = join(frameDir, `frame-${String(frame).padStart(5, '0')}.png`);
  await run('npx', ['--no-install', 'remotion', 'still', entryPoint, manifest.compositionId, file, `--frame=${frame}`, '--overwrite'], `V4 review frame ${frame}`);
}

const metricsByFrame = new Map();
const buffersByFrame = new Map();
for (const frame of frames) {
  const file = join(frameDir, `frame-${String(frame).padStart(5, '0')}.png`);
  const metadata = await sharp(file).metadata();
  const sourceWidth = metadata.width ?? 1080;
  const sourceHeight = metadata.height ?? 1920;
  const analysisHeight = Math.min(sourceHeight, Math.round(sourceWidth * 4 / 3));
  const normalized = await sharp(file)
    .extract({left: 0, top: 0, width: sourceWidth, height: analysisHeight})
    .resize(180, Math.max(1, Math.round(180 * analysisHeight / sourceWidth)), {fit: 'fill'})
    .removeAlpha()
    .raw()
    .toBuffer({resolveWithObject: true});
  const whiteRatio = whitePixelRatio(normalized.data, normalized.info.channels);
  const edgeRatio = edgeDensity(normalized.data, normalized.info.width, normalized.info.height, normalized.info.channels);
  const luminanceDeviation = luminanceStdDev(normalized.data, normalized.info.channels);
  const chroma = meanChroma(normalized.data, normalized.info.channels);
  const activeCells = activeVisualCellRatio(normalized.data, normalized.info.width, normalized.info.height, normalized.info.channels);
  const metrics = {
    frame,
    analysisCropHeight: analysisHeight,
    whiteRatio: Number(whiteRatio.toFixed(4)),
    edgeDensity: Number(edgeRatio.toFixed(4)),
    luminanceStdDev: Number(luminanceDeviation.toFixed(2)),
    meanChroma: Number(chroma.toFixed(2)),
    activeCellRatio: Number(activeCells.toFixed(4)),
    warnings: classifyVisualFrameV4({whiteRatio, edgeRatio, luminanceDeviation, chroma, activeCellRatio: activeCells}),
  };
  metricsByFrame.set(frame, metrics);
  buffersByFrame.set(frame, normalized.data);
}

const difference = (leftFrame, rightFrame) => {
  const left = buffersByFrame.get(leftFrame);
  const right = buffersByFrame.get(rightFrame);
  if (!left || !right || left.length !== right.length) return 0;
  return Number(meanAbsoluteRgbDifference(left, right, 3).toFixed(3));
};

const hookPairDifferences = [];
for (let index = 1; index < earlyHookFrames.length; index += 1) hookPairDifferences.push(difference(earlyHookFrames[index - 1], earlyHookFrames[index]));
const hookWarnings = evaluateHookReview({frame0: metricsByFrame.get(0), earlyPairDifferences: hookPairDifferences});

const sceneReports = manifest.scenes.map((scene) => {
  const sampleFrames = sceneFrameMap.get(scene.sceneId) ?? [];
  const samples = sampleFrames.map((frame) => metricsByFrame.get(frame)).filter(Boolean);
  const pairDifferences = [];
  for (let index = 1; index < sampleFrames.length; index += 1) pairDifferences.push(difference(sampleFrames[index - 1], sampleFrames[index]));
  const startEndDifference = sampleFrames.length >= 2 ? difference(sampleFrames[0], sampleFrames[sampleFrames.length - 1]) : 0;
  const warnings = evaluateSceneReview({scene, samples, pairDifferences, startEndDifference});
  return {sceneId: scene.sceneId, sampleFrames, samples, pairDifferences, startEndDifference, warnings};
});

const summary = summarizeV4Review({hookWarnings, sceneReports});

const thumbWidth = 216;
const thumbHeight = 384;
const labelHeight = 58;
const gap = 14;
const columns = 4;
const rows = Math.ceil(frames.length / columns);
const composites = [];
for (let index = 0; index < frames.length; index += 1) {
  const frame = frames[index];
  const column = index % columns;
  const row = Math.floor(index / columns);
  const left = gap + column * (thumbWidth + gap);
  const top = gap + row * (thumbHeight + labelHeight + gap);
  const file = join(frameDir, `frame-${String(frame).padStart(5, '0')}.png`);
  const thumb = await sharp(file).resize(thumbWidth, thumbHeight, {fit: 'cover'}).png().toBuffer();
  composites.push({input: thumb, left, top});
  const scene = manifest.scenes.find((candidate) => frame >= candidate.startFrame && frame < candidate.startFrame + candidate.durationFrames);
  const label = `${scene?.sceneId ?? 'HOOK'} · f${frame}`.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const svg = Buffer.from(`<svg width="${thumbWidth}" height="${labelHeight}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#171421"/><text x="10" y="35" fill="#ffffff" font-size="15" font-family="Arial, sans-serif" font-weight="700">${label}</text></svg>`);
  composites.push({input: svg, left, top: top + thumbHeight});
}
const sheetFile = join(outputDir, 'contact-sheet-v4.jpg');
await sharp({create: {width: gap + columns * (thumbWidth + gap), height: gap + rows * (thumbHeight + labelHeight + gap), channels: 3, background: '#f2eff8'}})
  .composite(composites)
  .jpeg({quality: 90})
  .toFile(sheetFile);

const report = {
  version: 4,
  manifestPath: manifestArg,
  compositionId: manifest.compositionId,
  frames,
  hook: {sampleFrames: earlyHookFrames, pairDifferences: hookPairDifferences, warnings: hookWarnings},
  scenes: sceneReports,
  ...summary,
  contactSheet: sheetFile,
};
const reportFile = join(outputDir, 'visual-review-v4.json');
await writeFile(reportFile, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

console.log(`\nV4 CONTACT SHEET: ${sheetFile}`);
console.log(`V4 REVIEW REPORT: ${reportFile}`);
console.log(`AUTOMATED VISUAL STATUS: ${summary.automatedStatus}`);
console.log(`HUMAN CREATIVE STATUS: ${summary.humanCreativeStatus}`);
for (const warning of summary.warnings) console.log(`- ${warning.scope}: ${warning.type}`);
console.log('Automated PASS never equals Human Creative PASS. The contact sheet must still be viewed before release.');

if (failOnSevere && summary.automatedStatus === 'FAIL') process.exit(1);
