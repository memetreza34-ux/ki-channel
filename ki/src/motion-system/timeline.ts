import {buildMotionScene, type BuildMotionSceneInput} from './runtime';
import {assertMotionStoryboard} from './validation';
import type {MotionQualityIssue, MotionQualityReport} from './quality';
import type {MotionStoryboard} from './schema';

export const MOTION_TIMELINE_LIMITS = {
  minFps: 24,
  maxFps: 60,
  maxScenes: 100,
  maxGapFrames: 900,
} as const;

export type BuildMotionTimelineInput = {
  scenes: BuildMotionSceneInput[];
  fps?: number;
  gapFrames?: number;
};

export type MotionTimelineIssue = MotionQualityIssue & {
  sceneIndex: number;
  storyboardId: string;
};

export type MotionTimelineScene = {
  index: number;
  startFrame: number;
  endFrameExclusive: number;
  durationInFrames: number;
  startSeconds: number;
  endSeconds: number;
  storyboard: MotionStoryboard;
  quality: MotionQualityReport;
};

export type MotionTimeline = {
  fps: number;
  gapFrames: number;
  totalDurationInFrames: number;
  totalDurationSeconds: number;
  scenes: MotionTimelineScene[];
  passed: boolean;
  issues: MotionTimelineIssue[];
};

const assertTimelineFps = (fps: number): void => {
  if (
    !Number.isInteger(fps) ||
    fps < MOTION_TIMELINE_LIMITS.minFps ||
    fps > MOTION_TIMELINE_LIMITS.maxFps
  ) {
    throw new Error(
      `Timeline-FPS muss eine ganze Zahl zwischen ${MOTION_TIMELINE_LIMITS.minFps} und ${MOTION_TIMELINE_LIMITS.maxFps} sein.`,
    );
  }
};

const assertGapFrames = (gapFrames: number): void => {
  if (
    !Number.isInteger(gapFrames) ||
    gapFrames < 0 ||
    gapFrames > MOTION_TIMELINE_LIMITS.maxGapFrames
  ) {
    throw new Error(
      `Timeline-Abstand muss eine ganze Zahl zwischen 0 und ${MOTION_TIMELINE_LIMITS.maxGapFrames} Frames sein.`,
    );
  }
};

const resolveTimelineFps = (
  scenes: BuildMotionSceneInput[],
  requestedFps?: number,
): number => {
  const explicitSceneFps = new Set(
    scenes
      .map((scene) => scene.fps)
      .filter((fps): fps is number => fps !== undefined),
  );

  if (explicitSceneFps.size > 1) {
    throw new Error('Alle Szenen einer Timeline müssen dieselbe FPS-Zahl verwenden.');
  }

  const sceneFps = explicitSceneFps.values().next().value as number | undefined;
  const resolvedFps = requestedFps ?? sceneFps ?? 30;
  assertTimelineFps(resolvedFps);

  if (sceneFps !== undefined && sceneFps !== resolvedFps) {
    throw new Error(
      `Timeline-FPS ${resolvedFps} widerspricht der Szenen-FPS ${sceneFps}.`,
    );
  }

  return resolvedFps;
};

const collectExplicitIds = (scenes: BuildMotionSceneInput[]): Set<string> => {
  const explicitIds = new Set<string>();

  scenes.forEach((scene, index) => {
    if (scene.storyboardId === undefined) return;
    const normalizedId = scene.storyboardId.trim();
    if (!normalizedId) return;

    if (explicitIds.has(normalizedId)) {
      throw new Error(
        `Storyboard-ID ${normalizedId} wird in der Timeline mehrfach verwendet (Szene ${index + 1}).`,
      );
    }
    explicitIds.add(normalizedId);
  });

  return explicitIds;
};

const reserveStoryboardId = ({
  storyboard,
  explicit,
  sceneIndex,
  reservedExplicitIds,
  usedIds,
  automaticOccurrences,
}: {
  storyboard: MotionStoryboard;
  explicit: boolean;
  sceneIndex: number;
  reservedExplicitIds: Set<string>;
  usedIds: Set<string>;
  automaticOccurrences: Map<string, number>;
}): MotionStoryboard => {
  if (explicit) {
    if (usedIds.has(storyboard.id)) {
      throw new Error(
        `Explizite Storyboard-ID ${storyboard.id} kollidiert in Szene ${sceneIndex + 1} mit einer bereits geplanten Szene.`,
      );
    }
    usedIds.add(storyboard.id);
    return storyboard;
  }

  const baseId = storyboard.id;
  let occurrence = (automaticOccurrences.get(baseId) ?? 0) + 1;
  let candidate = occurrence === 1 ? baseId : `${baseId}-${occurrence}`;

  while (usedIds.has(candidate) || reservedExplicitIds.has(candidate)) {
    occurrence += 1;
    candidate = `${baseId}-${occurrence}`;
  }

  automaticOccurrences.set(baseId, occurrence);
  usedIds.add(candidate);

  if (candidate === storyboard.id) return storyboard;
  return assertMotionStoryboard({...storyboard, id: candidate});
};

export const buildMotionTimeline = ({
  scenes,
  fps: requestedFps,
  gapFrames = 0,
}: BuildMotionTimelineInput): MotionTimeline => {
  if (scenes.length === 0) {
    throw new Error('Eine Motion-Timeline benötigt mindestens eine Szene.');
  }

  if (scenes.length > MOTION_TIMELINE_LIMITS.maxScenes) {
    throw new Error(
      `Eine Motion-Timeline unterstützt höchstens ${MOTION_TIMELINE_LIMITS.maxScenes} Szenen.`,
    );
  }

  assertGapFrames(gapFrames);
  const reservedExplicitIds = collectExplicitIds(scenes);
  const fps = resolveTimelineFps(scenes, requestedFps);
  const usedIds = new Set<string>();
  const automaticOccurrences = new Map<string, number>();
  const timelineScenes: MotionTimelineScene[] = [];
  const issues: MotionTimelineIssue[] = [];
  let cursor = 0;

  scenes.forEach((sceneInput, index) => {
    const result = buildMotionScene({...sceneInput, fps});
    const storyboard = reserveStoryboardId({
      storyboard: result.storyboard,
      explicit: sceneInput.storyboardId !== undefined,
      sceneIndex: index,
      reservedExplicitIds,
      usedIds,
      automaticOccurrences,
    });
    const startFrame = cursor;
    const endFrameExclusive = startFrame + storyboard.durationInFrames;

    const timelineScene: MotionTimelineScene = {
      index,
      startFrame,
      endFrameExclusive,
      durationInFrames: storyboard.durationInFrames,
      startSeconds: startFrame / fps,
      endSeconds: endFrameExclusive / fps,
      storyboard,
      quality: result.quality,
    };
    timelineScenes.push(timelineScene);

    for (const issue of result.quality.issues) {
      issues.push({...issue, sceneIndex: index, storyboardId: storyboard.id});
    }

    cursor = endFrameExclusive + (index < scenes.length - 1 ? gapFrames : 0);
  });

  return {
    fps,
    gapFrames,
    totalDurationInFrames: cursor,
    totalDurationSeconds: cursor / fps,
    scenes: timelineScenes,
    passed: timelineScenes.every((scene) => scene.quality.passed),
    issues,
  };
};
