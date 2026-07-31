import React from 'react';
import { useCurrentFrame } from 'remotion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  BarChart, Bar, Cell, PieChart, Pie, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, ResponsiveContainer,
} from 'recharts';
import { C, E, prog, a } from '../tokens';
import { FONT } from '../fonts';

// ════════════════════════════════════════════════════════════════════════════
//  PREMIUM-CHARTS (Recharts) — Profi-Qualität, frame-gesteuert.
//  Recharts-Eigenanimation AUS; Animation via Remotion (clip-path reveal / Daten).
// ════════════════════════════════════════════════════════════════════════════

const tickStyle = { fill: C.gray, fontSize: 24, fontFamily: FONT.body } as const;

// ─── AREA / WACHSTUM ──────────────────────────────────────────────────────────
export const AreaPremium: React.FC<{
  data: { x: string | number; y: number }[];
  width: number; height: number; drawStart: number; drawEnd: number;
  color?: string; yMax?: number; hideAxes?: boolean;
}> = ({ data, width, height, drawStart, drawEnd, color = 'var(--accent)', yMax, hideAxes = false }) => {
  const f = useCurrentFrame();
  const reveal = prog(f, drawStart, drawEnd, E.inOut);
  const gradId = `areaPrem-${color.replace('#', '')}`;
  return (
    <div style={{ width, height, position: 'relative' }}>
      <div style={{ clipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)`, WebkitClipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)` }}>
        <AreaChart width={width} height={height} data={data} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.55} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          {!hideAxes && <CartesianGrid stroke={a(C.gray, 0.12)} vertical={false} />}
          {/* Achsen bleiben immer im Layout (gleiche Plot-Geometrie); bei hideAxes nur unsichtbar */}
          <XAxis dataKey="x" tick={hideAxes ? false : tickStyle} axisLine={hideAxes ? false : { stroke: a(C.gray, 0.3) }} tickLine={false} height={30}
            interval="preserveStartEnd" minTickGap={90} />
          <YAxis tick={hideAxes ? false : tickStyle} axisLine={false} tickLine={false}
            domain={yMax ? [0, yMax] : undefined}
            tickFormatter={(v) => v >= 1000 ? `${v / 1000}k` : v} width={70} />
          <Area type="monotone" dataKey="y" stroke={color} strokeWidth={5}
            fill={`url(#${gradId})`} isAnimationActive={false}
            dot={false} activeDot={false}
            style={{ filter: `drop-shadow(0 0 10px ${a(color, 0.7)})` }} />
        </AreaChart>
      </div>
    </div>
  );
};

// ─── DUAL-AREA-VERGLEICH — zwei Serien über Zeit (Miete vs. Kaufen, mit/ohne Sparplan) ──
// Lücke geschlossen (2026-07-22): AreaPremium/BarsPremium können nur EINE Serie. Für
// "A vs. B über Jahre/Monate" (sehr häufiger Finanz-Satztyp) gab's bisher keinen Baustein —
// man musste beide Werte in einem einzigen AreaPremium zusammenquetschen oder improvisieren.
export type DualSeriesPoint = { x: string | number; a: number; b: number };
export const DualAreaCompare: React.FC<{
  data: DualSeriesPoint[]; labelA: string; labelB: string;
  width: number; height: number; drawStart: number; drawEnd: number;
  colorA?: string; colorB?: string; yMax?: number;
}> = ({ data, labelA, labelB, width, height, drawStart, drawEnd, colorA = 'var(--accent)', colorB = C.gray, yMax }) => {
  const f = useCurrentFrame();
  const reveal = prog(f, drawStart, drawEnd, E.inOut);
  const idA = `dualA-${colorA.replace(/[^a-zA-Z0-9]/g, '')}`;
  const idB = `dualB-${colorB.replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <div style={{ width, position: 'relative' }}>
      {/* Legende — Pflicht bei 2 Serien, sonst weiß niemand welche Farbe was ist */}
      <div style={{ display: 'flex', gap: 36, justifyContent: 'center', marginBottom: 14,
        opacity: prog(f, drawStart, drawStart + 10, E.out) }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 20, height: 20, borderRadius: 6, background: colorA,
            boxShadow: `0 0 10px ${a(colorA, 0.6)}` }} />
          <span style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 26, color: C.white }}>{labelA}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 20, height: 20, borderRadius: 6, background: colorB,
            boxShadow: `0 0 10px ${a(colorB, 0.6)}` }} />
          <span style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 26, color: C.white }}>{labelB}</span>
        </div>
      </div>
      <div style={{ clipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)`, WebkitClipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)` }}>
        <AreaChart width={width} height={height} data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
          <defs>
            <linearGradient id={idA} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colorA} stopOpacity={0.5} />
              <stop offset="100%" stopColor={colorA} stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id={idB} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colorB} stopOpacity={0.4} />
              <stop offset="100%" stopColor={colorB} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={a(C.gray, 0.12)} vertical={false} />
          <XAxis dataKey="x" tick={tickStyle} axisLine={{ stroke: a(C.gray, 0.3) }} tickLine={false} height={30}
            interval="preserveStartEnd" minTickGap={90} />
          <YAxis tick={tickStyle} axisLine={false} tickLine={false}
            domain={yMax ? [0, yMax] : undefined}
            tickFormatter={(v) => v >= 1000 ? `${v / 1000}k` : v} width={70} />
          {/* B zuerst (hinten), A vorne — A gilt als die "Hauptaussage" und liegt oben drüber */}
          <Area type="monotone" dataKey="b" stroke={colorB} strokeWidth={4}
            fill={`url(#${idB})`} isAnimationActive={false} dot={false} activeDot={false} />
          <Area type="monotone" dataKey="a" stroke={colorA} strokeWidth={5}
            fill={`url(#${idA})`} isAnimationActive={false} dot={false} activeDot={false}
            style={{ filter: `drop-shadow(0 0 10px ${a(colorA, 0.7)})` }} />
        </AreaChart>
      </div>
    </div>
  );
};

// ─── BALKEN ───────────────────────────────────────────────────────────────────
// Premium-Fix (2026-07): vorher reine Flat-Fill-Cells (kein Gradient/Glow) — bekannter
// Billig-Gap gegenüber AreaPremium direkt oben. Jetzt: vertikaler Gradient + Drop-Shadow-Glow
// pro Balken, analog zu AreaPremium.
export const BarsPremium: React.FC<{
  data: { name: string; value: number; color?: string }[];
  width: number; height: number; growStart: number; growEnd: number;
}> = ({ data, width, height, growStart, growEnd }) => {
  const f = useCurrentFrame();
  const p = prog(f, growStart, growEnd, E.out);
  const animated = data.map((d) => ({ ...d, value: d.value * p }));
  const colors = [...new Set(data.map((d) => d.color ?? 'var(--accent)'))];
  const gradId = (color: string) => `barPrem-${color.replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <BarChart width={width} height={height} data={animated} margin={{ top: 30, right: 20, left: 10, bottom: 10 }}>
      <defs>
        {colors.map((color) => (
          <linearGradient key={color} id={gradId(color)} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={1} />
            <stop offset="100%" stopColor={color} stopOpacity={0.55} />
          </linearGradient>
        ))}
      </defs>
      <CartesianGrid stroke={a(C.gray, 0.1)} vertical={false} />
      <XAxis dataKey="name" tick={{ ...tickStyle, fontSize: 30 }} axisLine={{ stroke: a(C.gray, 0.3) }} tickLine={false} />
      <YAxis tick={tickStyle} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1000 ? `${Math.round(v / 1000)}k` : `${Math.round(v)}`} width={70} />
      <Bar dataKey="value" radius={[12, 12, 0, 0]} isAnimationActive={false}>
        {animated.map((d, i) => {
          const color = d.color ?? 'var(--accent)';
          return <Cell key={i} fill={`url(#${gradId(color)})`}
            style={{ filter: `drop-shadow(0 0 14px ${a(color, 0.55)})` }} />;
        })}
      </Bar>
    </BarChart>
  );
};

// ─── DONUT / TORTE ────────────────────────────────────────────────────────────
export const PiePremium: React.FC<{
  data: { name: string; value: number; color: string }[];
  width: number; height: number; drawStart: number; drawEnd: number;
  donut?: boolean; centerLabel?: string; textColor?: string;
}> = ({ data, width, height, drawStart, drawEnd, donut = true, centerLabel, textColor = C.white }) => {
  const f = useCurrentFrame();
  const p = prog(f, drawStart, drawEnd, E.out);
  const r = Math.min(width, height) * 0.42;
  return (
    <div style={{ width, height, position: 'relative' }}>
      <PieChart width={width} height={height}>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%"
          innerRadius={donut ? r * 0.6 : 0} outerRadius={r}
          startAngle={90} endAngle={90 - 360 * p}
          isAnimationActive={false} stroke="var(--bg)" strokeWidth={4}>
          {data.map((d, i) => <Cell key={i} fill={d.color} />)}
        </Pie>
      </PieChart>
      {centerLabel && donut && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: FONT.title, fontSize: r * 0.42, color: textColor }}>{centerLabel}</div>
      )}
    </div>
  );
};

// ─── RADAR (Profil-Vergleich, z. B. Risiko/Rendite/Liquidität) ────────────────
export const RadarPremium: React.FC<{
  data: { axis: string; value: number }[]; width: number; height: number;
  drawStart: number; drawEnd: number; color?: string;
}> = ({ data, width, height, drawStart, drawEnd, color = 'var(--accent)' }) => {
  const f = useCurrentFrame();
  const p = prog(f, drawStart, drawEnd, E.out);
  const animated = data.map((d) => ({ ...d, value: d.value * p }));
  return (
    <RadarChart width={width} height={height} data={animated} cx="50%" cy="50%" outerRadius="72%">
      <PolarGrid stroke={a(C.gray, 0.25)} />
      <PolarAngleAxis dataKey="axis" tick={{ ...tickStyle, fontSize: 26 }} />
      <Radar dataKey="value" stroke={color} strokeWidth={4} fill={color} fillOpacity={0.35}
        isAnimationActive={false} />
    </RadarChart>
  );
};

// ─── LABELEDAXISCHART — Kurve mit PFLICHT-Achsenbeschriftung ────────────────
// Löst strukturell: "Diagramm ohne Achsenbeschriftung wirkt leer" (REEL-PRINZIPIEN,
// gelernte Lektion). xLabel/yLabel sind PFLICHT-Props (kein Default) — ein Chart
// ohne Achsenkontext kann mit diesem Baustein gar nicht erst gebaut werden.
export type AxisPoint = { x: number; y: number };
export const LabeledAxisChart: React.FC<{
  data: AxisPoint[];
  xLabel: string;                      // Pflicht: was zeigt die X-Achse (z. B. "Jahre")
  yLabel: string;                      // Pflicht: was zeigt die Y-Achse (z. B. "Depotwert in €")
  width: number; height: number;
  drawStart: number; drawEnd: number;
  color?: string;
  xTicks?: { x: number; label: string }[];   // optional: eigene Tick-Werte
  yTicks?: { y: number; label: string }[];   // sonst automatisch aus min/max von data
  valueFormat?: (v: number) => string;       // Formatierung für Auto-Y-Ticks
}> = ({ data, xLabel, yLabel, width, height, drawStart, drawEnd, color = 'var(--accent)', xTicks, yTicks, valueFormat }) => {
  const f = useCurrentFrame();
  const reveal = prog(f, drawStart, drawEnd, E.inOut);
  const box = { left: 100, right: width - 40, top: 30, bottom: height - 90 };
  const cw = box.right - box.left, ch = box.bottom - box.top;
  const xs = data.map((d) => d.x), ys = data.map((d) => d.y);
  const xMin = Math.min(...xs), xMax = Math.max(...xs);
  const yMin = Math.min(0, ...ys), yMax = Math.max(...ys) || 1;
  const tx = (x: number) => box.left + ((x - xMin) / (xMax - xMin || 1)) * cw;
  const ty = (y: number) => box.bottom - ((y - yMin) / (yMax - yMin || 1)) * ch;
  const fmt = valueFormat ?? ((v: number) => (v >= 1000 ? `${Math.round(v / 1000)}k` : Math.round(v).toString()));

  const visibleCount = Math.max(2, Math.round(data.length * reveal));
  const shown = data.slice(0, visibleCount);
  const pts = shown.map((d) => `${tx(d.x).toFixed(1)},${ty(d.y).toFixed(1)}`);
  const path = pts.length > 1 ? `M ${pts.join(' L ')}` : '';
  const lastX = shown.length ? tx(shown[shown.length - 1].x) : box.left;
  const area = pts.length > 1 ? `M ${box.left},${box.bottom} L ${pts.join(' L ')} L ${lastX},${box.bottom} Z` : '';
  const gid = `labAxis-${color.replace(/[^a-z0-9]/gi, '')}`;

  const yT = yTicks ?? [0, 0.5, 1].map((t) => ({ y: yMin + t * (yMax - yMin), label: fmt(yMin + t * (yMax - yMin)) }));
  const xT = xTicks ?? [0, 0.5, 1].map((t) => ({ x: xMin + t * (xMax - xMin), label: Math.round(xMin + t * (xMax - xMin)).toString() }));

  return (
    <svg width={width} height={height} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.45} />
          <stop offset="100%" stopColor={color} stopOpacity={0.02} />
        </linearGradient>
      </defs>
      {/* Gitter */}
      {yT.map((yl, i) => (
        <line key={`g${i}`} x1={box.left} y1={ty(yl.y)} x2={box.right} y2={ty(yl.y)}
          stroke={a(C.gray, 0.12)} strokeWidth={1} strokeDasharray="10 8" />
      ))}
      {/* Achsen */}
      <line x1={box.left} y1={box.top} x2={box.left} y2={box.bottom} stroke={a(C.gray, 0.4)} strokeWidth={2} />
      <line x1={box.left} y1={box.bottom} x2={box.right} y2={box.bottom} stroke={a(C.gray, 0.4)} strokeWidth={2} />
      {/* Fläche + Kurve */}
      {area && <path d={area} fill={`url(#${gid})`} opacity={reveal > 0.02 ? 1 : 0} />}
      {path && <path d={path} fill="none" stroke={color} strokeWidth={7}
        style={{ filter: `drop-shadow(0 0 10px ${a(color, 0.7)})` }} />}
      {/* Y-Ticks + Werte */}
      {yT.map((yl, i) => (
        <text key={`yt${i}`} x={box.left - 16} y={ty(yl.y) + 7} textAnchor="end"
          fill={C.gray} fontSize={22} fontFamily={FONT.body} opacity={0.7}>{yl.label}</text>
      ))}
      {/* X-Ticks + Werte */}
      {xT.map((xl, i) => (
        <text key={`xt${i}`} x={tx(xl.x)} y={box.bottom + 34} textAnchor="middle"
          fill={C.gray} fontSize={22} fontFamily={FONT.body} opacity={0.7}>{xl.label}</text>
      ))}
      {/* Achsen-TITEL — Pflicht, immer sichtbar */}
      <text x={(box.left + box.right) / 2} y={height - 8} textAnchor="middle"
        fill={C.gray} fontSize={24} fontFamily={FONT.body} fontWeight={700}
        letterSpacing={1} opacity={0.85}>{xLabel}</text>
      <text x={0} y={0} textAnchor="middle" fill={C.gray} fontSize={24} fontFamily={FONT.body}
        fontWeight={700} letterSpacing={1} opacity={0.85}
        transform={`translate(${28}, ${(box.top + box.bottom) / 2}) rotate(-90)`}>{yLabel}</text>
    </svg>
  );
};
