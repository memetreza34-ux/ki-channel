import {alignStoryboardToWords, type WordTimestamp} from './audioSync';
import {createDefaultStoryboard} from './router';
import {inspectMotionStoryboardQuality, type MotionQualityReport} from './quality';
import {assertMotionStoryboard} from './validation';
import type {MotionStoryboard} from './schema';

export type BuildMotionSceneInput = {
  sentence: string;
  words?: WordTimestamp[];
  fps?: number;
};

export type BuildMotionSceneResult = {
  storyboard: MotionStoryboard;
  quality: MotionQualityReport;
};

export const buildMotionScene = ({sentence, words = [], fps}: BuildMotionSceneInput): BuildMotionSceneResult => {
  const base = createDefaultStoryboard(sentence);
  const aligned = words.length > 0 ? alignStoryboardToWords(base, words, fps ?? base.fps) : base;
  const storyboard = assertMotionStoryboard(aligned);
  const quality = inspectMotionStoryboardQuality(storyboard);

  return {storyboard, quality};
};
