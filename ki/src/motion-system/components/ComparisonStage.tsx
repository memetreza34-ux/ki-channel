import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export type ComparisonStageTimings = {
  leftFrame?: number;
  rightFrame?: number;
  metricFrame?: number;
  resultFrame?: number;
};

export const ComparisonStage: React.FC<{
  leftLabel: string;
  rightLabel: string;
  metricLabel?: string;
  startFrame?: number;
  timings?: ComparisonStageTimings;
}> = ({leftLabel, rightLabel, metricLabel = 'Vergleich', startFrame = 0, timings}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const leftFrame = timings?.leftFrame ?? startFrame;
  const rightFrame = timings?.rightFrame ?? startFrame + 18;
  const metricFrame = timings?.metricFrame ?? startFrame + 52;
  const resultFrame = timings?.resultFrame ?? startFrame + 98;

  const leftProgress = spring({fps, frame: frame - leftFrame, config: {damping: 20, stiffness: 160}});
  const rightProgress = spring({fps, frame: frame - rightFrame, config: {damping: 20, stiffness: 160}});
  const metricProgress = spring({fps, frame: frame - metricFrame, config: {damping: 20, stiffness: 160}});
  const resultProgress = spring({fps, frame: frame - resultFrame, config: {damping: 18, stiffness: 170}});
  const leftX = interpolate(leftProgress, [0, 1], [-160, 0]);
  const rightX = interpolate(rightProgress, [0, 1], [160, 0]);
  const divider = interpolate(metricProgress, [0, 1], [0, 1]);
  const leftOpacity = interpolate(resultProgress, [0, 1], [1, 0.58]);
  const rightScale = interpolate(resultProgress, [0, 1], [1, 1.04]);

  return (
    <div style={{position: 'absolute', left: 70, right: 70, top: 430, height: 760}}>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 40,
          width: 4,
          height: 580,
          transform: `translateX(-50%) scaleY(${divider})`,
          transformOrigin: 'top',
          background: 'linear-gradient(#B98CFF, #6E45C9)',
          borderRadius: 99,
          boxShadow: '0 0 22px rgba(185,140,255,0.35)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 95,
          width: 390,
          height: 360,
          transform: `translateX(${leftX}px)`,
          borderRadius: 42,
          background: '#F8F7FB',
          border: '3px solid #DED9EA',
          boxShadow: '0 28px 70px rgba(26,26,46,0.10)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 42,
          fontWeight: 800,
          color: '#1A1A2E',
          textAlign: 'center',
          padding: 36,
          opacity: leftProgress * leftOpacity,
          overflowWrap: 'anywhere',
        }}
      >
        {leftLabel}
      </div>

      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 95,
          width: 390,
          height: 360,
          transform: `translateX(${rightX}px) scale(${rightScale})`,
          borderRadius: 42,
          background: '#F7F1FF',
          border: '3px solid #B98CFF',
          boxShadow: '0 28px 70px rgba(185,140,255,0.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 42,
          fontWeight: 800,
          color: '#1A1A2E',
          textAlign: 'center',
          padding: 36,
          opacity: rightProgress,
          overflowWrap: 'anywhere',
        }}
      >
        {rightLabel}
      </div>

      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 500,
          transform: `translateX(-50%) scale(${interpolate(metricProgress, [0, 1], [0.9, 1])})`,
          padding: '18px 30px',
          borderRadius: 999,
          background: '#1A1A2E',
          color: '#FFFFFF',
          fontWeight: 800,
          fontSize: 28,
          letterSpacing: -0.4,
          opacity: metricProgress,
        }}
      >
        {metricLabel}
      </div>
    </div>
  );
};
