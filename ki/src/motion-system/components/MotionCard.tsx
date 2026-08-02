import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {MotionElement} from '../schema';

const emphasisStyles: Record<MotionElement['emphasis'], {border: string; background: string; glow: string}> = {
  normal: {border: '#D9D4E7', background: '#FFFFFF', glow: 'rgba(26,26,46,0.08)'},
  focus: {border: '#B98CFF', background: '#F7F1FF', glow: 'rgba(185,140,255,0.30)'},
  success: {border: '#6FD19C', background: '#F1FFF7', glow: 'rgba(111,209,156,0.25)'},
  warning: {border: '#F4B860', background: '#FFF9EF', glow: 'rgba(244,184,96,0.22)'},
  danger: {border: '#EC6A73', background: '#FFF2F3', glow: 'rgba(236,106,115,0.24)'},
};

export const MotionCard: React.FC<{
  element: MotionElement;
  x: number;
  y: number;
  appearAt: number;
  width?: number;
  height?: number;
  dimmed?: boolean;
  highlighted?: boolean;
  shaking?: boolean;
}> = ({element, x, y, appearAt, width = 260, height = 150, dimmed = false, highlighted = false, shaking = false}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const progress = spring({fps, frame: frame - appearAt, config: {damping: 18, stiffness: 180}});
  const opacity = interpolate(progress, [0, 1], [0, dimmed ? 0.35 : 1]);
  const scale = interpolate(progress, [0, 1], [0.88, highlighted ? 1.06 : 1]);
  const rise = interpolate(progress, [0, 1], [28, 0]);
  const shake = shaking && frame >= appearAt ? Math.sin((frame - appearAt) * 1.9) * Math.max(0, 9 - (frame - appearAt) * 0.5) : 0;
  const style = emphasisStyles[element.emphasis];

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 34,
        border: `4px solid ${style.border}`,
        background: style.background,
        boxShadow: `0 24px 55px ${style.glow}`,
        color: '#1A1A2E',
        fontSize: 34,
        fontWeight: 800,
        letterSpacing: -0.8,
        opacity,
        transform: `translate3d(${shake}px, ${rise}px, 0) scale(${scale})`,
        textAlign: 'center',
        padding: 22,
        boxSizing: 'border-box',
      }}
    >
      {element.label}
    </div>
  );
};
