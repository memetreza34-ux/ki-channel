import {describe, expect, it} from 'vitest';
import {createInitialCreativeBrainState} from '../brain';
import {ANIMATION_LIBRARY_ENTRIES} from '../catalog';
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
    expect(analysis.brief.meaningContract).toEqual(analysis.meaningContract);
    expect(analysis.meaningContract.requiredVisualCues).toContain(
      'visible-bottleneck',
    );
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
