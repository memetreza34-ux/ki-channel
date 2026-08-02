import {alignStoryboardToWords, type WordTimestamp} from './audioSync';
import {
  customizeMotionStoryboard,
  type MotionStoryboardCustomization,
} from './customization';
import {createDefaultStoryboard} from './router';
import {inspectMotionStoryboardQuality, type MotionQualityReport} from './quality';
import {createMotionStoryboardId} from './storyboardId';
import {assertMotionStoryboard} from './validation';
import type {MotionStoryboard} from './schema';

export type BuildMotionSceneInput = MotionStoryboardCustomization & {
  sentence: string;
  words?: WordTimestamp[];
  fps?: number;
  storyboardId?: string;
};

export type BuildMotionSceneResult = {
  storyboard: MotionStoryboard;
  quality: MotionQualityReport;
};

export const buildMotionScene = ({
  sentence,
  words = [],
  fps,
  storyboardId,
  elementLabels,
  labels,
}: BuildMotionSceneInput): BuildMotionSceneResult => {
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
  const configured: MotionStoryboard = fps === undefined
    ? customized
    : {...customized, fps};
  const aligned = words.length > 0
    ? alignStoryboardToWords(configured, words, configured.fps)
    : configured;
  const storyboard = assertMotionStoryboard(aligned);
  const quality = inspectMotionStoryboardQuality(storyboard);

  return {storyboard, quality};
};
