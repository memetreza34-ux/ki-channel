import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, E, prog, lerpF, a } from '../tokens';
import { FONT } from '../fonts';

// ─── Typewriter — Zeichen erscheinen nacheinander ─────────────────────────────
export const Typewriter: React.FC<{
  text: string; start: number; cps?: number; size?: number; color?: string; weight?: number;
  style?: React.CSSProperties; caret?: boolean;
}> = ({ text, start, cps = 28, size = 56, color = C.white, weight = 700, style, caret = true }) => {
  const f = useCurrentFrame();
  const shown = Math.max(0, Math.floor(((f - start) / 30) * cps));
  const visible = text.slice(0, shown);
  const done = shown >= text.length;
  return (
    <span style={{ fontFamily: FONT.body, fontSize: size, color, fontWeight: weight, ...style }}>
      {visible}
      {caret && !done && f > start && <span style={{ opacity: f % 16 < 8 ? 1 : 0, color: 'var(--accent)' }}>|</span>}
    </span>
  );
};

// ─── Masken-Reveal — Text wischt von links auf ────────────────────────────────
export const MaskReveal: React.FC<{
  children: React.ReactNode; at: number; dur?: number; size?: number; color?: string; weight?: number;
  style?: React.CSSProperties;
}> = ({ children, at, dur = 16, size = 80, color = C.white, weight = 900, style }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + dur, E.inOut);
  const pct = (1 - p) * 100;
  return (
    <div style={{ fontFamily: FONT.title, fontSize: size, color, fontWeight: weight, lineHeight: 1.05,
      clipPath: `inset(0 ${pct}% 0 0)`, WebkitClipPath: `inset(0 ${pct}% 0 0)`, ...style }}>
      {children}
    </div>
  );
};

// ─── Wort-Stagger — Wörter springen nacheinander hoch ─────────────────────────
export const WordStagger: React.FC<{
  text: string; start: number; perWord?: number; size?: number;
  highlight?: string[]; highlightColor?: string; color?: string; style?: React.CSSProperties;
}> = ({ text, start, perWord = 4, size = 72, highlight = [], highlightColor = 'var(--accent)', color = C.white, style }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 12px',
      fontFamily: FONT.body, fontSize: size, lineHeight: 1.2, ...style }}>
      {text.split(' ').map((w, i) => {
        const wf = start + i * perWord;
        const p = prog(f, wf, wf + perWord + 4, E.spring);
        const isH = highlight.some(h => w.replace(/[.,!?]/g, '').toLowerCase() === h.toLowerCase());
        return (
          <span key={i} style={{ display: 'inline-block', opacity: p,
            transform: `translateY(${lerpF(f, 34, 0, wf, wf + perWord + 4, E.spring)}px)`,
            color: isH ? highlightColor : color, fontWeight: isH ? 900 : 600,
            textShadow: isH ? `0 0 26px ${a(highlightColor, 0.5)}` : undefined }}>{w}</span>
        );
      })}
    </div>
  );
};

// ─── DRAW ON — Stift zeichnet live eine Linie/einen Kreis um etwas ────────────
// Für "genau HIER schau hin"-Momente: `variant="underline"` unter ein Wort legen
// (w/h = Zielbreite/-höhe), `variant="circle"` um ein Element herum.
export const DrawOn: React.FC<{
  variant?: 'underline' | 'circle'; w: number; h?: number; at: number; durFrames?: number;
  color?: string; strokeWidth?: number; style?: React.CSSProperties;
}> = ({ variant = 'underline', w, h = 60, at, durFrames = 20, color = C.gold, strokeWidth = 8, style }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + durFrames, E.out);
  if (variant === 'circle') {
    const rx = w / 2, ry = h / 2;
    const d = `M ${strokeWidth} ${ry} A ${rx - strokeWidth} ${ry - strokeWidth} 0 1 1 ${w - strokeWidth} ${ry + 6}`;
    return (
      <svg width={w} height={h} style={{ position: 'absolute', overflow: 'visible', ...style }}>
        <path d={d} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
          pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p}
          style={{ filter: `drop-shadow(0 0 10px ${a(color, 0.6)})` }} />
      </svg>
    );
  }
  return (
    <svg width={w} height={h} style={{ position: 'absolute', overflow: 'visible', ...style }}>
      <path d={`M 4 ${h / 2} Q ${w / 2} ${h}, ${w - 4} ${h / 2 - 6}`} fill="none" stroke={color}
        strokeWidth={strokeWidth} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p}
        style={{ filter: `drop-shadow(0 0 10px ${a(color, 0.6)})` }} />
    </svg>
  );
};
