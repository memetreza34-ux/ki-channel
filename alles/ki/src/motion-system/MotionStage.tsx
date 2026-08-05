import React from 'react';
import {resolveBeatFrame} from './beatTiming';
import type {MotionStoryboard, MotionVisualType} from './schema';
import {AgentLoopStage} from './components/AgentLoopStage';
import {BeforeAfterStage} from './components/BeforeAfterStage';
import {ComparisonStage} from './components/ComparisonStage';
import {ContextWindowStage} from './components/ContextWindowStage';
import {DataFlowStage} from './components/DataFlowStage';
import {ErrorPathStage} from './components/ErrorPathStage';
import {InputOutputStage} from './components/InputOutputStage';
import {ProcessChainStage} from './components/ProcessChainStage';
import {RankingStage} from './components/RankingStage';
import {ToolOrchestrationStage} from './components/ToolOrchestrationStage';

const assertNever = (visualType: never): never => {
  throw new Error(`Nicht unterstützter Visualtyp: ${String(visualType)}`);
};

const getElementLabel = (
  storyboard: MotionStoryboard,
  id: string,
  fallback: string,
): string => storyboard.elements.find((element) => element.id === id)?.label ?? fallback;

const getElementLabels = (storyboard: MotionStoryboard, ids: string[]): string[] =>
  ids
    .map((id) => storyboard.elements.find((element) => element.id === id)?.label)
    .filter((label): label is string => Boolean(label));

export const MotionStage: React.FC<{storyboard: MotionStoryboard}> = ({storyboard}) => {
  const visualType: MotionVisualType = storyboard.visualType;

  switch (visualType) {
    case 'input-output':
      return (
        <InputOutputStage
          inputLabel={getElementLabel(storyboard, 'input', 'Eingabe')}
          outputLabel={getElementLabel(storyboard, 'output', 'Ergebnis')}
          timings={{
            inputFrame: resolveBeatFrame(storyboard, {targetId: 'input', action: 'show'}, 0),
            coreFrame: resolveBeatFrame(storyboard, {targetId: 'ai', action: 'show'}, 34),
            flowFrame: resolveBeatFrame(
              storyboard,
              {sourceId: 'input', targetId: 'ai', action: 'connect'},
              62,
            ),
            outputFrame: resolveBeatFrame(storyboard, {targetId: 'output', action: 'show'}, 98),
          }}
        />
      );

    case 'before-after':
      return (
        <BeforeAfterStage
          beforeLabel={getElementLabel(storyboard, 'input', 'Vorher')}
          afterLabel={getElementLabel(storyboard, 'output', 'Nachher')}
          timings={{
            beforeFrame: resolveBeatFrame(storyboard, {targetId: 'input', action: 'show'}, 0),
            transitionFrame: resolveBeatFrame(storyboard, {targetId: 'input', action: 'dim'}, 42),
            afterFrame: resolveBeatFrame(storyboard, {targetId: 'output', action: 'show'}, 62),
          }}
        />
      );

    case 'comparison':
      return (
        <ComparisonStage
          leftLabel={getElementLabel(storyboard, 'left', 'Variante A')}
          rightLabel={getElementLabel(storyboard, 'right', 'Variante B')}
          metricLabel={getElementLabel(storyboard, 'metric', 'Vergleich')}
          timings={{
            leftFrame: resolveBeatFrame(storyboard, {targetId: 'left', action: 'show'}, 0),
            rightFrame: resolveBeatFrame(storyboard, {targetId: 'right', action: 'show'}, 18),
            metricFrame: resolveBeatFrame(storyboard, {targetId: 'metric', action: 'show'}, 52),
            resultFrame: resolveBeatFrame(storyboard, {targetId: 'right', action: 'highlight'}, 98),
          }}
        />
      );

    case 'error-path':
      return (
        <ErrorPathStage
          inputLabel={getElementLabel(storyboard, 'input', 'Eingabe')}
          aiLabel={getElementLabel(storyboard, 'ai', 'KI')}
          errorLabel={getElementLabel(storyboard, 'error', 'Fehler')}
          checkLabel={getElementLabel(storyboard, 'check', 'Prüfen')}
          timings={{
            inputFrame: resolveBeatFrame(storyboard, {targetId: 'input', action: 'show'}, 0),
            aiFrame: resolveBeatFrame(storyboard, {targetId: 'ai', action: 'show'}, 24),
            errorFrame: resolveBeatFrame(storyboard, {targetId: 'error', action: 'show'}, 58),
            checkFrame: resolveBeatFrame(storyboard, {targetId: 'check', action: 'show'}, 103),
            shakeFrame: resolveBeatFrame(storyboard, {targetId: 'error', action: 'shake'}, 64),
          }}
        />
      );

    case 'context-window':
      return (
        <ContextWindowStage
          x={160}
          y={470}
          oldLabel={getElementLabel(storyboard, 'old', 'Alter Kontext')}
          currentLabel={getElementLabel(storyboard, 'current', 'Aktueller Kontext')}
          newLabel={getElementLabel(storyboard, 'new', 'Neue Information')}
          timings={{
            oldFrame: resolveBeatFrame(storyboard, {targetId: 'old', action: 'show'}, 0),
            currentFrame: resolveBeatFrame(storyboard, {targetId: 'current', action: 'show'}, 18),
            dimOldFrame: resolveBeatFrame(storyboard, {targetId: 'old', action: 'dim'}, 52),
            newFrame: resolveBeatFrame(storyboard, {targetId: 'new', action: 'show'}, 74),
          }}
        />
      );

    case 'process-chain': {
      const stepIds = ['step-1', 'step-2', 'step-3', 'step-4'];
      return (
        <ProcessChainStage
          x={100}
          y={560}
          steps={getElementLabels(storyboard, stepIds)}
          stepFrames={stepIds.map((targetId, index) =>
            resolveBeatFrame(storyboard, {targetId, action: 'show'}, index * 28),
          )}
        />
      );
    }

    case 'ranking':
      return (
        <RankingStage
          items={storyboard.elements.map((element, index) => ({
            label: element.label,
            value: Math.max(1, storyboard.elements.length - index),
            atFrame: resolveBeatFrame(
              storyboard,
              {targetId: element.id, action: 'show'},
              index * 12,
            ),
          }))}
          highlightFrame={resolveBeatFrame(
            storyboard,
            {targetId: 'rank-1', action: 'highlight'},
            80,
          )}
        />
      );

    case 'data-flow':
      return (
        <DataFlowStage
          inputLabel={getElementLabel(storyboard, 'input', 'Datenquelle')}
          outputLabel={getElementLabel(storyboard, 'output', 'Ergebnis')}
          timings={{
            inputFrame: resolveBeatFrame(storyboard, {targetId: 'input', action: 'show'}, 0),
            coreFrame: resolveBeatFrame(storyboard, {targetId: 'ai', action: 'show'}, 20),
            inputFlowFrame: resolveBeatFrame(
              storyboard,
              {sourceId: 'input', targetId: 'ai', action: 'connect'},
              38,
            ),
            outputFlowFrame: resolveBeatFrame(
              storyboard,
              {sourceId: 'ai', targetId: 'output', action: 'connect'},
              72,
            ),
            outputFrame: resolveBeatFrame(storyboard, {targetId: 'output', action: 'show'}, 104),
          }}
        />
      );

    case 'tool-orchestration': {
      const toolElements = storyboard.elements
        .filter((element) => element.kind === 'tool')
        .slice(0, 3);
      return (
        <ToolOrchestrationStage
          taskLabel={getElementLabel(storyboard, 'task', 'Aufgabe')}
          resultLabel={getElementLabel(storyboard, 'result', 'Ergebnis')}
          toolLabels={toolElements.map((element) => element.label)}
          timings={{
            taskFrame: resolveBeatFrame(storyboard, {targetId: 'task', action: 'show'}, 0),
            coreFrame: resolveBeatFrame(storyboard, {targetId: 'ai', action: 'show'}, 22),
            toolFrames: toolElements.map((element, index) =>
              resolveBeatFrame(
                storyboard,
                {targetId: element.id, action: 'show'},
                45 + index * 13,
              ),
            ),
            connectionFrames: toolElements.map((element, index) =>
              resolveBeatFrame(
                storyboard,
                {sourceId: 'ai', targetId: element.id, action: 'connect'},
                76 + index * 6,
              ),
            ),
            resultFrame: resolveBeatFrame(storyboard, {targetId: 'result', action: 'show'}, 112),
          }}
        />
      );
    }

    case 'agent-loop': {
      const stepIds = ['plan', 'act', 'check'];
      return (
        <AgentLoopStage
          agentLabel={getElementLabel(storyboard, 'ai', 'KI-Agent')}
          stepLabels={getElementLabels(storyboard, stepIds)}
          resultLabel="Selbstständig weiter"
          timings={{
            agentFrame: resolveBeatFrame(storyboard, {targetId: 'ai', action: 'show'}, 0),
            stepFrames: stepIds.map((targetId, index) =>
              resolveBeatFrame(storyboard, {targetId, action: 'show'}, 24 + index * 26),
            ),
            resultFrame: resolveBeatFrame(storyboard, {targetId: 'ai', action: 'pulse'}, 104),
          }}
        />
      );
    }

    default:
      return assertNever(visualType);
  }
};
