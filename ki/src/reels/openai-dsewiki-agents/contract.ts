import reelData from '../../../reels/2026-08-31_bis_2026-09-06/06_Samstag/01_OpenAI-DseWiki-Agenten/06-projektdateien/reel.json';
import captionData from '../../../reels/2026-08-31_bis_2026-09-06/06_Samstag/01_OpenAI-DseWiki-Agenten/03-caption/subtitle-cues.json';
import sfxData from '../../../reels/2026-08-31_bis_2026-09-06/06_Samstag/01_OpenAI-DseWiki-Agenten/06-projektdateien/sfx-resolved.json';

export type DseWikiCue={id:string;sceneId:string;sentenceId?:string;startFrame:number;endFrame:number;text:string};
export type DseWikiSfx={id:string;sceneId:string;startFrame:number;durationInFrames:number;volume:number;staticFile:string};

export const DSEWIKI_COMPOSITION_ID=reelData.compositionId;
export const DSEWIKI_WIDTH=reelData.format.width;
export const DSEWIKI_HEIGHT=reelData.format.height;
export const DSEWIKI_FPS=reelData.format.fps;
export const DSEWIKI_DURATION_IN_FRAMES=reelData.format.finalDurationInFrames??reelData.format.planningDurationInFrames;
export const DSEWIKI_SCENES=reelData.scenes;
export const DSEWIKI_CUES=(captionData as {cues?:DseWikiCue[]}).cues??[];
export const DSEWIKI_SFX=(sfxData as {events?:DseWikiSfx[]}).events??[];
