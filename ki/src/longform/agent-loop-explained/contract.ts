export const AGENT_LOOP_COMPOSITION_ID='KI-Longform-AgentLoop';
export const AGENT_LOOP_THUMBNAIL_ID='KI-Longform-AgentLoop-Thumbnail';
export const AGENT_LOOP_WIDTH=1920;
export const AGENT_LOOP_HEIGHT=1080;
export const AGENT_LOOP_FPS=30;

/**
 * Laenge des Videos: letztes gesprochenes Wort (Frame 10096) plus Auslauf.
 *
 * Vorher standen hier 10020 Frames — 76 Frames weniger, als der Sprecher
 * braucht. Der letzte Satz wurde mitten im Wort abgeschnitten.
 */
export const AGENT_LOOP_DURATION_IN_FRAMES=10151;

export type AgentLoopChapterId='hook'|'compare'|'anatomy'|'loop'|'example'|'tools'|'risks'|'guardrails'|'fit'|'model';
export type AgentLoopChapter={id:AgentLoopChapterId;startFrame:number;endFrame:number;title:string};

/**
 * Kapitelgrenzen aus der Transkription des echten Voiceovers.
 *
 * Jede Grenze liegt in der Sprechpause vor dem ersten Wort des Absatzes,
 * ermittelt mit `scripts/derive-longform-chapters.mjs`. Die frueheren runden
 * Zahlen (720, 1770, 2970 ...) hatten mit dem Sprecher nichts zu tun: Kapitel 2
 * begann 14 Sekunden bevor der Sprecher es anfing, und die Verschiebung zog
 * sich durch das ganze Video — Bilder erklaerten Saetze, die erst spaeter kamen.
 *
 * Absatz 10 hatte bisher gar kein Kapitel und lief stumm unter „fit" mit.
 */
export const AGENT_LOOP_CHAPTERS:AgentLoopChapter[]=[
  {id:'hook',      startFrame:0,    endFrame:1149,  title:'Was einen Agenten anders macht'},
  {id:'compare',   startFrame:1149, endFrame:2237,  title:'Chatbot gegen Agent'},
  {id:'anatomy',   startFrame:2237, endFrame:3305,  title:'Die vier Bausteine'},
  {id:'loop',      startFrame:3305, endFrame:4196,  title:'Der Agenten-Loop'},
  {id:'example',   startFrame:4196, endFrame:5197,  title:'Ein konkretes Beispiel'},
  {id:'tools',     startFrame:5197, endFrame:6194,  title:'Warum Werkzeuge entscheidend sind'},
  {id:'risks',     startFrame:6194, endFrame:7112,  title:'Wo Agenten scheitern können'},
  {id:'guardrails',startFrame:7112, endFrame:7945,  title:'Kontrolle und Freigaben'},
  {id:'fit',       startFrame:7945, endFrame:8856,  title:'Wann ein Agent sinnvoll ist'},
  {id:'model',     startFrame:8856, endFrame:10151, title:'Das mentale Modell'},
];
