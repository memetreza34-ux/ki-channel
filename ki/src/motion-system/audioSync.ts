import type {MotionStoryboard} from './schema';

export type WordTimestamp = {
  text: string;
  startMs: number;
  endMs: number;
};

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9äöüß]+/gi, ' ')
    .trim();

const findFirstKeywordTime = (words: WordTimestamp[], keywords: string[]): number | null => {
  const normalizedKeywords = keywords.map(normalize).filter(Boolean);
  for (const word of words) {
    const token = normalize(word.text);
    if (normalizedKeywords.some((keyword) => token.includes(keyword) || keyword.includes(token))) {
      return word.startMs;
    }
  }
  return null;
};

export const alignStoryboardToWords = (
  storyboard: MotionStoryboard,
  words: WordTimestamp[],
  fps = 30,
): MotionStoryboard => {
  if (words.length === 0) return storyboard;

  const timedBeats = storyboard.beats.map((beat) => {
    const target = storyboard.elements.find((element) => element.id === beat.targetId);
    const source = beat.sourceId
      ? storyboard.elements.find((element) => element.id === beat.sourceId)
      : undefined;
    const candidates = [target?.label, source?.label, target?.type, source?.type].filter(
      (value): value is string => Boolean(value),
    );
    const ms = findFirstKeywordTime(words, candidates);
    if (ms === null) return beat;
    return {
      ...beat,
      atFrame: Math.max(0, Math.round((ms / 1000) * fps)),
    };
  });

  const maxEndMs = Math.max(...words.map((word) => word.endMs));
  return {
    ...storyboard,
    durationInFrames: Math.max(storyboard.durationInFrames, Math.ceil((maxEndMs / 1000) * fps) + fps),
    beats: timedBeats.sort((a, b) => a.atFrame - b.atFrame),
  };
};
