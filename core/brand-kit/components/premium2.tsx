import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, spring, random } from 'remotion';
import { C, a, E, prog } from '../tokens';
import { FONT } from '../fonts';

// ─── KineticCenterBuild — Wörter bauen sich zentriert auf (bleiben) ──────────
export const KineticCenterBuild: React.FC<{
  lines: string[]; at: number; per?: number; size?: number; colors?: string[]; gap?: number;
}> = ({ lines, at, per = 14, size = 120, colors = [C.white], gap = 4 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap }}>
      {lines.map((ln, i) => {
        const lf = at + i * per;
        const p = spring({ frame: f - lf, fps, config: { damping: 12, stiffness: 220 } });
        const rot = (i % 2 ? -1 : 1) * (1 - p) * 6;
        const col = colors[i % colors.length];
        return (
          <span key={i} style={{ fontFamily: FONT.title, fontSize: size, color: col, lineHeight: 1.0,
            opacity: Math.min(p * 1.5, 1), transform: `scale(${0.6 + p * 0.4}) rotate(${rot}deg)`,
            textShadow: `0 0 40px ${a(col, 0.4)}` }}>{ln}</span>
        );
      })}
    </div>
  );
};

// ─── Constellation — Wissens-/Ökosystem-Graph (Sterne + Linien) ──────────────
export const Constellation: React.FC<{
  nodes: { x: number; y: number; label?: string }[]; w: number; h: number;
  at?: number; accent?: string; links?: [number, number][]; linkDist?: number;
}> = ({ nodes, w, h, at = 0, accent = 'var(--accent)', links, linkDist }) => {
  const f = useCurrentFrame();
  const maxD = linkDist ?? Math.min(w, h) * 0.5;
  const edges = useMemo(() => {
    if (links) return links;
    const es: [number, number][] = [];
    nodes.forEach((n, i) => nodes.forEach((m, j) => {
      if (j > i && Math.hypot(n.x - m.x, n.y - m.y) < maxD) es.push([i, j]);
    }));
    return es;
  }, [nodes, links, maxD]);
  return (
    <svg width={w} height={h} style={{ overflow: 'visible' }}>
      {edges.map(([i, j], k) => {
        const p = prog(f, at + 10 + k * 2.5, at + 30 + k * 2.5, E.out);
        if (p <= 0) return null;
        const A = nodes[i], B = nodes[j];
        return <line key={k} x1={A.x} y1={A.y} x2={A.x + (B.x - A.x) * p} y2={A.y + (B.y - A.y) * p}
          stroke={a(accent, 0.35)} strokeWidth={2} />;
      })}
      {nodes.map((n, i) => {
        const p = prog(f, at + i * 4, at + i * 4 + 14, E.spring);
        if (p <= 0) return null;
        const tw = 0.72 + 0.28 * Math.sin(f * 0.1 + i * 1.3);
        const r = (7 + (i % 3) * 3) * tw + 3;
        return (
          <g key={i} opacity={Math.min(p * 1.5, 1)}>
            <circle cx={n.x} cy={n.y} r={r} fill={accent} style={{ filter: `drop-shadow(0 0 ${r * 2.2}px ${accent})` }} />
            {n.label && <text x={n.x + r + 12} y={n.y + 9} fill={C.white} fontFamily={FONT.body}
              fontSize={27} fontWeight={600}>{n.label}</text>}
          </g>
        );
      })}
    </svg>
  );
};

// ─── WaveWipe — Enthüllung durch eine wandernde Wellenkante ──────────────────
export const WaveWipe: React.FC<{
  children: React.ReactNode; at: number; dur?: number; dir?: 'up' | 'down'; amp?: number; style?: React.CSSProperties;
}> = ({ children, at, dur = 26, dir = 'up', amp = 4, style }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + dur, E.inOut);
  const edge = dir === 'up' ? (1 - p) : p;
  const N = 18;
  const pts: string[] = [];
  for (let i = 0; i <= N; i++) {
    const x = (i / N) * 100;
    const y = edge * 100 + Math.sin((i / N) * Math.PI * 4 + f * 0.12) * amp;
    pts.push(`${x}% ${y}%`);
  }
  const poly = `polygon(${pts.join(',')}, 100% 100%, 0% 100%)`;
  return <div style={{ clipPath: poly, WebkitClipPath: poly, ...style }}>{children}</div>;
};

// ─── Dissolve — körniges Auflösen (Zellen verschwinden zufällig) ────────────
export const Dissolve: React.FC<{
  children: React.ReactNode; at: number; dur?: number; cols?: number; rows?: number; bg?: string; style?: React.CSSProperties;
}> = ({ children, at, dur = 28, cols = 14, rows = 26, bg = '#0E0A1A', style }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + dur, E.inOut);
  return (
    <div style={{ position: 'relative', ...style }}>
      {children}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'grid',
        gridTemplateColumns: `repeat(${cols},1fr)`, gridTemplateRows: `repeat(${rows},1fr)` }}>
        {Array.from({ length: cols * rows }, (_, i) => {
          const t = random(`dz${i}`);
          const rev = Math.max(0, Math.min(1, (p - t * 0.8) / 0.2));
          return <div key={i} style={{ background: bg, opacity: 1 - rev }} />;
        })}
      </div>
    </div>
  );
};

// ─── LiveCodeCompile — Code tippt sich, „läuft", zeigt Ergebnis ──────────────
export const LiveCodeCompile: React.FC<{
  code: string[]; output: string; at: number; title?: string; width?: number; fontSize?: number; cps?: number;
}> = ({ code, output, at, title = 'ki.py', width = 880, fontSize = 28, cps = 42 }) => {
  const f = useCurrentFrame();
  const perLine = 14;
  const codeDone = at + code.length * perLine;
  const run = codeDone + 6;
  const running = f >= run && f < run + 24;
  const showOut = f >= run + 24;
  return (
    <div style={{ width, borderRadius: 22, overflow: 'hidden', background: a('#0B0F14', 0.86),
      border: `1px solid ${a('var(--accent)', 0.3)}`,
      boxShadow: `0 24px 70px ${a('#000000', 0.5)}, 0 0 50px ${a('var(--accent)', 0.15)}`, backdropFilter: 'blur(8px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '14px 20px',
        borderBottom: `1px solid ${a('#FFFFFF', 0.08)}` }}>
        {['#FF5F56', '#FFBD2E', '#27C93F'].map((c) => <div key={c} style={{ width: 13, height: 13, borderRadius: 13, background: c }} />)}
        <span style={{ marginLeft: 10, fontFamily: 'monospace', fontSize: 20, color: a('#FFFFFF', 0.55) }}>{title}</span>
      </div>
      <div style={{ padding: '22px 26px', fontFamily: 'monospace', fontSize, lineHeight: 1.6, minHeight: 150 }}>
        {code.map((ln, i) => {
          const start = at + i * perLine;
          if (f < start) return <div key={i} style={{ height: fontSize * 1.6 }} />;
          const shown = Math.max(0, Math.floor(((f - start) / 30) * cps));
          const done = shown >= ln.length;
          return (
            <div key={i} style={{ color: a('#FFFFFF', 0.92), whiteSpace: 'pre' }}>
              <span style={{ color: a('var(--accent)', 0.9) }}>{String(i + 1).padStart(2, ' ')}</span>{'  '}
              {ln.slice(0, shown)}
              {!done && <span style={{ opacity: f % 16 < 8 ? 1 : 0, color: 'var(--accent)' }}>▋</span>}
            </div>
          );
        })}
      </div>
      {(running || showOut) && (
        <div style={{ padding: '16px 26px', borderTop: `1px solid ${a('#FFFFFF', 0.08)}`,
          fontFamily: 'monospace', fontSize: fontSize - 2 }}>
          {running && <span style={{ color: C.gold }}>▶ läuft …</span>}
          {showOut && <span style={{ color: C.green, fontWeight: 700 }}>✓ {output}</span>}
        </div>
      )}
    </div>
  );
};
