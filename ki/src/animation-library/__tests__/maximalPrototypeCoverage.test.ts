import {describe, expect, it} from 'vitest';
import {ADVANCED_PROTOTYPE_REGISTRY} from '../advancedPrototypeRegistry';
import {getAnimationLibraryEntry} from '../catalog';
import {COMPLETE_PROTOTYPE_REGISTRY} from '../completePrototypeRegistry';
import {EXPERIMENTAL_PROTOTYPE_REGISTRY} from '../experimentalPrototypeRegistry';

describe('maximal prototype coverage', () => {
  const registrations = [
    ...COMPLETE_PROTOTYPE_REGISTRY,
    ...EXPERIMENTAL_PROTOTYPE_REGISTRY,
    ...ADVANCED_PROTOTYPE_REGISTRY,
  ];

  it('contains 66 unique executable compositions', () => {
    expect(registrations).toHaveLength(66);
    expect(new Set(registrations.map((item) => item.compositionId)).size).toBe(66);
    expect(new Set(registrations.map((item) => item.animationId)).size).toBe(66);
  });

  it('contains exactly three executable mechanisms per visual family', () => {
    const counts = new Map<string, number>();
    for (const registration of registrations) {
      const entry = getAnimationLibraryEntry(registration.animationId);
      expect(entry).toBeDefined();
      if (!entry) continue;
      counts.set(entry.visualFamily, (counts.get(entry.visualFamily) ?? 0) + 1);
    }
    expect(counts.size).toBe(22);
    expect([...counts.values()].every((count) => count === 3)).toBe(true);
  });

  it('keeps complete layout and movement signatures unique', () => {
    const signatures = registrations.map((registration) => {
      const entry = getAnimationLibraryEntry(registration.animationId);
      if (!entry) throw new Error(`missing entry ${registration.animationId}`);
      return `${entry.layoutFamily}:${entry.motionSignature}`;
    });
    expect(new Set(signatures).size).toBe(signatures.length);
  });
});
