import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';

type Point = {x: number; y: number};

export const TokenFlow: React.FC<{
  from: Point;
  to: Point;
  startFrame: number;
  durationFrames?: number;
  count?: number;
  color?: string;
}> = ({from, to, startFrame, durationFrames = 42, count = 5, color = '#B98CFF'}) => {
  const frame = useCurrentFrame();

  return (
    <svg style={{position: 'absolute', inset: 0, overflow: 'visible'}} width="100%" height="100%">
      {Array.from({length: count}).map((_, index) => {
        const stagger = index * 5;
        const progress = interpolate(
          frame,
          [startFrame + stagger, startFrame + stagger + durationFrames],
          [0, 1],
          {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
        );
        const x = from.x + (to.x - from.x) * progress;
        const y = from.y + (to.y - from.y) * progress;
        const opacity = progress <= 0 || progress >= 1 ? 0 : 1;
        return <circle key={index} cx={x} cy={y} r={8 - index * 0.7} fill={color} opacity={opacity} />;
      })}
    </svg>
  );
};
