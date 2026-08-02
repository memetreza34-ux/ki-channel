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

const isValidTimestamp = (word: WordTimestamp): boolean =>
  Number.isFinite(word.startMs) &&
  Number.isFinite(word.endMs) &&
  word.startMs >= 0 &&
  word.endMs >= word.startMs &&
  normalize(word.text).length > 0;

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
  fps = storyboard.fps,
): MotionStoryboard => {
  if (!Number.isFinite(fps) || fps <= 0) {
    throw new Error('FPS muss eine positive Zahl sein.');
  }

  const validWords = words.filter(isValidTimestamp).sort((a, b) => a.startMs - b.startMs);
  if (validWords.length === 0) return storyboard;

  const timedBeats = storyboard.beats.map((beat) => {
    const target = storyboard.elements.find((element) => element.id === beat.targetId);
    const source = beat.sourceId
      ? storyboard.elements.find((element) => element.id === beat.sourceId)
      : undefined;
    const candidates = [target?.label, source?.label].filter(
      (value): value is string => Boolean(value),
    );
    const ms = findFirstKeywordTime(validWords, candidates);
    if (ms === null) return beat;
    return {
      ...beat,
      atFrame: Math.max(0, Math.round((ms / 1000) * fps)),
    };
  });

  const maxEndMs = Math.max(...validWords.map((word) => word.endMs));
  const durationInFrames = Math.min(
    900,
    Math.max(storyboard.durationInFrames, Math.ceil((maxEndMs / 1000) * fps) + fps),
  );

  return {
    ...storyboard,
    fps,
    durationInFrames,
    beats: timedBeats
      .map((beat) => ({
        ...beat,
        atFrame: Math.min(beat.atFrame, durationInFrames - 1),
      }))
      .sort((a, b) => a.atFrame - b.atFrame),
  };
};
