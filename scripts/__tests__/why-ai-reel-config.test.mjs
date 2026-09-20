import assert from 'node:assert/strict';
import test from 'node:test';
import {
  WHY_AI_REEL_CONFIG,
  WHY_AI_REEL_SOURCE_FILES,
  WHY_AI_REEL_SOURCE_FINGERPRINT,
} from '../why-ai-reel-config.mjs';

test('reference reel render contract is complete and uses isolated production root', () => {
  assert.equal(WHY_AI_REEL_CONFIG.compositionId, 'Reel-WhyAIReadsDifferently');
  assert.equal(WHY_AI_REEL_CONFIG.entryPoint, 'ki/src/production-entry.tsx');
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

test('reference reel source fingerprint follows actual production-only sources', () => {
  assert.equal(
    new Set(WHY_AI_REEL_SOURCE_FILES).size,
    WHY_AI_REEL_SOURCE_FILES.length,
  );
  assert.deepEqual(
    [...WHY_AI_REEL_SOURCE_FILES].sort(),
    [...WHY_AI_REEL_SOURCE_FILES],
  );
  assert.ok(
    WHY_AI_REEL_SOURCE_FILES.some((file) => file.endsWith('/ki/src/ProductionRoot.tsx')),
  );
  assert.ok(
    WHY_AI_REEL_SOURCE_FILES.some((file) => file.endsWith('/ki/src/production-entry.tsx')),
  );
  assert.ok(
    WHY_AI_REEL_SOURCE_FILES.some((file) =>
      file.endsWith('/01_Warum-KI-Text-anders-liest/06-projektdateien/reel.json'),
    ),
  );
  assert.ok(
    WHY_AI_REEL_SOURCE_FILES.every(
      (file) => !file.includes('/ki/src/motion-system/'),
    ),
  );
  assert.ok(
    WHY_AI_REEL_SOURCE_FILES.every(
      (file) => !file.endsWith('/ki/src/Root.tsx') && !file.endsWith('/ki/src/index.ts'),
    ),
  );
  assert.match(WHY_AI_REEL_SOURCE_FINGERPRINT, /^[a-f0-9]{64}$/);
});
