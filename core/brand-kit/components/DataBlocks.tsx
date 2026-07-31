import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { C, E, prog, lerpF, a, num } from '../tokens';
import { FONT } from '../fonts';

// ─── TABELLE — Zeilen bauen sich nacheinander auf ─────────────────────────────
export const Table: React.FC<{
  headers: string[];
  rows: { cells: string[]; appear: number; highlight?: boolean }[];
  width?: number | string; accent?: string; textColor?: string;
}> = ({ headers, rows, width = '100%', accent = 'var(--accent)', textColor = C.white }) => {
  const f = useCurrentFrame();
  const cols = headers.length;
  return (
    <div style={{ width, fontFamily: FONT.body }}>
      {/* Header */}
      <div style={{ display: 'grid', gridTemplateColumns: `1.4fr ${'1fr '.repeat(cols - 1)}`,
        padding: '20px 28px', borderRadius: 16, background: a(accent, 0.14), border: `2px solid ${a(accent, 0.4)}` }}>
        {headers.map((h, i) => (
          <div key={i} style={{ fontSize: 34, fontWeight: 800, color: accent,
            textAlign: i === 0 ? 'left' : 'center' }}>{h}</div>
        ))}
      </div>
      {/* Rows */}
      {rows.map((r, i) => {
        const p = prog(f, r.appear, r.appear + 12, E.out);
        return (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: `1.4fr ${'1fr '.repeat(cols - 1)}`,
            padding: '22px 28px', marginTop: 10, borderRadius: 14,
            background: r.highlight ? a(accent, 0.1) : a(textColor, 0.04),
            border: r.highlight ? `2px solid ${a(accent, 0.5)}` : `1px solid ${a(C.gray, 0.2)}`,
            opacity: p, transform: `translateX(${lerpF(f, 60, 0, r.appear, r.appear + 12)}px)` }}>
            {r.cells.map((cell, j) => (
              <div key={j} style={{ fontSize: 36, fontWeight: j === 0 ? 700 : 600,
                color: j === 0 ? textColor : (r.highlight ? accent : C.gray),
                textAlign: j === 0 ? 'left' : 'center' }}>{cell}</div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

// ─── RIESEN-STAT — eine fette Zahl + Kontext (Hook-Momente) ───────────────────
export const BigStat: React.FC<{
  value: string; label: string; at?: number; color?: string; size?: number; textColor?: string;
  style?: React.CSSProperties;
}> = ({ value, label, at = 0, color = 'var(--accent)', size = 280, textColor = C.white, style }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 14, E.spring);
  return (
    <div style={{ textAlign: 'center', opacity: p, transform: `scale(${0.7 + p * 0.3})`, ...style }}>
      <div style={{ fontFamily: FONT.title, fontSize: size, color, lineHeight: 0.95,
        textShadow: `0 0 80px ${a(color, 0.6)}` }}>{value}</div>
      <div style={{ fontFamily: FONT.body, fontSize: size * 0.16, fontWeight: 700, color: textColor,
        marginTop: 10, letterSpacing: 1 }}>{label}</div>
    </div>
  );
};

// ─── RISIKO-TACHO (Gauge) — Halbkreis-Zeiger ──────────────────────────────────
export const Gauge: React.FC<{
  cx: number; cy: number; radius?: number; value: number;  // 0..100
  start: number; end: number; label?: string; textColor?: string;
}> = ({ cx, cy, radius = 200, value, start, end, label, textColor = C.white }) => {
  const f = useCurrentFrame();
  const p = prog(f, start, end, E.out);
  const v = value * p;
  const ang = Math.PI * (v / 100);             // 0..PI (links→rechts)
  const nx = cx - Math.cos(ang) * radius * 0.8;
  const ny = cy - Math.sin(ang) * radius * 0.8;
  const seg = (frac: number, color: string, from: number) => {
    const a0 = Math.PI * from, a1 = Math.PI * (from + frac);
    const x0 = cx - Math.cos(a0) * radius, y0 = cy - Math.sin(a0) * radius;
    const x1 = cx - Math.cos(a1) * radius, y1 = cy - Math.sin(a1) * radius;
    return `M ${x0} ${y0} A ${radius} ${radius} 0 0 1 ${x1} ${y1}`;
  };
  return (
    <svg width={cx * 2} height={cy + radius * 0.5} style={{ position: 'absolute', left: 0, top: 0 }}>
      <path d={seg(0.34, 'var(--accent)', 0)} fill="none" stroke={'var(--accent)'} strokeWidth={32} strokeLinecap="round" opacity={0.85} />
      <path d={seg(0.33, C.gold, 0.34)} fill="none" stroke={C.gold} strokeWidth={32} opacity={0.85} />
      <path d={seg(0.33, C.negative, 0.67)} fill="none" stroke={C.negative} strokeWidth={32} strokeLinecap="round" opacity={0.85} />
      {/* needle */}
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={textColor} strokeWidth={8} strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 8px ${a(textColor, 0.6)})` }} />
      <circle cx={cx} cy={cy} r={16} fill={textColor} />
      {label && <text x={cx} y={cy + radius * 0.35} textAnchor="middle" fill={textColor} fontSize={radius * 0.2} fontFamily={FONT.title}>{label}</text>}
    </svg>
  );
};

// ─── FORTSCHRITTS-BALKEN — „73 % der Deutschen…" ──────────────────────────────
export const StatBar: React.FC<{
  percent: number; label: string; at: number; color?: string; width?: number; textColor?: string;
}> = ({ percent, label, at, color = 'var(--accent)', width = 800, textColor = C.white }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 24, E.out);
  return (
    <div style={{ width }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12,
        fontFamily: FONT.body, fontSize: 38, fontWeight: 700, color: textColor }}>
        <span>{label}</span>
        <span style={{ color, fontFamily: FONT.title, fontSize: 50 }}>{Math.round(percent * p)}%</span>
      </div>
      <div style={{ height: 36, borderRadius: 999, background: a(C.gray, 0.15), overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${percent * p}%`, borderRadius: 999,
          background: `linear-gradient(90deg, ${a(color, 0.7)}, ${color})`,
          boxShadow: `0 0 18px ${a(color, 0.6)}` }} />
      </div>
    </div>
  );
};

// ─── TIMELINE — Meilensteine bauen sich entlang einer Linie auf ───────────────
//    <MilestoneTimeline at={10} items={[{label:'2015', title:'Start', desc:'…'}, …]} />
export const MilestoneTimeline: React.FC<{
  items: { label: string; title: string; desc?: string; color?: string }[];
  at: number; per?: number; width?: number; textColor?: string;
}> = ({ items, at, per = 10, width = 760, textColor = C.white }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rowH = 108;
  const lineP = prog(f, at, at + items.length * per + 16, E.out);
  return (
    <div style={{ position: 'relative', width, paddingLeft: 56 }}>
      {/* wachsende Linie */}
      <div style={{ position: 'absolute', left: 9, top: 6, width: 4, borderRadius: 2,
        height: lineP * (items.length * rowH - 60),
        background: `linear-gradient(${'var(--accent)'}, ${a('var(--accent)', 0.15)})` }} />
      {items.map((it, i) => {
        const p = spring({ frame: f - at - i * per, fps, config: { damping: 15, stiffness: 170 } });
        const c = it.color ?? 'var(--accent)';
        return (
          <div key={i} style={{ position: 'relative', height: rowH,
            transform: `translateX(${(1 - p) * 44}px)`, opacity: Math.min(p * 1.3, 1) }}>
            <div style={{ position: 'absolute', left: -56, top: 2, width: 22, height: 22,
              borderRadius: '50%', background: c, boxShadow: `0 0 14px ${a(c, 0.6)}`,
              transform: `scale(${0.5 + p * 0.5})` }} />
            <div style={{ fontFamily: FONT.title, fontSize: 30, color: c, lineHeight: 1 }}>
              {it.label}
            </div>
            <div style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 30, color: textColor,
              marginTop: 6 }}>
              {it.title}
            </div>
            {it.desc && (
              <div style={{ fontFamily: FONT.body, fontSize: 21, color: C.gray, marginTop: 4 }}>
                {it.desc}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ─── STATS-CARDS — Kennzahlen-Karten poppen versetzt auf ──────────────────────
//    <StatsCards at={10} items={[{value:'121.997 €', label:'Endwert', color:C.gold}, …]} />
export const StatsCards: React.FC<{
  items: { value: string; label: string; color?: string; sub?: string }[];
  at: number; per?: number; cardWidth?: number; textColor?: string;
}> = ({ items, at, per = 7, cardWidth = 330, textColor = C.white }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: 'flex', gap: 30, justifyContent: 'center' }}>
      {items.map((it, i) => {
        const p = spring({ frame: f - at - i * per, fps, config: { damping: 13, stiffness: 190 } });
        const c = it.color ?? 'var(--accent)';
        return (
          <div key={i} style={{
            width: cardWidth, padding: '38px 34px', borderRadius: 22,
            background: a(textColor, 0.04), border: `1px solid ${a(c, 0.35)}`,
            boxShadow: `0 18px 50px ${a('#000000', 0.2)}, inset 0 1px 0 ${a(textColor, 0.06)}`,
            transform: `translateY(${(1 - p) * 56}px) scale(${0.92 + p * 0.08})`,
            opacity: Math.min(p * 1.3, 1),
          }}>
            <div style={{ fontFamily: FONT.title, fontSize: 64, color: c, lineHeight: 1,
              whiteSpace: 'nowrap' }}>
              {it.value}
            </div>
            <div style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 24, color: textColor,
              marginTop: 14 }}>
              {it.label}
            </div>
            {it.sub && (
              <div style={{ fontFamily: FONT.body, fontSize: 19, color: C.gray, marginTop: 6 }}>
                {it.sub}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
