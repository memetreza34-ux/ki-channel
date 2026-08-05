import {createHash} from 'node:crypto';
import {readdirSync, readFileSync, statSync} from 'node:fs';
import {relative, resolve} from 'node:path';

const PRIMARY_PATH = resolve(
  'ki/src/animation-library/complete-prototype-render-config.json',
);
const ALTERNATE_PATH = resolve(
  'ki/src/animation-library/experimental-prototype-render-config.json',
);
const primary = JSON.parse(readFileSync(PRIMARY_PATH, 'utf8'));
const alternate = JSON.parse(readFileSync(ALTERNATE_PATH, 'utf8'));

const assert = (condition, message) => {
  if (!condition) throw new Error(`Expanded animation library config: ${message}`);
};

assert(primary.version === 1 && alternate.version === 1, 'both config versions must equal 1');
assert(primary.entryPoint !== alternate.entryPoint, 'expanded entry point must differ from primary-only entry point');
assert(alternate.entryPoint === 'ki/src/animation-library/expanded-remotion-entry.tsx', 'alternate config must use the expanded entry point');
assert(Array.isArray(primary.prototypes), 'primary prototypes are required');
assert(Array.isArray(alternate.prototypes), 'alternate prototypes are required');
assert(primary.prototypes.length === 22, 'primary registry must contain 22 prototypes');
assert(alternate.prototypes.length === 22, 'alternate registry must contain 22 prototypes');
assert(JSON.stringify(primary.defaults) === JSON.stringify(alternate.defaults), 'primary and alternate defaults must match');

const prototypes = [...primary.prototypes, ...alternate.prototypes];
const compositionIds = prototypes.map((item) => item.compositionId);
const animationIds = prototypes.map((item) => item.animationId);
assert(prototypes.length === 44, 'exactly 44 prototypes are required');
assert(new Set(compositionIds).size === 44, 'composition IDs must be unique');
assert(new Set(animationIds).size === 44, 'animation IDs must be unique');

const checkpoints = [...alternate.defaults.checkpoints];
const smokeCheckpoints = [...alternate.defaults.smokeCheckpoints];
const durationInFrames = alternate.defaults.durationInFrames;
assert(new Set(checkpoints).size === checkpoints.length, 'checkpoints must be unique');
assert(new Set(smokeCheckpoints).size === smokeCheckpoints.length, 'smoke checkpoints must be unique');
assert(
  checkpoints.every(
    (frame, index) =>
      Number.isInteger(frame) &&
      frame >= 0 &&
      frame < durationInFrames &&
      (index === 0 || frame > checkpoints[index - 1]),
  ),
  'checkpoints must be sorted valid frame numbers',
);
assert(
  smokeCheckpoints.every((frame) => checkpoints.includes(frame)),
  'smoke checkpoints must be a subset of checkpoints',
);

export const EXPANDED_ANIMATION_LIBRARY_RENDER_CONFIG = Object.freeze({
  version: 1,
  entryPoint: alternate.entryPoint,
  outputDir: alternate.outputDir,
  defaults: Object.freeze({
    ...alternate.defaults,
    checkpoints: Object.freeze(checkpoints),
    smokeCheckpoints: Object.freeze(smokeCheckpoints),
  }),
  prototypes: Object.freeze(
    prototypes.map((prototype) => Object.freeze({...prototype})),
  ),
});

const collectFiles = (path) => {
  const absolute = resolve(path);
  if (!statSync(absolute).isDirectory()) return [absolute];
  return readdirSync(absolute, {withFileTypes: true})
    .flatMap((entry) => collectFiles(resolve(absolute, entry.name)))
    .sort();
};

export const EXPANDED_ANIMATION_LIBRARY_SOURCE_FILES = Object.freeze([
  ...collectFiles('ki/src/animation-library').filter((file) =>
    /\.(ts|tsx|json)$/.test(file),
  ),
  resolve('ki/reels/animation-history.json'),
].sort());

const hash = createHash('sha256');
for (const file of EXPANDED_ANIMATION_LIBRARY_SOURCE_FILES) {
  hash.update(relative(process.cwd(), file).replaceAll('\\', '/'));
  hash.update('\0');
  hash.update(readFileSync(file));
  hash.update('\0');
}

export const EXPANDED_ANIMATION_LIBRARY_SOURCE_FINGERPRINT = hash.digest('hex');
export const EXPANDED_ANIMATION_LIBRARY_EXPECTED_ARTIFACT_COUNT =
  EXPANDED_ANIMATION_LIBRARY_RENDER_CONFIG.prototypes.length *
  (EXPANDED_ANIMATION_LIBRARY_RENDER_CONFIG.defaults.checkpoints.length + 1);
