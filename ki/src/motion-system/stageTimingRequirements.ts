import {findBeatFrame, type BeatFrameQuery} from './beatTiming';
import type {MotionStoryboard} from './schema';

export type StageTimingRequirement = {
  key: string;
  query: BeatFrameQuery;
};

const requirement = (key: string, query: BeatFrameQuery): StageTimingRequirement => ({key, query});

export const getStageTimingRequirements = (
  storyboard: MotionStoryboard,
): StageTimingRequirement[] => {
  switch (storyboard.visualType) {
    case 'input-output':
      return [
        requirement('input-show', {targetId: 'input', action: 'show'}),
        requirement('ai-show', {targetId: 'ai', action: 'show'}),
        requirement('input-ai-connect', {
          sourceId: 'input',
          targetId: 'ai',
          action: 'connect',
        }),
        requirement('output-show', {targetId: 'output', action: 'show'}),
      ];

    case 'before-after':
      return [
        requirement('before-show', {targetId: 'input', action: 'show'}),
        requirement('before-dim', {targetId: 'input', action: 'dim'}),
        requirement('after-show', {targetId: 'output', action: 'show'}),
      ];

    case 'comparison':
      return [
        requirement('left-show', {targetId: 'left', action: 'show'}),
        requirement('right-show', {targetId: 'right', action: 'show'}),
        requirement('metric-show', {targetId: 'metric', action: 'show'}),
        requirement('right-highlight', {targetId: 'right', action: 'highlight'}),
      ];

    case 'error-path':
      return [
        requirement('input-show', {targetId: 'input', action: 'show'}),
        requirement('error-show', {targetId: 'error', action: 'show'}),
        requirement('error-shake', {targetId: 'error', action: 'shake'}),
        requirement('check-show', {targetId: 'check', action: 'show'}),
      ];

    case 'context-window':
      return [
        requirement('old-show', {targetId: 'old', action: 'show'}),
        requirement('current-show', {targetId: 'current', action: 'show'}),
        requirement('old-dim', {targetId: 'old', action: 'dim'}),
        requirement('new-show', {targetId: 'new', action: 'show'}),
      ];

    case 'process-chain':
      return storyboard.elements
        .filter((element) => element.id.startsWith('step-'))
        .map((element) =>
          requirement(`${element.id}-show`, {targetId: element.id, action: 'show'}),
        );

    case 'ranking':
      return [
        ...storyboard.elements.map((element) =>
          requirement(`${element.id}-show`, {targetId: element.id, action: 'show'}),
        ),
        requirement('rank-1-highlight', {targetId: 'rank-1', action: 'highlight'}),
      ];

    case 'data-flow':
      return [
        requirement('input-show', {targetId: 'input', action: 'show'}),
        requirement('ai-show', {targetId: 'ai', action: 'show'}),
        requirement('input-ai-connect', {
          sourceId: 'input',
          targetId: 'ai',
          action: 'connect',
        }),
        requirement('ai-output-connect', {
          sourceId: 'ai',
          targetId: 'output',
          action: 'connect',
        }),
        requirement('output-show', {targetId: 'output', action: 'show'}),
      ];

    case 'tool-orchestration': {
      const toolRequirements = storyboard.elements
        .filter((element) => element.kind === 'tool')
        .flatMap((element) => [
          requirement(`${element.id}-show`, {targetId: element.id, action: 'show'}),
          requirement(`${element.id}-connect`, {
            sourceId: 'ai',
            targetId: element.id,
            action: 'connect',
          }),
        ]);

      return [
        requirement('task-show', {targetId: 'task', action: 'show'}),
        requirement('ai-show', {targetId: 'ai', action: 'show'}),
        ...toolRequirements,
        requirement('result-show', {targetId: 'result', action: 'show'}),
      ];
    }

    case 'agent-loop':
      return [
        requirement('ai-show', {targetId: 'ai', action: 'show'}),
        requirement('plan-show', {targetId: 'plan', action: 'show'}),
        requirement('act-show', {targetId: 'act', action: 'show'}),
        requirement('check-show', {targetId: 'check', action: 'show'}),
        requirement('ai-pulse', {targetId: 'ai', action: 'pulse'}),
      ];
  }
};

export const findMissingStageTimings = (
  storyboard: MotionStoryboard,
): StageTimingRequirement[] =>
  getStageTimingRequirements(storyboard).filter(
    (timingRequirement) => findBeatFrame(storyboard, timingRequirement.query) === null,
  );
