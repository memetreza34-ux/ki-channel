import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ProcessingCore} from './ProcessingCore';

type FlowNode = {
  label: string;
  x: number;
  y: number;
  accent?: string;
};

const FlowNodeCard: React.FC<FlowNode & {progress: number}> = ({label, x, y, accent = '#D9D4E7', progress}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: 230,
      height: 138,
      borderRadius: 32,
      border: `4px solid ${accent}`,
      background: '#FFFFFF',
      boxShadow: '0 24px 56px rgba(26,26,46,0.10)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 31,
      fontWeight: 900,
      color: '#1A1A2E',
      opacity: progress,
      transform: `translateY(${interpolate(progress, [0, 1], [24, 0])}px) scale(${interpolate(progress, [0, 1], [0.92, 1])})`,
    }}
  >
    {label}
  </div>
);

export const DataFlowStage: React.FC<{
  inputLabel?: string;
  outputLabel?: string;
  startFrame?: number;
}> = ({inputLabel = 'Datenquelle', outputLabel = 'Ergebnis', startFrame = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const input = spring({fps, frame: frame - startFrame, config: {damping: 18, stiffness: 175}});
  const output = spring({fps, frame: frame - (startFrame + 62), config: {damping: 18, stiffness: 175}});
  const flow = interpolate(frame, [startFrame + 18, startFrame + 100], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const start = {x: 300, y: 740};
  const mid = {x: 540, y: 720};
  const end = {x: 775, y: 740};
  const tokenCount = 6;

  return (
    <>
      <FlowNodeCard label={inputLabel} x={70} y={670} accent="#D9D4E7" progress={input} />
      <ProcessingCore x={420} y={600} startFrame={startFrame + 18} label="KI" />
      <FlowNodeCard label={outputLabel} x={780} y={670} accent="#6FD19C" progress={output} />

      <svg width="1080" height="1920" style={{position: 'absolute', inset: 0}}>
        <path d="M300 740 C390 650 450 650 540 720" fill="none" stroke="#E6D9F8" strokeWidth="10" strokeLinecap="round" />
        <path d="M540 720 C625 650 690 650 775 740" fill="none" stroke="#DCEFE4" strokeWidth="10" strokeLinecap="round" />
      </svg>

      {Array.from({length: tokenCount}).map((_, index) => {
        const offset = index / tokenCount;
        const local = (flow + offset) % 1;
        const leftHalf = local < 0.5;
        const t = leftHalf ? local * 2 : (local - 0.5) * 2;
        const x = leftHalf ? start.x + (mid.x - start.x) * t : mid.x + (end.x - mid.x) * t;
        const baseY = leftHalf ? start.y + (mid.y - start.y) * t : mid.y + (end.y - mid.y) * t;
        const y = baseY - Math.sin(t * Math.PI) * 70;
        const visible = flow > 0.02 ? 1 : 0;
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: x - 12,
              top: y - 12,
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: leftHalf ? '#B98CFF' : '#6FD19C',
              boxShadow: leftHalf ? '0 0 22px rgba(185,140,255,0.72)' : '0 0 22px rgba(111,209,156,0.62)',
              opacity: visible,
            }}
          />
        );
      })}
    </>
  );
};
