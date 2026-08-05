import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, E, lerpF, num } from '../tokens';
import { FONT } from '../fonts';

// Hochzählende Zahl (Bebas Neue, extra groß) — synchron zum gesprochenen Wert.
export const Counter: React.FC<{
  from?: number; to: number; start: number; end: number;
  suffix?: string; size?: number; color?: string;
  style?: React.CSSProperties; easing?: any;
}> = ({ from = 0, to, start, end, suffix = ' €', size = 150, color = 'var(--accent)', style, easing = E.out }) => {
  const f = useCurrentFrame();
  const v = f < start ? from : lerpF(f, from, to, start, end, easing);
  return (
    <span style={{
      fontFamily: FONT.title, fontWeight: 400, fontSize: size, color, lineHeight: 1,
      letterSpacing: 1, textShadow: `0 0 70px ${color}aa`, ...style,
    }}>{num(v)}{suffix}</span>
  );
};
