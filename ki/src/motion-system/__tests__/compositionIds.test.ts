import {describe, expect, it} from 'vitest';
import {
  isValidMotionCompositionId,
  MOTION_TIMELINE_COMPOSITION_ID,
  toMotionCompositionId,
} from '../compositionIds';
import {motionVisualTypeSchema} from '../schema';

describe('Motion-Composition-IDs', () => {
  it('erzeugt für alle Visualtypen eindeutige gültige IDs', () => {
    const ids = motionVisualTypeSchema.options.map(toMotionCompositionId);

    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every(isValidMotionCompositionId)).toBe(true);
  });

  it('hält die Timeline-ID außerhalb der Visualtyp-IDs', () => {
    const visualIds = motionVisualTypeSchema.options.map(toMotionCompositionId);

    expect(isValidMotionCompositionId(MOTION_TIMELINE_COMPOSITION_ID)).toBe(true);
    expect(visualIds).not.toContain(MOTION_TIMELINE_COMPOSITION_ID);
  });

  it('weist unsichere oder fremde IDs zurück', () => {
    expect(isValidMotionCompositionId('Motion-Input-Output')).toBe(true);
    expect(isValidMotionCompositionId('Input-Output')).toBe(false);
    expect(isValidMotionCompositionId('Motion Input Output')).toBe(false);
    expect(isValidMotionCompositionId('Motion-Input_Output')).toBe(false);
  });
});
