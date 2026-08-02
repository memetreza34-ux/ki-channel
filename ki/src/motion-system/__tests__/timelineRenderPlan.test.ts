import {describe, expect, it} from 'vitest';
import {MOTION_TIMELINE_COMPOSITION_ID} from '../compositionIds';
import {createMotionTimelineRenderPlan, MOTION_TIMELINE_RENDER_PLAN} from '../timelineRenderPlan';
import {MOTION_TIMELINE_EXAMPLE} from '../timelineExamples';

describe('Timeline-Renderplan', () => {
  it('prüft jede Szenenmitte und den letzten Frame', () => {
    const midpoints = MOTION_TIMELINE_EXAMPLE.scenes.map(
      (scene) => scene.startFrame + Math.floor(scene.durationInFrames / 2),
    );

    expect(MOTION_TIMELINE_RENDER_PLAN.checkpoints).toEqual([
      ...midpoints,
      MOTION_TIMELINE_EXAMPLE.totalDurationInFrames - 1,
    ]);
    expect(MOTION_TIMELINE_RENDER_PLAN.checkpoints).toEqual([75, 233, 391, 549, 623]);
  });

  it('verwendet die registrierte Timeline-Composition', () => {
    expect(MOTION_TIMELINE_RENDER_PLAN.compositionId).toBe(MOTION_TIMELINE_COMPOSITION_ID);
    expect(MOTION_TIMELINE_RENDER_PLAN.targetKey).toBe('timeline-demo');
  });

  it('hält alle Prüfframes innerhalb der Timeline', () => {
    expect(
      MOTION_TIMELINE_RENDER_PLAN.checkpoints.every(
        (frame) => frame >= 0 && frame < MOTION_TIMELINE_RENDER_PLAN.timeline.totalDurationInFrames,
      ),
    ).toBe(true);
  });

  it('bleibt deterministisch', () => {
    expect(createMotionTimelineRenderPlan(MOTION_TIMELINE_EXAMPLE)).toEqual(
      createMotionTimelineRenderPlan(MOTION_TIMELINE_EXAMPLE),
    );
  });
});
