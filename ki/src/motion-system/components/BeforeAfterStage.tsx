import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export type BeforeAfterStageTimings = {
  beforeFrame?: number;
  transitionFrame?: number;
  afterFrame?: number;
};

export const BeforeAfterStage: React.FC<{
  beforeLabel?: string;
  afterLabel?: string;
  startFrame?: number;
  timings?: BeforeAfterStageTimings;
}> = ({beforeLabel = 'Vorher', afterLabel = 'Nachher', startFrame = 0, timings}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const beforeFrame = timings?.beforeFrame ?? startFrame;
  const transitionFrame = timings?.transitionFrame ?? startFrame + 20;
  const afterFrame = timings?.afterFrame ?? startFrame + 46;
  const transitionEndFrame = Math.max(transitionFrame + 1, afterFrame + 18);

  const before = spring({fps, frame: frame - beforeFrame, config: {damping: 18, stiffness: 170}});
  const after = spring({fps, frame: frame - afterFrame, config: {damping: 18, stiffness: 170}});
  const transform = interpolate(frame, [transitionFrame, transitionEndFrame], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const beforeDim = interpolate(frame, [transitionFrame, Math.max(transitionFrame + 1, afterFrame)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const panel = (
    label: string,
    x: number,
    progress: number,
    accent: string,
    dimProgress: number,
  ) => (
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
        opacity: progress * (1 - dimProgress * 0.42),
        transform: `translateY(${interpolate(progress, [0, 1], [34, 0])}px) scale(${interpolate(progress, [0, 1], [0.92, 1])})`,
        padding: 34,
      }}
    >
      <div style={{fontSize: 34, fontWeight: 900, color: '#1A1A2E', marginBottom: 28, overflowWrap: 'anywhere'}}>{label}</div>
      <div style={{display: 'grid', gap: 18}}>
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            style={{
              height: 74,
              borderRadius: 22,
              background: dimProgress > 0.5 ? '#F0EEF4' : item === 2 ? '#F1FFF7' : '#F7F1FF',
              border: `2px solid ${dimProgress > 0.5 ? '#DED8E7' : item === 2 ? '#6FD19C' : '#D9C7F6'}`,
              transform: `translateX(${Math.sin((frame + item * 8) * 0.06) * 4 * dimProgress}px)`,
            }}
          />
        ))}
      </div>
    </div>
  );

  return (
    <>
      {panel(beforeLabel, 100, before, '#D9D4E7', beforeDim)}
      {panel(afterLabel, 620, after, '#6FD19C', 0)}
      <svg width="1080" height="1920" style={{position: 'absolute', inset: 0}}>
        <line x1="485" y1="775" x2={485 + 130 * transform} y2="775" stroke="#B98CFF" strokeWidth="10" strokeLinecap="round" />
        {transform > 0.9 ? <circle cx="615" cy="775" r="12" fill="#B98CFF" /> : null}
      </svg>
    </>
  );
};
