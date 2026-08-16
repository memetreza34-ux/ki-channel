export const AI_SKETCH_WEBSITE_COMPOSITION_ID = 'KI-AISketchWebsite';
export const AI_SKETCH_WEBSITE_FPS = 30;
export const AI_SKETCH_WEBSITE_WIDTH = 1080;
export const AI_SKETCH_WEBSITE_HEIGHT = 1920;
export const AI_SKETCH_WEBSITE_DURATION_IN_FRAMES = 1879;
export const AI_SKETCH_WEBSITE_CAPTION_ZONE_Y = 1440;

export type AISketchWebsiteScene = {
  sceneId:string;
  startFrame:number;
  endFrame:number;
  headline:string;
  icon:'sketch'|'structure'|'layout'|'code'|'verify';
};

export type AISketchWebsiteCue = {sceneId:string;startFrame:number;endFrame:number;text:string;words?:Array<{text:string;startFrame:number;endFrame:number}>};

export const AI_SKETCH_WEBSITE_SCENES:AISketchWebsiteScene[]=[
  {sceneId:'sketch-01',startFrame:0,endFrame:477,headline:'KI liest mehr als Kästen',icon:'sketch'},
  {sceneId:'sketch-02',startFrame:477,endFrame:735,headline:'Struktur vor Design',icon:'structure'},
  {sceneId:'sketch-03',startFrame:735,endFrame:996,headline:'Aus Wireframe wird Layout',icon:'layout'},
  {sceneId:'sketch-04',startFrame:996,endFrame:1262,headline:'Design wird Funktion',icon:'code'},
  {sceneId:'sketch-05',startFrame:1262,endFrame:1879,headline:'Testen macht es echt',icon:'verify'},
];

export const AI_SKETCH_WEBSITE_SUBTITLES:AISketchWebsiteCue[]=[
  {sceneId:'sketch-01',startFrame:0,endFrame:185,text:'Eine grobe Skizze auf Papier kann heute reichen, um mit KI den ersten Entwurf einer echten Website zu bauen.'},
  {sceneId:'sketch-01',startFrame:185,endFrame:477,text:'Aber die KI sieht nicht einfach nur Kästen. Sie muss verstehen, was Navigation, Überschrift, Eingabefeld und Button bedeuten.'},
  {sceneId:'sketch-02',startFrame:477,endFrame:600,text:'Deshalb beginnt der Prozess mit Struktur:'},
  {sceneId:'sketch-02',startFrame:600,endFrame:735,text:'Welche Bereiche gibt es, welche Elemente gehören zusammen und was soll passieren, wenn jemand klickt?'},
  {sceneId:'sketch-03',startFrame:735,endFrame:885,text:'Danach wird aus der Skizze ein sauberes Layout.'},
  {sceneId:'sketch-03',startFrame:885,endFrame:996,text:'Abstände, Größen, Farben und Hierarchie werden festgelegt, bevor Code entsteht.'},
  {sceneId:'sketch-04',startFrame:996,endFrame:1130,text:'Erst dann baut die KI Komponenten und verbindet die Funktionen.'},
  {sceneId:'sketch-04',startFrame:1130,endFrame:1262,text:'Ein Button muss nicht nur aussehen wie ein Button, sondern tatsächlich etwas auslösen.'},
  {sceneId:'sketch-05',startFrame:1262,endFrame:1360,text:'Jetzt folgt der wichtigste Schritt: testen.'},
  {sceneId:'sketch-05',startFrame:1360,endFrame:1460,text:'Stimmen Mobilansicht, Eingaben, Zustände und Fehlermeldungen?'},
  {sceneId:'sketch-05',startFrame:1460,endFrame:1680,text:'Wenn etwas nicht passt, wird nicht alles neu gebaut. Die KI korrigiert gezielt die betroffene Stelle.'},
  {sceneId:'sketch-05',startFrame:1680,endFrame:1879,text:'So wird aus einer schnellen Zeichnung kein perfektes Produkt auf Knopfdruck, aber ein funktionierender Prototyp, den du weiter verbessern kannst.'},
];
