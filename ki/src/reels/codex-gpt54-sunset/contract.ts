import reelData from '../../../reels/2026-08-24_bis_2026-08-30/06_Codex-GPT-5-4-verschwindet-am-31-August/06-projektdateien/reel.json';
import captionData from '../../../reels/2026-08-24_bis_2026-08-30/06_Codex-GPT-5-4-verschwindet-am-31-August/03-caption/subtitle-cues.json';
import sfxData from '../../../reels/2026-08-24_bis_2026-08-30/06_Codex-GPT-5-4-verschwindet-am-31-August/06-projektdateien/sfx-resolved.json';
import visualData from '../../../reels/2026-08-24_bis_2026-08-30/06_Codex-GPT-5-4-verschwindet-am-31-August/06-projektdateien/visual-assets-resolved.json';

export type CodexSunsetCue = {id:string;sceneId:string;sentenceId?:string;startFrame:number;endFrame:number;text:string};
export type CodexSunsetSfx = {id:string;sceneId:string;startFrame:number;durationInFrames:number;volume:number;staticFile:string;selectedRole?:string;soundId?:string};
export type CodexSunsetVisual = {id:string;sceneId:string;staticFile?:string|null;attribution?:string|null;rightsStatus?:string|null};

export const CODEX_SUNSET_COMPOSITION_ID = reelData.compositionId;
export const CODEX_SUNSET_WIDTH = reelData.format.width;
export const CODEX_SUNSET_HEIGHT = reelData.format.height;
export const CODEX_SUNSET_FPS = reelData.format.fps;
export const CODEX_SUNSET_DURATION_IN_FRAMES = reelData.format.finalDurationInFrames ?? reelData.format.planningDurationInFrames;

export const CODEX_SUNSET_SCENES = reelData.scenes;
export const CODEX_SUNSET_CUES = (captionData as {cues?: CodexSunsetCue[]}).cues ?? [];
export const CODEX_SUNSET_SFX = (sfxData as {events?: CodexSunsetSfx[]}).events ?? [];
export const CODEX_SUNSET_VISUALS = (visualData as {assets?: CodexSunsetVisual[]}).assets ?? [];
