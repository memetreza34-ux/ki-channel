import type {
  AnimationLibraryEntry,
  CreativeBrainState,
} from './schema';
import {
  analyzeSceneMeaning,
  estimateSpokenDurationSeconds,
  scoreMeaningCompatibility,
  type SceneMeaningContract,
} from './meaningContract';

export type ReelSceneBrief = {
  sceneId: string;
  spokenText: string;
  semanticTags: string[];
  explanationPatterns?: string[];
  preferredVisualFamilies?: string[];
  forbiddenVisualFamilies?: string[];
  preferredEnergy?: AnimationLibraryEntry['energy'];
  maximumComplexity?: AnimationLibraryEntry['complexity'];
  durationSeconds?: number;
  meaningContract?: SceneMeaningContract;
  mustBeNew?: boolean;
};

export type AnimationScoreBreakdown = {
  semanticFit: number;
  meaningCompatibility: number;
  durationFit: number;
  novelty: number;
  reelDiversity: number;
  productionConfidence: number;
  transitionContinuity: number;
  repetitionPenalty: number;
  constraintPenalty: number;
  avoidancePenalty: number;
  total: number;
};

export type NewAnimationProposal = {
  proposalId: string;
  sceneId: string;
  spokenText: string;
  reason: string;
  requiredSemanticTags: string[];
  meaningContract: SceneMeaningContract;
  suggestedVisualFamily: string;
  forbiddenLayoutFamilies: string[];
  forbiddenMotionSignatures: string[];
  suggestedDirection: AnimationLibraryEntry['primaryDirection'];
  suggestedEnergy: AnimationLibraryEntry['energy'];
};

export type PlannedAnimationSelection = {
  sceneId: string;
  animationId: string | null;
  score: AnimationScoreBreakdown | null;
  reasons: string[];
  newAnimationProposal: NewAnimationProposal | null;
};

export type ReelChoreographyPlan = {
  reelId: string;
  reelIndex: number;
  selections: PlannedAnimationSelection[];
  visualFamilies: string[];
  layoutFamilies: string[];
  motionSignatures: string[];
  newAnimationCount: number;
  warnings: string[];
};

type CandidateSelection = {
  entry: AnimationLibraryEntry;
  score: AnimationScoreBreakdown;
  reasons: string[];
};

type BeamState = {
  selections: CandidateSelection[];
  score: number;
  usedAnimationIds: Set<string>;
  usedVisualFamilies: Set<string>;
  usedLayoutFamilies: Set<string>;
  usedMotionSignatures: Set<string>;
  cardPrimaryCount: number;
};

const normalizeTag = (value: string): string =>
  value
    .trim()
    .toLocaleLowerCase('de-DE')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

const normalizeTags = (values: readonly string[]): Set<string> =>
  new Set(values.map(normalizeTag).filter(Boolean));

const segments = (value: string): string[] =>
  normalizeTag(value).split('-').filter((segment) => segment.length >= 3);

const valuesMatch = (left: string, right: string): boolean => {
  const normalizedLeft = normalizeTag(left);
  const normalizedRight = normalizeTag(right);
  if (normalizedLeft === normalizedRight) return true;
  const leftSegments = segments(left);
  const rightSegments = segments(right);
  return leftSegments.some((leftSegment) =>
    rightSegments.some(
      (rightSegment) =>
        leftSegment === rightSegment ||
        (leftSegment.length >= 5 && rightSegment.startsWith(leftSegment)) ||
        (rightSegment.length >= 5 && leftSegment.startsWith(rightSegment)),
    ),
  );
};

const scoreSetMatch = (
  requestedValues: readonly string[],
  candidateValues: readonly string[],
): number => {
  const requested = [...normalizeTags(requestedValues)];
  if (requested.length === 0) return 58;
  const candidate = [...normalizeTags(candidateValues)];
  let matchedRequested = 0;
  let matchedCandidate = 0;
  for (const requestedValue of requested) {
    if (candidate.some((candidateValue) => valuesMatch(requestedValue, candidateValue))) {
      matchedRequested += 1;
    }
  }
  for (const candidateValue of candidate) {
    if (requested.some((requestedValue) => valuesMatch(requestedValue, candidateValue))) {
      matchedCandidate += 1;
    }
  }
  const recall = matchedRequested / requested.length;
  const precision = matchedCandidate / Math.max(1, candidate.length);
  return Math.min(100, (recall * 0.82 + precision * 0.18) * 100);
};

const complexityRank: Record<AnimationLibraryEntry['complexity'], number> = {
  low: 0,
  medium: 1,
  high: 2,
};

const isCardPrimaryVisual = (entry: AnimationLibraryEntry): boolean =>
  entry.layoutFamily.includes('card') ||
  entry.primitiveTags.filter((tag) => tag.includes('card')).length >= 2;

const transitionScore = (
  previous: AnimationLibraryEntry | undefined,
  current: AnimationLibraryEntry,
): number => {
  if (!previous) return 70;
  const outTags = normalizeTags(previous.transitionOutTags);
  const inTags = normalizeTags(current.transitionInTags);
  let overlap = 0;
  for (const tag of outTags) {
    if ([...inTags].some((incoming) => valuesMatch(tag, incoming))) overlap += 1;
  }

  const directOverlapScore = Math.min(100, overlap * 35);
  const directionalContinuity =
    previous.primaryDirection === current.primaryDirection ? 45 : 72;
  const depthContinuity =
    previous.primaryDirection.startsWith('depth') &&
    current.primaryDirection.startsWith('depth')
      ? 82
      : 60;

  return Math.max(directOverlapScore, directionalContinuity, depthContinuity);
};

const durationCompatibility = (
  scene: ReelSceneBrief,
  entry: AnimationLibraryEntry,
): {score: number; penalty: number; duration: number} => {
  const duration = scene.durationSeconds ?? estimateSpokenDurationSeconds(scene.spokenText);
  if (duration >= entry.durationSeconds.min && duration <= entry.durationSeconds.max) {
    return {score: 100, penalty: 0, duration};
  }
  const distance =
    duration < entry.durationSeconds.min
      ? entry.durationSeconds.min - duration
      : duration - entry.durationSeconds.max;
  const score = Math.max(0, 100 - distance * 28);
  const penalty = distance >= 2.5 ? 28 : distance >= 1.25 ? 16 : 7;
  return {score, penalty, duration};
};

const resolveMeaningContract = (scene: ReelSceneBrief): SceneMeaningContract =>
  scene.meaningContract ?? analyzeSceneMeaning(scene.spokenText);

const scoreCandidate = ({
  scene,
  entry,
  state,
  brain,
  reelIndex,
}: {
  scene: ReelSceneBrief;
  entry: AnimationLibraryEntry;
  state: BeamState;
  brain: CreativeBrainState;
  reelIndex: number;
}): CandidateSelection => {
  const learned = brain.animationStats.find(
    (stats) => stats.animationId === entry.animationId,
  );
  const meaningContract = resolveMeaningContract(scene);
  const meaning = scoreMeaningCompatibility({
    spokenText: scene.spokenText,
    contract: meaningContract,
    entry,
  });
  const semanticTagFit = scoreSetMatch(scene.semanticTags, entry.semanticTags);
  const explanationFit = scoreSetMatch(
    [
      ...(scene.explanationPatterns ?? []),
      ...meaningContract.preferredExplanationPatterns,
    ],
    entry.explanationPatterns,
  );
  const familyPreferences = new Set(
    [
      ...(scene.preferredVisualFamilies ?? []),
      ...meaningContract.preferredVisualFamilies,
    ].map(normalizeTag),
  );
  const familyPreference = familyPreferences.size === 0
    ? 58
    : familyPreferences.has(normalizeTag(entry.visualFamily))
      ? 100
      : 24;
  const semanticClarity =
    learned?.learnedSemanticClarity ?? entry.qualityPrior.semanticClarity;
  const semanticFit = Math.min(
    100,
    semanticTagFit * 0.3 +
      explanationFit * 0.16 +
      familyPreference * 0.12 +
      meaning.score * 0.36 +
      semanticClarity * 0.06,
  );

  const usageCount = learned?.usageCount ?? 0;
  const cooldownActive =
    (learned?.cooldownUntilReelIndex ?? 0) > reelIndex;
  const noveltyBase = learned?.learnedNovelty ?? entry.qualityPrior.novelty;
  const novelty = Math.max(
    0,
    noveltyBase - usageCount * 4 - (cooldownActive ? 32 : 0),
  );

  let reelDiversity = 100;
  if (state.usedVisualFamilies.has(entry.visualFamily)) reelDiversity -= 18;
  if (state.usedLayoutFamilies.has(entry.layoutFamily)) reelDiversity -= 38;
  if (state.usedMotionSignatures.has(entry.motionSignature)) reelDiversity -= 45;
  const previous = state.selections[state.selections.length - 1]?.entry;
  if (previous?.visualFamily === entry.visualFamily) reelDiversity -= 24;
  if (previous?.primaryDirection === entry.primaryDirection) reelDiversity -= 10;
  if (previous?.energy === entry.energy) reelDiversity -= 5;
  reelDiversity = Math.max(0, reelDiversity);

  const productionConfidence =
    learned?.learnedProductionConfidence ??
    entry.qualityPrior.productionConfidence;
  const transitionContinuity = transitionScore(previous, entry);
  const duration = durationCompatibility(scene, entry);

  let repetitionPenalty = 0;
  if (state.usedAnimationIds.has(entry.animationId)) repetitionPenalty += 100;
  if (
    brain.globalRules.forbidConsecutiveLayoutFamily &&
    previous?.layoutFamily === entry.layoutFamily
  ) {
    repetitionPenalty += 100;
  }
  if (cooldownActive) repetitionPenalty += 28;

  let constraintPenalty = duration.penalty;
  if (scene.forbiddenVisualFamilies?.includes(entry.visualFamily)) {
    constraintPenalty += 100;
  }
  if (
    scene.maximumComplexity &&
    complexityRank[entry.complexity] > complexityRank[scene.maximumComplexity]
  ) {
    constraintPenalty += 45;
  }
  if (scene.preferredEnergy && entry.energy !== scene.preferredEnergy) {
    constraintPenalty += 8;
  }
  if (
    isCardPrimaryVisual(entry) &&
    state.cardPrimaryCount >=
      brain.globalRules.maximumCardsAsPrimaryVisualPerReel
  ) {
    constraintPenalty += 55;
  }
  if (entry.status === 'retired') constraintPenalty += 100;
  if (meaning.score < 35) constraintPenalty += 36;
  if (semanticFit < 42) constraintPenalty += 30;

  const weighted =
    semanticFit * brain.weights.semanticFit +
    novelty * brain.weights.novelty +
    reelDiversity * brain.weights.reelDiversity +
    productionConfidence * brain.weights.productionConfidence +
    transitionContinuity * brain.weights.transitionContinuity;

  // Novelty and visual variety may never lift an animation above its content fit.
  const contentCeiling = Math.min(
    100,
    semanticFit + 12,
    meaning.score + 18,
  );
  const total = Math.max(
    0,
    Math.min(contentCeiling, weighted) - repetitionPenalty - constraintPenalty,
  );

  const reasons = [
    `semantic fit ${semanticFit.toFixed(1)}`,
    `spoken meaning compatibility ${meaning.score.toFixed(1)}`,
    `duration fit ${duration.score.toFixed(1)} at ${duration.duration.toFixed(1)}s`,
    `novelty ${novelty.toFixed(1)}`,
    `reel diversity ${reelDiversity.toFixed(1)}`,
    `production confidence ${productionConfidence.toFixed(1)}`,
    `transition continuity ${transitionContinuity.toFixed(1)}`,
    ...meaning.reasons,
  ];
  if (repetitionPenalty > 0) {
    reasons.push(`repetition penalty -${repetitionPenalty}`);
  }
  if (constraintPenalty > 0) {
    reasons.push(`constraint penalty -${constraintPenalty}`);
  }
  if (total === contentCeiling && weighted > contentCeiling) {
    reasons.push(`content ceiling limited score to ${contentCeiling.toFixed(1)}`);
  }

  return {
    entry,
    score: {
      semanticFit,
      meaningCompatibility: meaning.score,
      durationFit: duration.score,
      novelty,
      reelDiversity,
      productionConfidence,
      transitionContinuity,
      repetitionPenalty,
      constraintPenalty,
      avoidancePenalty: meaning.avoidancePenalty + meaning.forbiddenCuePenalty,
      total,
    },
    reasons,
  };
};

const nextDirection = (
  previousDirection: AnimationLibraryEntry['primaryDirection'] | undefined,
): AnimationLibraryEntry['primaryDirection'] => {
  const rotation: AnimationLibraryEntry['primaryDirection'][] = [
    'left-to-right',
    'bottom-to-top',
    'depth-forward',
    'circular',
    'center-out',
    'right-to-left',
    'top-to-bottom',
    'outside-in',
  ];
  const previousIndex = previousDirection
    ? rotation.indexOf(previousDirection)
    : -1;
  return rotation[(previousIndex + 1 + rotation.length) % rotation.length];
};

const directionForMeaning = (
  contract: SceneMeaningContract,
  fallback: AnimationLibraryEntry['primaryDirection'],
): AnimationLibraryEntry['primaryDirection'] => {
  switch (contract.communicationGoal) {
    case 'rank':
      return 'bottom-to-top';
    case 'compare':
      return 'center-out';
    case 'show-limitation':
      return 'top-to-bottom';
    case 'show-change-over-time':
    case 'explain-process':
    case 'show-transformation':
      return 'left-to-right';
    case 'reveal-cause':
      return 'outside-in';
    case 'show-collaboration':
      return 'circular';
    case 'warn-or-verify':
      return 'depth-forward';
    case 'show-result':
      return fallback;
  }
};

const slugify = (value: string): string =>
  value
    .toLocaleLowerCase('de-DE')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);

const createNewAnimationProposal = ({
  scene,
  previousEntry,
  usedLayouts,
  usedMotions,
  candidate,
}: {
  scene: ReelSceneBrief;
  previousEntry: AnimationLibraryEntry | undefined;
  usedLayouts: Set<string>;
  usedMotions: Set<string>;
  candidate: CandidateSelection | undefined;
}): NewAnimationProposal => {
  const meaningContract = resolveMeaningContract(scene);
  const family =
    meaningContract.preferredVisualFamilies[0] ??
    scene.preferredVisualFamilies?.[0] ??
    normalizeTag(scene.semanticTags[0] ?? 'custom-explanation');
  const fallbackDirection = nextDirection(previousEntry?.primaryDirection);
  const reason = scene.mustBeNew
    ? 'scene explicitly requires a new animation'
    : candidate && candidate.score.meaningCompatibility < 35
      ? 'the best library candidate does not express the spoken meaning'
      : candidate && candidate.score.semanticFit < 42
        ? 'the best library candidate does not cover the required content'
        : 'no existing animation reached the content-first production threshold';
  return {
    proposalId: `proposal-${slugify(scene.sceneId)}-${slugify(family)}-v1`,
    sceneId: scene.sceneId,
    spokenText: scene.spokenText,
    reason,
    requiredSemanticTags: [
      ...new Set([
        ...scene.semanticTags,
        ...meaningContract.subjectTerms,
        ...meaningContract.actionTerms,
        ...meaningContract.resultTerms,
      ]),
    ].slice(0, 16),
    meaningContract,
    suggestedVisualFamily: family,
    forbiddenLayoutFamilies: [...usedLayouts],
    forbiddenMotionSignatures: [...usedMotions],
    suggestedDirection: directionForMeaning(meaningContract, fallbackDirection),
    suggestedEnergy:
      scene.preferredEnergy ??
      (meaningContract.communicationGoal === 'warn-or-verify'
        ? 'impact'
        : previousEntry?.energy === 'dynamic'
          ? 'calm'
          : 'dynamic'),
  };
};

const expandBeam = ({
  beam,
  scene,
  entries,
  brain,
  reelIndex,
  candidateLimit,
}: {
  beam: BeamState[];
  scene: ReelSceneBrief;
  entries: readonly AnimationLibraryEntry[];
  brain: CreativeBrainState;
  reelIndex: number;
  candidateLimit: number;
}): BeamState[] => {
  const expanded: BeamState[] = [];

  for (const state of beam) {
    const candidates = entries
      .map((entry) =>
        scoreCandidate({scene, entry, state, brain, reelIndex}),
      )
      .filter((candidate) => candidate.score.total > 0)
      .sort((left, right) => right.score.total - left.score.total)
      .slice(0, candidateLimit);

    for (const candidate of candidates) {
      const cardPrimaryCount =
        state.cardPrimaryCount + (isCardPrimaryVisual(candidate.entry) ? 1 : 0);
      expanded.push({
        selections: [...state.selections, candidate],
        score: state.score + candidate.score.total,
        usedAnimationIds: new Set([
          ...state.usedAnimationIds,
          candidate.entry.animationId,
        ]),
        usedVisualFamilies: new Set([
          ...state.usedVisualFamilies,
          candidate.entry.visualFamily,
        ]),
        usedLayoutFamilies: new Set([
          ...state.usedLayoutFamilies,
          candidate.entry.layoutFamily,
        ]),
        usedMotionSignatures: new Set([
          ...state.usedMotionSignatures,
          candidate.entry.motionSignature,
        ]),
        cardPrimaryCount,
      });
    }
  }

  return expanded;
};

export const planReelChoreography = ({
  reelId,
  reelIndex,
  scenes,
  entries,
  brain,
  beamWidth = 12,
  candidateLimit = 10,
}: {
  reelId: string;
  reelIndex: number;
  scenes: readonly ReelSceneBrief[];
  entries: readonly AnimationLibraryEntry[];
  brain: CreativeBrainState;
  beamWidth?: number;
  candidateLimit?: number;
}): ReelChoreographyPlan => {
  let beam: BeamState[] = [
    {
      selections: [],
      score: 0,
      usedAnimationIds: new Set(),
      usedVisualFamilies: new Set(),
      usedLayoutFamilies: new Set(),
      usedMotionSignatures: new Set(),
      cardPrimaryCount: 0,
    },
  ];

  for (const scene of scenes) {
    const expanded = expandBeam({
      beam,
      scene,
      entries,
      brain,
      reelIndex,
      candidateLimit,
    });
    beam = expanded
      .sort((left, right) => right.score - left.score)
      .slice(0, beamWidth);
    if (beam.length === 0) break;
  }

  const best = beam[0];
  const selections: PlannedAnimationSelection[] = [];
  const acceptedEntries: AnimationLibraryEntry[] = [];
  const usedLayouts = new Set<string>();
  const usedMotions = new Set<string>();

  scenes.forEach((scene, index) => {
    const candidate = best?.selections[index];
    const previousEntry = acceptedEntries[acceptedEntries.length - 1];
    const needsNewAnimation =
      scene.mustBeNew ||
      !candidate ||
      candidate.score.total < brain.globalRules.preferNewAnimationBelowScore ||
      candidate.score.meaningCompatibility < 35 ||
      candidate.score.semanticFit < 42;

    if (needsNewAnimation) {
      selections.push({
        sceneId: scene.sceneId,
        animationId: null,
        score: candidate?.score ?? null,
        reasons: [
          ...(candidate?.reasons ?? []),
          `new animation threshold ${brain.globalRules.preferNewAnimationBelowScore}`,
          'content-first gate rejected reuse',
        ],
        newAnimationProposal: createNewAnimationProposal({
          scene,
          previousEntry,
          usedLayouts,
          usedMotions,
          candidate,
        }),
      });
      return;
    }

    acceptedEntries.push(candidate.entry);
    usedLayouts.add(candidate.entry.layoutFamily);
    usedMotions.add(candidate.entry.motionSignature);
    selections.push({
      sceneId: scene.sceneId,
      animationId: candidate.entry.animationId,
      score: candidate.score,
      reasons: candidate.reasons,
      newAnimationProposal: null,
    });
  });

  const visualFamilies = acceptedEntries.map((entry) => entry.visualFamily);
  const layoutFamilies = acceptedEntries.map((entry) => entry.layoutFamily);
  const motionSignatures = acceptedEntries.map((entry) => entry.motionSignature);
  const uniqueVisualFamilies = new Set(visualFamilies);
  const warnings: string[] = [];

  if (
    uniqueVisualFamilies.size <
    Math.min(
      scenes.length,
      brain.globalRules.minimumVisualFamiliesPerReel,
    )
  ) {
    warnings.push(
      `only ${uniqueVisualFamilies.size} visual families were selected`,
    );
  }
  if (selections.some((selection) => selection.animationId === null)) {
    warnings.push(
      'one or more scenes require a content-specific animation before production',
    );
  }
  for (const selection of selections) {
    if (
      selection.animationId &&
      selection.score &&
      selection.score.meaningCompatibility < 55
    ) {
      warnings.push(
        `scene ${selection.sceneId} has weak spoken-meaning compatibility`,
      );
    }
  }

  return {
    reelId,
    reelIndex,
    selections,
    visualFamilies,
    layoutFamilies,
    motionSignatures,
    newAnimationCount: selections.filter(
      (selection) => selection.newAnimationProposal !== null,
    ).length,
    warnings: [...new Set(warnings)],
  };
};
