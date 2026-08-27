import React from 'react';
import {Img, interpolate, staticFile, useCurrentFrame} from 'remotion';

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

type ReelExternalVisualProps = {
  staticSrc: string;
  startFrame?: number;
  endFrame: number;
  fromScale?: number;
  toScale?: number;
  fromX?: number;
  toX?: number;
  fromY?: number;
  toY?: number;
  focalX?: number;
  focalY?: number;
  borderRadius?: number;
  credit?: string;
  style?: React.CSSProperties;
};

export const ReelExternalVisual: React.FC<ReelExternalVisualProps> = ({
  staticSrc,
  startFrame = 0,
  endFrame,
  fromScale = 1.03,
  toScale = 1.10,
  fromX = 0,
  toX = 0,
  fromY = 0,
  toY = -10,
  focalX = 50,
  focalY = 50,
  borderRadius = 32,
  credit,
  style,
}) => {
  const frame = useCurrentFrame();
  if (/^https?:\/\//i.test(staticSrc)) {
    throw new Error('ReelExternalVisual accepts local staticFile paths only. Resolve external assets before render.');
  }
  const scale = interpolate(frame, [startFrame, endFrame], [fromScale, toScale], clamp);
  const x = interpolate(frame, [startFrame, endFrame], [fromX, toX], clamp);
  const y = interpolate(frame, [startFrame, endFrame], [fromY, toY], clamp);
  const enter = interpolate(frame, [startFrame, startFrame + 8], [0, 1], clamp);

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius,
        background: '#E9EEF5',
        boxShadow: '0 26px 80px rgba(16,32,51,.14)',
        opacity: enter,
        ...style,
      }}
    >
      <Img
        src={staticFile(staticSrc)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: `${focalX}% ${focalY}%`,
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`,
          transformOrigin: `${focalX}% ${focalY}%`,
          willChange: 'transform',
        }}
      />
      {credit ? (
        <div
          style={{
            position: 'absolute',
            left: 16,
            right: 16,
            bottom: 14,
            padding: '8px 11px',
            borderRadius: 14,
            background: 'rgba(8,16,28,.68)',
            color: 'rgba(255,255,255,.92)',
            fontSize: 15,
            lineHeight: 1.2,
            fontWeight: 650,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {credit}
        </div>
      ) : null}
    </div>
  );
};
