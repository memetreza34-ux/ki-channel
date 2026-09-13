export type VoiceTimingWord = {
  text: string;
  startFrame: number;
  endFrame: number;
};

export type VoiceTimingCue = {
  sceneId: string;
  sentenceId: string;
  startFrame: number;
  endFrame: number;
  text: string;
  words?: readonly VoiceTimingWord[];
};

export type VoiceTimingScene = {
  sceneId: string;
  startFrame: number;
  endFrame: number;
};

export type LocalTimingWindow = {start: number; end: number};

const clampFrame = (value: number, min: number, max: number) => Math.max(min, Math.min(max, Math.round(value)));
const normalizeToken = (value: string) =>
  value
    .normalize('NFKC')
    .toLocaleLowerCase('de-DE')
    .replace(/[–—]/g, '-')
    .replace(/[^\p{L}\p{N}]+/gu, '')
    .trim();

const phraseTokens = (value: string) => value.split(/\s+/).map(normalizeToken).filter(Boolean);

export const createVoiceTiming = (cues: readonly VoiceTimingCue[], scenes: readonly VoiceTimingScene[]) => {
  const sceneById = new Map(scenes.map((scene) => [scene.sceneId, scene]));

  const scene = (sceneId: string) => {
    const found = sceneById.get(sceneId);
    if (!found) throw new Error(`Unknown sceneId: ${sceneId}`);
    return found;
  };

  const sentenceCues = (sceneId: string, sentenceId: string) =>
    cues
      .filter((cue) => cue.sceneId === sceneId && cue.sentenceId === sentenceId)
      .sort((a, b) => a.startFrame - b.startFrame);

  const sentenceWindow = (
    sceneId: string,
    sentenceId: string,
    fallbackStartRatio: number,
    fallbackEndRatio: number,
  ): LocalTimingWindow => {
    const currentScene = scene(sceneId);
    const duration = Math.max(1, currentScene.endFrame - currentScene.startFrame);
    const matches = sentenceCues(sceneId, sentenceId);
    if (matches.length > 0) {
      const absoluteStart = Math.min(...matches.map((cue) => cue.startFrame));
      const absoluteEnd = Math.max(...matches.map((cue) => cue.endFrame));
      return {
        start: clampFrame(absoluteStart - currentScene.startFrame, 0, duration - 1),
        end: clampFrame(absoluteEnd - currentScene.startFrame, 1, duration),
      };
    }
    return {
      start: clampFrame(duration * fallbackStartRatio, 0, duration - 1),
      end: clampFrame(duration * fallbackEndRatio, 1, duration),
    };
  };

  const phraseFrame = (
    sceneId: string,
    sentenceId: string,
    phrase: string,
    fallbackRatio: number,
  ): number => {
    const currentScene = scene(sceneId);
    const duration = Math.max(1, currentScene.endFrame - currentScene.startFrame);
    const matches = sentenceCues(sceneId, sentenceId);
    const wanted = phraseTokens(phrase);

    if (wanted.length > 0) {
      const alignedWords = matches
        .flatMap((cue) => cue.words ?? [])
        .filter((word) => Number.isFinite(word.startFrame) && Number.isFinite(word.endFrame));
      const normalized = alignedWords.map((word) => normalizeToken(word.text));
      for (let index = 0; index <= normalized.length - wanted.length; index++) {
        let matchesPhrase = true;
        for (let offset = 0; offset < wanted.length; offset++) {
          if (normalized[index + offset] !== wanted[offset]) {
            matchesPhrase = false;
            break;
          }
        }
        if (matchesPhrase) {
          return clampFrame(alignedWords[index].startFrame - currentScene.startFrame, 0, duration - 1);
        }
      }
    }

    return clampFrame(duration * fallbackRatio, 0, duration - 1);
  };

  const afterPhrase = (
    sceneId: string,
    sentenceId: string,
    phrase: string,
    fallbackRatio: number,
    offsetFrames = 0,
  ) => {
    const currentScene = scene(sceneId);
    const duration = Math.max(1, currentScene.endFrame - currentScene.startFrame);
    return clampFrame(phraseFrame(sceneId, sentenceId, phrase, fallbackRatio) + offsetFrames, 0, duration - 1);
  };

  return {scene, sentenceWindow, phraseFrame, afterPhrase};
};
