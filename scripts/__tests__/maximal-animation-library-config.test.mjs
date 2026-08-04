import assert from 'node:assert/strict';
import test from 'node:test';
import {
  MAXIMAL_ANIMATION_LIBRARY_EXPECTED_ARTIFACT_COUNT,
  MAXIMAL_ANIMATION_LIBRARY_RENDER_CONFIG,
  MAXIMAL_ANIMATION_LIBRARY_SOURCE_FILES,
  MAXIMAL_ANIMATION_LIBRARY_SOURCE_FINGERPRINT,
} from '../maximal-animation-library-render-config.mjs';

test('maximal animation library contains 66 unique contracts', () => {
  const config = MAXIMAL_ANIMATION_LIBRARY_RENDER_CONFIG;
  assert.equal(config.prototypes.length, 66);
  assert.equal(new Set(config.prototypes.map((item) => item.compositionId)).size, 66);
  assert.equal(new Set(config.prototypes.map((item) => item.animationId)).size, 66);
  assert.deepEqual(config.defaults.checkpoints, [0, 30, 60, 90, 120, 150, 179]);
  assert.deepEqual(config.defaults.smokeCheckpoints, [0, 90, 179]);
  assert.equal(config.defaults.width, 1080);
  assert.equal(config.defaults.height, 1920);
  assert.equal(config.defaults.fps, 30);
  assert.equal(config.defaults.durationInFrames, 180);
  assert.equal(MAXIMAL_ANIMATION_LIBRARY_EXPECTED_ARTIFACT_COUNT, 528);
});

test('maximal library fingerprint has portable stable shape', () => {
  assert.ok(MAXIMAL_ANIMATION_LIBRARY_SOURCE_FILES.length >= 50);
  assert.equal(
    new Set(MAXIMAL_ANIMATION_LIBRARY_SOURCE_FILES).size,
    MAXIMAL_ANIMATION_LIBRARY_SOURCE_FILES.length,
  );
  assert.deepEqual(
    [...MAXIMAL_ANIMATION_LIBRARY_SOURCE_FILES].sort(),
    [...MAXIMAL_ANIMATION_LIBRARY_SOURCE_FILES],
  );
  assert.match(MAXIMAL_ANIMATION_LIBRARY_SOURCE_FINGERPRINT, /^[a-f0-9]{64}$/);
});
