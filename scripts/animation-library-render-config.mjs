import {createHash} from 'node:crypto';
import {readdirSync, readFileSync, statSync} from 'node:fs';
import {relative, resolve} from 'node:path';

const CONFIG_PATH = resolve(
  'ki/src/animation-library/prototype-render-config.json',
);
const CONTENT_FIXTURE_CONFIG_PATH = resolve(
  'ki/src/animation-library/content-render-fixtures.json',
);

const rawConfig = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
const rawContentFixtures = JSON.parse(
  readFileSync(CONTENT_FIXTURE_CONFIG_PATH, 'utf8'),
);

const assert = (condition, message) => {
  if (!condition) throw new Error(`Animation library render config: ${message}`);
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
assert(rawConfig.prototypes.length > 0, 'at least one prototype is required');

const checkpoints = [...rawConfig.defaults.checkpoints];
const smokeCheckpoints = [...rawConfig.defaults.smokeCheckpoints];
const durationInFrames = rawConfig.defaults.durationInFrames;

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
  'smoke checkpoints must be a subset of full checkpoints',
);

const compositionIds = rawConfig.prototypes.map(
  (prototype) => prototype.compositionId,
);
const animationIds = rawConfig.prototypes.map(
  (prototype) => prototype.animationId,
);
assert(
  new Set(compositionIds).size === compositionIds.length,
  'composition IDs must be unique',
);
assert(
  new Set(animationIds).size === animationIds.length,
  'animation IDs must be unique',
);

assert(rawContentFixtures.version === 1, 'content fixture version must equal 1');
assert(
  Number.isInteger(rawContentFixtures.frame) &&
    rawContentFixtures.frame >= 0 &&
    rawContentFixtures.frame < durationInFrames,
  'content fixture frame must be a valid frame number',
);
const contentCheckpoints = [
  30,
  rawContentFixtures.frame,
  Math.min(150, durationInFrames - 2),
  durationInFrames - 1,
].filter((frame, index, all) => all.indexOf(frame) === index).sort((a, b) => a - b);
assert(
  contentCheckpoints.length >= 4 &&
    contentCheckpoints.every(
      (frame, index) =>
        Number.isInteger(frame) &&
        frame >= 0 &&
        frame < durationInFrames &&
        (index === 0 || frame > contentCheckpoints[index - 1]),
    ),
  'content checkpoints must cover four unique valid render phases',
);
assert(
  Array.isArray(rawContentFixtures.fixtures),
  'content fixtures must be an array',
);
assert(
  rawContentFixtures.fixtures.length === rawConfig.prototypes.length,
  'content fixtures must cover every registered prototype exactly once',
);

const fixtureAnimationIds = rawContentFixtures.fixtures.map(
  (fixture) => fixture.animationId,
);
assert(
  new Set(fixtureAnimationIds).size === fixtureAnimationIds.length,
  'content fixture animation IDs must be unique',
);
assert(
  fixtureAnimationIds.every((animationId) => animationIds.includes(animationId)) &&
    animationIds.every((animationId) => fixtureAnimationIds.includes(animationId)),
  'content fixture animation IDs must exactly match registered prototype IDs',
);
for (const fixture of rawContentFixtures.fixtures) {
  assert(
    fixture.content && typeof fixture.content === 'object',
    `content fixture ${fixture.animationId} needs a content object`,
  );
  assert(
    typeof fixture.content.spokenText === 'string' &&
      fixture.content.spokenText.trim().length > 0,
    `content fixture ${fixture.animationId} needs spokenText`,
  );
}

export const ANIMATION_LIBRARY_RENDER_CONFIG = Object.freeze({
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

// Backward-compatible primary content frame plus the full release checkpoint set.
export const ANIMATION_LIBRARY_CONTENT_RENDER_FRAME = rawContentFixtures.frame;
export const ANIMATION_LIBRARY_CONTENT_RENDER_FRAMES = Object.freeze(
  contentCheckpoints,
);
export const ANIMATION_LIBRARY_CONTENT_RENDER_FIXTURES = Object.freeze(
  rawContentFixtures.fixtures.map((fixture) =>
    Object.freeze({
      animationId: fixture.animationId,
      props: Object.freeze({
        content: Object.freeze({
          ...fixture.content,
          labels: Object.freeze({...fixture.content.labels ?? {}}),
          values: Object.freeze({...fixture.content.values ?? {}}),
        }),
      }),
    }),
  ),
);

const collectFiles = (path) => {
  const absolute = resolve(path);
  if (!statSync(absolute).isDirectory()) return [absolute];
  return readdirSync(absolute, {withFileTypes: true})
    .flatMap((entry) => collectFiles(resolve(absolute, entry.name)))
    .sort();
};

export const ANIMATION_LIBRARY_SOURCE_FILES = Object.freeze([
  ...collectFiles('ki/src/animation-library').filter((file) =>
    /\.(ts|tsx|json)$/.test(file),
  ),
  resolve('ki/reels/animation-history.json'),
  resolve('scripts/animation-library-render-config.mjs'),
  resolve('scripts/render-animation-library.mjs'),
  resolve('scripts/check-animation-library-renders.mjs'),
  resolve('scripts/render-content-matched-prototype.mjs'),
  resolve('scripts/check-native-prototype-bindings.mjs'),
].sort());

const hash = createHash('sha256');
for (const file of ANIMATION_LIBRARY_SOURCE_FILES) {
  hash.update(relative(process.cwd(), file).replaceAll('\\', '/'));
  hash.update('\0');
  hash.update(readFileSync(file));
  hash.update('\0');
}

export const ANIMATION_LIBRARY_SOURCE_FINGERPRINT = hash.digest('hex');

export const ANIMATION_LIBRARY_EXPECTED_ARTIFACT_COUNT =
  ANIMATION_LIBRARY_RENDER_CONFIG.prototypes.length *
  (
    ANIMATION_LIBRARY_RENDER_CONFIG.defaults.checkpoints.length +
    ANIMATION_LIBRARY_CONTENT_RENDER_FRAMES.length +
    1
  );
