import rawSync from '../../../reels/2026-08-03_bis_2026-08-09/03_Warum-KI-nicht-weiss-was-heute-passiert/06-projektdateien/final-sync.json';
import rawPackage from '../../../reels/2026-08-03_bis_2026-08-09/03_Warum-KI-nicht-weiss-was-heute-passiert/06-projektdateien/reel.json';
import type {FeedSafeCaptionCue} from '../FeedSafeActiveWordCaption';

export type TodaySceneId =
  | 'scene-01'
  | 'scene-02'
  | 'scene-03'
  | 'scene-04'
  | 'scene-05'
  | 'scene-06'
  | 'scene-07'
  | 'scene-08';

export type TodaySceneSync = {
  id: TodaySceneId;
  startFrame: number;
  endFrame: number;
  speechStartFrame: number;
  speechEndFrame: number;
  resultHoldFrames: number;
  boundaryReferenceFrame: number;
  boundaryOffsetFrames: number;
};

export type TodayBeatSync = {
  id: string;
  sceneId: TodaySceneId;
  expression: string;
  transcriptStartFrame: number;
  animationStartFrame: number;
  resultFrame: number;
};

type RawSentence = {
  id: string;
  text: string;
  startFrame: number;
  endFrame: number;
  words: Array<{text: string; startFrame: number; endFrame: number}>;
};

type RawPair = {
  id: string;
  sceneId: string;
  startFrame: number;
  endFrame: number;
  sentences: [RawSentence, RawSentence];
};

export const TODAY_PACKAGE = rawPackage;
export const TODAY_SYNC = rawSync;
export const TODAY_COMPOSITION_ID = rawPackage.composition.id;
export const TODAY_COVER_ID = rawPackage.composition.coverId;
export const TODAY_WIDTH = rawPackage.composition.width;
export const TODAY_HEIGHT = rawPackage.composition.height;
export const TODAY_FPS = rawSync.fps;
export const TODAY_DURATION = rawSync.composition.durationInFrames;
export const TODAY_SCENES = rawSync.scenes as TodaySceneSync[];
export const TODAY_BEATS = rawSync.beats as TodayBeatSync[];
export const TODAY_SYNC_STATUS = rawSync.status;

export const TODAY_CAPTION_CUES: FeedSafeCaptionCue[] = (rawSync.captionPairs as unknown as RawPair[]).flatMap((pair) => {
  const [first, second] = pair.sentences;
  return [
    {
      id: `${pair.id}-sentence-1`,
      sceneId: pair.sceneId,
      startFrame: pair.startFrame,
      endFrame: second.startFrame,
      words: first.words,
    },
    {
      id: `${pair.id}-sentence-2`,
      sceneId: pair.sceneId,
      startFrame: second.startFrame,
      endFrame: pair.endFrame,
      words: second.words,
    },
  ];
});

export const todayScene = (sceneId: TodaySceneId): TodaySceneSync => {
  const scene = TODAY_SCENES.find((item) => item.id === sceneId);
  if (!scene) throw new Error(`Fehlender Szenen-Sync: ${sceneId}`);
  return scene;
};

export const localTodayBeat = (sceneId: TodaySceneId, beatId: string): number => {
  const scene = todayScene(sceneId);
  const beat = TODAY_BEATS.find((item) => item.sceneId === sceneId && item.id === beatId);
  if (!beat) throw new Error(`Fehlender Beat: ${sceneId}/${beatId}`);
  return beat.animationStartFrame - scene.startFrame;
};

export const localTodayResult = (sceneId: TodaySceneId, beatId: string): number => {
  const scene = todayScene(sceneId);
  const beat = TODAY_BEATS.find((item) => item.sceneId === sceneId && item.id === beatId);
  if (!beat) throw new Error(`Fehlender Beat: ${sceneId}/${beatId}`);
  return beat.resultFrame - scene.startFrame;
};
