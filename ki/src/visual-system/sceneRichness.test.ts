import {describe, expect, it} from 'vitest';
import {assertSceneRichness, type SceneRichnessEntry} from './sceneRichness';

const makeScene = (overrides: Partial<SceneRichnessEntry> = {}): SceneRichnessEntry => ({
  sceneId: 'scene-1',
  heroObjects: 1,
  supportElements: 4,
  brandAnchors: 1,
  meaningfulStateChanges: 3,
  microBeats: 3,
  depthLayers: 2,
  cameraMotion: 'push',
  visualMechanisms: ['hero-object', 'path-flow'],
  intentionalWhitespace: false,
  ...overrides,
});

describe('scene richness contract', () => {
  it('accepts a visually rich branded reel', () => {
    expect(() =>
      assertSceneRichness(
        [
          makeScene({sceneId: 'scene-1'}),
          makeScene({sceneId: 'scene-2', cameraMotion: 'parallax', brandAnchors: 1}),
          makeScene({sceneId: 'scene-3', cameraMotion: 'locked', depthLayers: 1, brandAnchors: 0}),
        ],
        {requireBrandAnchorInHook: true, minBrandCoverageRatio: 0.6},
      ),
    ).not.toThrow();
  });

  it('rejects a powerpoint-like flat scene', () => {
    expect(() =>
      assertSceneRichness([
        makeScene({
          supportElements: 2,
          meaningfulStateChanges: 2,
          depthLayers: 0,
          cameraMotion: 'locked',
        }),
      ]),
    ).toThrow(/too flat/);
  });

  it('rejects a branded hook without a visible brand anchor', () => {
    expect(() =>
      assertSceneRichness([makeScene({brandAnchors: 0})], {requireBrandAnchorInHook: true}),
    ).toThrow(/hook scene requires/);
  });
});
