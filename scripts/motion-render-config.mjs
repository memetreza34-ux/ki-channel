export const VISUAL_TYPES = Object.freeze([
  'input-output',
  'tool-orchestration',
  'comparison',
  'before-after',
  'data-flow',
  'error-path',
  'context-window',
  'agent-loop',
  'ranking',
  'process-chain',
]);

export const DEFAULT_CHECKPOINTS = Object.freeze([0, 37, 75, 112, 149]);
export const SMOKE_CHECKPOINTS = Object.freeze([75]);

export const TIMELINE_TARGET = Object.freeze({
  targetKey: 'timeline-demo',
  compositionId: 'Motion-Timeline-Demo',
  durationInFrames: 624,
  smokeCheckpoints: Object.freeze([75, 233, 391, 549]),
  checkpoints: Object.freeze([75, 233, 391, 549, 623]),
});

export const toMotionCompositionId = (type) =>
  `Motion-${type}`.replace(
    /(^|-)([a-z])/g,
    (_, prefix, letter) => `${prefix}${letter.toUpperCase()}`,
  );
