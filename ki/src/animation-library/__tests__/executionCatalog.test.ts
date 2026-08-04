import {describe, expect, it} from 'vitest';
import {
  createAnimationExecutionCoverageReport,
  EXECUTABLE_ANIMATION_IDS,
  getAnimationExpansionWave,
  getExecutableAnimationLibraryEntries,
  getRemainingConceptAnimationEntries,
} from '../executionCatalog';

describe('animation execution catalog', () => {
  it('contains 66 executable and 22 remaining catalog entries', () => {
    expect(EXECUTABLE_ANIMATION_IDS).toHaveLength(66);
    expect(getExecutableAnimationLibraryEntries()).toHaveLength(66);
    expect(getRemainingConceptAnimationEntries()).toHaveLength(22);
  });

  it('has exactly three executable variants per family', () => {
    const report = createAnimationExecutionCoverageReport();
    expect(report.catalogCount).toBe(88);
    expect(report.executableCount).toBe(66);
    expect(report.remainingCount).toBe(22);
    expect(report.familyCount).toBe(22);
    expect(report.minimumExecutablePerFamily).toBe(3);
    expect(report.maximumExecutablePerFamily).toBe(3);
    expect(report.completeForTargetTwoPerFamily).toBe(true);
    expect(report.completeForTargetThreePerFamily).toBe(true);
    expect(report.completeForEntireCatalog).toBe(false);
    expect(report.families.every((family) => family.catalogCount === 4)).toBe(true);
    expect(report.families.every((family) => family.remainingCount === 1)).toBe(true);
  });

  it('creates one balanced final wave of 22 animations', () => {
    const report = createAnimationExecutionCoverageReport();
    expect(report.nextWaves).toHaveLength(1);
    expect(report.nextWaves[0].waveIndex).toBe(4);
    expect(report.nextWaves[0].animationIds).toHaveLength(22);
    expect(new Set(report.nextWaves[0].visualFamilies).size).toBe(22);
    expect(report.nextWaves[0].expectedExecutableTotal).toBe(88);
    expect(getAnimationExpansionWave(4)).toEqual(report.nextWaves[0]);
  });
});
