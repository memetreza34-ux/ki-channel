import rawReel from '../../../../../reels/2026-08-03_bis_2026-08-09/mittwoch/reel-01_warum-ki-halluziniert/timeline/reel.json';
import rawSubtitleCues from '../../../../../reels/2026-08-03_bis_2026-08-09/mittwoch/reel-01_warum-ki-halluziniert/04-caption/subtitle-cues.json';

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
  start: number;
  end: number;
  heading: string;
  animationId: string;
  layout: string;
  motion: string;
};

export const HALLUCINATION_REEL = rawReel;
export const HALLUCINATION_REEL_ID = rawReel.reelId;
export const HALLUCINATION_COMPOSITION_ID = rawReel.compositionId;
export const HALLUCINATION_WIDTH = rawReel.format.width;
export const HALLUCINATION_HEIGHT = rawReel.format.height;
export const HALLUCINATION_FPS = rawReel.format.fps;
export const HALLUCINATION_DURATION = rawReel.format.durationInFrames;
export const HALLUCINATION_SCENES = rawReel.scenes as HallucinationScene[];
export const HALLUCINATION_CHECKPOINTS = rawReel.checkpoints;
export const HALLUCINATION_AUDIO = rawReel.audio;

export const SOURCE_CUE_PLAYBACK_RATE = 1;
export const TARGET_PLAYBACK_RATE = HALLUCINATION_AUDIO.playbackRate;

const subtitleSource = rawSubtitleCues.scenes as Array<{
  sceneId: HallucinationSceneId;
  words: SubtitleCue[];
}>;

export const SUBTITLE_CUES: Record<HallucinationSceneId, readonly SubtitleCue[]> =
  Object.fromEntries(
    subtitleSource.map((scene) => [
      scene.sceneId,
      scene.words.map((word) => ({
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
