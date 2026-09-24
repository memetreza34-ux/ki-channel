#!/usr/bin/env node
import {readFile} from 'node:fs/promises';

const SOURCE_PATH = 'ki/src/reels/captionSafe.ts';
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

if (failures.length > 0) {
  console.error('CAPTION CONTRACT: FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('CAPTION CONTRACT: PASS');
console.log(
  `Source geometry: bottom=${geometry.bottom}px, inset=${geometry.horizontalInset}px, maxWidth=${geometry.maxWidth}px, lowerDeadZone=${geometry.lowerCriticalDeadZone}px, bufferEnd=${geometry.lowerBufferEnd}px, visualEnd=${geometry.preferredVisualEndY}–${geometry.preferredVisualEndYMax}`,
);
