import {describe, expect, it} from 'vitest';
import {createInitialCreativeBrainState} from '../brain';
import {ANIMATION_LIBRARY_ENTRIES} from '../catalog';
import {createChannelReelMasterPlan} from '../channelReelMasterPlan';
import {prepareReelAnimationProduction} from '../reelLifecycle';

const createBrain = () =>
  createInitialCreativeBrainState({
    entries: ANIMATION_LIBRARY_ENTRIES,
    now: '2026-08-08T05:00:00.000Z',
  });

describe('channel masterplan sanitized props', () => {
  it('carries exact latency values plus exactness and unit metadata into Remotion props', () => {
    const sceneId = 'sanitized-measured-latency';
    const spokenText =
      'Die Latenz sinkt vom seriellen Pfad mit 780 Millisekunden auf 340 Millisekunden im parallelen Pfad.';
    const prepared = prepareReelAnimationProduction({
      reelId: 'sanitized-masterplan-latency',
      reelIndex: 60,
      scenes: [{sceneId, spokenText}],
      entries: ANIMATION_LIBRARY_ENTRIES,
      brain: createBrain(),
    });

    expect(prepared.plan.productionPlan.scenes[0].animationId).toBe(
      'scale-performance-latency-tunnel-race-v1',
    );

    const masterPlan = createChannelReelMasterPlan({
      prepared,
      durationBySceneId: {[sceneId]: 180},
    });
    const content = masterPlan.scenes[0].prototypeRenderProps.content;

    expect(content?.spokenText).toBe(spokenText);
    expect(content?.values?.slowLatency).toBe(780);
    expect(content?.values?.fastLatency).toBe(340);
    expect(content?.values?.measurementExact).toBe(1);
    expect(content?.labels?.latencyUnit).toBe('ms');
  });

  it('removes fake latency measurements when the spoken sentence gives no exact time', () => {
    const sceneId = 'sanitized-relative-latency';
    const spokenText =
      'Unter hoher Last steigt die Latenz: Der serielle Pfad wird deutlich langsamer, während der parallele Pfad schneller bleibt.';
    const prepared = prepareReelAnimationProduction({
      reelId: 'sanitized-masterplan-relative-latency',
      reelIndex: 61,
      scenes: [{sceneId, spokenText}],
      entries: ANIMATION_LIBRARY_ENTRIES,
      brain: createBrain(),
    });

    expect(prepared.plan.productionPlan.scenes[0].animationId).toBe(
      'scale-performance-latency-tunnel-race-v1',
    );

    const masterPlan = createChannelReelMasterPlan({
      prepared,
      durationBySceneId: {[sceneId]: 180},
    });
    const content = masterPlan.scenes[0].prototypeRenderProps.content;

    expect(content?.values?.measurementExact).toBe(0);
    expect(content?.values?.slowLatency).toBeUndefined();
    expect(content?.values?.fastLatency).toBeUndefined();
  });
});
