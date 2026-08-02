import React from 'react';
import {AbsoluteFill} from 'remotion';
import {motionStoryboardSchema, type MotionStoryboard, type MotionVisualType} from './schema';
import {ComparisonStage} from './components/ComparisonStage';
import {ErrorPathStage} from './components/ErrorPathStage';
import {ContextWindowStage} from './components/ContextWindowStage';
import {ProcessChainStage} from './components/ProcessChainStage';
import {RankingStage} from './components/RankingStage';
import {InputOutputStage} from './components/InputOutputStage';
import {BeforeAfterStage} from './components/BeforeAfterStage';
import {DataFlowStage} from './components/DataFlowStage';
import {ToolOrchestrationStage} from './components/ToolOrchestrationStage';
import {AgentLoopStage} from './components/AgentLoopStage';
import {TEMPLATE_REGISTRY} from './templates/TemplateRegistry';

const assertNever = (visualType: never): never => {
  throw new Error(`Nicht unterstützter Visualtyp: ${String(visualType)}`);
};

const getElementLabel = (storyboard: MotionStoryboard, id: string, fallback: string): string =>
  storyboard.elements.find((element) => element.id === id)?.label ?? fallback;

const getElementLabels = (storyboard: MotionStoryboard, ids: string[]): string[] =>
  ids
    .map((id) => storyboard.elements.find((element) => element.id === id)?.label)
    .filter((label): label is string => Boolean(label));

const renderStage = (storyboard: MotionStoryboard): React.ReactNode => {
  const visualType: MotionVisualType = storyboard.visualType;

  switch (visualType) {
    case 'input-output':
      return (
        <InputOutputStage
          inputLabel={getElementLabel(storyboard, 'input', 'Eingabe')}
          outputLabel={getElementLabel(storyboard, 'output', 'Ergebnis')}
          startFrame={0}
        />
      );

    case 'before-after':
      return (
        <BeforeAfterStage
          beforeLabel={getElementLabel(storyboard, 'input', 'Vorher')}
          afterLabel={getElementLabel(storyboard, 'output', 'Nachher')}
          startFrame={0}
        />
      );

    case 'comparison':
      return (
        <ComparisonStage
          leftLabel={getElementLabel(storyboard, 'left', 'Variante A')}
          rightLabel={getElementLabel(storyboard, 'right', 'Variante B')}
          metricLabel={getElementLabel(storyboard, 'metric', 'Vergleich')}
          startFrame={0}
        />
      );

    case 'error-path':
      return (
        <ErrorPathStage
          inputLabel={getElementLabel(storyboard, 'input', 'Eingabe')}
          errorLabel={getElementLabel(storyboard, 'error', 'Fehler')}
          checkLabel={getElementLabel(storyboard, 'check', 'Prüfen')}
          startFrame={0}
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
          startFrame={0}
        />
      );

    case 'process-chain':
      return (
        <ProcessChainStage
          x={100}
          y={560}
          steps={getElementLabels(storyboard, ['step-1', 'step-2', 'step-3', 'step-4'])}
          startFrame={0}
        />
      );

    case 'ranking':
      return (
        <RankingStage
          startFrame={0}
          items={storyboard.elements.map((element, index) => ({
            label: element.label,
            value: Math.max(1, storyboard.elements.length - index),
          }))}
        />
      );

    case 'data-flow':
      return (
        <DataFlowStage
          inputLabel={getElementLabel(storyboard, 'input', 'Datenquelle')}
          outputLabel={getElementLabel(storyboard, 'output', 'Ergebnis')}
          startFrame={0}
        />
      );

    case 'tool-orchestration':
      return (
        <ToolOrchestrationStage
          taskLabel={getElementLabel(storyboard, 'task', 'Aufgabe')}
          resultLabel={getElementLabel(storyboard, 'result', 'Ergebnis')}
          toolLabels={storyboard.elements
            .filter((element) => element.kind === 'tool')
            .map((element) => element.label)}
          startFrame={0}
        />
      );

    case 'agent-loop':
      return (
        <AgentLoopStage
          agentLabel={getElementLabel(storyboard, 'ai', 'KI-Agent')}
          stepLabels={getElementLabels(storyboard, ['plan', 'act', 'check'])}
          resultLabel="Selbstständig weiter"
          startFrame={0}
        />
      );

    default:
      return assertNever(visualType);
  }
};

export const MotionScene: React.FC<{storyboard: MotionStoryboard}> = ({storyboard}) => {
  const parsed = motionStoryboardSchema.parse(storyboard);
  const template = TEMPLATE_REGISTRY[parsed.visualType];

  return (
    <AbsoluteFill style={{background: '#FFFFFF', overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 96,
          textAlign: 'center',
          fontSize: 38,
          fontWeight: 800,
          color: '#1A1A2E',
          letterSpacing: -0.8,
        }}
      >
        {template.title}
      </div>

      {renderStage(parsed)}

      <div
        style={{
          position: 'absolute',
          left: 70,
          right: 70,
          bottom: 195,
          minHeight: 120,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          fontSize: 34,
          lineHeight: 1.25,
          color: '#1A1A2E',
          fontWeight: 700,
          textShadow: '0 2px 10px rgba(255,255,255,0.95)',
        }}
      >
        {parsed.sentence}
      </div>
    </AbsoluteFill>
  );
};
