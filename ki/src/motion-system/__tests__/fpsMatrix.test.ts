import {describe, expect, it} from 'vitest';
import {MOTION_EXAMPLES} from '../examples';
import {retimeMotionStoryboardFps} from '../fps';
import {motionStoryboardSchema} from '../schema';

describe('FPS-Retiming-Matrix', () => {
  it('hält alle Visualtypen bei 24, 30 und 60 FPS schema-valide', () => {
    for (const storyboard of Object.values(MOTION_EXAMPLES)) {
      for (const fps of [24, 30, 60]) {
        const retimed = retimeMotionStoryboardFps(storyboard, fps);
        expect(() => motionStoryboardSchema.parse(retimed)).not.toThrow();
        expect(retimed.fps).toBe(fps);
        expect(
          retimed.beats.every(
            (beat) => beat.atFrame + beat.durationFrames <= retimed.durationInFrames,
          ),
        ).toBe(true);
      }
    }
  });

  it('bewahrt die Szenendauer in Sekunden innerhalb einer Frame-Toleranz', () => {
    for (const storyboard of Object.values(MOTION_EXAMPLES)) {
      const originalSeconds = storyboard.durationInFrames / storyboard.fps;

      for (const fps of [24, 60]) {
        const retimed = retimeMotionStoryboardFps(storyboard, fps);
        const retimedSeconds = retimed.durationInFrames / retimed.fps;
        expect(Math.abs(retimedSeconds - originalSeconds)).toBeLessThanOrEqual(1 / fps);
      }
    }
  });

  it('bleibt für gleiche Eingaben deterministisch', () => {
    for (const storyboard of Object.values(MOTION_EXAMPLES)) {
      expect(retimeMotionStoryboardFps(storyboard, 60)).toEqual(
        retimeMotionStoryboardFps(storyboard, 60),
      );
    }
  });
});
