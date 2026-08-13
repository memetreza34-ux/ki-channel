export const AI_APP_COMPOSITION_ID = 'KI-AIAppPrototype';
export const AI_APP_WIDTH = 1080;
export const AI_APP_HEIGHT = 1920;
export const AI_APP_FPS = 30;
export const AI_APP_DURATION_IN_FRAMES = 1887;
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
  {sceneId:'app-01',startFrame:0,endFrame:320,headline:'Von Idee zu Prototyp',icon:'spark'},
  {sceneId:'app-02',startFrame:320,endFrame:667,headline:'Erst Struktur, dann Code',icon:'plan'},
  {sceneId:'app-03',startFrame:667,endFrame:990,headline:'Code wird zusammengesetzt',icon:'blocks'},
  {sceneId:'app-04',startFrame:990,endFrame:1356,headline:'Der erste Entwurf scheitert',icon:'test'},
  {sceneId:'app-05',startFrame:1356,endFrame:1887,headline:'Testen macht ihn brauchbar',icon:'check'},
];

export const AI_APP_SUBTITLES: AIAppCue[] = [
  {sceneId:'app-01',startFrame:0,endFrame:88,text:'Aus einer einfachen Idee kannst du mit KI heute'},
  {sceneId:'app-01',startFrame:88,endFrame:186,text:'erstaunlich schnell einen ersten App-Prototyp bauen.'},
  {sceneId:'app-01',startFrame:186,endFrame:259,text:'Aber „Schreib mir eine App“ ist dafür'},
  {sceneId:'app-01',startFrame:259,endFrame:320,text:'meistens noch viel zu ungenau.'},
  {sceneId:'app-02',startFrame:320,endFrame:399,text:'Zuerst braucht die KI ein klares Ziel,'},
  {sceneId:'app-02',startFrame:399,endFrame:501,text:'die wichtigsten Funktionen und den gewünschten Ablauf.'},
  {sceneId:'app-02',startFrame:501,endFrame:580,text:'Daraus entsteht ein Plan für Oberfläche,'},
  {sceneId:'app-02',startFrame:580,endFrame:667,text:'Eingaben, Logik und Ergebnis.'},
  {sceneId:'app-03',startFrame:667,endFrame:745,text:'Danach wird der Code nicht als ein riesiger Block gebaut.'},
  {sceneId:'app-03',startFrame:745,endFrame:809,text:'Einzelne Bausteine für Oberfläche,'},
  {sceneId:'app-03',startFrame:809,endFrame:890,text:'Daten und Funktionen entstehen nacheinander'},
  {sceneId:'app-03',startFrame:890,endFrame:990,text:'und werden zu einem ersten Prototyp verbunden.'},
  {sceneId:'app-04',startFrame:990,endFrame:1086,text:'Jetzt kommt der Teil, den viele überspringen: testen.'},
  {sceneId:'app-04',startFrame:1086,endFrame:1148,text:'Ein Button kann falsch reagieren,'},
  {sceneId:'app-04',startFrame:1148,endFrame:1225,text:'Daten können fehlen oder die Ansicht kann'},
  {sceneId:'app-04',startFrame:1225,endFrame:1266,text:'auf dem Handy brechen.'},
  {sceneId:'app-04',startFrame:1266,endFrame:1356,text:'Genau hier beginnt die eigentliche Verbesserung.'},
  {sceneId:'app-05',startFrame:1356,endFrame:1466,text:'Die KI kann Fehler finden und Änderungen vorschlagen,'},
  {sceneId:'app-05',startFrame:1466,endFrame:1554,text:'aber du entscheidest, was wirklich richtig ist.'},
  {sceneId:'app-05',startFrame:1554,endFrame:1618,text:'Der beste Workflow lautet deshalb:'},
  {sceneId:'app-05',startFrame:1618,endFrame:1712,text:'Idee präzisieren, Struktur bauen, Code erzeugen,'},
  {sceneId:'app-05',startFrame:1712,endFrame:1755,text:'testen und korrigieren.'},
  {sceneId:'app-05',startFrame:1755,endFrame:1829,text:'So wird aus KI-Code Schritt für Schritt'},
  {sceneId:'app-05',startFrame:1829,endFrame:1887,text:'ein brauchbarer Prototyp.'},
];
