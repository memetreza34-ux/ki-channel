import {z} from 'zod';
import rawHistory from '../../reels/animation-history.json';
import type {AnimationLibraryEntry, CreativeBrainState} from './schema';
import {creativeBrainStateSchema} from './schema';

const legacyHistorySchema = z.object({
  version: z.literal(1),
  rules: z.object({
    minimumScenesBeforeExactReuse: z.number().int().nonnegative(),
    minimumReelsBeforeExactReuse: z.number().int().nonnegative(),
    forbidConsecutiveLayoutFamily: z.boolean(),
    forbidDuplicateAnimationWithinReel: z.boolean(),
    minimumVisualFamiliesPerReel: z.number().int().positive(),
  }),
  animations: z.array(z.object({
    animationId: z.string().min(3),
    reelId: z.string().min(3),
    sceneId: z.string().min(2),
    visualFamily: z.string().min(2),
    layoutFamily: z.string().min(2),
    motionSignature: z.string().min(3),
    firstUsedAt: z.string().date(),
  })),
});

export const LEGACY_ANIMATION_HISTORY = legacyHistorySchema.parse(rawHistory);

const signatureTokens = (value: string): Set<string> =>
  new Set(
    value
      .toLocaleLowerCase('de-DE')
      .split(/[^a-z0-9äöüß]+/)
      .filter((token) => token.length >= 4),
  );

const tokenSimilarity = (left: string, right: string): number => {
  const leftTokens = signatureTokens(left);
  const rightTokens = signatureTokens(right);
  if (leftTokens.size === 0 || rightTokens.size === 0) return 0;
  let overlap = 0;
  for (const token of leftTokens) {
    if (rightTokens.has(token)) overlap += 1;
  }
  return overlap / Math.max(leftTokens.size, rightTokens.size);
};

const historyNoveltyPenalty = (
  entry: AnimationLibraryEntry,
): number =>
  LEGACY_ANIMATION_HISTORY.animations.reduce((maximumPenalty, used) => {
    if (used.animationId === entry.animationId) return Math.max(maximumPenalty, 60);

    let penalty = 0;
    if (used.visualFamily === entry.visualFamily) penalty += 7;
    if (used.layoutFamily === entry.layoutFamily) penalty += 24;
    if (used.motionSignature === entry.motionSignature) penalty += 34;

    const layoutSimilarity = tokenSimilarity(
      used.layoutFamily,
      entry.layoutFamily,
    );
    const motionSimilarity = tokenSimilarity(
      used.motionSignature,
      entry.motionSignature,
    );
    penalty += layoutSimilarity * 10 + motionSimilarity * 16;
    return Math.max(maximumPenalty, penalty);
  }, 0);

export const createHistoryAwareCreativeBrain = ({
  state,
  entries,
  currentReelIndex,
  now,
}: {
  state: CreativeBrainState;
  entries: readonly AnimationLibraryEntry[];
  currentReelIndex: number;
  now: string;
}): CreativeBrainState => {
  const entryMap = new Map(entries.map((entry) => [entry.animationId, entry]));

  const animationStats = state.animationStats.map((stats) => {
    const entry = entryMap.get(stats.animationId);
    if (!entry) return stats;
    const penalty = historyNoveltyPenalty(entry);
    return {
      ...stats,
      learnedNovelty: Math.max(0, stats.learnedNovelty - penalty),
      cooldownUntilReelIndex:
        penalty >= 60
          ? Math.max(
              stats.cooldownUntilReelIndex,
              currentReelIndex +
                LEGACY_ANIMATION_HISTORY.rules.minimumReelsBeforeExactReuse,
            )
          : stats.cooldownUntilReelIndex,
    };
  });

  const importedUsage = LEGACY_ANIMATION_HISTORY.animations.map((used) => ({
    animationId: used.animationId,
    reelId: used.reelId,
    sceneId: used.sceneId,
    usedAt: `${used.firstUsedAt}T00:00:00.000Z`,
    semanticTags: [used.visualFamily],
    visualFamily: used.visualFamily,
    layoutFamily: used.layoutFamily,
    motionSignature: used.motionSignature,
    result: 'unknown' as const,
  }));

  const usageKey = (usage: {animationId: string; reelId: string; sceneId: string}) =>
    `${usage.animationId}:${usage.reelId}:${usage.sceneId}`;
  const existingKeys = new Set(state.usageHistory.map(usageKey));
  const usageHistory = [
    ...state.usageHistory,
    ...importedUsage.filter((usage) => !existingKeys.has(usageKey(usage))),
  ];

  return creativeBrainStateSchema.parse({
    ...state,
    revision: state.revision + 1,
    updatedAt: now,
    globalRules: {
      ...state.globalRules,
      exactAnimationCooldownReels:
        LEGACY_ANIMATION_HISTORY.rules.minimumReelsBeforeExactReuse,
      exactAnimationCooldownScenes:
        LEGACY_ANIMATION_HISTORY.rules.minimumScenesBeforeExactReuse,
      forbidConsecutiveLayoutFamily:
        LEGACY_ANIMATION_HISTORY.rules.forbidConsecutiveLayoutFamily,
      forbidDuplicateAnimationWithinReel:
        LEGACY_ANIMATION_HISTORY.rules.forbidDuplicateAnimationWithinReel,
      minimumVisualFamiliesPerReel:
        LEGACY_ANIMATION_HISTORY.rules.minimumVisualFamiliesPerReel,
    },
    animationStats,
    usageHistory,
  });
};
