import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {easedProgress} from '../../motion/easing';
import {getLabelTypography} from '../textLayout';

export type ContextWindowStageTimings = {
  oldFrame?: number;
  currentFrame?: number;
  dimOldFrame?: number;
  newFrame?: number;
};

export const ContextWindowStage: React.FC<{
  x: number;
  y: number;
  oldLabel?: string;
  currentLabel?: string;
  newLabel?: string;
  startFrame?: number;
  timings?: ContextWindowStageTimings;
}> = ({
  x,
  y,
  oldLabel = 'Alte Information',
  currentLabel = 'Aktueller Kontext',
  newLabel = 'Neue Nachricht',
  startFrame = 0,
  timings,
}) => {
  const frame = useCurrentFrame();
  const oldFrame = timings?.oldFrame ?? startFrame;
  const currentFrame = timings?.currentFrame ?? startFrame + 18;
  const dimOldFrame = timings?.dimOldFrame ?? startFrame + 52;
  const newFrame = timings?.newFrame ?? startFrame + 74;

  const oldEntry = easedProgress(frame, oldFrame, oldFrame + 18);
  const activeOpacity = easedProgress(frame, currentFrame, currentFrame + 18);
  const oldDim = easedProgress(frame, dimOldFrame, dimOldFrame + 22);
  const oldOpacity = oldEntry * interpolate(oldDim, [0, 1], [1, 0.18]);
  const oldShift = interpolate(oldDim, [0, 1], [0, -130]);
  const newOpacity = easedProgress(frame, newFrame, newFrame + 18);
  const currentTypography = getLabelTypography(currentLabel, {maxFontSize: 30, minFontSize: 22});
  const oldTypography = getLabelTypography(oldLabel, {maxFontSize: 28, minFontSize: 20});
  const newTypography = getLabelTypography(newLabel, {maxFontSize: 28, minFontSize: 20});

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
          transform: `translateY(${interpolate(activeOpacity, [0, 1], [24, 0])}px)`,
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            minHeight: 88,
            padding: '24px 30px 14px',
            color: '#1A1A2E',
            fontSize: currentTypography.fontSize,
            lineHeight: currentTypography.lineHeight,
            letterSpacing: currentTypography.letterSpacing,
            fontWeight: 900,
            overflowWrap: 'anywhere',
            boxSizing: 'border-box',
          }}
        >
          {currentLabel}
        </div>
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            style={{
              margin: '13px 28px 0',
              height: 54,
              borderRadius: 18,
              background: index === 2 ? '#EBDDFF' : '#FFFFFF',
              border: '2px solid #DDD4ED',
              boxShadow: '0 8px 18px rgba(26,26,46,0.06)',
              boxSizing: 'border-box',
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
          transform: `rotate(${interpolate(oldDim, [0, 1], [0, -8])}deg)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            fontSize: oldTypography.fontSize,
            lineHeight: oldTypography.lineHeight,
            letterSpacing: oldTypography.letterSpacing,
            fontWeight: 850,
            color: '#6F6B7B',
            textAlign: 'center',
            overflowWrap: 'anywhere',
          }}
        >
          {oldLabel}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          right: 16,
          top: 150,
          width: 200,
          minHeight: 96,
          padding: '12px 16px',
          borderRadius: 28,
          border: '3px solid #B98CFF',
          background: '#F7F1FF',
          color: '#1A1A2E',
          fontSize: newTypography.fontSize,
          lineHeight: newTypography.lineHeight,
          letterSpacing: newTypography.letterSpacing,
          fontWeight: 900,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          opacity: newOpacity,
          transform: `translateX(${interpolate(newOpacity, [0, 1], [24, 0])}px)`,
          overflowWrap: 'anywhere',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        {newLabel}
      </div>
    </div>
  );
};
