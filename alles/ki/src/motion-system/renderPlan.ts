import {toMotionCompositionId} from './compositionIds';
import {MOTION_EXAMPLES} from './examples';
import {MOTION_RENDER_CONFIG} from './renderConfig';
import type {MotionStoryboard, MotionVisualType} from './schema';

export type MotionRenderPlanItem = {
  visualType: MotionVisualType;
  compositionId: string;
  storyboard: MotionStoryboard;
  checkpoints: number[];
};

const clampFrame = (frame: number, durationInFrames: number) =>
  Math.max(0, Math.min(durationInFrames - 1, Math.round(frame)));

export const createMotionRenderPlan = (): MotionRenderPlanItem[] =>
  MOTION_RENDER_CONFIG.visualTypes.map((visualType) => {
    const storyboard = MOTION_EXAMPLES[visualType];
    const checkpoints = MOTION_RENDER_CONFIG.defaultCheckpoints
      .map((frame) => clampFrame(frame, storyboard.durationInFrames))
      .filter((frame, index, frames) => frames.indexOf(frame) === index);

    return {
      visualType,
      compositionId: toMotionCompositionId(visualType),
      storyboard,
      checkpoints,
    };
  });

export const MOTION_RENDER_PLAN = createMotionRenderPlan();
