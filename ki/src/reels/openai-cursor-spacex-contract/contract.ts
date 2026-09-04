import reelData from '../../../reels/2026-08-31_bis_2026-09-06/01_Montag/01_OpenAI-Cursor-SpaceX-Vertrag/06-projektdateien/reel.json';
import captionData from '../../../reels/2026-08-31_bis_2026-09-06/01_Montag/01_OpenAI-Cursor-SpaceX-Vertrag/03-caption/subtitle-cues.json';
import sfxData from '../../../reels/2026-08-31_bis_2026-09-06/01_Montag/01_OpenAI-Cursor-SpaceX-Vertrag/06-projektdateien/sfx-resolved.json';

export type OpenAICursorCue = {id:string;sceneId:string;sentenceId?:string;startFrame:number;endFrame:number;text:string};
export type OpenAICursorSfx = {id:string;sceneId:string;startFrame:number;durationInFrames:number;volume:number;staticFile:string};

export const OPENAI_CURSOR_COMPOSITION_ID = reelData.compositionId;
export const OPENAI_CURSOR_WIDTH = reelData.format.width;
export const OPENAI_CURSOR_HEIGHT = reelData.format.height;
export const OPENAI_CURSOR_FPS = reelData.format.fps;
export const OPENAI_CURSOR_DURATION_IN_FRAMES = reelData.format.finalDurationInFrames ?? reelData.format.planningDurationInFrames;
export const OPENAI_CURSOR_SCENES = reelData.scenes;
export const OPENAI_CURSOR_CUES = (captionData as {cues?: OpenAICursorCue[]}).cues ?? [];
export const OPENAI_CURSOR_SFX = (sfxData as {events?: OpenAICursorSfx[]}).events ?? [];
