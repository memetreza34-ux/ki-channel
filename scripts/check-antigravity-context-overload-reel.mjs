import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const ROOT = 'ki/src/reels/antigravity-context-overload';
const read = (path) => readFileSync(resolve(path), 'utf8');
const readJson = (path) => JSON.parse(read(path));
const failures = [];
const fail = (message) => failures.push(message);

const requiredFiles = [
  'AGENTS.md',
  'reel.json',
  'voiceover.md',
  'scene-plan.md',
  'animation-plan.md',
  'subtitle-cues.json',
  'asset-manifest.json',
  'CODEX_ASSEMBLY_TASK.md',
  'review-checklist.md',
];
for (const file of requiredFiles) {
  try {
    const content = read(`${ROOT}/${file}`);
    if (!content.trim()) fail(`${file}: leer`);
  } catch {
    fail(`${file}: fehlt`);
  }
}

const reel = readJson(`${ROOT}/reel.json`);
const subtitles = readJson(`${ROOT}/subtitle-cues.json`);
const assets = readJson(`${ROOT}/asset-manifest.json`);
const renderConfig = readJson('ki/src/animation-library/prototype-render-config.json');

if (reel.slug !== 'antigravity-context-overload') fail('unerwarteter reel slug');
if (reel.format?.width !== 1080 || reel.format?.height !== 1920) fail('Format muss 1080x1920 sein');
if (reel.format?.fps !== 30) fail('FPS muss 30 sein');
if (reel.format?.durationInFrames !== 900) fail('Gesamtdauer muss 900 Frames sein');
if (!Array.isArray(reel.scenes) || reel.scenes.length !== 5) fail('Reel muss exakt 5 Szenen enthalten');

const sceneIds = new Set();
const animationIds = new Set();
const productionIds = new Set((renderConfig.prototypes ?? []).map((item) => item.animationId));
let cursor = 0;
for (const [index, scene] of (reel.scenes ?? []).entries()) {
  if (!scene.sceneId || sceneIds.has(scene.sceneId)) fail(`Szene ${index + 1}: sceneId fehlt oder ist doppelt`);
  sceneIds.add(scene.sceneId);
  if (!scene.animationId || animationIds.has(scene.animationId)) fail(`Szene ${index + 1}: animationId fehlt oder wird wiederverwendet`);
  animationIds.add(scene.animationId);
  if (!productionIds.has(scene.animationId)) fail(`Szene ${index + 1}: ${scene.animationId} ist nicht in der Production-Render-Config`);
  if (scene.startFrame !== cursor) fail(`Szene ${index + 1}: startFrame ${scene.startFrame} statt ${cursor}`);
  if (scene.endFrame - scene.startFrame !== 180) fail(`Szene ${index + 1}: Dauer muss 180 Frames sein`);
  if (typeof scene.spokenText !== 'string' || scene.spokenText.trim().length < 20) fail(`Szene ${index + 1}: spokenText fehlt oder ist zu kurz`);
  cursor = scene.endFrame;
}
if (cursor !== 900) fail(`Szenen enden bei ${cursor} statt 900`);

const normalize = (value) => value
  .toLocaleLowerCase('de-DE')
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[–—]/g, '-')
  .replace(/[^\p{L}\p{N}]+/gu, ' ')
  .trim()
  .replace(/\s+/g, ' ');

if (!Array.isArray(subtitles.cues) || subtitles.cues.length !== 10) fail('Subtitle-Datei muss 10 Cues enthalten');
for (const scene of reel.scenes ?? []) {
  const cues = (subtitles.cues ?? []).filter((cue) => cue.sceneId === scene.sceneId);
  if (cues.length !== 2) fail(`${scene.sceneId}: exakt 2 Subtitle-Cues erwartet`);
  for (const cue of cues) {
    if (cue.startFrame < scene.startFrame || cue.endFrame > scene.endFrame || cue.endFrame <= cue.startFrame) {
      fail(`${scene.sceneId}: Subtitle-Cue außerhalb der Szene`);
    }
  }
  const subtitleText = normalize(cues.sort((a, b) => a.startFrame - b.startFrame).map((cue) => cue.text).join(' '));
  const spokenText = normalize(scene.spokenText);
  if (subtitleText !== spokenText) fail(`${scene.sceneId}: Subtitle-Text deckt spokenText nicht exakt ab`);
}

if (assets.externalAssetsRequired !== false) fail('Erster Reel-Pass darf keine externen Assets benötigen');
if ((assets.images ?? []).length !== 0 || (assets.videos ?? []).length !== 0) fail('Bild/Video-Assets müssen für den ersten Pass leer sein');
if (assets.audio?.music !== null || (assets.audio?.sfx ?? []).length !== 0) fail('Musik und SFX müssen für den ersten Pass deaktiviert sein');

if (failures.length > 0) {
  console.error('Antigravity-Context-Overload-Reel-Paket fehlgeschlagen:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Antigravity-Context-Overload-Reel-Paket bestanden: 5 Szenen, 900 Frames, 5 eindeutige production-ready Animationen, vollständige Subtitle-Abdeckung und keine externen Assets.');
