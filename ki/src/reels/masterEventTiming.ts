export type MasterTimingWord = {
  text: string;
  startFrame: number;
  endFrame: number;
};

export type MasterTimingCue = {
  sceneId: string;
  sentenceId: string;
  startFrame: number;
  endFrame: number;
  text: string;
  words?: readonly MasterTimingWord[];
};

export type MasterTimingScene = {
  sceneId: string;
  startFrame: number;
  endFrame: number;
};

export type MasterSyncEvent = {
  id: string;
  sceneId: string;
  sentenceId: string;
  anchorType: 'SENTENCE_START' | 'SENTENCE_END' | 'PHRASE_START' | 'PHRASE_END';
  anchorPhrase?: string;
  offsetFrames?: number;
};

export type MasterSyncPlan = {
  events: readonly MasterSyncEvent[];
};

const normalize = (value: string) =>
  String(value ?? '')
    .normalize('NFKC')
    .toLocaleLowerCase('de-DE')
    .replace(/[–—]/g, '-')
    .replace(/[^\p{L}\p{N}]+/gu, '')
    .trim();

const tokens = (value: string) => String(value ?? '').split(/\s+/).map(normalize).filter(Boolean);
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, Math.round(value)));

export const createMasterEventTiming = (
  cues: readonly MasterTimingCue[],
  scenes: readonly MasterTimingScene[],
  plan: MasterSyncPlan,
) => {
  const sceneById = new Map(scenes.map((scene) => [scene.sceneId, scene]));
  const eventsById = new Map<string, MasterSyncEvent>();
  for (const event of plan.events ?? []) {
    if (!event?.id) throw new Error('SYNC-PLAN event without id');
    if (eventsById.has(event.id)) throw new Error(`Duplicate SYNC-PLAN event id: ${event.id}`);
    eventsById.set(event.id, event);
  }

  const sentenceCues = (sceneId: string, sentenceId: string) =>
    cues
      .filter((cue) => cue.sceneId === sceneId && cue.sentenceId === sentenceId)
      .sort((a, b) => a.startFrame - b.startFrame);

  const alignedWords = (sceneId: string, sentenceId: string) =>
    sentenceCues(sceneId, sentenceId)
      .flatMap((cue) => cue.words ?? [])
      .filter((word) => Number.isFinite(word.startFrame) && Number.isFinite(word.endFrame))
      .sort((a, b) => a.startFrame - b.startFrame);

  const phraseMatch = (words: readonly MasterTimingWord[], phrase: string) => {
    const wanted = tokens(phrase);
    const normalized = words.map((word) => normalize(word.text));
    for (let index = 0; index <= normalized.length - wanted.length; index++) {
      let ok = true;
      for (let offset = 0; offset < wanted.length; offset++) {
        if (normalized[index + offset] !== wanted[offset]) {
          ok = false;
          break;
        }
      }
      if (ok) return {first: words[index], last: words[index + wanted.length - 1]};
    }
    return null;
  };

  const previewPhraseFrame = (
    sceneId: string,
    sentenceId: string,
    phrase: string,
    edge: 'start' | 'end',
  ) => {
    const matches = sentenceCues(sceneId, sentenceId);
    if (!matches.length) throw new Error(`No preview cues for ${sceneId}/${sentenceId}`);
    const sentenceStart = Math.min(...matches.map((cue) => cue.startFrame));
    const sentenceEnd = Math.max(...matches.map((cue) => cue.endFrame));
    const sentenceTokens = tokens(matches.map((cue) => cue.text).join(' '));
    const wanted = tokens(phrase);
    if (!wanted.length || !sentenceTokens.length) return sentenceStart;
    let found = -1;
    for (let index = 0; index <= sentenceTokens.length - wanted.length; index++) {
      let ok = true;
      for (let offset = 0; offset < wanted.length; offset++) {
        if (sentenceTokens[index + offset] !== wanted[offset]) {
          ok = false;
          break;
        }
      }
      if (ok) {
        found = index;
        break;
      }
    }
    if (found < 0) throw new Error(`Preview phrase "${phrase}" missing in ${sceneId}/${sentenceId}`);
    const tokenIndex = edge === 'start' ? found : found + wanted.length;
    const progress = tokenIndex / Math.max(1, sentenceTokens.length);
    return Math.round(sentenceStart + (sentenceEnd - sentenceStart) * progress);
  };

  const globalFrame = (eventId: string) => {
    const event = eventsById.get(eventId);
    if (!event) throw new Error(`Unknown master event: ${eventId}`);
    const scene = sceneById.get(event.sceneId);
    if (!scene) throw new Error(`${eventId}: unknown scene ${event.sceneId}`);
    const matches = sentenceCues(event.sceneId, event.sentenceId);
    if (!matches.length) throw new Error(`${eventId}: no cues for ${event.sceneId}/${event.sentenceId}`);
    const words = alignedWords(event.sceneId, event.sentenceId);
    const productionAligned = words.length > 0;

    let baseFrame: number;
    if (event.anchorType === 'SENTENCE_START') {
      baseFrame = productionAligned ? words[0].startFrame : Math.min(...matches.map((cue) => cue.startFrame));
    } else if (event.anchorType === 'SENTENCE_END') {
      baseFrame = productionAligned ? words[words.length - 1].endFrame : Math.max(...matches.map((cue) => cue.endFrame));
    } else {
      const phrase = String(event.anchorPhrase || '').trim();
      if (!phrase) throw new Error(`${eventId}: ${event.anchorType} requires anchorPhrase`);
      if (productionAligned) {
        const match = phraseMatch(words, phrase);
        if (!match) {
          throw new Error(
            `${eventId}: exact aligned phrase "${phrase}" missing. Production timing may not fall back to estimates.`,
          );
        }
        baseFrame = event.anchorType === 'PHRASE_START' ? match.first.startFrame : match.last.endFrame;
      } else {
        baseFrame = previewPhraseFrame(
          event.sceneId,
          event.sentenceId,
          phrase,
          event.anchorType === 'PHRASE_START' ? 'start' : 'end',
        );
      }
    }

    const resolved = Math.round(baseFrame + Number(event.offsetFrames || 0));
    return clamp(resolved, scene.startFrame, scene.endFrame - 1);
  };

  const sceneFrame = (sceneId: string, eventId: string) => {
    const event = eventsById.get(eventId);
    if (!event) throw new Error(`Unknown master event: ${eventId}`);
    if (event.sceneId !== sceneId) throw new Error(`${eventId}: expected ${event.sceneId}, got ${sceneId}`);
    const scene = sceneById.get(sceneId);
    if (!scene) throw new Error(`Unknown scene: ${sceneId}`);
    return globalFrame(eventId) - scene.startFrame;
  };

  return {
    globalFrame,
    sceneFrame,
    hasEvent: (eventId: string) => eventsById.has(eventId),
  };
};
