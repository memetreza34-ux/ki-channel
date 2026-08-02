import {z} from 'zod';

export const motionVisualTypeSchema = z.enum([
  'input-output',
  'tool-orchestration',
  'comparison',
  'before-after',
  'data-flow',
  'error-path',
  'context-window',
  'agent-loop',
  'ranking',
  'process-chain',
]);

export type MotionVisualType = z.infer<typeof motionVisualTypeSchema>;

export const motionElementSchema = z.object({
  id: z.string().min(1),
  kind: z.enum([
    'card',
    'document',
    'tool',
    'ai-core',
    'database',
    'result',
    'label',
    'metric',
    'node',
  ]),
  label: z.string().min(1).max(32),
  emphasis: z.enum(['normal', 'focus', 'success', 'warning', 'danger']).default('normal'),
});

export const motionBeatSchema = z.object({
  id: z.string().min(1),
  atFrame: z.number().int().nonnegative(),
  action: z.enum([
    'show',
    'hide',
    'connect',
    'move',
    'pulse',
    'highlight',
    'dim',
    'shake',
    'complete',
  ]),
  targetId: z.string().min(1),
  sourceId: z.string().min(1).optional(),
  durationFrames: z.number().int().positive().default(18),
});

const motionStoryboardBaseSchema = z.object({
  id: z.string().min(1),
  sentence: z.string().min(1),
  visualType: motionVisualTypeSchema,
  durationInFrames: z.number().int().min(30).max(900),
  fps: z.number().int().min(24).max(60).default(30),
  elements: z.array(motionElementSchema).min(2).max(12),
  beats: z.array(motionBeatSchema).min(1).max(30),
  labels: z.array(z.string().min(1).max(32)).max(6).default([]),
});

export const motionStoryboardSchema = motionStoryboardBaseSchema.superRefine((storyboard, context) => {
  const elementIds = new Set<string>();
  const beatIds = new Set<string>();

  storyboard.elements.forEach((element, index) => {
    if (elementIds.has(element.id)) {
      context.addIssue({
        code: 'custom',
        message: `Doppelte Element-ID: ${element.id}`,
        path: ['elements', index, 'id'],
      });
    }
    elementIds.add(element.id);
  });

  storyboard.beats.forEach((beat, index) => {
    if (beatIds.has(beat.id)) {
      context.addIssue({
        code: 'custom',
        message: `Doppelte Beat-ID: ${beat.id}`,
        path: ['beats', index, 'id'],
      });
    }
    beatIds.add(beat.id);

    if (!elementIds.has(beat.targetId)) {
      context.addIssue({
        code: 'custom',
        message: `Unbekanntes Beat-Ziel: ${beat.targetId}`,
        path: ['beats', index, 'targetId'],
      });
    }

    if (beat.sourceId && !elementIds.has(beat.sourceId)) {
      context.addIssue({
        code: 'custom',
        message: `Unbekannte Beat-Quelle: ${beat.sourceId}`,
        path: ['beats', index, 'sourceId'],
      });
    }

    if (beat.atFrame >= storyboard.durationInFrames) {
      context.addIssue({
        code: 'custom',
        message: `Beat ${beat.id} beginnt außerhalb der Szene`,
        path: ['beats', index, 'atFrame'],
      });
    }
  });
});

export type MotionStoryboard = z.infer<typeof motionStoryboardBaseSchema>;
export type MotionElement = z.infer<typeof motionElementSchema>;
export type MotionBeat = z.infer<typeof motionBeatSchema>;
