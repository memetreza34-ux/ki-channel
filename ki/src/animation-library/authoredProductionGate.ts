import {
  VISUAL_SIMILARITY_HARD_LIMIT,
  VISUAL_SIMILARITY_SOFT_LIMIT,
  visualFingerprintSimilarityScore,
  type VisualFingerprint,
} from './visualFingerprint';

export type AuthoredVisualScene = {
  sceneId: string;
  visualId: string;
  fingerprint: VisualFingerprint;
};

export type AuthoredVisualGateIssue = {
  code: string;
  severity: 'warning' | 'blocker';
  sceneIds: string[];
  message: string;
};

export type AuthoredVisualGateResult = {
  passed: boolean;
  uniquePrimitiveCount: number;
  uniqueLayoutCount: number;
  uniqueMotionCount: number;
  issues: AuthoredVisualGateIssue[];
};

const unique = <T,>(values: readonly T[]): T[] => [...new Set(values)];

export const evaluateAuthoredVisualDiversity = (
  scenes: readonly AuthoredVisualScene[],
): AuthoredVisualGateResult => {
  const issues: AuthoredVisualGateIssue[] = [];
  const sceneIds = scenes.map((scene) => scene.sceneId);
  const visualIds = scenes.map((scene) => scene.visualId);

  if (new Set(sceneIds).size !== sceneIds.length) {
    issues.push({
      code: 'duplicate-authored-scene-id',
      severity: 'blocker',
      sceneIds,
      message: 'Authored visual profiles contain duplicate scene IDs.',
    });
  }
  if (new Set(visualIds).size !== visualIds.length) {
    issues.push({
      code: 'duplicate-authored-visual-id',
      severity: 'blocker',
      sceneIds,
      message: 'A complete authored visual is reused inside the same reel.',
    });
  }

  for (let index = 1; index < scenes.length; index += 1) {
    const previous = scenes[index - 1];
    const current = scenes[index];
    const similarity = visualFingerprintSimilarityScore(
      previous.fingerprint,
      current.fingerprint,
    );

    if (previous.fingerprint.layoutFamily === current.fingerprint.layoutFamily) {
      issues.push({
        code: 'authored-consecutive-layout-family',
        severity: 'blocker',
        sceneIds: [previous.sceneId, current.sceneId],
        message: `Consecutive authored scenes repeat layout family ${current.fingerprint.layoutFamily}.`,
      });
    }
    if (previous.fingerprint.motionSignature === current.fingerprint.motionSignature) {
      issues.push({
        code: 'authored-consecutive-motion-signature',
        severity: 'blocker',
        sceneIds: [previous.sceneId, current.sceneId],
        message: `Consecutive authored scenes repeat motion signature ${current.fingerprint.motionSignature}.`,
      });
    }
    if (similarity >= VISUAL_SIMILARITY_HARD_LIMIT) {
      issues.push({
        code: 'authored-consecutive-visual-fingerprint',
        severity: 'blocker',
        sceneIds: [previous.sceneId, current.sceneId],
        message: `Consecutive authored scenes are visually too similar (${Math.round(similarity * 100)}%).`,
      });
    } else if (similarity >= VISUAL_SIMILARITY_SOFT_LIMIT) {
      issues.push({
        code: 'authored-soft-visual-similarity',
        severity: 'warning',
        sceneIds: [previous.sceneId, current.sceneId],
        message: `Consecutive authored scenes are visually similar (${Math.round(similarity * 100)}%).`,
      });
    }
  }

  for (let index = 2; index < scenes.length; index += 1) {
    const trio = scenes.slice(index - 2, index + 1);
    const fingerprints = trio.map((scene) => scene.fingerprint);
    if (new Set(fingerprints.map((fingerprint) => fingerprint.primaryPrimitive)).size === 1) {
      issues.push({
        code: 'authored-three-scene-primary-primitive-run',
        severity: 'warning',
        sceneIds: trio.map((scene) => scene.sceneId),
        message: `Three authored scenes repeat primary primitive ${fingerprints[0].primaryPrimitive}.`,
      });
    }
    if (fingerprints.every((fingerprint) => fingerprint.cameraMotion === 'locked')) {
      issues.push({
        code: 'authored-three-scene-locked-camera-run',
        severity: 'warning',
        sceneIds: trio.map((scene) => scene.sceneId),
        message: 'Three authored scenes use a locked camera in sequence.',
      });
    }
    if (fingerprints.every((fingerprint) => fingerprint.depthStyle === 'flat')) {
      issues.push({
        code: 'authored-three-scene-flat-depth-run',
        severity: 'warning',
        sceneIds: trio.map((scene) => scene.sceneId),
        message: 'Three authored scenes stay visually flat in sequence.',
      });
    }
  }

  const primitiveCount = new Set(
    scenes.map((scene) => scene.fingerprint.primaryPrimitive),
  ).size;
  const minimumPrimitiveCount = Math.min(3, scenes.length);
  if (scenes.length >= 4 && primitiveCount < minimumPrimitiveCount) {
    issues.push({
      code: 'authored-insufficient-primary-primitive-diversity',
      severity: 'blocker',
      sceneIds,
      message: `Authored reel uses only ${primitiveCount} primary primitives; at least ${minimumPrimitiveCount} are required.`,
    });
  }

  const cardCount = scenes.filter(
    (scene) => scene.fingerprint.primaryPrimitive === 'card',
  ).length;
  if (cardCount > Math.max(2, Math.floor(scenes.length * 0.4))) {
    issues.push({
      code: 'authored-card-dominance',
      severity: 'blocker',
      sceneIds: scenes
        .filter((scene) => scene.fingerprint.primaryPrimitive === 'card')
        .map((scene) => scene.sceneId),
      message: `${cardCount}/${scenes.length} authored scenes are card-primary visuals.`,
    });
  }

  const dedupedIssues = unique(
    issues.map((issue) => JSON.stringify(issue)),
  ).map((issue) => JSON.parse(issue) as AuthoredVisualGateIssue);

  return {
    passed: !dedupedIssues.some((issue) => issue.severity === 'blocker'),
    uniquePrimitiveCount: primitiveCount,
    uniqueLayoutCount: new Set(
      scenes.map((scene) => scene.fingerprint.layoutFamily),
    ).size,
    uniqueMotionCount: new Set(
      scenes.map((scene) => scene.fingerprint.motionSignature),
    ).size,
    issues: dedupedIssues,
  };
};

export const assertAuthoredVisualDiversity = (
  scenes: readonly AuthoredVisualScene[],
): void => {
  const result = evaluateAuthoredVisualDiversity(scenes);
  const blockers = result.issues.filter((issue) => issue.severity === 'blocker');
  if (blockers.length > 0) {
    throw new Error(
      `authored visual diversity gate failed: ${blockers
        .map((issue) => `${issue.code}[${issue.sceneIds.join(',')}]`)
        .join('; ')}`,
    );
  }
};
