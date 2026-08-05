import type {
  AnimationLibraryEntry,
  AnimationUsageRecord,
  CreativeBrainState,
} from './schema';

export type RotationConcentration = {
  key: string;
  count: number;
  share: number;
  severity: 'info' | 'warning' | 'blocker';
};

export type AnimationRotationReport = {
  currentReelIndex: number;
  recentUsageLimit: number;
  analyzedUsageCount: number;
  uniqueAnimationCount: number;
  uniqueVisualFamilyCount: number;
  uniqueLayoutFamilyCount: number;
  blockedAnimationIds: string[];
  unusedAnimationIds: string[];
  recommendedAnimationIds: string[];
  priorityVisualFamilies: string[];
  animationConcentration: RotationConcentration[];
  familyConcentration: RotationConcentration[];
  layoutConcentration: RotationConcentration[];
  motionConcentration: RotationConcentration[];
  healthy: boolean;
  warnings: string[];
};

type UsageShape = {
  animationId: string;
  visualFamily: string;
  layoutFamily: string;
  motionSignature: string;
};

const increment = (map: Map<string, number>, key: string): void => {
  map.set(key, (map.get(key) ?? 0) + 1);
};

const toConcentrations = ({
  counts,
  total,
  warningShare,
  blockerShare,
}: {
  counts: Map<string, number>;
  total: number;
  warningShare: number;
  blockerShare: number;
}): RotationConcentration[] =>
  [...counts.entries()]
    .map(([key, count]) => {
      const share = total === 0 ? 0 : count / total;
      const severity: RotationConcentration['severity'] =
        count >= 3 && share >= blockerShare
          ? 'blocker'
          : count >= 2 && share >= warningShare
            ? 'warning'
            : 'info';
      return {key, count, share, severity};
    })
    .sort((left, right) =>
      right.count - left.count || left.key.localeCompare(right.key),
    );

const resolveUsage = ({
  usage,
  entryById,
}: {
  usage: AnimationUsageRecord;
  entryById: Map<string, AnimationLibraryEntry>;
}): UsageShape | null => {
  const entry = entryById.get(usage.animationId);
  const visualFamily = usage.visualFamily ?? entry?.visualFamily;
  const layoutFamily = usage.layoutFamily ?? entry?.layoutFamily;
  const motionSignature = usage.motionSignature ?? entry?.motionSignature;
  if (!visualFamily || !layoutFamily || !motionSignature) return null;
  return {
    animationId: usage.animationId,
    visualFamily,
    layoutFamily,
    motionSignature,
  };
};

export const createAnimationRotationReport = ({
  entries,
  brain,
  currentReelIndex,
  recentUsageLimit = 40,
  recommendationLimit = 12,
}: {
  entries: readonly AnimationLibraryEntry[];
  brain: CreativeBrainState;
  currentReelIndex: number;
  recentUsageLimit?: number;
  recommendationLimit?: number;
}): AnimationRotationReport => {
  if (!Number.isInteger(currentReelIndex) || currentReelIndex < 0) {
    throw new Error('rotation report currentReelIndex must be non-negative');
  }
  if (!Number.isInteger(recentUsageLimit) || recentUsageLimit < 1 || recentUsageLimit > 500) {
    throw new Error('rotation report recentUsageLimit must be between 1 and 500');
  }
  if (!Number.isInteger(recommendationLimit) || recommendationLimit < 1 || recommendationLimit > 100) {
    throw new Error('rotation report recommendationLimit must be between 1 and 100');
  }

  const entryById = new Map(entries.map((entry) => [entry.animationId, entry]));
  const recentUsage = [...brain.usageHistory]
    .sort((left, right) => Date.parse(right.usedAt) - Date.parse(left.usedAt))
    .slice(0, recentUsageLimit)
    .map((usage) => resolveUsage({usage, entryById}))
    .filter((usage): usage is UsageShape => usage !== null);

  const animationCounts = new Map<string, number>();
  const familyCounts = new Map<string, number>();
  const layoutCounts = new Map<string, number>();
  const motionCounts = new Map<string, number>();
  for (const usage of recentUsage) {
    increment(animationCounts, usage.animationId);
    increment(familyCounts, usage.visualFamily);
    increment(layoutCounts, usage.layoutFamily);
    increment(motionCounts, usage.motionSignature);
  }

  const total = recentUsage.length;
  const animationConcentration = toConcentrations({
    counts: animationCounts,
    total,
    warningShare: 0.2,
    blockerShare: 0.34,
  });
  const familyConcentration = toConcentrations({
    counts: familyCounts,
    total,
    warningShare: 0.28,
    blockerShare: 0.45,
  });
  const layoutConcentration = toConcentrations({
    counts: layoutCounts,
    total,
    warningShare: 0.22,
    blockerShare: 0.38,
  });
  const motionConcentration = toConcentrations({
    counts: motionCounts,
    total,
    warningShare: 0.22,
    blockerShare: 0.38,
  });

  const statsById = new Map(
    brain.animationStats.map((stats) => [stats.animationId, stats]),
  );
  const blockedAnimationIds = entries
    .filter((entry) => {
      const stats = statsById.get(entry.animationId);
      return Boolean(
        entry.status === 'retired' ||
        (stats && stats.cooldownUntilReelIndex > currentReelIndex),
      );
    })
    .map((entry) => entry.animationId)
    .sort();
  const blocked = new Set(blockedAnimationIds);
  const unusedAnimationIds = entries
    .filter((entry) => (statsById.get(entry.animationId)?.usageCount ?? 0) === 0)
    .map((entry) => entry.animationId)
    .sort();

  const recommendedAnimationIds = entries
    .filter((entry) => entry.status !== 'retired' && !blocked.has(entry.animationId))
    .sort((left, right) => {
      const leftStats = statsById.get(left.animationId);
      const rightStats = statsById.get(right.animationId);
      const usageDifference =
        (leftStats?.usageCount ?? 0) - (rightStats?.usageCount ?? 0);
      if (usageDifference !== 0) return usageDifference;
      const clarityDifference =
        (rightStats?.learnedSemanticClarity ?? right.qualityPrior.semanticClarity) -
        (leftStats?.learnedSemanticClarity ?? left.qualityPrior.semanticClarity);
      if (clarityDifference !== 0) return clarityDifference;
      return left.animationId.localeCompare(right.animationId);
    })
    .slice(0, recommendationLimit)
    .map((entry) => entry.animationId);

  const allFamilies = [...new Set(entries.map((entry) => entry.visualFamily))];
  const priorityVisualFamilies = allFamilies
    .sort((left, right) =>
      (familyCounts.get(left) ?? 0) - (familyCounts.get(right) ?? 0) ||
      left.localeCompare(right),
    )
    .slice(0, Math.min(8, allFamilies.length));

  const warnings: string[] = [];
  for (const concentration of animationConcentration) {
    if (concentration.severity !== 'info') {
      warnings.push(
        `animation ${concentration.key} accounts for ${Math.round(concentration.share * 100)}% of recent usage`,
      );
    }
  }
  for (const concentration of familyConcentration) {
    if (concentration.severity !== 'info') {
      warnings.push(
        `visual family ${concentration.key} accounts for ${Math.round(concentration.share * 100)}% of recent usage`,
      );
    }
  }
  for (const concentration of layoutConcentration) {
    if (concentration.severity !== 'info') {
      warnings.push(
        `layout family ${concentration.key} accounts for ${Math.round(concentration.share * 100)}% of recent usage`,
      );
    }
  }
  for (const concentration of motionConcentration) {
    if (concentration.severity !== 'info') {
      warnings.push(
        `motion signature ${concentration.key} accounts for ${Math.round(concentration.share * 100)}% of recent usage`,
      );
    }
  }

  const allConcentrations = [
    ...animationConcentration,
    ...familyConcentration,
    ...layoutConcentration,
    ...motionConcentration,
  ];

  return {
    currentReelIndex,
    recentUsageLimit,
    analyzedUsageCount: total,
    uniqueAnimationCount: animationCounts.size,
    uniqueVisualFamilyCount: familyCounts.size,
    uniqueLayoutFamilyCount: layoutCounts.size,
    blockedAnimationIds,
    unusedAnimationIds,
    recommendedAnimationIds,
    priorityVisualFamilies,
    animationConcentration,
    familyConcentration,
    layoutConcentration,
    motionConcentration,
    healthy: !allConcentrations.some(
      (concentration) => concentration.severity === 'blocker',
    ),
    warnings: [...new Set(warnings)],
  };
};
