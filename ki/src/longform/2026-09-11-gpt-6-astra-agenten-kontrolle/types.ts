export type AstraChapterId =
  | 'chapter-01'
  | 'chapter-02'
  | 'chapter-03'
  | 'chapter-04'
  | 'chapter-05'
  | 'chapter-06'
  | 'chapter-07';

export type AstraVisualKind =
  | 'SOURCE_PROOF'
  | 'AGENT_WORKSPACE'
  | 'BENCHMARK_LAB'
  | 'ACCESS_ARCHITECTURE'
  | 'MONITORABILITY_ROOM'
  | 'AGENT_INFRASTRUCTURE'
  | 'CONTROL_STACK'
  | 'REAL_BROLL'
  | 'REAL_IMAGE';

export type AstraTimedBeat = {
  id: string;
  chapterId: AstraChapterId;
  startFrame: number;
  endFrame: number;
  kind: AstraVisualKind;
  headline?: string;
  subline?: string;
  sourceLabel?: string;
  assetStaticPath?: string;
  accent?: 'PURPLE' | 'RISK' | 'POSITIVE' | 'NEUTRAL';
};

export type AstraTimeline = {
  contract: 'ASTRA_VOICE_LOCK_V1';
  fps: 30;
  width: 1920;
  height: 1080;
  durationInFrames: number;
  voiceoverStaticPath: string;
  beats: AstraTimedBeat[];
};

export const assertAstraTimeline = (timeline: AstraTimeline) => {
  if (timeline.contract !== 'ASTRA_VOICE_LOCK_V1') throw new Error('Astra timeline contract mismatch.');
  if (timeline.fps !== 30 || timeline.width !== 1920 || timeline.height !== 1080) {
    throw new Error('Astra timeline must be 1920x1080 at 30fps.');
  }
  if (!Number.isInteger(timeline.durationInFrames) || timeline.durationInFrames <= 1) {
    throw new Error('Astra timeline requires a real voice-locked duration.');
  }
  if (!timeline.voiceoverStaticPath) throw new Error('Final user voiceover path missing.');
  if (!Array.isArray(timeline.beats) || timeline.beats.length === 0) throw new Error('Voice-locked visual beats missing.');
  let previousEnd = 0;
  for (const beat of timeline.beats) {
    if (!Number.isInteger(beat.startFrame) || !Number.isInteger(beat.endFrame) || beat.startFrame < 0 || beat.endFrame <= beat.startFrame) {
      throw new Error(`Invalid beat timing: ${beat.id}`);
    }
    if (beat.startFrame < previousEnd) throw new Error(`Overlapping beat timing: ${beat.id}`);
    if (beat.endFrame > timeline.durationInFrames) throw new Error(`Beat exceeds voice-locked duration: ${beat.id}`);
    if ((beat.kind === 'SOURCE_PROOF' || beat.kind === 'REAL_BROLL' || beat.kind === 'REAL_IMAGE') && !beat.assetStaticPath) {
      throw new Error(`Real/source media beat requires approved local assetStaticPath: ${beat.id}`);
    }
    previousEnd = beat.endFrame;
  }
};
