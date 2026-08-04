import {z} from 'zod';

export const animationStatusSchema = z.enum([
  'concept',
  'prototype',
  'verified',
  'retired',
]);

export const animationEnergySchema = z.enum([
  'calm',
  'measured',
  'dynamic',
  'impact',
]);

export const animationDensitySchema = z.enum([
  'minimal',
  'balanced',
  'dense',
]);

export const animationComplexitySchema = z.enum([
  'low',
  'medium',
  'high',
]);

export const animationLibraryEntrySchema = z.object({
  animationId: z.string().min(3),
  version: z.number().int().positive(),
  title: z.string().min(3),
  description: z.string().min(10),
  status: animationStatusSchema,
  visualFamily: z.string().min(2),
  layoutFamily: z.string().min(2),
  motionSignature: z.string().min(3),
  noveltyGroup: z.string().min(2),
  semanticTags: z.array(z.string().min(2)).min(2).max(16),
  explanationPatterns: z.array(z.string().min(2)).min(1).max(8),
  avoidWhen: z.array(z.string().min(2)).max(8),
  primitiveTags: z.array(z.string().min(2)).min(1).max(12),
  transitionInTags: z.array(z.string().min(2)).min(1).max(8),
  transitionOutTags: z.array(z.string().min(2)).min(1).max(8),
  cameraStyle: z.string().min(2),
  primaryDirection: z.enum([
    'left-to-right',
    'right-to-left',
    'top-to-bottom',
    'bottom-to-top',
    'center-out',
    'outside-in',
    'circular',
    'depth-forward',
    'depth-backward',
    'mixed',
  ]),
  energy: animationEnergySchema,
  density: animationDensitySchema,
  complexity: animationComplexitySchema,
  durationSeconds: z.object({
    min: z.number().positive(),
    max: z.number().positive(),
  }).refine((range) => range.max >= range.min, {
    message: 'durationSeconds.max must be greater than or equal to min',
  }),
  qualityPrior: z.object({
    semanticClarity: z.number().min(0).max(100),
    novelty: z.number().min(0).max(100),
    productionConfidence: z.number().min(0).max(100),
  }),
});

export const animationLibraryDocumentSchema = z.object({
  version: z.literal(1),
  updatedAt: z.string().datetime(),
  entries: z.array(animationLibraryEntrySchema).min(1),
}).superRefine((document, context) => {
  const ids = new Set<string>();
  const signatures = new Set<string>();

  document.entries.forEach((entry, index) => {
    if (ids.has(entry.animationId)) {
      context.addIssue({
        code: 'custom',
        path: ['entries', index, 'animationId'],
        message: `duplicate animationId: ${entry.animationId}`,
      });
    }
    ids.add(entry.animationId);

    const signatureKey = `${entry.layoutFamily}:${entry.motionSignature}`;
    if (signatures.has(signatureKey)) {
      context.addIssue({
        code: 'custom',
        path: ['entries', index, 'motionSignature'],
        message: `duplicate layout/motion signature: ${signatureKey}`,
      });
    }
    signatures.add(signatureKey);
  });
});

export const animationUsageRecordSchema = z.object({
  animationId: z.string().min(3),
  reelId: z.string().min(3),
  sceneId: z.string().min(2),
  usedAt: z.string().datetime(),
  semanticTags: z.array(z.string().min(2)).min(1),
  result: z.enum(['unknown', 'accepted', 'reworked', 'rejected']),
});

export const creativeBrainWeightsSchema = z.object({
  semanticFit: z.number().min(0).max(1),
  novelty: z.number().min(0).max(1),
  reelDiversity: z.number().min(0).max(1),
  productionConfidence: z.number().min(0).max(1),
  transitionContinuity: z.number().min(0).max(1),
}).refine(
  (weights) =>
    Math.abs(
      weights.semanticFit +
      weights.novelty +
      weights.reelDiversity +
      weights.productionConfidence +
      weights.transitionContinuity -
      1,
    ) < 0.0001,
  {message: 'creative brain weights must sum to 1'},
);

export const creativeBrainAnimationStatsSchema = z.object({
  animationId: z.string().min(3),
  usageCount: z.number().int().nonnegative(),
  acceptedCount: z.number().int().nonnegative(),
  reworkedCount: z.number().int().nonnegative(),
  rejectedCount: z.number().int().nonnegative(),
  lastUsedAt: z.string().datetime().nullable(),
  learnedSemanticClarity: z.number().min(0).max(100),
  learnedNovelty: z.number().min(0).max(100),
  learnedProductionConfidence: z.number().min(0).max(100),
  cooldownUntilReelIndex: z.number().int().nonnegative(),
});

export const creativeBrainFactSchema = z.object({
  factKey: z.string().min(3),
  value: z.unknown(),
  confidence: z.number().min(0).max(1),
  source: z.string().min(2),
  observedAt: z.string().datetime(),
  supersedesObservationId: z.string().nullable(),
});

export const creativeBrainObservationSchema = z.object({
  observationId: z.string().min(3),
  type: z.enum([
    'render-review',
    'user-feedback',
    'performance-metric',
    'new-knowledge',
  ]),
  animationId: z.string().min(3).nullable(),
  reelId: z.string().min(3).nullable(),
  sceneId: z.string().min(2).nullable(),
  semanticClarity: z.number().min(0).max(100).nullable(),
  novelty: z.number().min(0).max(100).nullable(),
  productionConfidence: z.number().min(0).max(100).nullable(),
  outcome: z.enum(['accepted', 'reworked', 'rejected', 'informational']),
  notes: z.string().min(1),
  createdAt: z.string().datetime(),
  fact: creativeBrainFactSchema.nullable(),
});

export const creativeBrainStateSchema = z.object({
  version: z.literal(1),
  revision: z.number().int().nonnegative(),
  updatedAt: z.string().datetime(),
  weights: creativeBrainWeightsSchema,
  globalRules: z.object({
    exactAnimationCooldownReels: z.number().int().nonnegative(),
    exactAnimationCooldownScenes: z.number().int().nonnegative(),
    forbidDuplicateAnimationWithinReel: z.boolean(),
    forbidConsecutiveLayoutFamily: z.boolean(),
    preferNewAnimationBelowScore: z.number().min(0).max(100),
    minimumVisualFamiliesPerReel: z.number().int().positive(),
    maximumCardsAsPrimaryVisualPerReel: z.number().int().nonnegative(),
  }),
  animationStats: z.array(creativeBrainAnimationStatsSchema),
  usageHistory: z.array(animationUsageRecordSchema),
  observations: z.array(creativeBrainObservationSchema),
  facts: z.array(creativeBrainFactSchema),
});

export type AnimationLibraryEntry = z.infer<typeof animationLibraryEntrySchema>;
export type AnimationLibraryDocument = z.infer<typeof animationLibraryDocumentSchema>;
export type AnimationUsageRecord = z.infer<typeof animationUsageRecordSchema>;
export type CreativeBrainState = z.infer<typeof creativeBrainStateSchema>;
export type CreativeBrainObservation = z.infer<typeof creativeBrainObservationSchema>;
export type CreativeBrainFact = z.infer<typeof creativeBrainFactSchema>;
