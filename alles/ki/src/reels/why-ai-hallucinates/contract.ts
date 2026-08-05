import rawPackage from '../../../../../reels/2026-08-03_bis_2026-08-09/mittwoch/reel-01_warum-ki-halluziniert/timeline/codex-reel-package.json';
import {FALLBACK_SUBTITLE_CUES} from './fallbackSubtitleCues';

export type HallucinationSceneId =
  | 'scene-01'
  | 'scene-02'
  | 'scene-03'
  | 'scene-04'
  | 'scene-05'
  | 'scene-06'
  | 'scene-07'
  | 'scene-08';

export type SubtitleEmphasis = 'none' | 'accent' | 'danger' | 'success';

export type SubtitleCue = {
  text: string;
  atFrame: number;
  emphasis: SubtitleEmphasis;
};

export type HallucinationScene = {
  id: HallucinationSceneId;
  type: 'image' | 'remotion';
  start: number;
  end: number;
  heading: string;
  animationId: string;
  layout: string;
  motion: string;
};

export const HALLUCINATION_REEL = rawPackage;
export const HALLUCINATION_REEL_ID = rawPackage.slug;
export const HALLUCINATION_COMPOSITION_ID = rawPackage.composition.id;
export const HALLUCINATION_WIDTH = rawPackage.composition.width;
export const HALLUCINATION_HEIGHT = rawPackage.composition.height;
export const HALLUCINATION_FPS = rawPackage.composition.fps;
export const HALLUCINATION_DURATION = rawPackage.composition.durationInFrames;
export const HALLUCINATION_SCENES = rawPackage.scenes as HallucinationScene[];
export const HALLUCINATION_CHECKPOINTS = rawPackage.checkpoints;
export const HALLUCINATION_AUDIO = rawPackage.audio;
export const TARGET_PLAYBACK_RATE = HALLUCINATION_AUDIO.playbackRate;

export const SUBTITLE_CUES: Record<HallucinationSceneId, readonly SubtitleCue[]> =
  Object.fromEntries(
    Object.entries(FALLBACK_SUBTITLE_CUES).map(([sceneId, words]) => [
      sceneId,
      words.map((word) => ({
        ...word,
        atFrame: Math.round(word.atFrame / TARGET_PLAYBACK_RATE),
      })),
    ]),
  ) as Record<HallucinationSceneId, readonly SubtitleCue[]>;

export const SCENE_BY_ID = Object.fromEntries(
  HALLUCINATION_SCENES.map((scene) => [scene.id, scene]),
) as Record<HallucinationSceneId, HallucinationScene>;

export const sceneDuration = (sceneId: HallucinationSceneId): number => {
  const scene = SCENE_BY_ID[sceneId];
  return scene.end - scene.start;
};

export const sceneLocalFrame = (
  globalFrame: number,
  sceneId: HallucinationSceneId,
): number => globalFrame - SCENE_BY_ID[sceneId].start;
