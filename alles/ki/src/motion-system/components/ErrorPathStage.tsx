import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {getLabelTypography} from '../textLayout';
import {ProcessingCore} from './ProcessingCore';

export type ErrorPathStageTimings = {
  inputFrame?: number;
  aiFrame?: number;
  errorFrame?: number;
  checkFrame?: number;
  shakeFrame?: number;
};

export const ErrorPathStage: React.FC<{
  inputLabel: string;
  aiLabel?: string;
  errorLabel: string;
  checkLabel: string;
  startFrame?: number;
  timings?: ErrorPathStageTimings;
}> = ({
  inputLabel,
  aiLabel = 'KI',
  errorLabel,
  checkLabel,
  startFrame = 0,
  timings,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inputFrame = timings?.inputFrame ?? startFrame;
  const aiFrame = timings?.aiFrame ?? startFrame + 24;
  const errorFrame = timings?.errorFrame ?? startFrame + 58;
  const checkFrame = timings?.checkFrame ?? startFrame + 103;
  const shakeFrame = timings?.shakeFrame ?? errorFrame + 6;

  const inputProgress = spring({
    fps,
    frame: frame - inputFrame,
    config: {damping: 18, stiffness: 170},
  });
  const errorProgress = spring({
    fps,
    frame: frame - errorFrame,
    config: {damping: 18, stiffness: 170},
  });
  const checkProgress = spring({
    fps,
    frame: frame - checkFrame,
    config: {damping: 18, stiffness: 170},
  });
  const inputPath = interpolate(
    frame,
    [inputFrame + 10, Math.max(inputFrame + 11, aiFrame + 8)],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  const errorPath = interpolate(
    frame,
    [aiFrame + 10, Math.max(aiFrame + 11, errorFrame + 8)],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  const checkPath = interpolate(
    frame,
    [aiFrame + 10, Math.max(aiFrame + 11, checkFrame + 8)],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  const shakeAge = Math.max(0, frame - shakeFrame);
  const errorShake = frame >= shakeFrame && frame <= shakeFrame + 18
    ? Math.sin(shakeAge * 1.4) * 8 * (1 - shakeAge / 18)
    : 0;
  const pulse = 1 + Math.sin(Math.max(0, frame - errorFrame) * 0.18) * 0.035;
  const inputTypography = getLabelTypography(inputLabel, {maxFontSize: 34, minFontSize: 22});
  const errorTypography = getLabelTypography(errorLabel, {maxFontSize: 34, minFontSize: 22});
  const checkTypography = getLabelTypography(checkLabel, {maxFontSize: 34, minFontSize: 22});

  const cardBase = {
    height: 180,
    borderRadius: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    textAlign: 'center' as const,
    padding: 22,
    overflowWrap: 'anywhere' as const,
    boxSizing: 'border-box' as const,
    overflow: 'hidden' as const,
  };

  return (
    <div style={{position: 'absolute', left: 70, right: 70, top: 430, height: 790}}>
      <div
        style={{
          ...cardBase,
          position: 'absolute',
          left: 20,
          top: 220,
          width: 270,
          background: '#FFFFFF',
          border: '3px solid #D9D4E7',
          boxShadow: '0 24px 60px rgba(26,26,46,0.09)',
          fontSize: inputTypography.fontSize,
          lineHeight: inputTypography.lineHeight,
          letterSpacing: inputTypography.letterSpacing,
          color: '#1A1A2E',
          transform: `translateX(${interpolate(inputProgress, [0, 1], [-120, 0])}px)`,
          opacity: inputProgress,
        }}
      >
        {inputLabel}
      </div>

      <ProcessingCore
        x={385}
        y={215}
        size={180}
        startFrame={aiFrame}
        label={aiLabel}
      />

      <svg style={{position: 'absolute', inset: 0}} width="100%" height="100%">
        <path
          d="M290 310 C330 310 350 305 385 305"
          fill="none"
          stroke="#B98CFF"
          strokeWidth="9"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - inputPath}
        />
        <path
          d="M565 305 C610 305 620 170 660 170"
          fill="none"
          stroke="#EC6A73"
          strokeWidth="9"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - errorPath}
        />
        <path
          d="M565 305 C610 305 620 500 660 500"
          fill="none"
          stroke="#6FD19C"
          strokeWidth="9"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - checkPath}
        />
      </svg>

      <div
        style={{
          ...cardBase,
          position: 'absolute',
          right: 20,
          top: 80,
          width: 300,
          background: '#FFF2F3',
          border: '3px solid #EC6A73',
          boxShadow: '0 24px 60px rgba(236,106,115,0.16)',
          fontSize: errorTypography.fontSize,
          lineHeight: errorTypography.lineHeight,
          letterSpacing: errorTypography.letterSpacing,
          color: '#8B2530',
          transform: `translateX(${errorShake}px) scale(${pulse})`,
          opacity: errorProgress,
        }}
      >
        {errorLabel}
      </div>

      <div
        style={{
          ...cardBase,
          position: 'absolute',
          right: 20,
          top: 410,
          width: 300,
          background: '#F1FFF7',
          border: '3px solid #6FD19C',
          boxShadow: '0 24px 60px rgba(111,209,156,0.15)',
          fontSize: checkTypography.fontSize,
          lineHeight: checkTypography.lineHeight,
          letterSpacing: checkTypography.letterSpacing,
          color: '#1A5C3F',
          opacity: checkProgress,
          transform: `translateY(${interpolate(checkProgress, [0, 1], [24, 0])}px)`,
        }}
      >
        {checkLabel}
      </div>
    </div>
  );
};
