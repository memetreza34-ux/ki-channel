import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, E, prog, lerpF, a } from '../tokens';
import { FONT } from '../fonts';
import { Icon, IconName } from './Icon';

// ─── Nummerierte Schritte (Roadmap) ───────────────────────────────────────────
export const NumberedSteps: React.FC<{
  steps: { label: string; appear: number; icon?: IconName }[];
  color?: string; gap?: number; textColor?: string;
}> = ({ steps, color = 'var(--accent)', gap = 38, textColor = C.white }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap }}>
      {steps.map((s, i) => {
        const p = prog(f, s.appear, s.appear + 12, E.spring);
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 32,
            opacity: p, transform: `translateX(${lerpF(f, 80, 0, s.appear, s.appear + 14, E.out)}px)` }}>
            <div style={{ flexShrink: 0, width: 92, height: 92, borderRadius: '50%',
              background: a(color, 0.14), border: `3px solid ${color}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: FONT.title, fontSize: 52, color, boxShadow: `0 0 28px ${a(color, 0.4)}` }}>
              {s.icon ? <Icon name={s.icon} size={48} color={color} /> : i + 1}
            </div>
            <div style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 56, color: textColor }}>{s.label}</div>
          </div>
        );
      })}
    </div>
  );
};

// ─── Vergleichs-/Problem-Cards mit Lösungs-Häkchen ────────────────────────────
export const CheckCards: React.FC<{
  cards: { text: string; appear: number; solve?: number }[];
  width?: number | string; gap?: number;
}> = ({ cards, width = '100%', gap = 44 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap, width }}>
      {cards.map((c, i) => {
        const p = prog(f, c.appear, c.appear + 12, E.spring);
        const solved = c.solve ? prog(f, c.solve, c.solve + 10, E.spring) : 0;
        const on = solved > 0.5;
        return (
          <div key={i} style={{ position: 'relative', opacity: p,
            transform: `translateX(${lerpF(f, i % 2 ? -80 : 80, 0, c.appear, c.appear + 14, E.out)}px)` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 26, padding: '40px 42px',
              borderRadius: 28, background: on ? a('var(--accent)', 0.12) : 'rgba(255,255,255,0.05)',
              border: `2.5px solid ${on ? 'var(--accent)' : 'rgba(255,255,255,0.2)'}` }}>
              <div style={{ fontSize: 56 }}>{on ? '✅' : '❓'}</div>
              <div style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 52,
                color: on ? 'var(--accent-lt)' : C.white, lineHeight: 1.15 }}>{c.text}</div>
            </div>
            {solved > 0 && (
              <div style={{ position: 'absolute', top: -20, right: -8,
                transform: `scale(${solved}) rotate(-8deg)`, background: 'var(--accent)', color: C.bg,
                fontFamily: FONT.title, fontSize: 30, padding: '8px 20px', borderRadius: 10,
                boxShadow: `0 0 22px ${a('var(--accent)', 0.7)}`, letterSpacing: 1 }}>GELÖST</div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ─── Timeline (horizontal, Punkte auf einer Linie) ────────────────────────────
export const Timeline: React.FC<{
  width: number; y: number; left: number; right: number;
  points: { label: string; sub?: string; appear: number }[];
  color?: string; textColor?: string; subColor?: string;
}> = ({ width, y, left, right, points, color = 'var(--accent)', textColor = C.white, subColor = C.gray }) => {
  const f = useCurrentFrame();
  const draw = prog(f, points[0]?.appear ?? 0, (points[points.length - 1]?.appear ?? 30) + 12, E.out);
  return (
    <svg width={width} height={y + 160} style={{ position: 'absolute', left: 0, top: 0 }}>
      <line x1={left} y1={y} x2={left + (right - left) * draw} y2={y} stroke={color} strokeWidth={5}
        strokeLinecap="round" style={{ filter: `drop-shadow(0 0 10px ${a(color, 0.6)})` }} />
      {points.map((pt, i) => {
        const px = left + ((right - left) / (points.length - 1)) * i;
        const p = prog(f, pt.appear, pt.appear + 10, E.spring);
        if (p <= 0) return null;
        return (
          <g key={i} opacity={p}>
            <circle cx={px} cy={y} r={14} fill={color} style={{ filter: `drop-shadow(0 0 12px ${color})` }} />
            <text x={px} y={y - 36} textAnchor="middle" fill={textColor} fontSize={36} fontFamily={FONT.title} letterSpacing={1}>{pt.label}</text>
            {pt.sub && <text x={px} y={y + 54} textAnchor="middle" fill={subColor} fontSize={26} fontFamily={FONT.body}>{pt.sub}</text>}
          </g>
        );
      })}
    </svg>
  );
};
