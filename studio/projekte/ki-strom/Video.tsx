import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {clamp01, EASE, mix, Sfx, type SfxName} from '../../kit';
import type {Project} from '../types';
import {KANAL, StilContext, Toki, type Blick, type Gesicht} from '../kanal-look/stil';
import {Filmklappe, GRAU, GRUEN, GRUEN_D, Helm, INK, Korn, Licht, Papierstapel, SOFT, Stecker, Vignette} from './bausteine';
import {BODEN, KAPITEL, QUELLEN, SPALTEN, STAPEL_START, STATIONEN} from './stationen';
import {A1, A12, A14, A15, A2, A3, A4, A5, A6, A7, A8, A9, A10, A11, A13, DAUER_S, FPS, p, S, VOICEOVER} from './zeit';

/**
 * „Wie viel Strom frisst KI wirklich?“ (Serie Recht & Gesellschaft, Premium-Stil)
 *
 * Eine durchgehende Welt: 15 Stationen an einer grünen Leitung, die Kamera
 * fährt von Station zu Station (ein Stromimpuls läuft voraus) und schiebt
 * sich innerhalb einer Station auf das, worüber gerade gesprochen wird.
 * Held ist der Stromzähler mit rollendem Zählwerk. Alle Zeiten kommen aus
 * Armans Aufnahme (`woerter.json`).
 */

const W = 2400;
const KABEL_Y = BODEN + 30;
const PAN_VOR = 0.45;
const PAN_DAUER = 1.1;
const ANZAHL = STATIONEN.length;

/* ═════════════ Wert-Spuren ═════════════ */

type Taste = {t: number; v: number; d: number};
const spur = (keys: Taste[], t: number, start: number) => {
  let v = start;
  for (let i = 0; i < keys.length; i++) {
    const kf = keys[i];
    if (kf.t > t) break;
    const tau = Math.min(t, keys[i + 1]?.t ?? Infinity);
    v = mix(v, kf.v, EASE.inOut(clamp01((tau - kf.t) / kf.d)));
  }
  return v;
};

/* ═════════════ Kamera ═════════════ */

type Kam = {t: number; st: number; z?: number; fx?: number; fy?: number; d?: number};
const KAMERA: Kam[] = [
  {t: 0, st: 0, z: 1.0},
  {t: 1.0, st: 0, z: 1.03, fx: 980, fy: 520, d: 12},
  {t: A1.heutigen + 0.8, st: 0, z: 1.05, fx: 1080, fy: 500, d: 1.4},
  // Kühltürme: Blick hoch, dann Titel
  {t: A2.atom, st: 1, z: 1.0, fy: 500, d: 1.4},
  // „Wie passt das zusammen?“ – von der winzigen Zahl hoch zu den Türmen
  {t: A2.wie - 0.1, st: 1, z: 1.15, fx: 560, fy: 640, d: 1.0},
  {t: A2.einzelne + 0.9, st: 1, z: 0.98, fx: 1250, fy: 430, d: 1.6},
  {t: A2.genau - 0.3, st: 1, z: 1.03, fx: 860, fy: 470, d: 1.2},
  // Zähler und Quellen
  {t: A3.google - 0.3, st: 2, z: 1.06, fx: 1110, fy: 540, d: 1.0},
  {t: A3.drei - 0.2, st: 2, z: 1.0, d: 1.0},
  // Wasserkocher
  {t: A4.das - 0.1, st: 3, z: 1.08, fx: 1180, fy: 560, d: 0.8},
  {t: A4.kocher, st: 3, z: 1.0, d: 1.0},
  // 33×
  {t: A5.google - 0.2, st: 4, z: 1.06, fx: 1250, fy: 480, d: 1.0},
  // Zählwerk springt auf 40
  {t: A6.epoch - 0.4, st: 5, z: 1.06, fx: 1150, fy: 560, d: 1.0},
  {t: A6.modelle, st: 5, z: 1.0, d: 1.0},
  // Zoom durch das Zählwerk in die nächste Station
  {t: S[6] - 0.75, st: 5, z: 3.0, fx: 1270, fy: 409, d: 0.6},
  {t: S[6] - 0.12, st: 6, z: 1.35, fx: 960, fy: 540, d: 0.02},
  {t: S[6] - 0.08, st: 6, z: 1.0, d: 0.9},
  // Video: erst die 940 Wh, dann ein Punkt ganz nah – und weit heraus auf alle Punkte
  {t: A7.v940 - 0.6, st: 6, z: 1.12, fx: 1250, fy: 380, d: 0.8},
  {t: A7.v3000 - 1.0, st: 6, z: 2.4, fx: 690, fy: 430, d: 0.6},
  {t: A7.v3000 - 0.2, st: 6, z: 0.94, fx: 1000, fy: 560, d: 2.6},
  {t: A7.andere, st: 6, z: 1.0, fx: 960, fy: 540, d: 1.0},
  // Training
  {t: A8.trainiert - 0.3, st: 7, z: 1.08, fx: 1440, fy: 470, d: 1.0},
  // 485 → Deutschland → +50 %
  {t: A9.v485 - 1.2, st: 8, z: 1.06, fx: 760, fy: 480, d: 1.2},
  {t: A9.deutschland - 0.3, st: 8, z: 1.0, fx: 1060, d: 1.0},
  // Prognose
  {t: A10.teil - 0.2, st: 9, z: 1.05, fx: 1080, d: 1.2},
  // Irland
  {t: A11.irland - 0.2, st: 10, z: 1.07, fx: 760, d: 1.0},
  {t: A11.viertel, st: 10, z: 1.0, fx: 960, d: 1.0},
  // Three Mile Island
  {t: A12.j1979 - 0.3, st: 11, z: 1.05, fy: 430, d: 1.2},
  {t: A12.google - 0.2, st: 11, z: 1.0, fy: 540, d: 1.0},
  // Wasser
  {t: A13.beide - 0.2, st: 12, z: 1.04, d: 1.0},
  // Drei Gedanken
  {t: A14.erstens - 0.3, st: 13, z: 1.12, fx: SPALTEN[0], fy: 500, d: 0.9},
  {t: A14.zweitens - 0.3, st: 13, z: 1.12, fx: SPALTEN[1], fy: 500, d: 0.9},
  {t: A14.drittens - 0.3, st: 13, z: 1.12, fx: SPALTEN[2], fy: 500, d: 0.9},
  // Ende: ein Punkt ganz nah, dann Milliarden
  {t: A15.halten - 0.2, st: 14, z: 1.35, fx: 960, fy: 444, d: 0.8},
  {t: A15.milliarden - 0.2, st: 14, z: 0.96, fx: 960, fy: 540, d: 2.2},
  {t: A15.wenn + 0.5, st: 14, z: 1.0, d: 1.2},
  ...S.slice(1)
    .map((s, i): Kam => ({t: s - PAN_VOR, st: i + 1, z: 1, fx: 960, fy: 540, d: PAN_DAUER}))
    .filter((k) => k.st !== 6),
].sort((a, b) => a.t - b.t);

const KAM_X = KAMERA.map((k) => ({t: k.t, v: k.st * W + (k.fx ?? 960), d: k.d ?? 0.8}));
const KAM_Y = KAMERA.map((k) => ({t: k.t, v: k.fy ?? 540, d: k.d ?? 0.8}));
const KAM_Z = KAMERA.map((k) => ({t: k.t, v: k.z ?? 1, d: k.d ?? 0.8}));

/** Jede zweite Fahrt zieht kurz auf (Kran statt immer gleicher Seitwärtsfahrt). */
const kranFaktor = (t: number) => {
  for (let i = 1; i < S.length; i++) {
    const q = (t - (S[i] - PAN_VOR)) / PAN_DAUER;
    if (q > 0 && q < 1 && i % 2 === 1 && i !== 6) return 1 - 0.08 * Math.sin(q * Math.PI);
  }
  return 1;
};

const kamera = (t: number) => ({
  fx: spur(KAM_X, t, 960) + 12 * Math.sin(t * 0.21),
  fy: spur(KAM_Y, t, 540) + 6 * Math.sin(t * 0.17 + 1),
  z: spur(KAM_Z, t, 1) * (1 + 0.006 * Math.sin(t * 0.13)) * kranFaktor(t),
});

/* ═════════════ Toki ═════════════ */

type TK = {t: number; st?: number; x?: number; dur?: number; hop?: number; aL?: number; aR?: number; look?: Blick; gesicht?: Gesicht; k?: number};

const TOKI_ROH: TK[] = [
  {t: 0, st: 0, x: 1740, aR: 52, aL: 16, look: [-0.2, -0.1], gesicht: 'neutral', k: 1.0},
  {t: A1.zeitungen, look: [-0.7, -0.6]},
  {t: A1.problem, gesicht: 'ernst', look: [-0.8, -0.2]},
  {t: A1.heutigen + 0.1, gesicht: 'staunen'},
  {t: A1.hoch, gesicht: 'freude', look: [-0.6, -0.3]},
  {t: A2.bevor - 0.3, aR: 18},
  {t: A2.gleichzeitig + 0.4, look: [0.7, -0.9], gesicht: 'neutral'},
  {t: A2.atom, gesicht: 'staunen'},
  {t: A2.wie, gesicht: 'verwirrt', look: [-0.5, 0]},
  {t: A2.trotzdem, look: [0.8, -0.8]},
  {t: A2.genau, gesicht: 'freude', look: [-0.3, -0.6]},
  {t: A3.frage + 0.5, look: [0.9, -0.2], gesicht: 'neutral'},
  {t: A3.google, look: [0.9, -0.5]},
  {t: A3.passen, gesicht: 'freude'},
  {t: A4.led, look: [-0.9, -0.4], gesicht: 'neutral'},
  {t: A4.rate - 0.2, st: 3, x: 960, dur: 0.8},
  {t: A4.hundert, look: [-0.9, -0.3], gesicht: 'denken'},
  {t: A4.liter, look: [0.9, -0.3]},
  {t: A4.das, gesicht: 'staunen', aR: 60},
  {t: A4.deutlich, gesicht: 'freude', aR: 18, look: [-0.8, -0.4]},
  {t: A5.alte, aL: 100, look: [-0.9, -0.6], gesicht: 'denken'},
  {t: A5.erstens + 1.5, aL: 16},
  {t: A5.google, look: [-0.2, -1], gesicht: 'staunen'},
  {t: A5.dreiunddreissigstel + 0.4, gesicht: 'freude'},
  {t: A6.kurze, look: [0.6, -0.4], gesicht: 'neutral'},
  {t: A6.laedst - 0.4, aL: 165, aR: 165, look: [0, -1], gesicht: 'ernst'},
  {t: A6.dokument, aL: 110, aR: 110, look: [0.9, 0]},
  {t: A6.hoch + 0.3, aL: 16, aR: 16},
  {t: A6.v40, gesicht: 'staunen', look: [0.9, -0.5]},
  {t: A6.nachdenken - 0.2, gesicht: 'denken'},
  {t: A7.mit, look: [-0.8, -0.6], gesicht: 'neutral', aL: 70},
  {t: A7.v3000 - 0.6, gesicht: 'staunen', look: [-0.9, -0.2]},
  {t: A7.andere + 0.5, gesicht: 'denken'},
  {t: A7.teuerste, gesicht: 'ernst'},
  {t: S[7] - 0.4, aL: 16},
  {t: A8.chatgpt, look: [-0.9, -0.6], gesicht: 'neutral'},
  {t: A8.milliarden, gesicht: 'staunen'},
  {t: A8.trainiert, look: [-0.2, -1], gesicht: 'neutral'},
  {t: A9.alle, look: [-0.9, -0.5]},
  {t: A9.v485 - 0.3, aL: 130},
  {t: A9.deutschland, aL: 16, aR: 100},
  {t: A9.darin, aR: 18},
  {t: A10.verdreifachen - 0.2, aL: 165, aR: 165},
  {t: A10.verdreifachen + 1.4, aL: 16, aR: 18},
  {t: A11.viertel, aR: 95},
  {t: A11.haushalte + 0.6, aR: 18},
  {t: A12.j2027, aL: 150, aR: 150},
  {t: A12.google - 0.3, aL: 16, aR: 18},
  {t: A9.v485, gesicht: 'staunen'},
  {t: A9.deutschland, look: [0.9, -0.5], gesicht: 'neutral'},
  {t: A9.speziell, look: [0.9, -0.7], gesicht: 'ernst'},
  {t: A10.j2030, look: [0.9, -0.6], gesicht: 'neutral'},
  {t: A10.verdreifachen, gesicht: 'staunen'},
  {t: A11.irland, look: [0.9, -0.6], gesicht: 'neutral'},
  {t: A11.haushalte, gesicht: 'ernst', look: [0.9, -0.2]},
  {t: A12.deshalb, look: [-0.7, -0.9], gesicht: 'neutral'},
  {t: A12.strom, look: [0.8, -0.2]},
  {t: A12.j1979 - 0.2, look: [-0.5, -1], gesicht: 'ernst'},
  {t: A12.j2027, gesicht: 'staunen', look: [0.5, -1]},
  {t: A12.google, look: [-0.9, -0.4], gesicht: 'neutral'},
  {t: A13.google, look: [-0.9, -0.4]},
  {t: A13.flasche, look: [0.9, -0.4], gesicht: 'staunen'},
  {t: A13.beide, gesicht: 'denken', look: [0, -0.4]},
  {t: A14.erstens, gesicht: 'freude', look: [0, -1]},
  {t: A14.zweitens - 0.3, st: 13, x: SPALTEN[1], dur: 0.7, gesicht: 'neutral'},
  {t: A14.drittens - 0.3, st: 13, x: SPALTEN[2], dur: 0.7, gesicht: 'denken'},
  {t: A15.halten + 0.3, look: [0.6, -0.6], gesicht: 'neutral'},
  {t: A15.milliarden, gesicht: 'staunen', look: [0, -0.8]},
  {t: A15.wenn, gesicht: 'freude', look: [0.4, -0.3]},
  {t: A15.abonnieren - 0.25, aR: 115},
  {t: A15.abonnieren + 0.5, aR: 18},
  ...S.slice(1).map(
    (s, i): TK => ({
      st: i + 1,
      x: [0, 760, 330, 1700, 1650, 330, 1800, 1700, 1080, 1660, 200, 540, 960, SPALTEN[0], 700][i + 1],
      // In Station 6 geht es durchs Zählwerk: Toki steht beim Schnitt schon dort.
      ...(i + 1 === 6 ? {t: s - 0.3, dur: 0.05, hop: 0} : {t: s - PAN_VOR, dur: PAN_DAUER, hop: 34}),
    }),
  ),
];
const TOKI = [...TOKI_ROH].sort((a, b) => a.t - b.t);

const BEWEGUNGEN = TOKI.filter((k) => k.x !== undefined);
const tasten = (f: (k: TK) => number | undefined, d: (k: TK) => number) => TOKI.filter((k) => f(k) !== undefined).map((k) => ({t: k.t, v: f(k) as number, d: Math.max(0.01, d(k))}));
const SPUR_X = tasten((k) => (k.x !== undefined ? (k.st ?? 0) * W + k.x : undefined), (k) => k.dur ?? 0.5);
const SPUR_AL = tasten((k) => k.aL, () => 0.25);
const SPUR_AR = tasten((k) => k.aR, () => 0.25);

function letzte<T>(t: number, f: (k: TK) => T | undefined, start: T): T {
  let v = start;
  for (const k of TOKI) {
    if (k.t > t) break;
    const w = f(k);
    if (w !== undefined) v = w;
  }
  return v;
}

const handBei = (x: number, y: number, seite: 1 | -1, grad: number, k: number) => {
  const a = (grad * Math.PI) / 180;
  return {x: x + seite * (99 + 66 * Math.sin(a)) * k, y: y + (-96 + 66 * Math.cos(a)) * k};
};

const tokiZustand = (t: number) => {
  const x = spur(SPUR_X, t, SPUR_X[0].v);
  let y = BODEN;
  let sx = 1;
  let sy = 1;
  for (let i = 0; i < BEWEGUNGEN.length; i++) {
    const b = BEWEGUNGEN[i];
    const dur = b.dur ?? 0.5;
    const ende = b.t + dur;
    const hop = b.hop ?? 22;
    if (t >= b.t && t < ende) {
      const q = (t - b.t) / dur;
      y -= Math.abs(Math.sin(q * Math.PI * 2)) * hop;
    }
    if (t >= ende && t < ende + 0.25) {
      const q = (t - ende) / 0.25;
      sx *= 1 + 0.12 * (1 - q);
      sy *= 1 - 0.14 * (1 - q);
    }
  }
  let aL = spur(SPUR_AL, t, 16);
  let aR = spur(SPUR_AR, t, 18);
  // Tippen ins Eingabefeld
  if (t > A3.fangen + 0.1 && t < A3.frage + 0.5) aR = 122 + 7 * Math.sin(t * 26);
  if (t > A3.seit - 0.15 && t < A3.seit + 0.35) aR = 134;
  if (t > A6.hoch + 0.2 && t < A6.hoch + 1.5) aR = 122 + 7 * Math.sin(t * 26);
  // Begrüßung im Hook
  if (t > 0.25 && t < 1.9) aL = 120 + 26 * Math.sin((t - 0.25) * 9) * Math.sin(Math.min(1, (t - 0.25) / 0.3) * Math.PI * 0.5);
  // Winken am Ende
  if (t > A15.bis - 0.1) aL = 140 + 18 * Math.sin((t - A15.bis) * 9);
  const k = letzte(t, (kk) => kk.k, 1);
  return {x, y, sx, sy, aL, aR, k, look: letzte<Blick>(t, (kk) => kk.look, [0, 0]), gesicht: letzte<Gesicht>(t, (kk) => kk.gesicht, 'neutral')};
};

const TokiWelt: React.FC<{t: number}> = ({t}) => {
  const z = tokiZustand(t);
  const handR = handBei(z.x, z.y, 1, z.aR, z.k);
  const handL = handBei(z.x, z.y, -1, z.aL, z.k);
  // Stecker im Hook
  const stecker = 1 - p(t, A2.bevor - 0.5, 0.3);
  // Papierstapel über dem Kopf (Station 5), bis er losfliegt
  const stapel = t > A6.laedst - 0.5 && t < A6.dokument;
  // Filmklappe (Station 6)
  const klappe = p(t, A7.fuenf - 0.6, 0.4) * (1 - p(t, S[7] - 0.6, 0.3));
  const offen = t < A7.video ? 1 : Math.max(0, 1 - (t - A7.video) / 0.08);
  return (
    <>
      {stecker > 0 ? (
        <div style={{position: 'absolute', left: 0, top: 0, opacity: stecker}}>
          <svg width={2400} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
            <path d={`M${handR.x - 30},${handR.y + 4} C${handR.x - 120},${handR.y + 60} ${handR.x - 40},${KABEL_Y} ${handR.x - 260},${KABEL_Y}`} stroke={GRUEN} strokeWidth={7} fill="none" strokeLinecap="round" />
          </svg>
          <Stecker x={handR.x + 6} y={handR.y - 4} rot={-28} s={0.9} />
        </div>
      ) : null}
      <Toki x={z.x} y={z.y} sx={z.sx} sy={z.sy} k={z.k} armL={z.aL} armR={z.aR} look={z.look} gesicht={z.gesicht} accessoire={<Helm />} />
      {stapel ? (
        <div style={{position: 'absolute', left: 5 * W, top: 0, opacity: p(t, A6.laedst - 0.5, 0.3)}}>
          <Papierstapel x={STAPEL_START.x + (z.x - 5 * W - 210)} y={STAPEL_START.y + (z.y - BODEN) - 60 * (1 - p(t, A6.laedst - 0.5, 0.4))} w={150} blaetter={14} rot={-6} />
        </div>
      ) : null}
      {klappe > 0 ? (
        <div style={{position: 'absolute', left: 0, top: 0, opacity: klappe}}>
          <Filmklappe x={handL.x - 130} y={handL.y - 120} w={150} offen={offen} rot={8} />
        </div>
      ) : null}
    </>
  );
};

/* ═════════════ Kulisse ═════════════ */

const Boden: React.FC = () => (
  <>
    <div style={{position: 'absolute', left: -1600, width: ANZAHL * W + 3200, top: BODEN, height: 700, background: 'linear-gradient(180deg, #EEEBE3 0%, #F3F1EB 100%)'}} />
    <div style={{position: 'absolute', left: -1600, width: ANZAHL * W + 3200, top: BODEN, height: 2, background: '#E2DED3'}} />
    {/* Die Leitung */}
    <div style={{position: 'absolute', left: -1600, width: ANZAHL * W + 3200, top: KABEL_Y + 4, height: 6, background: 'rgba(30,35,50,0.08)', filter: 'blur(3px)'}} />
    <div style={{position: 'absolute', left: -1600, width: ANZAHL * W + 3200, top: KABEL_Y - 3, height: 7, borderRadius: 4, background: GRUEN, opacity: 0.85}} />
  </>
);

/** Stromimpuls läuft während jeder Fahrt die Leitung entlang zur nächsten Station. */
const Impulse: React.FC<{t: number}> = ({t}) => (
  <>
    {S.slice(1).map((s, i) => {
      const q = clamp01((t - (s - PAN_VOR - 0.15)) / (PAN_DAUER + 0.1));
      if (q <= 0 || q >= 1) return null;
      const x = mix(i * W + 1100, (i + 1) * W + 900, EASE.inOut(q));
      return (
        <React.Fragment key={i}>
          <div style={{position: 'absolute', left: x - 60, top: KABEL_Y - 24, width: 120, height: 48, borderRadius: 24, background: 'radial-gradient(closest-side, rgba(14,159,142,0.35), rgba(14,159,142,0))'}} />
          <div style={{position: 'absolute', left: x - 12, top: KABEL_Y - 12, width: 24, height: 24, borderRadius: 12, background: '#FFFFFF', border: `5px solid ${GRUEN}`, boxSizing: 'border-box'}} />
        </React.Fragment>
      );
    })}
  </>
);

const stationBei = (t: number) => {
  let i = 0;
  for (let k = 0; k < S.length; k++) if (t >= S[k] - PAN_VOR) i = k;
  return i;
};

const KapitelSchild: React.FC<{t: number; z: number}> = ({t, z}) => {
  const i = stationBei(t);
  const text = KAPITEL[i];
  if (!text) return null;
  // Bei starkem Zoom rutschen Inhalte nach oben links – dann Platz machen.
  const frei = 1 - clamp01((z - 1.13) / 0.06);
  const q = frei * p(t, S[i] + 0.3, 0.5) * (i + 1 < S.length ? 1 - p(t, S[i + 1] - PAN_VOR - 0.2, 0.3) : 1);
  const nr = KAPITEL.slice(0, i + 1).filter(Boolean).length;
  return (
    <div style={{position: 'absolute', left: 64, top: 48, display: 'flex', alignItems: 'center', gap: 14, fontSize: 26, fontWeight: 700, opacity: q, transform: `translateY(${(1 - q) * -10}px)`}}>
      <div style={{width: 12, height: 12, borderRadius: 6, background: GRUEN}} />
      <span style={{letterSpacing: '0.14em', color: GRUEN_D, fontVariantNumeric: 'tabular-nums'}}>{String(nr).padStart(2, '0')}</span>
      <span style={{color: SOFT}}>{text}</span>
    </div>
  );
};

const QuellenZeile: React.FC<{t: number; z: number}> = ({t, z}) => {
  const i = stationBei(t);
  const text = QUELLEN[i];
  if (!text) return null;
  // Bei Push-ins würde die Zeile auf Leitung und Sockeln liegen – dann ausblenden.
  const frei = 1 - clamp01((z - 1.015) / 0.025);
  const q = frei * p(t, S[i] + 0.8, 0.6) * (i + 1 < S.length ? 1 - p(t, S[i + 1] - PAN_VOR - 0.2, 0.3) : 1);
  return <div style={{position: 'absolute', left: 64, bottom: 30, fontSize: 21, fontWeight: 600, color: GRAU, letterSpacing: '0.02em', opacity: q}}>Quelle: {text}</div>;
};

/* ═════════════ Töne (wenige, nur echte Ereignisse) ═════════════ */

type Ton = [s: number, name: SfxName, vol: number];
const TOENE: Ton[] = [
  [A1.heutigen + 0.1, 'kSwish', 0.25],
  [A1.hoch, 'kLanden', 0.3],
  [A2.gleichzeitig + 0.2, 'kAnstieg', 0.18],
  [A2.genau + 0.1, 'kPop', 0.25],
  [A3.seit, 'kTipp', 0.35],
  [A3.v024, 'kTick', 0.22],
  [A3.v034, 'kTick', 0.22],
  [A3.v03, 'kTick', 0.22],
  [A4.das, 'kDing', 0.3],
  [A5.dreiunddreissigstel + 0.2, 'kLanden', 0.25],
  [A6.hoch, 'kSwish', 0.25],
  [A6.v40, 'kAnstieg', 0.25],
  [A7.video, 'kTipp', 0.4],
  [A7.v3000 - 0.6, 'kAnstieg', 0.22],
  [A9.v485 + 0.2, 'kLanden', 0.3],
  [A10.v950 + 0.1, 'kTick', 0.22],
  [A11.viertel + 0.6, 'kTick', 0.22],
  [A12.strom + 0.9, 'kAnstieg', 0.25],
  ...[0, 1, 2, 3, 4].map((i): Ton => [A13.fuenf + i * 0.22 + 0.45, (['kTick1', 'kTick2', 'kTick3', 'kTick4', 'kTick5'] as SfxName[])[i], 0.14]),
  [A15.abonnieren, 'kTipp', 0.35],
  [A15.abonnieren + 0.15, 'kErfolg', 0.25],
  [A15.toki + 0.6, 'kLogoKurz', 0.3],
  ...S.slice(1).map((s): Ton => [s - PAN_VOR, 'kWhoosh', 0.12]),
];

/* ═════════════ Video ═════════════ */

const Inhalt: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const kam = kamera(t);
  const stationen = (kam.fx - 960) / W;
  return (
    <AbsoluteFill style={{overflow: 'hidden', fontFamily: KANAL.body, color: INK, background: KANAL.bg}}>
      <Licht versatz={kam.fx} t={t} />
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0', transform: `translate(960px, 540px) scale(${kam.z}) translate(${-kam.fx}px, ${-kam.fy}px)`}}>
        <Boden />
        <Impulse t={t} />
        {STATIONEN.map((Station, i) =>
          Math.abs(stationen - i) < 1.05 ? (
            <div key={i} style={{position: 'absolute', left: i * W, top: 0, width: 1920, height: 1080}}>
              <Station t={t} />
            </div>
          ) : null,
        )}
        <TokiWelt t={t} />
      </div>
      <KapitelSchild t={t} z={kam.z} />
      <QuellenZeile t={t} z={kam.z} />
      <Vignette />
      <Korn frame={frame} />
      {TOENE.map(([s, name, vol], i) => (
        <Sfx key={i} name={name} at={Math.max(0, Math.round(s * FPS))} volume={vol} />
      ))}
      <Audio src={staticFile(VOICEOVER)} />
    </AbsoluteFill>
  );
};

export const Video: React.FC = () => (
  <StilContext.Provider value={KANAL}>
    <Inhalt />
  </StilContext.Provider>
);

export const projekt: Project = {
  id: 'KiStrom',
  component: Video,
  format: 'landscape',
  durationInFrames: Math.round(DAUER_S * FPS),
  fps: FPS,
};
