import {alignStoryboardToWords, type WordTimestamp} from './audioSync';
import {
  customizeMotionStoryboard,
  type MotionStoryboardCustomization,
} from './customization';
import {createDefaultStoryboard} from './router';
import {inspectMotionStoryboardQuality, type MotionQualityReport} from './quality';
import {assertMotionStoryboard} from './validation';
import type {MotionStoryboard} from './schema';

export type BuildMotionSceneInput = MotionStoryboardCustomization & {
  sentence: string;
  words?: WordTimestamp[];
  fps?: number;
};

export type BuildMotionSceneResult = {
  storyboard: MotionStoryboard;
  quality: MotionQualityReport;
};

export const buildMotionScene = ({
  sentence,
  words = [],
  fps,
  elementLabels,
  labels,
}: BuildMotionSceneInput): BuildMotionSceneResult => {
  const base = createDefaultStoryboard(sentence);
  const customized = customizeMotionStoryboard(base, {elementLabels, labels});
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
