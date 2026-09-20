import reelJson from '../../../reels/2026-08-03_bis_2026-08-09/02_Warum-mehr-Kontext-KI-schlechter-macht/06-projektdateien/reel.json';
import subtitleJson from '../../../reels/2026-08-03_bis_2026-08-09/02_Warum-mehr-Kontext-KI-schlechter-macht/03-caption/subtitle-cues.json';
import {assertAuthoredVisualDiversity} from '../../animation-library/authoredProductionGate';
import {CONTEXT_OVERLOAD_VISUAL_MANIFEST} from './visualProfiles';

export type ContextOverloadScene = {
  sceneId: string;
  startFrame: number;
  endFrame: number;
  animationId: string;
  spokenText: string;
  headline: string;
  visualLabels: Record<string, string>;
  goal: string;
};

export type ContextOverloadSubtitleWord = {
  text: string;
  startFrame: number;
  endFrame: number;
};

export type ContextOverloadSubtitleCue = {
  sceneId: string;
  startFrame: number;
  endFrame: number;
  text: string;
  words?: ContextOverloadSubtitleWord[];
};

const reel = reelJson as {
  version: number;
  slug: string;
  title: string;
  language: string;
  format: {
    width: number;
    height: number;
    fps: number;
    durationInFrames: number;
  };
  productionMode: string;
  audio: {
    voiceoverRequired: boolean;
    music: boolean;
    sfx: boolean;
  };
  scenes: ContextOverloadScene[];
};

const subtitles = subtitleJson as {
  fps: number;
  cues: ContextOverloadSubtitleCue[];
};

export const CONTEXT_OVERLOAD_COMPOSITION_ID = 'KI-ContextOverload';
export const CONTEXT_OVERLOAD_REEL = Object.freeze(reel);
export const CONTEXT_OVERLOAD_SCENES = Object.freeze(
  reel.scenes.map((scene) => Object.freeze({...scene, visualLabels: Object.freeze({...scene.visualLabels})})),
);
export const CONTEXT_OVERLOAD_SUBTITLES = Object.freeze(
  subtitles.cues.map((cue) => Object.freeze({
    ...cue,
    words: cue.words?.map((word) => Object.freeze({...word})),
  })),
);

export const CONTEXT_OVERLOAD_WIDTH = reel.format.width;
export const CONTEXT_OVERLOAD_HEIGHT = reel.format.height;
export const CONTEXT_OVERLOAD_FPS = reel.format.fps;
export const CONTEXT_OVERLOAD_DURATION_IN_FRAMES = reel.format.durationInFrames;

export const normalizeContextOverloadText = (value: string): string =>
  value
    .toLocaleLowerCase('de-DE')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[–—]/g, '-')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .replace(/\s+/g, ' ');

const assertWordTiming = (cue: ContextOverloadSubtitleCue): void => {
  if (!cue.words || cue.words.length === 0) return;

  let cursor = cue.startFrame;
  for (const word of cue.words) {
    if (!word.text.trim()) throw new Error(`empty subtitle word in ${cue.sceneId}`);
    if (word.startFrame < cue.startFrame || word.endFrame > cue.endFrame) {
      throw new Error(`subtitle word outside cue in ${cue.sceneId}`);
    }
    if (word.endFrame <= word.startFrame) {
      throw new Error(`invalid subtitle word duration in ${cue.sceneId}`);
    }
    if (word.startFrame < cursor) {
      throw new Error(`overlapping subtitle word timing in ${cue.sceneId}`);
    }
    cursor = word.endFrame;
  }

  const wordText = normalizeContextOverloadText(cue.words.map((word) => word.text).join(' '));
  const cueText = normalizeContextOverloadText(cue.text);
  if (wordText !== cueText) {
    throw new Error(`subtitle word coverage mismatch for ${cue.sceneId}`);
  }
};

export const assertContextOverloadContract = (): void => {
  if (CONTEXT_OVERLOAD_REEL.slug !== 'antigravity-context-overload') {
    throw new Error('unexpected context-overload reel slug');
  }
  if (
    CONTEXT_OVERLOAD_WIDTH !== 1080 ||
    CONTEXT_OVERLOAD_HEIGHT !== 1920 ||
    CONTEXT_OVERLOAD_FPS !== 30
  ) {
    throw new Error('context-overload format must be 1080x1920 @30fps');
  }
  if (CONTEXT_OVERLOAD_SCENES.length !== 5) {
    throw new Error('context-overload reel must contain exactly five scenes');
  }

  let cursor = 0;
  const sceneIds = new Set<string>();
  const animationIds = new Set<string>();
  for (const scene of CONTEXT_OVERLOAD_SCENES) {
    if (sceneIds.has(scene.sceneId)) throw new Error(`duplicate scene id: ${scene.sceneId}`);
    if (animationIds.has(scene.animationId)) throw new Error(`duplicate animation id: ${scene.animationId}`);
    if (scene.startFrame !== cursor || scene.endFrame <= scene.startFrame) {
      throw new Error(`invalid frame range for ${scene.sceneId}`);
    }
    if (!scene.spokenText.trim()) throw new Error(`missing spokenText for ${scene.sceneId}`);
    if (!scene.headline.trim()) throw new Error(`missing production headline for ${scene.sceneId}`);
    if (scene.headline.trim().length > 38) throw new Error(`production headline too long for ${scene.sceneId}`);
    if (!scene.visualLabels || Object.keys(scene.visualLabels).length === 0) {
      throw new Error(`missing visual labels for ${scene.sceneId}`);
    }
    sceneIds.add(scene.sceneId);
    animationIds.add(scene.animationId);
    cursor = scene.endFrame;
  }
  if (cursor !== CONTEXT_OVERLOAD_DURATION_IN_FRAMES) {
    throw new Error('context-overload scenes do not cover the full composition');
  }

  for (const scene of CONTEXT_OVERLOAD_SCENES) {
    const cues = CONTEXT_OVERLOAD_SUBTITLES
      .filter((cue) => cue.sceneId === scene.sceneId)
      .sort((left, right) => left.startFrame - right.startFrame);
    if (cues.length === 0) throw new Error(`${scene.sceneId} must have at least one subtitle cue`);
    if (cues.some((cue) => cue.startFrame < scene.startFrame || cue.endFrame > scene.endFrame)) {
      throw new Error(`subtitle cue outside ${scene.sceneId}`);
    }
    cues.forEach(assertWordTiming);
    const captionText = normalizeContextOverloadText(cues.map((cue) => cue.text).join(' '));
    const spokenText = normalizeContextOverloadText(scene.spokenText);
    if (captionText !== spokenText) {
      throw new Error(`subtitle coverage mismatch for ${scene.sceneId}`);
    }
  }

  const plannedSceneIds = CONTEXT_OVERLOAD_SCENES.map((scene) => scene.sceneId);
  const profiledSceneIds = CONTEXT_OVERLOAD_VISUAL_MANIFEST.map((profile) => profile.sceneId);
  if (plannedSceneIds.join('|') !== profiledSceneIds.join('|')) {
    throw new Error(
      'context-overload visual manifest must exactly cover the authored scene order',
    );
  }
  assertAuthoredVisualDiversity(CONTEXT_OVERLOAD_VISUAL_MANIFEST);
};

assertContextOverloadContract();
