import {z} from 'zod';
import rawRenderConfig from './render-config.json';
import {motionVisualTypeSchema} from './schema';

const frameListSchema = z
  .array(z.number().int().nonnegative())
  .min(1)
  .refine((frames) => new Set(frames).size === frames.length, {
    message: 'Render-Prüfframes müssen eindeutig sein.',
  })
  .refine(
    (frames) => frames.every((frame, index) => index === 0 || frame > frames[index - 1]),
    {message: 'Render-Prüfframes müssen aufsteigend sortiert sein.'},
  );

const motionRenderConfigSchema = z
  .object({
    visualTypes: z.array(motionVisualTypeSchema),
    defaultCheckpoints: frameListSchema,
    smokeCheckpoints: frameListSchema,
    timeline: z.object({
      targetKey: z.literal('timeline-demo'),
      compositionId: z.string().regex(/^[A-Za-z0-9-]+$/),
      durationInFrames: z.number().int().positive(),
      smokeCheckpoints: frameListSchema,
      checkpoints: frameListSchema,
    }),
  })
  .superRefine((config, context) => {
    const expectedTypes = new Set(motionVisualTypeSchema.options);
    const configuredTypes = new Set(config.visualTypes);

    if (
      configuredTypes.size !== expectedTypes.size ||
      [...expectedTypes].some((type) => !configuredTypes.has(type))
    ) {
      context.addIssue({
        code: 'custom',
        message: 'Render-Manifest muss exakt alle Motion-Visualtypen enthalten.',
        path: ['visualTypes'],
      });
    }

    if (config.visualTypes.length !== configuredTypes.size) {
      context.addIssue({
        code: 'custom',
        message: 'Render-Manifest enthält doppelte Visualtypen.',
        path: ['visualTypes'],
      });
    }

    for (const [key, frames] of [
      ['smokeCheckpoints', config.timeline.smokeCheckpoints],
      ['checkpoints', config.timeline.checkpoints],
    ] as const) {
      if (frames.some((frame) => frame >= config.timeline.durationInFrames)) {
        context.addIssue({
          code: 'custom',
          message: 'Timeline-Prüfframe liegt außerhalb der Timeline-Dauer.',
          path: ['timeline', key],
        });
      }
    }
  });

export const MOTION_RENDER_CONFIG = motionRenderConfigSchema.parse(rawRenderConfig);
export type MotionRenderConfig = z.infer<typeof motionRenderConfigSchema>;
