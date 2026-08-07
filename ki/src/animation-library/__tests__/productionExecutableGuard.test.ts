import {describe, expect, it} from 'vitest';
import {createInitialCreativeBrainState} from '../brain';
import {ANIMATION_LIBRARY_ENTRIES} from '../catalog';
import {EXECUTABLE_ANIMATION_IDS} from '../executionCatalog';
import {planProductionReelAnimations} from '../productionPlanner';

const brain = createInitialCreativeBrainState({
  entries: ANIMATION_LIBRARY_ENTRIES,
  now: '2026-08-07T18:30:00.000Z',
});

describe('production executable guard', () => {
  it('falls back to a new build when every supplied catalog entry is unregistered', () => {
    const sourceEntry = ANIMATION_LIBRARY_ENTRIES.find(
      (entry) => entry.visualFamily === 'retrieval-search',
    );
    expect(sourceEntry).toBeDefined();

    const unregisteredAnimationId =
      'retrieval-search-unregistered-only-input-test-v1';
    const unregisteredEntry = {
      ...sourceEntry!,
      animationId: unregisteredAnimationId,
      name: 'Unregistered Only Input Test',
      semanticTags: [
        'search',
        'retrieval',
        'evidence',
        'document',
        'source',
        'relevance',
      ],
      useWhen: [
        'the scene searches documents and selects only relevant evidence',
      ],
      avoidWhen: [],
      qualityPrior: {
        semanticClarity: 1,
        novelty: 1,
        productionConfidence: 1,
      },
    };

    expect(EXECUTABLE_ANIMATION_IDS).not.toContain(unregisteredAnimationId);

    const plan = planProductionReelAnimations({
      reelId: 'reel-no-executable-reuse',
      reelIndex: 22,
      entries: [unregisteredEntry],
      brain,
      maximumNewAnimationRatio: 1,
      scenes: [
        {
          sceneId: 'scene-only-unregistered',
          spokenText:
            'Die Suche durchsucht viele Dokumente und zieht nur die wirklich relevanten Belege heran.',
          semanticTags: [
            'search',
            'retrieval',
            'evidence',
            'document',
            'source',
            'relevance',
          ],
          preferredVisualFamilies: ['retrieval-search'],
          preferredEnergy: 'dynamic',
        },
      ],
    });

    expect(plan.scenes).toHaveLength(1);
    expect(plan.scenes[0].source).toBe('new-build');
    expect(plan.scenes[0].animationId).not.toBe(unregisteredAnimationId);
    expect(plan.scenes[0].buildSpec).not.toBeNull();
    expect(plan.newAnimationCount).toBe(1);
    expect(plan.reusedAnimationCount).toBe(0);
  });
});
