import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {motionStoryboardSchema, type MotionStoryboard} from './schema';
import {MotionCard} from './components/MotionCard';
import {AnimatedConnector} from './components/AnimatedConnector';
import {TEMPLATE_REGISTRY} from './templates/TemplateRegistry';

const latestBeat = (
  storyboard: MotionStoryboard,
  targetId: string,
  action: MotionStoryboard['beats'][number]['action'],
) =>
  storyboard.beats
    .filter((beat) => beat.targetId === targetId && beat.action === action)
    .sort((a, b) => b.atFrame - a.atFrame)[0];

export const MotionScene: React.FC<{storyboard: MotionStoryboard}> = ({storyboard}) => {
  const parsed = motionStoryboardSchema.parse(storyboard);
  const frame = useCurrentFrame();
  const template = TEMPLATE_REGISTRY[parsed.visualType] ?? TEMPLATE_REGISTRY['input-output'];
  const positions = template.positions;

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

      {parsed.beats
        .filter((beat) => beat.action === 'connect' && beat.sourceId)
        .map((beat) => {
          const from = positions[beat.sourceId as string];
          const to = positions[beat.targetId];
          if (!from || !to) return null;
          return (
            <AnimatedConnector
              key={beat.id}
              from={{x: from.x + 130, y: from.y + 75}}
              to={{x: to.x + 130, y: to.y + 75}}
              startFrame={beat.atFrame}
              durationFrames={beat.durationFrames}
            />
          );
        })}

      {parsed.elements.map((element) => {
        const pos = positions[element.id];
        if (!pos) return null;
        const show = latestBeat(parsed, element.id, 'show');
        const dim = latestBeat(parsed, element.id, 'dim');
        const highlight = latestBeat(parsed, element.id, 'highlight');
        const shake = latestBeat(parsed, element.id, 'shake');
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
