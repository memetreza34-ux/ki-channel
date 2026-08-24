import subtitleData from '../../../reels/2026-08-24_bis_2026-08-30/05_ChatGPT-kann-jetzt-Apple-Messages-durchsuchen/03-caption/subtitle-cues.json';
import reelData from '../../../reels/2026-08-24_bis_2026-08-30/05_ChatGPT-kann-jetzt-Apple-Messages-durchsuchen/06-projektdateien/reel.json';

export const APPLE_MESSAGES_COMPOSITION_ID = 'KI-ChatGPTAppleMessages';
export const APPLE_MESSAGES_FPS = 30;
export const APPLE_MESSAGES_WIDTH = 1080;
export const APPLE_MESSAGES_HEIGHT = 1920;
export const APPLE_MESSAGES_DURATION_IN_FRAMES = reelData.format.finalDurationInFrames ?? reelData.format.planningDurationInFrames;

export const MESSAGES_PALETTE = Object.freeze({
  ink:'#102033', graphite:'#172033', white:'#FFFFFF', cloud:'#F6F8FB',
  cyan:'#18C7D9', cyanSoft:'#DDF9FC', blue:'#3478F6', blueSoft:'#E7F0FF',
  green:'#20B26B', greenSoft:'#E6F8EF', orange:'#FF8A34', orangeSoft:'#FFF0E4',
  yellow:'#F4C542', yellowSoft:'#FFF8D8', purple:'#7657E8', purpleSoft:'#EFEAFF',
  red:'#E24A57', redSoft:'#FDE9EC',
} as const);

export type MessagesScene = {
  sceneId:'scene1'|'scene2'|'scene3'|'scene4'|'scene5';
  headline:string; startFrame:number; endFrame:number; accent:string; surface:string;
};

const surfaces: Record<MessagesScene['sceneId'],string> = {
  scene1: MESSAGES_PALETTE.cyanSoft,
  scene2: MESSAGES_PALETTE.blueSoft,
  scene3: MESSAGES_PALETTE.greenSoft,
  scene4: MESSAGES_PALETTE.orangeSoft,
  scene5: MESSAGES_PALETTE.purpleSoft,
};

export const APPLE_MESSAGES_SCENES: MessagesScene[] = reelData.scenes.map((scene)=>{
  const sceneId = scene.sceneId as MessagesScene['sceneId'];
  return {sceneId,headline:scene.title,startFrame:scene.startFrame,endFrame:scene.endFrame,accent:scene.accent,surface:surfaces[sceneId]};
});

export type MessagesWord={text:string;startFrame:number;endFrame:number};
export type MessagesCue={id:string;sceneId:MessagesScene['sceneId'];text:string;startFrame:number;endFrame:number;words?:MessagesWord[]};
export const APPLE_MESSAGES_SUBTITLES = subtitleData.cues as MessagesCue[];
