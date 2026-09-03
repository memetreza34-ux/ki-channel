import reelData from '../../../reels/2026-08-31_bis_2026-09-06/05_Freitag/01_Google-WeatherNext-3/06-projektdateien/reel.json';
import captionData from '../../../reels/2026-08-31_bis_2026-09-06/05_Freitag/01_Google-WeatherNext-3/03-caption/subtitle-cues.json';
import sfxData from '../../../reels/2026-08-31_bis_2026-09-06/05_Freitag/01_Google-WeatherNext-3/06-projektdateien/sfx-resolved.json';

export type WeatherNextCue={id:string;sceneId:string;sentenceId?:string;startFrame:number;endFrame:number;text:string};
export type WeatherNextSfx={id:string;sceneId:string;startFrame:number;durationInFrames:number;volume:number;staticFile:string};

export const WEATHER_NEXT_3_COMPOSITION_ID=reelData.compositionId;
export const WEATHER_NEXT_3_WIDTH=reelData.format.width;
export const WEATHER_NEXT_3_HEIGHT=reelData.format.height;
export const WEATHER_NEXT_3_FPS=reelData.format.fps;
export const WEATHER_NEXT_3_DURATION_IN_FRAMES=reelData.format.finalDurationInFrames??reelData.format.planningDurationInFrames;
export const WEATHER_NEXT_3_SCENES=reelData.scenes;
export const WEATHER_NEXT_3_CUES=(captionData as {cues?:WeatherNextCue[]}).cues??[];
export const WEATHER_NEXT_3_SFX=(sfxData as {events?:WeatherNextSfx[]}).events??[];
