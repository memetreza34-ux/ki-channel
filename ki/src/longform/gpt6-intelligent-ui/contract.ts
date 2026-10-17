import {assertAuthoredVisualDiversity} from '../../animation-library/authoredProductionGate';
import {INTELLIGENT_UI_VISUAL_PROFILES} from './visualProfiles';

export const INTELLIGENT_UI_COMPOSITION_ID = 'KI-Longform-IntelligentUI';
export const INTELLIGENT_UI_THUMBNAIL_ID = 'KI-Longform-IntelligentUI-Thumbnail';
export const INTELLIGENT_UI_FPS = 30;
export const INTELLIGENT_UI_WIDTH = 1920;
export const INTELLIGENT_UI_HEIGHT = 1080;
export const INTELLIGENT_UI_DURATION_IN_FRAMES = 10050;

export type IntelligentUIChapter = {
  id: 'hook'|'format'|'architecture'|'savings'|'learning'|'limits'|'availability'|'payoff';
  title: string;
  startFrame: number;
  endFrame: number;
};

export const INTELLIGENT_UI_CHAPTERS: IntelligentUIChapter[] = [
  {
    "id": "hook",
    "title": "Text wird zur Oberfläche",
    "startFrame": 0,
    "endFrame": 1050
  },
  {
    "id": "format",
    "title": "Weniger lesen, mehr sehen",
    "startFrame": 1050,
    "endFrame": 2250
  },
  {
    "id": "architecture",
    "title": "Wie es technisch funktioniert",
    "startFrame": 2250,
    "endFrame": 3480
  },
  {
    "id": "savings",
    "title": "Beispiel: Sparrechner",
    "startFrame": 3480,
    "endFrame": 4680
  },
  {
    "id": "learning",
    "title": "Beispiel: Lernen",
    "startFrame": 4680,
    "endFrame": 5880
  },
  {
    "id": "limits",
    "title": "Was eine schöne UI nicht kann",
    "startFrame": 5880,
    "endFrame": 7080
  },
  {
    "id": "availability",
    "title": "Für wen gibt es das?",
    "startFrame": 7080,
    "endFrame": 8550
  },
  {
    "id": "payoff",
    "title": "Die nächste Form von Chat",
    "startFrame": 8550,
    "endFrame": 10050
  }
];

export const assertIntelligentUIContract = (): void => {
  if (INTELLIGENT_UI_WIDTH !== 1920 || INTELLIGENT_UI_HEIGHT !== 1080 || INTELLIGENT_UI_FPS !== 30) {
    throw new Error('Longform video must remain 1920x1080 at 30fps.');
  }
  let cursor = 0;
  for (const chapter of INTELLIGENT_UI_CHAPTERS) {
    if (chapter.startFrame !== cursor || chapter.endFrame <= chapter.startFrame) {
      throw new Error('Invalid scene timeline: '+chapter.id);
    }
    cursor = chapter.endFrame;
  }
  if (cursor !== INTELLIGENT_UI_DURATION_IN_FRAMES) {
    throw new Error('Longform timeline does not cover duration.');
  }
  if (INTELLIGENT_UI_CHAPTERS.map(c=>c.id).join(',') !== INTELLIGENT_UI_VISUAL_PROFILES.map(x=>x.sceneId).join(',')) {
    throw new Error('Visual profiles must match exact chapter order.');
  }
  assertAuthoredVisualDiversity(INTELLIGENT_UI_VISUAL_PROFILES);
};

assertIntelligentUIContract();
