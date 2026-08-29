import React from 'react';
import {Arrow} from '@remotion/shapes';
import {interpolate, useCurrentFrame} from 'remotion';

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

export const StoryFlowArrow: React.FC<{
  accent: string;
  startFrame: number;
  endFrame: number;
  length?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
  style?: React.CSSProperties;
}> = ({accent, startFrame, endFrame, length = 260, direction = 'right', style}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [startFrame, endFrame], [0, 1], clamp);
  const horizontal = direction === 'left' || direction === 'right';
  const width = horizontal ? length : 126;
  const height = horizontal ? 126 : length;

  return (
    <div
      style={{
        width,
        height,
        display: 'grid',
        placeItems: 'center',
        overflow: 'hidden',
        opacity: 0.25 + progress * 0.75,
        transform: `scale(${0.92 + progress * 0.08})`,
        ...style,
      }}
    >
      <div
        style={{
          width,
          height,
          display: 'grid',
          placeItems: 'center',
          clipPath: horizontal
            ? `inset(0 ${(1 - progress) * 100}% 0 0)`
            : `inset(${(1 - progress) * 100}% 0 0 0)`,
        }}
      >
        <Arrow
          length={length}
          headWidth={100}
          headLength={78}
          shaftWidth={38}
          fill={accent}
          direction={direction}
        />
      </div>
    </div>
  );
};

export const StoryPulseArrow: React.FC<{
  accent: string;
  startFrame: number;
  endFrame: number;
  length?: number;
}> = ({accent, startFrame, endFrame, length = 240}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [startFrame, endFrame], [0, 1], clamp);
  const pulse = 1 + Math.sin(progress * Math.PI * 2) * 0.045;
  return (
    <StoryFlowArrow
      accent={accent}
      startFrame={startFrame}
      endFrame={endFrame}
      length={length}
      style={{transform: `scale(${pulse})`}}
    />
  );
};
