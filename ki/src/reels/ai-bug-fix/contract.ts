export const AI_BUG_FIX_COMPOSITION_ID = 'KI-AIBugFix';
export const AI_BUG_FIX_FPS = 30;
export const AI_BUG_FIX_WIDTH = 1080;
export const AI_BUG_FIX_HEIGHT = 1920;
export const AI_BUG_FIX_DURATION_IN_FRAMES = 1800;
export const AI_BUG_FIX_CAPTION_ZONE_Y = 1440;

export type AIBugFixScene = {
  sceneId: string;
  startFrame: number;
  endFrame: number;
  headline: string;
  icon: 'click' | 'steps' | 'trace' | 'patch' | 'verify';
};

export type AIBugFixCue = {
  sceneId: string;
  startFrame: number;
  endFrame: number;
  text: string;
  words?: Array<{text:string;startFrame:number;endFrame:number}>;
};

export const AI_BUG_FIX_SCENES: AIBugFixScene[] = [
  {sceneId:'bug-01',startFrame:0,endFrame:360,headline:'Der Bug zeigt sich',icon:'click'},
  {sceneId:'bug-02',startFrame:360,endFrame:720,headline:'Reproduzieren statt raten',icon:'steps'},
  {sceneId:'bug-03',startFrame:720,endFrame:1080,headline:'Ursache statt Fehlermeldung',icon:'trace'},
  {sceneId:'bug-04',startFrame:1080,endFrame:1440,headline:'Kleiner Patch, klare Tests',icon:'patch'},
  {sceneId:'bug-05',startFrame:1440,endFrame:1800,headline:'Fix wirklich beweisen',icon:'verify'},
];

export const AI_BUG_FIX_SUBTITLES: AIBugFixCue[] = [
  {sceneId:'bug-01',startFrame:0,endFrame:165,text:'Deine App funktioniert, bis du auf genau diesen Button klickst.'},
  {sceneId:'bug-01',startFrame:165,endFrame:360,text:'Statt blind Code umzuschreiben, kann KI den Fehler Schritt für Schritt eingrenzen – wenn du ihr die richtigen Signale gibst.'},
  {sceneId:'bug-02',startFrame:360,endFrame:610,text:'Zuerst braucht sie nicht das ganze Projekt, sondern den reproduzierbaren Fehler: Was hast du geklickt, was sollte passieren und was ist stattdessen passiert?'},
  {sceneId:'bug-02',startFrame:610,endFrame:720,text:'Dazu kommen Fehlermeldung und betroffener Code.'},
  {sceneId:'bug-03',startFrame:720,endFrame:890,text:'Dann sucht die KI nach der Ursache, nicht nur nach der roten Meldung.'},
  {sceneId:'bug-03',startFrame:890,endFrame:1080,text:'Sie verfolgt Datenfluss, Bedingungen und Funktionsaufrufe zurück, bis ein plausibler Bruch im Ablauf sichtbar wird.'},
  {sceneId:'bug-04',startFrame:1080,endFrame:1180,text:'Erst jetzt entsteht ein Patch.'},
  {sceneId:'bug-04',startFrame:1180,endFrame:1440,text:'Gute KI ändert möglichst wenig, erklärt die betroffene Stelle und lässt Tests prüfen, ob der Fix wirklich funktioniert – ohne nebenbei etwas anderes kaputtzumachen.'},
  {sceneId:'bug-05',startFrame:1440,endFrame:1600,text:'Der wichtigste Schritt kommt danach: denselben Fehler erneut auslösen.'},
  {sceneId:'bug-05',startFrame:1600,endFrame:1800,text:'Verschwindet er, Tests bleiben grün und der Rest läuft weiter, ist aus einem KI-Vorschlag ein überprüfter Fix geworden.'},
];
