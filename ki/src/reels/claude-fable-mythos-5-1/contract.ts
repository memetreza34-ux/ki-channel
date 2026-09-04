import reelData from '../../../reels/2026-08-31_bis_2026-09-06/04_Donnerstag/01_Claude-Fable-5-1-Mythos-5-1/06-projektdateien/reel.json';
import captionData from '../../../reels/2026-08-31_bis_2026-09-06/04_Donnerstag/01_Claude-Fable-5-1-Mythos-5-1/03-caption/subtitle-cues.json';
import sfxData from '../../../reels/2026-08-31_bis_2026-09-06/04_Donnerstag/01_Claude-Fable-5-1-Mythos-5-1/06-projektdateien/sfx-resolved.json';

export type Claude51Cue={id:string;sceneId:string;sentenceId?:string;startFrame:number;endFrame:number;text:string};
export type Claude51Sfx={id:string;sceneId:string;startFrame:number;durationInFrames:number;volume:number;staticFile:string};

export const CLAUDE_51_COMPOSITION_ID=reelData.compositionId;
export const CLAUDE_51_WIDTH=reelData.format.width;
export const CLAUDE_51_HEIGHT=reelData.format.height;
export const CLAUDE_51_FPS=reelData.format.fps;
export const CLAUDE_51_DURATION_IN_FRAMES=reelData.format.finalDurationInFrames??reelData.format.planningDurationInFrames;
export const CLAUDE_51_SCENES=reelData.scenes;
export const CLAUDE_51_CUES=(captionData as {cues?:Claude51Cue[]}).cues??[];
export const CLAUDE_51_SFX=(sfxData as {events?:Claude51Sfx[]}).events??[];
