export const AI_APP_COMPOSITION_ID = 'KI-AIAppPrototype';
export const AI_APP_WIDTH = 1080;
export const AI_APP_HEIGHT = 1920;
export const AI_APP_FPS = 30;
export const AI_APP_DURATION_IN_FRAMES = 1800;
export const AI_APP_CAPTION_ZONE_Y = 1440;

export type AIAppScene = {
  sceneId: string;
  startFrame: number;
  endFrame: number;
  headline: string;
  icon: 'spark' | 'plan' | 'blocks' | 'test' | 'check';
};

export type AIAppCue = {
  sceneId: string;
  startFrame: number;
  endFrame: number;
  text: string;
  words?: Array<{text: string; startFrame: number; endFrame: number}>;
};

export const AI_APP_SCENES: AIAppScene[] = [
  {sceneId:'app-01',startFrame:0,endFrame:330,headline:'Von Idee zu Prototyp',icon:'spark'},
  {sceneId:'app-02',startFrame:330,endFrame:630,headline:'Erst Struktur, dann Code',icon:'plan'},
  {sceneId:'app-03',startFrame:630,endFrame:960,headline:'Code wird zusammengesetzt',icon:'blocks'},
  {sceneId:'app-04',startFrame:960,endFrame:1320,headline:'Der erste Entwurf scheitert',icon:'test'},
  {sceneId:'app-05',startFrame:1320,endFrame:1800,headline:'Testen macht ihn brauchbar',icon:'check'},
];

export const AI_APP_SUBTITLES: AIAppCue[] = [
  {sceneId:'app-01',startFrame:0,endFrame:170,text:'Aus einer einfachen Idee kannst du mit KI heute erstaunlich schnell einen ersten App-Prototyp bauen.'},
  {sceneId:'app-01',startFrame:170,endFrame:330,text:'Aber „Schreib mir eine App“ ist dafür meistens noch viel zu ungenau.'},
  {sceneId:'app-02',startFrame:330,endFrame:485,text:'Zuerst braucht die KI ein klares Ziel, die wichtigsten Funktionen und den gewünschten Ablauf.'},
  {sceneId:'app-02',startFrame:485,endFrame:630,text:'Daraus entsteht ein Plan für Oberfläche, Eingaben, Logik und Ergebnis.'},
  {sceneId:'app-03',startFrame:630,endFrame:770,text:'Danach wird der Code nicht als ein riesiger Block gebaut.'},
  {sceneId:'app-03',startFrame:770,endFrame:960,text:'Einzelne Bausteine für Oberfläche, Daten und Funktionen entstehen nacheinander und werden zu einem ersten Prototyp verbunden.'},
  {sceneId:'app-04',startFrame:960,endFrame:1060,text:'Jetzt kommt der Teil, den viele überspringen: testen.'},
  {sceneId:'app-04',startFrame:1060,endFrame:1140,text:'Ein Button kann falsch reagieren,'},
  {sceneId:'app-04',startFrame:1140,endFrame:1210,text:'Daten können fehlen'},
  {sceneId:'app-04',startFrame:1210,endFrame:1290,text:'oder die Ansicht kann auf dem Handy brechen.'},
  {sceneId:'app-04',startFrame:1290,endFrame:1320,text:'Genau hier beginnt die eigentliche Verbesserung.'},
  {sceneId:'app-05',startFrame:1320,endFrame:1475,text:'Die KI kann Fehler finden und Änderungen vorschlagen,'},
  {sceneId:'app-05',startFrame:1475,endFrame:1585,text:'aber du entscheidest, was wirklich richtig ist.'},
  {sceneId:'app-05',startFrame:1585,endFrame:1740,text:'Der beste Workflow lautet deshalb: Idee präzisieren, Struktur bauen, Code erzeugen, testen und korrigieren.'},
  {sceneId:'app-05',startFrame:1740,endFrame:1800,text:'So wird aus KI-Code Schritt für Schritt ein brauchbarer Prototyp.'},
];
