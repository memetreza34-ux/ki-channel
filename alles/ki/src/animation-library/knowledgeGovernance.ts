import {applyCreativeBrainObservation, findCurrentBrainFact} from './brain';
import {createKnowledgeObservation} from './learningPipeline';
import type {CreativeBrainFact, CreativeBrainState} from './schema';

export type KnowledgeCandidate = {
  observationId: string;
  factKey: string;
  value: unknown;
  confidence: number;
  source: string;
  observedAt: string;
  notes: string;
};

export type KnowledgeCandidateDecision = {
  observationId: string;
  factKey: string;
  status: 'adopted' | 'recorded-not-adopted' | 'duplicate-observation';
  reason:
    | 'new-fact'
    | 'newer-and-trusted'
    | 'older-than-current'
    | 'confidence-too-low'
    | 'duplicate-observation';
  previousFact: CreativeBrainFact | null;
  currentFact: CreativeBrainFact | null;
};

export type KnowledgeGovernanceResult = {
  previousRevision: number;
  nextRevision: number;
  adoptedCount: number;
  recordedNotAdoptedCount: number;
  duplicateCount: number;
  decisions: KnowledgeCandidateDecision[];
  state: CreativeBrainState;
};

const canonicalize = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, nested]) => [key, canonicalize(nested)]),
    );
  }
  return value;
};

const stableValue = (value: unknown): string => {
  if (value === undefined) return 'undefined';
  try {
    return JSON.stringify(canonicalize(value)) ?? String(value);
  } catch {
    return String(value);
  }
};

const sameFact = (
  left: CreativeBrainFact | undefined,
  right: CreativeBrainFact | undefined,
): boolean =>
  Boolean(
    left &&
    right &&
    left.factKey === right.factKey &&
    left.confidence === right.confidence &&
    left.source === right.source &&
    left.observedAt === right.observedAt &&
    stableValue(left.value) === stableValue(right.value),
  );

const predictedReason = ({
  existing,
  candidate,
}: {
  existing: CreativeBrainFact | undefined;
  candidate: KnowledgeCandidate;
}): KnowledgeCandidateDecision['reason'] => {
  if (!existing) return 'new-fact';
  if (Date.parse(candidate.observedAt) < Date.parse(existing.observedAt)) {
    return 'older-than-current';
  }
  if (candidate.confidence < existing.confidence * 0.85) {
    return 'confidence-too-low';
  }
  return 'newer-and-trusted';
};

const validateCandidate = (candidate: KnowledgeCandidate): void => {
  if (!candidate.observationId.trim()) throw new Error('knowledge observationId is required');
  if (!candidate.factKey.trim()) throw new Error('knowledge factKey is required');
  if (!candidate.source.trim()) throw new Error('knowledge source is required');
  if (!candidate.notes.trim()) throw new Error('knowledge notes are required');
  if (!Number.isFinite(candidate.confidence) || candidate.confidence < 0 || candidate.confidence > 1) {
    throw new Error('knowledge confidence must be between 0 and 1');
  }
  if (Number.isNaN(Date.parse(candidate.observedAt))) {
    throw new Error('knowledge observedAt must be an ISO timestamp');
  }
};

export const applyKnowledgeCandidates = ({
  state,
  candidates,
}: {
  state: CreativeBrainState;
  candidates: readonly KnowledgeCandidate[];
}): KnowledgeGovernanceResult => {
  let nextState = state;
  const decisions: KnowledgeCandidateDecision[] = [];

  const sorted = [...candidates].sort(
    (left, right) => Date.parse(left.observedAt) - Date.parse(right.observedAt),
  );
  for (const candidate of sorted) {
    validateCandidate(candidate);
    if (
      nextState.observations.some(
        (observation) => observation.observationId === candidate.observationId,
      )
    ) {
      decisions.push({
        observationId: candidate.observationId,
        factKey: candidate.factKey,
        status: 'duplicate-observation',
        reason: 'duplicate-observation',
        previousFact: findCurrentBrainFact(nextState, candidate.factKey) ?? null,
        currentFact: findCurrentBrainFact(nextState, candidate.factKey) ?? null,
      });
      continue;
    }

    const previousFact = findCurrentBrainFact(nextState, candidate.factKey);
    const reason = predictedReason({existing: previousFact, candidate});
    const observation = createKnowledgeObservation({
      observationId: candidate.observationId,
      factKey: candidate.factKey,
      value: candidate.value,
      confidence: candidate.confidence,
      source: candidate.source,
      createdAt: candidate.observedAt,
      supersedesObservationId: null,
      notes: `${candidate.notes} | governance-prediction: ${reason}`,
    });
    nextState = applyCreativeBrainObservation({state: nextState, observation});
    const currentFact = findCurrentBrainFact(nextState, candidate.factKey);
    const adopted = !sameFact(previousFact, currentFact);
    decisions.push({
      observationId: candidate.observationId,
      factKey: candidate.factKey,
      status: adopted ? 'adopted' : 'recorded-not-adopted',
      reason,
      previousFact: previousFact ?? null,
      currentFact: currentFact ?? null,
    });
  }

  return {
    previousRevision: state.revision,
    nextRevision: nextState.revision,
    adoptedCount: decisions.filter((decision) => decision.status === 'adopted').length,
    recordedNotAdoptedCount: decisions.filter(
      (decision) => decision.status === 'recorded-not-adopted',
    ).length,
    duplicateCount: decisions.filter(
      (decision) => decision.status === 'duplicate-observation',
    ).length,
    decisions,
    state: nextState,
  };
};
