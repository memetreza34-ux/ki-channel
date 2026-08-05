import type {CreativeBrainObservation, CreativeBrainState} from './schema';
import {creativeBrainStateSchema} from './schema';

export type CreativeBrainTuningReport = {
  consideredObservations: number;
  repetitionComplaints: number;
  clarityFailures: number;
  productionFailures: number;
  successfulNovelAnimations: number;
  previousWeights: CreativeBrainState['weights'];
  nextWeights: CreativeBrainState['weights'];
  previousThreshold: number;
  nextThreshold: number;
  changed: boolean;
};

const normalizeWeights = (
  weights: CreativeBrainState['weights'],
): CreativeBrainState['weights'] => {
  const total = Object.values(weights).reduce((sum, value) => sum + value, 0);
  return {
    semanticFit: weights.semanticFit / total,
    novelty: weights.novelty / total,
    reelDiversity: weights.reelDiversity / total,
    productionConfidence: weights.productionConfidence / total,
    transitionContinuity: weights.transitionContinuity / total,
  };
};

const includesAny = (value: string, patterns: readonly string[]): boolean => {
  const normalized = value.toLocaleLowerCase('de-DE');
  return patterns.some((pattern) => normalized.includes(pattern));
};

export const tuneCreativeBrainFromEvidence = ({
  state,
  observations = state.observations,
  now,
  windowSize = 50,
}: {
  state: CreativeBrainState;
  observations?: readonly CreativeBrainObservation[];
  now: string;
  windowSize?: number;
}): {state: CreativeBrainState; report: CreativeBrainTuningReport} => {
  if (!Number.isInteger(windowSize) || windowSize < 1) {
    throw new Error('creative brain tuning windowSize must be a positive integer');
  }
  if (Number.isNaN(Date.parse(now))) {
    throw new Error('creative brain tuning now must be an ISO timestamp');
  }

  const recent = [...observations]
    .sort((left, right) => Date.parse(left.createdAt) - Date.parse(right.createdAt))
    .slice(-windowSize);
  const repetitionPatterns = [
    'wiederhol',
    'same animation',
    'same layout',
    'langweilig',
    'boring',
    'zu ähnlich',
  ];
  const clarityPatterns = [
    'unverständlich',
    'unclear',
    'passt nicht',
    'does not explain',
    'confusing',
  ];
  const productionPatterns = [
    'render fail',
    'typecheck',
    'overflow',
    'abgeschnitten',
    'clipping',
    'crash',
  ];

  const repetitionComplaints = recent.filter(
    (observation) =>
      observation.outcome === 'reworked' ||
      observation.outcome === 'rejected',
  ).filter((observation) => includesAny(observation.notes, repetitionPatterns)).length;
  const clarityFailures = recent.filter(
    (observation) =>
      observation.outcome === 'reworked' ||
      observation.outcome === 'rejected',
  ).filter(
    (observation) =>
      (observation.semanticClarity ?? 100) < 65 ||
      includesAny(observation.notes, clarityPatterns),
  ).length;
  const productionFailures = recent.filter(
    (observation) =>
      (observation.productionConfidence ?? 100) < 55 ||
      includesAny(observation.notes, productionPatterns),
  ).length;
  const successfulNovelAnimations = recent.filter(
    (observation) =>
      observation.outcome === 'accepted' &&
      (observation.novelty ?? 0) >= 82 &&
      (observation.semanticClarity ?? 0) >= 78,
  ).length;

  const previousWeights = state.weights;
  let nextWeights = {...previousWeights};
  let nextThreshold = state.globalRules.preferNewAnimationBelowScore;

  if (repetitionComplaints >= 2) {
    nextWeights.novelty += Math.min(0.06, repetitionComplaints * 0.015);
    nextWeights.reelDiversity += Math.min(0.05, repetitionComplaints * 0.012);
    nextThreshold = Math.min(82, nextThreshold + Math.min(6, repetitionComplaints));
  }
  if (clarityFailures >= 2) {
    nextWeights.semanticFit += Math.min(0.07, clarityFailures * 0.018);
    nextWeights.novelty = Math.max(0.08, nextWeights.novelty - 0.018);
  }
  if (productionFailures >= 2) {
    nextWeights.productionConfidence += Math.min(
      0.07,
      productionFailures * 0.018,
    );
    nextThreshold = Math.max(58, nextThreshold - 2);
  }
  if (
    successfulNovelAnimations >= 3 &&
    productionFailures === 0 &&
    clarityFailures === 0
  ) {
    nextWeights.novelty += 0.02;
    nextThreshold = Math.min(84, nextThreshold + 1);
  }

  nextWeights = normalizeWeights(nextWeights);
  const changed =
    JSON.stringify(nextWeights) !== JSON.stringify(previousWeights) ||
    nextThreshold !== state.globalRules.preferNewAnimationBelowScore;

  const nextState = changed
    ? creativeBrainStateSchema.parse({
        ...state,
        revision: state.revision + 1,
        updatedAt: now,
        weights: nextWeights,
        globalRules: {
          ...state.globalRules,
          preferNewAnimationBelowScore: nextThreshold,
        },
      })
    : state;

  return {
    state: nextState,
    report: {
      consideredObservations: recent.length,
      repetitionComplaints,
      clarityFailures,
      productionFailures,
      successfulNovelAnimations,
      previousWeights,
      nextWeights,
      previousThreshold: state.globalRules.preferNewAnimationBelowScore,
      nextThreshold,
      changed,
    },
  };
};
