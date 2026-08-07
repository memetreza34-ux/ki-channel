import {describe, expect, it} from 'vitest';
import {compileReelChoreography} from '../remotionChoreographyCompiler';
import {createUniversalReelMotionPlan} from '../universalMotionPlan';

const motionPlan = createUniversalReelMotionPlan({
  reelId: 'compiler-test',
  scenes: [
    {
      sceneId: 'scene-01',
      spokenText: 'Claude prüft 73 Prozent der Quellen und erstellt danach die Antwort.',
      durationInFrames: 180,
      animationId: 'knowledge-magnet-v1',
      visualFamily: 'retrieval-search',
      layoutFamily: 'offset-magnetic-evidence-field',
      motionSignature: 'query-pulse-attract-rank-lock',
      transitionOutTags: ['evidence-fragment'],
    },
    {
      sceneId: 'scene-02',
      spokenText: 'Die Antwort kann trotzdem falsch sein, deshalb musst du die Quelle prüfen.',
      durationInFrames: 180,
      animationId: 'confidence-glass-crack-v1',
      visualFamily: 'risk-contrast',
      layoutFamily: 'single-confidence-glass-stage',
      motionSignature: 'statement-form-confidence-rise-crack-reveal',
      transitionInTags: ['evidence-fragment'],
    },
  ],
});

describe('Remotion choreography compiler', () => {
  it('creates headline, main, subtitle, beat, sound, and transition events', () => {
    const compiled = compileReelChoreography(motionPlan);
    expect(compiled.scenes).toHaveLength(2);
    expect(compiled.subtitleWordCount).toBeGreaterThan(10);
    expect(compiled.semanticBeatCount).toBeGreaterThanOrEqual(6);
    expect(compiled.soundCueCount).toBeGreaterThan(0);
    expect(compiled.scenes[0].events.some((event) => event.eventType === 'headline')).toBe(true);
    expect(compiled.scenes[0].events.some((event) => event.eventType === 'main-animation')).toBe(true);
    expect(compiled.scenes[0].events.some((event) => event.eventType === 'transition')).toBe(true);
  });

  it('embeds the exact sentence and meaning contract in the main animation event', () => {
    const compiled = compileReelChoreography(motionPlan);
    const sourceScene = motionPlan.scenes[0];
    const compiledScene = compiled.scenes[0];
    const mainEvent = compiledScene.events.find(
      (event) => event.eventType === 'main-animation',
    );

    expect(compiledScene.semanticPayloadEmbedded).toBe(true);
    expect(mainEvent?.targetText).toBe(sourceScene.spokenText);
    expect(mainEvent?.metadata.communicationGoal).toBe(
      sourceScene.meaningContract.communicationGoal,
    );
    expect(mainEvent?.metadata.startState).toBe(
      sourceScene.meaningContract.startState,
    );
    expect(mainEvent?.metadata.visibleChange).toBe(
      sourceScene.meaningContract.visibleChange,
    );
    expect(mainEvent?.metadata.endState).toBe(
      sourceScene.meaningContract.endState,
    );
    expect(mainEvent?.metadata.requiredVisualCues).toContain(
      sourceScene.meaningContract.requiredVisualCues[0],
    );
  });

  it('keeps all compiled events inside scene bounds', () => {
    const compiled = compileReelChoreography(motionPlan);
    for (const scene of compiled.scenes) {
      expect(scene.events.every((event) => event.startFrame >= 0)).toBe(true);
      expect(scene.events.every((event) => event.endFrameExclusive <= scene.durationInFrames)).toBe(true);
      expect(scene.events.every((event) => event.endFrameExclusive > event.startFrame)).toBe(true);
    }
  });
});
