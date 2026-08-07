import {describe, expect, it} from 'vitest';
import {createInitialCreativeBrainState} from '../brain';
import {analyzeSceneMeaning} from '../meaningContract';
import {planReelChoreography} from '../planner';
import type {AnimationLibraryEntry} from '../schema';

const entry = ({
  animationId,
  visualFamily,
  semanticTags,
  explanationPatterns,
  primitiveTags,
  avoidWhen = [],
  novelty = 70,
}: {
  animationId: string;
  visualFamily: string;
  semanticTags: string[];
  explanationPatterns: string[];
  primitiveTags: string[];
  avoidWhen?: string[];
  novelty?: number;
}): AnimationLibraryEntry => ({
  animationId,
  version: 1,
  title: animationId.replace(/-/g, ' '),
  description: `A content-specific ${visualFamily} animation using ${primitiveTags.join(', ')}.`,
  status: 'verified',
  visualFamily,
  layoutFamily: `${animationId}-layout`,
  motionSignature: `${animationId}-motion`,
  noveltyGroup: `${animationId}-novelty`,
  semanticTags,
  explanationPatterns,
  avoidWhen,
  primitiveTags,
  transitionInTags: [`${animationId}-in`],
  transitionOutTags: [`${animationId}-out`],
  cameraStyle: 'locked-camera',
  primaryDirection: 'left-to-right',
  energy: 'dynamic',
  density: 'balanced',
  complexity: 'medium',
  durationSeconds: {min: 2.5, max: 8},
  qualityPrior: {
    semanticClarity: 90,
    novelty,
    productionConfidence: 90,
  },
});

const TOKEN_ENTRY = entry({
  animationId: 'token-split-correct',
  visualFamily: 'tokenization',
  semanticTags: ['text', 'token', 'segmentation', 'ordered-pieces'],
  explanationPatterns: ['segmentation', 'part-to-whole'],
  primitiveTags: ['text-fragments', 'ordered-pieces', 'split-boundary'],
  novelty: 55,
});

const RANKING_ENTRY = entry({
  animationId: 'ranking-wrong-but-novel',
  visualFamily: 'ranking',
  semanticTags: ['ranking', 'score', 'podium', 'competition'],
  explanationPatterns: ['ordering', 'priority'],
  primitiveTags: ['podium', 'rank-bars', 'winner-badge'],
  novelty: 100,
});

const PROBABILITY_ENTRY = entry({
  animationId: 'probability-candidates',
  visualFamily: 'probability',
  semanticTags: ['probability', 'candidate', 'prediction', 'confidence'],
  explanationPatterns: ['candidate-selection', 'probability-shift'],
  primitiveTags: ['multiple-candidates', 'changing-confidence', 'selected-result'],
});

const RETRIEVAL_ENTRY = entry({
  animationId: 'retrieval-evidence',
  visualFamily: 'retrieval-search',
  semanticTags: ['search', 'retrieval', 'evidence', 'document'],
  explanationPatterns: ['retrieval', 'relevance-filtering'],
  primitiveTags: ['query-object', 'search-space', 'relevant-evidence'],
});

const plan = (
  entries: readonly AnimationLibraryEntry[],
  scenes: Parameters<typeof planReelChoreography>[0]['scenes'],
) =>
  planReelChoreography({
    reelId: 'content-match-test',
    reelIndex: 1,
    scenes,
    entries,
    brain: createInitialCreativeBrainState({
      entries,
      now: '2026-08-07T03:00:00.000Z',
    }),
  });

describe('content-first animation matching', () => {
  it('extracts a visible meaning contract from the exact spoken sentence', () => {
    const contract = analyzeSceneMeaning(
      'Die KI zerlegt den Text in kleine Tokens, damit sie ihn verarbeiten kann.',
    );

    expect(contract.communicationGoal).toBe('show-transformation');
    expect(contract.preferredVisualFamilies[0]).toBe('tokenization');
    expect(contract.visibleChange).toMatch(/separates|units/i);
    expect(contract.requiredVisualCues).toContain('split-boundary');
  });

  it('chooses the lower-novelty animation that actually explains the sentence', () => {
    const result = plan([TOKEN_ENTRY, RANKING_ENTRY], [
      {
        sceneId: 'scene-token',
        spokenText: 'Der Text wird in einzelne Tokens zerlegt.',
        semanticTags: ['text', 'explanation'],
      },
    ]);

    expect(result.selections[0].animationId).toBe(TOKEN_ENTRY.animationId);
    expect(result.selections[0].score?.meaningCompatibility).toBeGreaterThan(70);
    expect(result.selections[0].score?.total).toBeGreaterThan(68);
  });

  it('uses avoidWhen as a real rejection signal', () => {
    const unsafe = entry({
      animationId: 'token-split-unsafe',
      visualFamily: 'tokenization',
      semanticTags: ['text', 'token', 'segmentation'],
      explanationPatterns: ['segmentation', 'part-to-whole'],
      primitiveTags: ['text-fragments', 'ordered-pieces', 'split-boundary'],
      avoidWhen: ['token splitting'],
      novelty: 100,
    });

    const result = plan([unsafe, TOKEN_ENTRY], [
      {
        sceneId: 'scene-avoid',
        spokenText: 'Token splitting zerlegt Text in einzelne Teile.',
        semanticTags: ['token', 'text', 'segmentation'],
      },
    ]);

    expect(result.selections[0].animationId).toBe(TOKEN_ENTRY.animationId);
  });

  it('does not collapse later planning when a middle scene must be newly built', () => {
    const result = plan(
      [RETRIEVAL_ENTRY, TOKEN_ENTRY, PROBABILITY_ENTRY],
      [
        {
          sceneId: 'scene-search',
          spokenText: 'Die KI sucht passende Belege in Dokumenten.',
          semanticTags: ['search', 'retrieval', 'evidence'],
        },
        {
          sceneId: 'scene-new',
          spokenText: 'Der Text wird in Tokens zerlegt.',
          semanticTags: ['token', 'text', 'segmentation'],
          mustBeNew: true,
        },
        {
          sceneId: 'scene-probability',
          spokenText: 'Danach gewinnt das wahrscheinlichste Wort unter mehreren Kandidaten.',
          semanticTags: ['probability', 'candidate', 'prediction'],
        },
      ],
    );

    expect(result.selections[0].animationId).toBe(RETRIEVAL_ENTRY.animationId);
    expect(result.selections[1].animationId).toBeNull();
    expect(result.selections[1].newAnimationProposal).not.toBeNull();
    expect(result.selections[2].animationId).toBe(PROBABILITY_ENTRY.animationId);
  });

  it('passes the exact visible change into a new-animation proposal', () => {
    const result = plan([RANKING_ENTRY], [
      {
        sceneId: 'scene-proposal',
        spokenText: 'Das Modell erhöht die Wahrscheinlichkeit eines Kandidaten und wählt ihn aus.',
        semanticTags: ['probability', 'candidate', 'prediction'],
      },
    ]);

    const proposal = result.selections[0].newAnimationProposal;
    expect(proposal).not.toBeNull();
    expect(proposal?.spokenText).toContain('Wahrscheinlichkeit');
    expect(proposal?.meaningContract.visibleChange).toMatch(/confidence|candidate/i);
    expect(proposal?.suggestedVisualFamily).toBe('probability');
  });
});
