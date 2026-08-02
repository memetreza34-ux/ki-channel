import {describe, expect, it} from 'vitest';
import {MOTION_TIMELINE_COMPOSITION_ID} from '../compositionIds';
import {MOTION_EXAMPLES} from '../examples';
import {MOTION_PREVIEW_TYPES, toMotionCompositionId} from '../MotionPreviewRoot';
import {motionStoryboardSchema, motionVisualTypeSchema} from '../schema';
import {MOTION_TIMELINE_EXAMPLE} from '../timelineExamples';

describe('Motion-System-Preview', () => {
  it('registriert exakt alle Visualtypen', () => {
    expect([...MOTION_PREVIEW_TYPES].sort()).toEqual([...motionVisualTypeSchema.options].sort());
  });

  it('erzeugt eindeutige und gültige Composition-IDs', () => {
    const ids = MOTION_PREVIEW_TYPES.map(toMotionCompositionId);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^[A-Za-z0-9-]+$/);
      expect(id.startsWith('Motion-')).toBe(true);
    }

    expect(MOTION_TIMELINE_COMPOSITION_ID).toMatch(/^[A-Za-z0-9-]+$/);
    expect(ids).not.toContain(MOTION_TIMELINE_COMPOSITION_ID);
  });

  it('alle Preview-Storyboards sind valide und innerhalb der Grenzen', () => {
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

  it('die Timeline-Demo enthält mehrere valide, chronologisch geplante Szenen', () => {
    expect(MOTION_TIMELINE_EXAMPLE.scenes.length).toBeGreaterThanOrEqual(4);
    expect(MOTION_TIMELINE_EXAMPLE.passed).toBe(true);
    expect(MOTION_TIMELINE_EXAMPLE.totalDurationInFrames).toBeGreaterThan(150);

    for (const [index, scene] of MOTION_TIMELINE_EXAMPLE.scenes.entries()) {
      expect(() => motionStoryboardSchema.parse(scene.storyboard)).not.toThrow();
      expect(scene.startFrame).toBeLessThan(scene.endFrameExclusive);
      if (index > 0) {
        expect(scene.startFrame).toBeGreaterThanOrEqual(
          MOTION_TIMELINE_EXAMPLE.scenes[index - 1].endFrameExclusive,
        );
      }
    }
  });
});
