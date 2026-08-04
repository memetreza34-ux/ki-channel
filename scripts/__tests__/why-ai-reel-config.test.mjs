import assert from 'node:assert/strict';
import test from 'node:test';
import {
  WHY_AI_REEL_CONFIG,
  WHY_AI_REEL_SOURCE_FILES,
  WHY_AI_REEL_SOURCE_FINGERPRINT,
} from '../why-ai-reel-config.mjs';

test('reference reel render contract is complete', () => {
  assert.equal(WHY_AI_REEL_CONFIG.compositionId, 'Reel-WhyAIReadsDifferently');
  assert.equal(WHY_AI_REEL_CONFIG.width, 1080);
  assert.equal(WHY_AI_REEL_CONFIG.height, 1920);
  assert.equal(WHY_AI_REEL_CONFIG.fps, 30);
  assert.equal(WHY_AI_REEL_CONFIG.durationInFrames, 1080);
  assert.equal(WHY_AI_REEL_CONFIG.checkpoints.length, 32);
  assert.equal(new Set(WHY_AI_REEL_CONFIG.checkpoints).size, 32);
  assert.ok(
    WHY_AI_REEL_CONFIG.checkpoints.every(
      (frame, index, frames) =>
        Number.isInteger(frame) &&
        frame >= 0 &&
        frame < WHY_AI_REEL_CONFIG.durationInFrames &&
        (index === 0 || frame > frames[index - 1]),
    ),
  );
});

test('reference reel source fingerprint is stable in shape', () => {
  assert.ok(WHY_AI_REEL_SOURCE_FILES.length >= 15);
  assert.equal(
    new Set(WHY_AI_REEL_SOURCE_FILES).size,
    WHY_AI_REEL_SOURCE_FILES.length,
  );
  assert.deepEqual(
    [...WHY_AI_REEL_SOURCE_FILES].sort(),
    [...WHY_AI_REEL_SOURCE_FILES],
  );
  assert.match(WHY_AI_REEL_SOURCE_FINGERPRINT, /^[a-f0-9]{64}$/);
});
