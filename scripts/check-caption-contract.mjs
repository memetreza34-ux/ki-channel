#!/usr/bin/env node
import {access, readFile, readdir} from 'node:fs/promises';
import {join} from 'node:path';

const SOURCE_PATH = 'ki/src/reels/captionSafe.ts';
const REELS_ROOT = 'ki/reels';
const DOC_PATHS = Object.freeze({
  canonical: 'ki/gehirn/CAPTION_SAFE_POSITION.md',
  reels: 'ki/gehirn/REELS.md',
  creativeQa: 'ki/gehirn/CREATIVE_QA.md',
  postRender: 'ki/gehirn/POST_RENDER_REVIEW.md',
});

const failures = [];

const readText = async (path) => {
  try {
    return await readFile(path, 'utf8');
  } catch (error) {
    failures.push(`${path} ist nicht lesbar: ${error instanceof Error ? error.message : String(error)}`);
    return '';
  }
};

const exists = async (path) => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};

const parseNumber = (source, key) => {
  const match = source.match(new RegExp(`\\b${key}:\\s*(\\d+)\\b`));
  if (!match) {
    failures.push(`${SOURCE_PATH}: ${key} konnte nicht gelesen werden.`);
    return null;
  }
  return Number(match[1]);
};

const requireText = (label, text, needle) => {
  if (!text.includes(needle)) {
    failures.push(`${label}: kanonischer Marker fehlt: ${needle}`);
  }
};

const forbidText = (label, text, needle) => {
  if (text.includes(needle)) {
    failures.push(`${label}: veraltete aktive Caption-Geometrie gefunden: ${needle}`);
  }
};

const countWords = (text) => (
  text.match(/[\p{L}\p{N}]+(?:[’'_-][\p{L}\p{N}]+)*/gu)?.length ?? 0
);

const findV2SubtitleCueFiles = async () => {
  const cueFiles = [];
  let weeks = [];
  try {
    weeks = await readdir(REELS_ROOT, {withFileTypes: true});
  } catch (error) {
    failures.push(`${REELS_ROOT} ist nicht lesbar: ${error instanceof Error ? error.message : String(error)}`);
    return cueFiles;
  }

  for (const week of weeks) {
    if (!week.isDirectory()) continue;
    const weekPath = join(REELS_ROOT, week.name);
    const reels = await readdir(weekPath, {withFileTypes: true});
    for (const reel of reels) {
      if (!reel.isDirectory()) continue;
      const reelPath = join(weekPath, reel.name);
      const contractPath = join(reelPath, '06-projektdateien', 'production-contract-v2.json');
      if (!(await exists(contractPath))) continue;
      const cuePath = join(reelPath, '03-caption', 'subtitle-cues.json');
      if (!(await exists(cuePath))) {
        failures.push(`${reelPath}: V2-Reel ohne 03-caption/subtitle-cues.json.`);
        continue;
      }
      cueFiles.push(cuePath);
    }
  }
  return cueFiles;
};

const source = await readText(SOURCE_PATH);
const docs = Object.fromEntries(
  await Promise.all(
    Object.entries(DOC_PATHS).map(async ([key, path]) => [key, await readText(path)]),
  ),
);

const geometry = Object.freeze({
  bottom: parseNumber(source, 'bottom'),
  horizontalInset: parseNumber(source, 'horizontalInset'),
  maxWidth: parseNumber(source, 'maxWidth'),
  maxVisibleLines: parseNumber(source, 'maxVisibleLines'),
  maxWordsPerGroup: parseNumber(source, 'maxWordsPerGroup'),
  lowerCriticalDeadZone: parseNumber(source, 'lowerCriticalDeadZone'),
  lowerBufferEnd: parseNumber(source, 'lowerBufferEnd'),
  preferredVisualEndY: parseNumber(source, 'preferredVisualEndY'),
  preferredVisualEndYMax: parseNumber(source, 'preferredVisualEndYMax'),
});

if (Object.values(geometry).every((value) => Number.isFinite(value))) {
  requireText(
    DOC_PATHS.canonical,
    docs.canonical,
    `Standard Caption Bottom Offset: \`${geometry.bottom}px\``,
  );
  requireText(DOC_PATHS.reels, docs.reels, `bottom: ${geometry.bottom}px`);
  requireText(DOC_PATHS.creativeQa, docs.creativeQa, `bottom: ${geometry.bottom}px`);
  requireText(DOC_PATHS.postRender, docs.postRender, `bottom: ${geometry.bottom}px`);

  requireText(DOC_PATHS.reels, docs.reels, `${geometry.horizontalInset}px`);
  requireText(DOC_PATHS.reels, docs.reels, `${geometry.maxWidth}px`);
  requireText(DOC_PATHS.postRender, docs.postRender, `${geometry.horizontalInset}px`);
  requireText(DOC_PATHS.postRender, docs.postRender, `${geometry.maxWidth}px`);

  requireText(DOC_PATHS.canonical, docs.canonical, `maximal **${geometry.maxVisibleLines} Zeilen gleichzeitig**`);
  requireText(DOC_PATHS.canonical, docs.canonical, `${geometry.maxWordsPerGroup} Wörter`);
  requireText(DOC_PATHS.postRender, docs.postRender, `maximal ${geometry.maxVisibleLines} Caption-Zeilen`);

  requireText(DOC_PATHS.canonical, docs.canonical, `${geometry.lowerCriticalDeadZone}px`);
  requireText(
    DOC_PATHS.canonical,
    docs.canonical,
    `${geometry.lowerCriticalDeadZone}–${geometry.lowerBufferEnd}px`,
  );
  requireText(DOC_PATHS.postRender, docs.postRender, `${geometry.lowerCriticalDeadZone}px`);
  requireText(
    DOC_PATHS.postRender,
    docs.postRender,
    `${geometry.lowerCriticalDeadZone}–${geometry.lowerBufferEnd}px`,
  );

  const visualRange = `y≈${geometry.preferredVisualEndY}–${geometry.preferredVisualEndYMax}`;
  requireText(DOC_PATHS.reels, docs.reels, visualRange);
  requireText(DOC_PATHS.postRender, docs.postRender, visualRange);
}

const deprecatedBottomValues = [264, 270, 360, 400, 460, 500, 520];
for (const [key, text] of Object.entries({
  reels: docs.reels,
  creativeQa: docs.creativeQa,
  postRender: docs.postRender,
})) {
  const label = DOC_PATHS[key];
  for (const value of deprecatedBottomValues) {
    forbidText(label, text, `bottom: ${value}px`);
  }
}

let checkedCueFiles = 0;
if (Number.isFinite(geometry.maxWordsPerGroup) && Number.isFinite(geometry.maxVisibleLines)) {
  const cueFiles = await findV2SubtitleCueFiles();
  for (const cuePath of cueFiles) {
    let parsed;
    try {
      parsed = JSON.parse(await readFile(cuePath, 'utf8'));
    } catch (error) {
      failures.push(`${cuePath}: ungültiges JSON: ${error instanceof Error ? error.message : String(error)}`);
      continue;
    }
    if (!Array.isArray(parsed?.cues)) {
      failures.push(`${cuePath}: Feld "cues" muss ein Array sein.`);
      continue;
    }
    checkedCueFiles += 1;
    parsed.cues.forEach((cue, index) => {
      if (typeof cue?.text !== 'string' || !cue.text.trim()) {
        failures.push(`${cuePath}: Cue ${index} hat keinen gültigen Text.`);
        return;
      }
      const wordCount = countWords(cue.text);
      if (wordCount > geometry.maxWordsPerGroup) {
        failures.push(`${cuePath}: Cue ${index} hat ${wordCount} Wörter; maximal ${geometry.maxWordsPerGroup}. Cue aufteilen.`);
      }
      const explicitLines = cue.text.split(/\r?\n/).length;
      if (explicitLines > geometry.maxVisibleLines) {
        failures.push(`${cuePath}: Cue ${index} hat ${explicitLines} explizite Zeilen; maximal ${geometry.maxVisibleLines}. Cue aufteilen.`);
      }
    });
  }
}

if (failures.length > 0) {
  console.error('CAPTION CONTRACT: FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('CAPTION CONTRACT: PASS');
console.log(
  `Source geometry: bottom=${geometry.bottom}px, inset=${geometry.horizontalInset}px, maxWidth=${geometry.maxWidth}px, maxLines=${geometry.maxVisibleLines}, maxWords=${geometry.maxWordsPerGroup}, lowerDeadZone=${geometry.lowerCriticalDeadZone}px, bufferEnd=${geometry.lowerBufferEnd}px, visualEnd=${geometry.preferredVisualEndY}–${geometry.preferredVisualEndYMax}`,
);
console.log(`V2 subtitle cue files checked: ${checkedCueFiles}`);
