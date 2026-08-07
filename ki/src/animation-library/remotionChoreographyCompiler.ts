import {getMicroMotionMechanism} from './microMotionCatalog';
import type {
  UniversalReelMotionPlan,
  UniversalSceneMotionPlan,
} from './universalMotionPlan';

export type RenderSafeZone =
  | 'full-canvas'
  | 'headline-top'
  | 'main-center'
  | 'subtitle-bottom'
  | 'annotation-overlay'
  | 'audio-only';

export type CompiledMotionEvent = {
  eventId: string;
  sceneId: string;
  eventType:
    | 'headline'
    | 'main-animation'
    | 'subtitle-word'
    | 'semantic-beat'
    | 'sound-cue'
    | 'transition';
  startFrame: number;
  endFrameExclusive: number;
  zIndex: number;
  safeZone: RenderSafeZone;
  mechanismId: string;
  targetText: string | null;
  intensity: 'quiet' | 'support' | 'strong';
  metadata: Record<string, string | number | boolean | null>;
};

export type CompiledSceneChoreography = {
  sceneId: string;
  durationInFrames: number;
  events: CompiledMotionEvent[];
  strongEventPeak: number;
  stableStartHold: boolean;
  stableEndHold: boolean;
  semanticPayloadEmbedded: boolean;
  subtitleWordCount: number;
  semanticBeatCount: number;
  valid: boolean;
  blockers: string[];
  warnings: string[];
};

export type CompiledReelChoreography = {
  reelId: string;
  scenes: CompiledSceneChoreography[];
  totalEvents: number;
  subtitleWordCount: number;
  semanticBeatCount: number;
  soundCueCount: number;
  valid: boolean;
  blockers: string[];
  warnings: string[];
};

const safeZoneForLayer = (
  layer: string,
): RenderSafeZone => {
  switch (layer) {
    case 'kinetic-type':
      return 'subtitle-bottom';
    case 'main-object':
    case 'measurement':
    case 'ui-simulation':
      return 'main-center';
    case 'connector':
    case 'annotation':
      return 'annotation-overlay';
    case 'sound-cue':
      return 'audio-only';
    case 'transition':
      return 'full-canvas';
    default:
      return 'annotation-overlay';
  }
};

const wordFrame = ({
  tokenIndex,
  tokenCount,
  startFrame,
  endFrameExclusive,
}: {
  tokenIndex: number;
  tokenCount: number;
  startFrame: number;
  endFrameExclusive: number;
}): number => {
  if (tokenCount <= 1) return Math.round((startFrame + endFrameExclusive) / 2);
  const ratio = tokenIndex / (tokenCount - 1);
  return Math.round(startFrame + (endFrameExclusive - startFrame - 1) * ratio);
};

const peakOverlap = (
  events: readonly CompiledMotionEvent[],
  intensity: CompiledMotionEvent['intensity'],
  durationInFrames: number,
): number => {
  let peak = 0;
  for (let frame = 0; frame < durationInFrames; frame += 1) {
    const active = events.filter(
      (event) =>
        event.intensity === intensity &&
        frame >= event.startFrame &&
        frame < event.endFrameExclusive,
    ).length;
    peak = Math.max(peak, active);
  }
  return peak;
};

const compactTerms = (values: readonly string[]): string =>
  values.filter(Boolean).join(' | ');

export const compileSceneChoreography = (
  scene: UniversalSceneMotionPlan,
): CompiledSceneChoreography => {
  const events: CompiledMotionEvent[] = [];
  const blockers: string[] = [];
  const warnings: string[] = [];
  const activeStart = scene.stableStartHoldFrames;
  const activeEnd = scene.durationInFrames - scene.stableEndHoldFrames;
  const meaning = scene.meaningContract;
  const headlineText =
    compactTerms(meaning.subjectTerms.slice(0, 3)) ||
    scene.sentenceCoverage.tokens.slice(0, 3).map((token) => token.text).join(' ');

  events.push({
    eventId: `${scene.sceneId}-headline`,
    sceneId: scene.sceneId,
    eventType: 'headline',
    startFrame: 0,
    endFrameExclusive: Math.min(scene.durationInFrames, activeStart + 20),
    zIndex: 60,
    safeZone: 'headline-top',
    mechanismId: scene.headlineMotionId,
    targetText: headlineText || null,
    intensity: 'support',
    metadata: {
      persistentAfterEntry: true,
      communicationGoal: meaning.communicationGoal,
    },
  });
  events.push({
    eventId: `${scene.sceneId}-main`,
    sceneId: scene.sceneId,
    eventType: 'main-animation',
    startFrame: activeStart,
    endFrameExclusive: activeEnd,
    zIndex: 20,
    safeZone: 'main-center',
    mechanismId: scene.animationId,
    targetText: scene.spokenText,
    intensity: 'strong',
    metadata: {
      semanticContractVersion: 1,
      contentSpecific: true,
      visualFamily: scene.visualFamily,
      layoutFamily: scene.layoutFamily,
      motionSignature: scene.motionSignature,
      communicationGoal: meaning.communicationGoal,
      startState: meaning.startState,
      visibleChange: meaning.visibleChange,
      endState: meaning.endState,
      subjectTerms: compactTerms(meaning.subjectTerms),
      actionTerms: compactTerms(meaning.actionTerms),
      resultTerms: compactTerms(meaning.resultTerms),
      requiredVisualCues: compactTerms(meaning.requiredVisualCues),
      forbiddenVisualCues: compactTerms(meaning.forbiddenVisualCues),
    },
  });

  const tokens = scene.sentenceCoverage.tokens;
  for (const token of tokens) {
    const startFrame = wordFrame({
      tokenIndex: token.tokenIndex,
      tokenCount: tokens.length,
      startFrame: activeStart,
      endFrameExclusive: activeEnd,
    });
    events.push({
      eventId: `${scene.sceneId}-subtitle-${String(token.tokenIndex).padStart(2, '0')}`,
      sceneId: scene.sceneId,
      eventType: 'subtitle-word',
      startFrame,
      endFrameExclusive: Math.min(activeEnd, startFrame + 14),
      zIndex: 80,
      safeZone: 'subtitle-bottom',
      mechanismId: 'subtitle-word-reveal',
      targetText: token.text,
      intensity: 'quiet',
      metadata: {tokenIndex: token.tokenIndex},
    });
  }

  for (const beat of scene.sentenceCoverage.beats) {
    const mechanism = getMicroMotionMechanism(beat.mechanismId);
    if (!mechanism) {
      blockers.push(`unknown mechanism ${beat.mechanismId}`);
      continue;
    }
    const endFrameExclusive = Math.min(
      activeEnd,
      beat.atFrame + mechanism.maximumDurationFrames,
    );
    if (endFrameExclusive <= beat.atFrame) {
      blockers.push(`beat ${beat.beatId} has no renderable duration`);
      continue;
    }
    events.push({
      eventId: beat.beatId,
      sceneId: scene.sceneId,
      eventType: 'semantic-beat',
      startFrame: beat.atFrame,
      endFrameExclusive,
      zIndex: beat.layer === 'kinetic-type' ? 90 : 45,
      safeZone: safeZoneForLayer(beat.layer),
      mechanismId: beat.mechanismId,
      targetText: beat.text,
      intensity: beat.intensity,
      metadata: {
        role: beat.role,
        tokenIndex: beat.tokenIndex,
        critical: beat.critical,
        communicationGoal: meaning.communicationGoal,
      },
    });
    if (beat.soundCue !== 'none') {
      events.push({
        eventId: `${beat.beatId}-sound`,
        sceneId: scene.sceneId,
        eventType: 'sound-cue',
        startFrame: beat.atFrame,
        endFrameExclusive: Math.min(scene.durationInFrames, beat.atFrame + 2),
        zIndex: 0,
        safeZone: 'audio-only',
        mechanismId: beat.soundCue,
        targetText: null,
        intensity: beat.intensity,
        metadata: {linkedBeatId: beat.beatId},
      });
    }
  }

  if (scene.transitionOut) {
    const duration = scene.transitionOut.maximumDurationFrames;
    events.push({
      eventId: `${scene.sceneId}-transition-out`,
      sceneId: scene.sceneId,
      eventType: 'transition',
      startFrame: Math.max(activeEnd, scene.durationInFrames - duration),
      endFrameExclusive: scene.durationInFrames,
      zIndex: 100,
      safeZone: 'full-canvas',
      mechanismId: scene.transitionOut.mechanismId,
      targetText: null,
      intensity:
        scene.transitionOut.mechanismId === 'transition-hard-cut-impact'
          ? 'strong'
          : 'support',
      metadata: {
        toSceneId: scene.transitionOut.toSceneId,
        outgoingSemanticState: meaning.endState,
      },
    });
  }

  const mainEvent = events.find((event) => event.eventType === 'main-animation');
  const semanticPayloadEmbedded = Boolean(
    mainEvent?.targetText &&
    mainEvent.metadata.startState &&
    mainEvent.metadata.visibleChange &&
    mainEvent.metadata.endState &&
    mainEvent.metadata.requiredVisualCues,
  );
  if (!semanticPayloadEmbedded) {
    blockers.push('main animation event is missing the exact semantic payload');
  }

  const strongEventsWithoutMain = events.filter(
    (event) => event.eventType !== 'main-animation',
  );
  const strongEventPeak = peakOverlap(
    strongEventsWithoutMain,
    'strong',
    scene.durationInFrames,
  );
  if (strongEventPeak > scene.maximumSimultaneousStrongMotions) {
    blockers.push(
      `strong motion overlap peaks at ${strongEventPeak}/${scene.maximumSimultaneousStrongMotions}`,
    );
  }
  const startStrongEvents = strongEventsWithoutMain.filter(
    (event) => event.intensity === 'strong' && event.startFrame < activeStart,
  );
  const endStrongEvents = strongEventsWithoutMain.filter(
    (event) => event.intensity === 'strong' && event.startFrame >= activeEnd,
  );
  const stableStartHold = startStrongEvents.length === 0;
  const stableEndHold = endStrongEvents.every(
    (event) => event.eventType === 'transition',
  );
  if (!stableStartHold) blockers.push('strong motion starts inside the opening hold');
  if (!stableEndHold) blockers.push('strong semantic motion enters the final hold');

  const annotationEvents = events.filter(
    (event) => event.safeZone === 'annotation-overlay',
  );
  if (annotationEvents.length > 8) {
    warnings.push(`${annotationEvents.length} annotation events may overload the scene`);
  }
  if (scene.soundCues.length > 8) {
    warnings.push(`${scene.soundCues.length} sound cues may overload the scene`);
  }

  return {
    sceneId: scene.sceneId,
    durationInFrames: scene.durationInFrames,
    events: events.sort(
      (left, right) => left.startFrame - right.startFrame || left.zIndex - right.zIndex,
    ),
    strongEventPeak,
    stableStartHold,
    stableEndHold,
    semanticPayloadEmbedded,
    subtitleWordCount: tokens.length,
    semanticBeatCount: scene.sentenceCoverage.beats.length,
    valid: blockers.length === 0,
    blockers,
    warnings,
  };
};

export const compileReelChoreography = (
  plan: UniversalReelMotionPlan,
): CompiledReelChoreography => {
  const scenes = plan.scenes.map(compileSceneChoreography);
  const blockers = [
    ...plan.blockers,
    ...scenes.flatMap((scene) => scene.blockers.map(
      (blocker) => `${scene.sceneId}: ${blocker}`,
    )),
  ];
  const warnings = [
    ...plan.warnings,
    ...scenes.flatMap((scene) => scene.warnings.map(
      (warning) => `${scene.sceneId}: ${warning}`,
    )),
  ];
  return {
    reelId: plan.reelId,
    scenes,
    totalEvents: scenes.reduce((sum, scene) => sum + scene.events.length, 0),
    subtitleWordCount: scenes.reduce(
      (sum, scene) => sum + scene.subtitleWordCount,
      0,
    ),
    semanticBeatCount: scenes.reduce(
      (sum, scene) => sum + scene.semanticBeatCount,
      0,
    ),
    soundCueCount: scenes.reduce(
      (sum, scene) => sum + scene.events.filter(
        (event) => event.eventType === 'sound-cue',
      ).length,
      0,
    ),
    valid: plan.everythingAnimatedAsFarAsUseful && blockers.length === 0,
    blockers: [...new Set(blockers)],
    warnings: [...new Set(warnings)],
  };
};
