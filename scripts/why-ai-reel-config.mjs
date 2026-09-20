import {createHash} from 'node:crypto';
import {readdirSync, readFileSync, statSync} from 'node:fs';
import {relative, resolve} from 'node:path';

const SOURCE_REEL_PATH = resolve(
  'ki/reels/2026-08-03_bis_2026-08-09/01_Warum-KI-Text-anders-liest/06-projektdateien/reel.json',
);
const sourceReel = JSON.parse(readFileSync(SOURCE_REEL_PATH, 'utf8'));

export const WHY_AI_REEL_CONFIG = Object.freeze({
  reelId: sourceReel.reelId,
  compositionId: sourceReel.compositionId,
  entryPoint: 'ki/src/index.ts',
  outputDir: 'out/reels/why-ai-reads-differently',
  width: sourceReel.format.width,
  height: sourceReel.format.height,
  fps: sourceReel.format.fps,
  durationInFrames: sourceReel.format.durationInFrames,
  smokeCheckpoints: Object.freeze([0, 38, 114, 234, 354, 489, 654, 789, 939, 1079]),
  checkpoints: Object.freeze([
    0, 38, 74, 113,
    114, 154, 194, 233,
    234, 274, 314, 353,
    354, 399, 444, 488,
    489, 544, 599, 653,
    654, 699, 744, 788,
    789, 839, 889, 938,
    939, 986, 1033, 1079,
  ]),
});

const collectFiles = (path) => {
  const absolute = resolve(path);
  if (!statSync(absolute).isDirectory()) return [absolute];
  return readdirSync(absolute, {withFileTypes: true})
    .flatMap((entry) => collectFiles(resolve(absolute, entry.name)))
    .sort();
};

export const WHY_AI_REEL_SOURCE_FILES = Object.freeze([
  ...collectFiles('ki/src/reels/why-ai-reads-differently').filter((file) => /\.(ts|tsx)$/.test(file)),
  SOURCE_REEL_PATH,
  resolve('ki/src/Root.tsx'),
  resolve('ki/src/index.ts'),
  resolve('ki/brand/brand.ts'),
].sort());

const hash = createHash('sha256');
for (const file of WHY_AI_REEL_SOURCE_FILES) {
  hash.update(relative(process.cwd(), file).replaceAll('\\', '/'));
  hash.update('\0');
  hash.update(readFileSync(file));
  hash.update('\0');
}

export const WHY_AI_REEL_SOURCE_FINGERPRINT = hash.digest('hex');
