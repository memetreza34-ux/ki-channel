import {describe, expect, it} from 'vitest';
import {MOTION_EXAMPLES} from '../examples';
import {motionStoryboardSchema, motionVisualTypeSchema} from '../schema';

const toCompositionId = (type: string) =>
  `Motion-${type}`.replace(/(^|-)([a-z])/g, (_, prefix: string, letter: string) => `${prefix}${letter.toUpperCase()}`);

describe('Motion-System-Preview', () => {
  it('erzeugt eindeutige und gültige Composition-IDs', () => {
    const ids = motionVisualTypeSchema.options.map(toCompositionId);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^[A-Za-z0-9-]+$/);
      expect(id.startsWith('Motion-')).toBe(true);
    }
  });

  it('alle Preview-Storyboards sind 9:16-tauglich und innerhalb der Grenzen', () => {
    for (const storyboard of Object.values(MOTION_EXAMPLES)) {
      expect(() => motionStoryboardSchema.parse(storyboard)).not.toThrow();
      expect(storyboard.durationInFrames).toBeGreaterThanOrEqual(30);
      expect(storyboard.durationInFrames).toBeLessThanOrEqual(900);
      expect(storyboard.fps).toBeGreaterThanOrEqual(24);
      expect(storyboard.fps).toBeLessThanOrEqual(60);
      expect(storyboard.sentence.length).toBeLessThanOrEqual(140);
    }
  });

  it('jeder Visualtyp besitzt sichtbare Labels und mindestens zwei Elemente', () => {
    for (const storyboard of Object.values(MOTION_EXAMPLES)) {
      expect(storyboard.elements.length).toBeGreaterThanOrEqual(2);
      expect(storyboard.labels.length).toBeGreaterThan(0);
      expect(storyboard.elements.every((element) => element.label.trim().length > 0)).toBe(true);
    }
  });
});
