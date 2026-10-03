import React from 'react';
import {evolvePath, getLength, getPointAtLength} from '@remotion/paths';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp01, mix, pop, progress} from './motion';
import {useTheme} from './themes';

type LineChartProps = {
  values: number[];
  /** Beschriftung der x-Achse, gleiche Länge wie `values`. */
  labels?: string[];
  width?: number;
  height?: number;
  delay?: number;
  duration?: number;
  color?: string;
  min?: number;
  max?: number;
  /** Text am Endpunkt, z. B. "+38 %". */
  endLabel?: string;
};

/** Linie zeichnet sich von links nach rechts, Fläche darunter füllt sich mit. */
export const LineChart: React.FC<LineChartProps> = ({
  values,
  labels,
  width = 900,
  height = 520,
  delay = 0,
  duration = 40,
  color: colorProp,
  min,
  max,
  endLabel,
}) => {
  const t = useTheme();
  const color = colorProp ?? t.c.accentDeep;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const padX = 30;
  const padTop = 70;
  const padBottom = labels ? 70 : 30;
  const lo = min ?? Math.min(...values);
  const hi = max ?? Math.max(...values);
  const span = hi - lo || 1;
  const pts = values.map((v, i) => ({
    x: padX + (i / Math.max(1, values.length - 1)) * (width - padX * 2),
    y: padTop + (1 - (v - lo) / span) * (height - padTop - padBottom),
  }));
  // Weiche Kurve durch alle Punkte (Catmull-Rom → Bézier).
  const d = pts
    .map((p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      const p0 = pts[i - 2] ?? pts[i - 1];
      const p1 = pts[i - 1];
      const p3 = pts[i + 1] ?? p;
      const c1 = {x: p1.x + (p.x - p0.x) / 6, y: p1.y + (p.y - p0.y) / 6};
      const c2 = {x: p.x - (p3.x - p1.x) / 6, y: p.y - (p3.y - p1.y) / 6};
      return `C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${p.x} ${p.y}`;
    })
    .join(' ');
  const p = progress(frame, delay, duration, 'inOut');
  const evolved = evolvePath(p, d);
  const len = getLength(d);
  const tip = getPointAtLength(d, len * p) ?? pts[0];
  const baseY = height - padBottom;
  const end = pop(frame, fps, delay + duration - 4, 'snappy');
  const gradientId = `lc-${values.join('-')}`;
  return (
    <svg width={width} height={height} style={{overflow: 'visible'}}>
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.28} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
        <clipPath id={`${gradientId}-clip`}>
          <rect x={0} y={0} width={tip.x} height={height} />
        </clipPath>
      </defs>
      {[0, 0.5, 1].map((f) => (
        <line key={f} x1={padX} x2={width - padX} y1={padTop + f * (baseY - padTop)} y2={padTop + f * (baseY - padTop)} stroke={t.c.line} strokeWidth={3} strokeDasharray="2 12" strokeLinecap="round" />
      ))}
      <path d={`${d} L ${pts[pts.length - 1].x} ${baseY} L ${pts[0].x} ${baseY} Z`} fill={`url(#${gradientId})`} clipPath={`url(#${gradientId}-clip)`} />
      <path d={d} fill="none" stroke={color} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={evolved.strokeDasharray} strokeDashoffset={evolved.strokeDashoffset} />
      {p > 0 ? <circle cx={tip.x} cy={tip.y} r={16} fill={t.c.surface} stroke={color} strokeWidth={8} /> : null}
      {labels?.map((l, i) => (
        <text
          key={l}
          x={pts[i].x}
          y={height - 18}
          textAnchor={i === 0 ? 'start' : i === labels.length - 1 ? 'end' : 'middle'}
          fontFamily={t.font.body}
          fontWeight={700}
          fontSize={30}
          fill={t.c.inkSoft}
          opacity={clamp01((p * values.length - i) * 2 + 0.6)}
        >
          {l}
        </text>
      ))}
      {endLabel ? (
        <g transform={`translate(${pts[pts.length - 1].x} ${pts[pts.length - 1].y - 44}) scale(${Math.max(0, end)})`} opacity={clamp01(end * 2)}>
          <rect x={-110} y={-44} width={220} height={70} rx={35} fill={color} />
          <text x={0} y={4} textAnchor="middle" fontFamily={t.font.body} fontWeight={900} fontSize={36} fill="#FFFFFF">
            {endLabel}
          </text>
        </g>
      ) : null}
    </svg>
  );
};

type DonutProps = {
  /** Anteil in Prozent (0–100). */
  value: number;
  size?: number;
  thickness?: number;
  delay?: number;
  duration?: number;
  color?: string;
  /** Zeile unter der Zahl. */
  label?: string;
};

/** Ring füllt sich bis zum Anteil, die Zahl in der Mitte zählt mit. */
export const Donut: React.FC<DonutProps> = ({value, size = 420, thickness = 46, delay = 0, duration = 40, color: colorProp, label}) => {
  const t = useTheme();
  const color = colorProp ?? t.c.accentDeep;
  const frame = useCurrentFrame();
  const p = progress(frame, delay, duration, 'out');
  const appear = progress(frame, delay - 8, 12, 'soft');
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const shown = mix(0, value, p);
  return (
    <div style={{position: 'relative', width: size, height: size, opacity: appear, transform: `scale(${mix(0.9, 1, appear)})`}}>
      <svg width={size} height={size} style={{transform: 'rotate(-90deg)'}}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={t.c.line} strokeWidth={thickness} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={`${(c * shown) / 100} ${c}`}
          opacity={shown > 0.2 ? 1 : 0}
        />
      </svg>
      <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontFamily: t.font.body, fontWeight: 900, fontSize: size * 0.24, letterSpacing: '-0.04em', color: t.c.ink, fontVariantNumeric: 'tabular-nums'}}>
          {Math.round(shown).toLocaleString('de-DE')} %
        </div>
        {label ? (
          <div
            style={{
              fontFamily: t.font.body,
              fontWeight: 700,
              fontSize: size * 0.062,
              lineHeight: 1.15,
              color: t.c.inkSoft,
              marginTop: size * 0.01,
              maxWidth: (size - thickness * 2) * 0.72,
              textAlign: 'center',
            }}
          >
            {label}
          </div>
        ) : null}
      </div>
    </div>
  );
};
