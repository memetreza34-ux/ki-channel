import {describe, expect, it} from 'vitest';
import {
  createAnimationExecutionCoverageReport,
  EXECUTABLE_ANIMATION_IDS,
  getAnimationExpansionWave,
  getExecutableAnimationLibraryEntries,
  getRemainingConceptAnimationEntries,
} from '../executionCatalog';

describe('animation execution catalog', () => {
  it('contains 44 executable and 44 remaining catalog entries', () => {
    expect(EXECUTABLE_ANIMATION_IDS).toHaveLength(44);
    expect(getExecutableAnimationLibraryEntries()).toHaveLength(44);
    expect(getRemainingConceptAnimationEntries()).toHaveLength(44);
  });

  it('has exactly two executable variants per family', () => {
    const report = createAnimationExecutionCoverageReport();
    expect(report.catalogCount).toBe(88);
    expect(report.executableCount).toBe(44);
    expect(report.remainingCount).toBe(44);
    expect(report.familyCount).toBe(22);
    expect(report.minimumExecutablePerFamily).toBe(2);
    expect(report.maximumExecutablePerFamily).toBe(2);
    expect(report.completeForTargetTwoPerFamily).toBe(true);
    expect(report.completeForEntireCatalog).toBe(false);
    expect(report.families.every((family) => family.catalogCount === 4)).toBe(true);
    expect(report.families.every((family) => family.remainingCount === 2)).toBe(true);
  });

  it('creates two balanced future waves of 22 animations', () => {
    const report = createAnimationExecutionCoverageReport();
    expect(report.nextWaves).toHaveLength(2);
    expect(report.nextWaves[0].waveIndex).toBe(3);
    expect(report.nextWaves[0].animationIds).toHaveLength(22);
    expect(new Set(report.nextWaves[0].visualFamilies).size).toBe(22);
    expect(report.nextWaves[0].expectedExecutableTotal).toBe(66);
    expect(report.nextWaves[1].waveIndex).toBe(4);
    expect(report.nextWaves[1].animationIds).toHaveLength(22);
    expect(new Set(report.nextWaves[1].visualFamilies).size).toBe(22);
    expect(report.nextWaves[1].expectedExecutableTotal).toBe(88);
    expect(getAnimationExpansionWave(3)).toEqual(report.nextWaves[0]);
  });
});
