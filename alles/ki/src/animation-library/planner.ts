import type {
  AnimationLibraryEntry,
  CreativeBrainState,
} from './schema';

export type ReelSceneBrief = {
  sceneId: string;
  spokenText: string;
  semanticTags: string[];
  explanationPatterns?: string[];
  preferredVisualFamilies?: string[];
  forbiddenVisualFamilies?: string[];
  preferredEnergy?: AnimationLibraryEntry['energy'];
  maximumComplexity?: AnimationLibraryEntry['complexity'];
  mustBeNew?: boolean;
};

export type AnimationScoreBreakdown = {
  semanticFit: number;
  novelty: number;
  reelDiversity: number;
  productionConfidence: number;
  transitionContinuity: number;
  repetitionPenalty: number;
  constraintPenalty: number;
  total: number;
};

export type NewAnimationProposal = {
  proposalId: string;
  sceneId: string;
  reason: string;
  requiredSemanticTags: string[];
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
  value.trim().toLocaleLowerCase('de-DE').replace(/[_\s]+/g, '-');

const normalizeTags = (values: readonly string[]): Set<string> =>
  new Set(values.map(normalizeTag).filter(Boolean));

const scoreSetMatch = (
  requestedValues: readonly string[],
  candidateValues: readonly string[],
): number => {
  const requested = normalizeTags(requestedValues);
  if (requested.size === 0) return 50;
  const candidate = normalizeTags(candidateValues);
  let intersection = 0;
  for (const value of requested) {
    if (candidate.has(value)) intersection += 1;
  }
  const recall = intersection / requested.size;
  const precision = intersection / Math.max(1, candidate.size);
  return Math.min(100, (recall * 0.78 + precision * 0.22) * 100);
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
    if (inTags.has(tag)) overlap += 1;
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
  const semanticTagFit = scoreSetMatch(scene.semanticTags, entry.semanticTags);
  const explanationFit = scoreSetMatch(
    scene.explanationPatterns ?? [],
    entry.explanationPatterns,
  );
  const familyPreference = scene.preferredVisualFamilies?.includes(
    entry.visualFamily,
  )
    ? 100
    : 55;
  const semanticFit = Math.min(
    100,
    semanticTagFit * 0.68 + explanationFit * 0.2 + familyPreference * 0.12,
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

  let repetitionPenalty = 0;
  if (state.usedAnimationIds.has(entry.animationId)) repetitionPenalty += 100;
  if (
    brain.globalRules.forbidConsecutiveLayoutFamily &&
    previous?.layoutFamily === entry.layoutFamily
  ) {
    repetitionPenalty += 100;
  }
  if (cooldownActive) repetitionPenalty += 28;

  let constraintPenalty = 0;
  if (scene.mustBeNew) constraintPenalty += 100;
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

  const weighted =
    semanticFit * brain.weights.semanticFit +
    novelty * brain.weights.novelty +
    reelDiversity * brain.weights.reelDiversity +
    productionConfidence * brain.weights.productionConfidence +
    transitionContinuity * brain.weights.transitionContinuity;
  const total = Math.max(
    0,
    Math.min(100, weighted - repetitionPenalty - constraintPenalty),
  );

  const reasons = [
    `semantic fit ${semanticFit.toFixed(1)}`,
    `novelty ${novelty.toFixed(1)}`,
    `reel diversity ${reelDiversity.toFixed(1)}`,
    `production confidence ${productionConfidence.toFixed(1)}`,
    `transition continuity ${transitionContinuity.toFixed(1)}`,
  ];
  if (repetitionPenalty > 0) {
    reasons.push(`repetition penalty -${repetitionPenalty}`);
  }
  if (constraintPenalty > 0) {
    reasons.push(`constraint penalty -${constraintPenalty}`);
  }

  return {
    entry,
    score: {
      semanticFit,
      novelty,
      reelDiversity,
      productionConfidence,
      transitionContinuity,
      repetitionPenalty,
      constraintPenalty,
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
}: {
  scene: ReelSceneBrief;
  previousEntry: AnimationLibraryEntry | undefined;
  usedLayouts: Set<string>;
  usedMotions: Set<string>;
}): NewAnimationProposal => {
  const family =
    scene.preferredVisualFamilies?.[0] ??
    normalizeTag(scene.semanticTags[0] ?? 'custom-explanation');
  return {
    proposalId: `proposal-${slugify(scene.sceneId)}-${slugify(family)}-v1`,
    sceneId: scene.sceneId,
    reason:
      scene.mustBeNew
        ? 'scene explicitly requires a new animation'
        : 'no existing animation reached the minimum combined fit and novelty score',
    requiredSemanticTags: [...scene.semanticTags],
    suggestedVisualFamily: family,
    forbiddenLayoutFamilies: [...usedLayouts],
    forbiddenMotionSignatures: [...usedMotions],
    suggestedDirection: nextDirection(previousEntry?.primaryDirection),
    suggestedEnergy: scene.preferredEnergy ??
      (previousEntry?.energy === 'dynamic' ? 'calm' : 'dynamic'),
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
      candidate.score.total < brain.globalRules.preferNewAnimationBelowScore;

    if (needsNewAnimation) {
      selections.push({
        sceneId: scene.sceneId,
        animationId: null,
        score: candidate?.score ?? null,
        reasons: [
          ...(candidate?.reasons ?? []),
          `new animation threshold ${brain.globalRules.preferNewAnimationBelowScore}`,
        ],
        newAnimationProposal: createNewAnimationProposal({
          scene,
          previousEntry,
          usedLayouts,
          usedMotions,
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
      'one or more scenes require a newly designed animation before production',
    );
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
    warnings,
  };
};
