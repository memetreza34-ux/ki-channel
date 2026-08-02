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

const REQUIRED_ELEMENT_IDS: Record<MotionVisualType, readonly string[]> = {
  'input-output': ['input', 'ai', 'output'],
  'tool-orchestration': ['task', 'ai', 'result'],
  comparison: ['left', 'right', 'metric'],
  'before-after': ['input', 'output'],
  'data-flow': ['input', 'ai', 'output'],
  'error-path': ['input', 'ai', 'error', 'check'],
  'context-window': ['old', 'current', 'new'],
  'agent-loop': ['ai', 'plan', 'act', 'check'],
  ranking: ['rank-1', 'rank-2'],
  'process-chain': ['step-1', 'step-2'],
};

export const motionElementSchema = z.object({
  id: z.string().trim().min(1),
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
  label: z.string().trim().min(1).max(32),
  emphasis: z.enum(['normal', 'focus', 'success', 'warning', 'danger']).default('normal'),
});

export const motionBeatSchema = z.object({
  id: z.string().trim().min(1),
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
  targetId: z.string().trim().min(1),
  sourceId: z.string().trim().min(1).optional(),
  durationFrames: z.number().int().positive().default(18),
});

const motionStoryboardBaseSchema = z.object({
  id: z.string().trim().min(1),
  sentence: z.string().trim().min(1),
  visualType: motionVisualTypeSchema,
  durationInFrames: z.number().int().min(30).max(900),
  fps: z.number().int().min(24).max(60).default(30),
  elements: z.array(motionElementSchema).min(2).max(12),
  beats: z.array(motionBeatSchema).min(1).max(30),
  labels: z.array(z.string().trim().min(1).max(32)).max(6).default([]),
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

  for (const requiredId of REQUIRED_ELEMENT_IDS[storyboard.visualType]) {
    if (!elementIds.has(requiredId)) {
      context.addIssue({
        code: 'custom',
        message: `Visualtyp ${storyboard.visualType} benötigt Element ${requiredId}`,
        path: ['elements'],
      });
    }
  }

  if (
    storyboard.visualType === 'tool-orchestration' &&
    !storyboard.elements.some((element) => element.kind === 'tool')
  ) {
    context.addIssue({
      code: 'custom',
      message: 'Tool-Orchestrierung benötigt mindestens ein Werkzeug.',
      path: ['elements'],
    });
  }

  if (
    storyboard.visualType === 'ranking' &&
    storyboard.elements.filter((element) => element.kind === 'metric').length < 2
  ) {
    context.addIssue({
      code: 'custom',
      message: 'Ranking benötigt mindestens zwei Metrik-Elemente.',
      path: ['elements'],
    });
  }

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

    if (beat.action === 'connect' && !beat.sourceId) {
      context.addIssue({
        code: 'custom',
        message: `Connect-Beat ${beat.id} benötigt eine Quelle`,
        path: ['beats', index, 'sourceId'],
      });
    }

    if (beat.sourceId && beat.sourceId === beat.targetId) {
      context.addIssue({
        code: 'custom',
        message: `Beat ${beat.id} darf Quelle und Ziel nicht identisch setzen`,
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

    if (beat.atFrame + beat.durationFrames > storyboard.durationInFrames) {
      context.addIssue({
        code: 'custom',
        message: `Beat ${beat.id} endet außerhalb der Szene`,
        path: ['beats', index, 'durationFrames'],
      });
    }
  });
});

export type MotionStoryboard = z.infer<typeof motionStoryboardBaseSchema>;
export type MotionElement = z.infer<typeof motionElementSchema>;
export type MotionBeat = z.infer<typeof motionBeatSchema>;
