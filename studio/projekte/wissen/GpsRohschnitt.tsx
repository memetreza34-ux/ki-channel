import React from 'react';
import type {Caption} from '@remotion/captions';
import {AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {Music} from '../../kit/Music';
import {Sfx} from '../../kit/Stage';
import type {Project} from '../types';
import {AKZENT, BG, Globus, HELL, STAHL, Titel, clamp, outQuint, zahl} from './bausteine';
import {Callout, EckTag, Kapitel, Untertitel, Videouhr} from './technik-bausteine';
import untertitelJson from '../gps-handy/untertitel.json';

/**
 * GPS – zwei Compositions aus denselben Szenen:
 * `GPS-Rohschnitt`: stummer Rohschnitt (Phase 3 vorgezogen auf Armans „los“, 2026-11-02), Zeiten geschätzt.
 * `GPS-Short`: auf die freigegebene Klon-Stimme (2026-11-08), Ereignisse wortgenau aus projekte/gps-handy/untertitel.json.
 *
 * Erzählt über das Bild: kein Sprechtext im Bild (kommt später als Untertitel aus Armans Aufnahme),
 * pro Szene höchstens eine Zahl oder ein Label. Zeiten geschätzt (≈ 3 Wörter/s je Absatz aus
 * kanal/shorts/2026-11-02_bis_2026-11-08/gps-handy/audio/script.txt). Fakten + Quellen: projekte/gps-handy/skript.md.
 */

/** Ereignis-Frames je Szene (relativ zum Szenenstart). */
type Zeiten = {
  laengen: number[];
  s1: {pfeil: number; kreuz: number; pfeilAus: number; wellen: number; pin: number};
  s2: {bahnen: number; hoehe: [number, number]; zahl: number; quelle: number; ticks: number[]};
  s3: {roentgen: number; callout: number; pakete: number[]};
  s4: {lauf: [number, number]; zeitAus: number; weg: number};
  s5: {kugeln: number[]; treffer: number; vierter: number; callout: number};
  s6: {davon: [number, number]; zahl: number; quelle: number};
  s7: {uhr: number};
  s8: {dreh: [number, number]; pfeil: number; pfeilAus: number; quelle: number; zurueck: number};
};

// Rohschnitt: Szenenlängen = Wörter je Absatz × 10
const ROH: Zeiten = {
  laengen: [140, 210, 220, 250, 310, 220, 250, 250],
  s1: {pfeil: 4, kreuz: 34, pfeilAus: 60, wellen: 64, pin: 80},
  s2: {bahnen: 8, hoehe: [30, 110], zahl: 26, quelle: 110, ticks: [30, 60, 90]},
  s3: {roentgen: 60, callout: 70, pakete: [100, 130, 160]},
  s4: {lauf: [20, 90], zeitAus: 130, weg: 136},
  s5: {kugeln: [20, 55, 90], treffer: 150, vierter: 175, callout: 220},
  s6: {davon: [30, 150], zahl: 150, quelle: 160},
  s7: {uhr: 0},
  s8: {dreh: [50, 80], pfeil: 44, pfeilAus: 90, quelle: 70, zurueck: 150},
};

// Stimme: Szenen beginnen an den Absatzpausen der Tonspur, Ereignisse auf das Wort (Kommentar = Wort)
const TON: Zeiten = {
  laengen: [122, 240, 204, 288, 329, 265, 282, 296],
  s1: {pfeil: 4, kreuz: 44 /* kein */, pfeilAus: 90, wellen: 96 /* es hört */, pin: 108},
  s2: {bahnen: 58 /* 30 GPS-Satelliten */, hoehe: [128, 170] /* 20.000 */, zahl: 124, quelle: 175, ticks: [63, 74, 133]},
  s3: {pakete: [86, 121, 140] /* Wo bin ich? Wie spät? */, roentgen: 152, callout: 160 /* Gemessen mit Atomuhren */},
  s4: {lauf: [40, 100] /* sieben Hundertstel Sekunden */, zeitAus: 222, weg: 232 /* Lichtgeschwindigkeit fliegt */},
  s5: {kugeln: [61, 105, 125] /* Kugel, Drei Kugeln */, treffer: 148 /* Punkt */, vierter: 200 /* vierte */, callout: 300 /* dieser Punkt bist du: Pin pulst */},
  s6: {davon: [62, 170] /* Da oben vergeht */, zahl: 174 /* 38 */, quelle: 185},
  s7: {uhr: 120 /* 10 Kilometer */},
  s8: {dreh: [120, 150] /* langsamer gestellt */, pfeil: 114, pfeilAus: 165, quelle: 100, zurueck: 168 /* Und dein Handy? */},
};

const starts = (z: Zeiten) => z.laengen.map((_, i) => z.laengen.slice(0, i).reduce((s, x) => s + x, 0));
const summe = (z: Zeiten) => z.laengen.reduce((s, x) => s + x, 0);
const WORTZEITEN = untertitelJson as Caption[];

const MONO = 'JetBrains Mono, monospace';
const SPACE = 'Space Grotesk, sans-serif';
const INTER = 'Inter, sans-serif';
const BLAU = '#9FB8FF';

const ein = (f: number, ab: number, dauer = 12) => interpolate(f, [ab, ab + dauer], [0, 1], {...clamp, easing: outQuint});

/* ───────────── Bühne ───────────── */

// feste Sternpositionen (deterministisch, kein Math.random)
const STERNE = Array.from({length: 90}, (_, i) => {
  const h = (n: number) => {
    const x = Math.sin(i * 127.1 + n * 311.7) * 43758.5453;
    return x - Math.floor(x);
  };
  return {x: h(1) * 1080, y: h(2) * 1920, r: 0.8 + h(3) * 2.2, phase: h(4) * 6.28};
});

const Himmel: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `radial-gradient(120% 80% at 50% 45%, #1A2752 0%, ${BG} 62%)`}}>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        {STERNE.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={HELL} opacity={0.18 + 0.22 * (0.5 + 0.5 * Math.sin(f / 22 + s.phase))} />
        ))}
      </svg>
      <AbsoluteFill style={{background: 'radial-gradient(90% 70% at 50% 50%, transparent 55%, rgba(4,7,16,0.75) 100%)'}} />
    </AbsoluteFill>
  );
};

/* ───────────── Requisiten ───────────── */

/** Handy aus Glas und Metall: Rahmen mit Verlauf, Kartenbildschirm, Lichtreflex, leuchtender Standort. */
const Handy: React.FC<{x: number; y: number; s?: number; pin?: number}> = ({x, y, s = 1, pin = 1}) => (
  <div style={{position: 'absolute', left: x - 130 * s, top: y - 250 * s, width: 260 * s, height: 500 * s, borderRadius: 50 * s, padding: 7 * s, background: 'linear-gradient(150deg,#5A6A92,#1C2644 45%,#3A4A72)', boxShadow: `0 ${40 * s}px ${80 * s}px rgba(0,0,0,0.6), 0 0 ${60 * s}px rgba(159,184,255,0.12)`}}>
    <div style={{position: 'relative', width: '100%', height: '100%', borderRadius: 44 * s, overflow: 'hidden', background: 'linear-gradient(170deg,#1F2F5C,#0D1530)'}}>
      <svg width="100%" height="100%" viewBox="0 0 246 486" preserveAspectRatio="none" style={{position: 'absolute', inset: 0}}>
        {[90, 190, 300, 400].map((yy) => (
          <path key={yy} d={`M-10 ${yy} Q 120 ${yy - 30} 260 ${yy + 10}`} stroke="#2E447E" strokeWidth={9} fill="none" />
        ))}
        {[70, 170].map((xx) => (
          <path key={xx} d={`M${xx} -10 Q ${xx + 20} 240 ${xx - 10} 500`} stroke="#2E447E" strokeWidth={9} fill="none" />
        ))}
        <path d="M30 470 Q 100 330 123 230" stroke={AKZENT} strokeOpacity={0.55} strokeWidth={6} fill="none" strokeDasharray="10 9" />
      </svg>
      <div style={{position: 'absolute', left: '50%', top: '47%', width: 90 * s, height: 90 * s, marginLeft: -45 * s, marginTop: -45 * s, borderRadius: '50%', background: `radial-gradient(circle, ${AKZENT}55, transparent 70%)`, transform: `scale(${0.6 + pin * 0.6})`}} />
      <div style={{position: 'absolute', left: '50%', top: '47%', width: 30 * s, height: 30 * s, marginLeft: -15 * s, marginTop: -15 * s, borderRadius: '50%', background: AKZENT, border: `${4 * s}px solid ${HELL}`, transform: `scale(${pin})`, boxShadow: `0 0 ${26 * s}px ${AKZENT}`}} />
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(115deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.03) 38%, transparent 39%)'}} />
      <div style={{position: 'absolute', left: '50%', top: 14 * s, width: 80 * s, height: 22 * s, marginLeft: -40 * s, borderRadius: 11 * s, background: '#05080F'}} />
    </div>
  </div>
);

/** Satellit: Metallkörper, Solarflügel mit Zellen, Antenne, Leuchten. `durchsicht` zeigt die Atomuhr innen. */
const Satellit: React.FC<{x: number; y: number; s?: number; durchsicht?: number; drehung?: number; uhrWinkel?: number}> = ({x, y, s = 1, durchsicht = 0, drehung = 0, uhrWinkel = 0}) => (
  <svg width={560 * s} height={300 * s} viewBox="-280 -150 560 300" style={{position: 'absolute', left: x - 280 * s, top: y - 150 * s, overflow: 'visible', transform: `rotate(${drehung}deg)`}}>
    <defs>
      <linearGradient id="sat-panel" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#3B62C4" />
        <stop offset="0.55" stopColor="#1B3170" />
        <stop offset="1" stopColor="#24408A" />
      </linearGradient>
      <linearGradient id="sat-koerper" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#F2F4FA" />
        <stop offset="0.5" stopColor="#A9B2C8" />
        <stop offset="1" stopColor="#6E7891" />
      </linearGradient>
      <radialGradient id="sat-glow">
        <stop offset="0" stopColor={BLAU} stopOpacity="0.35" />
        <stop offset="1" stopColor={BLAU} stopOpacity="0" />
      </radialGradient>
    </defs>
    <ellipse cx={0} cy={0} rx={300} ry={150} fill="url(#sat-glow)" />
    {[-1, 1].map((seite) => {
      const x0 = seite < 0 ? -265 : 95;
      return (
        <g key={seite}>
          <line x1={seite * 62} x2={seite * 95} y1={0} y2={0} stroke="#C9CFDD" strokeWidth={8} />
          <rect x={x0} y={-62} width={170} height={124} rx={6} fill="url(#sat-panel)" stroke="#8FA8E8" strokeWidth={2.5} />
          {[1, 2, 3].map((k) => (
            <line key={`v${k}`} x1={x0 + k * 42.5} x2={x0 + k * 42.5} y1={-62} y2={62} stroke="#0E1A40" strokeWidth={3} />
          ))}
          {[1, 2].map((k) => (
            <line key={`h${k}`} x1={x0} x2={x0 + 170} y1={-62 + k * 41} y2={-62 + k * 41} stroke="#0E1A40" strokeWidth={3} />
          ))}
          <path d={`M${x0} -62 L${x0 + 60} -62 L${x0} -10 Z`} fill="#FFFFFF" opacity={0.12} />
        </g>
      );
    })}
    <rect x={-62} y={-76} width={124} height={152} rx={14} fill={durchsicht > 0.5 ? 'rgba(159,184,255,0.10)' : 'url(#sat-koerper)'} stroke={durchsicht > 0.5 ? BLAU : '#DDE2EE'} strokeWidth={3} />
    <line x1={0} x2={0} y1={76} y2={118} stroke="#C9CFDD" strokeWidth={7} />
    <path d="M-26 120 Q 0 150 26 120 Z" fill="#DDE2EE" />
    {durchsicht > 0 ? (
      <g opacity={durchsicht}>
        <circle r={40} fill="rgba(255,107,74,0.10)" stroke={AKZENT} strokeWidth={4} />
        {Array.from({length: 12}, (_, k) => {
          const a = (k * 30 * Math.PI) / 180;
          return <line key={k} x1={Math.sin(a) * 32} y1={-Math.cos(a) * 32} x2={Math.sin(a) * 38} y2={-Math.cos(a) * 38} stroke={AKZENT} strokeWidth={3} />;
        })}
        <line x1={0} y1={0} x2={Math.sin((uhrWinkel * Math.PI) / 180) * 28} y2={-Math.cos((uhrWinkel * Math.PI) / 180) * 28} stroke={HELL} strokeWidth={4} strokeLinecap="round" />
        <circle r={5} fill={AKZENT} />
      </g>
    ) : null}
  </svg>
);

/** Zeigeruhr mit Leuchtrand; `winkel` = Sekundenzeiger in Grad. */
const Zeigeruhr: React.FC<{x: number; y: number; r: number; winkel: number; akzent?: boolean; label: string}> = ({x, y, r, winkel, akzent, label}) => {
  const farbe = akzent ? AKZENT : BLAU;
  const a = (winkel * Math.PI) / 180;
  const id = `uhr-${label.replace(/[^a-z0-9]/gi, '')}`;
  return (
    <>
      <svg width={r * 2 + 40} height={r * 2 + 40} viewBox={`${-r - 20} ${-r - 20} ${r * 2 + 40} ${r * 2 + 40}`} style={{position: 'absolute', left: x - r - 20, top: y - r - 20, overflow: 'visible'}}>
        <defs>
          <radialGradient id={id} cx="40%" cy="35%">
            <stop offset="0" stopColor="#24346A" />
            <stop offset="1" stopColor="#0C1328" />
          </radialGradient>
        </defs>
        <circle r={r + 10} fill="none" stroke={farbe} strokeOpacity={0.25} strokeWidth={14} />
        <circle r={r} fill={`url(#${id})`} stroke={farbe} strokeWidth={4} />
        {Array.from({length: 60}, (_, k) => {
          const w = (k * 6 * Math.PI) / 180;
          const lang = k % 5 === 0;
          return <line key={k} x1={Math.sin(w) * (r - (lang ? 26 : 14))} y1={-Math.cos(w) * (r - (lang ? 26 : 14))} x2={Math.sin(w) * (r - 6)} y2={-Math.cos(w) * (r - 6)} stroke={HELL} strokeOpacity={lang ? 0.8 : 0.3} strokeWidth={lang ? 5 : 2} />;
        })}
        <line x1={-Math.sin(a) * 20} y1={Math.cos(a) * 20} x2={Math.sin(a) * (r - 30)} y2={-Math.cos(a) * (r - 30)} stroke={farbe} strokeWidth={6} strokeLinecap="round" style={{filter: `drop-shadow(0 0 8px ${farbe})`}} />
        <circle r={10} fill={farbe} />
      </svg>
      <div style={{position: 'absolute', left: x - 220, width: 440, top: y + r + 34, textAlign: 'center', fontFamily: MONO, fontWeight: 700, fontSize: 40, letterSpacing: '0.1em', color: akzent ? AKZENT : STAHL}}>{label}</div>
    </>
  );
};

/** Funkwellen als Bögen unterhalb des Senders, wandern nach unten. */
const Wellen: React.FC<{x: number; y: number; ab: number; anzahl?: number; reichweite?: number}> = ({x, y, ab, anzahl = 3, reichweite = 380}) => {
  const f = useCurrentFrame();
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      {Array.from({length: anzahl}, (_, i) => {
        if (f < ab + i * 12) return null;
        const t = ((f - ab - i * 12) % 36) / 36;
        const r = 40 + t * reichweite;
        const pts = Array.from({length: 13}, (_, k) => {
          const a = ((35 + k * 9) * Math.PI) / 180;
          return `${(x + Math.cos(a) * r).toFixed(1)},${(y + Math.sin(a) * r).toFixed(1)}`;
        });
        return <polyline key={i} points={pts.join(' ')} fill="none" stroke={BLAU} strokeWidth={6} strokeLinecap="round" opacity={(1 - t) * 0.9} style={{filter: `drop-shadow(0 0 10px ${BLAU})`}} />;
      })}
    </svg>
  );
};

const Quelle: React.FC<{text: string; ab?: number; top?: number}> = ({text, ab = 0, top = 1350}) => {
  const f = useCurrentFrame();
  return <div style={{position: 'absolute', left: 80, top, fontFamily: MONO, fontSize: 28, letterSpacing: '0.06em', color: STAHL, opacity: 0.8 * ein(f, ab)}}>{text}</div>;
};

/* ───────────── Szenen ───────────── */

/** 1 · Der Pfeil nach oben wird durchgestrichen – stattdessen kommen Wellen von oben. */
const S1: React.FC<{z: Zeiten}> = ({z: {s1: z}}) => {
  const f = useCurrentFrame();
  const pfeil = ein(f, z.pfeil, 14);
  const kreuz = ein(f, z.kreuz, 10);
  const pin = spring({frame: f - z.pin, fps: 30, config: {damping: 12, stiffness: 160}});
  return (
    <AbsoluteFill>
      <Handy x={540} y={1080} pin={f < z.pin ? 0.5 : 0.5 + 0.5 * pin} />
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        <g opacity={pfeil * (1 - ein(f, z.pfeilAus, 10))}>
          <line x1={540} y1={800} x2={540} y2={800 - 220 * pfeil} stroke={HELL} strokeWidth={12} strokeLinecap="round" />
          <path d={`M505,${620 + (1 - pfeil) * 220} L540,${580 + (1 - pfeil) * 220} L575,${620 + (1 - pfeil) * 220}`} fill="none" stroke={HELL} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
          <line x1={445} y1={600} x2={445 + 190 * kreuz} y2={600 + 190 * kreuz} stroke={AKZENT} strokeWidth={16} strokeLinecap="round" />
          <line x1={635} y1={600} x2={635 - 190 * kreuz} y2={600 + 190 * kreuz} stroke={AKZENT} strokeWidth={16} strokeLinecap="round" />
        </g>
      </svg>
      <Wellen x={540} y={580} ab={z.wellen} reichweite={220} />
      <Sfx name="kTick" at={z.pfeil + 2} volume={0.35} />
      <Sfx name="kFalsch" at={z.kreuz} volume={0.35} />
      <Sfx name="kPop" at={z.pin} volume={0.4} />
    </AbsoluteFill>
  );
};

/** 2 · Erde mit Bahnringen, Satelliten kreisen, Höhe zählt hoch. */
const S2: React.FC<{z: Zeiten}> = ({z: {s2: z}}) => {
  const f = useCurrentFrame();
  const auf = ein(f, 0, 18);
  const R = 220;
  const cx = 540;
  const cy = 840;
  const bahnen = [0, 30, 60, 90, 120, 150];
  const hoehe = Math.round(interpolate(f, z.hoehe, [0, 20200], {...clamp, easing: outQuint}) / 100) * 100;
  const bahn = (w: number, i: number, vorn: boolean) => {
    const sicht = ein(f, z.bahnen + i * 5, 14);
    const winkel = (f * 0.9 + i * 47) * (Math.PI / 180);
    const rx = 430;
    const ry = 120;
    const lx = Math.cos(winkel) * rx;
    const ly = Math.sin(winkel) * ry;
    const rad = (w * Math.PI) / 180;
    const sx = cx + lx * Math.cos(rad) - ly * Math.sin(rad);
    const sy = cy + lx * Math.sin(rad) + ly * Math.cos(rad);
    const istVorn = Math.sin(winkel) > 0;
    if (istVorn !== vorn) return <ellipse key={w} cx={cx} cy={cy} rx={rx} ry={ry} transform={`rotate(${w} ${cx} ${cy})`} fill="none" stroke={BLAU} strokeOpacity={vorn ? 0 : 0.22 * sicht} strokeWidth={2} />;
    return (
      <g key={w} opacity={sicht}>
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} transform={`rotate(${w} ${cx} ${cy})`} fill="none" stroke={BLAU} strokeOpacity={vorn ? 0 : 0.22} strokeWidth={2} />
        <circle cx={sx} cy={sy} r={vorn ? 22 : 12} fill={BLAU} opacity={0.25} />
        <circle cx={sx} cy={sy} r={vorn ? 9 : 6} fill={vorn ? HELL : '#8090B8'} />
      </g>
    );
  };
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>{bahnen.map((w, i) => bahn(w, i, false))}</svg>
      <div style={{position: 'absolute', left: cx - R - 20, top: cy - R - 20, transform: `scale(${0.92 + 0.08 * auf})`, filter: 'drop-shadow(0 0 50px rgba(110,150,255,0.35))'}}>
        <Globus R={R} lon0={10 + f * 0.15} lat0={25} id="gps-erde" />
      </div>
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>{bahnen.map((w, i) => bahn(w, i, true))}</svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1080, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 18, opacity: ein(f, z.hoehe[0])}}>
        <div style={{fontFamily: INTER, fontWeight: 800, fontSize: 170, letterSpacing: '-0.05em', color: HELL, fontVariantNumeric: 'tabular-nums'}}>{zahl(hoehe)}</div>
        <div style={{fontFamily: SPACE, fontWeight: 700, fontSize: 80, color: AKZENT}}>km</div>
      </div>
      <Quelle text="QUELLE: GPS.GOV" ab={z.quelle} top={1290} />
      <Sfx name="kWhoosh" at={0} volume={0.35} />
      {z.ticks.map((d) => (
        <Sfx key={d} name="kTick" at={d} volume={0.3} />
      ))}
    </AbsoluteFill>
  );
};

/** 3 · Kamera fährt an den Satelliten, Röntgen auf die Atomuhr; Ort + Zeit fliegen als Lichtpunkte los. */
const S3: React.FC<{z: Zeiten}> = ({z: {s3: z}}) => {
  const f = useCurrentFrame();
  const auf = ein(f, 0, 22);
  const roe = ein(f, z.roentgen, 14);
  const paket = (ab: number, dx: number) => {
    const t = interpolate(f, [ab, ab + 50], [0, 1], clamp);
    if (t <= 0 || t >= 1) return null;
    return <circle cx={540 + dx * t} cy={860 + t * 520} r={14} fill={dx < 0 ? BLAU : AKZENT} opacity={1 - t * 0.6} style={{filter: `drop-shadow(0 0 14px ${dx < 0 ? BLAU : AKZENT})`}} />;
  };
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${0.8 + 0.2 * auf})`, transformOrigin: '540px 780px'}}>
        <Satellit x={540} y={780} s={1.55} durchsicht={roe} drehung={-6 + f * 0.02} uhrWinkel={f * 6} />
      </div>
      <Callout punkt={[540, 780]} text="Atomuhr" ab={z.callout} versatz={[-130, 230]} akzent />
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        {z.pakete.map((ab) => (
          <g key={ab}>
            {paket(ab, -140)}
            {paket(ab + 8, 140)}
          </g>
        ))}
      </svg>
      <Sfx name="kWhoosh" at={0} volume={0.3} />
      <Sfx name="kDing" at={z.callout} volume={0.4} />
      {z.pakete.map((d) => (
        <Sfx key={d} name="kTipp" at={d} volume={0.3} />
      ))}
    </AbsoluteFill>
  );
};

/** 4 · Lichtpunkt fliegt zum Handy; eine einzige Zahl: Laufzeit → Entfernung. */
const S4: React.FC<{z: Zeiten}> = ({z: {s4: z}}) => {
  const f = useCurrentFrame();
  const lauf = interpolate(f, z.lauf, [0, 1], clamp);
  const y = 650 + lauf * 230;
  const zeitSicht = 1 - ein(f, z.zeitAus, 10);
  const wegSicht = ein(f, z.weg, 12);
  return (
    <AbsoluteFill>
      <Satellit x={540} y={600} s={0.75} />
      <Handy x={540} y={1010} s={0.5} pin={0.5 + 0.5 * ein(f, z.lauf[1], 10)} />
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        <line x1={540} y1={660} x2={540} y2={880} stroke={BLAU} strokeOpacity={0.3} strokeWidth={4} strokeDasharray="6 12" />
        {lauf > 0 && lauf < 1 ? (
          <>
            <line x1={540} y1={Math.max(660, y - 90)} x2={540} y2={y} stroke={BLAU} strokeWidth={8} strokeLinecap="round" opacity={0.5} />
            <circle cx={540} cy={y} r={16} fill={HELL} style={{filter: `drop-shadow(0 0 18px ${BLAU})`}} />
          </>
        ) : null}
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1110, height: 200}}>
        <div style={{position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 16, opacity: zeitSicht * ein(f, z.lauf[0])}}>
          <div style={{fontFamily: INTER, fontWeight: 800, fontSize: 160, letterSpacing: '-0.05em', color: HELL, fontVariantNumeric: 'tabular-nums'}}>{(0.067 * lauf).toFixed(3).replace('.', ',')}</div>
          <div style={{fontFamily: SPACE, fontWeight: 700, fontSize: 76, color: AKZENT}}>s</div>
        </div>
        <div style={{position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 16, opacity: wegSicht, transform: `scale(${0.94 + 0.06 * wegSicht})`}}>
          <div style={{fontFamily: INTER, fontWeight: 800, fontSize: 160, letterSpacing: '-0.05em', color: HELL}}>20.200</div>
          <div style={{fontFamily: SPACE, fontWeight: 700, fontSize: 76, color: AKZENT}}>km</div>
        </div>
      </div>
      <Sfx name="kSwish" at={z.lauf[0]} volume={0.35} />
      <Sfx name="kLanden" at={z.lauf[1]} volume={0.35} />
      <Sfx name="kDing" at={z.weg} volume={0.45} />
    </AbsoluteFill>
  );
};

/** 5 · Drei Kugeln (hier Kreise) schneiden sich im Standort, ein vierter Satellit stellt die Uhr. */
const S5: React.FC<{z: Zeiten}> = ({z: {s5: z}}) => {
  const f = useCurrentFrame();
  const P: [number, number] = [540, 960];
  const sats: Array<[number, number]> = [
    [330, 790],
    [770, 800],
    [590, 1200],
  ];
  const treffer = spring({frame: f - z.treffer, fps: 30, config: {damping: 11, stiffness: 160}});
  const vierter = ein(f, z.vierter, 14);
  const puls = interpolate(f, [z.callout, z.callout + 6, z.callout + 20], [0, 1, 0], clamp);
  const satIcon = (sx: number, sy: number, key: React.Key, alpha = 1) => (
    <g key={key} opacity={alpha}>
      <circle cx={sx} cy={sy} r={34} fill={BLAU} opacity={0.18} />
      <rect x={sx - 18} y={sy - 13} width={36} height={26} rx={5} fill="#DDE2EE" />
      <rect x={sx - 52} y={sy - 10} width={30} height={20} rx={3} fill="#2B4C9B" stroke="#8FA8E8" strokeWidth={2} />
      <rect x={sx + 22} y={sy - 10} width={30} height={20} rx={3} fill="#2B4C9B" stroke="#8FA8E8" strokeWidth={2} />
    </g>
  );
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        <defs>
          <radialGradient id="kugel-fuellung">
            <stop offset="0.6" stopColor={BLAU} stopOpacity="0" />
            <stop offset="1" stopColor={BLAU} stopOpacity="0.16" />
          </radialGradient>
        </defs>
        {sats.map(([sx, sy], i) => {
          const d = Math.hypot(P[0] - sx, P[1] - sy);
          const r = d * interpolate(f, [z.kugeln[i], z.kugeln[i] + 50], [0, 1], {...clamp, easing: outQuint});
          return <circle key={`k${i}`} cx={sx} cy={sy} r={r} fill="url(#kugel-fuellung)" stroke={BLAU} strokeOpacity={0.7} strokeWidth={3} />;
        })}
        {sats.map(([sx, sy], i) => satIcon(sx, sy, `s${i}`))}
        <g opacity={vierter}>
          <line x1={900} y1={640} x2={P[0] + 18} y2={P[1] - 18} stroke={HELL} strokeOpacity={0.5} strokeWidth={3} strokeDasharray="4 10" />
          {satIcon(900, 620, 'vier')}
        </g>
        <circle cx={P[0]} cy={P[1]} r={60 * treffer + 50 * puls} fill={AKZENT} opacity={f >= z.treffer ? 0.25 + 0.2 * puls : 0} />
        <circle cx={P[0]} cy={P[1]} r={18 + treffer * 8} fill={AKZENT} stroke={HELL} strokeWidth={5} opacity={f >= z.treffer ? 1 : 0} style={{filter: `drop-shadow(0 0 20px ${AKZENT})`}} />
      </svg>
      {z.kugeln.map((d) => (
        <Sfx key={d} name="kTick" at={d} volume={0.3} />
      ))}
      <Sfx name="kPop" at={z.treffer} volume={0.45} />
      <Sfx name="kTipp" at={z.vierter} volume={0.35} />
      <Sfx name="kErfolg" at={z.callout} volume={0.4} />
    </AbsoluteFill>
  );
};

/** 6 · Zwei Zeigeruhren: oben läuft die Zeit schneller. Eine Zahl: +38 µs pro Tag. */
const S6: React.FC<{z: Zeiten}> = ({z: {s6: z}}) => {
  const f = useCurrentFrame();
  const unten = f * 6;
  const oben = f * 6 + interpolate(f, z.davon, [0, 70], clamp);
  const zahlSicht = ein(f, z.zahl, 12);
  const puls = interpolate(f, [z.zahl, z.zahl + 5, z.zahl + 14], [0, 1, 0], clamp);
  return (
    <AbsoluteFill>
      <div style={{transform: `scale(${0.92 + 0.08 * ein(f, 0, 14)})`, transformOrigin: '540px 760px'}}>
        <Zeigeruhr x={300} y={760} r={170} winkel={unten} label="ERDE" />
        <Zeigeruhr x={780} y={760} r={170} winkel={oben} label="SATELLIT" akzent />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1070, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 16, opacity: zahlSicht, transform: `scale(${1 + puls * 0.06})`}}>
        <div style={{fontFamily: INTER, fontWeight: 800, fontSize: 170, letterSpacing: '-0.05em', color: AKZENT}}>+38</div>
        <div style={{fontFamily: SPACE, fontWeight: 700, fontSize: 70, color: HELL}}>µs / Tag</div>
      </div>
      <Quelle text="QUELLE: R. POGGE, OHIO STATE UNIVERSITY" ab={z.quelle} top={1290} />
      <Sfx name="kTick" at={z.davon[0]} volume={0.3} />
      <Sfx name="kAnstieg" at={z.davon[0] + 20} volume={0.3} />
      <Sfx name="kDing" at={z.zahl} volume={0.45} />
    </AbsoluteFill>
  );
};

/** 7 · Stadtplan: der Standortpunkt driftet weg, die Videouhr zählt die Meter seit Videobeginn. */
const S7: React.FC<{z: Zeiten; start: number}> = ({z: {s7: z}, start}) => {
  const f = useCurrentFrame();
  // Maßstab: 50 px = 1 m; Drift 0,116 m/s (10 km ÷ 86.400 s), gezählt ab Videobeginn wie die Videouhr
  const drift = ((start + f) / 30) * 0.116 * 50;
  const kx = 300;
  const ky = 860;
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        <defs>
          <clipPath id="gps-plan">
            <rect x={80} y={560} width={920} height={600} rx={36} />
          </clipPath>
          <radialGradient id="plan-licht" cx="40%" cy="45%" r="70%">
            <stop offset="0" stopColor="#24346A" />
            <stop offset="1" stopColor="#0F1730" />
          </radialGradient>
        </defs>
        <g clipPath="url(#gps-plan)">
          <rect x={80} y={560} width={920} height={600} fill="url(#plan-licht)" />
          {[640, 790, 940, 1090].map((y) => (
            <rect key={y} x={80} y={y} width={920} height={34} fill="#2A3B6E" />
          ))}
          {[210, 430, 650, 870].map((x) => (
            <rect key={x} x={x} y={560} width={34} height={600} fill="#2A3B6E" />
          ))}
          <path d={`M${kx} ${ky} L${kx + drift} ${ky - drift * 0.35}`} stroke={AKZENT} strokeWidth={4} strokeDasharray="6 8" />
        </g>
        <rect x={80} y={560} width={920} height={600} rx={36} fill="none" stroke="#3A4C82" strokeWidth={3} />
        <circle cx={kx} cy={ky} r={20} fill="none" stroke={HELL} strokeWidth={5} />
        <circle cx={kx + drift} cy={ky - drift * 0.35} r={36} fill={AKZENT} opacity={0.25} />
        <circle cx={kx + drift} cy={ky - drift * 0.35} r={18} fill={AKZENT} stroke={HELL} strokeWidth={4} style={{filter: `drop-shadow(0 0 16px ${AKZENT})`}} />
        <line x1={120} x2={220} y1={1120} y2={1120} stroke={HELL} strokeWidth={5} />
        <text x={234} y={1134} fontFamily={MONO} fontSize={40} fill={HELL}>2 m</text>
      </svg>
      <div style={{opacity: ein(f, z.uhr)}}>
        <Videouhr proSekunde={0.116} einheit="m" stellen={1} start={-start} top={1190} rechts={150} />
      </div>
      <Sfx name="kAnstieg" at={z.uhr + 10} volume={0.3} />
    </AbsoluteFill>
  );
};

/** 8 · Die Atomuhr wird vor dem Start zurückgedreht, dann zurück zum Handy (Loop zu Szene 1). */
const S8: React.FC<{z: Zeiten}> = ({z: {s8: z}}) => {
  const f = useCurrentFrame();
  const zurueck = ein(f, z.zurueck, 20);
  // Zeiger läuft, wird dann ein Stück zurückgedreht
  const winkel = f * 6 - interpolate(f, z.dreh, [0, 90], {...clamp, easing: outQuint});
  const pfeil = ein(f, z.pfeil, 10) * (1 - ein(f, z.pfeilAus, 10));
  return (
    <AbsoluteFill>
      <div style={{opacity: 1 - zurueck}}>
        <Satellit x={540} y={560} s={0.8} durchsicht={1} uhrWinkel={winkel} />
        <Zeigeruhr x={540} y={1000} r={200} winkel={winkel} label="VOR DEM START" akzent />
        <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, opacity: pfeil}}>
          <path d="M 790 860 A 270 270 0 0 0 640 760" fill="none" stroke={AKZENT} strokeWidth={10} strokeLinecap="round" />
          <path d="M 655 735 L 632 762 L 666 780" fill="none" stroke={AKZENT} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <Quelle text="QUELLE: N. ASHBY, LIVING REVIEWS (2003)" ab={z.quelle} top={1300} />
      </div>
      <div style={{opacity: zurueck}}>
        <Handy x={540} y={1080} pin={0.5} />
      </div>
      <Sfx name="kTipp" at={z.dreh[0]} volume={0.4} />
      <Sfx name="kWhoosh" at={z.zurueck} volume={0.35} />
    </AbsoluteFill>
  );
};

const KAPITEL = ['Dein Handy', 'Die Satelliten', 'Das Signal', 'Zeit wird Weg', 'Der Schnittpunkt', 'Einstein', 'Während du schaust', 'Die Lösung'];

const Gps: React.FC<{z: Zeiten; mitTon?: boolean}> = ({z, mitTon = false}) => {
  const start = starts(z);
  const szenen = [S1, S2, S3, S4, S5, S6, S7, S8];
  return (
    <AbsoluteFill style={{background: BG}}>
      <Himmel />
      <Titel text={<>So weiß dein Handy, <span style={{color: AKZENT}}>wo du bist</span></>} />
      <EckTag texte={['Illustration']} top={130} />
      <KapitelMitLoop ende={summe(z)} abschnitte={KAPITEL.map((text, i) => ({text, ab: start[i]}))} />
      {szenen.map((Szene, i) => (
        <Sequence key={i} from={start[i]} durationInFrames={z.laengen[i]} layout="none">
          {i === 6 ? <S7 z={z} start={start[6]} /> : <Szene z={z} start={0} />}
        </Sequence>
      ))}
      {mitTon ? (
        <>
          <Audio src={staticFile('projekte/gps-handy/voiceover.wav')} />
          <Music src="musik/wissen.wav" volume={0.22} captions={WORTZEITEN} duckTo={0.35} />
          <Untertitel captions={WORTZEITEN} schluessel={['Signal', 'Atomuhren', 'Entfernung', 'Punkt', 'schneller', 'Einsteins']} farbig={['kein', '38', '10']} top={UNTERTITEL_TOP} />
        </>
      ) : null}
    </AbsoluteFill>
  );
};

/** Kapitel-Label blendet in den letzten 15 Frames aus, damit das letzte Bild wieder Frame 0 gleicht (Loop). */
const KapitelMitLoop: React.FC<{ende: number; abschnitte: Array<{text: string; ab: number}>}> = ({ende, abschnitte}) => {
  const f = useCurrentFrame();
  return (
    <div style={{opacity: interpolate(f, [ende - 15, ende - 3], [1, 0], clamp)}}>
      <Kapitel top={450} abschnitte={abschnitte} />
    </div>
  );
};

const UNTERTITEL_TOP = 1360;

const GpsRohschnitt: React.FC = () => <Gps z={ROH} />;
const GpsShort: React.FC = () => <Gps z={TON} mitTon />;

export const gpsRohschnitt: Project[] = [
  {id: 'GPS-Rohschnitt', component: GpsRohschnitt, format: 'vertical', durationInFrames: summe(ROH), ordner: 'Wissen'},
  {id: 'GPS-Short', component: GpsShort, format: 'vertical', durationInFrames: summe(TON), ordner: 'Wissen'},
];
