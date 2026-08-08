import {describe, expect, it} from 'vitest';
import {createInitialCreativeBrainState} from '../brain';
import {ANIMATION_LIBRARY_ENTRIES} from '../catalog';
import {createChannelReelMasterPlan} from '../channelReelMasterPlan';
import {EXECUTABLE_ANIMATION_IDS} from '../executionCatalog';
import {NATIVE_CONTENT_BOUND_PROTOTYPE_IDS} from '../prototypeContentCoverage';
import {isProductionReadyLibraryAnimation} from '../productionEligibility';
import {prepareReelAnimationProduction} from '../reelLifecycle';

const createBrain = () =>
  createInitialCreativeBrainState({
    entries: ANIMATION_LIBRARY_ENTRIES,
    now: '2026-08-07T04:30:00.000Z',
  });

const durationBySceneId = (sceneIds: readonly string[]) =>
  Object.fromEntries(sceneIds.map((sceneId) => [sceneId, 180]));

describe('channel master plan content binding', () => {
  it('marks reused registered prototypes as natively content-bound and runtime-ready', () => {
    const scenes = [
      {sceneId: 'tokens', spokenText: 'Die KI zerlegt den Satz in Tokens.'},
      {
        sceneId: 'vector',
        spokenText: 'Jedes Token wird in einen Zahlenvektor umgewandelt.',
      },
      {
        sceneId: 'meaning',
        spokenText: 'Ähnliche Begriffe liegen im Bedeutungsraum näher zusammen.',
      },
      {
        sceneId: 'attention',
        spokenText: 'Attention verbindet wichtige Wörter mit unterschiedlicher Stärke.',
      },
    ] as const;
    const prepared = prepareReelAnimationProduction({
      reelId: 'native-content-binding',
      reelIndex: 40,
      scenes,
      entries: ANIMATION_LIBRARY_ENTRIES,
      brain: createBrain(),
    });
    const masterPlan = createChannelReelMasterPlan({
      prepared,
      durationBySceneId: durationBySceneId(
        scenes.map((scene) => scene.sceneId),
      ),
    });

    expect(masterPlan.scenes).toHaveLength(scenes.length);
    expect(
      masterPlan.scenes.every(
        (scene) =>
          scene.fullAnimationSource === 'library' &&
          isProductionReadyLibraryAnimation(scene.fullAnimationId) &&
          scene.contentBindingLevel === 'native-object-binding' &&
          scene.contentBindingReady &&
          scene.runtimeReady,
      ),
    ).toBe(true);
    expect(
      masterPlan.scenes.every(
        (scene) =>
          scene.prototypeRenderProps.content?.spokenText === scene.spokenText &&
          scene.prototypeRenderProps.content?.meaningContract !== undefined,
      ),
    ).toBe(true);
    expect(
      masterPlan.blockers.some(
        (blocker) =>
          blocker.includes('semantic-shell-only') ||
          blocker.includes('full production runtime eligibility'),
      ),
    ).toBe(false);
  });

  it('fails fast if a shell-only executable library scene bypasses production eligibility', () => {
    const shellOnlyEntry = ANIMATION_LIBRARY_ENTRIES.find(
      (entry) =>
        EXECUTABLE_ANIMATION_IDS.includes(entry.animationId) &&
        !NATIVE_CONTENT_BOUND_PROTOTYPE_IDS.has(entry.animationId),
    );
    expect(shellOnlyEntry).toBeDefined();

    const prepared = prepareReelAnimationProduction({
      reelId: 'masterplan-invariant-bypass',
      reelIndex: 42,
      scenes: [
        {
          sceneId: 'scene-bypass',
          spokenText: 'Die KI zerlegt den Satz in Tokens.',
        },
      ],
      entries: ANIMATION_LIBRARY_ENTRIES,
      brain: createBrain(),
    });

    Object.assign(prepared.plan.productionPlan.scenes[0], {
      source: 'library' as const,
      animationId: shellOnlyEntry!.animationId,
      catalogEntry: shellOnlyEntry!,
      buildSpec: null,
    });

    expect(() =>
      createChannelReelMasterPlan({
        prepared,
        durationBySceneId: {['scene-bypass']: 180},
      }),
    ).toThrow(
      /production reuse invariant violated: scene scene-bypass uses library animation .* without full production runtime eligibility/,
    );
  });

  it('blocks a purpose-built proposal until a Remotion component is registered', () => {
    const scenes = [
      {
        sceneId: 'new-performance-animation',
        spokenText:
          'Unter hoher Last steigt die Latenz, weil die Kapazität zum Engpass wird.',
        forceNewAnimation: true,
      },
    ] as const;
    const prepared = prepareReelAnimationProduction({
      reelId: 'unimplemented-new-build',
      reelIndex: 41,
      scenes,
      entries: ANIMATION_LIBRARY_ENTRIES,
      brain: createBrain(),
    });
    const masterPlan = createChannelReelMasterPlan({
      prepared,
      durationBySceneId: {['new-performance-animation']: 180},
    });
    const scene = masterPlan.scenes[0];

    expect(scene.fullAnimationSource).toBe('new-build');
    expect(scene.contentBindingLevel).toBe('purpose-built-new-animation');
    expect(scene.contentBindingReady).toBe(false);
    expect(scene.runtimeReady).toBe(false);
    expect(scene.valid).toBe(false);
    expect(masterPlan.animateEverythingAsFarAsUseful).toBe(false);
    expect(
      masterPlan.blockers.some(
        (blocker) =>
          blocker.includes('requires native content implementation and registry entry') &&
          blocker.includes(scene.fullAnimationId),
      ),
    ).toBe(true);
  });

  it('blocks native content binding that is still missing full production runtime eligibility', () => {
    const sceneId = 'native-but-not-renderable';
    const fakeAnimationId = 'test-native-without-content-render-config-v1';
    const prepared = prepareReelAnimationProduction({
      reelId: 'native-runtime-gap',
      reelIndex: 43,
      scenes: [
        {
          sceneId,
          spokenText:
            'Die Szene ist inhaltlich gebunden, aber der Produktionsrenderer ist noch nicht vollständig registriert.',
          forceNewAnimation: true,
        },
      ],
      entries: ANIMATION_LIBRARY_ENTRIES,
      brain: createBrain(),
      maximumNewAnimationRatio: 1,
    });
    const plannedScene = prepared.plan.productionPlan.scenes[0];
    const fakeEntry = {
      ...plannedScene.catalogEntry,
      animationId: fakeAnimationId,
      status: 'prototype' as const,
    };

    NATIVE_CONTENT_BOUND_PROTOTYPE_IDS.add(fakeAnimationId);
    try {
      Object.assign(plannedScene, {
        animationId: fakeAnimationId,
        catalogEntry: fakeEntry,
      });
      const masterPlan = createChannelReelMasterPlan({
        prepared,
        durationBySceneId: {[sceneId]: 180},
      });
      const scene = masterPlan.scenes[0];

      expect(scene.contentBindingLevel).toBe('native-object-binding');
      expect(scene.contentBindingReady).toBe(true);
      expect(scene.runtimeReady).toBe(false);
      expect(scene.valid).toBe(false);
      expect(masterPlan.implementationBrief.readyForImplementation).toBe(false);
      expect(
        masterPlan.blockers.some((blocker) =>
          blocker.includes('full production runtime eligibility is incomplete') &&
          blocker.includes(fakeAnimationId),
        ),
      ).toBe(true);
    } finally {
      NATIVE_CONTENT_BOUND_PROTOTYPE_IDS.delete(fakeAnimationId);
    }
  });

  it('keeps new-build history but becomes ready after that animation id is implemented', () => {
    const sceneId = 'implemented-after-planning';
    const prepared = prepareReelAnimationProduction({
      reelId: 'new-build-runtime-promotion',
      reelIndex: 44,
      scenes: [
        {
          sceneId,
          spokenText:
            'Unter hoher Last steigt die Latenz, weil die Kapazität zum Engpass wird.',
          forceNewAnimation: true,
        },
      ],
      entries: ANIMATION_LIBRARY_ENTRIES,
      brain: createBrain(),
      maximumNewAnimationRatio: 1,
    });
    expect(prepared.plan.productionPlan.scenes[0].source).toBe('new-build');
    expect(prepared.readyForImplementation).toBe(false);

    const implementedEntry = ANIMATION_LIBRARY_ENTRIES.find(
      (entry) => entry.animationId === 'scale-performance-latency-tunnel-race-v1',
    );
    expect(implementedEntry).toBeDefined();
    expect(isProductionReadyLibraryAnimation(implementedEntry!.animationId)).toBe(true);

    Object.assign(prepared.plan.productionPlan.scenes[0], {
      animationId: implementedEntry!.animationId,
      catalogEntry: implementedEntry!,
    });

    const masterPlan = createChannelReelMasterPlan({
      prepared,
      durationBySceneId: {[sceneId]: 180},
    });
    const scene = masterPlan.scenes[0];

    expect(scene.fullAnimationSource).toBe('new-build');
    expect(scene.fullAnimationId).toBe(implementedEntry!.animationId);
    expect(scene.contentBindingLevel).toBe('native-object-binding');
    expect(scene.contentBindingReady).toBe(true);
    expect(scene.runtimeReady).toBe(true);
    expect(scene.valid).toBe(true);
    expect(masterPlan.implementationBrief.readyForImplementation).toBe(true);
    expect(
      masterPlan.implementationBrief.warnings,
    ).not.toContain(
      'one or more scenes require a content-specific animation before production',
    );
    expect(
      masterPlan.implementationBrief.warnings.some((warning) =>
        /^only 0 visual families were selected$/.test(warning),
      ),
    ).toBe(false);
    expect(
      masterPlan.blockers.some((blocker) =>
        blocker.includes('full production runtime eligibility'),
      ),
    ).toBe(false);
  });
});
