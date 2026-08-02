import {describe, expect, it} from 'vitest';
import {alignStoryboardToWords} from '../audioSync';
import {MOTION_EXAMPLES} from '../examples';
import {inspectMotionStoryboardQuality} from '../quality';
import {motionStoryboardSchema} from '../schema';

describe('Audio-Sync-Matrix', () => {
  it('synchronisiert alle zehn Visualtypen schema-valide', () => {
    for (const storyboard of Object.values(MOTION_EXAMPLES)) {
      const words = storyboard.elements.map((element, index) => ({
        text: element.label,
        startMs: index * 700,
        endMs: index * 700 + 220,
      }));
      const aligned = alignStoryboardToWords(storyboard, words);

      expect(() => motionStoryboardSchema.parse(aligned)).not.toThrow();
      expect(
        aligned.beats.every(
          (beat) => beat.atFrame + beat.durationFrames <= aligned.durationInFrames,
        ),
      ).toBe(true);
    }
  });

  it('erzeugt bei vollständigen Element-Timestamps keine zusammengefallenen Aktionen', () => {
    for (const storyboard of Object.values(MOTION_EXAMPLES)) {
      const words = storyboard.elements.map((element, index) => ({
        text: element.label,
        startMs: index * 800,
        endMs: index * 800 + 240,
      }));
      const aligned = alignStoryboardToWords(storyboard, words);
      const report = inspectMotionStoryboardQuality(aligned);

      expect(
        report.issues.filter((issue) => issue.code === 'collapsed-beat-timing'),
      ).toEqual([]);
    }
  });

  it('bleibt für identische Eingaben deterministisch', () => {
    for (const storyboard of Object.values(MOTION_EXAMPLES)) {
      const words = storyboard.elements.map((element, index) => ({
        text: element.label,
        startMs: index * 500,
        endMs: index * 500 + 180,
      }));

      expect(alignStoryboardToWords(storyboard, words)).toEqual(
        alignStoryboardToWords(storyboard, words),
      );
    }
  });
});
