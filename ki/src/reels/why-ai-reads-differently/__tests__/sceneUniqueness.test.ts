import {describe, expect, it} from 'vitest';
import {WHY_AI_SCENES} from '../contract';

const expectUnique = (values: string[]) => {
  expect(new Set(values).size).toBe(values.length);
};

describe('Reel-Abwechslung', () => {
  it('verwendet keine vollständige Animation doppelt', () => {
    expectUnique(WHY_AI_SCENES.map((scene) => scene.animationId));
  });

  it('verwendet acht unterschiedliche visuelle Familien', () => {
    expectUnique(WHY_AI_SCENES.map((scene) => scene.visualFamily));
  });

  it('wiederholt weder Layout noch Bewegungssignatur', () => {
    expectUnique(WHY_AI_SCENES.map((scene) => scene.layoutFamily));
    expectUnique(WHY_AI_SCENES.map((scene) => scene.motionSignature));
  });

  it('setzt nie dieselbe Layoutfamilie direkt hintereinander ein', () => {
    WHY_AI_SCENES.slice(1).forEach((scene, index) => {
      expect(scene.layoutFamily).not.toBe(WHY_AI_SCENES[index].layoutFamily);
    });
  });
});
