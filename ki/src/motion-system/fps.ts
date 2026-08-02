import type {MotionStoryboard} from './schema';

const MIN_FPS = 24;
const MAX_FPS = 60;
const MIN_DURATION = 30;
const MAX_DURATION = 900;

const fitBeatStart = (
  atFrame: number,
  durationFrames: number,
  sceneDuration: number,
): number => {
  const latestStart = Math.max(0, sceneDuration - Math.min(durationFrames, sceneDuration));
  return Math.min(Math.max(0, atFrame), latestStart);
};

export const retimeMotionStoryboardFps = (
  storyboard: MotionStoryboard,
  targetFps: number,
): MotionStoryboard => {
  if (!Number.isInteger(targetFps) || targetFps < MIN_FPS || targetFps > MAX_FPS) {
    throw new Error(`FPS muss eine ganze Zahl zwischen ${MIN_FPS} und ${MAX_FPS} sein.`);
  }

  if (targetFps === storyboard.fps) return storyboard;

  const ratio = targetFps / storyboard.fps;
  const durationInFrames = Math.min(
    MAX_DURATION,
    Math.max(MIN_DURATION, Math.round(storyboard.durationInFrames * ratio)),
  );

  return {
    ...storyboard,
    fps: targetFps,
    durationInFrames,
    beats: storyboard.beats.map((beat) => {
      const durationFrames = Math.max(1, Math.round(beat.durationFrames * ratio));
      const scaledStart = Math.round(beat.atFrame * ratio);

      return {
        ...beat,
        durationFrames,
        atFrame: fitBeatStart(scaledStart, durationFrames, durationInFrames),
      };
    }),
  };
};
