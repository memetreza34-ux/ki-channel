import subtitleData from '../../../reels/2026-08-24_bis_2026-08-30/04_ChatGPT-Study-Mode-statt-Sofortloesung/03-caption/subtitle-cues.json';

export const STUDY_MODE_COMPOSITION_ID = 'KI-ChatGPTStudyMode';
export const STUDY_MODE_FPS = 30;
export const STUDY_MODE_WIDTH = 1080;
export const STUDY_MODE_HEIGHT = 1920;
export const STUDY_MODE_PLANNING_DURATION_IN_FRAMES = 1950;

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

export const STUDY_MODE_SCENES: StudyScene[] = [
  {sceneId:'scene1',headline:'Study Mode statt Sofortlösung',startFrame:0,endFrame:510,accent:STUDY_PALETTE.cyan,surface:STUDY_PALETTE.cyanSoft},
  {sceneId:'scene2',headline:'Schnell – aber oberflächlich',startFrame:510,endFrame:900,accent:STUDY_PALETTE.orange,surface:STUDY_PALETTE.orangeSoft},
  {sceneId:'scene3',headline:'Schritt für Schritt',startFrame:900,endFrame:1305,accent:STUDY_PALETTE.green,surface:STUDY_PALETTE.greenSoft},
  {sceneId:'scene4',headline:'Verstehen statt Kopieren',startFrame:1305,endFrame:1545,accent:STUDY_PALETTE.blue,surface:STUDY_PALETTE.blueSoft},
  {sceneId:'scene5',headline:'Sinnvoll – nicht perfekt',startFrame:1545,endFrame:1950,accent:STUDY_PALETTE.purple,surface:STUDY_PALETTE.purpleSoft},
];

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
