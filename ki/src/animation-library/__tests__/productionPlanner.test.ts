import {describe, expect, it} from 'vitest';
import {createInitialCreativeBrainState} from '../brain';
import {ANIMATION_LIBRARY_ENTRIES} from '../catalog';
import {EXECUTABLE_ANIMATION_IDS} from '../executionCatalog';
import {planProductionReelAnimations} from '../productionPlanner';

const brain = createInitialCreativeBrainState({
  entries: ANIMATION_LIBRARY_ENTRIES,
  now: '2026-08-04T12:00:00.000Z',
});

describe('production reel animation planner', () => {
  it('returns implementation-ready library selections for matching scenes', () => {
    const plan = planProductionReelAnimations({
      reelId: 'reel-production-1',
      reelIndex: 12,
      entries: ANIMATION_LIBRARY_ENTRIES,
      brain,
      scenes: [
        {
          sceneId: 'scene-1',
          spokenText: 'Die Suche zieht passende Belege aus vielen Dokumenten.',
          semanticTags: ['search', 'retrieval', 'evidence', 'document'],
          preferredVisualFamilies: ['retrieval-search'],
          preferredEnergy: 'dynamic',
        },
        {
          sceneId: 'scene-2',
          spokenText: 'Ein Fehler wird an seiner Ursache sichtbar.',
          semanticTags: ['error', 'debug', 'root-cause', 'warning'],
          preferredVisualFamilies: ['error-detection'],
          preferredEnergy: 'impact',
        },
        {
          sceneId: 'scene-3',
          spokenText: 'Der Prozess läuft durch mehrere Stationen.',
          semanticTags: ['process', 'workflow', 'steps', 'automation'],
          preferredVisualFamilies: ['process-flow'],
        },
        {
          sceneId: 'scene-4',
          spokenText: 'Mehrere Quellen werden in ein Ergebnis verdichtet.',
          semanticTags: ['input', 'output', 'summarization', 'many-to-one'],
          preferredVisualFamilies: ['input-output'],
        },
      ],
    });

    expect(plan.scenes).toHaveLength(4);
    expect(new Set(plan.scenes.map((scene) => scene.animationId)).size).toBe(4);
    expect(new Set(plan.layoutFamilies).size).toBe(4);
    expect(new Set(plan.visualFamilies).size).toBeGreaterThanOrEqual(4);
  });

  it('never reuses an unregistered catalog entry in a production plan', () => {
    const sourceEntry = ANIMATION_LIBRARY_ENTRIES.find(
      (entry) => entry.visualFamily === 'retrieval-search',
    );
    expect(sourceEntry).toBeDefined();

    const unregisteredAnimationId =
      'retrieval-search-perfect-but-unregistered-test-v1';
    const unregisteredEntry = {
      ...sourceEntry!,
      animationId: unregisteredAnimationId,
      name: 'Perfect But Unregistered Retrieval Test',
      description:
        'Deliberately high-scoring catalog concept without a registered Remotion implementation.',
      semanticTags: [
        'search',
        'retrieval',
        'evidence',
        'document',
        'source',
        'relevance',
      ],
      useWhen: [
        'the exact scene searches many documents and selects only relevant evidence',
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
      reelId: 'reel-production-executable-only',
      reelIndex: 21,
      entries: [unregisteredEntry, ...ANIMATION_LIBRARY_ENTRIES],
      brain,
      maximumNewAnimationRatio: 1,
      scenes: [
        {
          sceneId: 'scene-retrieval',
          spokenText:
            'Die Suche prüft viele Dokumente und zieht nur die relevanten Belege zur Anfrage.',
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
    expect(plan.scenes[0].animationId).not.toBe(unregisteredAnimationId);
    if (plan.scenes[0].source === 'library') {
      expect(EXECUTABLE_ANIMATION_IDS).toContain(plan.scenes[0].animationId);
    } else {
      expect(plan.scenes[0].source).toBe('new-build');
    }
  });

  it('compiles must-be-new scenes into build specifications', () => {
    const plan = planProductionReelAnimations({
      reelId: 'reel-production-new',
      reelIndex: 18,
      entries: ANIMATION_LIBRARY_ENTRIES,
      brain,
      scenes: [
        {
          sceneId: 'scene-new',
          spokenText: 'Private Daten werden durch mehrere Vertrauenszonen geleitet.',
          semanticTags: ['security', 'privacy', 'data', 'trust-zone'],
          preferredVisualFamilies: ['security-privacy'],
          preferredEnergy: 'dynamic',
          mustBeNew: true,
        },
      ],
      maximumNewAnimationRatio: 1,
    });

    expect(plan.newAnimationCount).toBe(1);
    expect(plan.scenes[0].source).toBe('new-build');
    expect(plan.scenes[0].buildSpec).not.toBeNull();
    expect(plan.scenes[0].catalogEntry.status).toBe('concept');
    expect(plan.scenes[0].buildSpec?.implementationRules).toContain(
      'Reject the result if it is only a card layout with different labels.',
    );
  });

  it('rejects empty reels and invalid new-animation ratios', () => {
    expect(() =>
      planProductionReelAnimations({
        reelId: 'empty',
        reelIndex: 0,
        scenes: [],
        entries: ANIMATION_LIBRARY_ENTRIES,
        brain,
      }),
    ).toThrow(/between 1 and 100 scenes/);

    expect(() =>
      planProductionReelAnimations({
        reelId: 'invalid-ratio',
        reelIndex: 0,
        scenes: [
          {
            sceneId: 'scene-1',
            spokenText: 'Test',
            semanticTags: ['test'],
          },
        ],
        entries: ANIMATION_LIBRARY_ENTRIES,
        brain,
        maximumNewAnimationRatio: 1.1,
      }),
    ).toThrow(/between 0 and 1/);
  });
});