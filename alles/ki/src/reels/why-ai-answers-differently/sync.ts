import rawSync from '../../../../../reels/2026-08-03_bis_2026-08-09/samstag/reel-01_warum-ki-unterschiedlich-antwortet/timeline/final-sync.json';
import rawPackage from '../../../../../reels/2026-08-03_bis_2026-08-09/samstag/reel-01_warum-ki-unterschiedlich-antwortet/timeline/codex-reel-package.json';
import type {SingleSentenceCaptionCue} from '../../components/SingleSentenceKaraokeCaption';

export type AnswerSceneId = 'scene-01' | 'scene-02' | 'scene-03' | 'scene-04' | 'scene-05' | 'scene-06' | 'scene-07' | 'scene-08';
export type AnswerSceneSync = {id: AnswerSceneId; startFrame: number; endFrame: number; speechStartFrame: number; speechEndFrame: number; resultHoldFrames: number; boundaryReferenceFrame: number; boundaryOffsetFrames: number};
export type AnswerBeatSync = {id: string; sceneId: AnswerSceneId; expression: string; transcriptStartFrame: number; animationStartFrame: number; resultFrame: number};

type RawSentence = {id: string; text: string; startFrame: number; endFrame: number; words: Array<{text: string; startFrame: number; endFrame: number}>};
type RawPair = {id: string; sceneId: string; startFrame: number; endFrame: number; sentences: [RawSentence, RawSentence]};

export const ANSWER_PACKAGE = rawPackage;
export const ANSWER_SYNC = rawSync;
export const ANSWER_COMPOSITION_ID = rawPackage.composition.id;
export const ANSWER_COVER_ID = rawPackage.composition.coverId;
export const ANSWER_WIDTH = rawPackage.composition.width;
export const ANSWER_HEIGHT = rawPackage.composition.height;
export const ANSWER_FPS = rawSync.fps;
export const ANSWER_DURATION = rawSync.composition.durationInFrames;
export const ANSWER_SCENES = rawSync.scenes as AnswerSceneSync[];
export const ANSWER_BEATS = rawSync.beats as AnswerBeatSync[];
export const ANSWER_SYNC_STATUS = rawSync.status;

export const ANSWER_CAPTION_CUES: SingleSentenceCaptionCue[] = (rawSync.captionPairs as RawPair[]).flatMap((pair) => {
  const [first, second] = pair.sentences;
  return [
    {
      id: `${pair.id}-sentence-1`,
      sceneId: pair.sceneId,
      startFrame: pair.startFrame,
      endFrame: second.startFrame,
      bottomPx: 320,
      mode: 'single-sentence-active-word' as const,
      sentence: first,
    },
    {
      id: `${pair.id}-sentence-2`,
      sceneId: pair.sceneId,
      startFrame: second.startFrame,
      endFrame: pair.endFrame,
      bottomPx: 320,
      mode: 'single-sentence-active-word' as const,
      sentence: second,
    },
  ];
});

export const answerScene = (sceneId: AnswerSceneId): AnswerSceneSync => {
  const scene = ANSWER_SCENES.find((item) => item.id === sceneId);
  if (!scene) throw new Error(`Fehlender Szenen-Sync: ${sceneId}`);
  return scene;
};

export const localAnswerBeat = (sceneId: AnswerSceneId, beatId: string): number => {
  const scene = answerScene(sceneId);
  const beat = ANSWER_BEATS.find((item) => item.sceneId === sceneId && item.id === beatId);
  if (!beat) throw new Error(`Fehlender Beat: ${sceneId}/${beatId}`);
  return beat.animationStartFrame - scene.startFrame;
};

export const localAnswerResult = (sceneId: AnswerSceneId, beatId: string): number => {
  const scene = answerScene(sceneId);
  const beat = ANSWER_BEATS.find((item) => item.sceneId === sceneId && item.id === beatId);
  if (!beat) throw new Error(`Fehlender Beat: ${sceneId}/${beatId}`);
  return beat.resultFrame - scene.startFrame;
};
