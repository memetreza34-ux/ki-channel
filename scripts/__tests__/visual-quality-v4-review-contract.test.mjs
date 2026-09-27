import test from 'node:test';
import assert from 'node:assert/strict';
import {evaluateHookReview, evaluateSceneReview, summarizeV4Review} from '../visual-quality-v4-review-contract.mjs';

const sample = (overrides = {}) => ({
  activeCellRatio: 0.32,
  edgeDensity: 0.04,
  warnings: [],
  ...overrides,
});

const scene = {
  sceneId: 'scene-a',
  hero: {screenAreaTarget: 0.32},
  motionPlan: {intentionalStillness: false},
};

test('strong hook and scene produce automated PASS', () => {
  const hookWarnings = evaluateHookReview({frame0: sample(), earlyPairDifferences: [10, 14, 12]});
  const sceneWarnings = evaluateSceneReview({scene, samples: [sample(), sample(), sample(), sample()], pairDifferences: [9, 11, 8], startEndDifference: 19});
  const summary = summarizeV4Review({hookWarnings, sceneReports: [{sceneId: 'scene-a', warnings: sceneWarnings}]});
  assert.deepEqual(hookWarnings, []);
  assert.deepEqual(sceneWarnings, []);
  assert.equal(summary.automatedStatus, 'PASS');
  assert.equal(summary.humanCreativeStatus, 'REQUIRED');
});

test('empty first frame is a severe hook failure', () => {
  const hookWarnings = evaluateHookReview({frame0: sample({activeCellRatio: 0.02, edgeDensity: 0.004}), earlyPairDifferences: [12, 11, 10]});
  assert.ok(hookWarnings.includes('EMPTY_HOOK_START'));
  assert.equal(summarizeV4Review({hookWarnings, sceneReports: []}).automatedStatus, 'FAIL');
});

test('static scene is rejected even if individual frames are technically clean', () => {
  const warnings = evaluateSceneReview({scene, samples: [sample(), sample(), sample(), sample()], pairDifferences: [2, 2.5, 3], startEndDifference: 2.8});
  assert.ok(warnings.includes('NO_VISIBLE_STORY_CHANGE'));
  assert.ok(warnings.includes('STATIC_SCENE_HOLD'));
});

test('repeated washed-out samples are rejected', () => {
  const washed = sample({warnings: ['LOW_CONTRAST_WASHED_OUT']});
  const warnings = evaluateSceneReview({scene, samples: [washed, washed, sample(), sample()], pairDifferences: [9, 10, 11], startEndDifference: 20});
  assert.ok(warnings.includes('WASHED_OUT_SCENE'));
});

test('large planned hero with tiny visual footprint is rejected', () => {
  const tiny = sample({activeCellRatio: 0.1, edgeDensity: 0.015});
  const warnings = evaluateSceneReview({scene, samples: [tiny, tiny, tiny, tiny], pairDifferences: [9, 9, 9], startEndDifference: 20});
  assert.ok(warnings.includes('HERO_FOOTPRINT_TOO_SMALL'));
});

test('intentional stillness can suppress static-hold warning but not missing story change', () => {
  const stillScene = {...scene, motionPlan: {intentionalStillness: true}};
  const warnings = evaluateSceneReview({scene: stillScene, samples: [sample(), sample(), sample(), sample()], pairDifferences: [2, 2, 2], startEndDifference: 2});
  assert.ok(!warnings.includes('STATIC_SCENE_HOLD'));
  assert.ok(warnings.includes('NO_VISIBLE_STORY_CHANGE'));
});
