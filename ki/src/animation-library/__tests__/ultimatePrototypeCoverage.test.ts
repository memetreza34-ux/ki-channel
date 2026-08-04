import {describe, expect, it} from 'vitest';
import {ADVANCED_PROTOTYPE_REGISTRY} from '../advancedPrototypeRegistry';
import {ANIMATION_LIBRARY_ENTRIES, getAnimationLibraryEntry} from '../catalog';
import {COMPLETE_PROTOTYPE_REGISTRY} from '../completePrototypeRegistry';
import {EXPERIMENTAL_PROTOTYPE_REGISTRY} from '../experimentalPrototypeRegistry';
import {FINAL_PROTOTYPE_REGISTRY} from '../finalPrototypeRegistry';

describe('ultimate prototype coverage', () => {
  const registrations = [
    ...COMPLETE_PROTOTYPE_REGISTRY,
    ...EXPERIMENTAL_PROTOTYPE_REGISTRY,
    ...ADVANCED_PROTOTYPE_REGISTRY,
    ...FINAL_PROTOTYPE_REGISTRY,
  ];

  it('contains one unique executable composition for every catalog entry', () => {
    expect(ANIMATION_LIBRARY_ENTRIES).toHaveLength(88);
    expect(registrations).toHaveLength(88);
    expect(new Set(registrations.map((item) => item.compositionId)).size).toBe(88);
    expect(new Set(registrations.map((item) => item.animationId)).size).toBe(88);
    expect(new Set(registrations.map((item) => item.animationId))).toEqual(
      new Set(ANIMATION_LIBRARY_ENTRIES.map((entry) => entry.animationId)),
    );
  });

  it('contains exactly four executable mechanisms per visual family', () => {
    const counts = new Map<string, number>();
    for (const registration of registrations) {
      const entry = getAnimationLibraryEntry(registration.animationId);
      expect(entry).toBeDefined();
      if (!entry) continue;
      counts.set(entry.visualFamily, (counts.get(entry.visualFamily) ?? 0) + 1);
    }
    expect(counts.size).toBe(22);
    expect([...counts.values()].every((count) => count === 4)).toBe(true);
  });

  it('keeps every full layout and movement signature unique', () => {
    const signatures = registrations.map((registration) => {
      const entry = getAnimationLibraryEntry(registration.animationId);
      if (!entry) throw new Error(`missing entry ${registration.animationId}`);
      return `${entry.layoutFamily}:${entry.motionSignature}`;
    });
    expect(new Set(signatures).size).toBe(88);
  });
});
