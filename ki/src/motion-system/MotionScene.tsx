import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {motionStoryboardSchema, type MotionStoryboard} from './schema';
import {MotionCard} from './components/MotionCard';
import {AnimatedConnector} from './components/AnimatedConnector';
import {TokenFlow} from './components/TokenFlow';
import {ProcessingCore} from './components/ProcessingCore';
import {ComparisonStage} from './components/ComparisonStage';
import {ErrorPathStage} from './components/ErrorPathStage';
import {ContextWindowStage} from './components/ContextWindowStage';
import {ProcessChainStage} from './components/ProcessChainStage';
import {TEMPLATE_REGISTRY} from './templates/TemplateRegistry';

const latestBeat = (
  storyboard: MotionStoryboard,
  targetId: string,
  action: MotionStoryboard['beats'][number]['action'],
) =>
  storyboard.beats
    .filter((beat) => beat.targetId === targetId && beat.action === action)
    .sort((a, b) => b.atFrame - a.atFrame)[0];

const cardCenter = (pos: {x: number; y: number}) => ({x: pos.x + 130, y: pos.y + 75});

export const MotionScene: React.FC<{storyboard: MotionStoryboard}> = ({storyboard}) => {
  const parsed = motionStoryboardSchema.parse(storyboard);
  const frame = useCurrentFrame();
  const template = TEMPLATE_REGISTRY[parsed.visualType] ?? TEMPLATE_REGISTRY['input-output'];
  const positions = template.positions;
  const aiElement = parsed.elements.find((element) => element.id === 'ai');
  const aiPos = positions.ai;
  const byId = (id: string) => parsed.elements.find((element) => element.id === id);
  const usesDedicatedStage = ['comparison', 'error-path', 'context-window', 'process-chain'].includes(parsed.visualType);

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

      {parsed.visualType === 'comparison' ? (
        <ComparisonStage
          leftLabel={byId('left')?.label ?? 'Variante A'}
          rightLabel={byId('right')?.label ?? 'Variante B'}
          metricLabel={byId('metric')?.label ?? 'Vergleich'}
          startFrame={0}
        />
      ) : null}

      {parsed.visualType === 'error-path' ? (
        <ErrorPathStage
          inputLabel={byId('input')?.label ?? 'Eingabe'}
          errorLabel={byId('error')?.label ?? 'Fehler'}
          checkLabel={byId('check')?.label ?? 'Prüfen'}
          startFrame={0}
        />
      ) : null}

      {parsed.visualType === 'context-window' ? (
        <ContextWindowStage x={160} y={470} startFrame={0} />
      ) : null}

      {parsed.visualType === 'process-chain' ? (
        <ProcessChainStage x={100} y={560} startFrame={0} />
      ) : null}

      {!usesDedicatedStage ? (
        <>
          {parsed.beats
            .filter((beat) => beat.action === 'connect' && beat.sourceId)
            .map((beat) => {
              const from = positions[beat.sourceId as string];
              const to = positions[beat.targetId];
              if (!from || !to) return null;
              return (
                <React.Fragment key={beat.id}>
                  <AnimatedConnector
                    from={cardCenter(from)}
                    to={cardCenter(to)}
                    startFrame={beat.atFrame}
                    durationFrames={beat.durationFrames}
                  />
                  {parsed.visualType === 'data-flow' || parsed.visualType === 'tool-orchestration' ? (
                    <TokenFlow
                      from={cardCenter(from)}
                      to={cardCenter(to)}
                      startFrame={beat.atFrame}
                      durationFrames={Math.max(24, beat.durationFrames)}
                    />
                  ) : null}
                </React.Fragment>
              );
            })}

          {parsed.elements.map((element) => {
            const pos = positions[element.id];
            if (!pos) return null;
            const show = latestBeat(parsed, element.id, 'show');
            const dim = latestBeat(parsed, element.id, 'dim');
            const highlight = latestBeat(parsed, element.id, 'highlight');
            const shake = latestBeat(parsed, element.id, 'shake');

            if (element.id === 'ai') {
              return (
                <ProcessingCore
                  key={element.id}
                  x={pos.x + 35}
                  y={pos.y - 20}
                  startFrame={show?.atFrame ?? 0}
                  label={element.label || 'KI'}
                />
              );
            }

            return (
              <MotionCard
                key={element.id}
                element={element}
                x={pos.x}
                y={pos.y}
                appearAt={show?.atFrame ?? 0}
                dimmed={Boolean(dim && frame >= dim.atFrame)}
                highlighted={Boolean(highlight && frame >= highlight.atFrame)}
                shaking={Boolean(shake && frame >= shake.atFrame && frame <= shake.atFrame + shake.durationFrames)}
              />
            );
          })}

          {aiElement && aiPos && parsed.visualType === 'agent-loop' ? (
            <div
              style={{
                position: 'absolute',
                left: aiPos.x - 60,
                top: aiPos.y - 95,
                width: 380,
                height: 380,
                borderRadius: '50%',
                border: '4px dashed rgba(185,140,255,0.55)',
                transform: `rotate(${frame * 1.4}deg)`,
              }}
            />
          ) : null}
        </>
      ) : null}

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
