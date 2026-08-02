import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';

export const ProcessingCore: React.FC<{
  x: number;
  y: number;
  startFrame: number;
  size?: number;
  label?: string;
  color?: string;
}> = ({x, y, startFrame, size = 190, label = 'KI', color = '#B98CFF'}) => {
  const frame = useCurrentFrame();
  const local = Math.max(0, frame - startFrame);
  const pulse = interpolate(Math.sin(local / 6), [-1, 1], [0.96, 1.05]);
  const ring = interpolate((local % 36) / 36, [0, 1], [0.55, 1.35]);
  const ringOpacity = interpolate((local % 36) / 36, [0, 1], [0.5, 0]);

  return (
    <div style={{position: 'absolute', left: x, top: y, width: size, height: size}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 48,
          border: `6px solid ${color}`,
          transform: `scale(${ring})`,
          opacity: ringOpacity,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 48,
          background: 'linear-gradient(145deg, #F8F2FF 0%, #E8D7FF 100%)',
          border: `5px solid ${color}`,
          boxShadow: '0 26px 70px rgba(110,69,201,0.28)',
          transform: `scale(${pulse})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#1A1A2E',
          fontSize: 44,
          fontWeight: 900,
          letterSpacing: -1,
        }}
      >
        {label}
      </div>
    </div>
  );
};
