import reelData from '../../../reels/2026-08-24_bis_2026-08-30/05_OpenAI-o3-verschwindet-aus-ChatGPT/06-projektdateien/reel.json';
import captionData from '../../../reels/2026-08-24_bis_2026-08-30/05_OpenAI-o3-verschwindet-aus-ChatGPT/03-caption/subtitle-cues.json';

export const O3_SUNSET_COMPOSITION_ID = reelData.compositionId;
export const O3_SUNSET_WIDTH = reelData.format.width;
export const O3_SUNSET_HEIGHT = reelData.format.height;
export const O3_SUNSET_FPS = reelData.format.fps;
export const O3_SUNSET_DURATION_IN_FRAMES =
  reelData.format.finalDurationInFrames ?? reelData.format.planningDurationInFrames;

export type O3Scene = (typeof reelData.scenes)[number];
export type O3Cue = (typeof captionData.cues)[number];

export const O3_SUNSET_SCENES = reelData.scenes as O3Scene[];
export const O3_SUNSET_CUES = captionData.cues as O3Cue[];
