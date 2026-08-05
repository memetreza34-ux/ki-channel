import type {MotionBeat, MotionStoryboard} from './schema';

export type BeatFrameQuery = {
  targetId: string;
  action?: MotionBeat['action'];
  sourceId?: string;
};

const matchesQuery = (beat: MotionBeat, query: BeatFrameQuery): boolean =>
  beat.targetId === query.targetId &&
  (query.action === undefined || beat.action === query.action) &&
  (query.sourceId === undefined || beat.sourceId === query.sourceId);

export const findBeatFrame = (
  storyboard: MotionStoryboard,
  query: BeatFrameQuery,
): number | null => {
  const beat = storyboard.beats
    .filter((candidate) => matchesQuery(candidate, query))
    .sort((left, right) => left.atFrame - right.atFrame)[0];

  return beat?.atFrame ?? null;
};

export const resolveBeatFrame = (
  storyboard: MotionStoryboard,
  query: BeatFrameQuery,
  fallback: number,
): number => findBeatFrame(storyboard, query) ?? fallback;
