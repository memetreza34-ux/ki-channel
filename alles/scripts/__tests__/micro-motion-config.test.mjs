import assert from 'node:assert/strict';
import test from 'node:test';
import {
  MICRO_MOTION_EXPECTED_ARTIFACT_COUNT,
  MICRO_MOTION_RENDER_CONFIG,
  MICRO_MOTION_SOURCE_FILES,
  MICRO_MOTION_SOURCE_FINGERPRINT,
} from '../micro-motion-render-config.mjs';

test('semantic micro-motion render contract is complete', () => {
  const config = MICRO_MOTION_RENDER_CONFIG;
  assert.equal(config.mechanisms.length, 38);
  assert.equal(new Set(config.mechanisms.map((item) => item.mechanismId)).size, 38);
  assert.equal(new Set(config.mechanisms.map((item) => item.compositionId)).size, 38);
  assert.deepEqual(config.defaults.smokeCheckpoints, [0, 45, 89]);
  assert.deepEqual(config.defaults.checkpoints, [0, 20, 45, 70, 89]);
  assert.equal(config.defaults.width, 1080);
  assert.equal(config.defaults.height, 1920);
  assert.equal(config.defaults.fps, 30);
  assert.equal(config.defaults.durationInFrames, 90);
  assert.equal(MICRO_MOTION_EXPECTED_ARTIFACT_COUNT, 228);
});

test('semantic micro-motion fingerprint has portable shape', () => {
  assert.equal(new Set(MICRO_MOTION_SOURCE_FILES).size, MICRO_MOTION_SOURCE_FILES.length);
  assert.deepEqual([...MICRO_MOTION_SOURCE_FILES].sort(), [...MICRO_MOTION_SOURCE_FILES]);
  assert.match(MICRO_MOTION_SOURCE_FINGERPRINT, /^[a-f0-9]{64}$/);
});
