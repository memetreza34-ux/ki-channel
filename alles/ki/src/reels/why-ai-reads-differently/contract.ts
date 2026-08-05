import rawReel from '../../../reels/2026-08-04-warum-ki-text-anders-liest/reel.json';

export type ReelSceneId =
  | 'scene-01'
  | 'scene-02'
  | 'scene-03'
  | 'scene-04'
  | 'scene-05'
  | 'scene-06'
  | 'scene-07'
  | 'scene-08';

export type SubtitleWordCue = {
  text: string;
  atFrame: number;
  accent?: boolean;
  danger?: boolean;
};

export type ReelSceneContract = {
  sceneId: ReelSceneId;
  startFrame: number;
  endFrameExclusive: number;
  durationInFrames: number;
  animationId: string;
  visualFamily: string;
  layoutFamily: string;
  motionSignature: string;
};

export const WHY_AI_REEL = rawReel;
export const WHY_AI_REEL_ID = rawReel.reelId;
export const WHY_AI_COMPOSITION_ID = rawReel.compositionId;
export const WHY_AI_FPS = rawReel.format.fps;
export const WHY_AI_DURATION_IN_FRAMES = rawReel.format.durationInFrames;
export const WHY_AI_WIDTH = rawReel.format.width;
export const WHY_AI_HEIGHT = rawReel.format.height;

export const WHY_AI_SCENES = rawReel.scenes as ReelSceneContract[];

export const SCENE_TITLES: Record<ReelSceneId, string> = {
  'scene-01': 'KI LIEST TEXT ANDERS',
  'scene-02': 'TEXT WIRD ZU TOKENS',
  'scene-03': 'ZAHLEN BEKOMMEN NÄHE',
  'scene-04': 'ATTENTION VERBINDET',
  'scene-05': 'DAS NÄCHSTE WORT',
  'scene-06': 'MUSTER DURCH SCHICHTEN',
  'scene-07': 'ANTWORT WORT FÜR WORT',
  'scene-08': 'KLINGT RICHTIG. KANN FALSCH SEIN.',
};

export const SUBTITLE_CUES: Record<ReelSceneId, readonly SubtitleWordCue[]> = {
  'scene-01': [
    {text: 'KI', atFrame: 0, accent: true},
    {text: 'liest', atFrame: 7},
    {text: 'deinen', atFrame: 13},
    {text: 'Satz', atFrame: 19, accent: true},
    {text: 'nicht', atFrame: 27},
    {text: 'wie', atFrame: 34},
    {text: 'du.', atFrame: 40, accent: true},
  ],
  'scene-02': [
    {text: 'Sie', atFrame: 0},
    {text: 'zerlegt', atFrame: 8, accent: true},
    {text: 'ihn', atFrame: 15},
    {text: 'zuerst', atFrame: 22},
    {text: 'in', atFrame: 30},
    {text: 'kleine', atFrame: 36},
    {text: 'Textbausteine,', atFrame: 44, accent: true},
    {text: 'sogenannte', atFrame: 68},
    {text: 'Tokens.', atFrame: 86, accent: true},
  ],
  'scene-03': [
    {text: 'Jedes', atFrame: 0},
    {text: 'Token', atFrame: 8, accent: true},
    {text: 'wird', atFrame: 17},
    {text: 'in', atFrame: 24},
    {text: 'Zahlen', atFrame: 31, accent: true},
    {text: 'übersetzt', atFrame: 47},
    {text: 'und', atFrame: 60},
    {text: 'in', atFrame: 67},
    {text: 'einem', atFrame: 73},
    {text: 'Bedeutungsraum', atFrame: 81, accent: true},
    {text: 'eingeordnet.', atFrame: 104},
  ],
  'scene-04': [
    {text: 'Ähnliche', atFrame: 0, accent: true},
    {text: 'Begriffe', atFrame: 12},
    {text: 'liegen', atFrame: 23},
    {text: 'näher', atFrame: 32, accent: true},
    {text: 'beieinander.', atFrame: 44},
    {text: 'Attention', atFrame: 66, accent: true},
    {text: 'entscheidet,', atFrame: 82},
    {text: 'welche', atFrame: 96},
    {text: 'Wörter', atFrame: 105, accent: true},
    {text: 'zusammengehören.', atFrame: 117},
  ],
  'scene-05': [
    {text: 'Schritt', atFrame: 0, accent: true},
    {text: 'für', atFrame: 7},
    {text: 'Schritt', atFrame: 14, accent: true},
    {text: 'berechnet', atFrame: 31},
    {text: 'das', atFrame: 42},
    {text: 'Modell,', atFrame: 50, accent: true},
    {text: 'welches', atFrame: 70},
    {text: 'Wort', atFrame: 80, accent: true},
    {text: 'als', atFrame: 91},
    {text: 'Nächstes', atFrame: 101, accent: true},
    {text: 'am', atFrame: 116},
    {text: 'wahrscheinlichsten', atFrame: 124, accent: true},
    {text: 'passt.', atFrame: 150},
  ],
  'scene-06': [
    {text: 'So', atFrame: 0},
    {text: 'entsteht', atFrame: 8},
    {text: 'die', atFrame: 17},
    {text: 'Antwort:', atFrame: 24, accent: true},
    {text: 'nicht', atFrame: 39},
    {text: 'weil', atFrame: 47},
    {text: 'KI', atFrame: 54, accent: true},
    {text: 'wirklich', atFrame: 65},
    {text: 'versteht,', atFrame: 75, danger: true},
    {text: 'sondern', atFrame: 90},
    {text: 'Muster', atFrame: 103, accent: true},
    {text: 'fortsetzt.', atFrame: 119},
  ],
  'scene-07': [
    {text: 'Genau', atFrame: 0},
    {text: 'deshalb', atFrame: 18, accent: true},
    {text: 'kann', atFrame: 34},
    {text: 'sie', atFrame: 45},
    {text: 'brillant', atFrame: 62, accent: true},
    {text: 'klingen', atFrame: 86},
  ],
  'scene-08': [
    {text: 'und', atFrame: 0},
    {text: 'trotzdem', atFrame: 19},
    {text: 'falsch', atFrame: 40, danger: true},
    {text: 'liegen.', atFrame: 61, danger: true},
  ],
};

export const REEL_TRANSITIONS = [
  {atFrame: 108, style: 'scanner-wipe'},
  {atFrame: 228, style: 'point-tunnel'},
  {atFrame: 348, style: 'thread-pull'},
  {atFrame: 483, style: 'branch-flash'},
  {atFrame: 648, style: 'layer-lift'},
  {atFrame: 783, style: 'word-stream'},
  {atFrame: 933, style: 'split-fold'},
] as const;
