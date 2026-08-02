import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const BeforeAfterStage: React.FC<{
  beforeLabel?: string;
  afterLabel?: string;
  startFrame?: number;
}> = ({beforeLabel = 'Vorher', afterLabel = 'Nachher', startFrame = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const before = spring({fps, frame: frame - startFrame, config: {damping: 18, stiffness: 170}});
  const after = spring({fps, frame: frame - (startFrame + 46), config: {damping: 18, stiffness: 170}});
  const transform = interpolate(frame, [startFrame + 20, startFrame + 82], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const panel = (label: string, x: number, progress: number, accent: string, dimmed: boolean) => (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: 560,
        width: 360,
        height: 430,
        borderRadius: 42,
        background: '#FFFFFF',
        border: `4px solid ${accent}`,
        boxShadow: '0 28px 70px rgba(26,26,46,0.11)',
        opacity: progress * (dimmed ? 0.58 : 1),
        transform: `translateY(${interpolate(progress, [0, 1], [34, 0])}px) scale(${interpolate(progress, [0, 1], [0.92, 1])})`,
        padding: 34,
      }}
    >
      <div style={{fontSize: 34, fontWeight: 900, color: '#1A1A2E', marginBottom: 28}}>{label}</div>
      <div style={{display: 'grid', gap: 18}}>
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            style={{
              height: 74,
              borderRadius: 22,
              background: dimmed ? '#F0EEF4' : item === 2 ? '#F1FFF7' : '#F7F1FF',
              border: `2px solid ${dimmed ? '#DED8E7' : item === 2 ? '#6FD19C' : '#D9C7F6'}`,
              transform: `translateX(${dimmed ? Math.sin((frame + item * 8) * 0.06) * 4 : 0}px)`,
            }}
          />
        ))}
      </div>
    </div>
  );

  return (
    <>
      {panel(beforeLabel, 100, before, '#D9D4E7', true)}
      {panel(afterLabel, 620, after, '#6FD19C', false)}
      <svg width="1080" height="1920" style={{position: 'absolute', inset: 0}}>
        <line x1="485" y1="775" x2={485 + 130 * transform} y2="775" stroke="#B98CFF" strokeWidth="10" strokeLinecap="round" />
        {transform > 0.9 ? <circle cx="615" cy="775" r="12" fill="#B98CFF" /> : null}
      </svg>
    </>
  );
};
