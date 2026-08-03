import type {MotionElement, MotionStoryboard} from './schema';

const fixedIds = (...ids: string[]): Set<string> => new Set(ids);

export const getRenderedStageElementIds = (
  storyboard: MotionStoryboard,
): Set<string> => {
  switch (storyboard.visualType) {
    case 'input-output':
      return fixedIds('input', 'ai', 'output');

    case 'before-after':
      return fixedIds('input', 'output');

    case 'comparison':
      return fixedIds('left', 'right', 'metric');

    case 'error-path':
      return fixedIds('input', 'ai', 'error', 'check');

    case 'context-window':
      return fixedIds('old', 'current', 'new');

    case 'data-flow':
      return fixedIds('input', 'ai', 'output');

    case 'tool-orchestration':
      return fixedIds(
        'task',
        'ai',
        'result',
        ...storyboard.elements
          .filter((element) => element.kind === 'tool')
          .slice(0, 3)
          .map((element) => element.id),
      );

    case 'agent-loop':
      return fixedIds('ai', 'plan', 'act', 'check');

    case 'ranking':
      return new Set(storyboard.elements.slice(0, 8).map((element) => element.id));

    case 'process-chain':
      return fixedIds('step-1', 'step-2', 'step-3', 'step-4');
  }
};

export const findUnrenderedStageElements = (
  storyboard: MotionStoryboard,
): MotionElement[] => {
  const renderedIds = getRenderedStageElementIds(storyboard);
  return storyboard.elements.filter((element) => !renderedIds.has(element.id));
};
