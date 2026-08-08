import {describe, expect, it} from 'vitest';
import {
  assertContentVariantPromotionInvariants,
  CONTENT_VARIANT_PROMOTION_CANDIDATES,
  createContentVariantPromotionReport,
} from '../contentVariantPromotion';

describe('content variant promotion', () => {
  it('tracks exactly 66 non-core variants across 22 families and three tiers', () => {
    const report = createContentVariantPromotionReport();

    expect(report.variantCount).toBe(66);
    expect(report.familyCount).toBe(22);
    expect(report.tierCounts).toEqual({
      experimental: 22,
      advanced: 22,
      final: 22,
    });
    expect(report.families.every((family) => family.candidateCount === 3)).toBe(true);
    expect(() => assertContentVariantPromotionInvariants()).not.toThrow();
  });

  it('keeps the current 66 variants blocked until their dominant mechanisms are actually content-bound', () => {
    const report = createContentVariantPromotionReport();

    expect(report.productionReadyVariantCount).toBe(0);
    expect(report.blockedVariantCount).toBe(66);

    for (const candidate of report.candidates) {
      expect(candidate.executable).toBe(true);
      expect(candidate.productionReady).toBe(false);
      expect(candidate.missingGates).toContain('native-mechanism-binding');
      expect(candidate.missingGates).toContain('content-render-registration');
      expect(candidate.missingGates).toContain('runtime-content-deriver');
      expect(candidate.dominantBindingRequirement.length).toBeGreaterThan(40);
      expect(candidate.precisionPolicy.length).toBeGreaterThan(20);
    }
  });

  it('provides exactly one deterministic next candidate per family', () => {
    const report = createContentVariantPromotionReport();

    for (const family of report.families) {
      expect(family.nextCandidate).not.toBeNull();
      expect(family.nextCandidate?.family).toBe(family.family);
      const bestScore = Math.max(
        ...family.candidates.map((candidate) => candidate.priorityScore),
      );
      expect(family.nextCandidate?.priorityScore).toBe(bestScore);
    }
  });

  it('keeps precision-sensitive families explicit about fake-number prevention', () => {
    const sensitiveFamilies = new Set([
      'probability',
      'ranking',
      'comparison',
      'relationship-network',
      'scale-performance',
      'cost-efficiency',
      'learning-update',
      'context-window',
      'time-change',
    ]);

    for (const candidate of CONTENT_VARIANT_PROMOTION_CANDIDATES) {
      if (!sensitiveFamilies.has(candidate.family)) continue;
      expect(candidate.precisionPolicy).toMatch(/No |unspoken|fabricated/i);
    }
  });

  it('requires the transformation portal to bind input, transformation and output objects', () => {
    const portal = CONTENT_VARIANT_PROMOTION_CANDIDATES.find(
      (candidate) =>
        candidate.animationId === 'input-output-transformation-portal-v1',
    );

    expect(portal).toBeDefined();
    expect(portal?.dominantBindingRequirement).toContain('input objects');
    expect(portal?.dominantBindingRequirement).toContain('visible transformation');
    expect(portal?.dominantBindingRequirement).toContain('resulting output');
  });
});
