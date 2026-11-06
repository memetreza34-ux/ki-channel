import React, {useMemo} from 'react';
import {Easing, interpolate, spring, useCurrentFrame} from 'remotion';
import land from './land-110m.json';

/**
 * Baukasten für die Wissens-Shorts (Allgemeinwissen, Daten-Look).
 *
 * Bewegungssprache (Premium, ruhig-präzise): Eintritte mit outQuint über 12 Frames (0,4 s), Weg ≤ 24 px,
 * Objekte skalieren 0,92 → 1 statt einzublenden, ab Frame 0 ist alles sichtbar, ein Höhepunkt pro Szene
 * (Puls auf der Zahl + kDing). Alles Wichtige liegt zwischen y 200 und y 1480 (Plattform-UI unten).
 * Sounds: kWhoosh/kSwish Szenenwechsel · kAnstieg Füllen/Wachsen · kDing Pointe · kPop Objekt erscheint.
 */

export const BG = '#0E1424';
export const HELL = '#F3EFE7';
export const AKZENT = '#FF6B4A';
export const STAHL = '#8A93A8';
export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const outQuint = Easing.bezier(0.22, 1, 0.36, 1);
export const zahl = (n: number, stellen = 0) => n.toLocaleString('de-DE', {minimumFractionDigits: stellen, maximumFractionDigits: stellen});
export const ZAEHLER_TOP = 1190;

/* ───────────── gemeinsame Bausteine ───────────── */

export const Titel: React.FC<{text: React.ReactNode}> = ({text}) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, 12], [0, 1], {...clamp, easing: outQuint});
  return <div style={{position: 'absolute', left: 80, right: 80, top: 230, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 92, lineHeight: 1.02, letterSpacing: '-0.035em', color: HELL, transform: `translateY(${(1 - t) * 8}px)`}}>{text}</div>;
};

/** Objekt-Auftritt: skaliert 0,92 → 1, bleibt sichtbar. */
export const useAuftritt = () => {
  const f = useCurrentFrame();
  return 0.92 + 0.08 * spring({frame: f, fps: 30, config: {damping: 18, stiffness: 120}});
};

export const Zaehler: React.FC<{wert: number; einheit: string; label: string; quelle: string; stellen?: number; puls?: number}> = ({wert, einheit, label, quelle, stellen = 0, puls = 0}) => (
  <div style={{position: 'absolute', left: 80, right: 80, top: ZAEHLER_TOP, display: 'flex', flexDirection: 'column', gap: 14}}>
    <div style={{display: 'flex', alignItems: 'baseline', gap: 22}}>
      <div style={{fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: 170, lineHeight: 1, letterSpacing: '-0.05em', fontVariantNumeric: 'tabular-nums', color: puls > 0.05 ? AKZENT : HELL, transform: `scale(${1 + puls * 0.06})`, transformOrigin: 'left bottom'}}>
        {zahl(wert, stellen)}
      </div>
      <div style={{fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 84, color: AKZENT, letterSpacing: '-0.02em'}}>{einheit}</div>
    </div>
    <div style={{fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 42, color: HELL, opacity: 0.9}}>{label}</div>
    <div style={{fontFamily: 'JetBrains Mono, monospace', fontWeight: 500, fontSize: 28, letterSpacing: '0.06em', color: STAHL, opacity: 0.8}}>{quelle}</div>
  </div>
);

/** Kurzer Puls (0 → 1 → 0) über 8 Frames ab Frame `ab`. */
export const pulsBei = (f: number, ab: number) => (f >= ab && f < ab + 8 ? Math.sin(((f - ab) / 8) * Math.PI) : 0);

/* ───────────── Weltkarte (TopoJSON → Ringe) ───────────── */

export type Topo = {transform: {scale: [number, number]; translate: [number, number]}; arcs: number[][][]; objects: {land: {geometries: Array<{type: string; arcs: number[][][] | number[][]}>}}};

export const ringe = (() => {
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

export const RAD = Math.PI / 180;
export const projiziere = (lon: number, lat: number, lon0: number, lat0: number, R: number): [number, number, boolean] => {
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

export const Globus: React.FC<{R: number; lon0: number; lat0: number; id: string; licht?: [number, number]; children?: React.ReactNode}> = ({R, lon0, lat0, id, licht = [-0.4, -0.45], children}) => {
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
  const lx = 50 + licht[0] * 50;
  const ly = 50 + licht[1] * 50;
  return (
    <svg width={R * 2 + 40} height={R * 2 + 40} viewBox={`${-R - 20} ${-R - 20} ${R * 2 + 40} ${R * 2 + 40}`} style={{overflow: 'visible'}}>
      <defs>
        <radialGradient id={`meer-${id}`} cx={`${lx}%`} cy={`${ly}%`} r="85%">
          <stop offset="0" stopColor="#2A4A80" />
          <stop offset="1" stopColor="#0F1A33" />
        </radialGradient>
        <radialGradient id={`schatten-${id}`} cx={`${lx}%`} cy={`${ly}%`} r="95%">
          <stop offset="0.5" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.6" />
        </radialGradient>
      </defs>
      <circle r={R + R * 0.035} fill="none" stroke="#3D5A99" strokeOpacity="0.22" strokeWidth={R * 0.035} />
      <circle r={R} fill={`url(#meer-${id})`} />
      <path d={gitter} stroke="#6E8BC7" strokeOpacity="0.14" strokeWidth="1.5" fill="none" />
      <path d={pfade} fill="#5B6B8C" fillRule="evenodd" stroke="#8FA0C2" strokeWidth="1" />
      {children}
      <circle r={R} fill={`url(#schatten-${id})`} />
    </svg>
  );
};

