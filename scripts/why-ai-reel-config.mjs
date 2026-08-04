import {createHash} from 'node:crypto';
import {readdirSync, readFileSync, statSync} from 'node:fs';
import {relative, resolve} from 'node:path';

export const WHY_AI_REEL_CONFIG = Object.freeze({
  reelId: '2026-08-04-warum-ki-text-anders-liest',
  compositionId: 'Reel-WhyAIReadsDifferently',
  entryPoint: 'ki/src/motion-system/remotion-entry.tsx',
  outputDir: 'out/reels/why-ai-reads-differently',
  width: 1080,
  height: 1920,
  fps: 30,
  durationInFrames: 1080,
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
  resolve('ki/reels/2026-08-04-warum-ki-text-anders-liest/reel.json'),
  resolve('ki/src/motion-system/MotionPreviewRoot.tsx'),
  resolve('ki/src/motion-system/remotion-entry.tsx'),
].sort());

const hash = createHash('sha256');
for (const file of WHY_AI_REEL_SOURCE_FILES) {
  hash.update(relative(process.cwd(), file).replaceAll('\\', '/'));
  hash.update('\0');
  hash.update(readFileSync(file));
  hash.update('\0');
}

export const WHY_AI_REEL_SOURCE_FINGERPRINT = hash.digest('hex');
