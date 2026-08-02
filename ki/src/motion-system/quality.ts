import type {MotionStoryboard} from './schema';
import {findMissingStageTimings} from './stageTimingRequirements';

export type MotionQualityIssue = {
  severity: 'warning' | 'error';
  code:
    | 'sentence-too-long'
    | 'label-too-long'
    | 'too-many-elements'
    | 'stage-item-limit'
    | 'late-beat'
    | 'missing-labels'
    | 'missing-stage-timing'
    | 'collapsed-beat-timing'
    | 'short-scene';
  message: string;
};

export type MotionQualityReport = {
  passed: boolean;
  issues: MotionQualityIssue[];
};

export const inspectMotionStoryboardQuality = (storyboard: MotionStoryboard): MotionQualityReport => {
  const issues: MotionQualityIssue[] = [];

  if (storyboard.sentence.length > 220) {
    issues.push({
      severity: 'error',
      code: 'sentence-too-long',
      message: 'Der Satz ist länger als 220 Zeichen und passt nicht sicher in die Satz-Safe-Zone.',
    });
  } else if (storyboard.sentence.length > 140) {
    issues.push({
      severity: 'warning',
      code: 'sentence-too-long',
      message: 'Der Satz ist länger als 140 Zeichen.',
    });
  }

  for (const element of storyboard.elements) {
    if (element.label.length > 24) {
      issues.push({
        severity: 'warning',
        code: 'label-too-long',
        message: `Label ${element.id} ist länger als 24 Zeichen.`,
      });
    }
  }

  if (storyboard.elements.length > 8) {
    issues.push({severity: 'warning', code: 'too-many-elements', message: 'Mehr als acht Elemente können die 9:16-Szene überladen.'});
  }

  if (storyboard.visualType === 'tool-orchestration') {
    const toolCount = storyboard.elements.filter((element) => element.kind === 'tool').length;
    if (toolCount > 3) {
      issues.push({
        severity: 'warning',
        code: 'stage-item-limit',
        message: `Die Tool-Orchestrierung zeigt höchstens drei Werkzeuge; ${toolCount - 3} weitere werden nicht dargestellt.`,
      });
    }
  }

  if (storyboard.visualType === 'ranking') {
    const metricCount = storyboard.elements.filter((element) => element.kind === 'metric').length;
    if (metricCount > 8) {
      issues.push({
        severity: 'warning',
        code: 'stage-item-limit',
        message: `Das Ranking zeigt höchstens acht Einträge; ${metricCount - 8} weitere werden nicht dargestellt.`,
      });
    }
  }

  if (storyboard.visualType === 'process-chain') {
    const stepCount = storyboard.elements.filter((element) => element.id.startsWith('step-')).length;
    if (stepCount > 4) {
      issues.push({
        severity: 'warning',
        code: 'stage-item-limit',
        message: `Die Prozesskette zeigt höchstens vier Schritte; ${stepCount - 4} weitere werden nicht dargestellt.`,
      });
    }
  }

  if (storyboard.labels.length === 0) {
    issues.push({severity: 'error', code: 'missing-labels', message: 'Das Storyboard besitzt keine sichtbaren Labels.'});
  }

  if (storyboard.durationInFrames < storyboard.fps * 2) {
    issues.push({severity: 'warning', code: 'short-scene', message: 'Die Szene ist kürzer als zwei Sekunden.'});
  }

  const lateThreshold = Math.max(0, storyboard.durationInFrames - Math.ceil(storyboard.fps * 0.5));
  for (const beat of storyboard.beats) {
    if (beat.atFrame >= lateThreshold) {
      issues.push({
        severity: 'warning',
        code: 'late-beat',
        message: `Beat ${beat.id} beginnt sehr spät und könnte im Render kaum sichtbar sein.`,
      });
    }
  }

  const beatGroups = new Map<string, Map<number, Set<string>>>();
  for (const beat of storyboard.beats) {
    const targetFrames = beatGroups.get(beat.targetId) ?? new Map<number, Set<string>>();
    const actions = targetFrames.get(beat.atFrame) ?? new Set<string>();
    actions.add(beat.action);
    targetFrames.set(beat.atFrame, actions);
    beatGroups.set(beat.targetId, targetFrames);
  }

  for (const [targetId, targetFrames] of beatGroups) {
    for (const [atFrame, actions] of targetFrames) {
      if (actions.size > 1) {
        issues.push({
          severity: 'warning',
          code: 'collapsed-beat-timing',
          message: `Mehrere Aktionen für ${targetId} liegen gemeinsam auf Frame ${atFrame}.`,
        });
      }
    }
  }

  for (const missingTiming of findMissingStageTimings(storyboard)) {
    issues.push({
      severity: 'warning',
      code: 'missing-stage-timing',
      message: `Stage-Timing ${missingTiming.key} fehlt; die Animation nutzt dafür einen Fallback-Frame.`,
    });
  }

  return {
    passed: issues.every((issue) => issue.severity !== 'error'),
    issues,
  };
};
