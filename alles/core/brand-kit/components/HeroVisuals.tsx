import React from 'react';
import { useCurrentFrame, random } from 'remotion';
import { C, E, a, prog, lerpF } from '../tokens';
import { FONT } from '../fonts';
import { Lucide } from './Lucide';

// ════════════════════════════════════════════════════════════════════════════
//  HERO VISUALS — wiederverwendbare MITTE-Elemente (siehe REEL-AUFBAU.md Regel 1+7).
//  Jede Komponente ist EIN Star-Element: eigene Formsprache, eigene Bewegungsart,
//  Werte/Zahlen sind Teil der Animation (kein separater Fließtext).
//  Alle nehmen cx/cy (Mittelpunkt) + size (Referenzbreite, ~280-340px = Regel-7-
//  Zielgröße) — so überall in einer Szene platzierbar, nicht an feste Canvas-Maße
//  gebunden.
// ════════════════════════════════════════════════════════════════════════════

// ─── GROWTH DASHBOARD — Glass-Karte: Gitter + Achsen-Zahlen + Kurve + Endpunkt-
//     Badge + Partikel-Burst am Ziel. Ein Chart-Ausschnitt, kein nackter Strich.
/** Für Wachstums-/Zeitreihen-Aussagen ("in 5 Jahren", "Rendite über Zeit"). */
export const GrowthCurveHero: React.FC<{
  cx: number; cy: number; size?: number; start: number; color?: string;
  points: number[]; // relative Werte 0..1, letzter Punkt = Ziel
  yearLabels: string[]; // gleiche Länge wie points, z.B. ["J1",...,"J5"] — nur Zahlen/Kürzel
  valueLabel: string; // Hero-Wert, wird als Badge am Endpunkt gezeigt
  deltaLabel?: string; // z.B. "+340%" — kleines zweites Badge, optional
}> = ({ cx, cy, size = 340, start, color = 'var(--accent)', points, yearLabels, valueLabel, deltaLabel }) => {
  const f = useCurrentFrame();
  const cardP = prog(f, start, start + 16, E.spring);
  const padX = size * 0.1, padTop = size * 0.16, padBottom = size * 0.14;
  const w = size - padX * 2, h = size * 0.82 - padTop - padBottom;
  const n = points.length;
  const p = prog(f, start + 14, start + 84, E.out);
  const drawn = Math.max(1, Math.floor(p * (n - 1)) + 1);
  const coords = points.slice(0, drawn).map((v, i) => [(i / (n - 1)) * w, h - v * h] as const);
  const c2 = coords.slice();
  if (drawn < n) {
    const segP = (p * (n - 1)) % 1;
    const iv = points[drawn - 1] + (points[drawn] - points[drawn - 1]) * segP;
    c2[c2.length - 1] = [(drawn - 1 + segP) / (n - 1) * w, h - iv * h];
  }
  const path = c2.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ');
  const areaPath = `${path} L ${c2[c2.length - 1][0]} ${h} L 0 ${h} Z`;
  const [ex, ey] = c2[c2.length - 1];
  const dotP = prog(f, start + 74, start + 90, E.spring);
  const burstOn = f >= start + 74 && f < start + 74 + 22;

  return (
    <div style={{ position: 'absolute', left: cx - size / 2, top: cy - size * 0.82 / 2, width: size,
      height: size * 0.82, opacity: cardP, transform: `scale(${lerpF(f, 0.92, 1, start, start + 16, E.spring)})` }}>
      <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: 28,
        border: `1px solid ${a(C.white, 0.12)}`, background: a(C.white, 0.035),
        boxShadow: `0 30px 80px rgba(0,0,0,0.4)`, padding: `${padTop}px ${padX}px ${padBottom}px` }}>
        <svg width={w} height={h} style={{ overflow: 'visible', position: 'relative' }}>
          <defs>
            <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={a(color, 0.45)} />
              <stop offset="100%" stopColor={a(color, 0)} />
            </linearGradient>
          </defs>
          {/* Gitterlinien — geben dem Chart Kontext/Tiefe statt leerer Fläche */}
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1={0} y1={(h / 3) * i} x2={w} y2={(h / 3) * i}
              stroke={a(C.white, 0.07)} strokeWidth={1} />
          ))}
          <path d={areaPath} fill="url(#growthFill)" stroke="none" />
          <path d={path} fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round"
            style={{ filter: `drop-shadow(0 0 14px ${a(color, 0.7)})` }} />
          {/* Punkte je Stützstelle — macht aus der Linie einen echten Datensatz */}
          {c2.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={4} fill={color} opacity={i === c2.length - 1 ? 0 : 0.85} />
          ))}
          <circle cx={ex} cy={ey} r={10 * dotP} fill={color} style={{ filter: `drop-shadow(0 0 20px ${color})` }} />
          {/* Partikel-Burst am Zielpunkt beim Erreichen */}
          {burstOn && Array.from({ length: 10 }, (_, i) => {
            const bp = prog(f, start + 74, start + 96, E.out);
            const ang = (i / 10) * Math.PI * 2;
            const dist = bp * (24 + random(`gb${i}`) * 30);
            return (
              <circle key={i} cx={ex + Math.cos(ang) * dist} cy={ey + Math.sin(ang) * dist}
                r={2.5} fill={color} opacity={Math.max(0, 1 - bp)} />
            );
          })}
        </svg>
        {/* Achsen-Zahlen unten — Kürzel/Zahlen, kein Fließtext */}
        <div style={{ position: 'absolute', left: padX, right: padX, bottom: padBottom * 0.32,
          display: 'flex', justifyContent: 'space-between' }}>
          {yearLabels.map((yl, i) => (
            <span key={i} style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: size * 0.032,
              color: C.gray, opacity: prog(f, start + 6 + i * 4, start + 14 + i * 4, E.out) }}>{yl}</span>
          ))}
        </div>
      </div>
      {/* Wert-Badge am Endpunkt der Kurve, außerhalb der Karte platziert */}
      <div style={{ position: 'absolute', left: padX + ex, top: padTop + ey - size * 0.16,
        transform: 'translateX(-50%)', opacity: dotP, whiteSpace: 'nowrap' }}>
        <div style={{ padding: '8px 18px', borderRadius: 999, background: a(color, 0.16),
          border: `1.5px solid ${a(color, 0.55)}`, boxShadow: `0 0 26px ${a(color, 0.4)}`,
          display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: FONT.title, fontSize: size * 0.1, color }}>{valueLabel}</span>
          {deltaLabel && (
            <span style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: size * 0.045, color: C.green }}>
              {deltaLabel}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── DUEL BARS — zwei Säulen im Glas-Rahmen, wachsen im Wettstreit, sehr kompakt ─
/** Für direkte A-vs-B-Vergleiche als EIGENES Hero-Element (nicht Chart-Bibliothek). */
export const DuelBarsHero: React.FC<{
  cx: number; cy: number; size?: number; start: number;
  a: { label: string; value: number; display: string; color?: string };
  b: { label: string; value: number; display: string; color?: string };
}> = ({ cx, cy, size = 300, start, a: barA, b: barB }) => {
  const f = useCurrentFrame();
  const h = size * 1.05, barW = size * 0.3, gap = size * 0.14;
  const max = Math.max(barA.value, barB.value);
  const frameP = prog(f, start, start + 14, E.spring);

  const Bar: React.FC<{ item: typeof barA; x: number; delay: number }> = ({ item, x, delay }) => {
    const bp = prog(f, start + 16 + delay, start + 16 + delay + 36, E.out);
    const bh = (item.value / max) * (h - 70) * bp;
    const col = item.color ?? 'var(--accent)';
    return (
      <div style={{ position: 'absolute', left: x, bottom: 0, width: barW, textAlign: 'center' }}>
        <div style={{ opacity: bp, fontFamily: FONT.title, fontSize: size * 0.13, color: col,
          marginBottom: 8, filter: `drop-shadow(0 0 14px ${a(col, 0.6)})` }}>{item.display}</div>
        <div style={{ width: '100%', height: bh, borderRadius: '14px 14px 6px 6px',
          background: `linear-gradient(180deg, ${a(col, 0.95)}, ${a(col, 0.55)})`,
          boxShadow: `0 0 26px ${a(col, 0.5)}` }} />
        <div style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: size * 0.075, color: C.gray,
          marginTop: 10, opacity: bp }}>{item.label}</div>
      </div>
    );
  };

  return (
    <div style={{ position: 'absolute', left: cx - size / 2, top: cy - h / 2, width: size, height: h + 40,
      opacity: frameP, transform: `scale(${lerpF(f, 0.9, 1, start, start + 14, E.spring)})` }}>
      <div style={{ position: 'relative', width: '100%', height: h, borderRadius: 28,
        border: `1px solid ${a(C.white, 0.1)}`, background: a(C.white, 0.03) }}>
        <Bar item={barA} x={size * 0.5 - barW - gap / 2} delay={0} />
        <Bar item={barB} x={size * 0.5 + gap / 2} delay={10} />
      </div>
    </div>
  );
};

// ─── ORBIT HUB — Zentrum-Icon mit umkreisenden Satelliten-Icons ────────────────
/** Für "mehrere Faktoren/Quellen zusammen" (Einkommensquellen, Kostenfaktoren). */
export const OrbitHubHero: React.FC<{
  cx: number; cy: number; size?: number; start: number; color?: string;
  centerIcon: string;
  satellites: { icon: string; label?: string }[];
}> = ({ cx, cy, size = 300, start, color = 'var(--accent)', centerIcon, satellites }) => {
  const f = useCurrentFrame();
  const p = prog(f, start, start + 16, E.spring);
  const orbitR = size * 0.42;
  const n = satellites.length;
  const spin = (f - start) * 0.25; // sehr langsame kontinuierliche Rotation, Tiefe statt Stillstand

  return (
    <div style={{ position: 'absolute', left: cx - size / 2, top: cy - size / 2, width: size, height: size,
      opacity: p }}>
      {/* Orbit-Linie als dezente Führung */}
      <svg width={size} height={size} style={{ position: 'absolute', inset: 0 }}>
        <circle cx={size / 2} cy={size / 2} r={orbitR} fill="none" stroke={a(color, 0.18)} strokeWidth={2}
          strokeDasharray="4 10" />
      </svg>
      {/* Zentrum */}
      <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
        width: size * 0.34, height: size * 0.34, borderRadius: size * 0.09,
        background: a(color, 0.16), border: `3px solid ${a(color, 0.55)}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 0 60px ${a(color, 0.45)}` }}>
        <Lucide name={centerIcon} size={size * 0.16} color={color} />
      </div>
      {/* Satelliten */}
      {satellites.map((s, i) => {
        const localAt = start + 20 + i * 8;
        const sp = prog(f, localAt, localAt + 14, E.spring);
        const ang = (i / n) * Math.PI * 2 + spin * (Math.PI / 180);
        const sx = size / 2 + Math.cos(ang) * orbitR;
        const sy = size / 2 + Math.sin(ang) * orbitR;
        return (
          <div key={i} style={{ position: 'absolute', left: sx, top: sy, transform: 'translate(-50%,-50%)',
            opacity: sp, scale: `${0.7 + sp * 0.3}` }}>
            <div style={{ width: size * 0.2, height: size * 0.2, borderRadius: size * 0.055,
              background: a(C.white, 0.07), border: `2px solid ${a(color, 0.4)}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 0 24px ${a(color, 0.25)}` }}>
              <Lucide name={s.icon} size={size * 0.1} color={color} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
