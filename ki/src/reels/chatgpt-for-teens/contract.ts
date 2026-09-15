import subtitleData from '../../../reels/2026-08-24_bis_2026-08-30/03_ChatGPT-schaetzt-dein-Alter-und-schaltet-Teen-Schutz-ein/03-caption/subtitle-cues.json';

export const CHATGPT_TEENS_COMPOSITION_ID = 'KI-ChatGPTForTeens';
export const CHATGPT_TEENS_FPS = 30;
export const CHATGPT_TEENS_WIDTH = 1080;
export const CHATGPT_TEENS_HEIGHT = 1920;
export const CHATGPT_TEENS_DURATION_IN_FRAMES = 1651;
export const CHATGPT_TEENS_VISUAL_END_Y = 1240;

export const TEEN_PALETTE = Object.freeze({
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

export const TEEN_VISIBLE_COPY = Object.freeze({
  brand: 'ChatGPT',
  scene1: {
    standard: 'STANDARD',
    teen: 'TEEN',
    announcement: 'ChatGPT for Teens',
    study: 'Study',
    safety: 'Schutz',
    pause: 'Pause',
    age: '13–17',
  },
  scene2: {
    panel: 'Account & Safety',
    estimate: 'Altersschätzung',
    topics: 'Gesprächsthemen',
    usageTimes: 'Nutzungszeiten',
    accountUse: 'Kontonutzung',
    accountAge: 'Account-Alter',
    threshold: '<18',
    experience: 'Teen Experience',
    active: 'AKTIV',
    eu: 'EU',
    rollout: 'Rollout in den kommenden Wochen',
  },
  scene3: {
    studyMode: 'Study Mode',
    prompt: 'Gib mir nur die Lösung.',
    shortcut: 'Abkürzung erkannt',
    step1: '1  Verstehen',
    step2: '2  Schritt lösen',
    step3: '3  Selbst prüfen',
    quiz: 'Mini-Quiz',
    understood: 'VERSTANDEN',
  },
  scene4: {
    sensitive: 'Sensible Anfrage',
    protected: 'Schutz aktiv',
    blocked: 'Inhalt abgefangen',
    breakTitle: 'Zeit für eine Pause?',
    breakBody: 'Kurz raus aus dem Chat.',
  },
  scene5: {
    controls: 'Eltern-Einstellungen',
    studyHours: 'Study Hours',
    quietHours: 'Quiet Hours',
    teenChat: 'Teen Chat',
    noAccess: 'KEIN ZUGRIFF',
    private: 'Chats bleiben privat',
    teen: 'TEEN',
    adult: '18+',
    different: 'unterschiedliche Erfahrung',
  },
} as const);

export type TeenScene = {
  sceneId: 'scene1' | 'scene2' | 'scene3' | 'scene4' | 'scene5';
  headline: string;
  startFrame: number;
  endFrame: number;
  accent: string;
  surface: string;
};

export const CHATGPT_TEENS_SCENES: TeenScene[] = [
  {sceneId: 'scene1', headline: 'ChatGPT schaltet um', startFrame: 0, endFrame: 220, accent: TEEN_PALETTE.cyan, surface: TEEN_PALETTE.cyanSoft},
  {sceneId: 'scene2', headline: 'So wird Alter geschätzt', startFrame: 220, endFrame: 751, accent: TEEN_PALETTE.blue, surface: TEEN_PALETTE.blueSoft},
  {sceneId: 'scene3', headline: 'Lernen statt Abkürzen', startFrame: 751, endFrame: 1103, accent: TEEN_PALETTE.green, surface: TEEN_PALETTE.greenSoft},
  {sceneId: 'scene4', headline: 'Schutz + Pause', startFrame: 1103, endFrame: 1236, accent: TEEN_PALETTE.orange, surface: TEEN_PALETTE.orangeSoft},
  {sceneId: 'scene5', headline: 'Eltern steuern – Chats privat', startFrame: 1236, endFrame: CHATGPT_TEENS_DURATION_IN_FRAMES, accent: TEEN_PALETTE.blue, surface: TEEN_PALETTE.blueSoft},
];

export type TeenWord = {text: string; startFrame: number; endFrame: number};
export type TeenCue = {
  id: string;
  sceneId: TeenScene['sceneId'];
  text: string;
  startFrame: number;
  endFrame: number;
  words?: TeenWord[];
};

export const CHATGPT_TEENS_SUBTITLES = subtitleData.cues as TeenCue[];
