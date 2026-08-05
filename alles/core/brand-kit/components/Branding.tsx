import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, E, prog, lerpF, a } from '../tokens';
import { FONT } from '../fonts';

// ─── LOGO-INTRO — FinanzNeo Schriftzug baut sich auf ──────────────────────────
export const LogoIntro: React.FC<{ at?: number }> = ({ at = 0 }) => {
  const f = useCurrentFrame();
  const ring = prog(f, at, at + 20, E.out);
  const text = prog(f, at + 10, at + 24, E.spring);
  const neo = prog(f, at + 18, at + 30, E.spring);
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      {/* Ring */}
      <svg width={360} height={360} style={{ position: 'absolute' }}>
        <circle cx={180} cy={180} r={150} fill="none" stroke={'var(--accent)'} strokeWidth={8}
          strokeDasharray={`${2 * Math.PI * 150}`} strokeDashoffset={`${2 * Math.PI * 150 * (1 - ring)}`}
          transform="rotate(-90 180 180)" style={{ filter: `drop-shadow(0 0 16px ${a('var(--accent)', 0.7)})` }} />
      </svg>
      <div style={{ display: 'flex', fontFamily: FONT.title, fontSize: 120, lineHeight: 1 }}>
        <span style={{ color: C.white, opacity: text, transform: `translateX(${lerpF(f, -40, 0, at + 10, at + 24)}px)` }}>Finanz</span>
        <span style={{ color: 'var(--accent)', opacity: neo, transform: `translateX(${lerpF(f, 40, 0, at + 18, at + 30)}px)`,
          textShadow: `0 0 40px ${a('var(--accent)', 0.6)}` }}>Neo</span>
      </div>
    </AbsoluteFill>
  );
};

// ─── ABONNIEREN-BAR — kurze Einblendung unten ─────────────────────────────────
export const SubscribeBar: React.FC<{ at: number; dur?: number; bottom?: number }> = ({ at, dur = 90, bottom = 200 }) => {
  const f = useCurrentFrame();
  const inP = prog(f, at, at + 12, E.spring);
  const outP = prog(f, at + dur - 12, at + dur, E.in);
  const op = inP * (1 - outP);
  const pulse = 1 + Math.sin(f * 0.25) * 0.04;
  return (
    <div style={{ position: 'absolute', bottom, left: '50%',
      transform: `translateX(-50%) translateY(${(1 - inP) * 60}px) scale(${pulse})`, opacity: op,
      display: 'flex', alignItems: 'center', gap: 20, padding: '20px 36px', borderRadius: 999,
      background: a(C.negative, 0.16), border: `2.5px solid ${C.negative}`,
      boxShadow: `0 0 40px ${a(C.negative, 0.4)}` }}>
      <div style={{ width: 54, height: 54, borderRadius: '50%', background: C.negative,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>▶</div>
      <span style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 44, color: C.white }}>Abonnieren</span>
      <span style={{ fontSize: 40 }}>🔔</span>
    </div>
  );
};

// ─── END-CARD — Abschluss mit CTA ─────────────────────────────────────────────
export const EndCard: React.FC<{ at?: number; nextHint?: string }> = ({ at = 0, nextHint = 'Mehr Finanz-Tipps' }) => {
  const f = useCurrentFrame();
  const logo = prog(f, at, at + 14, E.spring);
  const sub = prog(f, at + 10, at + 24, E.out);
  const card = prog(f, at + 18, at + 32, E.spring);
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', fontFamily: FONT.title, fontSize: 110, opacity: logo,
        transform: `scale(${0.8 + logo * 0.2})` }}>
        <span style={{ color: C.white }}>Finanz</span><span style={{ color: 'var(--accent)' }}>Neo</span>
      </div>
      <div style={{ marginTop: 30, fontFamily: FONT.body, fontWeight: 700, fontSize: 44, color: C.gray, opacity: sub }}>
        Danke fürs Zuschauen!
      </div>
      <div style={{ marginTop: 50, padding: '24px 48px', borderRadius: 24, opacity: card,
        transform: `scale(${card})`, background: a('var(--accent)', 0.14), border: `2.5px solid ${'var(--accent)'}`,
        fontFamily: FONT.body, fontWeight: 800, fontSize: 46, color: 'var(--accent)' }}>
        👉 {nextHint}
      </div>
    </AbsoluteFill>
  );
};
