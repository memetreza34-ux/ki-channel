import {MOTION_TIMELINE_COMPOSITION_ID} from './compositionIds';
import {MOTION_RENDER_CONFIG} from './renderConfig';
import type {MotionTimeline} from './timeline';
import {MOTION_TIMELINE_EXAMPLE} from './timelineExamples';

export type MotionTimelineRenderPlan = {
  targetKey: 'timeline-demo';
  compositionId: string;
  timeline: MotionTimeline;
  checkpoints: number[];
};

export const createMotionTimelineRenderPlan = (
  timeline: MotionTimeline = MOTION_TIMELINE_EXAMPLE,
): MotionTimelineRenderPlan => {
  const sceneMidpoints = timeline.scenes.map(
    (scene) => scene.startFrame + Math.floor(scene.durationInFrames / 2),
  );
  const lastFrame = Math.max(0, timeline.totalDurationInFrames - 1);
  const checkpoints = [...sceneMidpoints, lastFrame]
    .filter((frame, index, frames) => frames.indexOf(frame) === index)
    .sort((left, right) => left - right);

  return {
    targetKey: MOTION_RENDER_CONFIG.timeline.targetKey,
    compositionId: MOTION_TIMELINE_COMPOSITION_ID,
    timeline,
    checkpoints,
  };
};

const defaultPlan = createMotionTimelineRenderPlan();
const configuredCheckpoints = MOTION_RENDER_CONFIG.timeline.checkpoints;
const checkpointsMatchManifest =
  defaultPlan.checkpoints.length === configuredCheckpoints.length &&
  defaultPlan.checkpoints.every(
    (frame, index) => frame === configuredCheckpoints[index],
  );

if (
  defaultPlan.timeline.totalDurationInFrames !==
    MOTION_RENDER_CONFIG.timeline.durationInFrames ||
  !checkpointsMatchManifest
) {
  throw new Error(
    'Timeline-Demo und gemeinsames Render-Manifest sind nicht synchron.',
  );
}

export const MOTION_TIMELINE_RENDER_PLAN = defaultPlan;
