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
    "endFrame": 1230
  },
  {
    "id": "format",
    "title": "Weniger lesen, mehr sehen",
    "startFrame": 1230,
    "endFrame": 2490
  },
  {
    "id": "architecture",
    "title": "Wie es technisch funktioniert",
    "startFrame": 2490,
    "endFrame": 3840
  },
  {
    "id": "savings",
    "title": "Beispiel: Sparrechner",
    "startFrame": 3840,
    "endFrame": 5040
  },
  {
    "id": "learning",
    "title": "Beispiel: Lernen",
    "startFrame": 5040,
    "endFrame": 6240
  },
  {
    "id": "limits",
    "title": "Was eine schöne UI nicht kann",
    "startFrame": 6240,
    "endFrame": 7470
  },
  {
    "id": "availability",
    "title": "Für wen gibt es das?",
    "startFrame": 7470,
    "endFrame": 8730
  },
  {
    "id": "payoff",
    "title": "Die nächste Form von Chat",
    "startFrame": 8730,
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
