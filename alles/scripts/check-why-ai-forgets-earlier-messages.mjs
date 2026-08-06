import {readFileSync, statSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import sharp from 'sharp';
import {getWhyAIForgetsRenderConfig} from './why-ai-forgets-render-config.mjs';

const config = getWhyAIForgetsRenderConfig(process.argv[2]);
const errors = [];
const images = [];

const validateImage = async (file, label) => {
  try {
    const stats = statSync(file);
    const metadata = await sharp(file).metadata();
    if (metadata.width !== config.width || metadata.height !== config.height) {
      errors.push(`${label}: ${metadata.width}x${metadata.height} statt ${config.width}x${config.height}`);
    }
    if (stats.size < 1024) errors.push(`${label}: Datei ist zu klein (${stats.size} Bytes)`);
    images.push({label, file, width: metadata.width, height: metadata.height, size: stats.size});
  } catch (error) {
    errors.push(`${label}: ${error instanceof Error ? error.message : String(error)}`);
  }
};

for (const frame of config.checkpoints) {
  await validateImage(resolve(config.stillOutput, `frame-${String(frame).padStart(4, '0')}.png`), `Frame ${frame}`);
}
await validateImage(config.coverOutput, 'Cover');

try {
  const selected = config.smokeCheckpoints.slice(0, 8);
  const tiles = [];
  for (const [index, frame] of selected.entries()) {
    const source = resolve(config.stillOutput, `frame-${String(frame).padStart(4, '0')}.png`);
    const buffer = await sharp(source).resize(270, 480, {fit: 'cover'}).png().toBuffer();
    tiles.push({input: buffer, left: (index % 4) * 270, top: Math.floor(index / 4) * 480});
  }
  await sharp({create: {width: 1080, height: 960, channels: 4, background: '#F8F7FB'}})
    .composite(tiles)
    .png()
    .toFile(config.contactSheetOutput);
} catch (error) {
  errors.push(`Kontaktbogen: ${error instanceof Error ? error.message : String(error)}`);
}

let video = null;
try {
  const stats = statSync(config.videoOutput);
  const prefix = readFileSync(config.videoOutput).subarray(0, 64).toString('latin1');
  if (!prefix.includes('ftyp')) errors.push('MP4: ftyp-Header fehlt');
  if (stats.size < 4096) errors.push(`MP4: Datei ist zu klein (${stats.size} Bytes)`);
  video = {file: config.videoOutput, size: stats.size, hasFtyp: prefix.includes('ftyp')};
} catch (error) {
  errors.push(`MP4: ${error instanceof Error ? error.message : String(error)}`);
}

const sync = JSON.parse(readFileSync(resolve(config.reelRoot, 'timeline', 'final-sync.json'), 'utf8'));
const triggerOffsets = sync.beats.map((beat) => Math.abs(beat.animationStartFrame - beat.transcriptStartFrame));
const boundaryOffsets = sync.scenes.map((scene) => Math.abs(scene.boundaryOffsetFrames));
const outroHoldSeconds = sync.composition.durationInFrames / sync.fps - sync.audio.speechEndSeconds;

if (sync.status !== 'final-transcript-aligned') errors.push('final-sync ist nicht final-transcript-aligned.');
if (Math.max(...triggerOffsets, 0) > 5) errors.push('Mindestens ein Animationstrigger weicht um mehr als 5 Frames ab.');
if (Math.max(...boundaryOffsets, 0) > 6) errors.push('Mindestens eine Szenengrenze weicht um mehr als 6 Frames ab.');
if (outroHoldSeconds < 1.2 || outroHoldSeconds > 2.2) errors.push(`Schluss-Hold ${outroHoldSeconds.toFixed(2)} s liegt außerhalb 1,2–2,2 s.`);

const report = {
  version: 2,
  checkedAt: new Date().toISOString(),
  compositionId: config.compositionId,
  syncStatus: sync.status,
  maximumTriggerOffsetFrames: Math.max(...triggerOffsets, 0),
  maximumBoundaryOffsetFrames: Math.max(...boundaryOffsets, 0),
  speechStartSeconds: sync.audio.speechStartSeconds,
  speechEndSeconds: sync.audio.speechEndSeconds,
  compositionEndSeconds: sync.composition.durationInFrames / sync.fps,
  outroHoldSeconds,
  captionBottomPx: [...new Set(sync.captions.map((cue) => cue.bottomPx))],
  expectedCheckpoints: config.checkpoints.length,
  images,
  video,
  contactSheet: config.contactSheetOutput,
  errors,
  passed: errors.length === 0,
  visualApproval: false,
  userApproval: false,
};

writeFileSync(config.reportOutput, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

if (errors.length > 0) {
  for (const error of errors) console.error(`FEHLER: ${error}`);
  process.exit(1);
}

console.log(`✓ Technische Prüfung bestanden: ${images.length} Bilder und 1 MP4`);
console.log('Hinweis: Technische Prüfung ersetzt keine visuelle Prüfung oder Nutzerfreigabe.');