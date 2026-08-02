import type {MotionStoryboard} from './schema';

export type WordTimestamp = {
  text: string;
  startMs: number;
  endMs: number;
};

const CONNECTOR_LEAD_FRAMES = 6;

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

const tokensMatch = (left: string, right: string): boolean => {
  if (left === right) return true;
  if (left.length <= 2 || right.length <= 2) return false;
  return left.includes(right) || right.includes(left);
};

const findFirstKeywordTime = (words: WordTimestamp[], keywords: string[]): number | null => {
  const keywordTokens = keywords
    .flatMap((keyword) => normalize(keyword).split(/\s+/))
    .filter(Boolean);

  for (const word of words) {
    const wordTokens = normalize(word.text).split(/\s+/).filter(Boolean);
    if (
      wordTokens.some((wordToken) =>
        keywordTokens.some((keywordToken) => tokensMatch(wordToken, keywordToken)),
      )
    ) {
      return word.startMs;
    }
  }
  return null;
};

const fitBeatIntoDuration = (
  atFrame: number,
  durationFrames: number,
  sceneDuration: number,
): number => {
  const latestStart = Math.max(0, sceneDuration - Math.min(durationFrames, sceneDuration));
  return Math.min(Math.max(0, Math.round(atFrame)), latestStart);
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

  const targetWordFrames = new Map<string, number>();
  for (const element of storyboard.elements) {
    const matchingTime = findFirstKeywordTime(validWords, [element.label]);
    if (matchingTime !== null) {
      targetWordFrames.set(element.id, Math.max(0, Math.round((matchingTime / 1000) * fps)));
    }
  }

  const showBeatByTarget = new Map<string, MotionStoryboard['beats'][number]>();
  for (const beat of storyboard.beats) {
    if (beat.action !== 'show') continue;
    const current = showBeatByTarget.get(beat.targetId);
    if (!current || beat.atFrame < current.atFrame) {
      showBeatByTarget.set(beat.targetId, beat);
    }
  }

  const shiftedShowFrames = new Map<string, number>();
  const showFrameShifts = new Map<string, number>();
  for (const [targetId, showBeat] of showBeatByTarget) {
    const shiftedFrame = targetWordFrames.get(targetId) ?? showBeat.atFrame;
    shiftedShowFrames.set(targetId, shiftedFrame);
    showFrameShifts.set(targetId, shiftedFrame - showBeat.atFrame);
  }

  const remappedBeats = storyboard.beats.map((beat, originalIndex) => {
    const targetWordFrame = targetWordFrames.get(beat.targetId);
    let atFrame = beat.atFrame;

    if (beat.action === 'show' && targetWordFrame !== undefined) {
      atFrame = targetWordFrame;
    } else if (beat.action === 'connect') {
      const sourceShowFrame = beat.sourceId ? shiftedShowFrames.get(beat.sourceId) : undefined;
      const targetShowFrame = shiftedShowFrames.get(beat.targetId);
      const minimumVisibleFrame =
        Math.max(sourceShowFrame ?? 0, targetShowFrame ?? 0) + CONNECTOR_LEAD_FRAMES;
      atFrame = Math.max(targetWordFrame ?? beat.atFrame, minimumVisibleFrame);
    } else {
      const showBeat = showBeatByTarget.get(beat.targetId);
      const shift = showFrameShifts.get(beat.targetId);
      if (showBeat && shift !== undefined && beat.atFrame >= showBeat.atFrame) {
        atFrame = beat.atFrame + shift;
      }
    }

    return {...beat, atFrame, originalIndex};
  });

  const maxEndMs = Math.max(...validWords.map((word) => word.endMs));
  const maxBeatEnd = Math.max(
    0,
    ...remappedBeats.map((beat) => beat.atFrame + beat.durationFrames),
  );
  const durationInFrames = Math.min(
    900,
    Math.max(
      storyboard.durationInFrames,
      Math.ceil((maxEndMs / 1000) * fps) + fps,
      maxBeatEnd + 1,
    ),
  );

  return {
    ...storyboard,
    fps,
    durationInFrames,
    beats: remappedBeats
      .map(({originalIndex, ...beat}) => ({
        ...beat,
        atFrame: fitBeatIntoDuration(beat.atFrame, beat.durationFrames, durationInFrames),
        originalIndex,
      }))
      .sort((left, right) => left.atFrame - right.atFrame || left.originalIndex - right.originalIndex)
      .map(({originalIndex: _originalIndex, ...beat}) => beat),
  };
};
