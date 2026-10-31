import React, {useMemo} from 'react';
import {AbsoluteFill, Easing, interpolate, random, Sequence, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../../kit/Stage';
import type {Project} from '../types';
import land from './land-110m.json';

/**
 * Drei Beispiel-Szenen im Daten-Look (Allgemeinwissen):
 * Blitze (≈ 44 pro Sekunde, NASA) · Jeans (≈ 7.500 Liter Wasser, UNEP) · Erdbahn (29,8 km/s, NASA).
 */

const BG = '#0E1424';
const HELL = '#F3EFE7';
const AKZENT = '#FF6B4A';
const STAHL = '#8A93A8';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const outQuint = Easing.bezier(0.22, 1, 0.36, 1);
const zahl = (n: number, stellen = 0) => n.toLocaleString('de-DE', {minimumFractionDigits: stellen, maximumFractionDigits: stellen});
const SZENE = 140;

/* ───────────── gemeinsame Bausteine ───────────── */

const Titel: React.FC<{text: React.ReactNode}> = ({text}) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, 14], [0, 1], {...clamp, easing: outQuint});
  return <div style={{position: 'absolute', left: 80, right: 120, top: 230, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 82, lineHeight: 1.04, letterSpacing: '-0.035em', color: HELL, opacity: t, transform: `translateY(${(1 - t) * 24}px)`}}>{text}</div>;
};

const Zaehler: React.FC<{wert: number; einheit: string; label: string; quelle: string; top: number; stellen?: number}> = ({wert, einheit, label, quelle, top, stellen = 0}) => (
  <div style={{position: 'absolute', left: 80, right: 80, top, display: 'flex', flexDirection: 'column', gap: 12}}>
    <div style={{fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 40, color: STAHL}}>{label}</div>
    <div style={{fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: 170, lineHeight: 1, letterSpacing: '-0.05em', color: HELL, fontVariantNumeric: 'tabular-nums'}}>
      {zahl(wert, stellen)}
      <span style={{fontSize: 64, marginLeft: 18, letterSpacing: 0, color: AKZENT}}>{einheit}</span>
    </div>
    <div style={{fontFamily: 'JetBrains Mono, monospace', fontWeight: 500, fontSize: 24, letterSpacing: '0.06em', color: STAHL}}>{quelle}</div>
  </div>
);

const Marke: React.FC = () => (
  <div style={{position: 'absolute', left: 80, bottom: 150, display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 30, color: STAHL}}>
    <svg width="34" height="34" viewBox="-20 -20 40 40">
      <polygon points="0,-18 16,-9 0,0 -16,-9" fill="#9BF2D3" />
      <polygon points="-16,-9 0,0 0,18 -16,9" fill="#47E0B0" />
      <polygon points="16,-9 0,0 0,18 16,9" fill="#2FB98E" />
    </svg>
    denkwürfel
  </div>
);

/* ───────────── Weltkarte (TopoJSON → Ringe) ───────────── */

type Topo = {transform: {scale: [number, number]; translate: [number, number]}; arcs: number[][][]; objects: {land: {geometries: Array<{type: string; arcs: number[][][] | number[][]}>}}};

const ringe = (() => {
  const t = land as unknown as Topo;
  const [sx, sy] = t.transform.scale;
  const [tx, ty] = t.transform.translate;
  const arcs = t.arcs.map((arc) => {
    let x = 0;
    let y = 0;
    return arc.map(([dx, dy]) => {
      x += dx;
      y += dy;
      return [x * sx + tx, y * sy + ty] as [number, number];
    });
  });
  const ring = (ids: number[]) => ids.flatMap((i) => (i >= 0 ? arcs[i] : [...arcs[~i]].reverse()));
  const out: Array<Array<[number, number]>> = [];
  for (const g of t.objects.land.geometries) {
    const polys = (g.type === 'Polygon' ? [g.arcs] : g.arcs) as number[][][];
    for (const p of polys) for (const r of p) out.push(ring(r));
  }
  return out;
})();

const RAD = Math.PI / 180;
const projiziere = (lon: number, lat: number, lon0: number, lat0: number, R: number): [number, number, boolean] => {
  const l = (lon - lon0) * RAD;
  const p = lat * RAD;
  const p0 = lat0 * RAD;
  const x = R * Math.cos(p) * Math.sin(l);
  const y = R * (Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(l));
  const sichtbar = Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(l) >= 0;
  if (sichtbar) return [x, -y, true];
  const n = Math.hypot(x, y) || 1;
  return [(x / n) * R, (-y / n) * R, false];
};

const Globus: React.FC<{R: number; lon0: number; lat0: number; children?: React.ReactNode}> = ({R, lon0, lat0, children}) => {
  const pfade = useMemo(
    () =>
      ringe
        .map((r) => {
          const pts = r.map(([lo, la]) => projiziere(lo, la, lon0, lat0, R));
          if (!pts.some((p) => p[2])) return '';
          return 'M' + pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('L') + 'Z';
        })
        .filter(Boolean)
        .join(' '),
    [R, lon0, lat0],
  );
  const gitter = useMemo(() => {
    const linien: string[] = [];
    for (let la = -60; la <= 60; la += 30) {
      const pts = Array.from({length: 73}, (_, i) => projiziere(-180 + i * 5, la, lon0, lat0, R)).filter((p) => p[2]);
      if (pts.length > 1) linien.push('M' + pts.map((p) => `${p[0]},${p[1]}`).join('L'));
    }
    for (let lo = -180; lo < 180; lo += 30) {
      const pts = Array.from({length: 37}, (_, i) => projiziere(lo, -90 + i * 5, lon0, lat0, R)).filter((p) => p[2]);
      if (pts.length > 1) linien.push('M' + pts.map((p) => `${p[0]},${p[1]}`).join('L'));
    }
    return linien.join(' ');
  }, [R, lon0, lat0]);
  return (
    <svg width={R * 2 + 40} height={R * 2 + 40} viewBox={`${-R - 20} ${-R - 20} ${R * 2 + 40} ${R * 2 + 40}`} style={{overflow: 'visible'}}>
      <defs>
        <radialGradient id="meer" cx="35%" cy="30%" r="80%">
          <stop offset="0" stopColor="#24406E" />
          <stop offset="1" stopColor="#111C36" />
        </radialGradient>
        <radialGradient id="schatten" cx="30%" cy="25%" r="90%">
          <stop offset="0.55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.45" />
        </radialGradient>
      </defs>
      <circle r={R + 14} fill="none" stroke="#3D5A99" strokeOpacity="0.25" strokeWidth="14" />
      <circle r={R} fill="url(#meer)" />
      <path d={gitter} stroke="#6E8BC7" strokeOpacity="0.18" strokeWidth="1.5" fill="none" />
      <path d={pfade} fill="#B9C3D6" fillRule="evenodd" stroke="#DCE3EE" strokeWidth="1.2" />
      {children}
      <circle r={R} fill="url(#schatten)" />
    </svg>
  );
};

/* ───────────── Szene 1: Blitze ───────────── */

const Blitze: React.FC = () => {
  const f = useCurrentFrame();
  const R = 380;
  const lon0 = 10 + f * 0.18;
  const lat0 = 18;
  // ≈ 44 Blitze pro Sekunde → bei 30 fps ≈ 1,47 pro Frame
  const blitze = useMemo(() => Array.from({length: 220}, (_, i) => ({t: i / 1.47 + 8, lon: -100 + random(`bl${i}`) * 220, lat: -35 + random(`bb${i}`) * 75})), []);
  const sek = Math.max(0, (f - 8) / 30);
  const rein = spring({frame: f, fps: 30, config: {damping: 16, stiffness: 90}});
  return (
    <AbsoluteFill>
      <Titel text={<>So oft <span style={{color: AKZENT}}>blitzt</span> es gerade auf der Erde</>} />
      <div style={{position: 'absolute', left: 540 - R - 20, top: 520, transform: `scale(${0.85 + rein * 0.15})`, opacity: rein}}>
        <Globus R={R} lon0={lon0} lat0={lat0}>
          {blitze.map((b, i) => {
            const alter = f - b.t;
            if (alter < 0 || alter > 14) return null;
            const [x, y, sichtbar] = projiziere(b.lon, b.lat, lon0, lat0, R);
            if (!sichtbar) return null;
            const glanz = alter < 3 ? 1 : interpolate(alter, [3, 14], [1, 0], clamp);
            return (
              <g key={i} transform={`translate(${x} ${y})`} opacity={glanz}>
                <circle r={6 + alter * 2.4} fill="none" stroke="#FFE07A" strokeWidth={3} opacity={0.6} />
                <circle r={9} fill="#FFF6C8" />
                <path d="M2,-22 L-8,2 H0 L-4,20 L10,-4 H2 Z" fill="#FFE07A" stroke={BG} strokeWidth={2} />
              </g>
            );
          })}
        </Globus>
      </div>
      <Zaehler top={1350} label="Blitze, seit dieses Video läuft" wert={Math.floor(sek * 44)} einheit="Blitze" quelle="≈ 44 PRO SEKUNDE · NASA" />
      <Sfx name="kWhoosh" at={0} volume={0.4} />
      {Array.from({length: 4}, (_, i) => (
        <Sfx key={i} name="kTick" at={38 + i * 30} volume={0.25} />
      ))}
    </AbsoluteFill>
  );
};

/* ───────────── Szene 2: Jeans ───────────── */

const JEANS = 'M150,40 H410 L432,120 L470,560 H330 L284,210 L240,560 H100 L128,120 Z';

const Jeans: React.FC = () => {
  const f = useCurrentFrame();
  const fuell = interpolate(f, [16, 104], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const liter = 7500 * fuell;
  const welle = (x: number) => Math.sin(x / 40 + f / 6) * 10;
  const pegel = 560 - fuell * 540;
  const wasser = `M80,${pegel + welle(80)} ` + Array.from({length: 14}, (_, i) => `L${80 + i * 32},${pegel + welle(80 + i * 32)}`).join(' ') + ' L500,600 L80,600 Z';
  const rein = spring({frame: f, fps: 30, config: {damping: 15, stiffness: 100}});
  return (
    <AbsoluteFill>
      <Titel text={<>So viel <span style={{color: AKZENT}}>Wasser</span> steckt in einer Jeans</>} />
      <div style={{position: 'absolute', left: 260, top: 560, transform: `translateY(${(1 - rein) * 60}px)`, opacity: rein}}>
        <svg width="560" height="640" viewBox="40 0 480 620">
          <defs>
            <clipPath id="hose">
              <path d={JEANS} />
            </clipPath>
            <linearGradient id="denim" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#3A5A8C" />
              <stop offset="1" stopColor="#24395E" />
            </linearGradient>
          </defs>
          <ellipse cx="285" cy="590" rx="210" ry="14" fill="#000" opacity="0.35" />
          <path d={JEANS} fill="url(#denim)" />
          <g clipPath="url(#hose)">
            <path d={wasser} fill="#4FB4F0" opacity="0.88" />
            {Array.from({length: 10}, (_, i) => {
              const y = ((f * 3 + i * 57) % 520) + 40;
              return y > pegel ? <circle key={i} cx={130 + ((i * 71) % 300)} cy={600 - (y - 40)} r={4 + (i % 3)} fill="#CFEFFF" opacity={0.6} /> : null;
            })}
          </g>
          <path d={JEANS} fill="none" stroke={HELL} strokeWidth="5" strokeLinejoin="round" />
          <path d="M150,40 H410 L414,62 H146 Z" fill="#1B2C49" stroke={HELL} strokeWidth="4" />
          <path d="M284,62 V200 M180,80 Q200,130 250,124 M388,80 Q368,130 318,124" stroke="#C9A35A" strokeWidth="4" fill="none" strokeDasharray="10 8" />
          <circle cx="284" cy="52" r="7" fill="#C9A35A" />
        </svg>
      </div>
      <Zaehler top={1300} label="für den Anbau der Baumwolle u. a." wert={liter} einheit="Liter" quelle="≈ 7.500 LITER PRO JEANS · UNEP" />
      <Sfx name="kSwish" at={0} volume={0.45} />
      <Sfx name="kAnstieg" at={16} volume={0.35} />
      <Sfx name="kDing" at={104} volume={0.5} />
    </AbsoluteFill>
  );
};

/* ───────────── Szene 3: Erdbahn ───────────── */

const Erdbahn: React.FC = () => {
  const f = useCurrentFrame();
  const sek = f / 30;
  const winkel = -100 + f * 0.35;
  const cx = 300;
  const cy = 1000;
  const r = 560;
  const ex = cx + Math.cos(winkel * RAD) * r;
  const ey = cy + Math.sin(winkel * RAD) * r * 0.62;
  const spur = Array.from({length: 40}, (_, i) => {
    const w = (winkel - i * 0.9) * RAD;
    return `${cx + Math.cos(w) * r},${cy + Math.sin(w) * r * 0.62}`;
  });
  return (
    <AbsoluteFill>
      <Titel text={<>So weit ist die Erde <span style={{color: AKZENT}}>geflogen</span>, seit du das hier schaust</>} />
      <svg width="1080" height="1920" style={{position: 'absolute', inset: 0}}>
        <defs>
          <radialGradient id="sonne">
            <stop offset="0" stopColor="#FFF3C4" />
            <stop offset="0.35" stopColor="#FFC24A" />
            <stop offset="1" stopColor="#FF6B4A" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.62} fill="none" stroke={STAHL} strokeOpacity="0.35" strokeWidth="3" strokeDasharray="6 14" />
        <circle cx={cx} cy={cy} r={260} fill="url(#sonne)" opacity={0.55 + Math.sin(f / 8) * 0.05} />
        <circle cx={cx} cy={cy} r={120} fill="#FFC24A" />
        <circle cx={cx} cy={cy} r={120} fill="none" stroke="#FFE59A" strokeWidth="6" />
        <polyline points={spur.join(' ')} fill="none" stroke={AKZENT} strokeWidth="8" strokeLinecap="round" opacity="0.9" />
        <circle cx={ex} cy={ey} r={46} fill="#2E6CC9" />
        <path d={`M${ex - 30},${ey - 14} q16,-18 30,-6 q10,10 24,2 q-6,24 -26,22 q-18,-2 -28,-18 Z`} fill="#6CC46E" />
        <circle cx={ex} cy={ey} r={46} fill="none" stroke={HELL} strokeWidth="4" />
      </svg>
      <Zaehler top={1360} label="Strecke seit Videostart" wert={sek * 29.8} stellen={0} einheit="km" quelle="29,8 KM PRO SEKUNDE · NASA" />
      <Sfx name="kWhoosh" at={0} volume={0.45} />
      {Array.from({length: 4}, (_, i) => (
        <Sfx key={i} name="kTick" at={30 + i * 30} volume={0.25} />
      ))}
    </AbsoluteFill>
  );
};

const Fortschritt: React.FC = () => {
  const f = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  return <div style={{position: 'absolute', left: 0, bottom: 0, height: 8, width: `${(f / durationInFrames) * 100}%`, background: AKZENT}} />;
};

const Szenen: React.FC = () => (
  <AbsoluteFill style={{background: BG, overflow: 'hidden'}}>
    <AbsoluteFill style={{background: 'radial-gradient(900px 700px at 50% 52%, rgba(90,130,220,0.10), transparent 70%)'}} />
    <Sequence durationInFrames={SZENE}>
      <Blitze />
    </Sequence>
    <Sequence from={SZENE} durationInFrames={SZENE}>
      <Jeans />
    </Sequence>
    <Sequence from={SZENE * 2} durationInFrames={SZENE}>
      <Erdbahn />
    </Sequence>
    <Marke />
    <Fortschritt />
  </AbsoluteFill>
);

export const szenen: Project[] = [{id: 'Szenen-Beispiele', component: Szenen, format: 'vertical', durationInFrames: SZENE * 3, ordner: 'Shorts'}];
