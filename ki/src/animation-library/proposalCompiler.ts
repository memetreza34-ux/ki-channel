import type {AnimationLibraryEntry} from './schema';
import type {NewAnimationProposal} from './planner';
import {
  analyzeSceneMeaning,
  type SceneMeaningContract,
} from './meaningContract';

export type AnimationBuildPhase = {
  phaseId: string;
  purpose: string;
  startRatio: number;
  endRatio: number;
  semanticTrigger: string;
};

export type AnimationBuildSpec = {
  proposalId: string;
  animationId: string;
  title: string;
  visualFamily: string;
  layoutFamily: string;
  motionSignature: string;
  noveltyGroup: string;
  semanticTags: string[];
  explanationPatterns: string[];
  primitiveTags: string[];
  transitionInTags: string[];
  transitionOutTags: string[];
  cameraStyle: string;
  primaryDirection: AnimationLibraryEntry['primaryDirection'];
  energy: AnimationLibraryEntry['energy'];
  density: AnimationLibraryEntry['density'];
  complexity: AnimationLibraryEntry['complexity'];
  durationSeconds: {min: number; max: number};
  phases: AnimationBuildPhase[];
  forbiddenLayoutFamilies: string[];
  forbiddenMotionSignatures: string[];
  contentContract?: SceneMeaningContract;
  implementationRules: string[];
};

type CompilableNewAnimationProposal = Omit<
  NewAnimationProposal,
  'spokenText' | 'meaningContract'
> & {
  spokenText?: string;
  meaningContract?: SceneMeaningContract;
};

const slugify = (value: string): string =>
  value
    .toLocaleLowerCase('de-DE')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 52);

const unique = <T,>(values: readonly T[]): T[] => [...new Set(values)];

const directionLayout: Record<
  AnimationLibraryEntry['primaryDirection'],
  string
> = {
  'left-to-right': 'asymmetric-horizontal-route',
  'right-to-left': 'reverse-horizontal-route',
  'top-to-bottom': 'vertical-filter-stack',
  'bottom-to-top': 'ascending-stage-stack',
  'center-out': 'radial-expansion-field',
  'outside-in': 'converging-evidence-field',
  circular: 'orbital-workspace',
  'depth-forward': 'layered-depth-corridor',
  'depth-backward': 'reverse-depth-reveal',
  mixed: 'multi-axis-choreography',
};

const directionMotion: Record<
  AnimationLibraryEntry['primaryDirection'],
  string
> = {
  'left-to-right': 'enter-travel-transform-exit',
  'right-to-left': 'reverse-trace-isolate-resolve',
  'top-to-bottom': 'drop-filter-compress-release',
  'bottom-to-top': 'rise-qualify-lock-elevate',
  'center-out': 'seed-expand-branch-settle',
  'outside-in': 'scatter-attract-rank-combine',
  circular: 'orbit-compare-converge-release',
  'depth-forward': 'layers-open-camera-push-result',
  'depth-backward': 'result-freeze-xray-reconstruct',
  mixed: 'multi-source-cross-morph-resolve',
};

const semanticPrimitiveMap: Record<string, string[]> = {
  search: ['query-core', 'evidence-fragments', 'relevance-field'],
  retrieval: ['document-fragments', 'source-markers', 'ranked-stack'],
  data: ['data-particles', 'value-labels', 'flow-paths'],
  text: ['kinetic-type', 'word-capsules', 'semantic-highlights'],
  token: ['text-strip', 'split-boundaries', 'ordered-token-capsules'],
  vector: ['source-token', 'conversion-prism', 'numeric-vector-result'],
  meaning: ['labeled-concepts', 'distance-field', 'semantic-clusters'],
  error: ['warning-marker', 'diagnostic-path', 'repair-state'],
  risk: ['split-state', 'confidence-meter', 'warning-signal'],
  verify: ['claim-state', 'evidence-check', 'verified-result'],
  compare: ['shared-baseline', 'contrast-zones', 'result-marker'],
  ranking: ['candidate-markers', 'score-display', 'ordered-targets'],
  probability: ['candidate-columns', 'changing-confidence', 'selected-token'],
  process: ['step-nodes', 'handoff-object', 'completion-state'],
  workflow: ['route-lines', 'stations', 'status-signals'],
  learning: ['knowledge-nodes', 'version-marker', 'graft-connection'],
  context: ['window-boundary', 'message-blocks', 'eviction-marker'],
  security: ['shield-boundary', 'access-gate', 'threat-particles'],
  cost: ['budget-units', 'leak-point', 'savings-result'],
};

const inferPrimitives = (tags: readonly string[]): string[] => {
  const normalized = tags.map(slugify);
  const primitives: string[] = [];
  for (const tag of normalized) {
    for (const [keyword, mapped] of Object.entries(semanticPrimitiveMap)) {
      if (tag.includes(keyword)) primitives.push(...mapped);
    }
  }
  return unique(
    primitives.length > 0
      ? primitives
      : ['semantic-object', 'cause-path', 'result-state'],
  ).slice(0, 10);
};

const deriveUnusedValue = ({
  preferred,
  forbidden,
  suffix,
}: {
  preferred: string;
  forbidden: readonly string[];
  suffix: string;
}): string => {
  const forbiddenSet = new Set(forbidden.map(slugify));
  const normalized = slugify(preferred);
  if (!forbiddenSet.has(normalized)) return normalized;
  for (let index = 2; index <= 99; index += 1) {
    const candidate = `${normalized}-${suffix}-${index}`;
    if (!forbiddenSet.has(candidate)) return candidate;
  }
  throw new Error(`unable to derive unused ${suffix} from ${preferred}`);
};

const resolveMeaningContract = (
  proposal: CompilableNewAnimationProposal,
): SceneMeaningContract =>
  proposal.meaningContract ??
  analyzeSceneMeaning(
    proposal.spokenText ?? proposal.requiredSemanticTags.join(' '),
  );

const buildPhases = (
  semanticTags: readonly string[],
  content: SceneMeaningContract,
): AnimationBuildPhase[] => {
  const trigger =
    content.subjectTerms[0] ?? semanticTags[0] ?? 'Kernaussage';
  const actionTrigger =
    content.actionTerms[0] ?? semanticTags[1] ?? trigger;
  const resultTrigger =
    content.resultTerms[0] ?? semanticTags[semanticTags.length - 1] ?? trigger;
  return [
    {
      phaseId: 'establish',
      purpose: `Show the exact starting state: ${content.startState}.`,
      startRatio: 0,
      endRatio: 0.2,
      semanticTrigger: trigger,
    },
    {
      phaseId: 'explain',
      purpose: `Make this exact content change visible: ${content.visibleChange}.`,
      startRatio: 0.18,
      endRatio: 0.58,
      semanticTrigger: actionTrigger,
    },
    {
      phaseId: 'contrast',
      purpose: `Prove the communication goal ${content.communicationGoal} without switching to an unrelated visual metaphor.`,
      startRatio: 0.52,
      endRatio: 0.82,
      semanticTrigger: resultTrigger,
    },
    {
      phaseId: 'resolve',
      purpose: `Hold the exact final state: ${content.endState}.`,
      startRatio: 0.78,
      endRatio: 1,
      semanticTrigger: resultTrigger,
    },
  ];
};

export const compileNewAnimationProposal = ({
  proposal,
  version = 1,
}: {
  proposal: CompilableNewAnimationProposal;
  version?: number;
}): AnimationBuildSpec => {
  if (!Number.isInteger(version) || version < 1) {
    throw new Error('animation proposal version must be a positive integer');
  }

  const contentContract = resolveMeaningContract(proposal);
  const family = slugify(
    proposal.suggestedVisualFamily ||
      contentContract.preferredVisualFamilies[0] ||
      'custom-explanation',
  );
  const baseLayout = `${family}-${directionLayout[proposal.suggestedDirection]}`;
  const baseMotion = `${family}-${directionMotion[proposal.suggestedDirection]}`;
  const layoutFamily = deriveUnusedValue({
    preferred: baseLayout,
    forbidden: proposal.forbiddenLayoutFamilies,
    suffix: 'layout',
  });
  const motionSignature = deriveUnusedValue({
    preferred: baseMotion,
    forbidden: proposal.forbiddenMotionSignatures,
    suffix: 'motion',
  });
  const semanticTags = unique(
    [
      ...proposal.requiredSemanticTags,
      ...contentContract.subjectTerms,
      ...contentContract.actionTerms,
      ...contentContract.resultTerms,
    ]
      .map(slugify)
      .filter(Boolean),
  ).slice(0, 16);
  const primitiveTags = unique([
    ...inferPrimitives(semanticTags),
    ...contentContract.requiredVisualCues.map(slugify),
  ]).slice(0, 12);
  const shortName = slugify(
    semanticTags.slice(0, 3).join('-') || proposal.sceneId,
  );

  return {
    proposalId: proposal.proposalId,
    animationId: `${family}-${shortName}-${slugify(proposal.suggestedDirection)}-v${version}`,
    title: semanticTags
      .slice(0, 4)
      .map((tag) => tag.replace(/-/g, ' '))
      .join(' · '),
    visualFamily: family,
    layoutFamily,
    motionSignature,
    noveltyGroup: `${family}-${slugify(proposal.suggestedDirection)}`,
    semanticTags,
    explanationPatterns: unique([
      ...contentContract.preferredExplanationPatterns.map(slugify),
      'semantic-cause-and-effect',
      proposal.suggestedDirection.startsWith('depth')
        ? 'layered-reveal'
        : 'visible-transformation',
    ]).slice(0, 8),
    primitiveTags,
    transitionInTags: unique([
      `${proposal.suggestedDirection}-entry`,
      primitiveTags[0],
    ]),
    transitionOutTags: unique([
      `${proposal.suggestedDirection}-result`,
      primitiveTags[primitiveTags.length - 1],
    ]),
    cameraStyle: proposal.suggestedDirection.startsWith('depth')
      ? 'controlled-depth-push-with-stable-text-plane'
      : proposal.suggestedDirection === 'circular'
        ? 'gentle-orbit-with-locked-safe-zones'
        : 'locked-camera-with-directional-object-motion',
    primaryDirection: proposal.suggestedDirection,
    energy: proposal.suggestedEnergy,
    density: semanticTags.length >= 5 ? 'dense' : 'balanced',
    complexity: primitiveTags.length >= 7 ? 'high' : 'medium',
    durationSeconds: {
      min: proposal.suggestedEnergy === 'impact' ? 3.5 : 4,
      max: proposal.suggestedEnergy === 'calm' ? 8 : 6.5,
    },
    phases: buildPhases(semanticTags, contentContract),
    forbiddenLayoutFamilies: [...proposal.forbiddenLayoutFamilies],
    forbiddenMotionSignatures: [...proposal.forbiddenMotionSignatures],
    contentContract,
    implementationRules: [
      proposal.spokenText
        ? `Build for this exact spoken sentence: “${proposal.spokenText}”.`
        : 'Build for the exact semantic tags and content contract; do not invent a different message.',
      `The opening frame must show: ${contentContract.startState}.`,
      `The dominant motion must show: ${contentContract.visibleChange}.`,
      `The final hold must show: ${contentContract.endState}.`,
      `Required visual cues: ${contentContract.requiredVisualCues.join(', ')}.`,
      `Forbidden visual shortcuts: ${contentContract.forbiddenVisualCues.join(', ')}.`,
      'Do not reuse a full scene composition from the existing animation library.',
      'Every dominant movement must explain a spoken concept or causal relationship.',
      'Keep title, main animation, and kinetic subtitles in separate safe zones.',
      'Use deterministic frame-based motion only; no Math.random, timers, or CSS transitions.',
      'Render and inspect the start, explanation peak, contrast peak, and final hold frames.',
      'Reject the result if it is only a card layout with different labels.',
    ],
  };
};

export const createCatalogEntryFromBuildSpec = ({
  spec,
  description,
}: {
  spec: AnimationBuildSpec;
  description: string;
}): AnimationLibraryEntry => ({
  animationId: spec.animationId,
  version: 1,
  title: spec.title || spec.animationId,
  description,
  status: 'concept',
  visualFamily: spec.visualFamily,
  layoutFamily: spec.layoutFamily,
  motionSignature: spec.motionSignature,
  noveltyGroup: spec.noveltyGroup,
  semanticTags: spec.semanticTags,
  explanationPatterns: spec.explanationPatterns,
  avoidWhen: unique([
    'the scene has no semantic connection to the required tags',
    'the available duration is below the build specification minimum',
    ...(spec.contentContract?.forbiddenVisualCues ?? []),
  ]).slice(0, 8),
  primitiveTags: spec.primitiveTags,
  transitionInTags: spec.transitionInTags,
  transitionOutTags: spec.transitionOutTags,
  cameraStyle: spec.cameraStyle,
  primaryDirection: spec.primaryDirection,
  energy: spec.energy,
  density: spec.density,
  complexity: spec.complexity,
  durationSeconds: spec.durationSeconds,
  qualityPrior: {
    semanticClarity: 78,
    novelty: 92,
    productionConfidence: 45,
  },
});
