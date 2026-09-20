import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe, expect, it} from 'vitest';
import {
  HALLUCINATION_SCENES,
  buildHallucinationSceneRuntime,
} from '../ReelHallucinations';
import {
  HALLUCINATION_VISUAL_DIVERSITY,
  HALLUCINATION_VISUAL_MANIFEST,
  assertHallucinationVisualDiversity,
} from '../visualProfiles';

const source = readFileSync(
  resolve('ki/src/reels/ai-hallucinations/ReelHallucinations.tsx'),
  'utf8',
);

describe('AI hallucinations canonical production runtime', () => {
  it('routes every scene through a registered library runtime with grounded content', () => {
    for (const scene of HALLUCINATION_SCENES) {
      const runtime = buildHallucinationSceneRuntime(scene);
      expect(runtime.source).toBe('library');
      expect(runtime.animationId).toBe(scene.animationId);
      expect(runtime.registration.animationId).toBe(scene.animationId);
      expect(runtime.renderProps.content?.spokenText).toBe(scene.spokenText);
      expect(runtime.renderProps.content?.labels?.shellIcon).toBe(
        scene.visualLabels.shellIcon,
      );
    }
  });

  it('enforces authored visual diversity from the same production animation ids', () => {
    expect(HALLUCINATION_VISUAL_MANIFEST).toHaveLength(HALLUCINATION_SCENES.length);
    expect(HALLUCINATION_VISUAL_MANIFEST.map((scene) => scene.visualId)).toEqual(
      HALLUCINATION_SCENES.map((scene) => scene.animationId),
    );
    expect(() => assertHallucinationVisualDiversity()).not.toThrow();
    expect(HALLUCINATION_VISUAL_DIVERSITY.passed).toBe(true);
    expect(HALLUCINATION_VISUAL_DIVERSITY.uniquePrimitiveCount).toBeGreaterThanOrEqual(3);
  });

  it('does not rebuild the prototype derivation pipeline inside the reel', () => {
    expect(source).toContain('buildLibraryAnimationRuntime');
    expect(source).not.toContain('derivePrototypeRuntimeContent');
    expect(source).not.toContain('sanitizePrototypeRuntimeContent');
    expect(source).not.toContain('associatePrototypeRuntimeContent');
    expect(source).not.toContain('ANIMATION_PROTOTYPE_REGISTRY');
  });
});
