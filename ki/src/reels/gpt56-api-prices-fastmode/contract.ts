import reelData from '../../../reels/2026-08-24_bis_2026-08-30/05_GPT-5-6-API-Preise-und-Fast-Mode/06-projektdateien/reel.json';
import captionData from '../../../reels/2026-08-24_bis_2026-08-30/05_GPT-5-6-API-Preise-und-Fast-Mode/03-caption/subtitle-cues.json';
import sfxData from '../../../reels/2026-08-24_bis_2026-08-30/05_GPT-5-6-API-Preise-und-Fast-Mode/06-projektdateien/sfx-resolved.json';
import visualData from '../../../reels/2026-08-24_bis_2026-08-30/05_GPT-5-6-API-Preise-und-Fast-Mode/06-projektdateien/visual-assets-resolved.json';

export type GPT56Cue = {id:string;sceneId:string;sentenceId?:string;startFrame:number;endFrame:number;text:string};
export type GPT56Sfx = {id:string;sceneId:string;startFrame:number;durationInFrames:number;volume:number;staticFile:string};
export type GPT56Visual = {id:string;sceneId:string;staticFile?:string|null;attribution?:string|null;rightsStatus?:string|null;selectedTitle?:string|null};

export const GPT56_API_COMPOSITION_ID = reelData.compositionId;
export const GPT56_API_WIDTH = reelData.format.width;
export const GPT56_API_HEIGHT = reelData.format.height;
export const GPT56_API_FPS = reelData.format.fps;
export const GPT56_API_DURATION_IN_FRAMES = reelData.format.finalDurationInFrames ?? reelData.format.planningDurationInFrames;
export const GPT56_API_SCENES = reelData.scenes;
export const GPT56_API_CUES = (captionData as {cues?: GPT56Cue[]}).cues ?? [];
export const GPT56_API_SFX = (sfxData as {events?: GPT56Sfx[]}).events ?? [];
export const GPT56_API_VISUALS = (visualData as {assets?: GPT56Visual[]}).assets ?? [];
