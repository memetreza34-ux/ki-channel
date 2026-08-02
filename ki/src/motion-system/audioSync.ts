import type {MotionStoryboard} from './schema';

export type WordTimestamp = {
  text: string;
  startMs: number;
  endMs: number;
};

type TimedToken = {
  value: string;
  startMs: number;
};

const CONNECTOR_LEAD_SECONDS = 0.2;

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9äöüß]+/gi, ' ')
    .trim();

const tokenize = (value: string): string[] =>
  normalize(value).split(/\s+/).filter(Boolean);

const isValidTimestamp = (word: WordTimestamp): boolean =>
  Number.isFinite(word.startMs) &&
  Number.isFinite(word.endMs) &&
  word.startMs >= 0 &&
  word.endMs >= word.startMs &&
  tokenize(word.text).length > 0;

const tokensMatch = (left: string, right: string): boolean => {
  if (left === right) return true;
  if (left.length <= 2 || right.length <= 2) return false;
  return left.includes(right) || right.includes(left);
};

const createTimedTokens = (words: WordTimestamp[]): TimedToken[] =>
  words.flatMap((word) =>
    tokenize(word.text).map((value) => ({value, startMs: word.startMs})),
  );

const createLabelTokenFrequency = (
  storyboard: MotionStoryboard,
): Map<string, number> => {
  const frequency = new Map<string, number>();

  for (const element of storyboard.elements) {
    for (const token of new Set(tokenize(element.label))) {
      frequency.set(token, (frequency.get(token) ?? 0) + 1);
    }
  }

  return frequency;
};

const findPhraseTime = (
  timedTokens: TimedToken[],
  labelTokens: string[],
): number | null => {
  if (labelTokens.length < 2 || timedTokens.length < labelTokens.length) return null;

  for (let startIndex = 0; startIndex <= timedTokens.length - labelTokens.length; startIndex += 1) {
    const matches = labelTokens.every(
      (labelToken, offset) => timedTokens[startIndex + offset].value === labelToken,
    );
    if (matches) return timedTokens[startIndex].startMs;
  }

  return null;
};

const findFirstKeywordTime = (
  timedTokens: TimedToken[],
  label: string,
  labelTokenFrequency: Map<string, number>,
): number | null => {
  const labelTokens = tokenize(label);
  if (labelTokens.length === 0) return null;

  const phraseTime = findPhraseTime(timedTokens, labelTokens);
  if (phraseTime !== null) return phraseTime;

  const rankedTokens = [...labelTokens].sort((left, right) => {
    const frequencyDifference =
      (labelTokenFrequency.get(left) ?? 0) - (labelTokenFrequency.get(right) ?? 0);
    if (frequencyDifference !== 0) return frequencyDifference;
    return right.length - left.length;
  });

  for (const labelToken of rankedTokens) {
    const exactMatch = timedTokens.find((token) => token.value === labelToken);
    if (exactMatch) return exactMatch.startMs;
  }

  for (const labelToken of rankedTokens) {
    if (labelToken.length <= 2) continue;
    const partialMatch = timedTokens.find((token) => tokensMatch(token.value, labelToken));
    if (partialMatch) return partialMatch.startMs;
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

  const connectorLeadFrames = Math.max(1, Math.round(fps * CONNECTOR_LEAD_SECONDS));
  const validWords = words.filter(isValidTimestamp).sort((a, b) => a.startMs - b.startMs);
  if (validWords.length === 0) return storyboard;

  const timedTokens = createTimedTokens(validWords);
  const labelTokenFrequency = createLabelTokenFrequency(storyboard);
  const targetWordFrames = new Map<string, number>();

  for (const element of storyboard.elements) {
    const matchingTime = findFirstKeywordTime(
      timedTokens,
      element.label,
      labelTokenFrequency,
    );
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
      const sourceWasAligned = Boolean(
        beat.sourceId && targetWordFrames.has(beat.sourceId),
      );
      const targetWasAligned = targetWordFrames.has(beat.targetId);
      const sourceShift = beat.sourceId ? showFrameShifts.get(beat.sourceId) : undefined;
      const targetShift = showFrameShifts.get(beat.targetId);

      if (targetWasAligned && targetShift !== undefined) {
        atFrame = beat.atFrame + targetShift;
      } else if (sourceWasAligned && sourceShift !== undefined) {
        atFrame = beat.atFrame + sourceShift;
      }

      const sourceShowFrame = beat.sourceId ? shiftedShowFrames.get(beat.sourceId) : undefined;
      if (sourceShowFrame !== undefined) {
        atFrame = Math.max(atFrame, sourceShowFrame + connectorLeadFrames);
      }

      const originalTargetShow = showBeatByTarget.get(beat.targetId)?.atFrame;
      const shiftedTargetShow = shiftedShowFrames.get(beat.targetId);
      const originallyStartedAfterTarget =
        originalTargetShow !== undefined && beat.atFrame >= originalTargetShow;
      if (originallyStartedAfterTarget && shiftedTargetShow !== undefined) {
        atFrame = Math.max(atFrame, shiftedTargetShow + connectorLeadFrames);
      }
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
