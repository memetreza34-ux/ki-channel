import {describe, expect, it} from 'vitest';
import {MOTION_RENDER_PLAN, createMotionRenderPlan} from '../renderPlan';
import {motionVisualTypeSchema} from '../schema';

describe('Motion-Renderplan', () => {
  it('enthält genau einen Eintrag pro Visualtyp', () => {
    expect(MOTION_RENDER_PLAN).toHaveLength(motionVisualTypeSchema.options.length);
    expect(new Set(MOTION_RENDER_PLAN.map((item) => item.visualType)).size).toBe(
      motionVisualTypeSchema.options.length,
    );
  });

  it('liefert eindeutige Composition-IDs und gültige Checkpoints', () => {
    const ids = MOTION_RENDER_PLAN.map((item) => item.compositionId);
    expect(new Set(ids).size).toBe(ids.length);

    for (const item of MOTION_RENDER_PLAN) {
      expect(item.checkpoints.length).toBeGreaterThanOrEqual(4);
      expect(item.checkpoints[0]).toBe(0);
      expect(item.checkpoints.at(-1)).toBe(item.storyboard.durationInFrames - 1);
      expect(item.checkpoints.every((frame) => frame >= 0)).toBe(true);
      expect(item.checkpoints.every((frame) => frame < item.storyboard.durationInFrames)).toBe(true);
      expect([...item.checkpoints].sort((a, b) => a - b)).toEqual(item.checkpoints);
    }
  });

  it('ist deterministisch', () => {
    expect(createMotionRenderPlan()).toEqual(createMotionRenderPlan());
  });
});
