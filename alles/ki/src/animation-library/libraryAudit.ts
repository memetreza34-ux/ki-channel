import type {AnimationLibraryEntry} from './schema';

export type AnimationLibraryAuditIssue = {
  severity: 'warning' | 'error';
  code:
    | 'duplicate-animation-id'
    | 'duplicate-layout-motion-signature'
    | 'family-underfilled'
    | 'family-overfilled'
    | 'missing-prototype-family'
    | 'weak-semantic-tags'
    | 'weak-transition-contract'
    | 'card-layout-concentration'
    | 'low-production-confidence';
  message: string;
  animationId?: string;
  visualFamily?: string;
};

export type AnimationLibraryAudit = {
  entryCount: number;
  familyCount: number;
  prototypeCount: number;
  prototypeFamilyCount: number;
  familySizes: Record<string, number>;
  layoutFamilyCount: number;
  motionSignatureCount: number;
  semanticTagCount: number;
  issues: AnimationLibraryAuditIssue[];
  passed: boolean;
};

const isCardPrimary = (entry: AnimationLibraryEntry): boolean =>
  entry.layoutFamily.includes('card') ||
  entry.primitiveTags.filter((tag) => tag.includes('card')).length >= 2;

export const auditAnimationLibrary = ({
  entries,
  expectedVariantsPerFamily = 4,
  requirePrototypePerFamily = false,
  minimumProductionConfidenceForPrototype = 55,
}: {
  entries: readonly AnimationLibraryEntry[];
  expectedVariantsPerFamily?: number;
  requirePrototypePerFamily?: boolean;
  minimumProductionConfidenceForPrototype?: number;
}): AnimationLibraryAudit => {
  const issues: AnimationLibraryAuditIssue[] = [];
  const ids = new Set<string>();
  const signatureKeys = new Set<string>();
  const familySizes: Record<string, number> = {};
  const familyEntries = new Map<string, AnimationLibraryEntry[]>();
  const semanticTags = new Set<string>();

  for (const entry of entries) {
    familySizes[entry.visualFamily] = (familySizes[entry.visualFamily] ?? 0) + 1;
    familyEntries.set(entry.visualFamily, [
      ...(familyEntries.get(entry.visualFamily) ?? []),
      entry,
    ]);
    entry.semanticTags.forEach((tag) => semanticTags.add(tag));

    if (ids.has(entry.animationId)) {
      issues.push({
        severity: 'error',
        code: 'duplicate-animation-id',
        animationId: entry.animationId,
        message: `Animation ID ${entry.animationId} is duplicated.`,
      });
    }
    ids.add(entry.animationId);

    const signatureKey = `${entry.layoutFamily}:${entry.motionSignature}`;
    if (signatureKeys.has(signatureKey)) {
      issues.push({
        severity: 'error',
        code: 'duplicate-layout-motion-signature',
        animationId: entry.animationId,
        message: `Layout and motion signature ${signatureKey} is duplicated.`,
      });
    }
    signatureKeys.add(signatureKey);

    if (new Set(entry.semanticTags).size < 4) {
      issues.push({
        severity: 'warning',
        code: 'weak-semantic-tags',
        animationId: entry.animationId,
        visualFamily: entry.visualFamily,
        message: `${entry.animationId} has fewer than four distinct semantic tags.`,
      });
    }

    if (
      entry.transitionInTags.length < 1 ||
      entry.transitionOutTags.length < 1
    ) {
      issues.push({
        severity: 'error',
        code: 'weak-transition-contract',
        animationId: entry.animationId,
        visualFamily: entry.visualFamily,
        message: `${entry.animationId} lacks an incoming or outgoing transition contract.`,
      });
    }

    if (
      entry.status === 'prototype' &&
      entry.qualityPrior.productionConfidence <
        minimumProductionConfidenceForPrototype
    ) {
      issues.push({
        severity: 'warning',
        code: 'low-production-confidence',
        animationId: entry.animationId,
        visualFamily: entry.visualFamily,
        message: `${entry.animationId} is marked as prototype with production confidence ${entry.qualityPrior.productionConfidence}.`,
      });
    }
  }

  for (const [family, familyGroup] of familyEntries) {
    if (familyGroup.length < expectedVariantsPerFamily) {
      issues.push({
        severity: 'error',
        code: 'family-underfilled',
        visualFamily: family,
        message: `${family} has ${familyGroup.length}/${expectedVariantsPerFamily} expected variants.`,
      });
    }
    if (familyGroup.length > expectedVariantsPerFamily) {
      issues.push({
        severity: 'warning',
        code: 'family-overfilled',
        visualFamily: family,
        message: `${family} has ${familyGroup.length} variants and may dominate selection probability.`,
      });
    }
    if (
      requirePrototypePerFamily &&
      !familyGroup.some((entry) => entry.status === 'prototype')
    ) {
      issues.push({
        severity: 'warning',
        code: 'missing-prototype-family',
        visualFamily: family,
        message: `${family} has no executable prototype yet.`,
      });
    }

    const cardRatio =
      familyGroup.filter(isCardPrimary).length / familyGroup.length;
    if (cardRatio > 0.5) {
      issues.push({
        severity: 'warning',
        code: 'card-layout-concentration',
        visualFamily: family,
        message: `${family} uses card-primary layouts in ${Math.round(cardRatio * 100)}% of its variants.`,
      });
    }
  }

  const prototypeEntries = entries.filter((entry) => entry.status === 'prototype');
  const audit: AnimationLibraryAudit = {
    entryCount: entries.length,
    familyCount: familyEntries.size,
    prototypeCount: prototypeEntries.length,
    prototypeFamilyCount: new Set(
      prototypeEntries.map((entry) => entry.visualFamily),
    ).size,
    familySizes,
    layoutFamilyCount: new Set(entries.map((entry) => entry.layoutFamily)).size,
    motionSignatureCount: new Set(
      entries.map((entry) => entry.motionSignature),
    ).size,
    semanticTagCount: semanticTags.size,
    issues,
    passed: !issues.some((issue) => issue.severity === 'error'),
  };
  return audit;
};
