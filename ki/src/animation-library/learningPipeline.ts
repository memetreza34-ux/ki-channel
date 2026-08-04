import {
  applyCreativeBrainObservation,
  reconcileCreativeBrainWithCatalog,
  recordAnimationUsage,
} from './brain';
import type {
  AnimationLibraryEntry,
  AnimationUsageRecord,
  CreativeBrainObservation,
  CreativeBrainState,
} from './schema';
import {
  animationUsageRecordSchema,
  creativeBrainObservationSchema,
  creativeBrainStateSchema,
} from './schema';

export type CreativeLearningBatch = {
  batchId: string;
  reelIndex: number;
  now: string;
  observations: CreativeBrainObservation[];
  usages: AnimationUsageRecord[];
};

export type CreativeLearningBatchResult = {
  batchId: string;
  previousRevision: number;
  nextRevision: number;
  appliedObservationIds: string[];
  skippedObservationIds: string[];
  appliedUsageKeys: string[];
  skippedUsageKeys: string[];
  state: CreativeBrainState;
};

const usageKey = (usage: AnimationUsageRecord): string =>
  `${usage.reelId}:${usage.sceneId}:${usage.animationId}`;

const sortByTime = <T extends {createdAt?: string; usedAt?: string}>(
  values: readonly T[],
): T[] =>
  [...values].sort((left, right) => {
    const leftTime = Date.parse(left.createdAt ?? left.usedAt ?? '');
    const rightTime = Date.parse(right.createdAt ?? right.usedAt ?? '');
    return leftTime - rightTime;
  });

export const applyCreativeLearningBatch = ({
  state,
  entries,
  batch,
}: {
  state: CreativeBrainState;
  entries: readonly AnimationLibraryEntry[];
  batch: CreativeLearningBatch;
}): CreativeLearningBatchResult => {
  if (!batch.batchId.trim()) {
    throw new Error('creative learning batchId is required');
  }
  if (!Number.isInteger(batch.reelIndex) || batch.reelIndex < 0) {
    throw new Error('creative learning reelIndex must be a non-negative integer');
  }
  if (Number.isNaN(Date.parse(batch.now))) {
    throw new Error('creative learning batch now must be an ISO timestamp');
  }

  let nextState = reconcileCreativeBrainWithCatalog({
    state: creativeBrainStateSchema.parse(state),
    entries,
    now: batch.now,
  });
  const previousRevision = state.revision;
  const existingObservationIds = new Set(
    nextState.observations.map((observation) => observation.observationId),
  );
  const existingUsageKeys = new Set(nextState.usageHistory.map(usageKey));
  const appliedObservationIds: string[] = [];
  const skippedObservationIds: string[] = [];
  const appliedUsageKeys: string[] = [];
  const skippedUsageKeys: string[] = [];

  for (const observationValue of sortByTime(batch.observations)) {
    const observation = creativeBrainObservationSchema.parse(observationValue);
    if (existingObservationIds.has(observation.observationId)) {
      skippedObservationIds.push(observation.observationId);
      continue;
    }
    nextState = applyCreativeBrainObservation({
      state: nextState,
      observation,
    });
    existingObservationIds.add(observation.observationId);
    appliedObservationIds.push(observation.observationId);
  }

  for (const usageValue of sortByTime(batch.usages)) {
    const usage = animationUsageRecordSchema.parse(usageValue);
    const key = usageKey(usage);
    if (existingUsageKeys.has(key)) {
      skippedUsageKeys.push(key);
      continue;
    }
    nextState = recordAnimationUsage({
      state: nextState,
      usage,
      reelIndex: batch.reelIndex,
    });
    existingUsageKeys.add(key);
    appliedUsageKeys.push(key);
  }

  return {
    batchId: batch.batchId,
    previousRevision,
    nextRevision: nextState.revision,
    appliedObservationIds,
    skippedObservationIds,
    appliedUsageKeys,
    skippedUsageKeys,
    state: nextState,
  };
};

export const createRenderReviewObservation = ({
  observationId,
  animationId,
  reelId,
  sceneId,
  semanticClarity,
  novelty,
  productionConfidence,
  outcome,
  notes,
  createdAt,
}: {
  observationId: string;
  animationId: string;
  reelId: string;
  sceneId: string;
  semanticClarity: number;
  novelty: number;
  productionConfidence: number;
  outcome: 'accepted' | 'reworked' | 'rejected';
  notes: string;
  createdAt: string;
}): CreativeBrainObservation =>
  creativeBrainObservationSchema.parse({
    observationId,
    type: 'render-review',
    animationId,
    reelId,
    sceneId,
    semanticClarity,
    novelty,
    productionConfidence,
    outcome,
    notes,
    createdAt,
    fact: null,
  });

export const createUserFeedbackObservation = ({
  observationId,
  animationId,
  reelId,
  sceneId,
  semanticClarity,
  novelty,
  productionConfidence,
  outcome,
  notes,
  createdAt,
}: {
  observationId: string;
  animationId: string | null;
  reelId: string | null;
  sceneId: string | null;
  semanticClarity: number | null;
  novelty: number | null;
  productionConfidence: number | null;
  outcome: 'accepted' | 'reworked' | 'rejected' | 'informational';
  notes: string;
  createdAt: string;
}): CreativeBrainObservation =>
  creativeBrainObservationSchema.parse({
    observationId,
    type: 'user-feedback',
    animationId,
    reelId,
    sceneId,
    semanticClarity,
    novelty,
    productionConfidence,
    outcome,
    notes,
    createdAt,
    fact: null,
  });

export const createKnowledgeObservation = ({
  observationId,
  factKey,
  value,
  confidence,
  source,
  createdAt,
  supersedesObservationId = null,
  notes,
}: {
  observationId: string;
  factKey: string;
  value: unknown;
  confidence: number;
  source: string;
  createdAt: string;
  supersedesObservationId?: string | null;
  notes: string;
}): CreativeBrainObservation =>
  creativeBrainObservationSchema.parse({
    observationId,
    type: 'new-knowledge',
    animationId: null,
    reelId: null,
    sceneId: null,
    semanticClarity: null,
    novelty: null,
    productionConfidence: null,
    outcome: 'informational',
    notes,
    createdAt,
    fact: {
      factKey,
      value,
      confidence,
      source,
      observedAt: createdAt,
      supersedesObservationId,
    },
  });
