import {describe, expect, it} from 'vitest';
import {ANIMATION_LIBRARY_ENTRIES} from '../catalog';
import {auditAnimationLibrary} from '../libraryAudit';

describe('animation library audit', () => {
  it('confirms the 88-entry, 22-family catalog structure', () => {
    const audit = auditAnimationLibrary({
      entries: ANIMATION_LIBRARY_ENTRIES,
      expectedVariantsPerFamily: 4,
    });

    expect(audit.entryCount).toBe(88);
    expect(audit.familyCount).toBe(22);
    expect(audit.layoutFamilyCount).toBe(88);
    expect(audit.motionSignatureCount).toBe(88);
    expect(audit.passed).toBe(true);
    expect(
      audit.issues.filter((issue) => issue.code === 'family-underfilled'),
    ).toHaveLength(0);
  });

  it('detects duplicate IDs and underfilled families', () => {
    const entry = ANIMATION_LIBRARY_ENTRIES[0];
    const audit = auditAnimationLibrary({
      entries: [entry, entry],
      expectedVariantsPerFamily: 4,
    });

    expect(audit.passed).toBe(false);
    expect(audit.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({code: 'duplicate-animation-id'}),
        expect.objectContaining({code: 'duplicate-layout-motion-signature'}),
        expect.objectContaining({code: 'family-underfilled'}),
      ]),
    );
  });

  it('sieht inzwischen fuer jede Familie einen Prototypen', () => {
    const audit = auditAnimationLibrary({
      entries: ANIMATION_LIBRARY_ENTRIES,
      expectedVariantsPerFamily: 4,
      requirePrototypePerFamily: true,
    });

    expect(audit.prototypeFamilyCount).toBe(audit.familyCount);
    expect(
      audit.issues.some((issue) => issue.code === 'missing-prototype-family'),
    ).toBe(false);
  });

  it('meldet eine Familie ohne Prototyp, sobald es eine gibt', () => {
    // Der echte Katalog hat die Luecke geschlossen. Geprueft wird deshalb der
    // Melder selbst, an einer Familie, deren Eintraege alle 'concept' sind.
    const withoutPrototype = ANIMATION_LIBRARY_ENTRIES.map((entry) =>
      entry.visualFamily === ANIMATION_LIBRARY_ENTRIES[0].visualFamily
        ? {...entry, status: 'concept' as const}
        : entry,
    );
    const audit = auditAnimationLibrary({
      entries: withoutPrototype,
      expectedVariantsPerFamily: 4,
      requirePrototypePerFamily: true,
    });

    expect(audit.prototypeFamilyCount).toBe(audit.familyCount - 1);
    expect(
      audit.issues.some((issue) => issue.code === 'missing-prototype-family'),
    ).toBe(true);
  });
});
