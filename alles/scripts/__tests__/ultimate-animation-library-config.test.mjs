import assert from 'node:assert/strict';
import test from 'node:test';
import {
  ULTIMATE_ANIMATION_LIBRARY_EXPECTED_ARTIFACT_COUNT,
  ULTIMATE_ANIMATION_LIBRARY_RENDER_CONFIG,
  ULTIMATE_ANIMATION_LIBRARY_SOURCE_FILES,
  ULTIMATE_ANIMATION_LIBRARY_SOURCE_FINGERPRINT,
} from '../ultimate-animation-library-render-config.mjs';

test('ultimate animation library contains 88 unique contracts', () => {
  const config = ULTIMATE_ANIMATION_LIBRARY_RENDER_CONFIG;
  assert.equal(config.prototypes.length, 88);
  assert.equal(new Set(config.prototypes.map((item) => item.compositionId)).size, 88);
  assert.equal(new Set(config.prototypes.map((item) => item.animationId)).size, 88);
  assert.deepEqual(config.defaults.checkpoints, [0, 30, 60, 90, 120, 150, 179]);
  assert.deepEqual(config.defaults.smokeCheckpoints, [0, 90, 179]);
  assert.equal(config.defaults.width, 1080);
  assert.equal(config.defaults.height, 1920);
  assert.equal(config.defaults.fps, 30);
  assert.equal(config.defaults.durationInFrames, 180);
  assert.equal(ULTIMATE_ANIMATION_LIBRARY_EXPECTED_ARTIFACT_COUNT, 704);
});

test('ultimate library fingerprint has portable stable shape', () => {
  assert.ok(ULTIMATE_ANIMATION_LIBRARY_SOURCE_FILES.length >= 55);
  assert.equal(
    new Set(ULTIMATE_ANIMATION_LIBRARY_SOURCE_FILES).size,
    ULTIMATE_ANIMATION_LIBRARY_SOURCE_FILES.length,
  );
  assert.deepEqual(
    [...ULTIMATE_ANIMATION_LIBRARY_SOURCE_FILES].sort(),
    [...ULTIMATE_ANIMATION_LIBRARY_SOURCE_FILES],
  );
  assert.match(ULTIMATE_ANIMATION_LIBRARY_SOURCE_FINGERPRINT, /^[a-f0-9]{64}$/);
});
