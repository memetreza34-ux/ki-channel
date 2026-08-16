export const AI_APP_WORKFLOW_COMPOSITION_ID = 'KI-Longform-AIAppWorkflow';
export const AI_APP_WORKFLOW_THUMBNAIL_ID = 'KI-Longform-AIAppWorkflow-Thumbnail';
export const AI_APP_WORKFLOW_WIDTH = 1920;
export const AI_APP_WORKFLOW_HEIGHT = 1080;
export const AI_APP_WORKFLOW_FPS = 30;
export const AI_APP_WORKFLOW_DURATION_IN_FRAMES = 9900;

export type LongformChapter = {
  id: 'hook'|'scope'|'flow'|'repo'|'build'|'test'|'branch'|'finish';
  startFrame: number;
  endFrame: number;
  title: string;
};

export const AI_APP_WORKFLOW_CHAPTERS: LongformChapter[] = [
  {id:'hook',startFrame:0,endFrame:750,title:'Ein Prompt ist noch keine App'},
  {id:'scope',startFrame:750,endFrame:2100,title:'Problem eingrenzen'},
  {id:'flow',startFrame:2100,endFrame:3300,title:'Nutzerfluss und Zustände'},
  {id:'repo',startFrame:3300,endFrame:4500,title:'Repository als Gedächtnis'},
  {id:'build',startFrame:4500,endFrame:6150,title:'Kontext und kleine Schritte'},
  {id:'test',startFrame:6150,endFrame:7650,title:'Testen und Fehler beheben'},
  {id:'branch',startFrame:7650,endFrame:8550,title:'Branches für Experimente'},
  {id:'finish',startFrame:8550,endFrame:9900,title:'Fertig bedeutet überprüfbar'},
];
