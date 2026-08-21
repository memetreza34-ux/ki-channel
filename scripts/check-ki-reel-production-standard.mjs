import {readFile, readdir} from 'node:fs/promises';
import {resolve, relative} from 'node:path';

const root = resolve(process.env.KI_REEL_STANDARD_ROOT ?? '.');
const standardPath = resolve(root, 'ki/reels/production-standard.json');
const failures = [];

const readText = async (path) => readFile(resolve(root, path), 'utf8');
const standard = JSON.parse(await readFile(standardPath, 'utf8'));
const {format, caption, layout, voiceover, visual} = standard;

const expectValue = (label, actual, expected) => {
  if (actual !== expected) failures.push(`${label}: erwartet ${expected}, erhalten ${actual}`);
};

expectValue('schemaVersion', standard.schemaVersion, 1);
expectValue('format.width', format.width, 1080);
expectValue('format.height', format.height, 1920);
expectValue('format.fps', format.fps, 30);
expectValue('caption.bottomPx', caption.bottomPx, 520);
expectValue('caption.horizontalInsetPx', caption.horizontalInsetPx, 104);
expectValue('caption.maxWidthPx', caption.maxWidthPx, 820);
expectValue('caption.fontSizePx', caption.fontSizePx, 48);
expectValue('caption.lineHeight', caption.lineHeight, 1.18);
expectValue('caption.maxVisibleLines', caption.maxVisibleLines, 2);
expectValue('caption.wordsPerVisibleGroup.min', caption.wordsPerVisibleGroup.min, 4);
expectValue('caption.wordsPerVisibleGroup.max', caption.wordsPerVisibleGroup.max, 6);
expectValue('layout.header.topPx', layout.header.topPx, 110);
expectValue('layout.header.heightPx', layout.header.heightPx, 150);
expectValue('layout.header.headingFontSizePx', layout.header.headingFontSizePx, 51);
expectValue('layout.header.iconSizePx', layout.header.iconSizePx, 90);
expectValue('layout.animation.topPx', layout.animation.topPx, 300);
expectValue('layout.animation.endYPx', layout.animation.endYPx, 1160);
expectValue('layout.animation.minimumCaptionGapPx', layout.animation.minimumCaptionGapPx, 100);
expectValue('voiceover.preferredRetimingFactor.min', voiceover.preferredRetimingFactor.min, 0.97);
expectValue('voiceover.preferredRetimingFactor.max', voiceover.preferredRetimingFactor.max, 1.03);
expectValue('voiceover.absoluteRetimingFactor.min', voiceover.absoluteRetimingFactor.min, 0.94);
expectValue('voiceover.absoluteRetimingFactor.max', voiceover.absoluteRetimingFactor.max, 1.06);
expectValue('visual.maximumStrongSimultaneousMotions', visual.maximumStrongSimultaneousMotions, 3);

if (format.targetDurationSeconds.min >= format.targetDurationSeconds.max) failures.push('Zieldauer-Minimum muss kleiner als Maximum sein.');
if (format.targetSpokenWords.min >= format.targetSpokenWords.max) failures.push('Wortzahl-Minimum muss kleiner als Maximum sein.');
if (caption.lowerCriticalDeadZonePx >= caption.bottomPx) failures.push('Caption muss oberhalb der kritischen unteren Dead-Zone liegen.');
if (caption.lowerBufferEndPx > caption.bottomPx) failures.push('Caption muss oberhalb des unteren Puffers liegen.');
if (layout.header.topPx + layout.header.heightPx >= layout.animation.topPx) failures.push('Header und Animationszone müssen vertikal getrennt sein.');
if (layout.animation.endYPx !== caption.preferredVisualEndYPx.max) failures.push('Animationsende und maximales Visual-Ende müssen identisch sein.');
const conservativeCaptionTop = format.height - caption.bottomPx - caption.fontSizePx * caption.lineHeight * caption.maxVisibleLines;
if (conservativeCaptionTop - layout.animation.endYPx < layout.animation.minimumCaptionGapPx) {
  failures.push('Zwischen Animationsende und konservativer Zwei-Zeilen-Caption fehlt der Mindestabstand.');
}

const captionSafe = await readText('ki/src/reels/captionSafe.ts');
const sourceMarkers = [
  "import standard from '../../reels/production-standard.json'",
  'bottom: caption.bottomPx',
  'horizontalInset: caption.horizontalInsetPx',
  'maxWidth: caption.maxWidthPx',
  'fontSize: caption.fontSizePx',
  'lineHeight: caption.lineHeight',
  'maxVisibleLines: caption.maxVisibleLines',
  'maxWordsPerGroup: caption.wordsPerVisibleGroup.max',
  'lowerCriticalDeadZone: caption.lowerCriticalDeadZonePx',
  'lowerBufferEnd: caption.lowerBufferEndPx',
  'preferredVisualEndY: caption.preferredVisualEndYPx.min',
  'preferredVisualEndYMax: caption.preferredVisualEndYPx.max',
];
for (const marker of sourceMarkers) {
  if (!captionSafe.includes(marker)) failures.push(`ki/src/reels/captionSafe.ts weicht ab; Marker fehlt: ${marker}`);
}

const reelLayout = await readText('ki/src/reels/reelLayout.ts');
for (const marker of [
  "import standard from '../../reels/production-standard.json'",
  'top: layout.header.topPx',
  'headingFontSize: layout.header.headingFontSizePx',
  'iconSize: layout.header.iconSizePx',
  'top: layout.animation.topPx',
  'endY: layout.animation.endYPx',
  'minimumCaptionGap: layout.animation.minimumCaptionGapPx',
]) {
  if (!reelLayout.includes(marker)) failures.push(`ki/src/reels/reelLayout.ts weicht ab; Marker fehlt: ${marker}`);
}

const todaySceneCanvas = await readText('ki/src/reels/why-ai-does-not-know-today/components.tsx');
for (const marker of [
  'REEL_LAYOUT_SAFE.header.top',
  'REEL_LAYOUT_SAFE.header.headingFontSize',
  'REEL_LAYOUT_SAFE.header.iconSize',
  'REEL_LAYOUT_SAFE.animation.top',
  'REEL_LAYOUT_SAFE.animation.endY',
]) {
  if (!todaySceneCanvas.includes(marker)) failures.push(`Aktuelles Reel verwendet die zentrale Layoutzone nicht; Marker fehlt: ${marker}`);
}

const docs = [
  'ki/reels/AGENTS.md',
  'ki/gehirn/REELS.md',
  'ki/gehirn/CAPTION_SAFE_POSITION.md',
  'ki/gehirn/POST_RENDER_REVIEW.md',
  'ki/src/reels/AGENTS.md',
];
const documentationMarkers = [
  `bottom: ${caption.bottomPx}px`,
  `${caption.horizontalInsetPx}px`,
  `${caption.maxWidthPx}px`,
  `${caption.wordsPerVisibleGroup.min}–${caption.wordsPerVisibleGroup.max}`,
];
for (const path of docs) {
  const text = await readText(path);
  for (const marker of documentationMarkers) {
    if (!text.includes(marker)) failures.push(`${path}: kanonischer Marker fehlt: ${marker}`);
  }
}

const walk = async (dir) => {
  const files = [];
  for (const entry of await readdir(dir, {withFileTypes: true})) {
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) files.push(path);
  }
  return files;
};

const sourceRoot = resolve(root, 'ki/src/reels');
for (const path of await walk(sourceRoot)) {
  if (path.endsWith('/captionSafe.ts') || path.endsWith('/captionSafe.test.ts')) continue;
  const text = await readFile(path, 'utf8');
  const hardcodedWrapper = new RegExp(
    `left:\\s*${caption.horizontalInsetPx}[\\s\\S]{0,180}right:\\s*${caption.horizontalInsetPx}[\\s\\S]{0,180}bottom:\\s*${caption.bottomPx}`,
  );
  const hardcodedBottomWidth = new RegExp(
    `bottom:\\s*${caption.bottomPx}[\\s\\S]{0,260}maxWidth:\\s*${caption.maxWidthPx}`,
  );
  if (hardcodedWrapper.test(text) || hardcodedBottomWidth.test(text)) {
    failures.push(`${relative(root, path)}: Caption-Geometrie ist hart codiert; REEL_CAPTION_SAFE oder REEL_CAPTION_WRAPPER_STYLE verwenden.`);
  }
}

if (failures.length > 0) {
  console.error('Kanonischer KI-Reel-Produktionsstandard fehlgeschlagen:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`KI-Reel-Produktionsstandard konsistent: ${standard.standardId}, ${format.width}×${format.height} @ ${format.fps} FPS, Caption bottom ${caption.bottomPx}px.`);
