export const AI_PRODUCT_AD_COMPOSITION_ID = 'KI-AIProductAd';
export const AI_PRODUCT_AD_FPS = 30;
export const AI_PRODUCT_AD_WIDTH = 1080;
export const AI_PRODUCT_AD_HEIGHT = 1920;
export const AI_PRODUCT_AD_DURATION_IN_FRAMES = 1800;
export const AI_PRODUCT_AD_CAPTION_ZONE_Y = 1440;

export type AIProductAdScene = {
  sceneId: string;
  startFrame: number;
  endFrame: number;
  headline: string;
  icon: 'spark' | 'brief' | 'frames' | 'motion' | 'check';
};

export type AIProductAdCue = {
  sceneId: string;
  startFrame: number;
  endFrame: number;
  text: string;
  words?: Array<{text:string;startFrame:number;endFrame:number}>;
};

export const AI_PRODUCT_AD_SCENES: AIProductAdScene[] = [
  {sceneId:'ad-01',startFrame:0,endFrame:380,headline:'Ein Prompt reicht nicht',icon:'spark'},
  {sceneId:'ad-02',startFrame:380,endFrame:800,headline:'Bildsprache zuerst',icon:'brief'},
  {sceneId:'ad-03',startFrame:800,endFrame:1110,headline:'Konsistenz vor Bewegung',icon:'frames'},
  {sceneId:'ad-04',startFrame:1110,endFrame:1320,headline:'Keyframes werden Bewegung',icon:'motion'},
  {sceneId:'ad-05',startFrame:1320,endFrame:1800,headline:'Prüfen macht den Unterschied',icon:'check'},
];

export const AI_PRODUCT_AD_SUBTITLES: AIProductAdCue[] = [
  {sceneId:'ad-01',startFrame:0,endFrame:155,text:'Ein normales Produktfoto kann mit KI zur Grundlage für einen ganzen Werbeclip werden.'},
  {sceneId:'ad-01',startFrame:155,endFrame:380,text:'Der Fehler beginnt aber oft beim ersten Prompt: Wer nur „Mach daraus Werbung“ schreibt, bekommt schnell schöne, aber beliebige Ergebnisse.'},
  {sceneId:'ad-02',startFrame:380,endFrame:575,text:'Zuerst muss klar sein, was verkauft wird, für wen der Clip gedacht ist und welche Stimmung er haben soll.'},
  {sceneId:'ad-02',startFrame:575,endFrame:800,text:'Daraus entsteht ein visueller Plan mit Einstieg, Produktmoment, Nutzen, Detailaufnahme und Abschluss.'},
  {sceneId:'ad-03',startFrame:800,endFrame:900,text:'Danach wird nicht sofort alles animiert.'},
  {sceneId:'ad-03',startFrame:900,endFrame:1110,text:'Die KI erzeugt zuerst konsistente Schlüsselbilder, damit Produktform, Farben und Umgebung nicht von Szene zu Szene springen.'},
  {sceneId:'ad-04',startFrame:1110,endFrame:1320,text:'Erst dann werden diese Bilder in kurze Bewegungen verwandelt und zu einem Ablauf zusammengesetzt.'},
  {sceneId:'ad-05',startFrame:1320,endFrame:1480,text:'Jetzt kommt die Kontrolle: Logo, Text, Produktdetails und Übergänge müssen geprüft werden,'},
  {sceneId:'ad-05',startFrame:1480,endFrame:1570,text:'weil kleine Fehler sofort billig wirken.'},
  {sceneId:'ad-05',startFrame:1570,endFrame:1740,text:'Der starke Workflow ist deshalb: Produkt verstehen, Bildsprache planen, Schlüsselbilder bauen, animieren und korrigieren.'},
  {sceneId:'ad-05',startFrame:1740,endFrame:1800,text:'So entsteht aus einem einfachen Foto kein Zufallsclip, sondern eine gezielt aufgebaute KI-Werbung.'},
];
