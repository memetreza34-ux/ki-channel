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

export const motionStoryboardSchema = z.object({
  id: z.string().min(1),
  sentence: z.string().min(1),
  visualType: motionVisualTypeSchema,
  durationInFrames: z.number().int().min(30).max(900),
  fps: z.number().int().min(24).max(60).default(30),
  elements: z.array(motionElementSchema).min(2).max(12),
  beats: z.array(motionBeatSchema).min(1).max(30),
  labels: z.array(z.string().min(1).max(32)).max(6).default([]),
});

export type MotionStoryboard = z.infer<typeof motionStoryboardSchema>;
export type MotionElement = z.infer<typeof motionElementSchema>;
export type MotionBeat = z.infer<typeof motionBeatSchema>;
