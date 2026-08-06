import {readFileSync, statSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import sharp from 'sharp';
import {getTodayKnowledgeRenderConfig} from './why-ai-does-not-know-today-render-config.mjs';

const config = getTodayKnowledgeRenderConfig(process.argv[2]);
const errors = [];
const images = [];

const validateImage = async (file, label) => {
  try {
    const stats = statSync(file);
    const metadata = await sharp(file).metadata();
    if (metadata.width !== config.width || metadata.height !== config.height) {
      errors.push(`${label}: ${metadata.width}x${metadata.height} statt ${config.width}x${config.height}.`);
    }
    if (stats.size < 1024) errors.push(`${label}: Datei zu klein.`);
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
  const selected = config.checkpoints.filter((_, index) => index % 3 === 1).slice(0, 8);
  const composites = [];
  for (const [index, frame] of selected.entries()) {
    const input = await sharp(resolve(config.stillOutput, `frame-${String(frame).padStart(4, '0')}.png`))
      .resize(270, 480, {fit: 'cover'})
      .png()
      .toBuffer();
    composites.push({input, left: (index % 4) * 270, top: Math.floor(index / 4) * 480});
  }
  await sharp({create: {width: 1080, height: 960, channels: 4, background: '#F6F4FA'}})
    .composite(composites)
    .png()
    .toFile(config.contactSheetOutput);
} catch (error) {
  errors.push(`Kontaktbogen: ${error instanceof Error ? error.message : String(error)}`);
}

let video = null;
try {
  const output = config.syncStatus === 'final-transcript-aligned'
    ? config.finalVideoOutput
    : config.previewVideoOutput;
  const stats = statSync(output);
  const prefix = readFileSync(output).subarray(0, 64).toString('latin1');
  if (!prefix.includes('ftyp')) errors.push('MP4: ftyp fehlt.');
  if (stats.size < 4096) errors.push('MP4: Datei zu klein.');
  video = {file: output, size: stats.size};
} catch (error) {
  errors.push(`MP4: ${error instanceof Error ? error.message : String(error)}`);
}

const report = {
  checkedAt: new Date().toISOString(),
  syncStatus: config.syncStatus,
  images,
  video,
  errors,
  passed: errors.length === 0,
  animationDirectorApproval: false,
  smartphoneVisualApproval: false,
  userApproval: false,
};
writeFileSync(config.reportOutput, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

if (errors.length > 0) {
  for (const error of errors) console.error(`FEHLER: ${error}`);
  process.exit(1);
}
console.log('✓ Technische Artefaktprüfung bestanden. Visuelle und Nutzerfreigabe bleiben offen.');
