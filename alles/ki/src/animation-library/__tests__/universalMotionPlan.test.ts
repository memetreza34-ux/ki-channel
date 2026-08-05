import {describe, expect, it} from 'vitest';
import {createUniversalReelMotionPlan} from '../universalMotionPlan';

const scenes = [
  {
    sceneId: 'scene-01',
    spokenText: 'ChatGPT zerlegt deinen Text zuerst in Tokens.',
    durationInFrames: 150,
    animationId: 'magnetic-phrase-slicer-v1',
    visualFamily: 'tokenization',
    layoutFamily: 'horizontal-magnetic-slice-field',
    motionSignature: 'sentence-enter-boundaries-cut-separate',
    transitionOutTags: ['token-piece'],
  },
  {
    sceneId: 'scene-02',
    spokenText: 'Danach wird jedes Token in Zahlen übersetzt.',
    durationInFrames: 150,
    animationId: 'vector-prism-converter-v1',
    visualFamily: 'data-transformation',
    layoutFamily: 'prismatic-vector-conversion-stage',
    motionSignature: 'token-enter-prism-spectrum-vector',
    transitionInTags: ['token-piece'],
    transitionOutTags: ['vector-output'],
  },
  {
    sceneId: 'scene-03',
    spokenText: 'Ähnliche Begriffe liegen im Bedeutungsraum näher beieinander.',
    durationInFrames: 150,
    animationId: 'meaning-terrain-v1',
    visualFamily: 'semantic-space',
    layoutFamily: 'topographic-meaning-terrain',
    motionSignature: 'points-rise-terrain-cluster-camera-settle',
    transitionInTags: ['vector-output'],
  },
  {
    sceneId: 'scene-04',
    spokenText: 'Die Antwort klingt überzeugend, kann aber trotzdem falsch sein.',
    durationInFrames: 150,
    animationId: 'confidence-glass-crack-v1',
    visualFamily: 'risk-contrast',
    layoutFamily: 'single-confidence-glass-stage',
    motionSignature: 'statement-form-confidence-rise-crack-reveal',
  },
] as const;

describe('universal reel motion plan', () => {
  it('covers every sentence and important word with varied full animations', () => {
    const plan = createUniversalReelMotionPlan({
      reelId: 'test-reel',
      scenes,
    });

    expect(plan.sceneCount).toBe(4);
    expect(plan.uniqueFullAnimationCount).toBe(4);
    expect(plan.uniqueVisualFamilyCount).toBe(4);
    expect(plan.sentenceCoverage).toBe(1);
    expect(plan.importantWordCoverage).toBe(1);
    expect(plan.animatedImportantWordCount).toBe(plan.importantWordCount);
    expect(plan.everythingAnimatedAsFarAsUseful).toBe(true);
    expect(plan.blockers).toEqual([]);
    expect(plan.scenes.every((scene) => scene.layers.length === 7)).toBe(true);
  });

  it('blocks duplicate full animation and repeated layout', () => {
    const invalid = createUniversalReelMotionPlan({
      reelId: 'invalid-reel',
      scenes: [
        scenes[0],
        {
          ...scenes[1],
          animationId: scenes[0].animationId,
          layoutFamily: scenes[0].layoutFamily,
        },
      ],
    });

    expect(invalid.everythingAnimatedAsFarAsUseful).toBe(false);
    expect(invalid.blockers.some((blocker) => blocker.includes('full animation'))).toBe(true);
    expect(invalid.blockers.some((blocker) => blocker.includes('repeat layout'))).toBe(true);
  });
});
