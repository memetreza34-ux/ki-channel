import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, E, prog, lerpF, a } from '../tokens';
import { FONT } from '../fonts';
import { Icon, IconName } from './Icon';

// ─── VERGLEICH-SPLIT — zwei Seiten gegeneinander (Sparbuch vs ETF) ─────────────
export const CompareSplit: React.FC<{
  left: { title: string; value: string; sub?: string; icon?: IconName; color?: string; appear: number };
  right: { title: string; value: string; sub?: string; icon?: IconName; color?: string; appear: number };
  height?: number;
}> = ({ left, right, height = 700 }) => {
  const f = useCurrentFrame();
  const side = (s: typeof left, dir: -1 | 1) => {
    const p = prog(f, s.appear, s.appear + 14, E.spring);
    const col = s.color ?? (dir < 0 ? C.negative : 'var(--accent)');
    return (
      <div style={{ flex: 1, height, borderRadius: 32, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 18, padding: 40,
        background: `linear-gradient(160deg, ${a(col, 0.18)}, ${a(col, 0.06)})`,
        border: `2.5px solid ${a(col, 0.5)}`,
        opacity: p, transform: `translateX(${lerpF(f, dir * 90, 0, s.appear, s.appear + 14, E.spring)}px)` }}>
        {s.icon && <Icon name={s.icon} size={90} color={col} />}
        <div style={{ fontFamily: FONT.body, fontSize: 40, fontWeight: 700, color: C.white }}>{s.title}</div>
        <div style={{ fontFamily: FONT.title, fontSize: 110, color: col, lineHeight: 1,
          textShadow: `0 0 50px ${a(col, 0.5)}` }}>{s.value}</div>
        {s.sub && <div style={{ fontFamily: FONT.body, fontSize: 30, color: C.gray }}>{s.sub}</div>}
      </div>
    );
  };
  const vsP = prog(f, Math.min(left.appear, right.appear) + 8, Math.min(left.appear, right.appear) + 20, E.spring);
  return (
    <div style={{ position: 'relative', display: 'flex', gap: 40, width: '100%' }}>
      {side(left, -1)}
      {side(right, 1)}
      <div style={{ position: 'absolute', left: '50%', top: '50%',
        transform: `translate(-50%,-50%) scale(${vsP})`,
        width: 110, height: 110, borderRadius: '50%', background: C.bgDeep,
        border: `3px solid ${C.white}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: FONT.title, fontSize: 52, color: C.white, zIndex: 5 }}>VS</div>
    </div>
  );
};

// ─── CHECKLISTE — Punkte mit Häkchen erscheinen nacheinander ──────────────────
export const Checklist: React.FC<{
  items: { text: string; appear: number }[]; color?: string; size?: number; textColor?: string;
}> = ({ items, color = 'var(--accent)', size = 50, textColor = C.white }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
      {items.map((it, i) => {
        const p = prog(f, it.appear, it.appear + 12, E.spring);
        const check = prog(f, it.appear + 4, it.appear + 16, E.out);
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 26,
            opacity: p, transform: `translateX(${lerpF(f, 50, 0, it.appear, it.appear + 12)}px)` }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, flexShrink: 0,
              background: a(color, 0.16), border: `2.5px solid ${color}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width={38} height={38} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={3.5}
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 13l4 4 10-11" strokeDasharray={22} strokeDashoffset={22 * (1 - check)} />
              </svg>
            </div>
            <div style={{ fontFamily: FONT.body, fontSize: size, fontWeight: 600, color: textColor }}>{it.text}</div>
          </div>
        );
      })}
    </div>
  );
};

// ─── ZITAT / STATEMENT-CARD — für starke Aussagen ─────────────────────────────
export const Quote: React.FC<{
  text: string; author?: string; at?: number; color?: string; size?: number;
}> = ({ text, author, at = 0, color = 'var(--accent)', size = 64 }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 16, E.out);
  return (
    <div style={{ position: 'relative', maxWidth: 880, padding: '50px 60px', borderRadius: 32,
      background: a(color, 0.08), borderLeft: `8px solid ${color}`,
      opacity: p, transform: `translateY(${lerpF(f, 30, 0, at, at + 16, E.spring)}px)` }}>
      <div style={{ position: 'absolute', top: -30, left: 30, fontFamily: FONT.title, fontSize: 120,
        color: a(color, 0.5), lineHeight: 1 }}>"</div>
      <div style={{ fontFamily: FONT.body, fontStyle: 'italic', fontWeight: 700, fontSize: size,
        color: C.white, lineHeight: 1.3 }}>{text}</div>
      {author && <div style={{ fontFamily: FONT.body, fontSize: 34, color, marginTop: 20, fontWeight: 700 }}>— {author}</div>}
    </div>
  );
};

// ─── BADGE / STAMP — „GRATIS", „NEU", „-50 %" ─────────────────────────────────
export const Badge: React.FC<{
  text: string; at?: number; color?: string; rotate?: number; size?: number; style?: React.CSSProperties;
}> = ({ text, at = 0, color = C.negative, rotate = -8, size = 44, style }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 10, E.spring);
  return (
    <div style={{ display: 'inline-block', padding: '14px 32px', borderRadius: 14,
      background: color, color: C.bg, fontFamily: FONT.title, fontSize: size, letterSpacing: 1,
      boxShadow: `0 0 30px ${a(color, 0.7)}`,
      opacity: p, transform: `scale(${p}) rotate(${rotate}deg)`, ...style }}>{text}</div>
  );
};

// ─── FEATURE-GRID — Icons mit Labels (2×2 / 3er) ──────────────────────────────
export const FeatureGrid: React.FC<{
  items: { icon: IconName; label: string; appear: number; color?: string }[]; cols?: number; gap?: number;
}> = ({ items, cols = 2, gap = 40 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap }}>
      {items.map((it, i) => {
        const p = prog(f, it.appear, it.appear + 12, E.spring);
        const col = it.color ?? 'var(--accent)';
        return (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
            padding: 30, borderRadius: 24, background: 'rgba(255,255,255,0.04)',
            border: `2px solid ${a(col, 0.3)}`, opacity: p, transform: `scale(${0.85 + p * 0.15})` }}>
            <Icon name={it.icon} size={72} color={col} />
            <div style={{ fontFamily: FONT.body, fontSize: 36, fontWeight: 700, color: C.white, textAlign: 'center' }}>{it.label}</div>
          </div>
        );
      })}
    </div>
  );
};

// ─── BENTO GRID — asymmetrisches Kachel-Raster, mehrere Content-Blöcke gleichzeitig ──
export const BentoGrid: React.FC<{
  items: { icon?: IconName; label: string; value?: string; sub?: string; colSpan?: number; rowSpan?: number; appear: number; color?: string }[];
  cols?: number; gap?: number; rowHeight?: number;
}> = ({ items, cols = 4, gap = 24, rowHeight = 160 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gridAutoRows: rowHeight, gap, width: '100%' }}>
      {items.map((it, i) => {
        const p = prog(f, it.appear, it.appear + 14, E.spring);
        const col = it.color ?? 'var(--accent)';
        return (
          <div key={i} style={{ gridColumn: `span ${it.colSpan ?? 1}`, gridRow: `span ${it.rowSpan ?? 1}`,
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            padding: 28, borderRadius: 26, background: `linear-gradient(160deg, ${a(col, 0.14)}, ${a(col, 0.04)})`,
            border: `2px solid ${a(col, 0.3)}`, opacity: p,
            transform: `scale(${0.9 + p * 0.1}) translateY(${lerpF(f, 24, 0, it.appear, it.appear + 14, E.spring)}px)` }}>
            {it.icon && <Icon name={it.icon} size={52} color={col} />}
            <div>
              {it.value && <div style={{ fontFamily: FONT.title, fontSize: 56, color: C.white, lineHeight: 1 }}>{it.value}</div>}
              <div style={{ fontFamily: FONT.body, fontSize: 28, fontWeight: 700, color: it.value ? C.gray : C.white }}>{it.label}</div>
              {it.sub && <div style={{ fontFamily: FONT.body, fontSize: 22, color: C.gray, marginTop: 4 }}>{it.sub}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
};

