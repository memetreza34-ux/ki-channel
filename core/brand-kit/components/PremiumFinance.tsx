import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, E, a, prog, lerpF } from '../tokens';
import { FONT } from '../fonts';
import { Lucide } from './Lucide';
import { PremiumIcon } from './PremiumIcon';

// ════════════════════════════════════════════════════════════════════════════
//  PREMIUM-FINANZ-BAUSTEINE — aus rohen Community-Vorlagen (RVE/locomotion)
//  komplett neu gebaut: Theme-Farben (var(--accent)), Bebas Neue/Inter,
//  Glasrahmen + Glow statt flacher Karten. Kein Standard-Look.
// ════════════════════════════════════════════════════════════════════════════

const Glass: React.FC<{
  children: React.ReactNode; style?: React.CSSProperties; glow?: boolean; border?: string;
}> = ({ children, style, glow = true, border }) => (
  <div style={{
    borderRadius: 28,
    background: a('var(--accent)', 0.08),
    border: `2px solid ${border ?? a('var(--accent)', 0.4)}`,
    boxShadow: glow ? `0 0 50px ${a('var(--accent)', 0.16)}` : undefined,
    ...style,
  }}>{children}</div>
);

// ─── TICKER — Kurse/ETFs mit Kurs + Veränderung, glasige Zeilen ──────────────
export type TickerItem = { symbol: string; name: string; price: number; change: number };
export const Ticker: React.FC<{
  items: TickerItem[]; start: number; top: number; left?: number; width?: number; perItem?: number;
}> = ({ items, start, top, left = 90, width = 900, perItem = 10 }) => (
  <div style={{ position: 'absolute', top, left, width }}>
    {items.map((it, i) => {
      const at = start + i * perItem;
      const Row: React.FC = () => {
        const f = useCurrentFrame();
        const p = prog(f, at, at + 14, E.spring);
        const tx = lerpF(f, 40, 0, at, at + 16, E.spring);
        const up = it.change >= 0;
        return (
          <div style={{
            opacity: p, transform: `translateX(${tx}px)`, display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', padding: '22px 30px', marginBottom: 14,
            borderRadius: 20, background: a(C.white, 0.04), border: `1.5px solid ${a(C.white, 0.1)}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: a('var(--accent)', 0.14),
                border: `1.5px solid ${a('var(--accent)', 0.4)}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: FONT.title, fontSize: 20, color: 'var(--accent)' }}>{it.symbol.slice(0, 2)}</div>
              <div>
                <div style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 30, color: C.white }}>{it.symbol}</div>
                <div style={{ fontFamily: FONT.body, fontSize: 22, color: C.gray }}>{it.name}</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: FONT.title, fontSize: 34, color: C.white }}>{it.price.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end',
                fontFamily: FONT.body, fontWeight: 800, fontSize: 24, color: up ? 'var(--accent)' : C.negative }}>
                <Lucide name={up ? 'trending-up' : 'trending-down'} size={22} color={up ? C.accent : C.negative} />
                {up ? '+' : ''}{it.change.toFixed(1)}%
              </div>
            </div>
          </div>
        );
      };
      return <Row key={it.symbol} />;
    })}
  </div>
);

// ─── RANKEDLIST — nummerierte Rangliste (z. B. Top-ETFs nach Rendite) ────────
export type RankItem = { label: string; sub?: string; value: string };
export const RankedList: React.FC<{
  items: RankItem[]; start: number; top: number; left?: number; width?: number; perItem?: number;
}> = ({ items, start, top, left = 90, width = 900, perItem = 9 }) => (
  <div style={{ position: 'absolute', top, left, width }}>
    {items.map((it, i) => {
      const at = start + i * perItem;
      const isFirst = i === 0;
      const Row: React.FC = () => {
        const f = useCurrentFrame();
        const p = prog(f, at, at + 14, E.spring);
        const tx = lerpF(f, -40, 0, at, at + 16, E.spring);
        return (
          <div style={{
            opacity: p, transform: `translateX(${tx}px)`, display: 'flex', alignItems: 'center', gap: 24,
            padding: '20px 28px', marginBottom: 12, borderRadius: 20,
            background: isFirst ? a('var(--accent)', 0.12) : a(C.white, 0.04),
            border: `1.5px solid ${isFirst ? a('var(--accent)', 0.55) : a(C.white, 0.1)}`,
            boxShadow: isFirst ? `0 0 34px ${a('var(--accent)', 0.22)}` : undefined,
          }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, flexShrink: 0,
              background: isFirst ? 'var(--accent)' : a(C.white, 0.08),
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: FONT.title, fontSize: 24, color: isFirst ? C.bgDeep : C.gray }}>{i + 1}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 30, color: C.white }}>{it.label}</div>
              {it.sub && <div style={{ fontFamily: FONT.body, fontSize: 21, color: C.gray }}>{it.sub}</div>}
            </div>
            <div style={{ fontFamily: FONT.title, fontSize: 34,
              color: isFirst ? 'var(--accent)' : C.white }}>{it.value}</div>
          </div>
        );
      };
      return <Row key={it.label} />;
    })}
  </div>
);

// ─── COMPARESPLIT — Vorher/Nachher oder A/B nebeneinander, volle Breite ──────
export const ChecklistCompare: React.FC<{
  leftTitle: string; rightTitle: string; leftItems: string[]; rightItems: string[];
  start: number; top: number; width?: number;
}> = ({ leftTitle, rightTitle, leftItems, rightItems, start, top, width = 1740 }) => {
  const f = useCurrentFrame();
  const colW = (width - 120) / 2;
  const leftP = prog(f, start, start + 16, E.spring);
  const rightP = prog(f, start + 12, start + 28, E.spring);
  const arrowP = prog(f, start + 20, start + 34, E.spring);
  const Col: React.FC<{ x: number; title: string; items: string[]; positive: boolean; p: number; dir: number }> = ({
    x, title, items, positive, p, dir,
  }) => (
    <div style={{ position: 'absolute', top, left: x, width: colW, opacity: p,
      transform: `translateX(${lerpF(f, dir * 50, 0, start, start + 20, E.spring)}px)` }}>
      <Glass style={{ padding: '38px 42px' }} border={positive ? a('var(--accent)', 0.55) : a(C.negative, 0.4)} glow={positive}>
        <div style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 26, letterSpacing: 2, textTransform: 'uppercase',
          color: positive ? 'var(--accent)' : C.negative, marginBottom: 24 }}>{title}</div>
        {items.map((it, i) => {
          const itAt = start + (positive ? 24 : 8) + i * 8;
          const itP = prog(f, itAt, itAt + 12, E.out);
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 0',
              opacity: itP, transform: `translateX(${lerpF(f, -14, 0, itAt, itAt + 12, E.out)}px)` }}>
              <Lucide name={positive ? 'circle-check-big' : 'circle-x'} size={28} color={positive ? 'var(--accent)' : C.negative} />
              <span style={{ fontFamily: FONT.body, fontSize: 26, color: positive ? C.white : C.gray }}>{it}</span>
            </div>
          );
        })}
      </Glass>
    </div>
  );
  return (
    <>
      <Col x={0} title={leftTitle} items={leftItems} positive={false} p={leftP} dir={-1} />
      <div style={{ position: 'absolute', top: top + 140, left: width / 2 - 40, opacity: arrowP,
        transform: `scale(${arrowP})` }}>
        <Lucide name="arrow-right" size={80} color={C.white} />
      </div>
      <Col x={colW + 120} title={rightTitle} items={rightItems} positive p={rightP} dir={1} />
    </>
  );
};

// ─── INVESTORQUOTE — großes Zitat, Glaskarte, Autor ──────────────────────────
export const InvestorQuote: React.FC<{
  quote: string; author: string; role: string; start: number; top: number; width?: number;
}> = ({ quote, author, role, start, top, width = 900 }) => {
  const f = useCurrentFrame();
  const cardP = prog(f, start, start + 16, E.spring);
  const quoteP = prog(f, start + 10, start + 26, E.out);
  const authorP = prog(f, start + 24, start + 38, E.out);
  return (
    <div style={{ position: 'absolute', top, left: 0, width: '100%', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width, opacity: cardP, transform: `translateY(${lerpF(f, 26, 0, start, start + 18, E.spring)}px)` }}>
        <Glass style={{ padding: '54px 64px' }}>
          <div style={{ fontFamily: FONT.title, fontSize: 100, color: 'var(--accent)', lineHeight: 0.5,
            opacity: 0.7, marginBottom: 8 }}>&ldquo;</div>
          <div style={{ fontFamily: FONT.body, fontSize: 40, fontWeight: 600, color: C.white, lineHeight: 1.4,
            opacity: quoteP, transform: `translateY(${lerpF(f, 12, 0, start + 10, start + 26, E.out)}px)` }}>{quote}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 34, opacity: authorP }}>
            <div style={{ width: 60, height: 60, borderRadius: 999, background: a('var(--accent)', 0.18),
              border: `2px solid ${a('var(--accent)', 0.5)}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lucide name="user-round" size={30} />
            </div>
            <div>
              <div style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 26, color: C.white }}>{author}</div>
              <div style={{ fontFamily: FONT.body, fontSize: 21, color: C.gray }}>{role}</div>
            </div>
          </div>
        </Glass>
      </div>
    </div>
  );
};

// ─── PREMIUMOUTRO — Abspann mit Glow-Rahmen, Subscribe-Pille, Kanalname ──────
export const PremiumOutro: React.FC<{
  headline: string; sub?: string; handle: string; start: number;
}> = ({ headline, sub, handle, start }) => {
  const f = useCurrentFrame();
  const scale = lerpF(f, 0.85, 1, start, start + 22, E.spring);
  const p = prog(f, start, start + 20, E.out);
  const glow = 0.22 + Math.sin(f * 0.08) * 0.1;
  const btnP = prog(f, start + 18, start + 34, E.spring);
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ opacity: p, transform: `scale(${scale})`, display: 'flex', flexDirection: 'column',
        alignItems: 'center', padding: '64px 90px', borderRadius: 32,
        border: `2px solid ${a('var(--accent)', glow)}`, boxShadow: `0 0 70px ${a('var(--accent)', glow * 0.6)}`,
        background: a('var(--accent)', 0.06) }}>
        <div style={{ fontFamily: FONT.title, fontSize: 76, color: C.white, textAlign: 'center', lineHeight: 1.05 }}>{headline}</div>
        {sub && <div style={{ fontFamily: FONT.body, fontSize: 28, color: C.gray, marginTop: 16 }}>{sub}</div>}
        <div style={{ opacity: btnP, transform: `scale(${btnP})`, marginTop: 40, padding: '18px 44px', borderRadius: 999,
          background: a('var(--accent)', 0.16), border: `2px solid ${a('var(--accent)', 0.6)}`,
          display: 'flex', alignItems: 'center', gap: 12 }}>
          <Lucide name="play" size={26} color="var(--accent)" />
          <span style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 30, color: 'var(--accent)', letterSpacing: 1 }}>
            Folgen für {handle}
          </span>
        </div>
      </div>
    </div>
  );
};

// ─── MILESTONES — horizontale Zeitleiste (z. B. Vermögensaufbau über Jahre) ──
export type Milestone = { label: string; value: string };
export const Milestones: React.FC<{
  items: Milestone[]; start: number; top: number; width?: number; textColor?: string; labelColor?: string;
}> = ({ items, start, top, width = 1700, textColor = C.white, labelColor = C.gray }) => {
  const f = useCurrentFrame();
  const lineP = prog(f, start, start + 40, E.inOut);
  const step = width / (items.length - 1 || 1);
  return (
    <div style={{ position: 'absolute', top, left: `calc(50% - ${width / 2}px)`, width, height: 200 }}>
      <div style={{ position: 'absolute', top: 40, left: 0, width, height: 3, background: a(C.white, 0.15) }} />
      <div style={{ position: 'absolute', top: 40, left: 0, height: 3, width: width * lineP,
        background: 'var(--accent)', boxShadow: `0 0 16px ${a('var(--accent)', 0.6)}` }} />
      {items.map((it, i) => {
        const at = start + i * 12;
        const p = prog(f, at, at + 14, E.spring);
        const reached = lineP >= i / (items.length - 1 || 1);
        return (
          <div key={i} style={{ position: 'absolute', top: 0, left: i * step - 60, width: 120,
            textAlign: 'center', opacity: p, transform: `translateY(${lerpF(f, 20, 0, at, at + 14, E.spring)}px)` }}>
            <div style={{ width: 24, height: 24, borderRadius: 999, margin: '28px auto 0',
              background: reached ? 'var(--accent)' : C.bgDeep,
              border: `3px solid ${reached ? 'var(--accent)' : a(C.white, 0.3)}`,
              boxShadow: reached ? `0 0 16px ${a('var(--accent)', 0.7)}` : undefined }} />
            <div style={{ fontFamily: FONT.title, fontSize: 32, color: textColor, marginTop: 16 }}>{it.value}</div>
            <div style={{ fontFamily: FONT.body, fontSize: 20, color: labelColor, marginTop: 2 }}>{it.label}</div>
          </div>
        );
      })}
    </div>
  );
};

// ─── STEPLIST — nummerierte Schritte (z. B. "So startest du") ────────────────
export type Step = { title: string; sub?: string };
export const StepList: React.FC<{
  items: Step[]; start: number; top: number; left?: number; width?: number; perItem?: number;
}> = ({ items, start, top, left = 90, width = 900, perItem = 12 }) => (
  <div style={{ position: 'absolute', top, left, width }}>
    {items.map((it, i) => {
      const at = start + i * perItem;
      const Row: React.FC = () => {
        const f = useCurrentFrame();
        const p = prog(f, at, at + 16, E.spring);
        const tx = lerpF(f, 50, 0, at, at + 18, E.spring);
        return (
          <div style={{ opacity: p, transform: `translateX(${tx}px)`, display: 'flex', alignItems: 'center',
            gap: 28, marginBottom: 22 }}>
            <div style={{ width: 64, height: 64, borderRadius: 20, flexShrink: 0, display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontSize: 32,
              color: 'var(--accent)', background: a('var(--accent)', 0.12), border: `2px solid ${a('var(--accent)', 0.5)}` }}>
              {i + 1}
            </div>
            <div>
              <div style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 32, color: C.white }}>{it.title}</div>
              {it.sub && <div style={{ fontFamily: FONT.body, fontSize: 22, color: C.gray, marginTop: 2 }}>{it.sub}</div>}
            </div>
          </div>
        );
      };
      return <Row key={it.title} />;
    })}
  </div>
);

// ─── TITLECARD — große Aussage, ein Wort/Teil hervorgehoben ──────────────────
export const TitleCard: React.FC<{
  lines: string[]; highlight: string; start: number; top: number;
}> = ({ lines, highlight, start, top }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: 'absolute', top, left: 0, width: '100%', textAlign: 'center' }}>
      {lines.map((line, i) => {
        const at = start + i * 8;
        const p = prog(f, at, at + 16, E.spring);
        const isHi = line.includes(highlight);
        return (
          <div key={i} style={{ opacity: p, transform: `translateY(${lerpF(f, 26, 0, at, at + 16, E.spring)}px)`,
            fontFamily: FONT.title, fontSize: 96, lineHeight: 1.08, color: C.white }}>
            {isHi ? line.split(highlight).map((part, j, arr) => (
              <React.Fragment key={j}>
                {part}
                {j < arr.length - 1 && (
                  <span style={{ color: 'var(--accent)', textShadow: `0 0 40px ${a('var(--accent)', 0.6)}` }}>{highlight}</span>
                )}
              </React.Fragment>
            )) : line}
          </div>
        );
      })}
    </div>
  );
};

// ─── LOWERTHIRD — Namens-/Themen-Einblendung unten links ─────────────────────
export const LowerThird: React.FC<{ title: string; sub?: string; at: number; bottom?: number }> = ({
  title, sub, at, bottom = 140,
}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 16, E.spring);
  const w = lerpF(f, 0, 1, at, at + 20, E.out);
  return (
    <div style={{ position: 'absolute', bottom, left: 90, opacity: p,
      transform: `translateX(${lerpF(f, -40, 0, at, at + 16, E.spring)}px)` }}>
      <div style={{ display: 'flex', alignItems: 'stretch', height: 84, borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ width: 8, background: 'var(--accent)' }} />
        <div style={{ background: a(C.bgDeep, 0.85), backdropFilter: 'blur(8px)', padding: '14px 30px',
          borderTop: `1px solid ${a(C.white, 0.12)}`, borderBottom: `1px solid ${a(C.white, 0.12)}`,
          borderRight: `1px solid ${a(C.white, 0.12)}` }}>
          <div style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 28, color: C.white, overflow: 'hidden',
            width: `${w * 100}%`, whiteSpace: 'nowrap' }}>{title}</div>
          {sub && <div style={{ fontFamily: FONT.body, fontSize: 20, color: 'var(--accent)', marginTop: 2 }}>{sub}</div>}
        </div>
      </div>
    </div>
  );
};

// ─── ALERTNOTICE — Warnhinweis-Popup (z. B. Risiko-Disclaimer, Achtung) ──────
export const AlertNotice: React.FC<{
  text: string; at: number; top: number; kind?: 'warn' | 'info'; width?: number;
}> = ({ text, at, top, kind = 'warn', width = 800 }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 14, E.spring);
  const scale = lerpF(f, 0.9, 1, at, at + 16, E.spring);
  const col = kind === 'warn' ? C.negative : C.blue;
  return (
    <div style={{ position: 'absolute', top, left: 0, width: '100%', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width, opacity: p, transform: `scale(${scale})`, display: 'flex', alignItems: 'center', gap: 20,
        padding: '26px 34px', borderRadius: 22, background: a(col, 0.12), border: `2px solid ${a(col, 0.5)}`,
        boxShadow: `0 0 40px ${a(col, 0.2)}` }}>
        <Lucide name={kind === 'warn' ? 'triangle-alert' : 'info'} size={40} color={col} />
        <span style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 28, color: C.white, lineHeight: 1.35 }}>{text}</span>
      </div>
    </div>
  );
};

// ─── GOALRING — Kreis-Fortschritt fürs Sparziel, mit Prozent in der Mitte ────
export const GoalRing: React.FC<{
  value: number; label: string; start: number; end: number; cx: number; cy: number; radius?: number;
}> = ({ value, label, start, end, cx, cy, radius = 160 }) => {
  const f = useCurrentFrame();
  const p = prog(f, start, end, E.out);
  const v = value * p;
  const circ = 2 * Math.PI * radius;
  const offset = circ * (1 - v / 100);
  return (
    <svg width={cx * 2} height={cy * 2 + radius + 100} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
      <circle cx={cx} cy={cy} r={radius} fill="none" stroke={a(C.white, 0.1)} strokeWidth={22} />
      <circle cx={cx} cy={cy} r={radius} fill="none" stroke="var(--accent)" strokeWidth={22} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset} transform={`rotate(-90 ${cx} ${cy})`}
        style={{ filter: `drop-shadow(0 0 14px ${a('var(--accent)', 0.6)})` }} />
      <text x={cx} y={cy - 10} textAnchor="middle" fill={C.white} fontFamily={FONT.title} fontSize={70}>{Math.round(v)}%</text>
      <text x={cx} y={cy + 34} textAnchor="middle" fill={C.gray} fontFamily={FONT.body} fontSize={26}>{label}</text>
    </svg>
  );
};

// ─── PLANCOMPARE — Preis-/Broker-Vergleich (Karten nebeneinander, 1 hervorgehoben) ─
export type Plan = { name: string; price: string; features: string[]; highlighted?: boolean };
// ─── ACHIEVEMENTBADGE — Meilenstein-Pokal mit Fortschrittsbalken + Belohnung ─
export const AchievementBadge: React.FC<{
  title: string; subtitle?: string; reward?: string; at: number; top: number;
}> = ({ title, subtitle = 'Meilenstein erreicht', reward, at, top }) => {
  const f = useCurrentFrame();
  const iconP = prog(f, at, at + 16, E.spring);
  const textP = prog(f, at + 6, at + 20, E.out);
  const barP = prog(f, at + 14, at + 44, E.out);
  const rewardP = prog(f, at + 30, at + 44, E.out);
  return (
    <div style={{ position: 'absolute', top, left: 0, width: '100%', textAlign: 'center' }}>
      <div style={{ transform: `scale(${iconP})`, display: 'inline-block' }}>
        <div style={{ width: 100, height: 100, borderRadius: 999, background: a('var(--accent)', 0.14),
          border: `3px solid var(--accent)`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 40px ${a('var(--accent)', 0.4)}` }}>
          <Lucide name="trophy" size={50} />
        </div>
      </div>
      <div style={{ opacity: textP, marginTop: 20, fontFamily: FONT.body, fontWeight: 700, fontSize: 22,
        color: C.gray, textTransform: 'uppercase', letterSpacing: 2 }}>{subtitle}</div>
      <div style={{ opacity: textP, fontFamily: FONT.title, fontSize: 56, color: C.white, marginTop: 6 }}>{title}</div>
      <div style={{ width: 340, height: 8, borderRadius: 4, background: a(C.white, 0.1), margin: '22px auto 0', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${barP * 100}%`, background: 'var(--accent)', borderRadius: 4,
          boxShadow: `0 0 12px ${a('var(--accent)', 0.6)}` }} />
      </div>
      {reward && <div style={{ opacity: rewardP, marginTop: 14, fontFamily: FONT.body, fontWeight: 700, fontSize: 24,
        color: 'var(--accent)' }}>{reward}</div>}
    </div>
  );
};

// ─── SCORERING — Ergebnis-Ring mit Prozent + Verdikt (z. B. Anlegertyp-Test) ─
export const ScoreRing: React.FC<{
  score: number; verdict: string; sub?: string; start: number; end: number; cx: number; cy: number; radius?: number;
}> = ({ score, verdict, sub, start, end, cx, cy, radius = 150 }) => {
  const f = useCurrentFrame();
  const p = prog(f, start, end, E.out);
  const v = score * p;
  const circ = 2 * Math.PI * radius;
  const verdictP = prog(f, end - 10, end + 6, E.spring);
  return (
    <div style={{ position: 'absolute', left: cx - radius - 20, top: cy - radius - 20 }}>
      <svg width={(radius + 20) * 2} height={(radius + 20) * 2} style={{ overflow: 'visible' }}>
        <circle cx={radius + 20} cy={radius + 20} r={radius} fill="none" stroke={a(C.white, 0.1)} strokeWidth={20} />
        <circle cx={radius + 20} cy={radius + 20} r={radius} fill="none" stroke="var(--accent)" strokeWidth={20}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - v / 100)}
          transform={`rotate(-90 ${radius + 20} ${radius + 20})`}
          style={{ filter: `drop-shadow(0 0 16px ${a('var(--accent)', 0.6)})` }} />
        <text x={radius + 20} y={radius + 4} textAnchor="middle" fill={C.white} fontFamily={FONT.title} fontSize={64}>{Math.round(v)}%</text>
      </svg>
      <div style={{ textAlign: 'center', marginTop: 18, opacity: verdictP,
        transform: `translateY(${lerpF(f, 14, 0, end - 10, end + 6, E.spring)}px)` }}>
        <div style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 30, color: 'var(--accent)' }}>{verdict}</div>
        {sub && <div style={{ fontFamily: FONT.body, fontSize: 20, color: C.gray, marginTop: 4 }}>{sub}</div>}
      </div>
    </div>
  );
};

// ─── PROCESSFLOW — horizontale, verbundene Schritt-Kette (aktiv leuchtet auf) ─
export type FlowStep = { num: string; label: string };
export const ProcessFlow: React.FC<{ steps: FlowStep[]; start: number; top: number; perStep?: number }> = ({
  steps, start, top, perStep = 20,
}) => {
  const f = useCurrentFrame();
  const totalW = steps.length * 220;
  return (
    <div style={{ position: 'absolute', top, left: `calc(50% - ${totalW / 2}px)`, display: 'flex', alignItems: 'center' }}>
      {steps.map((step, i) => {
        const at = start + i * perStep;
        const p = prog(f, at, at + 14, E.spring);
        const active = f > at + 10;
        return (
          <React.Fragment key={step.num}>
            <div style={{ width: 160, opacity: p, transform: `scale(${lerpF(f, 0.85, 1, at, at + 14, E.spring)})`,
              textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: 999, margin: '0 auto 12px',
                background: active ? 'var(--accent)' : a(C.white, 0.06),
                border: active ? 'none' : `2px solid ${a(C.white, 0.2)}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: FONT.title, fontSize: 26, color: active ? C.bgDeep : C.gray,
                boxShadow: active ? `0 0 24px ${a('var(--accent)', 0.5)}` : undefined }}>{step.num}</div>
              <div style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 22,
                color: active ? C.white : C.gray }}>{step.label}</div>
            </div>
            {i < steps.length - 1 && (
              <div style={{ width: 60, height: 3, background: f > at + 14 ? 'var(--accent)' : a(C.white, 0.15),
                marginBottom: 40 }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ─── FEATUREHIGHLIGHT — Icon+Titel+Text-Karten nebeneinander ────────────────
export type Feature = { icon: string; title: string; desc: string };
export const FeatureHighlight: React.FC<{ features: Feature[]; start: number; top: number }> = ({
  features, start, top,
}) => {
  const f = useCurrentFrame();
  const colW = 340, gap = 30;
  const totalW = features.length * colW + (features.length - 1) * gap;
  return (
    <div style={{ position: 'absolute', top, left: `calc(50% - ${totalW / 2}px)`, display: 'flex', gap }}>
      {features.map((feat, i) => {
        const at = start + i * 10;
        const p = prog(f, at, at + 16, E.spring);
        return (
          <div key={feat.title} style={{ width: colW, opacity: p,
            transform: `translateY(${lerpF(f, 26, 0, at, at + 16, E.spring)}px)` }}>
            <Glass style={{ padding: '32px 30px' }}>
              <div style={{ width: 60, height: 60, borderRadius: 16, background: a('var(--accent)', 0.14),
                border: `2px solid ${a('var(--accent)', 0.4)}`, display: 'flex', alignItems: 'center',
                justifyContent: 'center', marginBottom: 18 }}>
                <Lucide name={feat.icon} size={30} />
              </div>
              <div style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 26, color: C.white, marginBottom: 8 }}>{feat.title}</div>
              <div style={{ fontFamily: FONT.body, fontSize: 20, color: C.gray, lineHeight: 1.4 }}>{feat.desc}</div>
            </Glass>
          </div>
        );
      })}
    </div>
  );
};

// ─── PROFILEBADGE — Avatar+Name+Rolle+Statistik-Karte (z. B. Experten-Tipp) ─
export const ProfileBadge: React.FC<{
  name: string; role: string; stats: { value: string; label: string }[]; start: number; top: number; width?: number;
}> = ({ name, role, stats, start, top, width = 640 }) => {
  const f = useCurrentFrame();
  const cardP = prog(f, start, start + 16, E.spring);
  const avatarP = prog(f, start + 4, start + 20, E.spring);
  const initial = name.charAt(0);
  return (
    <div style={{ position: 'absolute', top, left: 0, width: '100%', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width, opacity: cardP, transform: `scale(${lerpF(f, 0.92, 1, start, start + 16, E.spring)})` }}>
        <Glass style={{ padding: '44px 50px', textAlign: 'center' }}>
          <div style={{ width: 90, height: 90, borderRadius: 999, margin: '0 auto 20px',
            background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: FONT.title, fontSize: 40, color: C.bgDeep, transform: `scale(${avatarP})`,
            boxShadow: `0 0 30px ${a('var(--accent)', 0.4)}` }}>{initial}</div>
          <div style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 32, color: C.white }}>{name}</div>
          <div style={{ fontFamily: FONT.body, fontSize: 22, color: C.gray, marginTop: 4 }}>{role}</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginTop: 30,
            paddingTop: 26, borderTop: `1px solid ${a(C.white, 0.1)}` }}>
            {stats.map((s, i) => {
              const at = start + 24 + i * 6;
              const sp = prog(f, at, at + 14, E.spring);
              return (
                <div key={s.label} style={{ opacity: sp, transform: `translateY(${lerpF(f, 10, 0, at, at + 14, E.spring)}px)` }}>
                  <div style={{ fontFamily: FONT.title, fontSize: 32, color: 'var(--accent)' }}>{s.value}</div>
                  <div style={{ fontFamily: FONT.body, fontSize: 18, color: C.gray }}>{s.label}</div>
                </div>
              );
            })}
          </div>
        </Glass>
      </div>
    </div>
  );
};

// ─── TASKCHECKLIST — Aufgaben-Liste mit Metrik-Kopf, hakt sich nacheinander ab ─
export const TaskChecklist: React.FC<{
  title: string; metric: string; metricValue: string; tasks: string[]; start: number; top: number; width?: number;
}> = ({ title, metric, metricValue, tasks, start, top, width = 820 }) => {
  const f = useCurrentFrame();
  const headP = prog(f, start, start + 16, E.spring);
  return (
    <div style={{ position: 'absolute', top, left: 0, width: '100%', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width, opacity: headP }}>
        <Glass style={{ padding: '40px 44px' }}>
          <div style={{ fontFamily: FONT.title, fontSize: 40, color: C.white, marginBottom: 20 }}>{title}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px',
            borderRadius: 16, background: a(C.white, 0.04), marginBottom: 22 }}>
            <span style={{ fontFamily: FONT.body, fontSize: 22, color: C.gray }}>{metric}</span>
            <span style={{ fontFamily: FONT.title, fontSize: 32, color: 'var(--accent)' }}>{metricValue}</span>
          </div>
          {tasks.map((task, i) => {
            const at = start + 12 + i * 10;
            const p = prog(f, at, at + 12, E.out);
            const checked = f > at + 8;
            return (
              <div key={task} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '13px 0',
                opacity: p, transform: `translateX(${lerpF(f, -14, 0, at, at + 12, E.out)}px)`,
                borderBottom: i < tasks.length - 1 ? `1px solid ${a(C.white, 0.06)}` : 'none' }}>
                <Lucide name={checked ? 'circle-check-big' : 'circle'} size={24} color={checked ? 'var(--accent)' : C.gray} />
                <span style={{ fontFamily: FONT.body, fontSize: 24, color: checked ? C.white : C.gray,
                  textDecoration: checked && f > at + 16 ? 'line-through' : 'none', opacity: checked && f > at + 16 ? 0.6 : 1 }}>{task}</span>
              </div>
            );
          })}
        </Glass>
      </div>
    </div>
  );
};

// ─── REVENUECARD — große Kennzahl + 3-Spalten-Statistik-Fußzeile ────────────
export const RevenueCard: React.FC<{
  label: string; value: string; sub: string; cols: { value: string; label: string; positive?: boolean }[];
  start: number; top: number; width?: number;
}> = ({ label, value, sub, cols, start, top, width = 640 }) => {
  const f = useCurrentFrame();
  const cardP = prog(f, start, start + 16, E.spring);
  const valP = prog(f, start + 8, start + 28, E.out);
  return (
    <div style={{ position: 'absolute', top, left: 0, width: '100%', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width, opacity: cardP, transform: `scale(${lerpF(f, 0.92, 1, start, start + 16, E.spring)})` }}>
        <Glass style={{ padding: '40px 46px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: FONT.body, fontSize: 22, color: C.gray }}>{label}</span>
            <span style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 16, color: 'var(--accent)',
              background: a('var(--accent)', 0.14), padding: '5px 14px', borderRadius: 999, letterSpacing: 1 }}>LIVE</span>
          </div>
          <div style={{ fontFamily: FONT.title, fontSize: 76, color: C.white, opacity: valP, marginTop: 6 }}>{value}</div>
          <div style={{ fontFamily: FONT.body, fontSize: 20, color: C.gray, marginBottom: 26 }}>{sub}</div>
          <div style={{ display: 'flex', borderTop: `1px solid ${a(C.white, 0.1)}`, paddingTop: 24 }}>
            {cols.map((col, i) => {
              const at = start + 26 + i * 6;
              const p = prog(f, at, at + 14, E.spring);
              return (
                <div key={col.label} style={{ flex: 1, opacity: p, borderLeft: i > 0 ? `1px solid ${a(C.white, 0.1)}` : 'none',
                  paddingLeft: i > 0 ? 24 : 0 }}>
                  <div style={{ fontFamily: FONT.title, fontSize: 30,
                    color: col.positive ? 'var(--accent)' : C.white }}>{col.value}</div>
                  <div style={{ fontFamily: FONT.body, fontSize: 17, color: C.gray }}>{col.label}</div>
                </div>
              );
            })}
          </div>
        </Glass>
      </div>
    </div>
  );
};

// ─── CONCEPTEXPLAINER — Eyebrow + Titel + Aufzählung (Konzept erklären) ─────
export const ConceptExplainer: React.FC<{
  eyebrow: string; title: string; bullets: string[]; start: number; top: number; width?: number;
}> = ({ eyebrow, title, bullets, start, top, width = 820 }) => {
  const f = useCurrentFrame();
  const titleP = prog(f, start, start + 16, E.out);
  return (
    <div style={{ position: 'absolute', top, left: `calc(50% - ${width / 2}px)`, width }}>
      <div style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 22, color: 'var(--accent)',
        textTransform: 'uppercase', letterSpacing: 3, opacity: titleP, marginBottom: 10 }}>{eyebrow}</div>
      <div style={{ fontFamily: FONT.title, fontSize: 64, color: C.white, opacity: titleP,
        transform: `translateY(${lerpF(f, 16, 0, start, start + 16, E.out)}px)`, marginBottom: 30 }}>{title}</div>
      {bullets.map((b, i) => {
        const at = start + 18 + i * 14;
        const p = prog(f, at, at + 14, E.out);
        return (
          <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '12px 0',
            opacity: p, transform: `translateY(${lerpF(f, 10, 0, at, at + 14, E.out)}px)` }}>
            <div style={{ width: 10, height: 10, borderRadius: 999, background: 'var(--accent)', flexShrink: 0,
              boxShadow: `0 0 10px ${a('var(--accent)', 0.6)}` }} />
            <span style={{ fontFamily: FONT.body, fontSize: 28, color: C.white }}>{b}</span>
          </div>
        );
      })}
    </div>
  );
};

// ─── COMPARISONBARS — zwei Balken nebeneinander mit Werten (schneller Vergleich) ─
export const ComparisonBars: React.FC<{
  a: { label: string; value: number; display: string }; b: { label: string; value: number; display: string };
  start: number; top: number; maxHeight?: number;
}> = ({ a: barA, b: barB, start, top, maxHeight = 380 }) => {
  const f = useCurrentFrame();
  const max = Math.max(barA.value, barB.value);
  const Bar: React.FC<{ item: typeof barA; x: number; positive: boolean; delay: number }> = ({ item, x, positive, delay }) => {
    const p = prog(f, start + delay, start + delay + 30, E.out);
    const h = (item.value / max) * maxHeight * p;
    const col = positive ? 'var(--accent)' : C.gray;
    return (
      <div style={{ position: 'absolute', left: x, bottom: 0, width: 180, textAlign: 'center', opacity: p }}>
        <div style={{ fontFamily: FONT.title, fontSize: 34, color: col, marginBottom: 10 }}>{item.display}</div>
        <div style={{ width: '100%', height: h, borderRadius: '14px 14px 0 0', background: col,
          boxShadow: positive ? `0 0 24px ${a(col, 0.5)}` : undefined }} />
        <div style={{ fontFamily: FONT.body, fontSize: 22, color: C.gray, marginTop: 12 }}>{item.label}</div>
      </div>
    );
  };
  return (
    <div style={{ position: 'absolute', top, left: 0, width: '100%', height: maxHeight + 100 }}>
      <div style={{ position: 'relative', width: 460, height: '100%', margin: '0 auto' }}>
        <Bar item={barA} x={0} positive={false} delay={0} />
        <Bar item={barB} x={280} positive delay={10} />
      </div>
    </div>
  );
};

// ─── FLIPCARD — Frage/Antwort-Karte, dreht sich um die Y-Achse ─────────────
export const FlipCard: React.FC<{
  question: string; answer: string; at: number; top: number; width?: number;
}> = ({ question, answer, at, top, width = 700 }) => {
  const f = useCurrentFrame();
  const enterP = prog(f, at - 10, at, E.spring);
  const flipDeg = lerpF(f, 0, 180, at, at + 24, E.inOut);
  const showBack = flipDeg > 90;
  const scaleX = Math.abs(Math.cos((flipDeg * Math.PI) / 180));
  return (
    <div style={{ position: 'absolute', top, left: 0, width: '100%', display: 'flex', justifyContent: 'center',
      opacity: enterP }}>
      <div style={{ width, minHeight: 220, transform: `scaleX(${scaleX})` }}>
        <Glass style={{ padding: '46px 54px', minHeight: 220, display: 'flex', flexDirection: 'column',
          justifyContent: 'center' }} border={showBack ? a('var(--accent)', 0.55) : a(C.white, 0.16)}>
          <div style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 20, letterSpacing: 2,
            textTransform: 'uppercase', color: showBack ? 'var(--accent)' : C.gray, marginBottom: 14 }}>
            {showBack ? 'Antwort' : 'Frage'}
          </div>
          <div style={{ fontFamily: showBack ? FONT.body : FONT.title, fontWeight: showBack ? 600 : 400,
            fontSize: showBack ? 30 : 44, color: C.white, lineHeight: 1.3,
            transform: `scaleX(${1 / Math.max(scaleX, 0.001)})` }}>
            {showBack ? answer : question}
          </div>
        </Glass>
      </div>
    </div>
  );
};

// ─── CALLOUTBADGE — Hinweis-Pille mit Verbindungslinie, zeigt auf einen Punkt ─
export const CalloutBadge: React.FC<{
  text: string; x: number; y: number; lineToY: number; at: number;
}> = ({ text, x, y, lineToY, at }) => {
  const f = useCurrentFrame();
  const badgeP = prog(f, at, at + 14, E.spring);
  const lineP = prog(f, at + 6, at + 20, E.out);
  const lineH = (lineToY - y) * lineP;
  return (
    <>
      <div style={{ position: 'absolute', left: x, top: y - 40, opacity: badgeP,
        transform: `scale(${lerpF(f, 0.7, 1, at, at + 14, E.spring)})` }}>
        <div style={{ padding: '12px 24px', borderRadius: 999, background: 'var(--accent)',
          boxShadow: `0 0 26px ${a('var(--accent)', 0.5)}` }}>
          <span style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 22, color: C.bgDeep }}>{text}</span>
        </div>
      </div>
      <div style={{ position: 'absolute', left: x + 30, top: y, width: 2, height: lineH, background: 'var(--accent)' }} />
    </>
  );
};

// ─── UPDATELIST — Versions-Badge + abgehakte Neuerungen-Liste ──────────────
export const UpdateList: React.FC<{
  version: string; title: string; items: string[]; start: number; top: number; width?: number;
}> = ({ version, title, items, start, top, width = 760 }) => {
  const f = useCurrentFrame();
  const headP = prog(f, start, start + 16, E.spring);
  return (
    <div style={{ position: 'absolute', top, left: 0, width: '100%', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width, opacity: headP, transform: `scale(${lerpF(f, 0.94, 1, start, start + 16, E.spring)})` }}>
        <Glass style={{ padding: '42px 48px' }}>
          <span style={{ display: 'inline-block', fontFamily: FONT.body, fontWeight: 800, fontSize: 18,
            color: 'var(--accent)', background: a('var(--accent)', 0.14), padding: '6px 16px', borderRadius: 999,
            letterSpacing: 1, marginBottom: 18 }}>{version}</span>
          <div style={{ fontFamily: FONT.title, fontSize: 44, color: C.white, marginBottom: 26 }}>{title}</div>
          {items.map((item, i) => {
            const at = start + 14 + i * 9;
            const p = prog(f, at, at + 12, E.out);
            return (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 0',
                opacity: p, transform: `translateX(${lerpF(f, -18, 0, at, at + 12, E.out)}px)` }}>
                <Lucide name="circle-check-big" size={24} color="var(--accent)" />
                <span style={{ fontFamily: FONT.body, fontSize: 24, color: C.white }}>{item}</span>
              </div>
            );
          })}
        </Glass>
      </div>
    </div>
  );
};

// ─── LEVELBAR — Level/Fortschrittsbalken (z. B. Wissens-Level) ─────────────
export const LevelBar: React.FC<{
  level: number; maxLevel: number; label: string; sub?: string; start: number; top: number;
}> = ({ level, maxLevel, label, sub, start, top }) => {
  const f = useCurrentFrame();
  const numP = prog(f, start, start + 16, E.spring);
  const barP = prog(f, start + 10, start + 46, E.out);
  return (
    <div style={{ position: 'absolute', top, left: 0, width: '100%', textAlign: 'center' }}>
      <div style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 20, color: C.gray,
        textTransform: 'uppercase', letterSpacing: 2, opacity: numP }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 8,
        opacity: numP, transform: `scale(${lerpF(f, 0.7, 1, start, start + 16, E.spring)})`, marginTop: 8 }}>
        <span style={{ fontFamily: FONT.title, fontSize: 88, color: C.white }}>{level}</span>
        <span style={{ fontFamily: FONT.body, fontSize: 26, color: C.gray }}>/{maxLevel}</span>
      </div>
      <div style={{ width: 380, height: 10, borderRadius: 5, background: a(C.white, 0.1), margin: '20px auto 0', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${(level / maxLevel) * barP * 100}%`, borderRadius: 5,
          background: 'linear-gradient(90deg, var(--accent-dk), var(--accent))',
          boxShadow: `0 0 14px ${a('var(--accent)', 0.6)}` }} />
      </div>
      {sub && <div style={{ fontFamily: FONT.body, fontSize: 20, color: C.gray, marginTop: 14, opacity: barP }}>{sub}</div>}
    </div>
  );
};

// ─── SPEAKERINTRO — Referenten-/Experten-Karte mit Zitat ───────────────────
export const SpeakerIntro: React.FC<{
  name: string; role: string; quote?: string; start: number; top: number;
}> = ({ name, role, quote, start, top }) => {
  const f = useCurrentFrame();
  const avatarP = prog(f, start, start + 16, E.spring);
  const nameP = prog(f, start + 8, start + 22, E.out);
  const quoteP = prog(f, start + 16, start + 30, E.out);
  return (
    <div style={{ position: 'absolute', top, left: 0, width: '100%', textAlign: 'center' }}>
      <div style={{ width: 110, height: 110, borderRadius: 999, margin: '0 auto', background: a('var(--accent)', 0.14),
        border: '3px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        transform: `scale(${avatarP})`, boxShadow: `0 0 30px ${a('var(--accent)', 0.4)}` }}>
        <span style={{ fontFamily: FONT.title, fontSize: 46, color: 'var(--accent)' }}>{name.charAt(0)}</span>
      </div>
      <div style={{ fontFamily: FONT.title, fontSize: 42, color: C.white, marginTop: 22, opacity: nameP }}>{name}</div>
      <div style={{ fontFamily: FONT.body, fontSize: 22, color: C.gray, marginTop: 4, opacity: nameP }}>{role}</div>
      {quote && <div style={{ fontFamily: FONT.body, fontStyle: 'italic', fontSize: 24, color: 'var(--accent)',
        marginTop: 18, opacity: quoteP }}>&ldquo;{quote}&rdquo;</div>}
    </div>
  );
};

// ─── SOCIALPROOFPOST — Social-Media-Post-Mockup mit Engagement-Zahlen ──────
export const SocialProofPost: React.FC<{
  name: string; handle: string; text: string; likes: number; start: number; top: number; width?: number;
}> = ({ name, handle, text, likes, start, top, width = 680 }) => {
  const f = useCurrentFrame();
  const cardP = prog(f, start, start + 16, E.spring);
  const textP = prog(f, start + 8, start + 22, E.out);
  const metricsP = prog(f, start + 20, start + 34, E.spring);
  return (
    <div style={{ position: 'absolute', top, left: 0, width: '100%', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width, opacity: cardP, transform: `scale(${lerpF(f, 0.92, 1, start, start + 16, E.spring)})` }}>
        <Glass style={{ padding: '32px 36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            <div style={{ width: 52, height: 52, borderRadius: 999, background: 'var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title,
              fontSize: 22, color: C.bgDeep }}>{name.charAt(0)}</div>
            <div>
              <div style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 22, color: C.white }}>{name}</div>
              <div style={{ fontFamily: FONT.body, fontSize: 18, color: C.gray }}>{handle}</div>
            </div>
          </div>
          <div style={{ fontFamily: FONT.body, fontSize: 24, color: C.white, lineHeight: 1.5, opacity: textP,
            marginBottom: 22 }}>{text}</div>
          <div style={{ display: 'flex', gap: 24, paddingTop: 18, borderTop: `1px solid ${a(C.white, 0.1)}`,
            opacity: metricsP }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Lucide name="heart" size={20} color={C.negative} />
              <span style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 18, color: C.gray }}>{likes.toLocaleString('de-DE')}</span>
            </div>
          </div>
        </Glass>
      </div>
    </div>
  );
};

// ─── COLLABBADGE — Partnerschafts-Badge, zwei Initialen mit „+" verbunden ──
export const CollabBadge: React.FC<{
  nameA: string; nameB: string; label?: string; at: number; top: number;
}> = ({ nameA, nameB, label, at, top }) => {
  const f = useCurrentFrame();
  const aP = prog(f, at, at + 14, E.spring);
  const plusP = prog(f, at + 8, at + 18, E.spring);
  const bP = prog(f, at + 14, at + 28, E.spring);
  const labelP = prog(f, at + 26, at + 40, E.out);
  const Circle: React.FC<{ n: string; p: number }> = ({ n, p }) => (
    <div style={{ width: 90, height: 90, borderRadius: 999, background: a('var(--accent)', 0.14),
      border: '2px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      opacity: p, transform: `scale(${p})`, fontFamily: FONT.title, fontSize: 36, color: 'var(--accent)' }}>{n}</div>
  );
  return (
    <div style={{ position: 'absolute', top, left: 0, width: '100%', textAlign: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
        <Circle n={nameA.charAt(0)} p={aP} />
        <span style={{ fontFamily: FONT.title, fontSize: 44, color: C.gray, opacity: plusP }}>+</span>
        <Circle n={nameB.charAt(0)} p={bP} />
      </div>
      {label && <div style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 26, color: C.white,
        marginTop: 24, opacity: labelP }}>{label}</div>}
    </div>
  );
};

// ─── CARTSUCCESS — Kauf-/Abschluss-Bestätigung mit Häkchen-Kreis ───────────
export const CartSuccess: React.FC<{ title: string; sub?: string; at: number; top: number }> = ({
  title, sub, at, top,
}) => {
  const f = useCurrentFrame();
  const circleP = prog(f, at, at + 16, E.spring);
  const checkP = prog(f, at + 10, at + 24, E.out);
  const textP = prog(f, at + 18, at + 32, E.out);
  return (
    <div style={{ position: 'absolute', top, left: 0, width: '100%', textAlign: 'center' }}>
      <div style={{ width: 120, height: 120, borderRadius: 999, margin: '0 auto', background: a('var(--accent)', 0.16),
        border: '3px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        transform: `scale(${circleP})`, boxShadow: `0 0 40px ${a('var(--accent)', 0.5)}` }}>
        <div style={{ opacity: checkP, transform: `scale(${checkP})` }}>
          <Lucide name="check" size={56} color="var(--accent)" />
        </div>
      </div>
      <div style={{ fontFamily: FONT.title, fontSize: 48, color: C.white, marginTop: 24, opacity: textP }}>{title}</div>
      {sub && <div style={{ fontFamily: FONT.body, fontSize: 24, color: C.gray, marginTop: 8, opacity: textP }}>{sub}</div>}
    </div>
  );
};

// ─── NEWSBANNER — Breaking-News-Streifen, guter Hook-Opener ────────────────
export const NewsBanner: React.FC<{ tag: string; text: string; at: number; top: number }> = ({
  tag, text, at, top,
}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 14, E.spring);
  const textP = prog(f, at + 6, at + 20, E.out);
  return (
    <div style={{ position: 'absolute', top, left: 0, width: '100%', display: 'flex', justifyContent: 'center',
      opacity: p, transform: `translateY(${lerpF(f, -20, 0, at, at + 14, E.spring)}px)` }}>
      <div style={{ display: 'flex', alignItems: 'stretch', borderRadius: 14, overflow: 'hidden',
        boxShadow: `0 0 30px ${a(C.negative, 0.3)}` }}>
        <div style={{ background: C.negative, padding: '16px 28px', display: 'flex', alignItems: 'center' }}>
          <span style={{ fontFamily: FONT.body, fontWeight: 900, fontSize: 24, color: C.white, letterSpacing: 1 }}>{tag}</span>
        </div>
        <div style={{ background: a(C.bgDeep, 0.92), padding: '16px 30px', display: 'flex', alignItems: 'center',
          opacity: textP }}>
          <span style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 24, color: C.white }}>{text}</span>
        </div>
      </div>
    </div>
  );
};

// ─── TRENDBADGE — kompaktes Pill mit Trend-Pfeil + Prozentwert ──────────────
export const TrendBadge: React.FC<{
  label: string; value: string; up: boolean; at: number; cx: number; cy: number;
}> = ({ label, value, up, at, cx, cy }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 14, E.spring);
  const col = up ? 'var(--accent)' : C.negative;
  return (
    <div style={{ position: 'absolute', left: cx, top: cy, opacity: p,
      transform: `scale(${lerpF(f, 0.7, 1, at, at + 14, E.spring)})` }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '14px 24px', borderRadius: 999,
        background: a(col, 0.14), border: `2px solid ${a(col, 0.5)}` }}>
        <Lucide name={up ? 'trending-up' : 'trending-down'} size={24} color={col} />
        <span style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 22, color: C.gray }}>{label}</span>
        <span style={{ fontFamily: FONT.title, fontSize: 28, color: col }}>{value}</span>
      </div>
    </div>
  );
};

export const PlanCompare: React.FC<{
  plans: Plan[]; start: number; top: number; width?: number;
}> = ({ plans, start, top, width = 1740 }) => {
  const f = useCurrentFrame();
  const colW = (width - (plans.length - 1) * 36) / plans.length;
  return (
    <div style={{ position: 'absolute', top, left: `calc(50% - ${width / 2}px)`, width, display: 'flex', gap: 36 }}>
      {plans.map((plan, i) => {
        const at = start + i * 10;
        const p = prog(f, at, at + 16, E.spring);
        const ty = lerpF(f, 30, 0, at, at + 18, E.spring);
        return (
          <div key={plan.name} style={{ width: colW, opacity: p, transform: `translateY(${ty}px)` }}>
            <Glass style={{ padding: '36px 32px' }} glow={plan.highlighted}
              border={plan.highlighted ? a('var(--accent)', 0.6) : a(C.white, 0.14)}>
              {plan.highlighted && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px',
                  borderRadius: 999, background: a('var(--accent)', 0.2), marginBottom: 14 }}>
                  <Lucide name="star" size={16} color="var(--accent)" />
                  <span style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 16, color: 'var(--accent)',
                    letterSpacing: 1, textTransform: 'uppercase' }}>Empfehlung</span>
                </div>
              )}
              <div style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 26, color: C.white }}>{plan.name}</div>
              <div style={{ fontFamily: FONT.title, fontSize: 52, color: plan.highlighted ? 'var(--accent)' : C.white,
                marginTop: 8 }}>{plan.price}</div>
              <div style={{ marginTop: 20 }}>
                {plan.features.map((feat, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0' }}>
                    <Lucide name="circle-check-big" size={20} color={plan.highlighted ? 'var(--accent)' : C.gray} />
                    <span style={{ fontFamily: FONT.body, fontSize: 20, color: C.white }}>{feat}</span>
                  </div>
                ))}
              </div>
            </Glass>
          </div>
        );
      })}
    </div>
  );
};

// ─── DONTDOINSTEAD — "Nicht tun" (durchgestrichen) → choreografiert "Stattdessen" ─
// Löst strukturell die gelernte Lektion (REEL-PRINZIPIEN): eine Verneinungs-Liste
// bekommt IMMER ihr positives Gegenstück. Erst dontItems durchgestrichen/gedimmt,
// dann übergehend (nicht hart geschnitten) insteadItems grün+glühend hervorgehoben.
export type DontDoItem = { icon: string; label: string };
export const DontDoInstead: React.FC<{
  dontItems: DontDoItem[];
  insteadItems: DontDoItem[];
  dontAt: number;
  insteadAt: number;
  top: number;
  width?: number;
  dontLabel?: string;
  insteadLabel?: string;
}> = ({ dontItems, insteadItems, dontAt, insteadAt, top, width = 880, dontLabel = 'NICHT', insteadLabel = 'STATTDESSEN' }) => {
  const f = useCurrentFrame();
  const rowH = 108;
  const collapseStart = insteadAt - 4;
  const collapseEnd = insteadAt + 14;
  const dontScale = lerpF(f, 1, 0.86, collapseStart, collapseEnd, E.inOut);
  const dontOpacity = lerpF(f, 1, 0.38, collapseStart, collapseEnd, E.inOut);
  const dontHeadP = prog(f, dontAt, dontAt + 14, E.out);
  const insteadHeadP = prog(f, insteadAt, insteadAt + 14, E.out);

  return (
    <div style={{ position: 'absolute', top, left: `calc(50% - ${width / 2}px)`, width }}>
      {/* NICHT — Kopf + durchgestrichene Zeilen */}
      <div style={{ opacity: dontHeadP, fontFamily: FONT.body, fontWeight: 800, fontSize: 22,
        color: C.negative, textTransform: 'uppercase', letterSpacing: 3, marginBottom: 14 }}>{dontLabel}</div>
      <div style={{ transform: `scale(${dontScale})`, transformOrigin: 'top center', opacity: dontOpacity }}>
        {dontItems.map((it, i) => {
          const at = dontAt + 10 + i * 11;
          const p = prog(f, at, at + 14, E.spring);
          const strike = prog(f, at + 10, at + 24, E.out);
          return (
            <div key={it.label} style={{
              display: 'flex', alignItems: 'center', gap: 22, height: rowH, opacity: p,
              transform: `translateX(${lerpF(f, 50, 0, at, at + 16, E.spring)}px)`,
            }}>
              <PremiumIcon name={it.icon} size="sm" at={at} color={C.negative} glow={false} />
              <span style={{ position: 'relative', fontFamily: FONT.body, fontWeight: 700, fontSize: 30, color: C.gray }}>
                {it.label}
                <span style={{ position: 'absolute', left: 0, top: '50%', height: 3, background: C.negative,
                  width: `${strike * 100}%`, boxShadow: `0 0 8px ${a(C.negative, 0.6)}` }} />
              </span>
            </div>
          );
        })}
      </div>

      {/* STATTDESSEN — Kopf + hervorgehobene Zeilen, choreografiert direkt darunter */}
      <div style={{
        marginTop: lerpF(f, 26, -6, collapseStart, collapseEnd, E.inOut),
        opacity: insteadHeadP, fontFamily: FONT.body, fontWeight: 800, fontSize: 22,
        color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 3, marginBottom: 14,
      }}>{insteadLabel}</div>
      <div>
        {insteadItems.map((it, i) => {
          const at = insteadAt + 8 + i * 11;
          const p = prog(f, at, at + 16, E.spring);
          const ty = lerpF(f, 46, 0, at, at + 18, E.spring);
          return (
            <div key={it.label} style={{
              display: 'flex', alignItems: 'center', gap: 22, height: rowH, opacity: p,
              transform: `translateY(${ty}px)`, padding: '10px 20px', marginBottom: 4, borderRadius: 20,
              background: a('var(--accent)', 0.08), border: `1.5px solid ${a('var(--accent)', 0.4)}`,
            }}>
              <PremiumIcon name={it.icon} size="sm" at={at} color="var(--accent)" />
              <span style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 30, color: C.white }}>{it.label}</span>
              <div style={{ marginLeft: 'auto', opacity: prog(f, at + 14, at + 24, E.spring) }}>
                <Lucide name="circle-check-big" size={26} color="var(--accent)" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── CASHFLOW-WATERFALL — Einnahmen → Ausgaben-Kategorien → Rest ────────────
// Lücke geschlossen (2026-07-22): `RevenueCard` ist business-artig (LIVE-Badge, Spalten-Stats),
// kein dediziertes "so viel bleibt dir am Monatsende wirklich"-Visual. Klassischer Waterfall:
// Einnahmen-Balken oben voll, jede Ausgabe zieht sichtbar was ab (rot, mit Verbindungslinie),
// am Ende bleibt der Rest hervorgehoben stehen (Akzentfarbe, Glow).
export type CashflowItem = { label: string; amount: number };
export const CashflowWaterfall: React.FC<{
  income: number; items: CashflowItem[]; start: number; top: number;
  width?: number; barW?: number; maxBarH?: number; perItem?: number;
}> = ({ income, items, start, top, width = 900, barW = 120, maxBarH = 420, perItem = 16 }) => {
  const f = useCurrentFrame();
  const total = income;
  const remainder = income - items.reduce((s, it) => s + it.amount, 0);
  const scale = maxBarH / total;
  // Laufender Stand: Einnahmen-Balken, dann pro Ausgabe absteigend, zuletzt der Rest.
  let running = income;
  const steps: { label: string; top: number; h: number; color: string; value: number; isIncome?: boolean; isRest?: boolean }[] = [
    { label: 'Einnahmen', top: 0, h: income * scale, color: 'var(--accent)', value: income, isIncome: true },
  ];
  items.forEach((it) => {
    const before = running;
    running -= it.amount;
    steps.push({ label: it.label, top: (total - before) * scale, h: it.amount * scale, color: C.negative, value: it.amount });
  });
  steps.push({ label: 'Bleibt übrig', top: (total - running) * scale, h: Math.max(remainder, 0) * scale, color: 'var(--accent)', value: remainder, isRest: true });

  return (
    <div style={{ position: 'absolute', top, left: 0, width: '100%', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width, height: maxBarH + 90, position: 'relative' }}>
        {steps.map((s, i) => {
          const at = start + i * perItem;
          const p = prog(f, at, at + perItem, E.spring);
          const x = (i / (steps.length - 1)) * (width - barW);
          const h = s.h * p;
          return (
            <div key={s.label} style={{ position: 'absolute', left: x, top: s.top, width: barW }}>
              <div style={{
                width: barW, height: h, borderRadius: '14px 14px 4px 4px',
                background: s.color, opacity: 0.92,
                boxShadow: (s.isIncome || s.isRest) ? `0 0 22px ${a(s.color, 0.55)}` : undefined,
                border: s.isRest ? `2px solid ${a(s.color, 0.8)}` : undefined,
              }} />
              <div style={{ marginTop: 10, textAlign: 'center', opacity: p }}>
                <div style={{ fontFamily: FONT.title, fontSize: 26,
                  color: s.isIncome || s.isRest ? 'var(--accent)' : C.white }}>
                  {s.isIncome ? '+' : s.isRest ? '' : '−'}{Math.round(s.value).toLocaleString('de-DE')} €
                </div>
                <div style={{ fontFamily: FONT.body, fontSize: 18, color: C.gray, marginTop: 2 }}>{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
