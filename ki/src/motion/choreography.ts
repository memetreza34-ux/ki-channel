import {easedProgress, staggerDelay, type MotionEasingName} from './easing';

export type ChoreographyPhase = {
  startFrame: number;
  durationInFrames: number;
  easing?: MotionEasingName;
};

export type StaggerOptions = {
  offsetFrames?: number;
  capFrames?: number;
};

/**
 * Progress for one authored motion event.
 *
 * The important distinction is: object motion stays short, while a group may
 * evolve for longer because each object receives its own delayed start.
 */
export const choreographyProgress = (
  frame: number,
  phase: ChoreographyPhase,
): number =>
  easedProgress(
    frame,
    phase.startFrame,
    phase.startFrame + Math.max(1, phase.durationInFrames),
    phase.easing ?? 'enter',
  );

export const staggeredChoreographyProgress = (
  frame: number,
  rank: number,
  phase: ChoreographyPhase,
  options: StaggerOptions = {},
): number => {
  const delay = staggerDelay(
    rank,
    options.offsetFrames ?? 3,
    options.capFrames ?? 24,
  );

  return choreographyProgress(frame, {
    ...phase,
    startFrame: phase.startFrame + delay,
  });
};

/**
 * Deterministic ranks for a center-out wave. Useful for tile explosions,
 * node reveals and other groups that should react as choreography instead of
 * appearing as one flat event.
 */
export const createCenterOutRanks = (
  columns: number,
  rows: number,
): readonly number[] => {
  if (columns <= 0 || rows <= 0) return [];

  const centerX = (columns - 1) / 2;
  const centerY = (rows - 1) / 2;
  const cells = Array.from({length: columns * rows}, (_, index) => {
    const x = index % columns;
    const y = Math.floor(index / columns);
    const distanceSquared = (x - centerX) ** 2 + (y - centerY) ** 2;
    return {index, distanceSquared};
  }).sort(
    (a, b) =>
      a.distanceSquared - b.distanceSquared || a.index - b.index,
  );

  const ranks = Array.from({length: columns * rows}, () => 0);
  cells.forEach((cell, rank) => {
    ranks[cell.index] = rank;
  });
  return ranks;
};

export const mix = (from: number, to: number, progress: number): number =>
  from + (to - from) * progress;
