import reelJson from '../../../reels/2026-08-10_bis_2026-08-16/03_Warum-KI-Agenten-mehr-als-Chatbots-sind/06-projektdateien/reel.json';
import subtitleJson from '../../../reels/2026-08-10_bis_2026-08-16/03_Warum-KI-Agenten-mehr-als-Chatbots-sind/03-caption/subtitle-cues.json';

export type AIAgentScene = {
  sceneId: string;
  startFrame: number;
  endFrame: number;
  headline: string;
  icon: string;
  implementation: 'NEW_BUILD';
  spokenText: string;
  beatIds: string[];
};

export type AIAgentCue = {
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
  scenes: AIAgentScene[];
};
const subtitles = subtitleJson as {fps: number; cues: AIAgentCue[]};

export const AI_AGENTS_COMPOSITION_ID = 'KI-AIAgents';
export const AI_AGENTS_WIDTH = reel.format.width;
export const AI_AGENTS_HEIGHT = reel.format.height;
export const AI_AGENTS_FPS = reel.format.fps;
export const AI_AGENTS_DURATION_IN_FRAMES = reel.format.durationInFrames;
export const AI_AGENTS_CAPTION_ZONE_Y = reel.captionZoneStartY;
export const AI_AGENTS_SCENES = Object.freeze(reel.scenes.map((scene) => Object.freeze({...scene, beatIds: Object.freeze([...scene.beatIds])})));
export const AI_AGENTS_SUBTITLES = Object.freeze(subtitles.cues.map((cue) => Object.freeze({...cue})));

export const normalizeAIAgentText = (value: string): string =>
  value.toLocaleLowerCase('de-DE').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[–—]/g, '-').replace(/[^\p{L}\p{N}]+/gu, ' ').trim().replace(/\s+/g, ' ');

export const assertAIAgentsContract = (): void => {
  if (reel.slug !== 'ai-agents') throw new Error('unexpected reel slug');
  if (AI_AGENTS_WIDTH !== 1080 || AI_AGENTS_HEIGHT !== 1920 || AI_AGENTS_FPS !== 30) throw new Error('format must be 1080x1920 @30fps');
  if (AI_AGENTS_DURATION_IN_FRAMES !== 1740) throw new Error('phase-1 baseline must be 1740 frames');
  if (AI_AGENTS_CAPTION_ZONE_Y !== 1440) throw new Error('caption zone must start at y=1440');
  if (AI_AGENTS_SCENES.length !== 5) throw new Error('reel must contain five scenes');

  let cursor = 0;
  const ids = new Set<string>();
  const beats = new Set<string>();
  for (const scene of AI_AGENTS_SCENES) {
    if (scene.startFrame !== cursor || scene.endFrame <= scene.startFrame) throw new Error(`invalid scene range: ${scene.sceneId}`);
    if (ids.has(scene.sceneId)) throw new Error(`duplicate scene: ${scene.sceneId}`);
    if (scene.implementation !== 'NEW_BUILD') throw new Error(`scene is not NEW_BUILD: ${scene.sceneId}`);
    if (!scene.headline.trim() || !scene.icon.trim() || !scene.spokenText.trim()) throw new Error(`missing viewer content: ${scene.sceneId}`);
    for (const beat of scene.beatIds) {
      if (beats.has(beat)) throw new Error(`duplicate beat: ${beat}`);
      beats.add(beat);
    }
    ids.add(scene.sceneId);
    cursor = scene.endFrame;
  }
  if (cursor !== AI_AGENTS_DURATION_IN_FRAMES) throw new Error('scenes do not cover composition');
  if (beats.size !== 14) throw new Error('reel must contain fourteen unique visual beats');

  for (const scene of AI_AGENTS_SCENES) {
    const cues = AI_AGENTS_SUBTITLES.filter((cue) => cue.sceneId === scene.sceneId).sort((a, b) => a.startFrame - b.startFrame);
    if (cues.length < 2) throw new Error(`too few subtitle cues: ${scene.sceneId}`);
    if (cues.some((cue) => cue.startFrame < scene.startFrame || cue.endFrame > scene.endFrame)) throw new Error(`subtitle outside scene: ${scene.sceneId}`);
    if (normalizeAIAgentText(cues.map((cue) => cue.text).join(' ')) !== normalizeAIAgentText(scene.spokenText)) throw new Error(`subtitle mismatch: ${scene.sceneId}`);
  }
};

assertAIAgentsContract();
