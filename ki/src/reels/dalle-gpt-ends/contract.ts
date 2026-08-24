import subtitleData from '../../../reels/2026-08-24_bis_2026-08-30/05_DALLE-GPT-wird-eingestellt/03-caption/subtitle-cues.json';
import reelData from '../../../reels/2026-08-24_bis_2026-08-30/05_DALLE-GPT-wird-eingestellt/06-projektdateien/reel.json';

export const DALLE_ENDS_COMPOSITION_ID = 'KI-DalleGptEnds';
export const DALLE_ENDS_FPS = 30;
export const DALLE_ENDS_WIDTH = 1080;
export const DALLE_ENDS_HEIGHT = 1920;
export const DALLE_ENDS_DURATION_IN_FRAMES = reelData.format.finalDurationInFrames ?? reelData.format.planningDurationInFrames;

export const DALLE_PALETTE = Object.freeze({
  ink:'#102033', white:'#FFFFFF', cloud:'#F7F9FC', cyan:'#18C7D9', cyanSoft:'#DDF9FC',
  green:'#20B26B', greenSoft:'#E6F8EF', orange:'#FF8A34', orangeSoft:'#FFF0E4',
  red:'#E24A57', redSoft:'#FDE9EC', purple:'#7657E8', purpleSoft:'#EFEAFF', yellow:'#F4C542', yellowSoft:'#FFF8D8'
} as const);

export type DalleSceneId = 'scene1'|'scene2'|'scene3'|'scene4'|'scene5';
export type DalleScene = {sceneId:DalleSceneId;headline:string;startFrame:number;endFrame:number;accent:string;};
export const DALLE_ENDS_SCENES = reelData.scenes.map((scene)=>({sceneId:scene.sceneId as DalleSceneId,headline:scene.title,startFrame:scene.startFrame,endFrame:scene.endFrame,accent:scene.accent})) as DalleScene[];
export type DalleWord={text:string;startFrame:number;endFrame:number};
export type DalleCue={id:string;sceneId:DalleSceneId;text:string;startFrame:number;endFrame:number;words?:DalleWord[]};
export const DALLE_ENDS_SUBTITLES = subtitleData.cues as DalleCue[];
