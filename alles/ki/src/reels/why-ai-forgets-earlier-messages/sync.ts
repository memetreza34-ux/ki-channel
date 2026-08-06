import rawSync from '../../../../../reels/2026-08-03_bis_2026-08-09/freitag/reel-01_warum-ki-fruehere-nachrichten-vergisst/timeline/final-sync.json';
import rawPackage from '../../../../../reels/2026-08-03_bis_2026-08-09/freitag/reel-01_warum-ki-fruehere-nachrichten-vergisst/timeline/codex-reel-package.json';
import type {StableSentenceCaptionCue} from '../../components/StableSentenceCaption';

export type ContextSceneId =
  | 'scene-01'
  | 'scene-02'
  | 'scene-03'
  | 'scene-04'
  | 'scene-05'
  | 'scene-06'
  | 'scene-07'
  | 'scene-08';

export type ContextSceneSync = {
  id: ContextSceneId;
  startFrame: number;
  endFrame: number;
  speechStartFrame: number;
  speechEndFrame: number;
  resultHoldFrames: number;
  boundaryReferenceFrame: number;
  boundaryOffsetFrames: number;
};

export type ContextBeatSync = {
  id: string;
  sceneId: ContextSceneId;
  expression: string;
  transcriptStartFrame: number;
  animationStartFrame: number;
  resultFrame: number;
};

export const CONTEXT_PACKAGE = rawPackage;
export const CONTEXT_SYNC = rawSync;
export const CONTEXT_COMPOSITION_ID = rawPackage.composition.id;
export const CONTEXT_COVER_ID = rawPackage.composition.coverId;
export const CONTEXT_WIDTH = rawPackage.composition.width;
export const CONTEXT_HEIGHT = rawPackage.composition.height;
export const CONTEXT_FPS = rawSync.fps;
export const CONTEXT_DURATION = rawSync.composition.durationInFrames;
export const CONTEXT_SCENES = rawSync.scenes as ContextSceneSync[];
export const CONTEXT_CAPTIONS = rawSync.captions as StableSentenceCaptionCue[];
export const CONTEXT_BEATS = rawSync.beats as ContextBeatSync[];
export const CONTEXT_SYNC_STATUS = rawSync.status;

export const sceneSync = (sceneId: ContextSceneId): ContextSceneSync => {
  const scene = CONTEXT_SCENES.find((item) => item.id === sceneId);
  if (!scene) throw new Error(`Fehlender Szenen-Sync: ${sceneId}`);
  return scene;
};

export const localBeatFrame = (sceneId: ContextSceneId, beatId: string): number => {
  const scene = sceneSync(sceneId);
  const beat = CONTEXT_BEATS.find((item) => item.sceneId === sceneId && item.id === beatId);
  if (!beat) throw new Error(`Fehlender Beat-Sync: ${sceneId}/${beatId}`);
  return beat.animationStartFrame - scene.startFrame;
};

export const localResultFrame = (sceneId: ContextSceneId, beatId: string): number => {
  const scene = sceneSync(sceneId);
  const beat = CONTEXT_BEATS.find((item) => item.sceneId === sceneId && item.id === beatId);
  if (!beat) throw new Error(`Fehlender Beat-Sync: ${sceneId}/${beatId}`);
  return beat.resultFrame - scene.startFrame;
};
