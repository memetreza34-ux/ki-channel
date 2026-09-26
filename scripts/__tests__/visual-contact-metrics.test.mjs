import assert from 'node:assert/strict';
import test from 'node:test';
import {
  classifyFramePair,
  classifyVisualFrame,
  edgeDensity,
  luminanceStdDev,
  meanAbsoluteRgbDifference,
  meanChroma,
  whitePixelRatio,
} from '../visual-contact-metrics.mjs';

const rgba = (...pixels) => Buffer.from(pixels.flat());

test('whitePixelRatio detects near-white pixels', () => {
  const buffer = rgba([255,255,255,255],[250,250,250,255],[20,20,20,255],[245,245,245,255]);
  assert.equal(whitePixelRatio(buffer, 4, 245), 0.75);
});

test('meanAbsoluteRgbDifference distinguishes changed frames', () => {
  const left = rgba([0,0,0,255],[0,0,0,255]);
  const right = rgba([30,30,30,255],[30,30,30,255]);
  assert.equal(meanAbsoluteRgbDifference(left, right, 4), 30);
  assert.deepEqual(classifyFramePair(30), []);
  assert.deepEqual(classifyFramePair(2), ['NEAR_STATIC_SAMPLE_PAIR']);
});

test('edgeDensity notices a hard black-white edge', () => {
  const buffer = rgba([0,0,0,255],[255,255,255,255],[0,0,0,255],[255,255,255,255]);
  assert.ok(edgeDensity(buffer, 2, 2, 4, 20) > 0);
});

test('contrast and chroma metrics distinguish strong from washed-out pixels', () => {
  const strong = rgba([10,10,20,255],[250,250,255,255],[110,69,201,255],[255,255,255,255]);
  const washed = rgba([246,244,248,255],[250,248,251,255],[242,240,245,255],[248,246,249,255]);
  assert.ok(luminanceStdDev(strong, 4) > luminanceStdDev(washed, 4));
  assert.ok(meanChroma(strong, 4) > meanChroma(washed, 4));
});

test('classifyVisualFrame warns on very empty frames', () => {
  assert.deepEqual(classifyVisualFrame({whiteRatio: 0.94, edgeRatio: 0.005}), ['VERY_HIGH_WHITESPACE','VERY_LOW_VISUAL_COMPLEXITY']);
});

test('classifyVisualFrame reports washed-out frames when metrics are available', () => {
  assert.ok(classifyVisualFrame({whiteRatio: 0.72, edgeRatio: 0.03, luminanceDeviation: 12, chroma: 7}).includes('LOW_CONTRAST_WASHED_OUT'));
  assert.ok(classifyVisualFrame({whiteRatio: 0.72, edgeRatio: 0.03, luminanceDeviation: 12, chroma: 7}).includes('VERY_LOW_COLOR_SEPARATION'));
});
