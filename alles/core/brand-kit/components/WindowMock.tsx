import React from 'react';
import { useCurrentFrame } from 'remotion';
import { E, prog, lerpF } from '../tokens';
import { FONT } from '../fonts';

// macOS-Fenster-Mockup (heller, cleaner Stil — wie in Product-Demo-Clips).
export const WindowMock: React.FC<{
  title?: string; w?: number; h?: number; at?: number;
  light?: boolean; children?: React.ReactNode; style?: React.CSSProperties;
}> = ({ title = '', w = 880, h = 520, at = 0, light = true, children, style }) => {
  const f = useCurrentFrame();
  const p = at ? prog(f, at, at + 14, E.spring) : 1;
  const bg = light ? '#F4F5F7' : '#161B22';
  const bar = light ? '#E6E8EB' : '#0D1117';
  const titleCol = light ? '#8A9099' : '#8B949E';
  return (
    <div style={{
      width: w, height: h, borderRadius: 18, overflow: 'hidden',
      background: bg, boxShadow: '0 30px 80px rgba(0,0,0,0.25)',
      border: `1px solid ${light ? '#DADCE0' : '#30363D'}`,
      opacity: p, transform: `translateY(${lerpF(f, 30, 0, at, at + 14, E.spring)}px) scale(${0.96 + p * 0.04})`,
      ...style,
    }}>
      {/* Titelleiste */}
      <div style={{ height: 44, background: bar, display: 'flex', alignItems: 'center', paddingInline: 18, gap: 9 }}>
        <div style={{ width: 13, height: 13, borderRadius: '50%', background: '#FF5F57' }} />
        <div style={{ width: 13, height: 13, borderRadius: '50%', background: '#FEBC2E' }} />
        <div style={{ width: 13, height: 13, borderRadius: '50%', background: '#28C840' }} />
        <div style={{ flex: 1, textAlign: 'center', fontFamily: 'monospace', fontSize: 20, color: titleCol, marginRight: 40 }}>{title}</div>
      </div>
      {/* Inhalt */}
      <div style={{ padding: 30, height: h - 44, boxSizing: 'border-box' }}>{children}</div>
    </div>
  );
};

// Icon-Kachel (abgerundetes farbiges Quadrat mit Buchstabe) — wie R/M/S/T.
export const IconTile: React.FC<{
  letter: string; color: string; label: string; at: number; size?: number; light?: boolean;
}> = ({ letter, color, label, at, size = 90, light = true }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 12, E.spring);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
      opacity: p, transform: `translateY(${lerpF(f, 24, 0, at, at + 12, E.spring)}px) scale(${0.8 + p * 0.2})` }}>
      <div style={{ width: size, height: size, borderRadius: size * 0.26, background: color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: FONT.title, fontSize: size * 0.55, color: '#fff',
        boxShadow: `0 10px 28px ${color}66` }}>{letter}</div>
      <div style={{ fontFamily: FONT.body, fontWeight: 600, fontSize: 24, color: light ? '#3A3F47' : '#C9D1D9' }}>{label}</div>
    </div>
  );
};
