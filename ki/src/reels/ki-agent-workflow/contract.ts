import reelJson from '../../../reels/2026-09-14_bis_2026-09-20/01_Montag/01_Wie-ein-KI-Agent-Aufgaben-selbststaendig-erledigt/06-projektdateien/reel.json';
import subtitleJson from '../../../reels/2026-09-14_bis_2026-09-20/01_Montag/01_Wie-ein-KI-Agent-Aufgaben-selbststaendig-erledigt/03-caption/subtitle-cues.json';

export type KIAgentWorkflowScene = {
  sceneId: string;
  title: string;
  startFrame: number;
  endFrame: number;
  accent: string;
};

export type KIAgentWorkflowCue = {
  sentenceId: string;
  sceneId: string;
  startFrame: number;
  endFrame: number;
  text: string;
};

const reel = reelJson as {
  compositionId: string;
  format: {width: number; height: number; fps: number; planningDurationInFrames: number};
  scenes: KIAgentWorkflowScene[];
};
const subtitles = subtitleJson as {fps: number; cues: KIAgentWorkflowCue[]};

export const KI_AGENT_WORKFLOW_COMPOSITION_ID = reel.compositionId;
export const KI_AGENT_WORKFLOW_WIDTH = reel.format.width;
export const KI_AGENT_WORKFLOW_HEIGHT = reel.format.height;
export const KI_AGENT_WORKFLOW_FPS = reel.format.fps;
export const KI_AGENT_WORKFLOW_DURATION_IN_FRAMES = reel.format.planningDurationInFrames;
export const KI_AGENT_WORKFLOW_SCENES = Object.freeze(reel.scenes.map((scene) => Object.freeze({...scene})));
export const KI_AGENT_WORKFLOW_CUES = Object.freeze(subtitles.cues.map((cue) => Object.freeze({...cue})));

export const assertKIAgentWorkflowContract = (): void => {
  if (KI_AGENT_WORKFLOW_COMPOSITION_ID !== 'KI-AgentWorkflow') throw new Error('unexpected composition id');
  if (KI_AGENT_WORKFLOW_WIDTH !== 1080 || KI_AGENT_WORKFLOW_HEIGHT !== 1920 || KI_AGENT_WORKFLOW_FPS !== 30) throw new Error('format must be 1080x1920 @30fps');
  if (KI_AGENT_WORKFLOW_DURATION_IN_FRAMES !== 2040) throw new Error('planning duration must be 2040 frames');
  if (KI_AGENT_WORKFLOW_SCENES.length !== 6) throw new Error('reel must contain six scenes');
  let cursor = 0;
  for (const scene of KI_AGENT_WORKFLOW_SCENES) {
    if (scene.startFrame !== cursor || scene.endFrame <= scene.startFrame) throw new Error(`invalid scene range: ${scene.sceneId}`);
    cursor = scene.endFrame;
  }
  if (cursor !== KI_AGENT_WORKFLOW_DURATION_IN_FRAMES) throw new Error('scenes must cover full planning duration');
  if (KI_AGENT_WORKFLOW_CUES.length !== 13) throw new Error('expected 13 preview sentence cues');
  if (KI_AGENT_WORKFLOW_CUES.some((cue) => cue.startFrame < 0 || cue.endFrame > KI_AGENT_WORKFLOW_DURATION_IN_FRAMES || cue.endFrame <= cue.startFrame)) throw new Error('invalid caption cue range');
};

assertKIAgentWorkflowContract();
