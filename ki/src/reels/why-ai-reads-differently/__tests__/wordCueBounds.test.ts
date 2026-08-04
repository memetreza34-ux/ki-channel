import {describe, expect, it} from 'vitest';
import {SCENE_TITLES, SUBTITLE_CUES, WHY_AI_SCENES} from '../contract';

describe('Überschriften und Untertitel-Choreografie', () => {
  it('besitzt für jede Szene eine Überschrift und Wort-Cues', () => {
    WHY_AI_SCENES.forEach((scene) => {
      expect(SCENE_TITLES[scene.sceneId].trim().length).toBeGreaterThan(0);
      expect(SUBTITLE_CUES[scene.sceneId].length).toBeGreaterThan(0);
    });
  });

  it('hält alle Wort-Cues innerhalb ihrer Szene und sortiert sie', () => {
    WHY_AI_SCENES.forEach((scene) => {
      const cues = SUBTITLE_CUES[scene.sceneId];
      cues.forEach((cue, index) => {
        expect(cue.atFrame).toBeGreaterThanOrEqual(0);
        expect(cue.atFrame).toBeLessThan(scene.durationInFrames);
        if (index > 0) {
          expect(cue.atFrame).toBeGreaterThanOrEqual(cues[index - 1].atFrame);
        }
      });
    });
  });

  it('hebt in jeder Szene mindestens ein wichtiges Wort hervor', () => {
    WHY_AI_SCENES.forEach((scene) => {
      expect(
        SUBTITLE_CUES[scene.sceneId].some((cue) => cue.accent || cue.danger),
      ).toBe(true);
    });
  });
});
