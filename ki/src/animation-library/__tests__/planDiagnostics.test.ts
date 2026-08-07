import {describe, expect, it} from 'vitest';
import {ANIMATION_LIBRARY_ENTRIES} from '../catalog';
import {EXECUTABLE_ANIMATION_IDS} from '../executionCatalog';
import {diagnoseRawReelAnimationPlan} from '../planDiagnostics';
import {NATIVE_CONTENT_BOUND_PROTOTYPE_IDS} from '../prototypeContentCoverage';
import type {RawReelAnimationPlan} from '../reelPlanningPipeline';

const makePlan = (
  decisions: RawReelAnimationPlan['decisionSummary'],
): RawReelAnimationPlan =>
  ({
    reelId: 'diagnostic-reel',
    reelIndex: 12,
    analyses: [],
    productionPlan: {},
    decisionSummary: decisions,
  }) as unknown as RawReelAnimationPlan;

describe('reel plan diagnostics', () => {
  it('accepts a diverse four-scene plan with unique animations', () => {
    const result = diagnoseRawReelAnimationPlan(
      makePlan([
        {sceneId: 's1', primaryFamily: 'tokenization', selectedAnimationId: 'tokenization-magnetic-phrase-slicer-v1', source: 'library', familyScore: 80, selectionScore: 86, mustBeNew: false},
        {sceneId: 's2', primaryFamily: 'data-transformation', selectedAnimationId: 'data-transformation-vector-prism-converter-v1', source: 'library', familyScore: 82, selectionScore: 84, mustBeNew: false},
        {sceneId: 's3', primaryFamily: 'semantic-space', selectedAnimationId: 'semantic-space-meaning-terrain-v1', source: 'library', familyScore: 88, selectionScore: 89, mustBeNew: false},
        {sceneId: 's4', primaryFamily: 'relationship-network', selectedAnimationId: 'relationship-network-dependency-bridge-builder-v1', source: 'library', familyScore: 86, selectionScore: 87, mustBeNew: false},
      ]),
    );

    expect(result.passed).toBe(true);
    expect(result.uniqueAnimationCount).toBe(4);
    expect(result.uniqueFamilyCount).toBe(4);
    expect(result.diagnostics).toEqual([]);
  });

  it('blocks executable shell-only animations that are not production-ready', () => {
    const shellOnlyEntry = ANIMATION_LIBRARY_ENTRIES.find(
      (entry) =>
        EXECUTABLE_ANIMATION_IDS.includes(entry.animationId) &&
        !NATIVE_CONTENT_BOUND_PROTOTYPE_IDS.has(entry.animationId),
    );
    expect(shellOnlyEntry).toBeDefined();

    const result = diagnoseRawReelAnimationPlan(
      makePlan([
        {
          sceneId: 'shell-only',
          primaryFamily: shellOnlyEntry!.visualFamily,
          selectedAnimationId: shellOnlyEntry!.animationId,
          source: 'library',
          familyScore: 99,
          selectionScore: 99,
          mustBeNew: false,
        },
      ]),
    );

    expect(result.passed).toBe(false);
    expect(result.diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'non-production-ready-library-selection',
          severity: 'blocker',
          sceneIds: ['shell-only'],
        }),
      ]),
    );
  });

  it('blocks duplicate animations and ignored new-build requirements', () => {
    const repeated = 'tokenization-magnetic-phrase-slicer-v1';
    const result = diagnoseRawReelAnimationPlan(
      makePlan([
        {sceneId: 's1', primaryFamily: 'tokenization', selectedAnimationId: repeated, source: 'library', familyScore: 80, selectionScore: 85, mustBeNew: false},
        {sceneId: 's2', primaryFamily: 'tokenization', selectedAnimationId: repeated, source: 'library', familyScore: 80, selectionScore: 62, mustBeNew: true},
      ]),
    );

    expect(result.passed).toBe(false);
    expect(result.diagnostics.map((item) => item.code)).toEqual(
      expect.arrayContaining([
        'duplicate-animation',
        'consecutive-layout-family',
        'consecutive-motion-signature',
        'weak-library-selection',
        'new-build-requirement-ignored',
      ]),
    );
  });

  it('warns when almost the whole reel requires new builds', () => {
    const result = diagnoseRawReelAnimationPlan(
      makePlan([
        {sceneId: 's1', primaryFamily: 'tokenization', selectedAnimationId: 'new-a', source: 'new-build', familyScore: 5, selectionScore: null, mustBeNew: true},
        {sceneId: 's2', primaryFamily: 'probability', selectedAnimationId: 'new-b', source: 'new-build', familyScore: 5, selectionScore: null, mustBeNew: true},
        {sceneId: 's3', primaryFamily: 'generation', selectedAnimationId: 'new-c', source: 'new-build', familyScore: 5, selectionScore: null, mustBeNew: true},
        {sceneId: 's4', primaryFamily: 'risk-contrast', selectedAnimationId: 'new-d', source: 'new-build', familyScore: 5, selectionScore: null, mustBeNew: true},
      ]),
    );

    expect(result.newBuildRatio).toBe(1);
    expect(result.diagnostics.some((item) => item.code === 'excessive-new-build-ratio')).toBe(true);
  });
});
