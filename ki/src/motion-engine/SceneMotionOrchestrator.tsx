import React from 'react';
import {useCurrentFrame} from 'remotion';
import {segmentProgress} from './motionMath';

export type MotionBeat = {
  id: string;
  startFrame: number;
  endFrame: number;
  role: 'anticipation' | 'travel' | 'impact' | 'reveal' | 'settle' | 'hold';
};

export type SceneMotionState = {
  frame: number;
  activeBeat: MotionBeat | null;
  beatProgress: number;
  sceneProgress: number;
};

export const SceneMotionOrchestrator: React.FC<{
  durationInFrames: number;
  beats: readonly MotionBeat[];
  children: (state: SceneMotionState) => React.ReactNode;
}> = ({durationInFrames, beats, children}) => {
  const frame = useCurrentFrame();
  const activeBeat = beats.find((beat) => frame >= beat.startFrame && frame <= beat.endFrame) ?? null;
  const beatProgress = activeBeat
    ? segmentProgress(frame, activeBeat.startFrame, activeBeat.endFrame)
    : 0;
  const sceneProgress = segmentProgress(frame, 0, Math.max(1, durationInFrames - 1));

  return <>{children({frame, activeBeat, beatProgress, sceneProgress})}</>;
};

export const assertMotionBeatContract = (
  beats: readonly MotionBeat[],
  durationInFrames: number,
): void => {
  if (beats.length < 3) {
    throw new Error('motion choreography needs at least three authored beats');
  }
  let previousEnd = -1;
  for (const beat of beats) {
    if (!beat.id.trim()) throw new Error('motion beat id must not be empty');
    if (beat.startFrame < 0 || beat.endFrame <= beat.startFrame) {
      throw new Error(`invalid motion beat range: ${beat.id}`);
    }
    if (beat.startFrame < previousEnd) {
      throw new Error(`motion beats overlap unexpectedly at ${beat.id}`);
    }
    if (beat.endFrame >= durationInFrames) {
      throw new Error(`motion beat ${beat.id} exceeds scene duration`);
    }
    previousEnd = beat.endFrame;
  }
  const roles = new Set(beats.map((beat) => beat.role));
  if (!roles.has('impact') && !roles.has('reveal')) {
    throw new Error('motion choreography needs a visible impact or reveal beat');
  }
  if (!roles.has('settle') && !roles.has('hold')) {
    throw new Error('motion choreography needs a settle or hold beat');
  }
};
