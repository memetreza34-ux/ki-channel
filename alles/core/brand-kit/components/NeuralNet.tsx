import React, { useMemo } from 'react';
import { useCurrentFrame } from 'remotion';
import { C, a } from '../tokens';

// ════════════════════════════════════════════════════════════════════════════
//  NeuralNet — animierte Visualisierung eines neuronalen Netzes.
//  Schichten aus Knoten + volle Verkabelung. Eine „Welle" (wave 0..1) wandert
//  durch — vorwärts (Signal) oder rückwärts (Fehler/Backprop). weightShift zeigt
//  korrigierte Gewichte (dickere/farbige Kanten). Reines SVG, deterministisch.
//  Kern für KI-Erklärungen; theme-fähig über accent-Prop.
// ════════════════════════════════════════════════════════════════════════════
type Props = {
  layers: number[]; w: number; h: number;
  wave?: number | null; dir?: 'fwd' | 'bwd';
  accent?: string; errColor?: string; weightShift?: number; errorNode?: boolean;
};

export const NeuralNet: React.FC<Props> = ({
  layers, w, h, wave = null, dir = 'fwd', accent = 'var(--accent)', errColor = C.negative,
  weightShift = 0, errorNode = false,
}) => {
  const f = useCurrentFrame();
  const padX = 100, padY = 80;
  const L = layers.length;

  const nodes = useMemo(() => {
    const arr: { x: number; y: number; layer: number }[] = [];
    layers.forEach((n, li) => {
      const x = padX + (li * (w - 2 * padX)) / (L - 1);
      for (let j = 0; j < n; j++) {
        const y = n === 1 ? h / 2 : padY + (j * (h - 2 * padY)) / (n - 1);
        arr.push({ x, y, layer: li });
      }
    });
    return arr;
  }, [layers, w, h, L]);

  const edges = useMemo(() => {
    const es: { x1: number; y1: number; x2: number; y2: number; mx: number }[] = [];
    for (let li = 0; li < L - 1; li++) {
      const a1 = nodes.filter((n) => n.layer === li);
      const a2 = nodes.filter((n) => n.layer === li + 1);
      a1.forEach((p) => a2.forEach((q) => es.push({ x1: p.x, y1: p.y, x2: q.x, y2: q.y, mx: (p.x + q.x) / 2 })));
    }
    return es;
  }, [nodes, L]);

  const waveX = wave == null ? null : padX + wave * (w - 2 * padX);
  const bright = (x: number, spread = 170) => (waveX == null ? 0 : Math.max(0, 1 - Math.abs(x - waveX) / spread));
  const active = dir === 'bwd' ? errColor : accent;
  const maxX = padX + (w - 2 * padX);

  return (
    <svg width={w} height={h} style={{ overflow: 'visible' }}>
      {edges.map((e, i) => {
        const b = bright(e.mx);
        const corrected = weightShift > 0 && i % 3 === 0;
        const stroke = b > 0.05 ? a(active, 0.28 + b * 0.6) : corrected ? a(accent, 0.42) : a(C.gray, 0.12);
        const sw = 1 + (corrected ? weightShift * 2.4 : 0) + b * 2.6;
        return <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke={stroke} strokeWidth={sw} strokeLinecap="round" />;
      })}
      {waveX != null && edges.map((e, i) => {
        if (i % 4 !== 0) return null;
        const b = bright(e.mx, 130);
        if (b <= 0.2) return null;
        const t = (waveX - e.x1) / (e.x2 - e.x1 || 1);
        if (t < 0 || t > 1) return null;
        const x = e.x1 + t * (e.x2 - e.x1), y = e.y1 + t * (e.y2 - e.y1);
        return <circle key={'d' + i} cx={x} cy={y} r={4 + b * 3} fill={active}
          style={{ filter: `drop-shadow(0 0 9px ${active})` }} />;
      })}
      {nodes.map((n, i) => {
        const isOut = n.x >= maxX - 1;
        const b = bright(n.x, 140);
        const err = errorNode && isOut;
        const col = err ? errColor : b > 0.1 ? active : C.gray;
        const glow = err ? 1 : b;
        const r = 15 + b * 7 + Math.sin(f * 0.12 + i) * 1.2 + (err ? 5 : 0);
        return (
          <g key={'n' + i}>
            {glow > 0.12 && <circle cx={n.x} cy={n.y} r={r * 2.4} fill={a(col, 0.10 * glow)} />}
            <circle cx={n.x} cy={n.y} r={r} fill={a(col, 0.12 + glow * 0.32)}
              stroke={a(col, 0.6 + glow * 0.4)} strokeWidth={2.5}
              style={{ filter: glow > 0.15 ? `drop-shadow(0 0 ${14 + glow * 20}px ${col})` : undefined }} />
            <circle cx={n.x} cy={n.y} r={r * 0.34} fill={col} opacity={0.45 + glow * 0.55} />
          </g>
        );
      })}
    </svg>
  );
};
