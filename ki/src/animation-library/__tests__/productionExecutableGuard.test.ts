import {describe, expect, it} from 'vitest';
import {createInitialCreativeBrainState} from '../brain';
import {ANIMATION_LIBRARY_ENTRIES} from '../catalog';
import {EXECUTABLE_ANIMATION_IDS} from '../executionCatalog';
import {NATIVE_CONTENT_BOUND_PROTOTYPE_IDS} from '../prototypeContentCoverage';
import {
  getProductionReadyLibraryEntries,
  PRODUCTION_READY_LIBRARY_ANIMATION_IDS,
} from '../productionEligibility';
import {planProductionReelAnimations} from '../productionPlanner';

const brain = createInitialCreativeBrainState({
  entries: ANIMATION_LIBRARY_ENTRIES,
  now: '2026-08-07T18:30:00.000Z',
});

describe('production executable guard', () => {
  it('defines production reuse as executable plus native content binding', () => {
    expect(PRODUCTION_READY_LIBRARY_ANIMATION_IDS).toHaveLength(22);
    expect(getProductionReadyLibraryEntries(ANIMATION_LIBRARY_ENTRIES)).toHaveLength(22);

    for (const animationId of PRODUCTION_READY_LIBRARY_ANIMATION_IDS) {
      expect(EXECUTABLE_ANIMATION_IDS).toContain(animationId);
      expect(NATIVE_CONTENT_BOUND_PROTOTYPE_IDS.has(animationId)).toBe(true);
    }
  });

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
    expect(plan.readyForImplementation).toBe(false);
  });

  it('does not reuse an executable variant that only has semantic-shell binding', () => {
    const shellOnlyEntry = ANIMATION_LIBRARY_ENTRIES.find(
      (entry) =>
        EXECUTABLE_ANIMATION_IDS.includes(entry.animationId) &&
        !NATIVE_CONTENT_BOUND_PROTOTYPE_IDS.has(entry.animationId),
    );
    expect(shellOnlyEntry).toBeDefined();

    const plan = planProductionReelAnimations({
      reelId: 'reel-shell-only-rejected',
      reelIndex: 23,
      entries: [shellOnlyEntry!],
      brain,
      maximumNewAnimationRatio: 1,
      scenes: [
        {
          sceneId: 'scene-shell-only',
          spokenText:
            'Diese Szene braucht eine Animation, deren sichtbare Objekte den konkreten Sprecherinhalt direkt übernehmen.',
          semanticTags: [...shellOnlyEntry!.semanticTags],
          preferredVisualFamilies: [shellOnlyEntry!.visualFamily],
          preferredEnergy: shellOnlyEntry!.energy,
        },
      ],
    });

    expect(plan.scenes).toHaveLength(1);
    expect(plan.scenes[0].source).toBe('new-build');
    expect(plan.scenes[0].animationId).not.toBe(shellOnlyEntry!.animationId);
    expect(plan.scenes[0].buildSpec).not.toBeNull();
    expect(plan.reusedAnimationCount).toBe(0);
    expect(plan.readyForImplementation).toBe(false);
  });

  it('does not reuse a retired entry even when its animation id is otherwise production-ready', () => {
    const productionReadyEntry = ANIMATION_LIBRARY_ENTRIES.find((entry) =>
      PRODUCTION_READY_LIBRARY_ANIMATION_IDS.includes(entry.animationId),
    );
    expect(productionReadyEntry).toBeDefined();

    const retiredEntry = {
      ...productionReadyEntry!,
      status: 'retired' as const,
    };
    expect(getProductionReadyLibraryEntries([retiredEntry])).toEqual([]);

    const plan = planProductionReelAnimations({
      reelId: 'reel-retired-rejected',
      reelIndex: 24,
      entries: [retiredEntry],
      brain,
      maximumNewAnimationRatio: 1,
      scenes: [
        {
          sceneId: 'scene-retired',
          spokenText:
            'Die Szene benötigt eine aktuell freigegebene content-aware Animation.',
          semanticTags: [...retiredEntry.semanticTags],
          preferredVisualFamilies: [retiredEntry.visualFamily],
          preferredEnergy: retiredEntry.energy,
        },
      ],
    });

    expect(plan.scenes).toHaveLength(1);
    expect(plan.scenes[0].source).toBe('new-build');
    expect(plan.scenes[0].animationId).not.toBe(retiredEntry.animationId);
    expect(plan.reusedAnimationCount).toBe(0);
    expect(plan.readyForImplementation).toBe(false);
  });
});
