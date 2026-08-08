import {ADVANCED_ANIMATION_RECIPES} from './advancedRecipes';
import {getAnimationLibraryEntry} from './catalog';
import {EXECUTABLE_ANIMATION_MANIFEST_IDS} from './executableAnimationManifest';
import {EXPERIMENTAL_ANIMATION_RECIPES} from './experimentalRecipes';
import {FINAL_ANIMATION_RECIPES} from './finalRecipes';
import {
  CONTENT_DERIVER_ANIMATION_IDS,
  CONTENT_RENDERABLE_ANIMATION_IDS,
  PRODUCTION_READY_LIBRARY_ANIMATION_IDS,
} from './productionEligibility';
import {NATIVE_CONTENT_BOUND_PROTOTYPE_IDS} from './prototypeContentCoverage';

export type ContentVariantTier = 'experimental' | 'advanced' | 'final';

export type ContentVariantPromotionGate =
  | 'executable-runtime'
  | 'native-mechanism-binding'
  | 'content-render-registration'
  | 'runtime-content-deriver'
  | 'reusable-catalog-status';

export type ContentVariantPromotionCandidate = {
  animationId: string;
  compositionId: string;
  family: string;
  tier: ContentVariantTier;
  mechanism: string;
  title: string;
  executable: boolean;
  productionReady: boolean;
  missingGates: ContentVariantPromotionGate[];
  dominantBindingRequirement: string;
  precisionPolicy: string;
  priorityScore: number;
};

export type ContentVariantFamilyPromotion = {
  family: string;
  candidateCount: number;
  productionReadyCount: number;
  nextCandidate: ContentVariantPromotionCandidate | null;
  candidates: ContentVariantPromotionCandidate[];
};

export type ContentVariantPromotionReport = {
  variantCount: number;
  familyCount: number;
  productionReadyVariantCount: number;
  blockedVariantCount: number;
  tierCounts: Record<ContentVariantTier, number>;
  families: ContentVariantFamilyPromotion[];
  candidates: ContentVariantPromotionCandidate[];
};

const FAMILY_BINDING_REQUIREMENTS: Readonly<Record<string, string>> = {
  tokenization:
    'Use only words/text pieces from spokenText and make the mechanism manipulate those exact pieces; never present schematic chunks as model-exact tokens.',
  'data-transformation':
    'Bind the visible source representation, every meaningful intermediate representation and the final representation to the scene content.',
  'semantic-space':
    'Bind actual concepts, group membership and semantic relations; positions may be illustrative but must preserve the stated relationships.',
  'relationship-network':
    'Bind nodes, edges and any visible weights to named relationships in the scene; do not invent percentages or attention weights.',
  probability:
    'Bind candidates and only grounded probabilities/outcomes; a visible winner requires explicit or mathematically sufficient evidence.',
  'model-processing':
    'Bind the real input, processing stages and visible state changes; generic layer motion alone is not native content binding.',
  generation:
    'Generate visible words exclusively from the actual answer/content and preserve their intended order; never pad with demo words.',
  'risk-contrast':
    'Bind the actual claim, verification checks and evidence state; confidence or certainty numbers require explicit grounding.',
  comparison:
    'Bind the compared entities, criteria and values to the correct entity; do not infer a winner from incomplete measurements.',
  ranking:
    'Bind candidates, criteria and rank-changing evidence; scores/ranks must stay attached to the correct candidate and outcome.',
  'process-flow':
    'Bind real process stages, branches and retry/error routes; the route topology must change when the spoken workflow changes.',
  'input-output':
    'Bind concrete input objects, the visible transformation and the resulting output; changing the scene must change the dominant mechanism objects.',
  'error-detection':
    'Bind actual process states, the grounded error location and repair/result state; do not hardcode the failing step.',
  'retrieval-search':
    'Bind query, source objects, relevance state and grounded evidence count; source placement must not determine relevance.',
  'security-privacy':
    'Bind the actual data, access/privacy rule and resulting protected/redacted state; never invent roles, permissions or sensitive fields.',
  'scale-performance':
    'Bind named paths/services plus stated load/capacity direction; absolute latency/throughput values require explicit measurements.',
  'cost-efficiency':
    'Bind concrete resources/cost drivers and the stated cost direction; absolute currency/token values require explicit measurements.',
  'time-change':
    'Bind actual milestones/versions/dates and stated changes; never fall back to demo years or fabricated chronology.',
  'human-ai-collaboration':
    'Bind real stages, owners and hand-offs; do not infer Mensch/KI responsibility when the speaker did not assign it.',
  'decision-logic':
    'Bind real conditions, branch truth states and decision outcome; hardcoded yes/no gates are not sufficient.',
  'context-window':
    'Bind actual messages/context items, relevance/pinning semantics and grounded capacity when stated; internal slot counts stay illustrative.',
  'learning-update':
    'Bind old/new facts, evidence/confidence and acceptance/rejection state; updates require explicit verification or grounded thresholds.',
};

const FAMILY_PRECISION_POLICIES: Readonly<Record<string, string>> = {
  probability: 'No unspoken percentages or winner.',
  ranking: 'No unspoken scores, rank or winner.',
  comparison: 'No unspoken scores, measurements or winner.',
  'relationship-network': 'No unspoken relationship percentages/weights.',
  'scale-performance': 'No unspoken latency, throughput or capacity measurements.',
  'cost-efficiency': 'No unspoken currency, token cost or saving amount.',
  'learning-update': 'No unspoken confidence, threshold, date or revision number.',
  'context-window': 'No unspoken capacity/count presented as factual.',
  'time-change': 'No fabricated year/version/date.',
};

const DEFAULT_PRECISION_POLICY =
  'Heuristic values may drive motion internally, but must not be displayed as factual scene data.';

const executableIds = new Set(EXECUTABLE_ANIMATION_MANIFEST_IDS);
const contentRenderableIds = new Set(CONTENT_RENDERABLE_ANIMATION_IDS);
const contentDeriverIds = new Set(CONTENT_DERIVER_ANIMATION_IDS);
const productionReadyIds = new Set(PRODUCTION_READY_LIBRARY_ANIMATION_IDS);

const reusableStatus = (status: string | undefined): boolean =>
  status === 'prototype' || status === 'verified';

const scoreCandidate = (animationId: string, tier: ContentVariantTier): number => {
  const entry = getAnimationLibraryEntry(animationId);
  const prior = entry?.qualityPrior;
  const semanticClarity = prior?.semanticClarity ?? 0;
  const productionConfidence = prior?.productionConfidence ?? 0;
  const novelty = prior?.novelty ?? 0;
  const tierBonus = tier === 'final' ? 0.03 : tier === 'advanced' ? 0.015 : 0;
  return Number(
    (
      semanticClarity * 0.5 +
      productionConfidence * 0.35 +
      novelty * 0.15 +
      tierBonus
    ).toFixed(4),
  );
};

const toCandidate = (recipe: {
  animationId: string;
  compositionId: string;
  family: string;
  mechanism: string;
  title: string;
}, tier: ContentVariantTier): ContentVariantPromotionCandidate => {
  const entry = getAnimationLibraryEntry(recipe.animationId);
  const missingGates: ContentVariantPromotionGate[] = [];

  if (!executableIds.has(recipe.animationId)) {
    missingGates.push('executable-runtime');
  }
  if (!NATIVE_CONTENT_BOUND_PROTOTYPE_IDS.has(recipe.animationId)) {
    missingGates.push('native-mechanism-binding');
  }
  if (!contentRenderableIds.has(recipe.animationId)) {
    missingGates.push('content-render-registration');
  }
  if (!contentDeriverIds.has(recipe.animationId)) {
    missingGates.push('runtime-content-deriver');
  }
  if (!reusableStatus(entry?.status)) {
    missingGates.push('reusable-catalog-status');
  }

  return {
    animationId: recipe.animationId,
    compositionId: recipe.compositionId,
    family: recipe.family,
    tier,
    mechanism: recipe.mechanism,
    title: recipe.title,
    executable: executableIds.has(recipe.animationId),
    productionReady: productionReadyIds.has(recipe.animationId),
    missingGates,
    dominantBindingRequirement:
      FAMILY_BINDING_REQUIREMENTS[recipe.family] ??
      'Bind the dominant mechanism objects and state changes directly to spokenText and the meaning contract.',
    precisionPolicy:
      FAMILY_PRECISION_POLICIES[recipe.family] ?? DEFAULT_PRECISION_POLICY,
    priorityScore: scoreCandidate(recipe.animationId, tier),
  };
};

export const CONTENT_VARIANT_PROMOTION_CANDIDATES = Object.freeze([
  ...EXPERIMENTAL_ANIMATION_RECIPES.map((recipe) =>
    toCandidate(recipe, 'experimental'),
  ),
  ...ADVANCED_ANIMATION_RECIPES.map((recipe) => toCandidate(recipe, 'advanced')),
  ...FINAL_ANIMATION_RECIPES.map((recipe) => toCandidate(recipe, 'final')),
].sort(
  (left, right) =>
    right.priorityScore - left.priorityScore ||
    left.animationId.localeCompare(right.animationId),
));

export const createContentVariantPromotionReport = (): ContentVariantPromotionReport => {
  const candidates = [...CONTENT_VARIANT_PROMOTION_CANDIDATES];
  const familyNames = [...new Set(candidates.map((candidate) => candidate.family))].sort();
  const families = familyNames.map((family) => {
    const familyCandidates = candidates
      .filter((candidate) => candidate.family === family)
      .sort(
        (left, right) =>
          right.priorityScore - left.priorityScore ||
          left.animationId.localeCompare(right.animationId),
      );
    return {
      family,
      candidateCount: familyCandidates.length,
      productionReadyCount: familyCandidates.filter(
        (candidate) => candidate.productionReady,
      ).length,
      nextCandidate:
        familyCandidates.find((candidate) => !candidate.productionReady) ?? null,
      candidates: familyCandidates,
    } satisfies ContentVariantFamilyPromotion;
  });

  const tierCounts: Record<ContentVariantTier, number> = {
    experimental: candidates.filter((candidate) => candidate.tier === 'experimental')
      .length,
    advanced: candidates.filter((candidate) => candidate.tier === 'advanced').length,
    final: candidates.filter((candidate) => candidate.tier === 'final').length,
  };

  const productionReadyVariantCount = candidates.filter(
    (candidate) => candidate.productionReady,
  ).length;

  return {
    variantCount: candidates.length,
    familyCount: families.length,
    productionReadyVariantCount,
    blockedVariantCount: candidates.length - productionReadyVariantCount,
    tierCounts,
    families,
    candidates,
  };
};

export const assertContentVariantPromotionInvariants = (): void => {
  const report = createContentVariantPromotionReport();
  if (report.variantCount !== 66) {
    throw new Error(
      `content variant promotion expects 66 variants, found ${report.variantCount}`,
    );
  }
  if (report.familyCount !== 22) {
    throw new Error(
      `content variant promotion expects 22 families, found ${report.familyCount}`,
    );
  }
  if (
    report.tierCounts.experimental !== 22 ||
    report.tierCounts.advanced !== 22 ||
    report.tierCounts.final !== 22
  ) {
    throw new Error(
      `content variant promotion expects 22 variants per tier, found ${JSON.stringify(report.tierCounts)}`,
    );
  }

  for (const family of report.families) {
    if (family.candidateCount !== 3) {
      throw new Error(
        `${family.family} must contain exactly three promotion candidates, found ${family.candidateCount}`,
      );
    }
  }

  for (const candidate of report.candidates) {
    if (candidate.productionReady && candidate.missingGates.length > 0) {
      throw new Error(
        `${candidate.animationId} is production-ready while promotion gates are missing: ${candidate.missingGates.join(', ')}`,
      );
    }
    if (!candidate.productionReady && candidate.missingGates.length === 0) {
      throw new Error(
        `${candidate.animationId} satisfies all promotion gates but is absent from production-ready IDs`,
      );
    }
  }
};
