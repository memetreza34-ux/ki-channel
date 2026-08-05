import {describe, expect, it} from 'vitest';
import {getAnimationLibraryEntry} from '../catalog';
import {
  ANIMATION_PROTOTYPE_REGISTRY,
  ANIMATION_PROTOTYPE_RENDER_CONFIG,
} from '../prototypes/registry';

describe('animation prototype registry', () => {
  it('registers twenty-two executable prototypes from all twenty-two families', () => {
    expect(ANIMATION_PROTOTYPE_REGISTRY).toHaveLength(22);
    const families = ANIMATION_PROTOTYPE_REGISTRY.map((registration) =>
      getAnimationLibraryEntry(registration.animationId)?.visualFamily,
    );
    expect(new Set(families).size).toBe(22);
    expect(families.every(Boolean)).toBe(true);
  });

  it('keeps every prototype linked to an existing catalog entry', () => {
    for (const registration of ANIMATION_PROTOTYPE_REGISTRY) {
      const entry = getAnimationLibraryEntry(registration.animationId);
      expect(entry).toBeDefined();
      expect(entry?.status).toBe('prototype');
      expect(registration.component).toBeTypeOf('function');
    }
  });

  it('uses a shared 1080x1920, 30fps, 180-frame render contract', () => {
    expect(ANIMATION_PROTOTYPE_RENDER_CONFIG.defaults).toEqual({
      durationInFrames: 180,
      fps: 30,
      width: 1080,
      height: 1920,
      checkpoints: [0, 30, 60, 90, 120, 150, 179],
      smokeCheckpoints: [0, 90, 179],
    });

    for (const registration of ANIMATION_PROTOTYPE_REGISTRY) {
      expect(registration.durationInFrames).toBe(180);
      expect(registration.fps).toBe(30);
      expect(registration.width).toBe(1080);
      expect(registration.height).toBe(1920);
      expect(registration.checkpoints).toEqual([
        0,
        30,
        60,
        90,
        120,
        150,
        179,
      ]);
    }
  });
});
