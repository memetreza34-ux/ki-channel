import type {AnimationLibraryEntry} from './schema';
import type {AnimationPrototypeRegistration} from './prototypes/registry';

export type PrototypeFamilyCoverage = {
  visualFamily: string;
  catalogEntryCount: number;
  catalogPrototypeIds: string[];
  executablePrototypeIds: string[];
  covered: boolean;
};

export type PrototypeCoverageReport = {
  familyCount: number;
  coveredFamilyCount: number;
  uncoveredFamilyCount: number;
  executablePrototypeCount: number;
  duplicateExecutableFamilies: string[];
  unknownExecutableAnimationIds: string[];
  families: PrototypeFamilyCoverage[];
  passed: boolean;
};

export const buildPrototypeCoverageReport = ({
  entries,
  registrations,
}: {
  entries: readonly AnimationLibraryEntry[];
  registrations: readonly Pick<
    AnimationPrototypeRegistration,
    'animationId'
  >[];
}): PrototypeCoverageReport => {
  const entryById = new Map(entries.map((entry) => [entry.animationId, entry]));
  const families = [...new Set(entries.map((entry) => entry.visualFamily))].sort();
  const registrationsByFamily = new Map<string, string[]>();
  const unknownExecutableAnimationIds: string[] = [];

  for (const registration of registrations) {
    const entry = entryById.get(registration.animationId);
    if (!entry) {
      unknownExecutableAnimationIds.push(registration.animationId);
      continue;
    }
    registrationsByFamily.set(entry.visualFamily, [
      ...(registrationsByFamily.get(entry.visualFamily) ?? []),
      registration.animationId,
    ]);
  }

  const familyCoverage = families.map((visualFamily) => {
    const familyEntries = entries.filter(
      (entry) => entry.visualFamily === visualFamily,
    );
    const executablePrototypeIds = [
      ...(registrationsByFamily.get(visualFamily) ?? []),
    ].sort();
    return {
      visualFamily,
      catalogEntryCount: familyEntries.length,
      catalogPrototypeIds: familyEntries
        .filter((entry) => entry.status === 'prototype')
        .map((entry) => entry.animationId)
        .sort(),
      executablePrototypeIds,
      covered: executablePrototypeIds.length > 0,
    };
  });

  const duplicateExecutableFamilies = familyCoverage
    .filter((coverage) => coverage.executablePrototypeIds.length > 1)
    .map((coverage) => coverage.visualFamily);
  const coveredFamilyCount = familyCoverage.filter(
    (coverage) => coverage.covered,
  ).length;

  return {
    familyCount: familyCoverage.length,
    coveredFamilyCount,
    uncoveredFamilyCount: familyCoverage.length - coveredFamilyCount,
    executablePrototypeCount: registrations.length,
    duplicateExecutableFamilies,
    unknownExecutableAnimationIds: unknownExecutableAnimationIds.sort(),
    families: familyCoverage,
    passed:
      familyCoverage.length > 0 &&
      coveredFamilyCount === familyCoverage.length &&
      duplicateExecutableFamilies.length === 0 &&
      unknownExecutableAnimationIds.length === 0,
  };
};
