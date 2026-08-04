import {ANIMATION_LIBRARY_ENTRIES} from './catalog';
import {COMPLETE_PROTOTYPE_REGISTRY} from './completePrototypeRegistry';
import {EXPERIMENTAL_PROTOTYPE_REGISTRY} from './experimentalPrototypeRegistry';
import type {AnimationLibraryEntry} from './schema';

export type ExecutableFamilyCoverage = {
  visualFamily: string;
  catalogCount: number;
  executableCount: number;
  remainingCount: number;
  executableAnimationIds: string[];
  remainingAnimationIds: string[];
};

export type AnimationExpansionWave = {
  waveIndex: number;
  animationIds: string[];
  visualFamilies: string[];
  expectedExecutableTotal: number;
};

export type AnimationExecutionCoverageReport = {
  catalogCount: number;
  executableCount: number;
  remainingCount: number;
  familyCount: number;
  minimumExecutablePerFamily: number;
  maximumExecutablePerFamily: number;
  completeForTargetTwoPerFamily: boolean;
  completeForEntireCatalog: boolean;
  families: ExecutableFamilyCoverage[];
  nextWaves: AnimationExpansionWave[];
};

const executableIds = new Set([
  ...COMPLETE_PROTOTYPE_REGISTRY.map((item) => item.animationId),
  ...EXPERIMENTAL_PROTOTYPE_REGISTRY.map((item) => item.animationId),
]);

export const EXECUTABLE_ANIMATION_IDS = Object.freeze(
  [...executableIds].sort(),
);

export const getExecutableAnimationLibraryEntries = (): AnimationLibraryEntry[] =>
  ANIMATION_LIBRARY_ENTRIES.filter((entry) => executableIds.has(entry.animationId));

export const getRemainingConceptAnimationEntries = (): AnimationLibraryEntry[] =>
  ANIMATION_LIBRARY_ENTRIES.filter((entry) => !executableIds.has(entry.animationId));

const byPriority = (
  left: AnimationLibraryEntry,
  right: AnimationLibraryEntry,
): number => {
  const leftScore =
    left.qualityPrior.semanticClarity * 0.5 +
    left.qualityPrior.novelty * 0.35 +
    left.qualityPrior.productionConfidence * 0.15;
  const rightScore =
    right.qualityPrior.semanticClarity * 0.5 +
    right.qualityPrior.novelty * 0.35 +
    right.qualityPrior.productionConfidence * 0.15;
  return rightScore - leftScore || left.animationId.localeCompare(right.animationId);
};

const buildExpansionWaves = (
  remainingByFamily: Map<string, AnimationLibraryEntry[]>,
  executableCount: number,
): AnimationExpansionWave[] => {
  const familyNames = [...remainingByFamily.keys()].sort();
  const maximumDepth = Math.max(
    0,
    ...familyNames.map((family) => remainingByFamily.get(family)?.length ?? 0),
  );
  const waves: AnimationExpansionWave[] = [];
  let total = executableCount;

  for (let depth = 0; depth < maximumDepth; depth += 1) {
    const entries = familyNames
      .map((family) => remainingByFamily.get(family)?.[depth])
      .filter((entry): entry is AnimationLibraryEntry => Boolean(entry));
    if (entries.length === 0) continue;
    total += entries.length;
    waves.push({
      waveIndex: depth + 3,
      animationIds: entries.map((entry) => entry.animationId),
      visualFamilies: entries.map((entry) => entry.visualFamily),
      expectedExecutableTotal: total,
    });
  }

  return waves;
};

export const createAnimationExecutionCoverageReport = (): AnimationExecutionCoverageReport => {
  const entriesByFamily = new Map<string, AnimationLibraryEntry[]>();
  for (const entry of ANIMATION_LIBRARY_ENTRIES) {
    const values = entriesByFamily.get(entry.visualFamily) ?? [];
    values.push(entry);
    entriesByFamily.set(entry.visualFamily, values);
  }

  const families = [...entriesByFamily.entries()]
    .map(([visualFamily, entries]) => {
      const executable = entries
        .filter((entry) => executableIds.has(entry.animationId))
        .sort(byPriority);
      const remaining = entries
        .filter((entry) => !executableIds.has(entry.animationId))
        .sort(byPriority);
      return {
        visualFamily,
        catalogCount: entries.length,
        executableCount: executable.length,
        remainingCount: remaining.length,
        executableAnimationIds: executable.map((entry) => entry.animationId),
        remainingAnimationIds: remaining.map((entry) => entry.animationId),
      } satisfies ExecutableFamilyCoverage;
    })
    .sort((left, right) => left.visualFamily.localeCompare(right.visualFamily));

  const remainingByFamily = new Map<string, AnimationLibraryEntry[]>();
  for (const family of families) {
    remainingByFamily.set(
      family.visualFamily,
      family.remainingAnimationIds
        .map((animationId) =>
          ANIMATION_LIBRARY_ENTRIES.find((entry) => entry.animationId === animationId),
        )
        .filter((entry): entry is AnimationLibraryEntry => Boolean(entry)),
    );
  }

  const executableCounts = families.map((family) => family.executableCount);
  const executableCount = EXECUTABLE_ANIMATION_IDS.length;
  return {
    catalogCount: ANIMATION_LIBRARY_ENTRIES.length,
    executableCount,
    remainingCount: ANIMATION_LIBRARY_ENTRIES.length - executableCount,
    familyCount: families.length,
    minimumExecutablePerFamily: Math.min(...executableCounts),
    maximumExecutablePerFamily: Math.max(...executableCounts),
    completeForTargetTwoPerFamily: families.every(
      (family) => family.executableCount >= 2,
    ),
    completeForEntireCatalog: families.every(
      (family) => family.remainingCount === 0,
    ),
    families,
    nextWaves: buildExpansionWaves(remainingByFamily, executableCount),
  };
};

export const getAnimationExpansionWave = (
  waveIndex: number,
): AnimationExpansionWave => {
  if (!Number.isInteger(waveIndex) || waveIndex < 3) {
    throw new Error('animation expansion waveIndex must be an integer of at least 3');
  }
  const wave = createAnimationExecutionCoverageReport().nextWaves.find(
    (candidate) => candidate.waveIndex === waveIndex,
  );
  if (!wave) throw new Error(`animation expansion wave ${waveIndex} does not exist`);
  return wave;
};
