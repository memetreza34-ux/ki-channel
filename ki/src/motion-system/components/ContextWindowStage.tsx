import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';

export const ContextWindowStage: React.FC<{
  x: number;
  y: number;
  startFrame?: number;
}> = ({x, y, startFrame = 0}) => {
  const frame = useCurrentFrame();
  const local = Math.max(0, frame - startFrame);
  const activeOpacity = interpolate(local, [0, 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const oldOpacity = interpolate(local, [18, 70], [1, 0.18], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const oldShift = interpolate(local, [18, 70], [0, -130], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{position: 'absolute', left: x, top: y, width: 760, height: 470}}>
      <div
        style={{
          position: 'absolute',
          left: 210,
          top: 40,
          width: 340,
          height: 320,
          borderRadius: 46,
          border: '5px solid #B98CFF',
          background: 'linear-gradient(180deg,#FCF9FF,#F4ECFF)',
          boxShadow: '0 28px 70px rgba(110,69,201,0.20)',
          opacity: activeOpacity,
        }}
      >
        <div style={{padding: '28px 30px', color: '#1A1A2E', fontSize: 30, fontWeight: 900}}>Aktueller Kontext</div>
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            style={{
              margin: '18px 28px 0',
              height: 54,
              borderRadius: 18,
              background: index === 2 ? '#EBDDFF' : '#FFFFFF',
              border: '2px solid #DDD4ED',
              boxShadow: '0 8px 18px rgba(26,26,46,0.06)',
            }}
          />
        ))}
      </div>

      <div
        style={{
          position: 'absolute',
          left: 30,
          top: 120 + oldShift,
          width: 230,
          height: 150,
          borderRadius: 30,
          border: '3px solid #D9D4E7',
          background: '#FFFFFF',
          boxShadow: '0 18px 40px rgba(26,26,46,0.08)',
          opacity: oldOpacity,
          transform: `rotate(${interpolate(local, [18, 70], [0, -8], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}deg)`,
        }}
      >
        <div style={{padding: 24, fontSize: 28, fontWeight: 850, color: '#6F6B7B'}}>Alte Information</div>
      </div>

      <div
        style={{
          position: 'absolute',
          right: 16,
          top: 150,
          width: 200,
          height: 96,
          borderRadius: 28,
          border: '3px solid #B98CFF',
          background: '#F7F1FF',
          color: '#1A1A2E',
          fontSize: 28,
          fontWeight: 900,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: activeOpacity,
        }}
      >
        Neue Nachricht
      </div>
    </div>
  );
};
