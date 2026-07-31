import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, E, prog, lerpF, a } from '../tokens';

// Einheitliche FinanzNeo-Karte — konsistente Rundung, Rahmen, Glow, Inner-Highlight.
export const Card: React.FC<{
  children?: React.ReactNode;
  tint?: string; w?: number | string; h?: number | string;
  at?: number; glow?: number; radius?: number;
  style?: React.CSSProperties;
}> = ({ children, tint = 'var(--accent)', w = '100%', h = 'auto', at = 0, glow = 0.3, radius = 34, style }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 12, E.spring);
  return (
    <div style={{
      width: w, height: h, borderRadius: radius,
      background: `linear-gradient(150deg, ${a(tint, 0.18)} 0%, ${a(tint, 0.08)} 100%)`,
      border: `2.5px solid ${a(tint, 0.6)}`,
      boxShadow: `0 0 ${70 * glow}px ${a(tint, glow)}, inset 0 1px 0 ${a(tint, 0.3)}`,
      backdropFilter: 'blur(6px)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '32px 40px', boxSizing: 'border-box',
      opacity: at ? p : 1,
      transform: at ? `scale(${0.88 + p * 0.12})` : undefined,
      ...style,
    }}>{children}</div>
  );
};
