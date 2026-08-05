import {createHash} from 'node:crypto';
import {readdirSync, readFileSync, statSync} from 'node:fs';
import {relative, resolve} from 'node:path';

const CONFIG_PATH = resolve(
  'ki/src/animation-library/complete-prototype-render-config.json',
);
const rawConfig = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));

const assert = (condition, message) => {
  if (!condition) throw new Error(`Complete animation library config: ${message}`);
};

assert(rawConfig.version === 1, 'version must equal 1');
assert(typeof rawConfig.entryPoint === 'string', 'entryPoint is required');
assert(typeof rawConfig.outputDir === 'string', 'outputDir is required');
assert(Number.isInteger(rawConfig.defaults?.durationInFrames), 'durationInFrames must be an integer');
assert(Number.isInteger(rawConfig.defaults?.fps), 'fps must be an integer');
assert(Number.isInteger(rawConfig.defaults?.width), 'width must be an integer');
assert(Number.isInteger(rawConfig.defaults?.height), 'height must be an integer');
assert(Array.isArray(rawConfig.defaults?.checkpoints), 'checkpoints must be an array');
assert(Array.isArray(rawConfig.defaults?.smokeCheckpoints), 'smokeCheckpoints must be an array');
assert(Array.isArray(rawConfig.prototypes), 'prototypes must be an array');
assert(rawConfig.prototypes.length === 22, 'exactly 22 prototypes are required');

const checkpoints = [...rawConfig.defaults.checkpoints];
const smokeCheckpoints = [...rawConfig.defaults.smokeCheckpoints];
const durationInFrames = rawConfig.defaults.durationInFrames;
const compositionIds = rawConfig.prototypes.map((prototype) => prototype.compositionId);
const animationIds = rawConfig.prototypes.map((prototype) => prototype.animationId);

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
assert(new Set(compositionIds).size === compositionIds.length, 'composition IDs must be unique');
assert(new Set(animationIds).size === animationIds.length, 'animation IDs must be unique');

export const COMPLETE_ANIMATION_LIBRARY_RENDER_CONFIG = Object.freeze({
  ...rawConfig,
  defaults: Object.freeze({
    ...rawConfig.defaults,
    checkpoints: Object.freeze(checkpoints),
    smokeCheckpoints: Object.freeze(smokeCheckpoints),
  }),
  prototypes: Object.freeze(
    rawConfig.prototypes.map((prototype) => Object.freeze({...prototype})),
  ),
});

const collectFiles = (path) => {
  const absolute = resolve(path);
  if (!statSync(absolute).isDirectory()) return [absolute];
  return readdirSync(absolute, {withFileTypes: true})
    .flatMap((entry) => collectFiles(resolve(absolute, entry.name)))
    .sort();
};

export const COMPLETE_ANIMATION_LIBRARY_SOURCE_FILES = Object.freeze([
  ...collectFiles('ki/src/animation-library').filter((file) =>
    /\.(ts|tsx|json)$/.test(file),
  ),
  resolve('ki/reels/animation-history.json'),
].sort());

const hash = createHash('sha256');
for (const file of COMPLETE_ANIMATION_LIBRARY_SOURCE_FILES) {
  hash.update(relative(process.cwd(), file).replaceAll('\\', '/'));
  hash.update('\0');
  hash.update(readFileSync(file));
  hash.update('\0');
}

export const COMPLETE_ANIMATION_LIBRARY_SOURCE_FINGERPRINT = hash.digest('hex');
export const COMPLETE_ANIMATION_LIBRARY_EXPECTED_ARTIFACT_COUNT =
  COMPLETE_ANIMATION_LIBRARY_RENDER_CONFIG.prototypes.length *
  (COMPLETE_ANIMATION_LIBRARY_RENDER_CONFIG.defaults.checkpoints.length + 1);
