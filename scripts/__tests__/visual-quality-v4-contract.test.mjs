import test from 'node:test';
import assert from 'node:assert/strict';
import {futureReelNeedsV4, validateVisualQualityV4Manifest} from '../visual-quality-v4-contract.mjs';

const scene = (sceneId, archetype, startFrame) => ({
  sceneId,
  archetype,
  startFrame,
  durationFrames: 150,
  story: {
    startState: `${sceneId} begins with a clearly visible object state`,
    visibleChange: `${sceneId} transforms through an obvious on-screen action`,
    endState: `${sceneId} ends in a visibly different resolved state`,
    visualVerb: 'transforms',
  },
  hero: {
    semanticType: archetype === 'device-scene' ? 'smartphone-browser-device' : 'workflow-object',
    meaning: `The hero explains the core meaning of ${sceneId}`,
    screenAreaTarget: 0.32,
    recognitionCues: [
      {id: 'silhouette', description: 'A distinct recognizable silhouette'},
      {id: 'state-label', description: 'A state-specific visual cue'},
    ],
  },
  meaningfulStateChanges: 4,
  microBeats: 3,
  contrast: 'strong',
  motionPlan: {
    entry: 'Hero enters already readable and establishes the initial state',
    development: 'The main object changes while support elements react',
    payoff: 'The transformed result becomes the dominant final image',
    payoffAtProgress: 0.78,
    maxStaticHoldFrames: 60,
    intentionalStillness: false,
  },
});

const validManifest = () => ({
  version: 4,
  compositionId: 'KI-V4-Test',
  fps: 30,
  sourceQualityContract: 'ki/src/reels/v4-test/visualQuality.ts',
  hook: {
    sceneId: 'scene-01',
    firstFrameHeroVisible: true,
    keyMessageByFrame: 12,
    firstMajorChangeByFrame: 24,
    heroAreaRatio: 0.34,
    semanticVisualAnchors: 3,
    recognitionCues: ['hero object', 'visible consequence'],
    contrast: 'strong',
    conflictVisible: true,
    keyMessageVisible: true,
    visualVerb: 'breaks',
  },
  scenes: [
    scene('scene-01', 'hero-impact', 0),
    scene('scene-02', 'device-scene', 150),
    scene('scene-03', 'network-flow', 300),
    scene('scene-04', 'object-transformation', 450),
  ],
  targetScores: {
    hook: 8.5,
    semanticClarity: 8.5,
    storyMotion: 8.5,
    visualVariety: 8.5,
    readability: 8.5,
    overall: 8.5,
  },
});

test('valid V4 manifest passes', () => {
  assert.deepEqual(validateVisualQualityV4Manifest(validManifest()), []);
});

test('V4 rejects fade-from-empty hook and weak visual verbs', () => {
  const manifest = validManifest();
  manifest.hook.firstFrameHeroVisible = false;
  manifest.hook.visualVerb = 'shows';
  manifest.scenes[2].story.visualVerb = 'zeigt';
  const errors = validateVisualQualityV4Manifest(manifest);
  assert.ok(errors.some((error) => error.includes('firstFrameHeroVisible')));
  assert.ok(errors.some((error) => error.includes('hook.visualVerb')));
  assert.ok(errors.some((error) => error.includes('story.visualVerb')));
});

test('V4 rejects abstract device hero and missing recognition cues', () => {
  const manifest = validManifest();
  manifest.scenes[1].hero.semanticType = 'rectangle';
  manifest.scenes[1].hero.recognitionCues = [{id: 'one', description: 'Only one cue'}];
  const errors = validateVisualQualityV4Manifest(manifest);
  assert.ok(errors.some((error) => error.includes('too abstract for device-scene')));
  assert.ok(errors.some((error) => error.includes('recognitionCues needs at least 2')));
});

test('V4 rejects long unplanned static holds', () => {
  const manifest = validManifest();
  manifest.scenes[0].motionPlan.maxStaticHoldFrames = 120;
  const errors = validateVisualQualityV4Manifest(manifest);
  assert.ok(errors.some((error) => error.includes('maxStaticHoldFrames')));
});

test('V4 allows limited intentional stillness only with a reason', () => {
  const manifest = validManifest();
  manifest.scenes[0].motionPlan.intentionalStillness = true;
  manifest.scenes[0].motionPlan.stillnessReason = 'The short hold lets the viewer read the resolved comparison before the cut.';
  manifest.scenes[0].motionPlan.maxStaticHoldFrames = 90;
  assert.deepEqual(validateVisualQualityV4Manifest(manifest), []);
});

test('V4 does not force four archetypes or arbitrary micro-beat quotas', () => {
  const manifest = validManifest();
  manifest.scenes = [
    scene('scene-01', 'hero-impact', 0),
    scene('scene-02', 'hero-impact', 150),
  ];
  manifest.scenes[0].meaningfulStateChanges = 1;
  manifest.scenes[0].microBeats = 0;
  manifest.scenes[1].meaningfulStateChanges = 1;
  manifest.scenes[1].microBeats = 0;
  manifest.hook.semanticVisualAnchors = 1;
  manifest.hook.conflictVisible = false;
  assert.deepEqual(validateVisualQualityV4Manifest(manifest), []);
});

test('V4 starts with week 2026-09-28 while V3 remains legacy', () => {
  assert.equal(futureReelNeedsV4('2026-09-21_bis_2026-09-27'), false);
  assert.equal(futureReelNeedsV4('2026-09-28_bis_2026-10-04'), true);
});
