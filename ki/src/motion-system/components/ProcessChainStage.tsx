import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';

export const ProcessChainStage: React.FC<{
  x: number;
  y: number;
  steps?: string[];
  stepFrames?: number[];
  startFrame?: number;
}> = ({
  x,
  y,
  steps = ['Eingabe', 'Analyse', 'Ausführung', 'Ergebnis'],
  stepFrames = [],
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const normalizedSteps = steps.slice(0, 4);
  const gap = normalizedSteps.length > 1 ? 860 / (normalizedSteps.length - 1) : 0;

  return (
    <div style={{position: 'absolute', left: x, top: y, width: 880, height: 360}}>
      {normalizedSteps.map((step, index) => {
        const appearAt = stepFrames[index] ?? startFrame + index * 18;
        const nextAppearAt = stepFrames[index + 1] ?? startFrame + (index + 1) * 18;
        const progress = interpolate(frame, [appearAt, appearAt + 16], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const left = index * gap;
        const isLast = index === normalizedSteps.length - 1;
        const connectorWidth = Math.max(0, gap - 170);
        const connectorEnd = Math.max(appearAt + 11, nextAppearAt + 6);
        return (
          <React.Fragment key={`${step}-${index}`}>
            {!isLast ? (
              <div
                style={{
                  position: 'absolute',
                  left: left + 168,
                  top: 114,
                  width: connectorWidth,
                  height: 8,
                  borderRadius: 999,
                  background: '#B98CFF',
                  transformOrigin: 'left center',
                  transform: `scaleX(${interpolate(frame, [appearAt + 10, connectorEnd], [0, 1], {
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
                minHeight: 140,
                borderRadius: 34,
                border: isLast ? '4px solid #6FD19C' : '4px solid #D9D4E7',
                background: isLast ? '#F1FFF7' : '#FFFFFF',
                boxShadow: isLast
                  ? '0 24px 55px rgba(111,209,156,0.24)'
                  : '0 24px 55px rgba(26,26,46,0.08)',
                opacity: progress,
                transform: `translateY(${interpolate(progress, [0, 1], [26, 0])}px) scale(${interpolate(progress, [0, 1], [0.9, 1])})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1A1A2E',
                fontSize: step.length > 14 ? 25 : 30,
                fontWeight: 900,
                textAlign: 'center',
                lineHeight: 1.15,
                padding: 18,
                boxSizing: 'border-box',
                overflowWrap: 'anywhere',
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
