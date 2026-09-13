import reelJson from '../../../reels/2026-09-14_bis_2026-09-20/01_Montag/01_Wie-ein-KI-Agent-Aufgaben-selbststaendig-erledigt/06-projektdateien/reel.json';
import subtitleJson from '../../../reels/2026-09-14_bis_2026-09-20/01_Montag/01_Wie-ein-KI-Agent-Aufgaben-selbststaendig-erledigt/03-caption/subtitle-cues.json';

export type KIAgentWorkflowScene = {
  sceneId: string;
  title: string;
  startFrame: number;
  endFrame: number;
  accent: string;
  timingStatus?: string;
};

export type KIAgentWorkflowCueWord = {
  text: string;
  startFrame: number;
  endFrame: number;
};

export type KIAgentWorkflowCue = {
  id?: string;
  sentenceId: string;
  sceneId: string;
  startFrame: number;
  endFrame: number;
  text: string;
  words?: KIAgentWorkflowCueWord[];
};

const reel = reelJson as {
  compositionId: string;
  format: {
    width: number;
    height: number;
    fps: number;
    planningDurationInFrames: number;
    finalDurationInFrames?: number | null;
  };
  scenes: KIAgentWorkflowScene[];
};
const subtitles = subtitleJson as {
  fps: number;
  timingStatus?: string;
  timingAuthority?: string;
  cues: KIAgentWorkflowCue[];
};

const finalDuration = Number(reel.format.finalDurationInFrames);
const hasFinalDuration = Number.isFinite(finalDuration) && finalDuration > 0;
const captionStatus = String(subtitles.timingStatus || '').toUpperCase();
const captionAuthority = String(subtitles.timingAuthority || '');
const scenesVoiceLocked = reel.scenes.every((scene) => String(scene.timingStatus || '').toUpperCase() === 'VOICE_LOCKED');

export const KI_AGENT_WORKFLOW_COMPOSITION_ID = reel.compositionId;
export const KI_AGENT_WORKFLOW_WIDTH = reel.format.width;
export const KI_AGENT_WORKFLOW_HEIGHT = reel.format.height;
export const KI_AGENT_WORKFLOW_FPS = reel.format.fps;
export const KI_AGENT_WORKFLOW_DURATION_IN_FRAMES = hasFinalDuration ? finalDuration : reel.format.planningDurationInFrames;
export const KI_AGENT_WORKFLOW_SCENES = Object.freeze(reel.scenes.map((scene) => Object.freeze({...scene})));
export const KI_AGENT_WORKFLOW_CUES = Object.freeze(
  subtitles.cues.map((cue) => Object.freeze({...cue, words: cue.words ? Object.freeze(cue.words.map((word) => Object.freeze({...word}))) : undefined})),
);
export const KI_AGENT_WORKFLOW_TIMING_LOCKED =
  hasFinalDuration &&
  scenesVoiceLocked &&
  (captionStatus.startsWith('VOICE_LOCKED') || captionStatus.startsWith('WORD_ALIGNED')) &&
  captionAuthority.endsWith('WORD-TIMINGS.json');

export const assertKIAgentWorkflowContract = (): void => {
  if (KI_AGENT_WORKFLOW_COMPOSITION_ID !== 'KI-AgentWorkflow') throw new Error('unexpected composition id');
  if (KI_AGENT_WORKFLOW_WIDTH !== 1080 || KI_AGENT_WORKFLOW_HEIGHT !== 1920 || KI_AGENT_WORKFLOW_FPS !== 30) throw new Error('format must be 1080x1920 @30fps');
  if (!Number.isFinite(KI_AGENT_WORKFLOW_DURATION_IN_FRAMES) || KI_AGENT_WORKFLOW_DURATION_IN_FRAMES <= 0) throw new Error('duration must be positive');
  if (KI_AGENT_WORKFLOW_SCENES.length !== 6) throw new Error('reel must contain six scenes');

  let cursor = 0;
  for (const scene of KI_AGENT_WORKFLOW_SCENES) {
    if (scene.startFrame !== cursor || scene.endFrame <= scene.startFrame) throw new Error(`invalid scene range: ${scene.sceneId}`);
    cursor = scene.endFrame;
  }
  if (cursor !== KI_AGENT_WORKFLOW_DURATION_IN_FRAMES) throw new Error('scenes must cover the active composition duration');
  if (KI_AGENT_WORKFLOW_CUES.length < 13) throw new Error('expected at least 13 caption cue groups');
  if (KI_AGENT_WORKFLOW_CUES.some((cue) => cue.startFrame < 0 || cue.endFrame > KI_AGENT_WORKFLOW_DURATION_IN_FRAMES || cue.endFrame <= cue.startFrame)) throw new Error('invalid caption cue range');

  if (hasFinalDuration) {
    if (!KI_AGENT_WORKFLOW_TIMING_LOCKED) throw new Error('final duration exists but voice/caption/scene timing is not fully locked');
    if (KI_AGENT_WORKFLOW_CUES.some((cue) => !cue.words?.length)) throw new Error('voice-locked captions require word timings');
  }
};

assertKIAgentWorkflowContract();
