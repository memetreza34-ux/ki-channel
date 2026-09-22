import {describe, expect, it} from 'vitest';
import {
  TOKEN_SLICER_COMPOSITION_ID,
  TOKEN_SLICER_DURATION_IN_FRAMES,
  TOKEN_SLICER_FPS,
  TOKEN_SLICER_HEIGHT,
  TOKEN_SLICER_WIDTH,
} from './ReelTokenSlicer';
import {
  TOKEN_SLICER_VISUAL_DIVERSITY,
  TOKEN_SLICER_VISUAL_MANIFEST,
} from './visualProfiles';

describe('TokenSlicerReel production contract', () => {
  it('uses the canonical short-form format', () => {
    expect(TOKEN_SLICER_COMPOSITION_ID).toBe('TokenSlicerReel');
    expect(TOKEN_SLICER_FPS).toBe(30);
    expect(TOKEN_SLICER_WIDTH).toBe(1080);
    expect(TOKEN_SLICER_HEIGHT).toBe(1920);
    expect(TOKEN_SLICER_DURATION_IN_FRAMES).toBe(1260);
  });

  it('passes authored visual diversity without card dominance', () => {
    expect(TOKEN_SLICER_VISUAL_MANIFEST).toHaveLength(8);
    expect(TOKEN_SLICER_VISUAL_DIVERSITY.passed).toBe(true);
    expect(TOKEN_SLICER_VISUAL_DIVERSITY.uniquePrimitiveCount).toBeGreaterThanOrEqual(3);
    expect(TOKEN_SLICER_VISUAL_MANIFEST.filter((scene) => scene.fingerprint.primaryPrimitive === 'card')).toHaveLength(0);
  });
});
