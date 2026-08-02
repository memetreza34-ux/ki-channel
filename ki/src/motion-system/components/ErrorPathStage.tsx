import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const ErrorPathStage: React.FC<{
  inputLabel: string;
  errorLabel: string;
  checkLabel: string;
  startFrame?: number;
}> = ({inputLabel, errorLabel, checkLabel, startFrame = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({fps, frame: frame - startFrame, config: {damping: 18, stiffness: 170}});
  const branch = interpolate(frame, [startFrame + 20, startFrame + 55], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const pulse = 1 + Math.sin(Math.max(0, frame - startFrame) * 0.18) * 0.035;

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
          transform: `translateX(${interpolate(enter, [0, 1], [-120, 0])}px)`,
          textAlign: 'center',
          padding: 24,
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
          strokeDashoffset={1 - branch}
        />
        <path
          d="M330 310 C470 310 520 500 660 500"
          fill="none"
          stroke="#6FD19C"
          strokeWidth="9"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - branch}
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
          transform: `scale(${pulse})`,
          opacity: branch,
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
          opacity: branch,
        }}
      >
        {checkLabel}
      </div>
    </div>
  );
};
