import {describe, expect, it} from 'vitest';
import {createInitialCreativeBrainState} from '../brain';
import {ANIMATION_LIBRARY_ENTRIES} from '../catalog';
import {createChannelReelMasterPlan} from '../channelReelMasterPlan';
import {prepareReelAnimationProduction} from '../reelLifecycle';

const createBrain = () =>
  createInitialCreativeBrainState({
    entries: ANIMATION_LIBRARY_ENTRIES,
    now: '2026-08-07T04:30:00.000Z',
  });

const durationBySceneId = (sceneIds: readonly string[]) =>
  Object.fromEntries(sceneIds.map((sceneId) => [sceneId, 180]));

describe('channel master plan content binding', () => {
  it('marks reused registered prototypes as natively content-bound', () => {
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
          scene.contentBindingLevel === 'native-object-binding' &&
          scene.contentBindingReady,
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
          blocker.includes('requires implementation and registry entry'),
      ),
    ).toBe(false);
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
    expect(scene.valid).toBe(false);
    expect(masterPlan.animateEverythingAsFarAsUseful).toBe(false);
    expect(
      masterPlan.blockers.some(
        (blocker) =>
          blocker.includes('requires implementation and registry entry') &&
          blocker.includes(scene.fullAnimationId),
      ),
    ).toBe(true);
  });
});
