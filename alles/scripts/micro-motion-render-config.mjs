import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {relative, resolve} from 'node:path';
import rawConfig from '../ki/src/animation-library/micro-motion-render-config.json' with {type: 'json'};

const mechanisms = rawConfig.mechanismIds.map((mechanismId) => ({
  mechanismId,
  compositionId: `Micro-${mechanismId}`,
}));

export const MICRO_MOTION_RENDER_CONFIG = Object.freeze({
  entryPoint: rawConfig.entryPoint,
  outputDir: rawConfig.outputDir,
  defaults: Object.freeze({
    ...rawConfig.defaults,
    smokeCheckpoints: Object.freeze([...rawConfig.defaults.smokeCheckpoints]),
    checkpoints: Object.freeze([...rawConfig.defaults.checkpoints]),
  }),
  mechanisms: Object.freeze(mechanisms),
});

export const MICRO_MOTION_EXPECTED_ARTIFACT_COUNT =
  MICRO_MOTION_RENDER_CONFIG.mechanisms.length *
  (MICRO_MOTION_RENDER_CONFIG.defaults.checkpoints.length + 1);

export const MICRO_MOTION_SOURCE_FILES = Object.freeze([
  resolve('ki/src/animation-library/microMotionCatalog.ts'),
  resolve('ki/src/animation-library/microMotionRuntime.tsx'),
  resolve('ki/src/animation-library/MicroMotionGalleryRoot.tsx'),
  resolve('ki/src/animation-library/micro-motion-remotion-entry.tsx'),
  resolve('ki/src/animation-library/micro-motion-render-config.json'),
  resolve('ki/src/animation-library/prototypes/PrototypeShell.tsx'),
].sort());

const hash = createHash('sha256');
for (const file of MICRO_MOTION_SOURCE_FILES) {
  hash.update(relative(process.cwd(), file).replaceAll('\\', '/'));
  hash.update('\0');
  hash.update(readFileSync(file));
  hash.update('\0');
}

export const MICRO_MOTION_SOURCE_FINGERPRINT = hash.digest('hex');
