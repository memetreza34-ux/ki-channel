import type {
  AnimationLibraryEntry,
  CreativeBrainObservation,
} from './schema';
import {creativeBrainObservationSchema} from './schema';

export type AnimationArtifactReview = {
  expectedArtifacts: number;
  validArtifacts: number;
  invalidArtifactPaths: string[];
  sourceFingerprintCurrent: boolean;
};

export type AnimationManualReview = {
  semanticClarity: number;
  novelty: number;
  productionConfidence: number;
  understandableWithoutSound: boolean;
  mobileReadable: boolean;
  deterministicMotion: boolean;
  noOverflow: boolean;
  noFullAnimationRepetition: boolean;
  notes: string[];
};

export type AnimationReviewDecision = {
  passedTechnicalReview: boolean;
  passedManualReview: boolean;
  recommendedStatus: AnimationLibraryEntry['status'];
  outcome: 'accepted' | 'reworked' | 'rejected';
  blockers: string[];
  observation: CreativeBrainObservation;
};

const scoreInRange = (value: number): number =>
  Math.min(100, Math.max(0, value));

export const evaluateAnimationReview = ({
  entry,
  reelId,
  sceneId,
  artifactReview,
  manualReview,
  observationId,
  createdAt,
}: {
  entry: AnimationLibraryEntry;
  reelId: string;
  sceneId: string;
  artifactReview: AnimationArtifactReview;
  manualReview: AnimationManualReview;
  observationId: string;
  createdAt: string;
}): AnimationReviewDecision => {
  const blockers: string[] = [];
  const passedTechnicalReview =
    artifactReview.expectedArtifacts > 0 &&
    artifactReview.validArtifacts === artifactReview.expectedArtifacts &&
    artifactReview.invalidArtifactPaths.length === 0 &&
    artifactReview.sourceFingerprintCurrent;

  if (artifactReview.expectedArtifacts <= 0) {
    blockers.push('no render artifacts were expected');
  }
  if (artifactReview.validArtifacts !== artifactReview.expectedArtifacts) {
    blockers.push(
      `${artifactReview.validArtifacts}/${artifactReview.expectedArtifacts} artifacts are valid`,
    );
  }
  if (artifactReview.invalidArtifactPaths.length > 0) {
    blockers.push(
      `invalid artifacts: ${artifactReview.invalidArtifactPaths.join(', ')}`,
    );
  }
  if (!artifactReview.sourceFingerprintCurrent) {
    blockers.push('render artifacts use an outdated source fingerprint');
  }

  const semanticClarity = scoreInRange(manualReview.semanticClarity);
  const novelty = scoreInRange(manualReview.novelty);
  const productionConfidence = scoreInRange(
    manualReview.productionConfidence,
  );
  const manualFlags = [
    ['understandable without sound', manualReview.understandableWithoutSound],
    ['mobile readable', manualReview.mobileReadable],
    ['deterministic motion', manualReview.deterministicMotion],
    ['no overflow', manualReview.noOverflow],
    ['no full animation repetition', manualReview.noFullAnimationRepetition],
  ] as const;
  for (const [label, passed] of manualFlags) {
    if (!passed) blockers.push(label);
  }
  if (semanticClarity < 78) blockers.push(`semantic clarity ${semanticClarity}/100`);
  if (novelty < 72) blockers.push(`novelty ${novelty}/100`);
  if (productionConfidence < 75) {
    blockers.push(`production confidence ${productionConfidence}/100`);
  }

  const passedManualReview =
    manualFlags.every(([, passed]) => passed) &&
    semanticClarity >= 78 &&
    novelty >= 72 &&
    productionConfidence >= 75;
  const passed = passedTechnicalReview && passedManualReview;
  const outcome: AnimationReviewDecision['outcome'] = passed
    ? 'accepted'
    : passedTechnicalReview || passedManualReview
      ? 'reworked'
      : 'rejected';
  const recommendedStatus: AnimationLibraryEntry['status'] = passed
    ? 'verified'
    : entry.status === 'concept'
      ? 'concept'
      : 'prototype';

  const observation = creativeBrainObservationSchema.parse({
    observationId,
    type: 'render-review',
    animationId: entry.animationId,
    reelId,
    sceneId,
    semanticClarity,
    novelty,
    productionConfidence,
    outcome,
    notes: [
      ...manualReview.notes,
      ...blockers.map((blocker) => `blocker: ${blocker}`),
    ].join(' | ') || 'render review completed',
    createdAt,
    fact: null,
  });

  return {
    passedTechnicalReview,
    passedManualReview,
    recommendedStatus,
    outcome,
    blockers,
    observation,
  };
};

export const applyAnimationReviewStatus = ({
  entry,
  decision,
}: {
  entry: AnimationLibraryEntry;
  decision: AnimationReviewDecision;
}): AnimationLibraryEntry => {
  if (entry.status === 'retired') return entry;
  if (decision.recommendedStatus === 'verified' && decision.blockers.length > 0) {
    throw new Error('cannot verify an animation while review blockers remain');
  }
  return {
    ...entry,
    status: decision.recommendedStatus,
    qualityPrior: {
      semanticClarity: decision.observation.semanticClarity ??
        entry.qualityPrior.semanticClarity,
      novelty: decision.observation.novelty ?? entry.qualityPrior.novelty,
      productionConfidence:
        decision.observation.productionConfidence ??
        entry.qualityPrior.productionConfidence,
    },
  };
};
