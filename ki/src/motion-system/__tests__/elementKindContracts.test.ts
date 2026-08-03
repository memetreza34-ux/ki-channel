import {describe, expect, it} from 'vitest';
import {MOTION_EXAMPLES} from '../examples';
import {
  MOTION_ELEMENT_KIND_CONTRACTS,
  motionStoryboardSchema,
  motionVisualTypeSchema,
} from '../schema';

describe('Semantische Element-Kind-Verträge', () => {
  it('definiert Verträge für alle zehn Visualtypen', () => {
    expect(Object.keys(MOTION_ELEMENT_KIND_CONTRACTS).sort()).toEqual(
      [...motionVisualTypeSchema.options].sort(),
    );
  });

  it('alle Standardbeispiele erfüllen ihre Kind-Verträge', () => {
    for (const storyboard of Object.values(MOTION_EXAMPLES)) {
      expect(motionStoryboardSchema.safeParse(storyboard).success).toBe(true);
    }
  });

  it('lehnt einen KI-Core mit falschem Elementtyp ab', () => {
    const storyboard = MOTION_EXAMPLES['error-path'];
    const invalid = {
      ...storyboard,
      elements: storyboard.elements.map((element) =>
        element.id === 'ai' ? {...element, kind: 'card' as const} : element,
      ),
    };
    const result = motionStoryboardSchema.safeParse(invalid);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some(
          (issue) => issue.message.includes('Element ai') && issue.message.includes('ai-core'),
        ),
      ).toBe(true);
    }
  });

  it('lehnt falsche Vergleichs- und Ranking-Metriken ab', () => {
    const comparison = MOTION_EXAMPLES.comparison;
    expect(
      motionStoryboardSchema.safeParse({
        ...comparison,
        elements: comparison.elements.map((element) =>
          element.id === 'metric' ? {...element, kind: 'label' as const} : element,
        ),
      }).success,
    ).toBe(false);

    const ranking = MOTION_EXAMPLES.ranking;
    const result = motionStoryboardSchema.safeParse({
      ...ranking,
      elements: ranking.elements.map((element, index) =>
        index === 2 ? {...element, kind: 'card' as const} : element,
      ),
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((issue) =>
          issue.message.includes('Ranking darf nur Metrik-Elemente enthalten'),
        ),
      ).toBe(true);
    }
  });

  it('erlaubt nur node oder result für dynamische Prozessschritte', () => {
    const storyboard = MOTION_EXAMPLES['process-chain'];
    const valid = {
      ...storyboard,
      elements: storyboard.elements.map((element) =>
        element.id === 'step-3' ? {...element, kind: 'result' as const} : element,
      ),
    };
    expect(motionStoryboardSchema.safeParse(valid).success).toBe(true);

    const invalid = {
      ...storyboard,
      elements: storyboard.elements.map((element) =>
        element.id === 'step-3' ? {...element, kind: 'card' as const} : element,
      ),
    };
    expect(motionStoryboardSchema.safeParse(invalid).success).toBe(false);
  });

  it('erlaubt dokument- und datenbasierte Eingaben für Input-Output', () => {
    const storyboard = MOTION_EXAMPLES['input-output'];
    for (const kind of ['card', 'document', 'database'] as const) {
      const adjusted = {
        ...storyboard,
        elements: storyboard.elements.map((element) =>
          element.id === 'input' ? {...element, kind} : element,
        ),
      };
      expect(motionStoryboardSchema.safeParse(adjusted).success).toBe(true);
    }
  });
});
