import {describe, expect, it} from 'vitest';
import {
  assertAuthoredVisualDiversity,
  evaluateAuthoredVisualDiversity,
  type AuthoredVisualScene,
} from '../authoredProductionGate';

const scene = (
  sceneId: string,
  overrides: Partial<AuthoredVisualScene['fingerprint']>,
): AuthoredVisualScene => ({
  sceneId,
  visualId: `${sceneId}-visual-v1`,
  fingerprint: {
    primaryPrimitive: 'object',
    cameraMotion: 'push',
    depthStyle: 'layered-2d',
    entryMechanism: 'assemble',
    medium: 'remotion-native',
    direction: 'left-to-right',
    visualFamily: `${sceneId}-family`,
    layoutFamily: `${sceneId}-layout`,
    motionSignature: `${sceneId}-motion`,
    ...overrides,
  },
});

describe('authored production diversity gate', () => {
  it('passes a materially varied authored reel', () => {
    const scenes = [
      scene('one', {primaryPrimitive: 'object', cameraMotion: 'push'}),
      scene('two', {primaryPrimitive: 'nodes', cameraMotion: 'orbit', entryMechanism: 'draw', direction: 'center-out'}),
      scene('three', {primaryPrimitive: 'path', cameraMotion: 'pan', entryMechanism: 'draw'}),
      scene('four', {primaryPrimitive: 'typography', cameraMotion: 'pull', entryMechanism: 'morph', direction: 'bottom-to-top'}),
      scene('five', {primaryPrimitive: 'illustration', cameraMotion: 'parallax', depthStyle: 'pseudo-3d', entryMechanism: 'depth', direction: 'depth-forward'}),
    ];
    const result = evaluateAuthoredVisualDiversity(scenes);
    expect(result.passed).toBe(true);
    expect(result.uniquePrimitiveCount).toBe(5);
    expect(() => assertAuthoredVisualDiversity(scenes)).not.toThrow();
  });

  it('blocks different visual IDs that are still nearly identical', () => {
    const scenes = [
      scene('one', {visualFamily: 'workflow', layoutFamily: 'cards-a', motionSignature: 'slide-a'}),
      scene('two', {visualFamily: 'workflow', layoutFamily: 'cards-b', motionSignature: 'slide-b'}),
    ];
    const result = evaluateAuthoredVisualDiversity(scenes);
    expect(result.passed).toBe(false);
    expect(result.issues.some((issue) => issue.code === 'authored-consecutive-visual-fingerprint')).toBe(true);
  });

  it('blocks card dominance even when card layouts have different names', () => {
    const scenes = [
      scene('one', {primaryPrimitive: 'card', layoutFamily: 'card-left', motionSignature: 'fade-left'}),
      scene('two', {primaryPrimitive: 'card', layoutFamily: 'card-grid', motionSignature: 'scale-grid', cameraMotion: 'pan'}),
      scene('three', {primaryPrimitive: 'card', layoutFamily: 'card-stack', motionSignature: 'draw-stack', cameraMotion: 'orbit'}),
      scene('four', {primaryPrimitive: 'nodes', layoutFamily: 'node-field', motionSignature: 'node-bloom'}),
      scene('five', {primaryPrimitive: 'path', layoutFamily: 'path-field', motionSignature: 'path-trace'}),
    ];
    const result = evaluateAuthoredVisualDiversity(scenes);
    expect(result.passed).toBe(false);
    expect(result.issues.some((issue) => issue.code === 'authored-card-dominance')).toBe(true);
  });
});
