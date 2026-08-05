import assert from 'node:assert/strict';
import test from 'node:test';
import {
  COMPLETE_ANIMATION_LIBRARY_EXPECTED_ARTIFACT_COUNT,
  COMPLETE_ANIMATION_LIBRARY_RENDER_CONFIG,
  COMPLETE_ANIMATION_LIBRARY_SOURCE_FILES,
  COMPLETE_ANIMATION_LIBRARY_SOURCE_FINGERPRINT,
} from '../complete-animation-library-render-config.mjs';

test('complete animation library contains 22 unique prototype contracts', () => {
  const config = COMPLETE_ANIMATION_LIBRARY_RENDER_CONFIG;
  assert.equal(config.prototypes.length, 22);
  assert.equal(new Set(config.prototypes.map((item) => item.compositionId)).size, 22);
  assert.equal(new Set(config.prototypes.map((item) => item.animationId)).size, 22);
  assert.deepEqual(config.defaults.checkpoints, [0, 30, 60, 90, 120, 150, 179]);
  assert.deepEqual(config.defaults.smokeCheckpoints, [0, 90, 179]);
  assert.equal(config.defaults.width, 1080);
  assert.equal(config.defaults.height, 1920);
  assert.equal(config.defaults.fps, 30);
  assert.equal(config.defaults.durationInFrames, 180);
  assert.equal(COMPLETE_ANIMATION_LIBRARY_EXPECTED_ARTIFACT_COUNT, 176);
});

test('complete library fingerprint has stable portable shape', () => {
  assert.ok(COMPLETE_ANIMATION_LIBRARY_SOURCE_FILES.length >= 40);
  assert.equal(
    new Set(COMPLETE_ANIMATION_LIBRARY_SOURCE_FILES).size,
    COMPLETE_ANIMATION_LIBRARY_SOURCE_FILES.length,
  );
  assert.deepEqual(
    [...COMPLETE_ANIMATION_LIBRARY_SOURCE_FILES].sort(),
    [...COMPLETE_ANIMATION_LIBRARY_SOURCE_FILES],
  );
  assert.match(COMPLETE_ANIMATION_LIBRARY_SOURCE_FINGERPRINT, /^[a-f0-9]{64}$/);
});
