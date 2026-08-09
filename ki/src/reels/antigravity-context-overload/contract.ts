import reelJson from '../../../reels/2026-08-03_bis_2026-08-09/02_Warum-mehr-Kontext-KI-schlechter-macht/06-projektdateien/reel.json';
import subtitleJson from '../../../reels/2026-08-03_bis_2026-08-09/02_Warum-mehr-Kontext-KI-schlechter-macht/03-caption/subtitle-cues.json';

export type ContextOverloadScene = {
  sceneId: string;
  startFrame: number;
  endFrame: number;
  animationId: string;
  spokenText: string;
  goal: string;
};

export type ContextOverloadSubtitleCue = {
  sceneId: string;
  startFrame: number;
  endFrame: number;
  text: string;
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
  reel.scenes.map((scene) => Object.freeze({...scene})),
);
export const CONTEXT_OVERLOAD_SUBTITLES = Object.freeze(
  subtitles.cues.map((cue) => Object.freeze({...cue})),
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

export const assertContextOverloadContract = (): void => {
  if (CONTEXT_OVERLOAD_REEL.slug !== 'antigravity-context-overload') {
    throw new Error('unexpected context-overload reel slug');
  }
  if (
    CONTEXT_OVERLOAD_WIDTH !== 1080 ||
    CONTEXT_OVERLOAD_HEIGHT !== 1920 ||
    CONTEXT_OVERLOAD_FPS !== 30 ||
    CONTEXT_OVERLOAD_DURATION_IN_FRAMES !== 900
  ) {
    throw new Error('context-overload format must be 1080x1920 @30fps / 900 frames');
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
    if (scene.startFrame !== cursor || scene.endFrame - scene.startFrame !== 180) {
      throw new Error(`invalid frame range for ${scene.sceneId}`);
    }
    if (!scene.spokenText.trim()) throw new Error(`missing spokenText for ${scene.sceneId}`);
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
    if (cues.length !== 2) throw new Error(`${scene.sceneId} must have exactly two subtitle cues`);
    if (cues.some((cue) => cue.startFrame < scene.startFrame || cue.endFrame > scene.endFrame)) {
      throw new Error(`subtitle cue outside ${scene.sceneId}`);
    }
    const captionText = normalizeContextOverloadText(cues.map((cue) => cue.text).join(' '));
    const spokenText = normalizeContextOverloadText(scene.spokenText);
    if (captionText !== spokenText) {
      throw new Error(`subtitle coverage mismatch for ${scene.sceneId}`);
    }
  }
};

assertContextOverloadContract();
