import {createHash} from 'node:crypto';
import {readdirSync, readFileSync, statSync} from 'node:fs';
import {relative, resolve} from 'node:path';

const CONFIG_PATHS = [
  resolve('ki/src/animation-library/complete-prototype-render-config.json'),
  resolve('ki/src/animation-library/experimental-prototype-render-config.json'),
  resolve('ki/src/animation-library/advanced-prototype-render-config.json'),
  resolve('ki/src/animation-library/final-prototype-render-config.json'),
];
const configs = CONFIG_PATHS.map((path) => JSON.parse(readFileSync(path, 'utf8')));

const assert = (condition, message) => {
  if (!condition) throw new Error(`Ultimate animation library config: ${message}`);
};

configs.forEach((config, index) => {
  assert(config.version === 1, `config ${index + 1} version must equal 1`);
  assert(Array.isArray(config.prototypes), `config ${index + 1} prototypes are required`);
  assert(config.prototypes.length === 22, `config ${index + 1} must contain 22 prototypes`);
});
for (let index = 1; index < configs.length; index += 1) {
  assert(
    JSON.stringify(configs[0].defaults) === JSON.stringify(configs[index].defaults),
    'all render defaults must match',
  );
}
assert(
  configs[3].entryPoint === 'ki/src/animation-library/ultimate-remotion-entry.tsx',
  'final config must use ultimate entry point',
);

const prototypes = configs.flatMap((config) => config.prototypes);
const compositionIds = prototypes.map((item) => item.compositionId);
const animationIds = prototypes.map((item) => item.animationId);
assert(prototypes.length === 88, 'exactly 88 prototypes are required');
assert(new Set(compositionIds).size === 88, 'composition IDs must be unique');
assert(new Set(animationIds).size === 88, 'animation IDs must be unique');

const defaults = configs[3].defaults;
const checkpoints = [...defaults.checkpoints];
const smokeCheckpoints = [...defaults.smokeCheckpoints];
assert(new Set(checkpoints).size === checkpoints.length, 'checkpoints must be unique');
assert(new Set(smokeCheckpoints).size === smokeCheckpoints.length, 'smoke checkpoints must be unique');
assert(
  checkpoints.every(
    (frame, index) =>
      Number.isInteger(frame) &&
      frame >= 0 &&
      frame < defaults.durationInFrames &&
      (index === 0 || frame > checkpoints[index - 1]),
  ),
  'checkpoints must be sorted valid frame numbers',
);
assert(
  smokeCheckpoints.every((frame) => checkpoints.includes(frame)),
  'smoke checkpoints must be a subset of checkpoints',
);

export const ULTIMATE_ANIMATION_LIBRARY_RENDER_CONFIG = Object.freeze({
  version: 1,
  entryPoint: configs[3].entryPoint,
  outputDir: configs[3].outputDir,
  defaults: Object.freeze({
    ...defaults,
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

export const ULTIMATE_ANIMATION_LIBRARY_SOURCE_FILES = Object.freeze([
  ...collectFiles('ki/src/animation-library').filter((file) =>
    /\.(ts|tsx|json)$/.test(file),
  ),
  resolve('ki/reels/animation-history.json'),
].sort());

const hash = createHash('sha256');
for (const file of ULTIMATE_ANIMATION_LIBRARY_SOURCE_FILES) {
  hash.update(relative(process.cwd(), file).replaceAll('\\', '/'));
  hash.update('\0');
  hash.update(readFileSync(file));
  hash.update('\0');
}

export const ULTIMATE_ANIMATION_LIBRARY_SOURCE_FINGERPRINT = hash.digest('hex');
export const ULTIMATE_ANIMATION_LIBRARY_EXPECTED_ARTIFACT_COUNT =
  ULTIMATE_ANIMATION_LIBRARY_RENDER_CONFIG.prototypes.length *
  (ULTIMATE_ANIMATION_LIBRARY_RENDER_CONFIG.defaults.checkpoints.length + 1);
