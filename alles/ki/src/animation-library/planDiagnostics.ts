import {getAnimationLibraryEntry} from './catalog';
import type {RawReelAnimationPlan} from './reelPlanningPipeline';

export type ReelPlanDiagnosticSeverity = 'info' | 'warning' | 'blocker';

export type ReelPlanDiagnostic = {
  code: string;
  severity: ReelPlanDiagnosticSeverity;
  sceneIds: string[];
  message: string;
};

export type ReelPlanDiagnostics = {
  reelId: string;
  sceneCount: number;
  librarySceneCount: number;
  newBuildSceneCount: number;
  newBuildRatio: number;
  uniqueAnimationCount: number;
  uniqueFamilyCount: number;
  averageSelectionScore: number | null;
  passed: boolean;
  diagnostics: ReelPlanDiagnostic[];
};

const average = (values: number[]): number | null =>
  values.length === 0
    ? null
    : values.reduce((sum, value) => sum + value, 0) / values.length;

export const diagnoseRawReelAnimationPlan = (
  plan: RawReelAnimationPlan,
): ReelPlanDiagnostics => {
  const diagnostics: ReelPlanDiagnostic[] = [];
  const decisions = plan.decisionSummary;
  const animationIds = decisions.map((decision) => decision.selectedAnimationId);
  const familyNames = decisions.map((decision) => decision.primaryFamily);
  const newBuildSceneCount = decisions.filter(
    (decision) => decision.source === 'new-build',
  ).length;
  const librarySceneCount = decisions.length - newBuildSceneCount;
  const newBuildRatio = decisions.length === 0 ? 0 : newBuildSceneCount / decisions.length;
  const selectionScores = decisions
    .map((decision) => decision.selectionScore)
    .filter((score): score is number => score !== null);

  const duplicateAnimationGroups = new Map<string, string[]>();
  decisions.forEach((decision) => {
    const scenes = duplicateAnimationGroups.get(decision.selectedAnimationId) ?? [];
    scenes.push(decision.sceneId);
    duplicateAnimationGroups.set(decision.selectedAnimationId, scenes);
  });
  for (const [animationId, sceneIds] of duplicateAnimationGroups) {
    if (sceneIds.length > 1) {
      diagnostics.push({
        code: 'duplicate-animation',
        severity: 'blocker',
        sceneIds,
        message: `Animation ${animationId} wird innerhalb des Reels mehrfach verwendet.`,
      });
    }
  }

  decisions.slice(1).forEach((decision, index) => {
    const previous = decisions[index];
    const currentEntry = getAnimationLibraryEntry(decision.selectedAnimationId);
    const previousEntry = getAnimationLibraryEntry(previous.selectedAnimationId);
    if (
      currentEntry &&
      previousEntry &&
      currentEntry.layoutFamily === previousEntry.layoutFamily
    ) {
      diagnostics.push({
        code: 'consecutive-layout-family',
        severity: 'blocker',
        sceneIds: [previous.sceneId, decision.sceneId],
        message: `Direkt aufeinanderfolgende Szenen verwenden ${currentEntry.layoutFamily}.`,
      });
    }
    if (
      currentEntry &&
      previousEntry &&
      currentEntry.motionSignature === previousEntry.motionSignature
    ) {
      diagnostics.push({
        code: 'consecutive-motion-signature',
        severity: 'blocker',
        sceneIds: [previous.sceneId, decision.sceneId],
        message: `Direkt aufeinanderfolgende Szenen wiederholen ${currentEntry.motionSignature}.`,
      });
    }
    if (decision.primaryFamily === previous.primaryFamily) {
      diagnostics.push({
        code: 'consecutive-visual-family',
        severity: 'warning',
        sceneIds: [previous.sceneId, decision.sceneId],
        message: `Die visuelle Familie ${decision.primaryFamily} erscheint direkt hintereinander.`,
      });
    }
  });

  const uniqueFamilyCount = new Set(familyNames).size;
  if (decisions.length >= 4 && uniqueFamilyCount < 4) {
    diagnostics.push({
      code: 'insufficient-family-diversity',
      severity: 'blocker',
      sceneIds: decisions.map((decision) => decision.sceneId),
      message: `Das Reel verwendet nur ${uniqueFamilyCount} visuelle Familien.`,
    });
  }

  if (newBuildRatio > 0.75) {
    diagnostics.push({
      code: 'excessive-new-build-ratio',
      severity: 'warning',
      sceneIds: decisions
        .filter((decision) => decision.source === 'new-build')
        .map((decision) => decision.sceneId),
      message: `${Math.round(newBuildRatio * 100)} % der Szenen benötigen neue Animationen.`,
    });
  }

  decisions.forEach((decision) => {
    if (
      decision.source === 'library' &&
      decision.selectionScore !== null &&
      decision.selectionScore < 68
    ) {
      diagnostics.push({
        code: 'weak-library-selection',
        severity: 'blocker',
        sceneIds: [decision.sceneId],
        message: `Bibliotheksauswahl ${decision.selectedAnimationId} erreicht nur ${decision.selectionScore.toFixed(1)} Punkte.`,
      });
    }
    if (decision.mustBeNew && decision.source !== 'new-build') {
      diagnostics.push({
        code: 'new-build-requirement-ignored',
        severity: 'blocker',
        sceneIds: [decision.sceneId],
        message: 'Eine verpflichtend neue Animation wurde durch eine Bibliotheksauswahl ersetzt.',
      });
    }
  });

  return {
    reelId: plan.reelId,
    sceneCount: decisions.length,
    librarySceneCount,
    newBuildSceneCount,
    newBuildRatio,
    uniqueAnimationCount: new Set(animationIds).size,
    uniqueFamilyCount,
    averageSelectionScore: average(selectionScores),
    passed: !diagnostics.some((diagnostic) => diagnostic.severity === 'blocker'),
    diagnostics,
  };
};
