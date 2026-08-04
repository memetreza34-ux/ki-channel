import type {
  AnimationLibraryEntry,
  AnimationUsageRecord,
  CreativeBrainFact,
  CreativeBrainObservation,
  CreativeBrainState,
} from './schema';
import {creativeBrainStateSchema} from './schema';

const clampScore = (value: number): number => Math.min(100, Math.max(0, value));

const observationLearningRate = (
  type: CreativeBrainObservation['type'],
): number => {
  switch (type) {
    case 'user-feedback':
      return 0.48;
    case 'render-review':
      return 0.34;
    case 'performance-metric':
      return 0.22;
    case 'new-knowledge':
      return 0.12;
  }
};

const updateMovingScore = (
  current: number,
  incoming: number | null,
  learningRate: number,
): number =>
  incoming === null
    ? current
    : clampScore(current * (1 - learningRate) + incoming * learningRate);

export const createInitialCreativeBrainState = ({
  entries,
  now,
}: {
  entries: readonly AnimationLibraryEntry[];
  now: string;
}): CreativeBrainState =>
  creativeBrainStateSchema.parse({
    version: 1,
    revision: 0,
    updatedAt: now,
    weights: {
      semanticFit: 0.45,
      novelty: 0.24,
      reelDiversity: 0.16,
      productionConfidence: 0.1,
      transitionContinuity: 0.05,
    },
    globalRules: {
      exactAnimationCooldownReels: 5,
      exactAnimationCooldownScenes: 20,
      forbidDuplicateAnimationWithinReel: true,
      forbidConsecutiveLayoutFamily: true,
      preferNewAnimationBelowScore: 68,
      minimumVisualFamiliesPerReel: 4,
      maximumCardsAsPrimaryVisualPerReel: 2,
    },
    animationStats: entries.map((entry) => ({
      animationId: entry.animationId,
      usageCount: 0,
      acceptedCount: 0,
      reworkedCount: 0,
      rejectedCount: 0,
      lastUsedAt: null,
      learnedSemanticClarity: entry.qualityPrior.semanticClarity,
      learnedNovelty: entry.qualityPrior.novelty,
      learnedProductionConfidence: entry.qualityPrior.productionConfidence,
      cooldownUntilReelIndex: 0,
    })),
    usageHistory: [],
    observations: [],
    facts: [],
  });

export const reconcileCreativeBrainWithCatalog = ({
  state,
  entries,
  now,
}: {
  state: CreativeBrainState;
  entries: readonly AnimationLibraryEntry[];
  now: string;
}): CreativeBrainState => {
  const existingStats = new Map(
    state.animationStats.map((stats) => [stats.animationId, stats]),
  );

  const nextStats = entries.map((entry) =>
    existingStats.get(entry.animationId) ?? {
      animationId: entry.animationId,
      usageCount: 0,
      acceptedCount: 0,
      reworkedCount: 0,
      rejectedCount: 0,
      lastUsedAt: null,
      learnedSemanticClarity: entry.qualityPrior.semanticClarity,
      learnedNovelty: entry.qualityPrior.novelty,
      learnedProductionConfidence: entry.qualityPrior.productionConfidence,
      cooldownUntilReelIndex: 0,
    },
  );

  return creativeBrainStateSchema.parse({
    ...state,
    revision: state.revision + 1,
    updatedAt: now,
    animationStats: nextStats,
  });
};

const mergeFact = ({
  facts,
  observation,
}: {
  facts: readonly CreativeBrainFact[];
  observation: CreativeBrainObservation;
}): CreativeBrainFact[] => {
  if (!observation.fact) return [...facts];

  const incoming = observation.fact;
  const existingIndex = facts.findIndex(
    (fact) => fact.factKey === incoming.factKey,
  );

  if (existingIndex === -1) return [...facts, incoming];

  const existing = facts[existingIndex];
  const incomingTime = Date.parse(incoming.observedAt);
  const existingTime = Date.parse(existing.observedAt);
  const isNewer = incomingTime >= existingTime;
  const isStrongEnough = incoming.confidence >= existing.confidence * 0.85;

  if (!isNewer || !isStrongEnough) return [...facts];

  const nextFacts = [...facts];
  nextFacts[existingIndex] = {
    ...incoming,
    supersedesObservationId:
      incoming.supersedesObservationId ?? observation.observationId,
  };
  return nextFacts;
};

export const applyCreativeBrainObservation = ({
  state,
  observation,
}: {
  state: CreativeBrainState;
  observation: CreativeBrainObservation;
}): CreativeBrainState => {
  if (
    state.observations.some(
      (existing) => existing.observationId === observation.observationId,
    )
  ) {
    return state;
  }

  const learningRate = observationLearningRate(observation.type);
  const nextStats = state.animationStats.map((stats) => {
    if (!observation.animationId || stats.animationId !== observation.animationId) {
      return stats;
    }

    return {
      ...stats,
      acceptedCount:
        stats.acceptedCount + (observation.outcome === 'accepted' ? 1 : 0),
      reworkedCount:
        stats.reworkedCount + (observation.outcome === 'reworked' ? 1 : 0),
      rejectedCount:
        stats.rejectedCount + (observation.outcome === 'rejected' ? 1 : 0),
      learnedSemanticClarity: updateMovingScore(
        stats.learnedSemanticClarity,
        observation.semanticClarity,
        learningRate,
      ),
      learnedNovelty: updateMovingScore(
        stats.learnedNovelty,
        observation.novelty,
        learningRate,
      ),
      learnedProductionConfidence: updateMovingScore(
        stats.learnedProductionConfidence,
        observation.productionConfidence,
        learningRate,
      ),
    };
  });

  return creativeBrainStateSchema.parse({
    ...state,
    revision: state.revision + 1,
    updatedAt: observation.createdAt,
    animationStats: nextStats,
    observations: [...state.observations, observation],
    facts: mergeFact({facts: state.facts, observation}),
  });
};

export const recordAnimationUsage = ({
  state,
  usage,
  reelIndex,
}: {
  state: CreativeBrainState;
  usage: AnimationUsageRecord;
  reelIndex: number;
}): CreativeBrainState => {
  const duplicate = state.usageHistory.some(
    (existing) =>
      existing.animationId === usage.animationId &&
      existing.reelId === usage.reelId &&
      existing.sceneId === usage.sceneId,
  );
  if (duplicate) return state;

  const nextStats = state.animationStats.map((stats) =>
    stats.animationId === usage.animationId
      ? {
          ...stats,
          usageCount: stats.usageCount + 1,
          lastUsedAt: usage.usedAt,
          cooldownUntilReelIndex:
            reelIndex + state.globalRules.exactAnimationCooldownReels,
        }
      : stats,
  );

  return creativeBrainStateSchema.parse({
    ...state,
    revision: state.revision + 1,
    updatedAt: usage.usedAt,
    animationStats: nextStats,
    usageHistory: [...state.usageHistory, usage],
  });
};

export const updateCreativeBrainWeights = ({
  state,
  weights,
  now,
}: {
  state: CreativeBrainState;
  weights: CreativeBrainState['weights'];
  now: string;
}): CreativeBrainState =>
  creativeBrainStateSchema.parse({
    ...state,
    revision: state.revision + 1,
    updatedAt: now,
    weights,
  });

export const findCurrentBrainFact = (
  state: CreativeBrainState,
  factKey: string,
): CreativeBrainFact | undefined =>
  state.facts.find((fact) => fact.factKey === factKey);
