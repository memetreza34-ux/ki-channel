import {z} from 'zod';
import {inspectMotionStoryboardQuality} from './quality';
import {motionStoryboardSchema, type MotionStoryboard} from './schema';
import type {
  MotionTimeline,
  MotionTimelineIssue,
  MotionTimelineScene,
} from './timeline';

export const MOTION_SERIALIZATION_VERSION = 1 as const;

const motionStoryboardDocumentSchema = z.object({
  kind: z.literal('motion-storyboard'),
  version: z.literal(MOTION_SERIALIZATION_VERSION),
  storyboard: motionStoryboardSchema,
});

const persistedTimelineSceneSchema = z.object({
  index: z.number().int().nonnegative(),
  startFrame: z.number().int().nonnegative(),
  endFrameExclusive: z.number().int().positive(),
  storyboard: motionStoryboardSchema,
});

const motionTimelineDocumentSchema = z
  .object({
    kind: z.literal('motion-timeline'),
    version: z.literal(MOTION_SERIALIZATION_VERSION),
    fps: z.number().int().min(24).max(60),
    gapFrames: z.number().int().nonnegative().max(900),
    totalDurationInFrames: z.number().int().positive(),
    scenes: z.array(persistedTimelineSceneSchema).min(1).max(100),
  })
  .superRefine((document, context) => {
    const ids = new Set<string>();

    document.scenes.forEach((scene, index) => {
      if (scene.index !== index) {
        context.addIssue({
          code: 'custom',
          message: `Timeline-Szenenindex ${scene.index} stimmt nicht mit Position ${index} überein.`,
          path: ['scenes', index, 'index'],
        });
      }

      if (scene.storyboard.fps !== document.fps) {
        context.addIssue({
          code: 'custom',
          message: `Szene ${index + 1} verwendet nicht die Timeline-FPS.`,
          path: ['scenes', index, 'storyboard', 'fps'],
        });
      }

      if (
        scene.endFrameExclusive !==
        scene.startFrame + scene.storyboard.durationInFrames
      ) {
        context.addIssue({
          code: 'custom',
          message: `Szenenende ${index + 1} passt nicht zur Storyboard-Dauer.`,
          path: ['scenes', index, 'endFrameExclusive'],
        });
      }

      const expectedStart = index === 0
        ? 0
        : document.scenes[index - 1].endFrameExclusive + document.gapFrames;
      if (scene.startFrame !== expectedStart) {
        context.addIssue({
          code: 'custom',
          message: `Szenenstart ${index + 1} passt nicht zur Timeline-Reihenfolge.`,
          path: ['scenes', index, 'startFrame'],
        });
      }

      if (ids.has(scene.storyboard.id)) {
        context.addIssue({
          code: 'custom',
          message: `Doppelte Storyboard-ID in Timeline: ${scene.storyboard.id}`,
          path: ['scenes', index, 'storyboard', 'id'],
        });
      }
      ids.add(scene.storyboard.id);
    });

    const lastScene = document.scenes[document.scenes.length - 1];
    if (
      lastScene &&
      lastScene.endFrameExclusive !== document.totalDurationInFrames
    ) {
      context.addIssue({
        code: 'custom',
        message: 'Timeline-Gesamtdauer stimmt nicht mit dem letzten Szenenende überein.',
        path: ['totalDurationInFrames'],
      });
    }
  });

export type MotionStoryboardDocument = z.infer<
  typeof motionStoryboardDocumentSchema
>;
export type MotionTimelineDocument = z.infer<
  typeof motionTimelineDocumentSchema
>;

const parseJson = (json: string): unknown => {
  try {
    return JSON.parse(json) as unknown;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Ungültiges Motion-JSON: ${message}`);
  }
};

const stringifyDocument = (document: unknown, indentation = 2): string => {
  if (!Number.isInteger(indentation) || indentation < 0 || indentation > 8) {
    throw new Error('JSON-Einrückung muss eine ganze Zahl zwischen 0 und 8 sein.');
  }
  return `${JSON.stringify(document, null, indentation)}\n`;
};

export const createMotionStoryboardDocument = (
  storyboard: MotionStoryboard,
): MotionStoryboardDocument =>
  motionStoryboardDocumentSchema.parse({
    kind: 'motion-storyboard',
    version: MOTION_SERIALIZATION_VERSION,
    storyboard,
  });

export const parseMotionStoryboardDocument = (
  input: unknown,
): MotionStoryboard => motionStoryboardDocumentSchema.parse(input).storyboard;

export const createMotionTimelineDocument = (
  timeline: MotionTimeline,
): MotionTimelineDocument =>
  motionTimelineDocumentSchema.parse({
    kind: 'motion-timeline',
    version: MOTION_SERIALIZATION_VERSION,
    fps: timeline.fps,
    gapFrames: timeline.gapFrames,
    totalDurationInFrames: timeline.totalDurationInFrames,
    scenes: timeline.scenes.map((scene) => ({
      index: scene.index,
      startFrame: scene.startFrame,
      endFrameExclusive: scene.endFrameExclusive,
      storyboard: scene.storyboard,
    })),
  });

const hydrateMotionTimeline = (
  document: MotionTimelineDocument,
): MotionTimeline => {
  const scenes: MotionTimelineScene[] = document.scenes.map((scene) => {
    const quality = inspectMotionStoryboardQuality(scene.storyboard);
    return {
      index: scene.index,
      startFrame: scene.startFrame,
      endFrameExclusive: scene.endFrameExclusive,
      durationInFrames: scene.storyboard.durationInFrames,
      startSeconds: scene.startFrame / document.fps,
      endSeconds: scene.endFrameExclusive / document.fps,
      storyboard: scene.storyboard,
      quality,
    };
  });
  const issues: MotionTimelineIssue[] = scenes.flatMap((scene) =>
    scene.quality.issues.map((issue) => ({
      ...issue,
      sceneIndex: scene.index,
      storyboardId: scene.storyboard.id,
    })),
  );

  return {
    fps: document.fps,
    gapFrames: document.gapFrames,
    totalDurationInFrames: document.totalDurationInFrames,
    totalDurationSeconds: document.totalDurationInFrames / document.fps,
    scenes,
    passed: scenes.every((scene) => scene.quality.passed),
    issues,
  };
};

export const parseMotionTimelineDocument = (
  input: unknown,
): MotionTimeline => hydrateMotionTimeline(motionTimelineDocumentSchema.parse(input));

export const serializeMotionStoryboard = (
  storyboard: MotionStoryboard,
  indentation = 2,
): string => stringifyDocument(createMotionStoryboardDocument(storyboard), indentation);

export const parseMotionStoryboardJson = (json: string): MotionStoryboard =>
  parseMotionStoryboardDocument(parseJson(json));

export const serializeMotionTimeline = (
  timeline: MotionTimeline,
  indentation = 2,
): string => stringifyDocument(createMotionTimelineDocument(timeline), indentation);

export const parseMotionTimelineJson = (json: string): MotionTimeline =>
  parseMotionTimelineDocument(parseJson(json));
