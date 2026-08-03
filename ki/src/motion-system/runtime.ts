import {alignStoryboardToWords, type WordTimestamp} from './audioSync';
import {
  customizeMotionStoryboard,
  type MotionStoryboardCustomization,
} from './customization';
import {retimeMotionStoryboardFps} from './fps';
import {createDefaultStoryboard} from './router';
import {
  inspectMotionStoryboardQuality,
  type MotionQualityReport,
} from './quality';
import type {MotionStoryboard} from './schema';
import {createMotionStoryboardId} from './storyboardId';
import {assertMotionStoryboard} from './validation';

export type MotionQualityMode = 'report' | 'strict';

export type BuildMotionSceneInput = MotionStoryboardCustomization & {
  sentence: string;
  words?: WordTimestamp[];
  fps?: number;
  storyboardId?: string;
  qualityMode?: MotionQualityMode;
};

export type BuildMotionSceneResult = {
  storyboard: MotionStoryboard;
  quality: MotionQualityReport;
};

export class MotionQualityError extends Error {
  public readonly storyboard: MotionStoryboard;
  public readonly quality: MotionQualityReport;

  public constructor(
    storyboard: MotionStoryboard,
    quality: MotionQualityReport,
  ) {
    const errors = quality.issues
      .filter((issue) => issue.severity === 'error')
      .map((issue) => `${issue.code}: ${issue.message}`);
    super(`Motion-Qualitätsprüfung fehlgeschlagen: ${errors.join(' | ')}`);
    this.name = 'MotionQualityError';
    this.storyboard = storyboard;
    this.quality = quality;
  }
}

export const buildMotionScene = ({
  sentence,
  words = [],
  fps,
  storyboardId,
  qualityMode = 'report',
  elementLabels,
  labels,
}: BuildMotionSceneInput): BuildMotionSceneResult => {
  if (qualityMode !== 'report' && qualityMode !== 'strict') {
    throw new Error('qualityMode muss report oder strict sein.');
  }

  const base = createDefaultStoryboard(sentence);
  const normalizedCustomId = storyboardId?.trim();

  if (storyboardId !== undefined && !normalizedCustomId) {
    throw new Error('Storyboard-ID darf nicht leer sein.');
  }

  const identified: MotionStoryboard = {
    ...base,
    id: normalizedCustomId ?? createMotionStoryboardId(base.sentence, base.visualType),
  };
  const customized = customizeMotionStoryboard(identified, {elementLabels, labels});
  const configured = fps === undefined
    ? customized
    : retimeMotionStoryboardFps(customized, fps);
  const aligned = words.length > 0
    ? alignStoryboardToWords(configured, words, configured.fps)
    : configured;
  const storyboard = assertMotionStoryboard(aligned);
  const quality = inspectMotionStoryboardQuality(storyboard);

  if (qualityMode === 'strict' && !quality.passed) {
    throw new MotionQualityError(storyboard, quality);
  }

  return {storyboard, quality};
};
