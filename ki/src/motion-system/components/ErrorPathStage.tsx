import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export type ErrorPathStageTimings = {
  inputFrame?: number;
  errorFrame?: number;
  checkFrame?: number;
  shakeFrame?: number;
};

export const ErrorPathStage: React.FC<{
  inputLabel: string;
  errorLabel: string;
  checkLabel: string;
  startFrame?: number;
  timings?: ErrorPathStageTimings;
}> = ({inputLabel, errorLabel, checkLabel, startFrame = 0, timings}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inputFrame = timings?.inputFrame ?? startFrame;
  const errorFrame = timings?.errorFrame ?? startFrame + 58;
  const checkFrame = timings?.checkFrame ?? startFrame + 103;
  const shakeFrame = timings?.shakeFrame ?? errorFrame + 6;

  const inputProgress = spring({fps, frame: frame - inputFrame, config: {damping: 18, stiffness: 170}});
  const errorProgress = spring({fps, frame: frame - errorFrame, config: {damping: 18, stiffness: 170}});
  const checkProgress = spring({fps, frame: frame - checkFrame, config: {damping: 18, stiffness: 170}});
  const errorPath = interpolate(frame, [inputFrame + 12, Math.max(inputFrame + 13, errorFrame + 8)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const checkPath = interpolate(frame, [inputFrame + 12, Math.max(inputFrame + 13, checkFrame + 8)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const shakeAge = Math.max(0, frame - shakeFrame);
  const errorShake = frame >= shakeFrame && frame <= shakeFrame + 18
    ? Math.sin(shakeAge * 1.4) * 8 * (1 - shakeAge / 18)
    : 0;
  const pulse = 1 + Math.sin(Math.max(0, frame - errorFrame) * 0.18) * 0.035;

  return (
    <div style={{position: 'absolute', left: 70, right: 70, top: 430, height: 790}}>
      <div
        style={{
          position: 'absolute',
          left: 30,
          top: 220,
          width: 300,
          height: 180,
          borderRadius: 36,
          background: '#FFFFFF',
          border: '3px solid #D9D4E7',
          boxShadow: '0 24px 60px rgba(26,26,46,0.09)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 36,
          fontWeight: 800,
          color: '#1A1A2E',
          transform: `translateX(${interpolate(inputProgress, [0, 1], [-120, 0])}px)`,
          textAlign: 'center',
          padding: 24,
          opacity: inputProgress,
          overflowWrap: 'anywhere',
        }}
      >
        {inputLabel}
      </div>

      <svg style={{position: 'absolute', inset: 0}} width="100%" height="100%">
        <path
          d="M330 310 C470 310 520 170 660 170"
          fill="none"
          stroke="#EC6A73"
          strokeWidth="9"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - errorPath}
        />
        <path
          d="M330 310 C470 310 520 500 660 500"
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
          position: 'absolute',
          right: 20,
          top: 80,
          width: 300,
          height: 180,
          borderRadius: 36,
          background: '#FFF2F3',
          border: '3px solid #EC6A73',
          boxShadow: '0 24px 60px rgba(236,106,115,0.16)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 36,
          fontWeight: 800,
          color: '#8B2530',
          textAlign: 'center',
          padding: 24,
          transform: `translateX(${errorShake}px) scale(${pulse})`,
          opacity: errorProgress,
          overflowWrap: 'anywhere',
        }}
      >
        {errorLabel}
      </div>

      <div
        style={{
          position: 'absolute',
          right: 20,
          top: 410,
          width: 300,
          height: 180,
          borderRadius: 36,
          background: '#F1FFF7',
          border: '3px solid #6FD19C',
          boxShadow: '0 24px 60px rgba(111,209,156,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 36,
          fontWeight: 800,
          color: '#1A5C3F',
          textAlign: 'center',
          padding: 24,
          opacity: checkProgress,
          transform: `translateY(${interpolate(checkProgress, [0, 1], [24, 0])}px)`,
          overflowWrap: 'anywhere',
        }}
      >
        {checkLabel}
      </div>
    </div>
  );
};
