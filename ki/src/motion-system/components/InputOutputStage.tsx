import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ProcessingCore} from './ProcessingCore';

export const InputOutputStage: React.FC<{
  inputLabel?: string;
  outputLabel?: string;
  startFrame?: number;
}> = ({inputLabel = 'Eingabe', outputLabel = 'Ergebnis', startFrame = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const input = spring({fps, frame: frame - startFrame, config: {damping: 18, stiffness: 170}});
  const output = spring({fps, frame: frame - (startFrame + 52), config: {damping: 18, stiffness: 170}});
  const flow = interpolate(frame, [startFrame + 18, startFrame + 86], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const card = (label: string, x: number, y: number, progress: number, accent: string) => (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 250,
        height: 150,
        borderRadius: 34,
        background: '#FFFFFF',
        border: `4px solid ${accent}`,
        boxShadow: '0 24px 60px rgba(26,26,46,0.10)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 34,
        fontWeight: 900,
        color: '#1A1A2E',
        opacity: progress,
        transform: `translateY(${interpolate(progress, [0, 1], [28, 0])}px) scale(${interpolate(progress, [0, 1], [0.9, 1])})`,
      }}
    >
      {label}
    </div>
  );

  return (
    <>
      {card(inputLabel, 70, 650, input, '#D9D4E7')}
      <ProcessingCore x={445} y={605} startFrame={startFrame + 18} label="KI" />
      {card(outputLabel, 760, 650, output, '#6FD19C')}

      <svg width="1080" height="1920" style={{position: 'absolute', inset: 0}}>
        <line x1="320" y1="725" x2={320 + 200 * Math.min(flow * 2, 1)} y2="725" stroke="#B98CFF" strokeWidth="10" strokeLinecap="round" />
        <line x1="660" y1="725" x2={660 + 100 * Math.max(0, flow * 2 - 1)} y2="725" stroke="#6FD19C" strokeWidth="10" strokeLinecap="round" />
      </svg>
    </>
  );
};
