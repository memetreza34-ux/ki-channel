import {describe, expect, it} from 'vitest';
import {createInitialCreativeBrainState} from '../brain';
import {ANIMATION_LIBRARY_ENTRIES} from '../catalog';
import {CreativeRecipeRuntime} from '../creativeRecipeRuntime';
import {
  buildLibraryAnimationRuntime,
  buildProductionSceneRuntime,
} from '../productionSceneRuntime';
import {planProductionReelAnimations} from '../productionPlanner';

const brain = createInitialCreativeBrainState({
  entries: ANIMATION_LIBRARY_ENTRIES,
  now: '2026-09-20T08:00:00.000Z',
});

describe('canonical production scene runtime', () => {
  it('resolves a reusable scene through the registered content-aware prototype', () => {
    const plan = planProductionReelAnimations({
      reelId: 'runtime-library-reel',
      reelIndex: 70,
      entries: ANIMATION_LIBRARY_ENTRIES,
      brain,
      scenes: [
        {
          sceneId: 'search-scene',
          spokenText: 'Die Suche findet passende Belege in vielen Dokumenten.',
          semanticTags: ['search', 'retrieval', 'document', 'evidence'],
          preferredVisualFamilies: ['retrieval-search'],
          preferredEnergy: 'dynamic',
        },
      ],
    });
    const scenePlan = plan.scenes[0];
    expect(scenePlan.source).toBe('library');

    const runtime = buildProductionSceneRuntime({
      scenePlan,
      spokenText: 'Die Suche findet passende Belege in vielen Dokumenten.',
      title: 'Belege finden',
    });

    expect(runtime.source).toBe('library');
    if (runtime.source !== 'library') throw new Error('expected library runtime');
    expect(runtime.registration.animationId).toBe(scenePlan.animationId);
    expect(runtime.renderProps.content?.spokenText).toContain('Suche');
  });

  it('lets authored production reels reuse the exact same library content pipeline', () => {
    const sourceEntry = ANIMATION_LIBRARY_ENTRIES.find(
      (entry) => entry.visualFamily === 'retrieval-search',
    );
    expect(sourceEntry).toBeDefined();

    const runtime = buildLibraryAnimationRuntime({
      sceneId: 'authored-library-scene',
      animationId: sourceEntry!.animationId,
      spokenText: 'Die Suche findet passende Belege in vielen Dokumenten.',
      title: 'Belege finden',
      labels: {shellIcon: 'SEARCH'},
    });

    expect(runtime.source).toBe('library');
    expect(runtime.registration.animationId).toBe(sourceEntry!.animationId);
    expect(runtime.renderProps.content?.spokenText).toContain('Suche');
    expect(runtime.renderProps.content?.labels?.shellIcon).toBe('SEARCH');
  });

  it('resolves a new-build scene through the canonical creative recipe runtime', () => {
    const plan = planProductionReelAnimations({
      reelId: 'runtime-new-build-reel',
      reelIndex: 71,
      entries: ANIMATION_LIBRARY_ENTRIES,
      brain,
      maximumNewAnimationRatio: 1,
      scenes: [
        {
          sceneId: 'new-scene',
          spokenText: 'Private Daten wandern durch mehrere Vertrauenszonen.',
          semanticTags: ['security', 'privacy', 'data', 'trust-zone'],
          preferredVisualFamilies: ['security-privacy'],
          preferredEnergy: 'dynamic',
          mustBeNew: true,
        },
      ],
    });
    const scenePlan = plan.scenes[0];
    expect(scenePlan.source).toBe('new-build');

    const runtime = buildProductionSceneRuntime({
      scenePlan,
      spokenText: 'Private Daten wandern durch mehrere Vertrauenszonen.',
    });

    expect(runtime.source).toBe('new-build');
    if (runtime.source !== 'new-build') throw new Error('expected new-build runtime');
    expect(runtime.component).toBe(CreativeRecipeRuntime);
    expect(runtime.renderProps.spec.animationId).toBe(scenePlan.animationId);
    expect(runtime.renderProps.spec.runtimeMechanisms.length).toBeGreaterThanOrEqual(3);
  });

  it('rejects scenes without spoken meaning', () => {
    const plan = planProductionReelAnimations({
      reelId: 'runtime-empty-text-reel',
      reelIndex: 72,
      entries: ANIMATION_LIBRARY_ENTRIES,
      brain,
      scenes: [
        {
          sceneId: 'scene',
          spokenText: 'Die KI zerlegt Text in Tokens.',
          semanticTags: ['token', 'text'],
          preferredVisualFamilies: ['tokenization'],
        },
      ],
    });

    expect(() =>
      buildProductionSceneRuntime({scenePlan: plan.scenes[0], spokenText: '   '}),
    ).toThrow(/requires spokenText/);
  });
});
