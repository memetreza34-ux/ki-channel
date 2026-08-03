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

export const motionElementKindSchema = z.enum([
  'card',
  'document',
  'tool',
  'ai-core',
  'database',
  'result',
  'label',
  'metric',
  'node',
]);

export type MotionElementKind = z.infer<typeof motionElementKindSchema>;

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

export const MOTION_ELEMENT_KIND_CONTRACTS: Record<
  MotionVisualType,
  Readonly<Record<string, readonly MotionElementKind[]>>
> = {
  'input-output': {
    input: ['card', 'document', 'database'],
    ai: ['ai-core'],
    output: ['result'],
  },
  'tool-orchestration': {
    task: ['card'],
    ai: ['ai-core'],
    result: ['result'],
  },
  comparison: {
    left: ['card'],
    right: ['card'],
    metric: ['metric'],
  },
  'before-after': {
    input: ['card'],
    output: ['result'],
  },
  'data-flow': {
    input: ['database'],
    ai: ['ai-core'],
    output: ['result'],
  },
  'error-path': {
    input: ['card'],
    ai: ['ai-core'],
    error: ['result'],
    check: ['result'],
  },
  'context-window': {
    old: ['document'],
    current: ['document'],
    new: ['document'],
  },
  'agent-loop': {
    ai: ['ai-core'],
    plan: ['node'],
    act: ['node'],
    check: ['node'],
  },
  ranking: {
    'rank-1': ['metric'],
    'rank-2': ['metric'],
  },
  'process-chain': {
    'step-1': ['node'],
    'step-2': ['node'],
  },
};

export const motionElementSchema = z.object({
  id: z.string().trim().min(1),
  kind: motionElementKindSchema,
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
  const elementById = new Map<string, {kind: MotionElementKind; index: number}>();
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
    if (!elementById.has(element.id)) {
      elementById.set(element.id, {kind: element.kind, index});
    }
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

  for (const [elementId, allowedKinds] of Object.entries(
    MOTION_ELEMENT_KIND_CONTRACTS[storyboard.visualType],
  )) {
    const element = elementById.get(elementId);
    if (element && !allowedKinds.includes(element.kind)) {
      context.addIssue({
        code: 'custom',
        message: `Element ${elementId} des Visualtyps ${storyboard.visualType} benötigt Kind ${allowedKinds.join(' oder ')}`,
        path: ['elements', element.index, 'kind'],
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

  if (storyboard.visualType === 'ranking') {
    const nonMetricIndex = storyboard.elements.findIndex(
      (element) => element.kind !== 'metric',
    );
    if (nonMetricIndex !== -1) {
      context.addIssue({
        code: 'custom',
        message: 'Ranking darf nur Metrik-Elemente enthalten.',
        path: ['elements', nonMetricIndex, 'kind'],
      });
    }
    if (storyboard.elements.filter((element) => element.kind === 'metric').length < 2) {
      context.addIssue({
        code: 'custom',
        message: 'Ranking benötigt mindestens zwei Metrik-Elemente.',
        path: ['elements'],
      });
    }
  }

  if (storyboard.visualType === 'process-chain') {
    storyboard.elements.forEach((element, index) => {
      if (
        element.id.startsWith('step-') &&
        element.kind !== 'node' &&
        element.kind !== 'result'
      ) {
        context.addIssue({
          code: 'custom',
          message: `Prozessschritt ${element.id} benötigt Kind node oder result.`,
          path: ['elements', index, 'kind'],
        });
      }
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
