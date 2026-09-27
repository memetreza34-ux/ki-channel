import test from 'node:test';
import assert from 'node:assert/strict';
import {activeVisualCellRatio, classifyVisualFrameV4} from '../visual-contact-metrics.mjs';

const solid = (width, height, value = 250) => Buffer.alloc(width * height * 3, value);

const withBlock = (width, height) => {
  const buffer = solid(width, height, 248);
  for (let y = 12; y < height - 12; y += 1) {
    for (let x = 10; x < Math.floor(width * 0.62); x += 1) {
      const index = (y * width + x) * 3;
      buffer[index] = 40;
      buffer[index + 1] = 30;
      buffer[index + 2] = 80;
    }
  }
  return buffer;
};

test('activeVisualCellRatio distinguishes empty and visually occupied frames', () => {
  const width = 60;
  const height = 80;
  const emptyRatio = activeVisualCellRatio(solid(width, height), width, height, 3);
  const occupiedRatio = activeVisualCellRatio(withBlock(width, height), width, height, 3);
  assert.ok(emptyRatio < 0.05);
  assert.ok(occupiedRatio > emptyRatio);
  assert.ok(occupiedRatio >= 0.15);
});

test('V4 classifier flags an empty or underbuilt frame', () => {
  const warnings = classifyVisualFrameV4({
    whiteRatio: 0.98,
    edgeRatio: 0.002,
    luminanceDeviation: 2,
    chroma: 0,
    activeCellRatio: 0.01,
  });
  assert.ok(warnings.includes('EMPTY_OR_UNDERBUILT_FRAME'));
  assert.ok(warnings.includes('VERY_HIGH_WHITESPACE'));
});
