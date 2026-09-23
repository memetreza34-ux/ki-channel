import reelJson from '../../../reels/2026-09-21_bis_2026-09-27/01_Was-passiert-wenn-du-einer-KI-ein-Foto-zeigst/06-projektdateien/reel.json';
import subtitleJson from '../../../reels/2026-09-21_bis_2026-09-27/01_Was-passiert-wenn-du-einer-KI-ein-Foto-zeigst/03-caption/subtitle-cues.json';
import {assertAuthoredVisualDiversity} from '../../animation-library/authoredProductionGate';
import {VISION_PHOTO_VISUAL_PROFILES} from './visualProfiles';

export type VisionPhotoScene = {
  sceneId: string;
  startFrame: number;
  endFrame: number;
  headline: string;
  icon: string;
  implementation: 'NEW_BUILD';
  spokenText: string;
  beatIds: readonly string[];
};

export type VisionPhotoCue = {
  sceneId: string;
  startFrame: number;
  endFrame: number;
  text: string;
  words?: Array<{text: string; startFrame: number; endFrame: number}>;
};

const reel = reelJson as {
  slug: string;
  format: {width: number; height: number; fps: number; durationInFrames: number};
  captionZoneStartY: number;
  visualBeatCount: number;
  scenes: VisionPhotoScene[];
};
const subtitles = subtitleJson as {fps: number; cues: VisionPhotoCue[]};

export const VISION_PHOTO_COMPOSITION_ID = 'KI-VisionPhotoUnderstanding';
export const VISION_PHOTO_WIDTH = reel.format.width;
export const VISION_PHOTO_HEIGHT = reel.format.height;
export const VISION_PHOTO_FPS = reel.format.fps;
export const VISION_PHOTO_DURATION_IN_FRAMES = reel.format.durationInFrames;
export const VISION_PHOTO_CAPTION_ZONE_Y = reel.captionZoneStartY;
export const VISION_PHOTO_SCENES = Object.freeze(reel.scenes.map((scene) => Object.freeze({...scene, beatIds: Object.freeze([...scene.beatIds])})));
export const VISION_PHOTO_SUBTITLES = Object.freeze(subtitles.cues.map((cue) => Object.freeze({...cue})));

export const normalizeVisionPhotoText = (value: string): string => value
  .toLocaleLowerCase('de-DE')
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[–—]/g, '-')
  .replace(/[^\p{L}\p{N}]+/gu, ' ')
  .trim()
  .replace(/\s+/g, ' ');

export const assertVisionPhotoContract = (): void => {
  if (reel.slug !== 'vision-photo-understanding') throw new Error('unexpected reel slug');
  if (VISION_PHOTO_WIDTH !== 1080 || VISION_PHOTO_HEIGHT !== 1920 || VISION_PHOTO_FPS !== 30) throw new Error('format must be 1080x1920 @30fps');
  if (VISION_PHOTO_CAPTION_ZONE_Y !== 1380) throw new Error('caption zone must start at y=1380');
  if (VISION_PHOTO_SCENES.length !== 5) throw new Error('reel must contain five scenes');
  if (reel.visualBeatCount !== 15) throw new Error('reel must declare fifteen visual beats');

  let cursor = 0;
  const ids = new Set<string>();
  const beats = new Set<string>();
  for (const scene of VISION_PHOTO_SCENES) {
    if (scene.startFrame !== cursor || scene.endFrame <= scene.startFrame) throw new Error(`invalid scene range: ${scene.sceneId}`);
    if (ids.has(scene.sceneId)) throw new Error(`duplicate scene: ${scene.sceneId}`);
    if (scene.implementation !== 'NEW_BUILD') throw new Error(`scene is not NEW_BUILD: ${scene.sceneId}`);
    if (!scene.headline.trim() || !scene.icon.trim() || !scene.spokenText.trim()) throw new Error(`missing viewer content: ${scene.sceneId}`);
    scene.beatIds.forEach((beat) => {
      if (beats.has(beat)) throw new Error(`duplicate beat: ${beat}`);
      beats.add(beat);
    });
    ids.add(scene.sceneId);
    cursor = scene.endFrame;
  }
  if (cursor !== VISION_PHOTO_DURATION_IN_FRAMES) throw new Error('scenes do not cover composition');
  if (beats.size !== 15) throw new Error('reel must contain fifteen unique visual beats');

  for (const scene of VISION_PHOTO_SCENES) {
    const cues = VISION_PHOTO_SUBTITLES.filter((cue) => cue.sceneId === scene.sceneId).sort((a, b) => a.startFrame - b.startFrame);
    if (cues.length < 2) throw new Error(`too few subtitle cues: ${scene.sceneId}`);
    if (cues.some((cue) => cue.startFrame < scene.startFrame || cue.endFrame > scene.endFrame)) throw new Error(`subtitle outside scene: ${scene.sceneId}`);
    if (normalizeVisionPhotoText(cues.map((cue) => cue.text).join(' ')) !== normalizeVisionPhotoText(scene.spokenText)) throw new Error(`subtitle mismatch: ${scene.sceneId}`);
  }

  const planned = VISION_PHOTO_SCENES.map((scene) => scene.sceneId);
  const profiled = VISION_PHOTO_VISUAL_PROFILES.map((profile) => profile.sceneId);
  if (planned.join('|') !== profiled.join('|')) throw new Error('visual profiles must exactly cover authored scene order');
  assertAuthoredVisualDiversity(VISION_PHOTO_VISUAL_PROFILES);
};

assertVisionPhotoContract();
