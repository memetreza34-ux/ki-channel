import type {MotionStoryboard} from './schema';

export type MotionQualityIssue = {
  severity: 'warning' | 'error';
  code:
    | 'sentence-too-long'
    | 'label-too-long'
    | 'too-many-elements'
    | 'late-beat'
    | 'missing-labels'
    | 'short-scene';
  message: string;
};

export type MotionQualityReport = {
  passed: boolean;
  issues: MotionQualityIssue[];
};

export const inspectMotionStoryboardQuality = (storyboard: MotionStoryboard): MotionQualityReport => {
  const issues: MotionQualityIssue[] = [];

  if (storyboard.sentence.length > 140) {
    issues.push({severity: 'warning', code: 'sentence-too-long', message: 'Der Satz ist länger als 140 Zeichen.'});
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

  return {
    passed: issues.every((issue) => issue.severity !== 'error'),
    issues,
  };
};
