import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {easedProgress} from '../motion/easing';
import {YOUTUBE_VISUAL_LANGUAGE} from './visualLanguage';

export type SignalThreadProps = {
  fromX?: number;
  toX?: number;
  y?: number;
  startFrame?: number;
  endFrame?: number;
  opacity?: number;
  thickness?: number;
  active?: boolean;
};

export const SignalThread: React.FC<SignalThreadProps> = ({
  fromX = 90,
  toX = 1830,
  y = 1000,
  startFrame = 0,
  endFrame = 24,
  opacity = 0.7,
  thickness = 4,
  active = true,
}) => {
  const frame = useCurrentFrame();
  if (!active) return null;

  const progress = easedProgress(frame, startFrame, Math.max(startFrame + 1, endFrame));
  const x = interpolate(progress, [0, 1], [fromX, toX]);
  const length = Math.max(1, toX - fromX);

  return (
    <svg
      viewBox="0 0 1920 1080"
      style={{position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none'}}
      aria-hidden
    >
      <defs>
        <linearGradient id="ki-signal-thread-gradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={YOUTUBE_VISUAL_LANGUAGE.colors.purple} stopOpacity="0.08" />
          <stop offset="50%" stopColor={YOUTUBE_VISUAL_LANGUAGE.colors.purpleLight} stopOpacity="0.9" />
          <stop offset="100%" stopColor={YOUTUBE_VISUAL_LANGUAGE.colors.purple} stopOpacity="0.08" />
        </linearGradient>
      </defs>
      <line
        x1={fromX}
        y1={y}
        x2={toX}
        y2={y}
        stroke="rgba(110,69,201,0.10)"
        strokeWidth={Math.max(1, thickness - 1)}
        strokeLinecap="round"
      />
      <line
        x1={fromX}
        y1={y}
        x2={toX}
        y2={y}
        stroke="url(#ki-signal-thread-gradient)"
        strokeWidth={thickness}
        strokeLinecap="round"
        strokeDasharray={length}
        strokeDashoffset={length * (1 - progress)}
        opacity={opacity}
      />
      <circle
        cx={x}
        cy={y}
        r={8 + 4 * progress}
        fill={YOUTUBE_VISUAL_LANGUAGE.colors.purpleLight}
        stroke={YOUTUBE_VISUAL_LANGUAGE.colors.paper}
        strokeWidth={4}
        opacity={opacity}
      />
    </svg>
  );
};
