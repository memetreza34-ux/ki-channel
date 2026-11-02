import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame} from 'remotion';
import {Sfx} from '../../kit/Stage';
import type {Project} from '../types';
import {AKZENT, BG, Globus, HELL, STAHL, Titel, clamp, outQuint, zahl} from './bausteine';
import {Formel} from './erklaer-werkzeuge';
import {Callout, EckTag, Kapitel, MessPanel, StatusChip, Videouhr} from './technik-bausteine';

/**
 * GPS – stummer Rohschnitt (Phase 3 vorgezogen auf Armans „los“, 2026-11-02).
 * Zeiten geschätzt: ≈ 3 Wörter/s je Absatz aus kanal/shorts/2026-11-02_bis_2026-11-08/gps-handy/audio/script.txt.
 * Kommt die Aufnahme, werden die Szenengrenzen auf die echten Absatzzeiten gelegt und der Sprechtext-Streifen
 * durch `Untertitel` ersetzt. Fakten + Quellen: projekte/gps-handy/skript.md.
 */

// Szenenlängen in Frames (Wörter je Absatz × 10)
const LAENGEN = [140, 210, 220, 250, 310, 220, 250, 250];
const START = LAENGEN.map((_, i) => LAENGEN.slice(0, i).reduce((s, x) => s + x, 0));
const GESAMT = LAENGEN.reduce((s, x) => s + x, 0);

const SPRECHTEXT = [
  'Dein Handy schickt für GPS kein einziges Signal ins All. Es hört nur zu.',
  'Über dir kreisen gut dreißig GPS-Satelliten – in rund 20.000 km Höhe, zweimal am Tag um die Erde.',
  'Jeder funkt nur zwei Dinge: Wo bin ich? Wie spät ist es bei mir? Gemessen mit Atomuhren.',
  'Das Signal braucht etwa 7 Hundertstelsekunden. Aus Zeit wird Entfernung.',
  'Drei Kugeln schneiden sich in einem Punkt. Der vierte Satellit gleicht die Handyuhr aus. Dieser Punkt bist du.',
  'Da oben vergeht die Zeit schneller: 38 Millionstelsekunden pro Tag.',
  'Ohne Einsteins Korrektur verrutscht dein Standort jeden Tag um rund 10 km.',
  'Deshalb werden die Uhren vor dem Start langsamer gestellt. Und dein Handy? Sendet nichts.',
];

const MONO = 'JetBrains Mono, monospace';
const SPACE = 'Space Grotesk, sans-serif';
const INTER = 'Inter, sans-serif';
const BLAU = '#9FB8FF';

const ein = (f: number, ab: number, dauer = 12) => interpolate(f, [ab, ab + dauer], [0, 1], {...clamp, easing: outQuint});

/* ───────────── Requisiten ───────────── */

/** Handy von vorn: Rahmen, Bildschirm mit Standort-Pin. */
const Handy: React.FC<{x: number; y: number; s?: number; pin?: number}> = ({x, y, s = 1, pin = 1}) => (
  <div style={{position: 'absolute', left: x - 120 * s, top: y - 230 * s, width: 240 * s, height: 460 * s, borderRadius: 44 * s, background: '#1B2440', border: `${6 * s}px solid #3A4A70`, boxShadow: '0 30px 60px rgba(0,0,0,0.5)'}}>
    <div style={{position: 'absolute', inset: 14 * s, borderRadius: 32 * s, background: 'linear-gradient(160deg,#22325C,#131C34)', overflow: 'hidden'}}>
      {[0.25, 0.5, 0.75].map((p) => (
        <div key={p} style={{position: 'absolute', left: 0, right: 0, top: `${p * 100}%`, height: 2, background: '#2E4070'}} />
      ))}
      {[0.33, 0.66].map((p) => (
        <div key={p} style={{position: 'absolute', top: 0, bottom: 0, left: `${p * 100}%`, width: 2, background: '#2E4070'}} />
      ))}
      <div style={{position: 'absolute', left: '50%', top: '46%', width: 34 * s, height: 34 * s, marginLeft: -17 * s, marginTop: -17 * s, borderRadius: '50%', background: AKZENT, transform: `scale(${pin})`, boxShadow: `0 0 ${24 * s}px ${AKZENT}`}} />
    </div>
  </div>
);

/** Satellit von vorn: Körper, zwei Solarflügel, Antenne. `durchsicht` zeigt die Atomuhr im Inneren. */
const Satellit: React.FC<{x: number; y: number; s?: number; durchsicht?: number; drehung?: number}> = ({x, y, s = 1, durchsicht = 0, drehung = 0}) => (
  <svg width={520 * s} height={260 * s} viewBox="-260 -130 520 260" style={{position: 'absolute', left: x - 260 * s, top: y - 130 * s, overflow: 'visible', transform: `rotate(${drehung}deg)`}}>
    {[-1, 1].map((seite) => (
      <g key={seite}>
        <rect x={seite < 0 ? -250 : 90} y={-55} width={160} height={110} rx={6} fill="#1E3266" stroke={BLAU} strokeOpacity={0.6} strokeWidth={3} />
        {[0, 1, 2, 3].map((i) => (
          <line key={i} x1={seite < 0 ? -250 + i * 40 : 90 + i * 40} x2={seite < 0 ? -250 + i * 40 : 90 + i * 40} y1={-55} y2={55} stroke={BLAU} strokeOpacity={0.35} strokeWidth={2} />
        ))}
        <line x1={seite * 60} x2={seite * 90} y1={0} y2={0} stroke={BLAU} strokeWidth={6} />
      </g>
    ))}
    <rect x={-60} y={-70} width={120} height={140} rx={12} fill={durchsicht > 0.5 ? 'rgba(159,184,255,0.12)' : '#C9CFDD'} stroke={durchsicht > 0.5 ? BLAU : '#8A93A8'} strokeWidth={4} />
    <line x1={0} x2={0} y1={70} y2={110} stroke="#C9CFDD" strokeWidth={6} />
    <circle cx={0} cy={118} r={12} fill="#C9CFDD" />
    {durchsicht > 0 ? (
      <g opacity={durchsicht}>
        <rect x={-36} y={-40} width={72} height={80} rx={8} fill="none" stroke={AKZENT} strokeWidth={4} />
        <circle cx={0} cy={0} r={22} fill="none" stroke={AKZENT} strokeWidth={4} />
        <circle cx={0} cy={0} r={6} fill={AKZENT} />
      </g>
    ) : null}
  </svg>
);

/** Funkwelle als Ringe, die sich von (x,y) aus nach unten ausbreiten. */
const Wellen: React.FC<{x: number; y: number; ab: number; anzahl?: number; reichweite?: number}> = ({x, y, ab, anzahl = 3, reichweite = 380}) => {
  const f = useCurrentFrame();
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      {Array.from({length: anzahl}, (_, i) => {
        const t = ((f - ab - i * 12) % 36) / 36;
        if (f < ab + i * 12) return null;
        const r = 40 + t * reichweite;
        // Bogen unterhalb des Senders (35°–145°), wandert nach unten
        const pts = Array.from({length: 13}, (_, k) => {
          const a = ((35 + k * 9) * Math.PI) / 180;
          return `${(x + Math.cos(a) * r).toFixed(1)},${(y + Math.sin(a) * r).toFixed(1)}`;
        });
        return <polyline key={i} points={pts.join(' ')} fill="none" stroke={BLAU} strokeWidth={5} strokeLinecap="round" opacity={(1 - t) * 0.9} />;
      })}
    </svg>
  );
};

const Sprechtext: React.FC<{text: string}> = ({text}) => {
  const f = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: 80, right: 80, top: 1470, padding: '18px 26px', borderRadius: 18, background: 'rgba(10,15,28,0.8)', borderLeft: `8px solid ${AKZENT}`, fontFamily: SPACE, fontWeight: 700, fontSize: 40, lineHeight: 1.25, color: HELL, opacity: ein(f, 0, 8)}}>
      {text}
    </div>
  );
};

/* ───────────── Szenen ───────────── */

/** 1 · Hook: Pfeil nach oben wird durchgestrichen, dann kommen Wellen von oben herein. */
const S1: React.FC = () => {
  const f = useCurrentFrame();
  const pfeil = ein(f, 4, 14);
  const kreuz = ein(f, 34, 10);
  const pin = spring({frame: f - 80, fps: 30, config: {damping: 12, stiffness: 160}});
  return (
    <AbsoluteFill>
      <Handy x={540} y={1050} pin={f < 80 ? 0.6 : 0.6 + 0.4 * pin} />
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        <g opacity={pfeil * (1 - ein(f, 60, 10))}>
          <line x1={540} y1={780} x2={540} y2={780 - 230 * pfeil} stroke={HELL} strokeWidth={10} strokeLinecap="round" />
          <path d={`M510,${590 + (1 - pfeil) * 230} L540,${550 + (1 - pfeil) * 230} L570,${590 + (1 - pfeil) * 230}`} fill="none" stroke={HELL} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          <line x1={440} y1={570} x2={440 + 200 * kreuz} y2={570 + 200 * kreuz} stroke={AKZENT} strokeWidth={14} strokeLinecap="round" />
          <line x1={640} y1={570} x2={640 - 200 * kreuz} y2={570 + 200 * kreuz} stroke={AKZENT} strokeWidth={14} strokeLinecap="round" />
        </g>
      </svg>
      <Wellen x={540} y={560} ab={64} reichweite={240} />
      <StatusChip top={1330} zustaende={[{text: 'Sendet nicht', ab: 34, akzent: true}, {text: 'Empfängt nur', ab: 80}]} />
      <Sfx name="kTick" at={6} volume={0.35} />
      <Sfx name="kFalsch" at={34} volume={0.35} />
      <Sfx name="kPop" at={80} volume={0.4} />
    </AbsoluteFill>
  );
};

/** 2 · Erde mit Bahnringen, Satelliten kreisen, Höhe zählt hoch. */
const S2: React.FC = () => {
  const f = useCurrentFrame();
  const auf = ein(f, 0, 16);
  const R = 200;
  const cx = 540;
  const cy = 820;
  const bahnen = [0, 30, 60, 90, 120, 150];
  const hoehe = Math.round(interpolate(f, [30, 110], [0, 20200], {...clamp, easing: outQuint}) / 100) * 100;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: cx - R - 20, top: cy - R - 20, transform: `scale(${0.9 + 0.1 * auf})`, opacity: auf}}>
        <Globus R={R} lon0={10 + f * 0.15} lat0={25} id="gps-erde" />
      </div>
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        {bahnen.map((w, i) => {
          const sicht = ein(f, 8 + i * 5, 14);
          const winkel = (f * 0.9 + i * 47) * (Math.PI / 180);
          const rx = 420;
          const ry = 120;
          const lx = Math.cos(winkel) * rx;
          const ly = Math.sin(winkel) * ry;
          const rad = (w * Math.PI) / 180;
          const sx = cx + lx * Math.cos(rad) - ly * Math.sin(rad);
          const sy = cy + lx * Math.sin(rad) + ly * Math.cos(rad);
          const vorn = Math.sin(winkel) > 0;
          return (
            <g key={w} opacity={sicht}>
              <ellipse cx={cx} cy={cy} rx={rx} ry={ry} transform={`rotate(${w} ${cx} ${cy})`} fill="none" stroke={BLAU} strokeOpacity={0.35} strokeWidth={2} strokeDasharray="6 10" />
              <circle cx={sx} cy={sy} r={vorn ? 12 : 8} fill={vorn ? HELL : '#6E7FA6'} />
            </g>
          );
        })}
      </svg>
      <div style={{position: 'absolute', left: 80, right: 80, top: 1170, display: 'flex', alignItems: 'baseline', gap: 18, opacity: ein(f, 26)}}>
        <div style={{fontFamily: INTER, fontWeight: 800, fontSize: 150, letterSpacing: '-0.05em', color: HELL, fontVariantNumeric: 'tabular-nums'}}>{zahl(hoehe)}</div>
        <div style={{fontFamily: SPACE, fontWeight: 700, fontSize: 72, color: AKZENT}}>km</div>
      </div>
      <div style={{position: 'absolute', left: 80, top: 1340, fontFamily: SPACE, fontWeight: 700, fontSize: 40, color: HELL, opacity: ein(f, 120)}}>
        Höhe · <span style={{color: AKZENT}}>2×</span> am Tag um die Erde
      </div>
      <div style={{position: 'absolute', left: 80, top: 1400, fontFamily: MONO, fontSize: 28, letterSpacing: '0.06em', color: STAHL, opacity: ein(f, 120)}}>QUELLE: GPS.GOV · BAHNEN NICHT MASSSTABSGETREU</div>
      <Sfx name="kWhoosh" at={0} volume={0.35} />
      {[30, 60, 90].map((d) => (
        <Sfx key={d} name="kTick" at={d} volume={0.3} />
      ))}
      <Sfx name="kPop" at={120} volume={0.35} />
    </AbsoluteFill>
  );
};

/** 3 · Satellit groß, Röntgen auf die Atomuhr, Datenpaket „Ort + Zeit“. */
const S3: React.FC = () => {
  const f = useCurrentFrame();
  const auf = ein(f, 0, 18);
  const roe = ein(f, 70, 14);
  const paket = (ab: number) => ({opacity: ein(f, ab, 10), transform: `translateY(${(1 - ein(f, ab, 10)) * 16}px)`});
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${0.85 + 0.15 * auf})`, transformOrigin: '540px 720px'}}>
        <Satellit x={540} y={720} s={1.5} durchsicht={roe} drehung={-6 + f * 0.02} />
      </div>
      <Callout punkt={[540, 720]} text="Atomuhr" ab={78} versatz={[220, 200]} akzent />
      <div style={{position: 'absolute', left: 80, right: 80, top: 1080, display: 'flex', flexDirection: 'column', gap: 18}}>
        <div style={{...paket(24), padding: '18px 26px', borderRadius: 18, background: 'rgba(10,15,28,0.86)', border: '2px solid #2A3654', display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 34, color: HELL}}>
          <span style={{color: STAHL}}>WO BIN ICH?</span>
          <span>BAHN · POSITION</span>
        </div>
        <div style={{...paket(46), padding: '18px 26px', borderRadius: 18, background: 'rgba(10,15,28,0.86)', border: '2px solid #2A3654', display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 34, color: HELL}}>
          <span style={{color: STAHL}}>WIE SPÄT?</span>
          <span style={{color: AKZENT}}>12:00:00,000 000</span>
        </div>
      </div>
      <Sfx name="kWhoosh" at={0} volume={0.3} />
      <Sfx name="kTipp" at={24} volume={0.35} />
      <Sfx name="kTipp" at={46} volume={0.35} />
      <Sfx name="kDing" at={78} volume={0.4} />
    </AbsoluteFill>
  );
};

/** 4 · Signal wandert zum Handy, Laufzeit wird zur Entfernung. */
const S4: React.FC = () => {
  const f = useCurrentFrame();
  const lauf = interpolate(f, [20, 90], [0, 1], clamp);
  const zeit = 0.067 * lauf;
  const y = 640 + lauf * 210;
  return (
    <AbsoluteFill>
      <Satellit x={540} y={600} s={0.7} />
      <Handy x={540} y={980} s={0.55} pin={0.6} />
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        <line x1={540} y1={650} x2={540} y2={850} stroke={BLAU} strokeOpacity={0.3} strokeWidth={4} strokeDasharray="8 10" />
        {lauf > 0 && lauf < 1 ? <circle cx={540} cy={y} r={16} fill={BLAU} style={{filter: `drop-shadow(0 0 16px ${BLAU})`}} /> : null}
      </svg>
      <MessPanel
        top={1120}
        zeilen={[
          {label: 'Laufzeit', wert: `${zeit.toFixed(3).replace('.', ',')} s`},
          {label: '× Lichtgeschw.', wert: '299.792 km/s'},
          {label: '= Entfernung', wert: f >= 130 ? '≈ 20.000 km' : '…', akzent: true, puls: interpolate(f, [130, 135, 144], [0, 1, 0], clamp)},
        ]}
      />
      <StatusChip top={1060} zustaende={[{text: 'Signal unterwegs', ab: 20}, {text: 'Angekommen', ab: 90, akzent: true}]} />
      <Sfx name="kSwish" at={20} volume={0.35} />
      <Sfx name="kLanden" at={90} volume={0.35} />
      <Sfx name="kDing" at={130} volume={0.45} />
    </AbsoluteFill>
  );
};

/** 5 · Drei Kugeln (hier Kreise) schneiden sich im Standort, vierter Satellit stellt die Uhr. */
const S5: React.FC = () => {
  const f = useCurrentFrame();
  const P: [number, number] = [540, 940];
  const sats: Array<[number, number]> = [
    [340, 790],
    [760, 800],
    [580, 1160],
  ];
  const treffer = spring({frame: f - 150, fps: 30, config: {damping: 11, stiffness: 160}});
  const vierter = ein(f, 175, 14);
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        {sats.map(([sx, sy], i) => {
          const d = Math.hypot(P[0] - sx, P[1] - sy);
          const r = d * interpolate(f, [20 + i * 35, 70 + i * 35], [0, 1], {...clamp, easing: outQuint});
          return (
            <g key={i}>
              <circle cx={sx} cy={sy} r={r} fill={BLAU} fillOpacity={0.05} stroke={BLAU} strokeOpacity={0.55} strokeWidth={3} strokeDasharray="10 8" />
              <rect x={sx - 22} y={sy - 14} width={44} height={28} rx={5} fill="#C9CFDD" />
              <rect x={sx - 54} y={sy - 9} width={28} height={18} fill="#1E3266" stroke={BLAU} strokeWidth={2} />
              <rect x={sx + 26} y={sy - 9} width={28} height={18} fill="#1E3266" stroke={BLAU} strokeWidth={2} />
            </g>
          );
        })}
        <circle cx={P[0]} cy={P[1]} r={18 + treffer * 10} fill={AKZENT} opacity={f >= 150 ? 1 : 0} style={{filter: `drop-shadow(0 0 20px ${AKZENT})`}} />
        <g opacity={vierter}>
          <rect x={900 - 22} y={600} width={44} height={28} rx={5} fill="#C9CFDD" />
          <line x1={900} y1={628} x2={P[0] + 20} y2={P[1] - 20} stroke={HELL} strokeOpacity={0.5} strokeWidth={3} strokeDasharray="4 8" />
        </g>
      </svg>
      <Callout punkt={P} text="Das bist du" ab={230} versatz={[-260, 170]} akzent />
      <StatusChip top={1400} zustaende={[{text: 'Satellit 1 · 2 · 3', ab: 20}, {text: 'Satellit 4 stellt die Uhr', ab: 175}, {text: 'Position gefunden', ab: 230, akzent: true}]} />
      {[20, 55, 90].map((d) => (
        <Sfx key={d} name="kTick" at={d} volume={0.3} />
      ))}
      <Sfx name="kPop" at={150} volume={0.45} />
      <Sfx name="kTipp" at={175} volume={0.35} />
      <Sfx name="kErfolg" at={230} volume={0.4} />
    </AbsoluteFill>
  );
};

/** 6 · Zwei Uhren: oben läuft die Zeit schneller, Formel +45 − 7 = +38 µs. */
const S6: React.FC = () => {
  const f = useCurrentFrame();
  const tage = Math.floor(interpolate(f, [20, 140], [0, 3], clamp));
  const Uhr: React.FC<{ort: string; vor: number; akzent?: boolean}> = ({ort, vor, akzent}) => (
    <div style={{flex: 1, padding: '24px 26px', borderRadius: 22, background: 'rgba(10,15,28,0.86)', border: `2px solid ${akzent ? AKZENT : '#2A3654'}`}}>
      <div style={{fontFamily: MONO, fontSize: 28, letterSpacing: '0.08em', color: STAHL}}>{ort}</div>
      <div style={{fontFamily: INTER, fontWeight: 800, fontSize: 64, letterSpacing: '-0.03em', color: akzent ? AKZENT : HELL, fontVariantNumeric: 'tabular-nums', marginTop: 10}}>+{vor} µs</div>
    </div>
  );
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 80, right: 80, top: 540, display: 'flex', gap: 28, opacity: ein(f, 0)}}>
        <Uhr ort="ERDE" vor={0} />
        <Uhr ort="SATELLIT" vor={tage * 38} akzent />
      </div>
      <div style={{position: 'absolute', left: 80, top: 760, fontFamily: SPACE, fontWeight: 700, fontSize: 44, color: HELL, opacity: ein(f, 20)}}>
        nach <span style={{color: AKZENT, fontVariantNumeric: 'tabular-nums'}}>{tage}</span> {tage === 1 ? 'Tag' : 'Tagen'}
      </div>
      <Sequence from={140} layout="none">
        <div style={{position: 'absolute', left: 0, right: 0, top: 940, display: 'flex', justifyContent: 'center'}}>
          <Formel tex={'+45 - 7 = \\akzent{+38}\\,\\mu s'} groesse={96} pulsAb={22} />
        </div>
        <div style={{position: 'absolute', left: 80, right: 80, top: 1150, display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 28, letterSpacing: '0.06em', color: STAHL}}>
          <span>SCHWERKRAFT +45</span>
          <span>TEMPO −7</span>
          <span style={{color: AKZENT}}>PRO TAG</span>
        </div>
      </Sequence>
      <div style={{position: 'absolute', left: 80, top: 1400, fontFamily: MONO, fontSize: 28, letterSpacing: '0.06em', color: STAHL, opacity: ein(f, 150)}}>QUELLE: R. POGGE, OHIO STATE UNIVERSITY</div>
      {[60, 100, 140].map((d) => (
        <Sfx key={d} name="kTick" at={d} volume={0.3} />
      ))}
      <Sfx name="kDing" at={162} volume={0.45} />
    </AbsoluteFill>
  );
};

/** 7 · Stadtplan: der Standortpunkt driftet weg, Videouhr zählt die Meter seit Videobeginn. */
const S7: React.FC = () => {
  const f = useCurrentFrame();
  // Maßstab: 100 px = 1 m; Drift 0,116 m/s (10 km ÷ 86.400 s)
  const drift = (f / 30) * 0.116 * 100;
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, opacity: ein(f, 0, 14)}}>
        <defs>
          <clipPath id="gps-plan">
            <rect x={80} y={560} width={920} height={560} rx={28} />
          </clipPath>
        </defs>
        <g clipPath="url(#gps-plan)">
          <rect x={80} y={560} width={920} height={560} fill="#16203A" />
          {[620, 760, 900, 1040].map((y) => (
            <rect key={y} x={80} y={y} width={920} height={28} fill="#22305A" />
          ))}
          {[200, 420, 640, 860].map((x) => (
            <rect key={x} x={x} y={560} width={28} height={560} fill="#22305A" />
          ))}
        </g>
        <circle cx={430} cy={834} r={20} fill="none" stroke={HELL} strokeWidth={4} />
        <circle cx={430 + drift} cy={834 - drift * 0.35} r={18} fill={AKZENT} style={{filter: `drop-shadow(0 0 16px ${AKZENT})`}} />
        <line x1={120} x2={220} y1={1090} y2={1090} stroke={HELL} strokeWidth={4} />
        <text x={230} y={1100} fontFamily={MONO} fontSize={28} fill={HELL}>1 m</text>
      </svg>
      <div style={{position: 'absolute', left: 80, top: 1130, display: 'flex', gap: 28, fontFamily: MONO, fontSize: 28, letterSpacing: '0.06em', color: STAHL, opacity: ein(f, 10)}}>
        <span>○ ECHT</span>
        <span style={{color: AKZENT}}>● OHNE KORREKTUR</span>
      </div>
      <Videouhr proSekunde={0.116} einheit="m" stellen={1} start={-START[6]} top={1210} />
      <div style={{position: 'absolute', left: 80, top: 1330, fontFamily: SPACE, fontWeight: 700, fontSize: 40, color: HELL, opacity: ein(f, 20)}}>
        seit Videobeginn · <span style={{color: AKZENT}}>≈ 10 km</span> pro Tag
      </div>
      <Sfx name="kAnstieg" at={10} volume={0.3} />
    </AbsoluteFill>
  );
};

/** 8 · Uhr wird vor dem Start langsamer gestellt, dann zurück zum Handy (Loop zu Szene 1). */
const S8: React.FC = () => {
  const f = useCurrentFrame();
  const zurueck = ein(f, 150, 20);
  return (
    <AbsoluteFill>
      <div style={{opacity: 1 - zurueck}}>
        <Satellit x={540} y={700} s={1.2} durchsicht={1} />
        <div style={{position: 'absolute', left: 80, right: 80, top: 960, padding: '26px 34px 30px 44px', borderRadius: 28, background: 'rgba(10,15,28,0.86)', border: '2px solid #2A3654'}}>
          <div style={{position: 'absolute', left: 0, top: 24, bottom: 24, width: 10, borderRadius: 5, background: AKZENT}} />
          <div style={{fontFamily: MONO, fontSize: 30, letterSpacing: '0.06em', color: STAHL}}>UHR-TAKT SOLL</div>
          <div style={{fontFamily: INTER, fontWeight: 800, fontSize: 64, letterSpacing: '-0.03em', color: HELL, fontVariantNumeric: 'tabular-nums'}}>10,23 MHz</div>
          <div style={{fontFamily: MONO, fontSize: 30, letterSpacing: '0.06em', color: STAHL, marginTop: 14, opacity: ein(f, 50)}}>VOR DEM START EINGESTELLT</div>
          <div style={{fontFamily: INTER, fontWeight: 800, fontSize: 64, letterSpacing: '-0.03em', color: AKZENT, fontVariantNumeric: 'tabular-nums', opacity: ein(f, 60), transform: `scale(${1 + interpolate(f, [60, 65, 74], [0, 1, 0], clamp) * 0.05})`, transformOrigin: 'left center'}}>10,229 999 995 43 MHz</div>
        </div>
        <div style={{position: 'absolute', left: 80, top: 1390, fontFamily: MONO, fontSize: 28, letterSpacing: '0.06em', color: STAHL, opacity: ein(f, 70)}}>QUELLE: N. ASHBY, LIVING REVIEWS (2003)</div>
      </div>
      <div style={{opacity: zurueck}}>
        <Handy x={540} y={1050} pin={0.6} />
      </div>
      <Sfx name="kTipp" at={60} volume={0.4} />
      <Sfx name="kWhoosh" at={150} volume={0.35} />
    </AbsoluteFill>
  );
};

const SZENEN = [S1, S2, S3, S4, S5, S6, S7, S8];
const KAPITEL = ['Dein Handy', 'Die Satelliten', 'Das Signal', 'Zeit wird Weg', 'Der Schnittpunkt', 'Einstein', 'Während du schaust', 'Die Lösung'];

const GpsRohschnitt: React.FC = () => (
  <AbsoluteFill style={{background: BG}}>
    <Titel text={<>So weiß dein Handy, <span style={{color: AKZENT}}>wo du bist</span></>} />
    <EckTag texte={['Rohschnitt · ohne Ton', 'Illustration']} top={130} />
    <Kapitel top={450} abschnitte={KAPITEL.map((text, i) => ({text, ab: START[i]}))} />
    {SZENEN.map((Szene, i) => (
      <Sequence key={i} from={START[i]} durationInFrames={LAENGEN[i]} layout="none">
        <Szene />
        <Sprechtext text={SPRECHTEXT[i]} />
      </Sequence>
    ))}
  </AbsoluteFill>
);

export const gpsRohschnitt: Project[] = [{id: 'GPS-Rohschnitt', component: GpsRohschnitt, format: 'vertical', durationInFrames: GESAMT, ordner: 'Wissen'}];
