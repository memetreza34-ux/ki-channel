import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';

const steps = ['Eingabe', 'Analyse', 'Ausführung', 'Ergebnis'];

export const ProcessChainStage: React.FC<{
  x: number;
  y: number;
  startFrame?: number;
}> = ({x, y, startFrame = 0}) => {
  const frame = useCurrentFrame();

  return (
    <div style={{position: 'absolute', left: x, top: y, width: 880, height: 360}}>
      {steps.map((step, index) => {
        const appearAt = startFrame + index * 18;
        const progress = interpolate(frame, [appearAt, appearAt + 16], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const left = index * 215;
        return (
          <React.Fragment key={step}>
            {index < steps.length - 1 ? (
              <div
                style={{
                  position: 'absolute',
                  left: left + 168,
                  top: 114,
                  width: 78,
                  height: 8,
                  borderRadius: 999,
                  background: '#B98CFF',
                  transformOrigin: 'left center',
                  transform: `scaleX(${interpolate(frame, [appearAt + 10, appearAt + 28], [0, 1], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                  })})`,
                  boxShadow: '0 0 18px rgba(185,140,255,0.45)',
                }}
              />
            ) : null}
            <div
              style={{
                position: 'absolute',
                left,
                top: 48,
                width: 170,
                height: 140,
                borderRadius: 34,
                border: index === 3 ? '4px solid #6FD19C' : '4px solid #D9D4E7',
                background: index === 3 ? '#F1FFF7' : '#FFFFFF',
                boxShadow: index === 3
                  ? '0 24px 55px rgba(111,209,156,0.24)'
                  : '0 24px 55px rgba(26,26,46,0.08)',
                opacity: progress,
                transform: `translateY(${interpolate(progress, [0, 1], [26, 0])}px) scale(${interpolate(progress, [0, 1], [0.9, 1])})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1A1A2E',
                fontSize: 30,
                fontWeight: 900,
                textAlign: 'center',
                padding: 18,
              }}
            >
              {step}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};
