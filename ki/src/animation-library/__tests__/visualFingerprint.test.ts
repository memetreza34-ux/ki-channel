import {describe, expect, it} from 'vitest';
import type {AnimationLibraryEntry} from '../schema';
import {
  deriveVisualFingerprint,
  findVisualDiversityWarnings,
  VISUAL_SIMILARITY_HARD_LIMIT,
  visualSimilarityScore,
} from '../visualFingerprint';

const makeEntry = (
  overrides: Partial<AnimationLibraryEntry> = {},
): AnimationLibraryEntry => ({
  animationId: 'base-animation-v1',
  version: 1,
  title: 'Base explanation animation',
  description: 'A deterministic semantic explanation animation for testing.',
  status: 'verified',
  visualFamily: 'workflow',
  layoutFamily: 'card-route',
  motionSignature: 'slide-highlight-resolve',
  noveltyGroup: 'workflow-horizontal',
  semanticTags: ['workflow', 'process'],
  explanationPatterns: ['cause-and-effect'],
  avoidWhen: [],
  primitiveTags: ['card', 'panel', 'connector'],
  transitionInTags: ['slide-entry'],
  transitionOutTags: ['result-exit'],
  cameraStyle: 'locked-camera',
  primaryDirection: 'left-to-right',
  energy: 'measured',
  density: 'balanced',
  complexity: 'medium',
  durationSeconds: {min: 4, max: 6},
  qualityPrior: {
    semanticClarity: 85,
    novelty: 75,
    productionConfidence: 80,
  },
  ...overrides,
});

describe('visual fingerprints', () => {
  it('classifies the visible grammar instead of relying on animation id', () => {
    const fingerprint = deriveVisualFingerprint(makeEntry());
    expect(fingerprint.primaryPrimitive).toBe('card');
    expect(fingerprint.cameraMotion).toBe('locked');
    expect(fingerprint.depthStyle).toBe('flat');
    expect(fingerprint.entryMechanism).toBe('slide');
    expect(fingerprint.medium).toBe('remotion-native');
  });

  it('flags different animation ids that still use nearly identical visual grammar', () => {
    const first = makeEntry({animationId: 'cards-a-v1'});
    const second = makeEntry({
      animationId: 'cards-b-v1',
      layoutFamily: 'card-grid',
      motionSignature: 'slide-focus-finish',
    });
    expect(visualSimilarityScore(first, second)).toBeGreaterThanOrEqual(
      VISUAL_SIMILARITY_HARD_LIMIT,
    );
  });

  it('keeps materially different 3D choreography below the hard similarity limit', () => {
    const cards = makeEntry({animationId: 'cards-v1'});
    const spatial = makeEntry({
      animationId: 'spatial-v1',
      title: 'Layered 3D object corridor',
      description: 'A React Three WebGL object moves through a layered depth corridor.',
      visualFamily: 'spatial-metaphor',
      layoutFamily: 'layered-depth-corridor',
      motionSignature: 'assemble-orbit-depth-resolve',
      noveltyGroup: 'three-spatial',
      primitiveTags: ['three-object', 'mesh-object', 'geometry-layer'],
      transitionInTags: ['assemble-entry'],
      cameraStyle: 'gentle-orbit-camera',
      primaryDirection: 'depth-forward',
    });
    expect(visualSimilarityScore(cards, spatial)).toBeLessThan(
      VISUAL_SIMILARITY_HARD_LIMIT,
    );
    expect(deriveVisualFingerprint(spatial).medium).toBe('three');
  });

  it('does not confuse the word three with a Three.js renderer', () => {
    const fluidColumns = makeEntry({
      animationId: 'probability-three-fluid-columns-v1',
      title: 'Three Fluid Columns',
      description: 'Three probability columns rise and fall as values change.',
      layoutFamily: 'three-fluid-columns',
      primitiveTags: ['probability-column', 'value-label', 'selected-token'],
      cameraStyle: 'locked-front-view',
    });
    const fingerprint = deriveVisualFingerprint(fluidColumns);
    expect(fingerprint.medium).toBe('remotion-native');
    expect(fingerprint.depthStyle).not.toBe('three-3d');
    expect(fingerprint.primaryPrimitive).not.toBe('three-object');
  });

  it('warns about repeated primitives, locked camera and flat depth across a run', () => {
    const warnings = findVisualDiversityWarnings([
      makeEntry({animationId: 'one-v1'}),
      makeEntry({
        animationId: 'two-v1',
        layoutFamily: 'card-grid',
        motionSignature: 'fade-slide-focus',
      }),
      makeEntry({
        animationId: 'three-v1',
        layoutFamily: 'card-stack',
        motionSignature: 'scale-slide-focus',
      }),
    ]);
    expect(warnings.some((warning) => warning.includes('primary primitive card'))).toBe(true);
    expect(warnings.some((warning) => warning.includes('locked camera'))).toBe(true);
    expect(warnings.some((warning) => warning.includes('visually flat'))).toBe(true);
  });
});
