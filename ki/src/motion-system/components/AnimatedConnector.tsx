import React from 'react';
import {useCurrentFrame} from 'remotion';
import {easedProgress} from '../../motion/easing';

export const AnimatedConnector: React.FC<{
  from: {x: number; y: number};
  to: {x: number; y: number};
  startFrame: number;
  durationFrames?: number;
  color?: string;
}> = ({from, to, startFrame, durationFrames = 24, color = '#B98CFF'}) => {
  const frame = useCurrentFrame();
  const progress = easedProgress(frame, startFrame, startFrame + durationFrames);
  const x2 = from.x + (to.x - from.x) * progress;
  const y2 = from.y + (to.y - from.y) * progress;

  return (
    <svg style={{position: 'absolute', inset: 0, overflow: 'visible'}} width="100%" height="100%">
      <defs>
        <filter id="connectorGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <line
        x1={from.x}
        y1={from.y}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={8}
        strokeLinecap="round"
        filter="url(#connectorGlow)"
      />
      {progress > 0.92 ? <circle cx={to.x} cy={to.y} r={10} fill={color} /> : null}
    </svg>
  );
};
