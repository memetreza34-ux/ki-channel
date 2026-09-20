import {assertAuthoredVisualDiversity} from '../../animation-library/authoredProductionGate';
import {AI_APP_WORKFLOW_VISUAL_PROFILES} from './visualProfiles';

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

export const assertAIAppWorkflowContract = (): void => {
  if (
    AI_APP_WORKFLOW_WIDTH !== 1920 ||
    AI_APP_WORKFLOW_HEIGHT !== 1080 ||
    AI_APP_WORKFLOW_FPS !== 30
  ) {
    throw new Error('AI app workflow longform must be 1920x1080 @30fps');
  }
  if (AI_APP_WORKFLOW_CHAPTERS.length !== 8) {
    throw new Error('AI app workflow longform must contain eight chapters');
  }

  let cursor = 0;
  for (const chapter of AI_APP_WORKFLOW_CHAPTERS) {
    if (chapter.startFrame !== cursor || chapter.endFrame <= chapter.startFrame) {
      throw new Error(`invalid longform chapter range: ${chapter.id}`);
    }
    cursor = chapter.endFrame;
  }
  if (cursor !== AI_APP_WORKFLOW_DURATION_IN_FRAMES) {
    throw new Error('AI app workflow chapters do not cover the full composition');
  }

  const chapterIds = AI_APP_WORKFLOW_CHAPTERS.map((chapter) => chapter.id);
  const profileIds = AI_APP_WORKFLOW_VISUAL_PROFILES.map((profile) => profile.sceneId);
  if (chapterIds.join('|') !== profileIds.join('|')) {
    throw new Error('AI app workflow visual profiles must exactly cover chapter order');
  }
  assertAuthoredVisualDiversity(AI_APP_WORKFLOW_VISUAL_PROFILES);
};

assertAIAppWorkflowContract();
