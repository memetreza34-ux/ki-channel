import {describe, expect, it} from 'vitest';
import {
  createAnimationExecutionCoverageReport,
  EXECUTABLE_ANIMATION_IDS,
  getAnimationExpansionWave,
  getExecutableAnimationLibraryEntries,
  getRemainingConceptAnimationEntries,
} from '../executionCatalog';

describe('animation execution catalog', () => {
  it('contains all 88 catalog entries as executable animations', () => {
    expect(EXECUTABLE_ANIMATION_IDS).toHaveLength(88);
    expect(getExecutableAnimationLibraryEntries()).toHaveLength(88);
    expect(getRemainingConceptAnimationEntries()).toHaveLength(0);
  });

  it('has exactly four executable variants per family', () => {
    const report = createAnimationExecutionCoverageReport();
    expect(report.catalogCount).toBe(88);
    expect(report.executableCount).toBe(88);
    expect(report.remainingCount).toBe(0);
    expect(report.familyCount).toBe(22);
    expect(report.minimumExecutablePerFamily).toBe(4);
    expect(report.maximumExecutablePerFamily).toBe(4);
    expect(report.completeForTargetTwoPerFamily).toBe(true);
    expect(report.completeForTargetThreePerFamily).toBe(true);
    expect(report.completeForTargetFourPerFamily).toBe(true);
    expect(report.completeForEntireCatalog).toBe(true);
    expect(report.families.every((family) => family.catalogCount === 4)).toBe(true);
    expect(report.families.every((family) => family.remainingCount === 0)).toBe(true);
  });

  it('has no unfinished expansion wave', () => {
    const report = createAnimationExecutionCoverageReport();
    expect(report.nextWaves).toEqual([]);
    expect(() => getAnimationExpansionWave(5)).toThrow(
      'animation expansion wave 5 does not exist',
    );
  });
});
