import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, E, prog, lerpF, a } from '../tokens';
import { FONT } from '../fonts';

// ─── WAAGE / BALANCE — Pro vs Contra, Risiko vs Rendite ───────────────────────
export const Balance: React.FC<{
  width: number; cx: number; topY: number;
  left: { label: string; weight: number; color?: string };
  right: { label: string; weight: number; color?: string };
  tiltAt: number;
}> = ({ width, cx, topY, left, right, tiltAt }) => {
  const f = useCurrentFrame();
  const p = prog(f, tiltAt, tiltAt + 24, E.inOut);
  const diff = (right.weight - left.weight);
  const tilt = Math.max(-14, Math.min(14, diff * 4)) * p;
  const beamW = 560;
  const lc = left.color ?? C.negative, rc = right.color ?? 'var(--accent)';
  const ly = topY + Math.sin(tilt * Math.PI / 180) * beamW / 2;
  const ry = topY - Math.sin(tilt * Math.PI / 180) * beamW / 2;
  return (
    <svg width={width} height={topY + 360} style={{ position: 'absolute', left: 0, top: 0 }}>
      {/* stand */}
      <line x1={cx} y1={topY} x2={cx} y2={topY + 300} stroke={C.gray} strokeWidth={8} opacity={0.5} />
      <polygon points={`${cx - 60},${topY + 300} ${cx + 60},${topY + 300} ${cx},${topY + 250}`} fill={a(C.gray, 0.4)} />
      {/* beam */}
      <line x1={cx - beamW / 2} y1={ly} x2={cx + beamW / 2} y2={ry} stroke={C.white} strokeWidth={10} strokeLinecap="round" />
      <circle cx={cx} cy={topY} r={16} fill={C.white} />
      {/* pans */}
      {[{ x: cx - beamW / 2, yy: ly, d: left, col: lc }, { x: cx + beamW / 2, yy: ry, d: right, col: rc }].map((s, i) => (
        <g key={i}>
          <line x1={s.x} y1={s.yy} x2={s.x} y2={s.yy + 90} stroke={a(C.gray, 0.6)} strokeWidth={3} />
          <ellipse cx={s.x} cy={s.yy + 120} rx={120} ry={30} fill={a(s.col, 0.22)} stroke={s.col} strokeWidth={3} />
          <text x={s.x} y={s.yy + 128} textAnchor="middle" fill={s.col} fontSize={34} fontFamily={FONT.body} fontWeight={800}>{s.d.label}</text>
        </g>
      ))}
    </svg>
  );
};

// ─── ZIEL-TRACKER (Thermometer) — Sparziel ────────────────────────────────────
export const GoalTracker: React.FC<{
  x: number; topY: number; height?: number; percent: number; goalLabel: string;
  start: number; end: number; color?: string;
}> = ({ x, topY, height = 700, percent, goalLabel, start, end, color = 'var(--accent)' }) => {
  const f = useCurrentFrame();
  const p = prog(f, start, end, E.out);
  const fillH = (height - 60) * (percent / 100) * p;
  const w = 100;
  return (
    <svg width={x + 400} height={topY + height + 100} style={{ position: 'absolute', left: 0, top: 0 }}>
      {/* tube */}
      <rect x={x} y={topY} width={w} height={height - 60} rx={w / 2} fill={a(C.gray, 0.15)} stroke={a(C.gray, 0.3)} strokeWidth={3} />
      {/* fill */}
      <rect x={x} y={topY + (height - 60) - fillH} width={w} height={fillH} rx={w / 2}
        fill={`url(#gtg)`} style={{ filter: `drop-shadow(0 0 14px ${a(color, 0.6)})` }} />
      {/* bulb */}
      <circle cx={x + w / 2} cy={topY + height - 20} r={80} fill={color} style={{ filter: `drop-shadow(0 0 14px ${a(color, 0.6)})` }} />
      <defs><linearGradient id="gtg" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stopColor={color} /><stop offset="100%" stopColor={'var(--accent-lt)'} /></linearGradient></defs>
      {/* labels */}
      <text x={x + w + 50} y={topY + 40} fill={C.white} fontSize={70} fontFamily={FONT.title}>{Math.round(percent * p)}%</text>
      <text x={x + w + 50} y={topY + 90} fill={C.gray} fontSize={32} fontFamily={FONT.body}>{goalLabel}</text>
    </svg>
  );
};

// ─── RANKING / LEADERBOARD — Top-Liste ────────────────────────────────────────
// Rang-Badge-Farben — gold/silber/bronze als ECHTE Farbverläufe, nicht Emoji
// (Emoji-Medaillen sehen billig/generisch aus, siehe REEL-PRINZIPIEN.md "keine
// billigen/generischen Effekte"). #1 bekommt zusätzlich Glow.
const RANK_COLOR = ['#FFD966', '#C9CFDA', '#D99A5B'];

export const Ranking: React.FC<{
  items: { name: string; value: string; appear: number }[];
  width?: number | string; accent?: string; textColor?: string;
}> = ({ items, width = '100%', accent = 'var(--accent)', textColor = C.white }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, width }}>
      {items.map((it, i) => {
        const p = prog(f, it.appear, it.appear + 12, E.spring);
        const top = i === 0;
        const rankColor = RANK_COLOR[i] ?? C.gray;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '22px 30px',
            borderRadius: 18, background: top ? a(accent, 0.14) : a(textColor, 0.05),
            border: `2px solid ${top ? accent : a(C.gray, 0.25)}`,
            opacity: p, transform: `translateX(${lerpF(f, 70, 0, it.appear, it.appear + 12)}px)` }}>
            <div style={{
              width: 60, height: 60, borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: `linear-gradient(155deg, ${rankColor}, ${a(rankColor, 0.55)})`,
              boxShadow: top ? `0 0 22px ${a(rankColor, 0.7)}` : undefined,
            }}>
              <span style={{ fontFamily: FONT.title, fontWeight: 900, fontSize: 28, color: '#1a1208' }}>
                {i + 1}
              </span>
            </div>
            <span style={{ flex: 1, fontFamily: FONT.body, fontSize: 42, fontWeight: 700, color: textColor }}>{it.name}</span>
            <span style={{ fontFamily: FONT.title, fontSize: 48, color: top ? accent : C.gray }}>{it.value}</span>
          </div>
        );
      })}
    </div>
  );
};

// ─── CALLOUT / ANNOTATION — Pfeil zeigt auf etwas + Label ─────────────────────
export const Callout: React.FC<{
  x: number; y: number; toX: number; toY: number; text: string; at: number; color?: string;
}> = ({ x, y, toX, toY, text, at, color = C.gold }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 12, E.spring);
  const ex = x + (toX - x) * E.out(p);
  const ey = y + (toY - y) * E.out(p);
  return (
    <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <line x1={x} y1={y} x2={ex} y2={ey} stroke={color} strokeWidth={4} markerEnd="url(#coA)" opacity={p} />
      <g opacity={p} transform={`translate(${x},${y})`}>
        <rect x={-10} y={-50} width={text.length * 22 + 40} height={70} rx={16} fill={a(color, 0.18)} stroke={color} strokeWidth={2} />
        <text x={10} y={-6} fill={C.white} fontSize={36} fontFamily={FONT.body} fontWeight={700}>{text}</text>
      </g>
      <defs><marker id="coA" markerWidth="10" markerHeight="8" refX="8" refY="4" orient="auto"><polygon points="0 0,10 4,0 8" fill={color} /></marker></defs>
    </svg>
  );
};
