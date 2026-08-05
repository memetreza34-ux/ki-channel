import {describe, expect, it} from 'vitest';
import {isValidMotionCompositionId} from '../compositionIds';
import {MOTION_RENDER_CONFIG} from '../renderConfig';
import {MOTION_RENDER_PLAN} from '../renderPlan';
import {motionVisualTypeSchema} from '../schema';
import {MOTION_TIMELINE_RENDER_PLAN} from '../timelineRenderPlan';

describe('Gemeinsames Motion-Render-Manifest', () => {
  it('enthält exakt alle Visualtypen ohne Duplikate', () => {
    expect([...MOTION_RENDER_CONFIG.visualTypes].sort()).toEqual(
      [...motionVisualTypeSchema.options].sort(),
    );
    expect(new Set(MOTION_RENDER_CONFIG.visualTypes).size).toBe(
      MOTION_RENDER_CONFIG.visualTypes.length,
    );
  });

  it('steuert die Prüfframes aller Einzeltyp-Renderpläne', () => {
    for (const item of MOTION_RENDER_PLAN) {
      expect(item.checkpoints).toEqual(MOTION_RENDER_CONFIG.defaultCheckpoints);
      expect(item.checkpoints.every((frame) => frame < item.storyboard.durationInFrames)).toBe(true);
    }
  });

  it('stimmt mit Dauer, ID und Prüfframes der Timeline-Demo überein', () => {
    expect(MOTION_RENDER_CONFIG.timeline.compositionId).toBe(
      MOTION_TIMELINE_RENDER_PLAN.compositionId,
    );
    expect(MOTION_RENDER_CONFIG.timeline.durationInFrames).toBe(
      MOTION_TIMELINE_RENDER_PLAN.timeline.totalDurationInFrames,
    );
    expect(MOTION_RENDER_CONFIG.timeline.checkpoints).toEqual(
      MOTION_TIMELINE_RENDER_PLAN.checkpoints,
    );
    expect(isValidMotionCompositionId(MOTION_RENDER_CONFIG.timeline.compositionId)).toBe(true);
  });

  it('enthält nur aufsteigende eindeutige Prüfframes', () => {
    const frameLists = [
      MOTION_RENDER_CONFIG.defaultCheckpoints,
      MOTION_RENDER_CONFIG.smokeCheckpoints,
      MOTION_RENDER_CONFIG.timeline.smokeCheckpoints,
      MOTION_RENDER_CONFIG.timeline.checkpoints,
    ];

    for (const frames of frameLists) {
      expect(new Set(frames).size).toBe(frames.length);
      expect(frames.every((frame, index) => index === 0 || frame > frames[index - 1])).toBe(true);
    }
  });
});
