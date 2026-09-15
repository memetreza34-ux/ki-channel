export type LongformResolvedVisual = {
  startFrame: number;
  enterEndFrame: number;
  holdStartFrame: number;
  holdEndFrame: number;
  exitStartFrame: number;
  endFrame: number;
  enterFrames: number;
  holdFrames: number;
  exitFrames: number;
};

export type LongformResolvedBeat = {
  id: string;
  chapterId: string;
  sentenceId: string;
  target: string;
  kind?: string;
  spokenText: string;
  speech: {startFrame: number; endFrame: number};
  visual: LongformResolvedVisual;
  captionCueIds?: string[];
  sfx?: {id: string; frame: number; file?: string | null; gain?: number} | null;
};

export type LongformResolvedChapter = {
  chapterId: string;
  startFrame: number;
  endFrame: number;
};

export type LongformChoreographyDocument = {
  status: string;
  syncContract?: string;
  fps: number;
  finalDurationInFrames: number;
  chapters: LongformResolvedChapter[];
  beats: LongformResolvedBeat[];
};

export type LocalLongformBeat = LongformResolvedBeat & {
  chapterStartFrame: number;
  chapterEndFrame: number;
  localSpeech: {startFrame: number; endFrame: number};
  localVisual: LongformResolvedVisual;
  localSfxFrame: number | null;
};

export type LongformBeatPhase = 'BEFORE' | 'ENTER' | 'HOLD' | 'EXIT' | 'AFTER';

const assertFrame = (value: unknown, label: string): number => {
  const number = Number(value);
  if (!Number.isFinite(number)) throw new Error(`${label} must be a finite frame.`);
  return number;
};

export const createLongformChoreographyTiming = (document: LongformChoreographyDocument) => {
  if (document?.status !== 'CHOREOGRAPHY_LOCKED') {
    throw new Error('Longform choreography must be CHOREOGRAPHY_LOCKED before render.');
  }
  if (!Array.isArray(document.chapters) || !document.chapters.length) throw new Error('Longform choreography has no chapters.');
  if (!Array.isArray(document.beats) || !document.beats.length) throw new Error('Longform choreography has no beats.');

  const chapters = new Map(document.chapters.map((chapter) => [chapter.chapterId, chapter]));
  const beats = new Map<string, LongformResolvedBeat>();
  for (const beat of document.beats) {
    if (beats.has(beat.id)) throw new Error(`Duplicate choreography beat: ${beat.id}`);
    const chapter = chapters.get(beat.chapterId);
    if (!chapter) throw new Error(`${beat.id}: unknown chapter ${beat.chapterId}`);
    const v = beat.visual;
    if (!(v.startFrame < v.enterEndFrame && v.enterEndFrame === v.holdStartFrame && v.holdStartFrame <= v.holdEndFrame && v.holdEndFrame === v.exitStartFrame && v.exitStartFrame < v.endFrame)) {
      throw new Error(`${beat.id}: invalid ENTER/HOLD/EXIT interval.`);
    }
    beats.set(beat.id, beat);
  }

  const beat = (beatId: string): LongformResolvedBeat => {
    const value = beats.get(beatId);
    if (!value) throw new Error(`Unknown longform choreography beat: ${beatId}`);
    return value;
  };

  const local = (chapterId: string, beatId: string): LocalLongformBeat => {
    const chapter = chapters.get(chapterId);
    if (!chapter) throw new Error(`Unknown longform chapter: ${chapterId}`);
    const value = beat(beatId);
    if (value.chapterId !== chapterId) throw new Error(`${beatId} belongs to ${value.chapterId}, not ${chapterId}.`);
    const shift = assertFrame(chapter.startFrame, `${chapterId}.startFrame`);
    const visual = value.visual;
    return {
      ...value,
      chapterStartFrame: chapter.startFrame,
      chapterEndFrame: chapter.endFrame,
      localSpeech: {
        startFrame: value.speech.startFrame - shift,
        endFrame: value.speech.endFrame - shift,
      },
      localVisual: {
        ...visual,
        startFrame: visual.startFrame - shift,
        enterEndFrame: visual.enterEndFrame - shift,
        holdStartFrame: visual.holdStartFrame - shift,
        holdEndFrame: visual.holdEndFrame - shift,
        exitStartFrame: visual.exitStartFrame - shift,
        endFrame: visual.endFrame - shift,
      },
      localSfxFrame: value.sfx ? value.sfx.frame - shift : null,
    };
  };

  const phaseAt = (frame: number, beatId: string): {phase: LongformBeatPhase; progress: number; active: boolean} => {
    const value = beat(beatId).visual;
    const current = assertFrame(frame, 'frame');
    if (current < value.startFrame) return {phase: 'BEFORE', progress: 0, active: false};
    if (current >= value.endFrame) return {phase: 'AFTER', progress: 1, active: false};
    if (current < value.enterEndFrame) {
      const length = Math.max(1, value.enterEndFrame - value.startFrame);
      return {phase: 'ENTER', progress: (current - value.startFrame) / length, active: true};
    }
    if (current < value.exitStartFrame) return {phase: 'HOLD', progress: 1, active: true};
    const length = Math.max(1, value.endFrame - value.exitStartFrame);
    return {phase: 'EXIT', progress: (current - value.exitStartFrame) / length, active: true};
  };

  return {
    fps: document.fps,
    finalDurationInFrames: document.finalDurationInFrames,
    beat,
    local,
    phaseAt,
    beatIds: [...beats.keys()],
  };
};
