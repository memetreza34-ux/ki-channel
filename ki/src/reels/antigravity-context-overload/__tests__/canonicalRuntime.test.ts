import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe, expect, it} from 'vitest';
import {CONTEXT_OVERLOAD_SCENES} from '../contract';
import {buildContextOverloadSceneRuntime} from '../runtime';
import {
  CONTEXT_OVERLOAD_VISUAL_DIVERSITY,
  CONTEXT_OVERLOAD_VISUAL_MANIFEST,
} from '../visualProfiles';

const runtimeSource = readFileSync(
  resolve('ki/src/reels/antigravity-context-overload/runtime.ts'),
  'utf8',
);

describe('context overload canonical production runtime', () => {
  it('routes all authored scenes through the canonical library runtime', () => {
    for (const scene of CONTEXT_OVERLOAD_SCENES) {
      const runtime = buildContextOverloadSceneRuntime(scene);
      expect(runtime.source).toBe('library');
      expect(runtime.sceneId).toBe(scene.sceneId);
      expect(runtime.animationId).toBe(scene.animationId);
      expect(runtime.registration.animationId).toBe(scene.animationId);
      expect(runtime.renderProps.content?.spokenText).toBe(scene.spokenText);
    }
  });

  it('keeps the authored visual manifest aligned and diverse', () => {
    expect(CONTEXT_OVERLOAD_VISUAL_MANIFEST.map((profile) => profile.sceneId)).toEqual(
      CONTEXT_OVERLOAD_SCENES.map((scene) => scene.sceneId),
    );
    expect(CONTEXT_OVERLOAD_VISUAL_DIVERSITY.passed).toBe(true);
    expect(CONTEXT_OVERLOAD_VISUAL_DIVERSITY.uniquePrimitiveCount).toBeGreaterThanOrEqual(3);
  });

  it('does not rebuild prototype derivation locally', () => {
    expect(runtimeSource).toContain('buildLibraryAnimationRuntime');
    expect(runtimeSource).not.toContain('derivePrototypeRuntimeContent');
    expect(runtimeSource).not.toContain('sanitizePrototypeRuntimeContent');
    expect(runtimeSource).not.toContain('associatePrototypeRuntimeContent');
    expect(runtimeSource).not.toContain('ANIMATION_PROTOTYPE_REGISTRY');
  });
});
