import type {WordTimestamp} from './audioSync';
import type {BuildMotionSceneInput} from './runtime';
import {
  createMotionSceneInputsFromScript,
  type SegmentMotionScriptOptions,
} from './scriptTimeline';
import {
  buildMotionTimeline,
  type MotionTimeline,
} from './timeline';

export const MOTION_TRANSCRIPT_LIMITS = {
  maxSkippedTokensPerMatch: 8,
} as const;

type TranscriptSceneOptions = Omit<
  BuildMotionSceneInput,
  'sentence' | 'fps' | 'words' | 'qualityMode'
>;

export type MapMotionTranscriptInput = SegmentMotionScriptOptions & {
  script: string;
  words: WordTimestamp[];
  maxSkippedTokensPerMatch?: number;
};

export type MotionTranscriptScene = {
  index: number;
  sentence: string;
  sourceStartMs: number;
  sourceEndMs: number;
  durationMs: number;
  words: WordTimestamp[];
};

export type BuildMotionTimelineFromTranscriptInput =
  SegmentMotionScriptOptions & {
    script: string;
    words: WordTimestamp[];
    fps?: number;
    gapFrames?: number;
    qualityMode?: BuildMotionSceneInput['qualityMode'];
    maxSkippedTokensPerMatch?: number;
    sceneDefaults?: TranscriptSceneOptions;
    sceneOverrides?: TranscriptSceneOptions[];
  };

export type BuildMotionTimelineFromTranscriptResult = {
  timeline: MotionTimeline;
  transcriptScenes: MotionTranscriptScene[];
};

type TimedTranscriptToken = {
  value: string;
  wordIndex: number;
};

const normalizeText = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9äöüß]+/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const tokenize = (value: string): string[] =>
  normalizeText(value).split(/\s+/).filter(Boolean);

const isValidWordTimestamp = (word: WordTimestamp): boolean =>
  Number.isFinite(word.startMs) &&
  Number.isFinite(word.endMs) &&
  word.startMs >= 0 &&
  word.endMs >= word.startMs &&
  tokenize(word.text).length > 0;

const tokensCompatible = (left: string, right: string): boolean => {
  if (left === right) return true;
  if (left.length < 4 || right.length < 4) return false;
  return left.includes(right) || right.includes(left);
};

const assertMaxSkippedTokens = (value: number): void => {
  if (!Number.isInteger(value) || value < 0 || value > 50) {
    throw new Error(
      'maxSkippedTokensPerMatch muss eine ganze Zahl zwischen 0 und 50 sein.',
    );
  }
};

const prepareTranscriptWords = (words: WordTimestamp[]): WordTimestamp[] => {
  const invalidIndex = words.findIndex((word) => !isValidWordTimestamp(word));
  if (invalidIndex !== -1) {
    throw new Error(`Transkript-Wort ${invalidIndex + 1} besitzt ungültige Zeitwerte oder keinen Text.`);
  }
  if (words.length === 0) {
    throw new Error('Für die Transkript-Timeline werden Wort-Timestamps benötigt.');
  }

  return words
    .map((word) => ({...word, text: word.text.trim()}))
    .sort((left, right) => left.startMs - right.startMs || left.endMs - right.endMs);
};

const createTranscriptTokens = (
  words: WordTimestamp[],
): TimedTranscriptToken[] =>
  words.flatMap((word, wordIndex) =>
    tokenize(word.text).map((value) => ({value, wordIndex})),
  );

const findSceneTokenRange = ({
  sentenceTokens,
  transcriptTokens,
  startTokenIndex,
  maxSkippedTokens,
}: {
  sentenceTokens: string[];
  transcriptTokens: TimedTranscriptToken[];
  startTokenIndex: number;
  maxSkippedTokens: number;
}): {firstTokenIndex: number; lastTokenIndex: number} | null => {
  let transcriptCursor = startTokenIndex;
  let firstTokenIndex = -1;
  let lastTokenIndex = -1;

  for (const sentenceToken of sentenceTokens) {
    const searchEnd = Math.min(
      transcriptTokens.length,
      transcriptCursor + maxSkippedTokens + 1,
    );
    let matchedIndex = -1;

    for (let index = transcriptCursor; index < searchEnd; index += 1) {
      if (tokensCompatible(sentenceToken, transcriptTokens[index].value)) {
        matchedIndex = index;
        break;
      }
    }

    if (matchedIndex === -1) return null;
    if (firstTokenIndex === -1) firstTokenIndex = matchedIndex;
    lastTokenIndex = matchedIndex;
    transcriptCursor = matchedIndex + 1;
  }

  return firstTokenIndex === -1
    ? null
    : {firstTokenIndex, lastTokenIndex};
};

const toLocalWordTimestamps = (
  words: WordTimestamp[],
  firstWordIndex: number,
  lastWordIndex: number,
): MotionTranscriptScene['words'] => {
  const selectedWords = words.slice(firstWordIndex, lastWordIndex + 1);
  const startMs = selectedWords[0].startMs;

  return selectedWords.map((word) => ({
    ...word,
    startMs: Math.max(0, word.startMs - startMs),
    endMs: Math.max(0, word.endMs - startMs),
  }));
};

export const mapMotionTranscriptToScenes = ({
  script,
  words,
  maxCharactersPerScene,
  mergeShorterThan,
  maxSkippedTokensPerMatch = MOTION_TRANSCRIPT_LIMITS.maxSkippedTokensPerMatch,
}: MapMotionTranscriptInput): MotionTranscriptScene[] => {
  assertMaxSkippedTokens(maxSkippedTokensPerMatch);
  const sceneInputs = createMotionSceneInputsFromScript({
    script,
    maxCharactersPerScene,
    mergeShorterThan,
  });
  const preparedWords = prepareTranscriptWords(words);
  const transcriptTokens = createTranscriptTokens(preparedWords);
  const scenes: MotionTranscriptScene[] = [];
  let transcriptTokenCursor = 0;

  sceneInputs.forEach((sceneInput, index) => {
    const sentenceTokens = tokenize(sceneInput.sentence);
    const tokenRange = findSceneTokenRange({
      sentenceTokens,
      transcriptTokens,
      startTokenIndex: transcriptTokenCursor,
      maxSkippedTokens: maxSkippedTokensPerMatch,
    });

    if (!tokenRange) {
      throw new Error(
        `Transkript konnte Szene ${index + 1} nicht eindeutig zuordnen: ${sceneInput.sentence}`,
      );
    }

    const firstWordIndex = transcriptTokens[tokenRange.firstTokenIndex].wordIndex;
    const lastWordIndex = transcriptTokens[tokenRange.lastTokenIndex].wordIndex;
    const sourceStartMs = preparedWords[firstWordIndex].startMs;
    const sourceEndMs = preparedWords[lastWordIndex].endMs;

    scenes.push({
      index,
      sentence: sceneInput.sentence,
      sourceStartMs,
      sourceEndMs,
      durationMs: sourceEndMs - sourceStartMs,
      words: toLocalWordTimestamps(
        preparedWords,
        firstWordIndex,
        lastWordIndex,
      ),
    });
    transcriptTokenCursor = tokenRange.lastTokenIndex + 1;
  });

  return scenes;
};

export const buildMotionTimelineFromTranscript = ({
  script,
  words,
  fps,
  gapFrames,
  qualityMode,
  maxCharactersPerScene,
  mergeShorterThan,
  maxSkippedTokensPerMatch,
  sceneDefaults = {},
  sceneOverrides = [],
}: BuildMotionTimelineFromTranscriptInput): BuildMotionTimelineFromTranscriptResult => {
  const sceneInputs = createMotionSceneInputsFromScript({
    script,
    maxCharactersPerScene,
    mergeShorterThan,
    sceneDefaults,
    sceneOverrides,
  });
  const transcriptScenes = mapMotionTranscriptToScenes({
    script,
    words,
    maxCharactersPerScene,
    mergeShorterThan,
    maxSkippedTokensPerMatch,
  });

  const timeline = buildMotionTimeline({
    fps,
    gapFrames,
    qualityMode,
    scenes: sceneInputs.map((sceneInput, index) => ({
      ...sceneInput,
      words: transcriptScenes[index].words,
    })),
  });

  return {timeline, transcriptScenes};
};
