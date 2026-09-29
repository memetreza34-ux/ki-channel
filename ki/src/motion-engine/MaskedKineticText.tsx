import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export type MaskedKineticTextProps = {
  lines: readonly string[];
  startFrame?: number;
  lineStaggerFrames?: number;
  x?: number;
  y?: number;
  width?: number;
  fontSize?: number;
  lineHeight?: number;
  fontWeight?: number;
  color?: string;
  align?: 'left' | 'center' | 'right';
  travel?: number;
  letterSpacingStart?: number;
  letterSpacingEnd?: number;
  style?: React.CSSProperties;
};

export const MaskedKineticText: React.FC<MaskedKineticTextProps> = ({
  lines,
  startFrame = 0,
  lineStaggerFrames = 5,
  x = 96,
  y = 220,
  width = 880,
  fontSize = 84,
  lineHeight = 0.94,
  fontWeight = 950,
  color = '#111116',
  align = 'left',
  travel = 92,
  letterSpacingStart = -7,
  letterSpacingEnd = -3.5,
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <div
      data-motion-engine="masked-kinetic-text"
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        display: 'grid',
        gap: Math.max(2, fontSize * 0.03),
        textAlign: align,
        ...style,
      }}
    >
      {lines.map((line, index) => {
        const localStart = startFrame + index * lineStaggerFrames;
        const entrance = spring({
          frame: Math.max(0, frame - localStart),
          fps,
          config: {damping: 13, stiffness: 220, mass: 0.7},
        });
        const settle = interpolate(
          frame,
          [localStart, localStart + 16, localStart + 32],
          [0, 1.035, 1],
          {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
        );
        const translateY = (1 - Math.min(1, entrance)) * travel;
        const clipTop = interpolate(entrance, [0, 1], [100, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const letterSpacing = interpolate(
          entrance,
          [0, 1],
          [letterSpacingStart, letterSpacingEnd],
          {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
        );

        return (
          <div key={`${index}-${line}`} style={{overflow: 'hidden'}}>
            <div
              style={{
                fontSize,
                lineHeight,
                fontWeight,
                color,
                letterSpacing,
                transform: `translate3d(0, ${translateY}px, 0) scale(${settle})`,
                clipPath: `inset(${clipTop}% 0 0 0)`,
                transformOrigin: align === 'left' ? '0% 50%' : align === 'right' ? '100% 50%' : '50% 50%',
                willChange: 'transform,clip-path',
              }}
            >
              {line}
            </div>
          </div>
        );
      })}
    </div>
  );
};
