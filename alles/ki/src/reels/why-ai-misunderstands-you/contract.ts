import rawPackage from '../../../../../reels/2026-08-03_bis_2026-08-09/donnerstag/reel-01_warum-ki-dich-missversteht/timeline/codex-reel-package.json';

export type MisunderstandsSceneId =
  | 'scene-01'
  | 'scene-02'
  | 'scene-03'
  | 'scene-04'
  | 'scene-05'
  | 'scene-06'
  | 'scene-07'
  | 'scene-08'
  | 'scene-09';

export type MisunderstandsScene = {
  id: MisunderstandsSceneId;
  type: 'remotion';
  start: number;
  end: number;
  heading: string;
  purpose: string;
  animationId: string;
  layout: string;
  motion: string;
  minimumResultHoldSeconds: number;
};

export const MISUNDERSTANDS_REEL = rawPackage;
export const MISUNDERSTANDS_COMPOSITION_ID = rawPackage.composition.id;
export const MISUNDERSTANDS_COVER_ID = rawPackage.composition.coverId;
export const MISUNDERSTANDS_WIDTH = rawPackage.composition.width;
export const MISUNDERSTANDS_HEIGHT = rawPackage.composition.height;
export const MISUNDERSTANDS_FPS = rawPackage.composition.fps;
export const MISUNDERSTANDS_DURATION = rawPackage.composition.durationInFrames;
export const MISUNDERSTANDS_AUDIO = rawPackage.audio;
export const MISUNDERSTANDS_SCENES = rawPackage.scenes as MisunderstandsScene[];
export const MISUNDERSTANDS_CHECKPOINTS = rawPackage.checkpoints;

export const SCENE_BY_ID = Object.fromEntries(
  MISUNDERSTANDS_SCENES.map((scene) => [scene.id, scene]),
) as Record<MisunderstandsSceneId, MisunderstandsScene>;

export const sceneDuration = (sceneId: MisunderstandsSceneId): number => {
  const scene = SCENE_BY_ID[sceneId];
  return scene.end - scene.start;
};
