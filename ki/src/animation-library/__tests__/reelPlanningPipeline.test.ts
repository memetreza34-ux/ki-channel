import {describe, expect, it} from 'vitest';
import {createInitialCreativeBrainState} from '../brain';
import {ANIMATION_LIBRARY_ENTRIES} from '../catalog';
import {EXECUTABLE_ANIMATION_IDS} from '../executionCatalog';
import {NATIVE_CONTENT_BOUND_PROTOTYPE_IDS} from '../prototypeContentCoverage';
import {isProductionReadyLibraryAnimation} from '../productionEligibility';
import {planReelAnimationsFromText} from '../reelPlanningPipeline';

const brain = createInitialCreativeBrainState({
  entries: ANIMATION_LIBRARY_ENTRIES,
  now: '2026-08-04T14:00:00.000Z',
});

describe('raw reel animation planning pipeline', () => {
  it('analyzes raw German scene text and returns a complete production plan', () => {
    const plan = planReelAnimationsFromText({
      reelId: 'raw-reel-1',
      reelIndex: 20,
      entries: ANIMATION_LIBRARY_ENTRIES,
      brain,
      scenes: [
        {sceneId: 'scene-1', spokenText: 'Die KI zerlegt den Satz in Tokens.'},
        {sceneId: 'scene-2', spokenText: 'Jedes Token wird in einen Zahlenvektor umgewandelt.'},
        {sceneId: 'scene-3', spokenText: 'Ähnliche Begriffe liegen im Bedeutungsraum näher zusammen.'},
        {sceneId: 'scene-4', spokenText: 'Attention verbindet die Wörter mit unterschiedlicher Stärke.'},
        {sceneId: 'scene-5', spokenText: 'Das wahrscheinlichste nächste Wort wird ausgewählt.'},
      ],
    });

    expect(plan.analyses).toHaveLength(5);
    expect(plan.productionPlan.scenes).toHaveLength(5);
    expect(plan.decisionSummary.map((decision) => decision.primaryFamily)).toEqual([
      'tokenization',
      'data-transformation',
      'semantic-space',
      'relationship-network',
      'probability',
    ]);
    expect(
      new Set(plan.productionPlan.scenes.map((scene) => scene.animationId)).size,
    ).toBe(5);
    expect(
      plan.productionPlan.scenes.every(
        (scene) =>
          scene.source !== 'library' ||
          isProductionReadyLibraryAnimation(scene.animationId),
      ),
    ).toBe(true);
  });

  it('keeps executable but shell-only variants out of the public text-to-production path', () => {
    const shellOnlyEntry = ANIMATION_LIBRARY_ENTRIES.find(
      (entry) =>
        EXECUTABLE_ANIMATION_IDS.includes(entry.animationId) &&
        !NATIVE_CONTENT_BOUND_PROTOTYPE_IDS.has(entry.animationId),
    );
    expect(shellOnlyEntry).toBeDefined();

    const plan = planReelAnimationsFromText({
      reelId: 'raw-reel-shell-only',
      reelIndex: 21,
      entries: [shellOnlyEntry!],
      brain,
      maximumNewAnimationRatio: 1,
      scenes: [
        {
          sceneId: 'scene-shell-only',
          spokenText:
            'Die Animation muss die konkreten Begriffe und Zustandsänderungen dieses Satzes direkt sichtbar machen.',
        },
      ],
    });

    expect(plan.productionPlan.scenes).toHaveLength(1);
    expect(plan.productionPlan.scenes[0].source).toBe('new-build');
    expect(plan.productionPlan.scenes[0].animationId).not.toBe(
      shellOnlyEntry!.animationId,
    );
    expect(plan.productionPlan.scenes[0].buildSpec).not.toBeNull();
    expect(plan.productionPlan.readyForImplementation).toBe(false);
    expect(plan.decisionSummary[0].source).toBe('new-build');
  });

  it('passes forced-new decisions into the proposal compiler', () => {
    const plan = planReelAnimationsFromText({
      reelId: 'raw-reel-new',
      reelIndex: 21,
      entries: ANIMATION_LIBRARY_ENTRIES,
      brain,
      maximumNewAnimationRatio: 1,
      scenes: [
        {
          sceneId: 'scene-1',
          spokenText: 'Zwei Modelle werden nach Kosten und Qualität verglichen.',
          forceNewAnimation: true,
        },
      ],
    });

    expect(plan.decisionSummary[0].mustBeNew).toBe(true);
    expect(plan.productionPlan.scenes[0].source).toBe('new-build');
    expect(plan.productionPlan.scenes[0].buildSpec).not.toBeNull();
    expect(plan.productionPlan.readyForImplementation).toBe(false);
  });

  it('persists the extended meaning contract across analysis and production', () => {
    const plan = planReelAnimationsFromText({
      reelId: 'extended-meaning-persistence',
      reelIndex: 22,
      entries: ANIMATION_LIBRARY_ENTRIES,
      brain,
      maximumNewAnimationRatio: 1,
      scenes: [
        {
          sceneId: 'performance-scene',
          spokenText:
            'Unter hoher Last steigt die Latenz, weil die Kapazität zum Engpass wird.',
          forceNewAnimation: true,
        },
      ],
    });

    const analysis = plan.analyses[0];
    const buildSpec = plan.productionPlan.scenes[0].buildSpec;

    expect(analysis.meaningContract.preferredVisualFamilies[0]).toBe(
      'scale-performance',
    );
    expect(analysis.preferredVisualFamilies[0]).toBe('scale-performance');
    expect(analysis.brief.preferredVisualFamilies?.[0]).toBe(
      'scale-performance',
    );
    expect(plan.decisionSummary[0].primaryFamily).toBe('scale-performance');
    expect(analysis.forbiddenVisualFamilies).not.toContain('scale-performance');
    expect(analysis.brief.meaningContract).toEqual(analysis.meaningContract);
    expect(analysis.meaningContract.requiredVisualCues).toContain(
      'visible-bottleneck',
    );
    expect(analysis.brief.explanationPatterns).toContain('bottleneck');
    expect(buildSpec?.contentContract).toEqual(analysis.meaningContract);
  });

  it('keeps a cost increase out of the savings family in the public production path', () => {
    const plan = planReelAnimationsFromText({
      reelId: 'cost-increase-direction',
      reelIndex: 23,
      entries: ANIMATION_LIBRARY_ENTRIES,
      brain,
      maximumNewAnimationRatio: 1,
      scenes: [
        {
          sceneId: 'cost-increase',
          spokenText:
            'Trotz Optimierung steigen die Kosten von 28 Cent auf 94 Cent und der Preis wird höher.',
        },
      ],
    });

    const analysis = plan.analyses[0];
    const productionScene = plan.productionPlan.scenes[0];

    expect(analysis.meaningContract.preferredVisualFamilies[0]).not.toBe(
      'cost-efficiency',
    );
    expect(analysis.meaningContract.requiredVisualCues).not.toContain(
      'visible-reduction',
    );
    expect(plan.decisionSummary[0].primaryFamily).not.toBe('cost-efficiency');
    expect(productionScene.animationId).not.toBe(
      'cost-efficiency-budget-leak-meter-v1',
    );
  });

  it('carries a latency improvement as a result without inventing a bottleneck', () => {
    const plan = planReelAnimationsFromText({
      reelId: 'latency-improvement-direction',
      reelIndex: 24,
      entries: ANIMATION_LIBRARY_ENTRIES,
      brain,
      maximumNewAnimationRatio: 1,
      scenes: [
        {
          sceneId: 'latency-improvement',
          spokenText:
            'Durch Parallelisierung sinkt die Latenz von 780 auf 340 Millisekunden.',
          forceNewAnimation: true,
        },
      ],
    });

    const analysis = plan.analyses[0];
    const buildSpec = plan.productionPlan.scenes[0].buildSpec;

    expect(analysis.meaningContract.preferredVisualFamilies[0]).toBe(
      'scale-performance',
    );
    expect(analysis.meaningContract.communicationGoal).toBe('show-result');
    expect(analysis.meaningContract.preferredExplanationPatterns[0]).toBe(
      'performance-improvement',
    );
    expect(analysis.meaningContract.requiredVisualCues).toContain(
      'latency-or-throughput-improvement',
    );
    expect(analysis.meaningContract.requiredVisualCues).not.toContain(
      'visible-bottleneck',
    );
    expect(analysis.brief.meaningContract).toEqual(analysis.meaningContract);
    expect(buildSpec?.contentContract).toEqual(analysis.meaningContract);
  });

  it('rejects duplicate scene identifiers and invalid reel indices', () => {
    expect(() =>
      planReelAnimationsFromText({
        reelId: 'duplicate-scenes',
        reelIndex: 1,
        entries: ANIMATION_LIBRARY_ENTRIES,
        brain,
        scenes: [
          {sceneId: 'scene-1', spokenText: 'Ein Prozess startet.'},
          {sceneId: 'scene-1', spokenText: 'Der Prozess endet.'},
        ],
      }),
    ).toThrow(/duplicate sceneId/);

    expect(() =>
      planReelAnimationsFromText({
        reelId: 'invalid-index',
        reelIndex: -1,
        entries: ANIMATION_LIBRARY_ENTRIES,
        brain,
        scenes: [{sceneId: 'scene-1', spokenText: 'Ein Test.'}],
      }),
    ).toThrow(/non-negative reelIndex/);
  });
});