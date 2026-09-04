import reelData from '../../../reels/2026-08-31_bis_2026-09-06/02_Dienstag/01_Google-Flow-Gemini-Omni-1-1-Flash/06-projektdateien/reel.json';
import captionData from '../../../reels/2026-08-31_bis_2026-09-06/02_Dienstag/01_Google-Flow-Gemini-Omni-1-1-Flash/03-caption/subtitle-cues.json';
import sfxData from '../../../reels/2026-08-31_bis_2026-09-06/02_Dienstag/01_Google-Flow-Gemini-Omni-1-1-Flash/06-projektdateien/sfx-resolved.json';

export type GeminiOmniCue = {id:string;sceneId:string;sentenceId?:string;startFrame:number;endFrame:number;text:string};
export type GeminiOmniSfx = {id:string;sceneId:string;startFrame:number;durationInFrames:number;volume:number;staticFile:string};

export const GEMINI_OMNI_COMPOSITION_ID = reelData.compositionId;
export const GEMINI_OMNI_WIDTH = reelData.format.width;
export const GEMINI_OMNI_HEIGHT = reelData.format.height;
export const GEMINI_OMNI_FPS = reelData.format.fps;
export const GEMINI_OMNI_DURATION_IN_FRAMES = reelData.format.finalDurationInFrames ?? reelData.format.planningDurationInFrames;
export const GEMINI_OMNI_SCENES = reelData.scenes;
export const GEMINI_OMNI_CUES = (captionData as {cues?: GeminiOmniCue[]}).cues ?? [];
export const GEMINI_OMNI_SFX = (sfxData as {events?: GeminiOmniSfx[]}).events ?? [];
