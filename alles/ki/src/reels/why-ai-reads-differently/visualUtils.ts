import {interpolate, spring} from 'remotion';

export const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

export const progress = (
  frame: number,
  startFrame: number,
  durationFrames: number,
): number =>
  clamp01(
    interpolate(
      frame,
      [startFrame, startFrame + Math.max(1, durationFrames)],
      [0, 1],
      {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
    ),
  );

export const fadeWindow = (
  frame: number,
  enterStart: number,
  enterEnd: number,
  exitStart: number,
  exitEnd: number,
): number =>
  interpolate(
    frame,
    [enterStart, enterEnd, exitStart, exitEnd],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

export const springProgress = ({
  frame,
  fps,
  delay = 0,
  damping = 16,
  stiffness = 150,
  mass = 0.8,
}: {
  frame: number;
  fps: number;
  delay?: number;
  damping?: number;
  stiffness?: number;
  mass?: number;
}): number =>
  spring({
    frame: frame - delay,
    fps,
    config: {damping, stiffness, mass},
    durationInFrames: Math.round(fps * 0.7),
  });

export const seededUnit = (seed: number): number => {
  const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return value - Math.floor(value);
};

export const seededRange = (
  seed: number,
  minimum: number,
  maximum: number,
): number => minimum + seededUnit(seed) * (maximum - minimum);

export const palette = {
  background: '#F8F7FB',
  foreground: '#14121A',
  accent: '#8757E8',
  accentSoft: '#C6A8FF',
  accentPale: '#EEE7FF',
  success: '#35C58A',
  warning: '#FFB648',
  danger: '#FF5D6C',
  muted: '#777083',
  line: '#D9D2E8',
  white: '#FFFFFF',
} as const;

export const shadow = '0 24px 70px rgba(53, 38, 88, 0.14)';
