import React from 'react';
import { useCurrentFrame } from 'remotion';
import { E, prog, lerpF } from '../tokens';

// ════════════════════════════════════════════════════════════════════════════
//  KAMERA & BEWEGUNG — cineastische Fahrten/Übergänge als Wrapper (frame-basiert).
//  Pro Beat EINEN einsetzen (nie stapeln). Geben jedem Kernsatz „Kamera-Gefühl".
// ════════════════════════════════════════════════════════════════════════════

// ─── KenBurns — langsamer Drift + Zoom über die ganze Dauer (ruhig, premium) ─
export const KenBurns: React.FC<{
  children: React.ReactNode; durFrames: number; from?: number; to?: number;
  panX?: number; panY?: number; style?: React.CSSProperties;
}> = ({ children, durFrames, from = 1.06, to = 1.16, panX = -40, panY = -24, style }) => {
  const f = useCurrentFrame();
  const s = lerpF(f, from, to, 0, durFrames, E.inOut);
  const x = lerpF(f, 0, panX, 0, durFrames, E.inOut);
  const y = lerpF(f, 0, panY, 0, durFrames, E.inOut);
  return <div style={{ width: '100%', height: '100%', transform: `scale(${s}) translate(${x}px,${y}px)`,
    transformOrigin: '50% 50%', ...style }}>{children}</div>;
};

// ─── ParallaxLayer — Ebene driftet je nach Tiefe unterschiedlich schnell ─────
//  Mehrere übereinander mit versch. depth → räumliche Tiefe.
export const ParallaxLayer: React.FC<{
  children: React.ReactNode; depth?: number; ampX?: number; ampY?: number; style?: React.CSSProperties;
}> = ({ children, depth = 1, ampX = 40, ampY = 14, style }) => {
  const f = useCurrentFrame();
  const x = Math.sin(f * 0.02) * ampX * depth;
  const y = Math.cos(f * 0.016) * ampY * depth;
  return <div style={{ transform: `translate(${x}px,${y}px)`, ...style }}>{children}</div>;
};

// ─── WhipIn — Inhalt „peitscht" von der Seite rein (Whip-Pan-Gefühl) ─────────
export const WhipIn: React.FC<{
  children: React.ReactNode; at: number; dur?: number; dir?: 'left' | 'right'; dist?: number;
  style?: React.CSSProperties;
}> = ({ children, at, dur = 9, dir = 'left', dist = 720, style }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + dur, E.out);
  const sign = dir === 'left' ? -1 : 1;
  const x = (1 - p) * dist * sign;
  const blur = (1 - p) * 22;
  return <div style={{ transform: `translateX(${x}px)`, filter: `blur(${blur}px)`,
    opacity: Math.min(p * 1.6, 1), ...style }}>{children}</div>;
};

// ─── ZoomPunch — Ripple-/Zoom-Einschlag (aus groß+unscharf → scharf) ─────────
export const ZoomPunch: React.FC<{
  children: React.ReactNode; at: number; dur?: number; from?: number; style?: React.CSSProperties;
}> = ({ children, at, dur = 12, from = 1.6, style }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + dur, E.spring);
  const s = lerpF(f, from, 1, at, at + dur, E.spring);
  const blur = (1 - p) * 16;
  return <div style={{ transform: `scale(${s})`, filter: `blur(${blur}px)`,
    opacity: Math.min(p * 1.8, 1), transformOrigin: '50% 50%', ...style }}>{children}</div>;
};

// ─── PushThrough — Kamera schiebt aus der Tiefe nach vorn (klein → normal) ────
export const PushThrough: React.FC<{
  children: React.ReactNode; at: number; dur?: number; from?: number; style?: React.CSSProperties;
}> = ({ children, at, dur = 16, from = 0.62, style }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + dur, E.out);
  const s = lerpF(f, from, 1, at, at + dur, E.out);
  const blur = (1 - p) * 10;
  return <div style={{ transform: `scale(${s})`, filter: `blur(${blur}px)`,
    opacity: Math.min(p * 1.5, 1), transformOrigin: '50% 50%', ...style }}>{children}</div>;
};
