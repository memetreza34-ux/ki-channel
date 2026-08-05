import React from 'react';
import { AbsoluteFill, useCurrentFrame, random } from 'remotion';
import { C, prog } from '../tokens';

// GEZIELTER Partikel-Einsatz (Regel: nie durchgehend!).
// Variante "drift": sanftes Schweben. Variante "burst": einmaliger Ausbruch ab `burstAt`.
export const Particles: React.FC<{
  width: number; height: number;
  color?: string; n?: number; mode?: 'drift' | 'burst'; burstAt?: number;
}> = ({ width, height, color = 'var(--accent)', n = 40, mode = 'drift', burstAt = 0 }) => {
  const f = useCurrentFrame();

  if (mode === 'burst') {
    const b = prog(f, burstAt, burstAt + 18);
    return (
      <AbsoluteFill style={{ pointerEvents: 'none' }}>
        {Array.from({ length: n }, (_, i) => {
          const ang = (i / n) * Math.PI * 2;
          const dist = b * (360 + random(`d${i}`) * 340);
          const x = width / 2 + Math.cos(ang) * dist;
          const y = height / 2 + Math.sin(ang) * dist;
          const sz = 5 + random(`s${i}`) * 9;
          return <div key={i} style={{ position: 'absolute', left: x, top: y, width: sz, height: sz,
            borderRadius: '50%', background: i % 3 === 0 ? C.gold : color, opacity: (1 - b) * 0.9,
            boxShadow: `0 0 ${sz * 2}px ${i % 3 === 0 ? C.gold : color}` }} />;
        })}
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ overflow: 'hidden', pointerEvents: 'none' }}>
      {Array.from({ length: n }, (_, i) => {
        const x = (i * 193 + 57) % width;
        const base = (i * 379 + 113) % (height + 400);
        const y = (base - f * (0.12 + (i % 6) * 0.03) + height + 600) % (height + 600) - 200;
        const sz = 1.2 + (i % 5) * 0.8;
        return <div key={i} style={{ position: 'absolute', left: x, top: y, width: sz, height: sz,
          borderRadius: '50%', background: color, opacity: 0.06 + (i % 5) * 0.04,
          boxShadow: `0 0 ${5 + sz * 4}px ${color}` }} />;
      })}
    </AbsoluteFill>
  );
};
