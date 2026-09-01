import reelData from '../../../reels/2026-08-31_bis_2026-09-06/03_Grok-Bot-X-Integration/06-projektdateien/reel.json';
import captionData from '../../../reels/2026-08-31_bis_2026-09-06/03_Grok-Bot-X-Integration/03-caption/subtitle-cues.json';
import sfxData from '../../../reels/2026-08-31_bis_2026-09-06/03_Grok-Bot-X-Integration/06-projektdateien/sfx-resolved.json';

export type GrokXCue = {id:string;sceneId:string;sentenceId?:string;startFrame:number;endFrame:number;text:string};
export type GrokXSfx = {id:string;sceneId:string;startFrame:number;durationInFrames:number;volume:number;staticFile:string};

export const GROK_X_COMPOSITION_ID = reelData.compositionId;
export const GROK_X_WIDTH = reelData.format.width;
export const GROK_X_HEIGHT = reelData.format.height;
export const GROK_X_FPS = reelData.format.fps;
export const GROK_X_DURATION_IN_FRAMES = reelData.format.finalDurationInFrames ?? reelData.format.planningDurationInFrames;
export const GROK_X_SCENES = reelData.scenes;
export const GROK_X_CUES = (captionData as {cues?: GrokXCue[]}).cues ?? [];
export const GROK_X_SFX = (sfxData as {events?: GrokXSfx[]}).events ?? [];
