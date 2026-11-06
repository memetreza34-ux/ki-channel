import React, {useMemo} from 'react';
import {AbsoluteFill, Easing, interpolate, random, Sequence, useCurrentFrame} from 'remotion';
import {Music} from '../../kit/Music';
import {Sfx} from '../../kit/Stage';
import type {Project} from '../types';
import {AKZENT, BG, Globus, HELL, RAD, STAHL, Titel, Zaehler, clamp, projiziere, pulsBei, useAuftritt} from './bausteine';

const SZENE = 140;

/**
 * Drei Beispiel-Szenen im Daten-Look (Allgemeinwissen):
 * Blitze (≈ 44 pro Sekunde, NASA) · Jeans (≈ 7.500 Liter Wasser, UNEP) · Erdbahn (29,8 km/s, NASA).
 *
 * Bewegungssprache (Premium, ruhig-präzise): Eintritte mit outQuint über 12 Frames, Weg ≤ 24 px,
 * Objekte skalieren 0,92 → 1 statt einzublenden, ab Frame 0 ist alles sichtbar, ein Höhepunkt pro Szene.
 * Alles Wichtige liegt zwischen y 200 und y 1480 (Plattform-UI unten).
 */

/* ───────────── Szene 1: Blitze ───────────── */

const Blitze: React.FC = () => {
  const f = useCurrentFrame();
  const R = 340;
  const lon0 = 10 + f * 0.22;
  const lat0 = 14;
  const skala = useAuftritt();
  // ≈ 44 Blitze pro Sekunde → bei 30 fps ≈ 1,47 pro Frame; vor allem Tropen und Subtropen
  const blitze = useMemo(() => Array.from({length: 210}, (_, i) => ({t: i / 1.47, lon: -100 + random(`bl${i}`) * 230, lat: -28 + random(`bb${i}`) * 58, gross: i % 5 === 0})), []);
  const anzahl = Math.floor((f / 30) * 44);
  const HUNDERT = Math.ceil((100 / 44) * 30);
  return (
    <AbsoluteFill>
      <Titel text={<>So oft <span style={{color: AKZENT}}>blitzt</span> es gerade auf der Erde</>} />
      <div style={{position: 'absolute', left: 540 - R - 20, top: 470, transform: `scale(${skala})`}}>
        <Globus R={R} lon0={lon0} lat0={lat0} id="blitz">
          <defs>
            <filter id="gluehen" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation="8" />
            </filter>
          </defs>
          {blitze.map((b, i) => {
            const alter = f - b.t;
            if (alter < 0 || alter > 8) return null;
            const [x, y, sichtbar] = projiziere(b.lon, b.lat, lon0, lat0, R);
            if (!sichtbar) return null;
            const glanz = alter < 2 ? 1 : interpolate(alter, [2, 8], [1, 0], clamp);
            const r = b.gross ? 22 : 12;
            return (
              <g key={i} transform={`translate(${x} ${y})`} opacity={glanz}>
                <circle r={r * 2.2} fill="#FFE07A" opacity={0.75} filter="url(#gluehen)" />
                <circle r={r * 0.6} fill="#FFFFFF" />
                {b.gross ? <path d="M3,-30 L-11,3 H0 L-5,28 L14,-6 H3 Z" fill="#FFF3B0" /> : null}
              </g>
            );
          })}
        </Globus>
      </div>
      <Zaehler wert={anzahl} einheit="Blitze" label="seit dieses Video läuft" quelle="QUELLE: NASA · ≈ 44 PRO SEKUNDE" puls={pulsBei(f, HUNDERT)} />
      <Sfx name="kWhoosh" at={0} volume={0.35} />
      <Sfx name="kDing" at={HUNDERT} volume={0.5} />
    </AbsoluteFill>
  );
};

/* ───────────── Szene 2: Jeans ───────────── */

const JEANS = 'M150,40 H410 L434,120 L476,560 H326 L292,252 Q284,228 276,252 L242,560 H92 L126,120 Z';

const Jeans: React.FC = () => {
  const f = useCurrentFrame();
  const skala = useAuftritt();
  const fuell = interpolate(f, [12, 100], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const pegel = 560 - fuell * 470;
  const welle = (x: number) => Math.sin(x / 38 + f / 6) * 9;
  const punkte = Array.from({length: 15}, (_, i) => [70 + i * 32, pegel + welle(70 + i * 32)] as const);
  const wasser = `M${punkte.map(([x, y]) => `${x},${y}`).join(' L')} L520,600 L70,600 Z`;
  const kante = `M${punkte.map(([x, y]) => `${x},${y}`).join(' L')}`;
  const ende = pulsBei(f, 100);
  return (
    <AbsoluteFill>
      <Titel text={<>So viel <span style={{color: AKZENT}}>Wasser</span> steckt in einer Jeans</>} />
      <div style={{position: 'absolute', left: 245, top: 440, transform: `scale(${skala * (1 + ende * 0.03)})`}}>
        <svg width="590" height="730" viewBox="60 20 460 570">
          <defs>
            <clipPath id="hose">
              <path d={JEANS} />
            </clipPath>
            <linearGradient id="denim" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#3D5E92" />
              <stop offset="1" stopColor="#233A60" />
            </linearGradient>
          </defs>
          <path d={JEANS} fill="url(#denim)" />
          <g clipPath="url(#hose)">
            <rect x="60" y={pegel} width="480" height={600 - pegel} fill="#0B1830" opacity={0.25} />
            <path d={wasser} fill="#57BDF5" opacity={0.55} />
            <path d={kante} fill="none" stroke="#CFEFFF" strokeWidth="3" />
            {Array.from({length: 12}, (_, i) => {
              const y = 560 - ((f * 2.5 + i * 47) % 460);
              return y > pegel + 14 ? <circle key={i} cx={120 + ((i * 67) % 330)} cy={y} r={5 + (i % 3) * 2} fill="none" stroke="#CFEFFF" strokeWidth="2" opacity={0.7} /> : null;
            })}
            <rect x="60" y="538" width="480" height="22" fill="#4C6FA6" />
          </g>
          <path d={JEANS} fill="none" stroke={HELL} strokeWidth="5" strokeLinejoin="round" />
          <path d="M150,40 H410 L414,64 H146 Z" fill="#1E3150" stroke={HELL} strokeWidth="4" strokeLinejoin="round" />
          {[178, 236, 332, 390].map((x) => (
            <rect key={x} x={x - 6} y={34} width="12" height="36" rx="3" fill="#2B4470" stroke={HELL} strokeWidth="3" />
          ))}
          <circle cx="284" cy="52" r="8" fill="#C9A35A" stroke={HELL} strokeWidth="2" />
          <path d="M284,64 V178 Q284,196 268,204" stroke="#C9A35A" strokeWidth="3" fill="none" strokeDasharray="9 7" />
          <path d="M172,82 Q188,132 242,128 M396,82 Q380,132 326,128" stroke="#C9A35A" strokeWidth="3" fill="none" strokeDasharray="9 7" />
        </svg>
      </div>
      <Zaehler wert={7500 * fuell} einheit="Liter" label="vor allem für den Baumwoll-Anbau" quelle="QUELLE: UNEP 2019" puls={ende} />
      <Sfx name="kSwish" at={0} volume={0.4} />
      <Sfx name="kAnstieg" at={12} volume={0.3} />
      <Sfx name="kDing" at={100} volume={0.5} />
    </AbsoluteFill>
  );
};

/* ───────────── Szene 3: Erdbahn ───────────── */

const BAHN = {cx: 540, cy: 820, rx: 440, ry: 150};

const Erdbahn: React.FC = () => {
  const f = useCurrentFrame();
  const sek = f / 30;
  const start = 168;
  const winkel = start - f * 1.1; // läuft vorne (unten) von links nach rechts vorbei
  const pos = (w: number) => [BAHN.cx + Math.cos(w * RAD) * BAHN.rx, BAHN.cy + Math.sin(w * RAD) * BAHN.ry] as const;
  const [ex, ey] = pos(winkel);
  const tiefe = Math.sin(winkel * RAD); // 1 = ganz vorne
  const erdR = 58 * (1 + tiefe * 0.25);
  const spur = Array.from({length: Math.max(2, Math.floor(f / 2) + 1)}, (_, i) => pos(start - Math.min(i * 2.2, f * 1.1)));
  const HUNDERT = Math.ceil((100 / 29.8) * 30);
  const licht: [number, number] = [(BAHN.cx - ex) / 600, (BAHN.cy - ey) / 600];
  return (
    <AbsoluteFill>
      <Titel text={<>So weit ist die Erde gerade <span style={{color: AKZENT}}>geflogen</span></>} />
      <svg width="1080" height="1920" style={{position: 'absolute', inset: 0}}>
        <defs>
          <radialGradient id="sonne-glow">
            <stop offset="0" stopColor="#FFD27A" stopOpacity="0.55" />
            <stop offset="1" stopColor="#FF6B4A" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sonne-kern" cx="42%" cy="40%">
            <stop offset="0" stopColor="#FFF6D6" />
            <stop offset="0.45" stopColor="#FFCB55" />
            <stop offset="1" stopColor="#F59A3A" />
          </radialGradient>
        </defs>
        <ellipse cx={BAHN.cx} cy={BAHN.cy} rx={BAHN.rx} ry={BAHN.ry} fill="none" stroke={STAHL} strokeOpacity="0.35" strokeWidth="3" strokeDasharray="6 14" />
        <circle cx={BAHN.cx} cy={BAHN.cy} r={250} fill="url(#sonne-glow)" opacity={0.9 + Math.sin(f / 9) * 0.06} />
        <circle cx={BAHN.cx} cy={BAHN.cy} r={110} fill="url(#sonne-kern)" />
        <polyline points={spur.map(([x, y]) => `${x},${y}`).join(' ')} fill="none" stroke={AKZENT} strokeWidth="7" strokeLinecap="round" />
      </svg>
      <div style={{position: 'absolute', left: ex - erdR - 20, top: ey - erdR - 20, transform: `scale(${useAuftritt()})`}}>
        <Globus R={erdR} lon0={f * 1.5} lat0={20} id="erde" licht={licht} />
      </div>
      <Zaehler wert={sek * 29.8} einheit="km" label="seit dieses Video läuft" quelle="QUELLE: NASA · 29,8 KM PRO SEKUNDE" puls={pulsBei(f, HUNDERT)} />
      <Sfx name="kWhoosh" at={0} volume={0.4} />
      <Sfx name="kDing" at={HUNDERT} volume={0.5} />
    </AbsoluteFill>
  );
};

const Szenen: React.FC = () => (
  <AbsoluteFill style={{background: BG, overflow: 'hidden'}}>
    <AbsoluteFill style={{background: 'radial-gradient(900px 700px at 50% 45%, rgba(90,130,220,0.10), transparent 70%)'}} />
    <Music src="musik/wissen.wav" volume={0.22} fadeInFrames={10} fadeOutFrames={30} />
    <Sequence durationInFrames={SZENE}>
      <Blitze />
    </Sequence>
    <Sequence from={SZENE} durationInFrames={SZENE}>
      <Jeans />
    </Sequence>
    <Sequence from={SZENE * 2} durationInFrames={SZENE}>
      <Erdbahn />
    </Sequence>
  </AbsoluteFill>
);

export const szenen: Project[] = [{id: 'Szenen-Beispiele', component: Szenen, format: 'vertical', durationInFrames: SZENE * 3, ordner: 'Shorts'}];
