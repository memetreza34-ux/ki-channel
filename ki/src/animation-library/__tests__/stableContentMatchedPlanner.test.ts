import {describe, expect, it} from 'vitest';
import {createInitialCreativeBrainState} from '../brain';
import {planReelChoreography} from '../planner';
import type {AnimationLibraryEntry} from '../schema';

const createEntry = ({
  animationId,
  primitiveTags,
  avoidWhen = [],
}: {
  animationId: string;
  primitiveTags: string[];
  avoidWhen?: string[];
}): AnimationLibraryEntry => ({
  animationId,
  version: 1,
  title: 'Token segmentation animation',
  description:
    'A readable sentence separates into ordered token units and remains available for the next processing step.',
  status: 'verified',
  visualFamily: 'tokenization',
  layoutFamily: `${animationId}-layout`,
  motionSignature: `${animationId}-motion`,
  noveltyGroup: `${animationId}-novelty`,
  semanticTags: ['token', 'text', 'segmentation', 'ordered-pieces'],
  explanationPatterns: ['segmentation', 'part-to-whole'],
  avoidWhen,
  primitiveTags,
  transitionInTags: ['text-entry'],
  transitionOutTags: ['token-result'],
  cameraStyle: 'locked-front',
  primaryDirection: 'center-out',
  energy: 'dynamic',
  density: 'balanced',
  complexity: 'medium',
  durationSeconds: {min: 2.5, max: 8},
  qualityPrior: {
    semanticClarity: 92,
    novelty: 82,
    productionConfidence: 90,
  },
});

const TOKEN_ENTRY = createEntry({
  animationId: 'token-safe',
  primitiveTags: ['text-fragments', 'ordered-pieces', 'split-boundary'],
});

const createBrain = (entries: readonly AnimationLibraryEntry[]) => {
  const brain = createInitialCreativeBrainState({
    entries,
    now: '2026-08-07T03:40:00.000Z',
  });
  return {
    ...brain,
    globalRules: {
      ...brain.globalRules,
      preferNewAnimationBelowScore: 55,
    },
  };
};

describe('stable content-matched planner', () => {
  it('does not consume a library animation for a forced new-build scene', () => {
    const result = planReelChoreography({
      reelId: 'forced-new-does-not-reserve-library-entry',
      reelIndex: 1,
      entries: [TOKEN_ENTRY],
      brain: createBrain([TOKEN_ENTRY]),
      scenes: [
        {
          sceneId: 'forced-new',
          spokenText: 'Der Text wird in einzelne Tokens zerlegt.',
          semanticTags: ['token', 'text', 'segmentation'],
          mustBeNew: true,
        },
        {
          sceneId: 'library-reuse',
          spokenText: 'Danach wird ein weiterer Satz ebenfalls in Tokens zerlegt.',
          semanticTags: ['token', 'text', 'segmentation'],
        },
      ],
    });

    expect(result.selections[0].animationId).toBeNull();
    expect(result.selections[0].newAnimationProposal).not.toBeNull();
    expect(result.selections[1].animationId).toBe(TOKEN_ENTRY.animationId);
  });

  it('treats avoidWhen as a hard rejection instead of a soft novelty tradeoff', () => {
    const unsafe = createEntry({
      animationId: 'token-avoid-when-unsafe',
      primitiveTags: ['text-fragments', 'ordered-pieces', 'split-boundary'],
      avoidWhen: ['token splitting'],
    });
    const result = planReelChoreography({
      reelId: 'avoid-when-hard-rejection',
      reelIndex: 2,
      entries: [unsafe],
      brain: createBrain([unsafe]),
      scenes: [
        {
          sceneId: 'token-scene',
          spokenText: 'Token splitting zerlegt den Text in einzelne Teile.',
          semanticTags: ['token', 'text', 'segmentation'],
        },
      ],
    });

    expect(result.selections[0].animationId).toBeNull();
    expect(result.selections[0].newAnimationProposal).not.toBeNull();
  });

  it('rejects a podium shortcut when the sentence is not a ranking', () => {
    const misleading = createEntry({
      animationId: 'token-podium-shortcut',
      primitiveTags: ['podium', 'ordered-pieces', 'split-boundary'],
    });
    const result = planReelChoreography({
      reelId: 'no-podium-without-ranking',
      reelIndex: 3,
      entries: [misleading],
      brain: createBrain([misleading]),
      scenes: [
        {
          sceneId: 'token-scene',
          spokenText: 'Der Text wird in einzelne Tokens zerlegt.',
          semanticTags: ['token', 'text', 'segmentation'],
        },
      ],
    });

    expect(result.selections[0].animationId).toBeNull();
    expect(result.selections[0].newAnimationProposal).not.toBeNull();
  });
});
