import {describe, expect, it} from 'vitest';
import {ANIMATION_LIBRARY_ENTRIES} from '../catalog';
import {buildPrototypeCoverageReport} from '../prototypeCoverage';
import {ANIMATION_PROTOTYPE_REGISTRY} from '../prototypes/registry';

describe('executable prototype coverage', () => {
  it('covers all twenty-two catalog families exactly once', () => {
    const report = buildPrototypeCoverageReport({
      entries: ANIMATION_LIBRARY_ENTRIES,
      registrations: ANIMATION_PROTOTYPE_REGISTRY,
    });

    expect(report.familyCount).toBe(22);
    expect(report.coveredFamilyCount).toBe(22);
    expect(report.uncoveredFamilyCount).toBe(0);
    expect(report.executablePrototypeCount).toBe(22);
    expect(report.duplicateExecutableFamilies).toEqual([]);
    expect(report.unknownExecutableAnimationIds).toEqual([]);
    expect(report.passed).toBe(true);
  });

  it('reports missing and duplicate family registrations', () => {
    const registration = ANIMATION_PROTOTYPE_REGISTRY[0];
    const report = buildPrototypeCoverageReport({
      entries: ANIMATION_LIBRARY_ENTRIES,
      registrations: [registration, registration],
    });

    expect(report.passed).toBe(false);
    expect(report.coveredFamilyCount).toBe(1);
    expect(report.uncoveredFamilyCount).toBe(21);
    expect(report.duplicateExecutableFamilies).toHaveLength(1);
  });

  it('reports executable IDs that are absent from the catalog', () => {
    const report = buildPrototypeCoverageReport({
      entries: ANIMATION_LIBRARY_ENTRIES,
      registrations: [{animationId: 'unknown-animation-v1'}],
    });

    expect(report.passed).toBe(false);
    expect(report.unknownExecutableAnimationIds).toEqual([
      'unknown-animation-v1',
    ]);
  });
});
