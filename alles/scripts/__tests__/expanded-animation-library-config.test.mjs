import assert from 'node:assert/strict';
import test from 'node:test';
import {
  EXPANDED_ANIMATION_LIBRARY_EXPECTED_ARTIFACT_COUNT,
  EXPANDED_ANIMATION_LIBRARY_RENDER_CONFIG,
  EXPANDED_ANIMATION_LIBRARY_SOURCE_FILES,
  EXPANDED_ANIMATION_LIBRARY_SOURCE_FINGERPRINT,
} from '../expanded-animation-library-render-config.mjs';

test('expanded animation library contains 44 unique contracts', () => {
  const config = EXPANDED_ANIMATION_LIBRARY_RENDER_CONFIG;
  assert.equal(config.prototypes.length, 44);
  assert.equal(new Set(config.prototypes.map((item) => item.compositionId)).size, 44);
  assert.equal(new Set(config.prototypes.map((item) => item.animationId)).size, 44);
  assert.deepEqual(config.defaults.checkpoints, [0, 30, 60, 90, 120, 150, 179]);
  assert.deepEqual(config.defaults.smokeCheckpoints, [0, 90, 179]);
  assert.equal(config.defaults.width, 1080);
  assert.equal(config.defaults.height, 1920);
  assert.equal(config.defaults.fps, 30);
  assert.equal(config.defaults.durationInFrames, 180);
  assert.equal(EXPANDED_ANIMATION_LIBRARY_EXPECTED_ARTIFACT_COUNT, 352);
});

test('expanded library fingerprint has portable stable shape', () => {
  assert.ok(EXPANDED_ANIMATION_LIBRARY_SOURCE_FILES.length >= 45);
  assert.equal(
    new Set(EXPANDED_ANIMATION_LIBRARY_SOURCE_FILES).size,
    EXPANDED_ANIMATION_LIBRARY_SOURCE_FILES.length,
  );
  assert.deepEqual(
    [...EXPANDED_ANIMATION_LIBRARY_SOURCE_FILES].sort(),
    [...EXPANDED_ANIMATION_LIBRARY_SOURCE_FILES],
  );
  assert.match(EXPANDED_ANIMATION_LIBRARY_SOURCE_FINGERPRINT, /^[a-f0-9]{64}$/);
});
