import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, E, prog, lerpF, a } from '../tokens';
import { FONT } from '../fonts';

// ─── Title (Bebas Neue, groß) ─────────────────────────────────────────────────
export const Title: React.FC<{
  children: React.ReactNode; at?: number; size?: number; color?: string;
  style?: React.CSSProperties;
}> = ({ children, at = 0, size = 120, color = C.white, style }) => {
  const f = useCurrentFrame();
  return (
    <div style={{
      fontFamily: FONT.title, fontWeight: 400, fontSize: size, color,
      letterSpacing: 1.5, lineHeight: 1.0, textTransform: 'uppercase',
      opacity: prog(f, at, at + 8),
      transform: `translateY(${lerpF(f, 28, 0, at, at + 12, E.spring)}px)`,
      textShadow: `0 4px 30px rgba(0,0,0,0.5)`, ...style,
    }}>{children}</div>
  );
};

// ─── Body text (Inter) ────────────────────────────────────────────────────────
export const Body: React.FC<{
  children: React.ReactNode; at?: number; size?: number; weight?: number; color?: string;
  style?: React.CSSProperties;
}> = ({ children, at = 0, size = 48, weight = 600, color = C.white, style }) => {
  const f = useCurrentFrame();
  return (
    <div style={{
      fontFamily: FONT.body, fontWeight: weight, fontSize: size, color, lineHeight: 1.3,
      opacity: prog(f, at, at + 8),
      transform: `translateY(${lerpF(f, 22, 0, at, at + 12, E.spring)}px)`, ...style,
    }}>{children}</div>
  );
};

// ─── Kicker-Chip (kleines Label) ──────────────────────────────────────────────
export const Kicker: React.FC<{
  children: React.ReactNode; at?: number; color?: string; style?: React.CSSProperties;
}> = ({ children, at = 0, color = 'var(--accent)', style }) => {
  const f = useCurrentFrame();
  return (
    <div style={{
      display: 'inline-block', padding: '10px 26px', borderRadius: 999,
      border: `2px solid ${a(color, 0.6)}`, background: a(color, 0.12), color,
      fontFamily: FONT.body, fontWeight: 800, fontSize: 30, letterSpacing: 4,
      textTransform: 'uppercase',
      opacity: prog(f, at, at + 8),
      transform: `scale(${lerpF(f, 0.8, 1, at, at + 10, E.spring)})`, ...style,
    }}>{children}</div>
  );
};

// ─── Wort-für-Wort Reveal (synchron zur Stimme) ───────────────────────────────
export const WordReveal: React.FC<{
  text: string; start: number; perWord?: number; size?: number;
  highlight?: string[]; highlightColor?: string; color?: string;
  style?: React.CSSProperties;
}> = ({ text, start, perWord = 5, size = 72, highlight = [], highlightColor = 'var(--accent)', color = C.white, style }) => {
  const f = useCurrentFrame();
  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 12px',
      fontFamily: FONT.body, fontSize: size, lineHeight: 1.25, ...style,
    }}>
      {text.split(' ').map((w, i) => {
        const wf = start + i * perWord;
        const isH = highlight.some(h => w.replace(/[.,!?]/g, '').toLowerCase() === h.toLowerCase());
        return (
          <span key={i} style={{
            display: 'inline-block',
            opacity: prog(f, wf, wf + perWord),
            transform: `translateY(${lerpF(f, 20, 0, wf, wf + perWord + 3, E.out)}px)`,
            color: isH ? highlightColor : color, fontWeight: isH ? 800 : 600,
            textShadow: isH ? `0 0 26px ${a(highlightColor, 0.5)}` : undefined,
          }}>{w}</span>
        );
      })}
    </div>
  );
};
