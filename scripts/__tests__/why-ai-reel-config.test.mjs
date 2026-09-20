import assert from 'node:assert/strict';
import test from 'node:test';
import {
  WHY_AI_REEL_CONFIG,
  WHY_AI_REEL_SOURCE_FILES,
  WHY_AI_REEL_SOURCE_FINGERPRINT,
} from '../why-ai-reel-config.mjs';

test('reference reel render contract is complete and uses canonical production root', () => {
  assert.equal(WHY_AI_REEL_CONFIG.compositionId, 'Reel-WhyAIReadsDifferently');
  assert.equal(WHY_AI_REEL_CONFIG.entryPoint, 'ki/src/index.ts');
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

test('reference reel source fingerprint follows current production sources only', () => {
  assert.equal(
    new Set(WHY_AI_REEL_SOURCE_FILES).size,
    WHY_AI_REEL_SOURCE_FILES.length,
  );
  assert.deepEqual(
    [...WHY_AI_REEL_SOURCE_FILES].sort(),
    [...WHY_AI_REEL_SOURCE_FILES],
  );

  for (const requiredSuffix of [
    '/ki/src/Root.tsx',
    '/ki/src/index.ts',
    '/ki/brand/brand.ts',
    '/ki/src/reels/why-ai-reads-differently/ReelWhyAIReadsDifferently.tsx',
    '/ki/src/reels/why-ai-reads-differently/contract.ts',
    '/ki/src/reels/why-ai-reads-differently/visualProfiles.ts',
    '/01_Warum-KI-Text-anders-liest/06-projektdateien/reel.json',
  ]) {
    assert.ok(
      WHY_AI_REEL_SOURCE_FILES.some((file) => file.endsWith(requiredSuffix)),
      `missing required production source: ${requiredSuffix}`,
    );
  }

  assert.ok(
    WHY_AI_REEL_SOURCE_FILES.every(
      (file) =>
        !file.includes('/ki/src/motion-system/') &&
        !file.includes('/__tests__/') &&
        !file.includes('\\__tests__\\') &&
        !/\.(?:test|spec)\.(?:ts|tsx)$/.test(file),
    ),
  );
  assert.match(WHY_AI_REEL_SOURCE_FINGERPRINT, /^[a-f0-9]{64}$/);
});
