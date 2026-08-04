import {describe, expect, it} from 'vitest';
import {getAnimationLibraryEntry} from '../catalog';
import {
  COMPLETE_PROTOTYPE_EXPECTED_ARTIFACTS,
  COMPLETE_PROTOTYPE_FAMILIES,
  COMPLETE_PROTOTYPE_REGISTRY,
} from '../completePrototypeRegistry';

describe('complete animation prototype registry', () => {
  it('covers all 22 visual families with executable components', () => {
    expect(COMPLETE_PROTOTYPE_REGISTRY).toHaveLength(22);
    expect(new Set(COMPLETE_PROTOTYPE_FAMILIES).size).toBe(22);
    expect(COMPLETE_PROTOTYPE_FAMILIES).not.toContain('unknown');
  });

  it('uses unique composition, animation, layout, and motion identities', () => {
    const compositionIds = COMPLETE_PROTOTYPE_REGISTRY.map(
      (registration) => registration.compositionId,
    );
    const animationIds = COMPLETE_PROTOTYPE_REGISTRY.map(
      (registration) => registration.animationId,
    );
    const entries = animationIds.map((animationId) => {
      const entry = getAnimationLibraryEntry(animationId);
      expect(entry).toBeDefined();
      return entry!;
    });

    expect(new Set(compositionIds).size).toBe(compositionIds.length);
    expect(new Set(animationIds).size).toBe(animationIds.length);
    expect(new Set(entries.map((entry) => entry.layoutFamily)).size).toBe(22);
    expect(new Set(entries.map((entry) => entry.motionSignature)).size).toBe(22);
  });

  it('keeps a shared mobile render contract and derives 176 artifacts', () => {
    for (const registration of COMPLETE_PROTOTYPE_REGISTRY) {
      expect(registration.durationInFrames).toBe(180);
      expect(registration.fps).toBe(30);
      expect(registration.width).toBe(1080);
      expect(registration.height).toBe(1920);
      expect(registration.checkpoints).toEqual([0, 30, 60, 90, 120, 150, 179]);
      expect(registration.smokeCheckpoints).toEqual([0, 90, 179]);
      expect(registration.component).toBeTypeOf('function');
    }
    expect(COMPLETE_PROTOTYPE_EXPECTED_ARTIFACTS).toBe(176);
  });
});
