import {Easing, interpolate, spring} from 'remotion';

const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

export const segmentProgress = (
  frame: number,
  start: number,
  end: number,
  easing: (input: number) => number = Easing.bezier(0.16, 1, 0.3, 1),
): number =>
  interpolate(frame, [start, Math.max(start + 1, end)], [0, 1], {
    ...clamp,
    easing,
  });

export const cinematicPhase = ({
  frame,
  anticipationStart,
  launchFrame,
  impactFrame,
  settleFrame,
  endFrame,
}: {
  frame: number;
  anticipationStart: number;
  launchFrame: number;
  impactFrame: number;
  settleFrame: number;
  endFrame: number;
}) => ({
  anticipation: segmentProgress(frame, anticipationStart, launchFrame, Easing.inOut(Easing.cubic)),
  travel: segmentProgress(frame, launchFrame, impactFrame, Easing.in(Easing.cubic)),
  impact: segmentProgress(frame, impactFrame, impactFrame + Math.max(2, Math.round((settleFrame - impactFrame) * 0.22))),
  settle: segmentProgress(frame, impactFrame, settleFrame, Easing.out(Easing.back(1.7))),
  hold: segmentProgress(frame, settleFrame, endFrame, Easing.linear),
});

export const dampedOscillation = ({
  frame,
  startFrame,
  amplitude,
  decay = 0.1,
  frequency = 0.8,
}: {
  frame: number;
  startFrame: number;
  amplitude: number;
  decay?: number;
  frequency?: number;
}): number => {
  if (frame < startFrame) return 0;
  const t = frame - startFrame;
  return Math.sin(t * frequency) * amplitude * Math.exp(-t * decay);
};

export const springProgress = ({
  frame,
  fps,
  startFrame,
  damping = 14,
  stiffness = 180,
  mass = 0.72,
}: {
  frame: number;
  fps: number;
  startFrame: number;
  damping?: number;
  stiffness?: number;
  mass?: number;
}): number =>
  spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: {damping, stiffness, mass},
  });

export const bezierPoint = (
  t: number,
  p0: readonly [number, number],
  p1: readonly [number, number],
  p2: readonly [number, number],
  p3: readonly [number, number],
): {x: number; y: number} => {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;
  return {
    x: uuu * p0[0] + 3 * uu * t * p1[0] + 3 * u * tt * p2[0] + ttt * p3[0],
    y: uuu * p0[1] + 3 * uu * t * p1[1] + 3 * u * tt * p2[1] + ttt * p3[1],
  };
};

export const bezierTangentAngle = (
  t: number,
  p0: readonly [number, number],
  p1: readonly [number, number],
  p2: readonly [number, number],
  p3: readonly [number, number],
): number => {
  const u = 1 - t;
  const dx =
    3 * u * u * (p1[0] - p0[0]) +
    6 * u * t * (p2[0] - p1[0]) +
    3 * t * t * (p3[0] - p2[0]);
  const dy =
    3 * u * u * (p1[1] - p0[1]) +
    6 * u * t * (p2[1] - p1[1]) +
    3 * t * t * (p3[1] - p2[1]);
  return (Math.atan2(dy, dx) * 180) / Math.PI;
};
