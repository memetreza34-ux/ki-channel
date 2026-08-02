import type {MotionTimeline, MotionTimelineScene} from './timeline';

export type MotionTimelineSceneFrame = {
  kind: 'scene';
  globalFrame: number;
  localFrame: number;
  progress: number;
  scene: MotionTimelineScene;
};

export type MotionTimelineGapFrame = {
  kind: 'gap';
  globalFrame: number;
  gapFrame: number;
  gapDurationInFrames: number;
  previousScene: MotionTimelineScene;
  nextScene: MotionTimelineScene;
};

export type MotionTimelineFrameContext =
  | MotionTimelineSceneFrame
  | MotionTimelineGapFrame;

const assertTimelineFrame = (timeline: MotionTimeline, frame: number): void => {
  if (!Number.isInteger(frame)) {
    throw new Error('Timeline-Frame muss eine ganze Zahl sein.');
  }
  if (frame < 0 || frame >= timeline.totalDurationInFrames) {
    throw new Error(
      `Timeline-Frame muss zwischen 0 und ${timeline.totalDurationInFrames - 1} liegen.`,
    );
  }
};

export const resolveMotionTimelineFrame = (
  timeline: MotionTimeline,
  frame: number,
): MotionTimelineFrameContext => {
  assertTimelineFrame(timeline, frame);

  for (let index = 0; index < timeline.scenes.length; index += 1) {
    const scene = timeline.scenes[index];
    if (frame >= scene.startFrame && frame < scene.endFrameExclusive) {
      const localFrame = frame - scene.startFrame;
      return {
        kind: 'scene',
        globalFrame: frame,
        localFrame,
        progress:
          scene.durationInFrames <= 1
            ? 1
            : localFrame / (scene.durationInFrames - 1),
        scene,
      };
    }

    const nextScene = timeline.scenes[index + 1];
    if (
      nextScene &&
      frame >= scene.endFrameExclusive &&
      frame < nextScene.startFrame
    ) {
      return {
        kind: 'gap',
        globalFrame: frame,
        gapFrame: frame - scene.endFrameExclusive,
        gapDurationInFrames: nextScene.startFrame - scene.endFrameExclusive,
        previousScene: scene,
        nextScene,
      };
    }
  }

  throw new Error(`Timeline-Frame ${frame} konnte keiner Szene oder Lücke zugeordnet werden.`);
};

export const secondsToMotionTimelineFrame = (
  timeline: MotionTimeline,
  seconds: number,
): number => {
  if (!Number.isFinite(seconds) || seconds < 0) {
    throw new Error('Timeline-Zeit muss eine nicht negative endliche Zahl sein.');
  }

  return Math.min(
    timeline.totalDurationInFrames - 1,
    Math.floor(seconds * timeline.fps),
  );
};

export const resolveMotionTimelineTime = (
  timeline: MotionTimeline,
  seconds: number,
): MotionTimelineFrameContext =>
  resolveMotionTimelineFrame(
    timeline,
    secondsToMotionTimelineFrame(timeline, seconds),
  );
