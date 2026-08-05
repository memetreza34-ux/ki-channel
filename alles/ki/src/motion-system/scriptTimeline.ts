import type {BuildMotionSceneInput} from './runtime';
import {
  buildMotionTimeline,
  type MotionTimeline,
} from './timeline';

export const MOTION_SCRIPT_LIMITS = {
  minCharactersPerScene: 40,
  maxCharactersPerScene: 220,
  defaultCharactersPerScene: 180,
  maxScenes: 100,
} as const;

type MotionScriptSceneOptions = Omit<
  BuildMotionSceneInput,
  'sentence' | 'fps'
>;

export type SegmentMotionScriptOptions = {
  maxCharactersPerScene?: number;
  mergeShorterThan?: number;
};

export type BuildMotionTimelineFromScriptInput = SegmentMotionScriptOptions & {
  script: string;
  fps?: number;
  gapFrames?: number;
  sceneDefaults?: MotionScriptSceneOptions;
  sceneOverrides?: MotionScriptSceneOptions[];
};

const ABBREVIATIONS = new Set([
  'z. b.',
  'd. h.',
  'u. a.',
  'bzw.',
  'ca.',
  'etc.',
  'dr.',
  'prof.',
  'nr.',
  'vgl.',
  'abs.',
]);

const INITIALISM_PREFIXES = new Set(['z', 'd', 'u']);
const CLOSING_PUNCTUATION = new Set(['"', "'", '”', '’', ')', ']', '}']);

const normalizeWhitespace = (value: string): string =>
  value.replace(/\s+/g, ' ').trim();

const tailBefore = (value: string, endIndex: number): string =>
  normalizeWhitespace(value.slice(Math.max(0, endIndex - 14), endIndex + 1))
    .toLowerCase();

const isInitialismPrefixPeriod = (value: string, index: number): boolean => {
  const beforeMatch = value
    .slice(0, index)
    .match(/(?:^|\s)([a-zäöü])$/i);
  if (!beforeMatch || !INITIALISM_PREFIXES.has(beforeMatch[1].toLowerCase())) {
    return false;
  }

  return /^\s*[a-zäöü]\./i.test(value.slice(index + 1));
};

const isAbbreviationPeriod = (value: string, index: number): boolean => {
  const tail = tailBefore(value, index);
  return (
    isInitialismPrefixPeriod(value, index) ||
    [...ABBREVIATIONS].some((abbreviation) => tail.endsWith(abbreviation))
  );
};

const nextBoundaryIndex = (value: string, startIndex: number): number => {
  let index = startIndex;
  while (index < value.length && CLOSING_PUNCTUATION.has(value[index])) {
    index += 1;
  }
  return index;
};

const splitAtSentenceBoundaries = (script: string): string[] => {
  const segments: string[] = [];
  let current = '';

  const flush = (): void => {
    const normalized = normalizeWhitespace(current);
    if (normalized) segments.push(normalized);
    current = '';
  };

  for (let index = 0; index < script.length; index += 1) {
    const character = script[index];

    if (character === '\r' || character === '\n') {
      flush();
      if (character === '\r' && script[index + 1] === '\n') index += 1;
      continue;
    }

    current += character;
    if (!['.', '!', '?'].includes(character)) continue;
    if (character === '.' && isAbbreviationPeriod(script, index)) continue;

    const afterClosers = nextBoundaryIndex(script, index + 1);
    const nextCharacter = script[afterClosers];
    const isBoundary =
      afterClosers >= script.length ||
      nextCharacter === '\r' ||
      nextCharacter === '\n' ||
      /\s/.test(nextCharacter);

    if (!isBoundary) continue;

    while (
      index + 1 < script.length &&
      CLOSING_PUNCTUATION.has(script[index + 1])
    ) {
      index += 1;
      current += script[index];
    }
    flush();
  }

  flush();
  return segments;
};

const splitOversizedToken = (token: string, maximum: number): string[] => {
  const pieces: string[] = [];
  for (let index = 0; index < token.length; index += maximum) {
    pieces.push(token.slice(index, index + maximum));
  }
  return pieces;
};

const chunkSegment = (segment: string, maximum: number): string[] => {
  if (segment.length <= maximum) return [segment];

  const chunks: string[] = [];
  let current = '';
  const tokens = segment.split(/\s+/).flatMap((token) =>
    token.length > maximum ? splitOversizedToken(token, maximum) : [token],
  );

  for (const token of tokens) {
    const candidate = current ? `${current} ${token}` : token;
    if (candidate.length <= maximum) {
      current = candidate;
      continue;
    }

    if (current) chunks.push(current);
    current = token;
  }

  if (current) chunks.push(current);
  return chunks;
};

const mergeShortSegments = (
  segments: string[],
  maximum: number,
  threshold: number,
): string[] => {
  if (threshold <= 0) return segments;

  const merged: string[] = [];
  for (const segment of segments) {
    const previous = merged[merged.length - 1];
    if (
      segment.length < threshold &&
      previous &&
      `${previous} ${segment}`.length <= maximum
    ) {
      merged[merged.length - 1] = `${previous} ${segment}`;
    } else {
      merged.push(segment);
    }
  }
  return merged;
};

const assertSegmentationOptions = (
  maximum: number,
  mergeShorterThan: number,
): void => {
  if (
    !Number.isInteger(maximum) ||
    maximum < MOTION_SCRIPT_LIMITS.minCharactersPerScene ||
    maximum > MOTION_SCRIPT_LIMITS.maxCharactersPerScene
  ) {
    throw new Error(
      `maxCharactersPerScene muss eine ganze Zahl zwischen ${MOTION_SCRIPT_LIMITS.minCharactersPerScene} und ${MOTION_SCRIPT_LIMITS.maxCharactersPerScene} sein.`,
    );
  }

  if (
    !Number.isInteger(mergeShorterThan) ||
    mergeShorterThan < 0 ||
    mergeShorterThan > maximum
  ) {
    throw new Error(
      'mergeShorterThan muss eine ganze Zahl zwischen 0 und maxCharactersPerScene sein.',
    );
  }
};

export const segmentMotionScript = (
  script: string,
  {
    maxCharactersPerScene = MOTION_SCRIPT_LIMITS.defaultCharactersPerScene,
    mergeShorterThan = 0,
  }: SegmentMotionScriptOptions = {},
): string[] => {
  if (!script.trim()) {
    throw new Error('Motion-Skript darf nicht leer sein.');
  }

  assertSegmentationOptions(maxCharactersPerScene, mergeShorterThan);
  const segmented = splitAtSentenceBoundaries(script).flatMap((segment) =>
    chunkSegment(segment, maxCharactersPerScene),
  );
  const scenes = mergeShortSegments(
    segmented,
    maxCharactersPerScene,
    mergeShorterThan,
  );

  if (scenes.length > MOTION_SCRIPT_LIMITS.maxScenes) {
    throw new Error(
      `Motion-Skript erzeugt mehr als ${MOTION_SCRIPT_LIMITS.maxScenes} Szenen.`,
    );
  }

  return scenes;
};

export const createMotionSceneInputsFromScript = ({
  script,
  maxCharactersPerScene,
  mergeShorterThan,
  sceneDefaults = {},
  sceneOverrides = [],
}: Omit<BuildMotionTimelineFromScriptInput, 'fps' | 'gapFrames'>): BuildMotionSceneInput[] => {
  const sentences = segmentMotionScript(script, {
    maxCharactersPerScene,
    mergeShorterThan,
  });

  if (sceneOverrides.length > sentences.length) {
    throw new Error(
      `Es wurden ${sceneOverrides.length} Szenen-Anpassungen für nur ${sentences.length} Szenen angegeben.`,
    );
  }

  return sentences.map((sentence, index) => ({
    ...sceneDefaults,
    ...sceneOverrides[index],
    sentence,
  }));
};

export const buildMotionTimelineFromScript = ({
  script,
  fps,
  gapFrames,
  maxCharactersPerScene,
  mergeShorterThan,
  sceneDefaults,
  sceneOverrides,
}: BuildMotionTimelineFromScriptInput): MotionTimeline =>
  buildMotionTimeline({
    fps,
    gapFrames,
    scenes: createMotionSceneInputsFromScript({
      script,
      maxCharactersPerScene,
      mergeShorterThan,
      sceneDefaults,
      sceneOverrides,
    }),
  });
