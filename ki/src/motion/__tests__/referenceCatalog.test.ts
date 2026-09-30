import {describe, expect, it} from 'vitest';
import {MOTION_REFERENCE_SOURCES, searchMotionReferences} from '../referenceCatalog';

describe('motion reference catalog', () => {
  it('keeps unique ids and repositories', () => {
    expect(new Set(MOTION_REFERENCE_SOURCES.map((source) => source.id)).size).toBe(MOTION_REFERENCE_SOURCES.length);
    expect(new Set(MOTION_REFERENCE_SOURCES.map((source) => source.repository)).size).toBe(MOTION_REFERENCE_SOURCES.length);
  });

  it('requires explicit license verification for every curated third-party source', () => {
    const thirdParty = MOTION_REFERENCE_SOURCES.filter((source) => source.usageMode !== 'official-reference');
    expect(thirdParty.length).toBeGreaterThanOrEqual(8);
    for (const source of thirdParty) {
      expect(source.licenseVerified).toBe(true);
      expect(source.license).toBe('MIT');
    }
  });

  it('does not allow inspiration-only sources to become runtime dependencies', () => {
    const inspirationOnly = MOTION_REFERENCE_SOURCES.filter((source) => source.usageMode === 'inspiration-only');
    expect(inspirationOnly.map((source) => source.id)).toEqual(expect.arrayContaining(['animefx', 'motion-canvas']));
    for (const source of inspirationOnly) {
      expect(source.runtimePolicy).toBe('reference-only-do-not-install');
    }
  });

  it('routes common animation intents to useful references', () => {
    expect(searchMotionReferences('terminal prompt').map((source) => source.id)).toEqual(
      expect.arrayContaining(['onda', 'snapcn']),
    );
    expect(searchMotionReferences('bar chart counter').map((source) => source.id)).toContain('rve-templates');
    expect(searchMotionReferences('shader distortion').map((source) => source.id)).toContain('animefx');
  });

  it('returns no references for an empty query', () => {
    expect(searchMotionReferences('   ')).toEqual([]);
  });
});
