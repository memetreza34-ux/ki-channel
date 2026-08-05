import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, E, a, prog, lerpF } from '../tokens';
import { FONT } from '../fonts';
import { Lucide } from './Lucide';

// ════════════════════════════════════════════════════════════════════════════
//  FINANCE EXTRAS — echte Lücken im Baustein-Katalog für Finanz-Content:
//  Portfolio-Dashboard, Einkommensquellen-Reihe, Ausgaben-Tracker.
//  Kein Duplikat bestehender Bausteine (Counter/Charts/Callouts existieren
//  schon) — nur die 3 Finanz-spezifischen Layouts, die fehlten.
// ════════════════════════════════════════════════════════════════════════════

const Glass: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ borderRadius: 24, background: a('#0B0F14', 0.55), border: `1px solid ${a(C.white, 0.1)}`,
    boxShadow: `0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 ${a(C.white, 0.06)}`,
    backdropFilter: 'blur(10px)', ...style }}>{children}</div>
);

// ─── PORTFOLIO DASHBOARD — Depotwert, Rendite, Asset-Allocation, Verlauf ──────
/** Zeigt Depotwert + Rendite als Hero-Zahl, darunter Allocation-Balken pro Asset. */
export const PortfolioDashboard: React.FC<{
  value: string; changePct: number; // z.B. +12.4 oder -3.1
  assets: { label: string; pct: number; color?: string }[]; // Summe idealerweise 100
  start: number; top?: number; width?: number;
}> = ({ value, changePct, assets, start, top = 0, width = 860 }) => {
  const f = useCurrentFrame();
  const cardP = prog(f, start, start + 16, E.spring);
  const positive = changePct >= 0;
  const changeColor = positive ? C.green : C.negativeLt;
  return (
    <div style={{ position: 'absolute', top, left: 0, width: '100%', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width, opacity: cardP, transform: `scale(${lerpF(f, 0.92, 1, start, start + 16, E.spring)})` }}>
        <Glass style={{ padding: '44px 48px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontFamily: FONT.body, fontSize: 22, color: C.gray, letterSpacing: 1,
              textTransform: 'uppercase' }}>Depotwert</span>
            <span style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 22, color: changeColor }}>
              {positive ? '▲' : '▼'} {Math.abs(changePct).toFixed(1).replace('.', ',')} %
            </span>
          </div>
          <div style={{ fontFamily: FONT.title, fontSize: 90, color: C.white,
            opacity: prog(f, start + 6, start + 26, E.out), marginTop: 4, marginBottom: 34 }}>{value}</div>
          {assets.map((asset, i) => {
            const rowAt = start + 20 + i * 8;
            const barColor = asset.color ?? 'var(--accent)';
            const barP = prog(f, rowAt, rowAt + 20, E.out);
            return (
              <div key={asset.label} style={{ marginBottom: i === assets.length - 1 ? 0 : 20,
                opacity: prog(f, rowAt, rowAt + 8, E.out) }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8,
                  fontFamily: FONT.body, fontSize: 22, color: C.white }}>
                  <span>{asset.label}</span>
                  <span style={{ color: C.gray }}>{asset.pct}%</span>
                </div>
                <div style={{ width: '100%', height: 12, borderRadius: 999, background: a(C.white, 0.08) }}>
                  <div style={{ width: `${asset.pct * barP}%`, height: '100%', borderRadius: 999,
                    background: barColor, boxShadow: `0 0 16px ${a(barColor, 0.6)}` }} />
                </div>
              </div>
            );
          })}
        </Glass>
      </div>
    </div>
  );
};

// ─── EINKOMMENSQUELLEN — Reihe aus Quelle+Betrag, keine harte Kategorie-Liste ──
/** Reihe von Einkommensquellen (Gehalt, Freelance, Dividenden, …) — Inhalt komplett per Props. */
export const IncomeSources: React.FC<{
  sources: { label: string; icon: string; amount: string; color?: string }[];
  start: number; top?: number; perItemDelay?: number; cols?: number;
}> = ({ sources, start, top = 0, perItemDelay = 8, cols = 3 }) => {
  const f = useCurrentFrame();
  const colWidth = Math.floor(900 / cols);
  return (
    <div style={{ position: 'absolute', top, left: 90, width: 900, display: 'flex', flexWrap: 'wrap',
      gap: 20 }}>
      {sources.map((s, i) => {
        const at = start + i * perItemDelay;
        const p = prog(f, at, at + 14, E.spring);
        const color = s.color ?? 'var(--accent)';
        return (
          <div key={s.label} style={{ width: colWidth - 20, opacity: p,
            transform: `translateY(${lerpF(f, 24, 0, at, at + 14, E.spring)}px) scale(${0.9 + p * 0.1})` }}>
            <div style={{ borderRadius: 18, padding: '24px 22px', background: a(color, 0.1),
              border: `1px solid ${a(color, 0.35)}`, textAlign: 'center' }}>
              <Lucide name={s.icon} size={44} color={color} />
              <div style={{ fontFamily: FONT.body, fontSize: 20, color: C.gray, marginTop: 12 }}>{s.label}</div>
              <div style={{ fontFamily: FONT.title, fontSize: 32, color: C.white, marginTop: 4 }}>{s.amount}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── AUSGABEN-TRACKER — Kategorien als horizontale Balken, sortiert nach Betrag ─
/** Ausgaben-Kategorien (Miete, Essen, Auto, …) als wachsende Balken — Inhalt per Props. */
export const ExpenseTracker: React.FC<{
  categories: { label: string; amount: number; icon?: string; color?: string }[];
  total: string; start: number; top?: number; width?: number;
}> = ({ categories, total, start, top = 0, width = 900 }) => {
  const f = useCurrentFrame();
  const max = Math.max(...categories.map((c) => c.amount));
  const headP = prog(f, start, start + 12, E.out);
  return (
    <div style={{ position: 'absolute', top, left: 0, width: '100%', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          marginBottom: 30, opacity: headP }}>
          <span style={{ fontFamily: FONT.body, fontSize: 22, color: C.gray, letterSpacing: 1,
            textTransform: 'uppercase' }}>Ausgaben gesamt</span>
          <span style={{ fontFamily: FONT.title, fontSize: 44, color: C.negativeLt }}>{total}</span>
        </div>
        {categories
          .slice()
          .sort((x, y) => y.amount - x.amount)
          .map((cat, i) => {
            const at = start + 14 + i * 8;
            const barP = prog(f, at, at + 22, E.out);
            const color = cat.color ?? C.negativeLt;
            const widthPct = (cat.amount / max) * 100;
            return (
              <div key={cat.label} style={{ marginBottom: 22, opacity: prog(f, at, at + 6, E.out) }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  {cat.icon && <Lucide name={cat.icon} size={24} color={color} />}
                  <span style={{ fontFamily: FONT.body, fontSize: 22, color: C.white, flex: 1 }}>{cat.label}</span>
                  <span style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 22, color: C.gray }}>
                    {cat.amount.toLocaleString('de-DE')} €
                  </span>
                </div>
                <div style={{ width: '100%', height: 14, borderRadius: 999, background: a(C.white, 0.07) }}>
                  <div style={{ width: `${widthPct * barP}%`, height: '100%', borderRadius: 999,
                    background: color, boxShadow: `0 0 14px ${a(color, 0.5)}` }} />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
