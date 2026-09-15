import subtitleData from '../../../reels/2026-08-24_bis_2026-08-30/04_ChatGPT-Study-Mode-statt-Sofortloesung/03-caption/subtitle-cues.json';
import reelData from '../../../reels/2026-08-24_bis_2026-08-30/04_ChatGPT-Study-Mode-statt-Sofortloesung/06-projektdateien/reel.json';

export const STUDY_MODE_COMPOSITION_ID = 'KI-ChatGPTStudyMode';
export const STUDY_MODE_FPS = 30;
export const STUDY_MODE_WIDTH = 1080;
export const STUDY_MODE_HEIGHT = 1920;
export const STUDY_MODE_DURATION_IN_FRAMES = reelData.format.finalDurationInFrames ?? reelData.format.planningDurationInFrames;

export const STUDY_PALETTE = Object.freeze({
  ink: '#102033',
  graphite: '#172033',
  cyan: '#18C7D9',
  cyanSoft: '#DDF9FC',
  blue: '#3478F6',
  blueSoft: '#E7F0FF',
  green: '#20B26B',
  greenSoft: '#E6F8EF',
  orange: '#FF8A34',
  orangeSoft: '#FFF0E4',
  yellow: '#F4C542',
  yellowSoft: '#FFF8D8',
  red: '#E24A57',
  redSoft: '#FDE9EC',
  purple: '#7657E8',
  purpleSoft: '#EFEAFF',
  white: '#FFFFFF',
  cloud: '#F6F8FB',
} as const);

export type StudyScene = {
  sceneId: 'scene1' | 'scene2' | 'scene3' | 'scene4' | 'scene5';
  headline: string;
  startFrame: number;
  endFrame: number;
  accent: string;
  surface: string;
};

const surfaceByScene: Record<StudyScene['sceneId'], string> = {
  scene1: STUDY_PALETTE.cyanSoft,
  scene2: STUDY_PALETTE.orangeSoft,
  scene3: STUDY_PALETTE.greenSoft,
  scene4: STUDY_PALETTE.blueSoft,
  scene5: STUDY_PALETTE.purpleSoft,
};

export const STUDY_MODE_SCENES: StudyScene[] = reelData.scenes.map((scene) => {
  const sceneId = scene.sceneId as StudyScene['sceneId'];
  return {
    sceneId,
    headline: scene.title,
    startFrame: scene.startFrame,
    endFrame: scene.endFrame,
    accent: scene.accent,
    surface: surfaceByScene[sceneId],
  };
});

export type StudyWord = {text:string;startFrame:number;endFrame:number};
export type StudyCue = {
  id:string;
  sceneId:StudyScene['sceneId'];
  text:string;
  startFrame:number;
  endFrame:number;
  words?:StudyWord[];
};

export const STUDY_MODE_SUBTITLES = subtitleData.cues as StudyCue[];
