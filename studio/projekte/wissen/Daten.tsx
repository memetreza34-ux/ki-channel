import React from 'react';
import {AbsoluteFill, Easing, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Project} from '../types';
import {AKZENT, BG, HELL, STAHL, clamp, outQuint, zahl} from './bausteine';

/**
 * Test „Daten-Short“: ein fester Titel, in der Mitte immer genau ein Objekt oder eine Zahl.
 * Zahlen (geprüft 2026-10-23, Quellen: Altman „The Gentle Singularity“, Stiftung Warentest, OpenAI ggü. Axios):
 * 0,34 Wh pro Anfrage (Altman, Juni 2025) · 1 Liter Teewasser = 115 Wh (Stiftung Warentest) ≈ 340 Fragen ·
 * 2,5 Mrd. Anfragen pro Tag (OpenAI ggü. Axios, Juli 2025) → ≈ 850 MWh/Tag ≈ 7,4 Mio. Liter Teewasser.
 */



const Rollen: React.FC<{von: number; bis: number; ab: number; dauer?: number; stellen?: number; einheit?: string; groesse: number; farbe?: string}> = ({von, bis, ab, dauer = 26, stellen = 0, einheit, groesse, farbe = HELL}) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [ab, ab + dauer], [0, 1], {...clamp, easing: outQuint});
  return (
    <div style={{fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: groesse, lineHeight: 1, letterSpacing: '-0.05em', color: farbe, fontVariantNumeric: 'tabular-nums'}}>
      {zahl(von + (bis - von) * t, stellen)}
      {einheit ? <span style={{fontSize: groesse * 0.42, marginLeft: groesse * 0.12, letterSpacing: 0, color: STAHL}}>{einheit}</span> : null}
    </div>
  );
};

const Klein: React.FC<{children: React.ReactNode; ab: number}> = ({children, ab}) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [ab, ab + 12], [0, 1], {...clamp, easing: outQuint});
  return <div style={{fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 46, lineHeight: 1.2, color: HELL, opacity: t, transform: `translateY(${(1 - t) * 18}px)`}}>{children}</div>;
};

const Quelle: React.FC<{text: string; ab: number}> = ({text, ab}) => {
  const f = useCurrentFrame();
  return <div style={{fontFamily: 'JetBrains Mono, monospace', fontWeight: 500, fontSize: 24, letterSpacing: '0.06em', color: STAHL, opacity: interpolate(f, [ab, ab + 10], [0, 0.9], clamp)}}>{text}</div>;
};

/** Beat-Ein-/Ausblendung. */
const useBeat = (ab: number, bis: number) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const rein = spring({frame: f - ab, fps, config: {damping: 16, stiffness: 120}});
  const raus = interpolate(f, [bis - 10, bis], [0, 1], clamp);
  return {sichtbar: f >= ab && f < bis, rein, raus, f};
};

/* ───────────── Objekte ───────────── */

const Blase: React.FC<{f: number}> = ({f}) => {
  const blitz = interpolate(f, [34, 40, 46], [0, 1, 0.85], clamp);
  return (
    <svg width="420" height="360" viewBox="0 0 420 360">
      <ellipse cx="210" cy="338" rx="150" ry="14" fill="#000" opacity="0.35" />
      <path d="M60,40 H360 a40,40 0 0 1 40,40 V220 a40,40 0 0 1 -40,40 H170 L110,312 L118,260 H60 a40,40 0 0 1 -40,-40 V80 a40,40 0 0 1 40,-40 Z" fill={HELL} />
      <path d="M60,40 H360 a40,40 0 0 1 40,40 V96 H20 V80 a40,40 0 0 1 40,-40 Z" fill="#E4DED3" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={150 + i * 60} cy={170} r={18} fill={BG} opacity={0.35 + 0.65 * ((Math.floor(f / 6) + i) % 3 === 0 ? 1 : 0.4)} />
      ))}
      <g transform={`translate(330 ${30 - blitz * 20}) scale(${0.6 + blitz * 0.5})`} opacity={blitz}>
        <path d="M30,0 L0,62 H26 L14,120 L64,44 H36 L52,0 Z" fill={AKZENT} stroke={BG} strokeWidth="6" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

const Wasserkocher: React.FC<{f: number; ab: number}> = ({f, ab}) => {
  const an = f >= ab + 14;
  return (
    <svg width="360" height="420" viewBox="0 0 360 420" style={{overflow: 'visible'}}>
      <ellipse cx="170" cy="404" rx="140" ry="13" fill="#000" opacity="0.35" />
      {an
        ? [0, 1, 2].map((i) => {
            const t = ((f - ab + i * 12) % 36) / 36;
            return <path key={i} d={`M${150 + i * 22},${90 - t * 90} q-16,-24 0,-48 q16,-24 0,-48`} stroke={HELL} strokeWidth="9" strokeLinecap="round" fill="none" opacity={(1 - t) * 0.55} />;
          })
        : null}
      <rect x="40" y="370" width="260" height="30" rx="14" fill="#3A4258" />
      <path d="M70,120 H270 L296,360 a12,12 0 0 1 -12,14 H56 a12,12 0 0 1 -12,-14 Z" fill={HELL} />
      <path d="M232,120 H270 L296,360 a12,12 0 0 1 -12,14 H262 Z" fill="#DDD6CA" />
      <path d="M44,170 L8,150 L20,128 L66,150" fill="#E4DED3" />
      <path d="M280,160 C340,170 344,300 292,320" stroke="#3A4258" strokeWidth="26" fill="none" strokeLinecap="round" />
      <rect x="86" y="96" width="168" height="32" rx="12" fill="#3A4258" />
      <rect x="110" y="190" width="18" height="150" rx="9" fill="#C9C1B3" />
      <rect x="110" y={340 - 120} width="18" height="120" rx="9" fill="#7FC8F0" opacity="0.9" />
      <circle cx="170" cy="352" r="10" fill={an ? AKZENT : '#5A6378'} />
    </svg>
  );
};

/** 340 Punkte, füllen sich als Welle. */
const Punkte: React.FC<{f: number; ab: number}> = ({f, ab}) => {
  const n = 340;
  const spalten = 20;
  return (
    <div style={{display: 'grid', gridTemplateColumns: `repeat(${spalten}, 22px)`, gap: 9}}>
      {Array.from({length: n}, (_, i) => {
        const welle = (i % spalten) * 0.6 + Math.floor(i / spalten) * 1.1 + random(`p${i}`) * 3;
        const t = interpolate(f, [ab + welle, ab + welle + 5], [0, 1], clamp);
        return <div key={i} style={{width: 22, height: 22, borderRadius: 11, background: t > 0.5 ? AKZENT : '#222B40', transform: `scale(${0.6 + t * 0.4})`}} />;
      })}
    </div>
  );
};

/* ───────────── Beats ───────────── */

const Beat1: React.FC = () => {
  const {sichtbar, rein, raus, f} = useBeat(0, 112);
  if (!sichtbar) return null;
  return (
    <div style={{position: 'absolute', left: 80, right: 80, top: 640, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 36, opacity: rein * (1 - raus), transform: `translateY(${(1 - rein) * 60 - raus * 40}px)`}}>
      <Blase f={f} />
      <Rollen von={0} bis={0.34} ab={40} stellen={2} einheit="Wh" groesse={230} />
      <Klein ab={60}>
        pro Frage an <span style={{color: AKZENT}}>ChatGPT</span>
      </Klein>
      <Quelle ab={66} text="QUELLE: SAM ALTMAN, JUNI 2025" />
    </div>
  );
};

const Beat2: React.FC = () => {
  const {sichtbar, rein, raus, f} = useBeat(112, 236);
  if (!sichtbar) return null;
  return (
    <div style={{position: 'absolute', left: 80, right: 80, top: 540, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34, opacity: rein * (1 - raus), transform: `translateY(${(1 - rein) * 60 - raus * 40}px)`}}>
      <div style={{display: 'flex', alignItems: 'flex-end', gap: 40}}>
        <div style={{transform: 'scale(0.8)', transformOrigin: 'bottom center'}}>
          <Wasserkocher f={f} ab={112} />
        </div>
        <div style={{paddingBottom: 30}}>
          <Klein ab={124}>1 Liter Tee</Klein>
          <Rollen von={0} bis={115} ab={130} einheit="Wh" groesse={120} />
        </div>
      </div>
      <Punkte f={f} ab={150} />
      <div style={{display: 'flex', alignItems: 'baseline', gap: 18}}>
        <Klein ab={176}>=</Klein>
        <Rollen von={0} bis={340} ab={152} dauer={40} groesse={110} farbe={AKZENT} />
        <Klein ab={176}>Fragen</Klein>
      </div>
    </div>
  );
};

const Beat3: React.FC = () => {
  const {sichtbar, rein, f} = useBeat(236, 999);
  if (!sichtbar) return null;
  const zwei = f >= 300;
  return (
    <div style={{position: 'absolute', left: 80, right: 80, top: 660, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 26, opacity: rein, transform: `translateY(${(1 - rein) * 60}px)`}}>
      <Klein ab={240}>Aber ChatGPT bekommt</Klein>
      <Rollen von={0} bis={2.5} ab={246} stellen={1} einheit="Mrd." groesse={240} />
      <Klein ab={262}>Fragen – jeden Tag.</Klein>
      <Quelle ab={268} text="QUELLE: OPENAI, JULI 2025" />
      {zwei ? (
        <div style={{marginTop: 50, display: 'flex', flexDirection: 'column', gap: 18}}>
          <Klein ab={300}>Das ist so viel Strom wie</Klein>
          <Rollen von={0} bis={7.4} ab={306} stellen={1} einheit="Mio. Liter" groesse={170} farbe={AKZENT} />
          <Klein ab={326}>Teewasser. Täglich.</Klein>
        </div>
      ) : null}
    </div>
  );
};

/* ───────────── Rahmen ───────────── */

const Titel: React.FC = () => {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, 14], [0, 1], {...clamp, easing: outQuint});
  return (
    <div style={{position: 'absolute', left: 80, right: 140, top: 230, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 82, lineHeight: 1.04, letterSpacing: '-0.035em', color: HELL, opacity: t, transform: `translateY(${(1 - t) * 24}px)`}}>
      So viel Strom frisst <span style={{color: AKZENT}}>eine</span> ChatGPT-Frage
    </div>
  );
};

const Marke: React.FC = () => (
  <div style={{position: 'absolute', left: 80, bottom: 150, display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 30, color: STAHL, letterSpacing: '0.02em'}}>
    <svg width="34" height="34" viewBox="-20 -20 40 40">
      <polygon points="0,-18 16,-9 0,0 -16,-9" fill="#9BF2D3" />
      <polygon points="-16,-9 0,0 0,18 -16,9" fill="#47E0B0" />
      <polygon points="16,-9 0,0 0,18 16,9" fill="#2FB98E" />
    </svg>
    denkwürfel
  </div>
);

const Fortschritt: React.FC = () => {
  const f = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  return <div style={{position: 'absolute', left: 0, bottom: 0, height: 8, width: `${(f / durationInFrames) * 100}%`, background: AKZENT}} />;
};

const Daten: React.FC = () => (
  <AbsoluteFill style={{background: BG, overflow: 'hidden'}}>
    <AbsoluteFill style={{background: 'radial-gradient(900px 700px at 50% 55%, rgba(255,107,74,0.07), transparent 70%)'}} />
    <Titel />
    <Beat1 />
    <Beat2 />
    <Beat3 />
    <Marke />
    <Fortschritt />
  </AbsoluteFill>
);

export const daten: Project[] = [{id: 'Daten-Test', component: Daten, format: 'vertical', durationInFrames: 380, ordner: 'Shorts'}];
