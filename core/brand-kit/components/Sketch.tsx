import React, { useMemo } from 'react';
import { useCurrentFrame } from 'remotion';
import rough from 'roughjs/bin/rough';
import type { Options as RoughOptions, Drawable } from 'roughjs/bin/core';
import { getLength } from '@remotion/paths';
import { E, prog } from '../tokens';
import { Lucide } from './Lucide';
import type { IconName } from './Icon';

// ════════════════════════════════════════════════════════════════════════════
//  SKETCH / WIREFRAME-BAUSTEINE — dritter Baustil (neben Premium-Glow &
//  Card/Lucide-Hausstil): handgezeichnete Whiteboard-Optik, cremefarbenes
//  Papier, schwarze Tinte, ein Akzent-Ton. Basiert auf roughjs (Pfad-
//  Erzeugung mit Wackel/Bowing) + @remotion/paths (exaktes Draw-On-Timing
//  via strokeDasharray/-offset, seek-sicher & deterministisch — kein DOM,
//  kein Random ohne Seed).
// ════════════════════════════════════════════════════════════════════════════

export const SKETCH = {
  paper:    '#F6EFE0',   // cremefarbener Hintergrund
  paperDk:  '#ECE2CB',   // etwas dunkler (Karten/Schatten)
  ink:      '#2B2620',   // fast-schwarze Sketch-Linie
  inkSoft:  '#5C5346',   // gedämpfte Tinte (Sekundärlinien)
  accent:   '#D9662A',   // Akzent-Ton (warmes Orange) — per Prop überschreibbar
} as const;

const gen = rough.generator({ options: { disableMultiStrokeFill: true } });

// Extrahiert die Stroke-„d"-Pfade eines Drawable (type 'path' = Umriss/Linie).
function strokePaths(drawable: Drawable): string[] {
  return drawable.sets.filter((s) => s.type === 'path').map((s) => gen.opsToPath(s));
}

/** Zeichnet einen (bereits handgezeichnet-verwackelten) SVG-Pfad frame-genau auf. */
const DrawPath: React.FC<{
  d: string; at: number; dur?: number; color?: string; width?: number;
  easing?: typeof E.out; lineCap?: 'round' | 'butt' | 'square'; style?: React.CSSProperties;
}> = ({ d, at, dur = 22, color = SKETCH.ink, width = 3.5, easing = E.out, lineCap = 'round', style }) => {
  const f = useCurrentFrame();
  const len = useMemo(() => getLength(d), [d]);
  const p = prog(f, at, at + dur, easing);
  if (p <= 0) return null;
  return (
    <path
      d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap={lineCap} strokeLinejoin="round"
      strokeDasharray={len} strokeDashoffset={len * (1 - p)} style={style}
    />
  );
};

const roughOpts = (seed: number, extra?: RoughOptions): RoughOptions => ({
  roughness: 2.3, bowing: 2, seed, stroke: SKETCH.ink, strokeWidth: 3.5, ...extra,
});

// ─── 1) SketchBox — handgezeichnetes Rechteck (Karte/Rahmen) zeichnet sich auf ──
export const SketchBox: React.FC<{
  w?: number; h?: number; at?: number; dur?: number; color?: string; strokeW?: number; seed?: number;
  radius?: number; children?: React.ReactNode; style?: React.CSSProperties;
}> = ({ w = 480, h = 260, at = 0, dur = 26, color = SKETCH.ink, strokeW = 4, seed = 1, children, style }) => {
  const paths = useMemo(
    () => strokePaths(gen.rectangle(4, 4, w - 8, h - 8, roughOpts(seed, { stroke: color, strokeWidth: strokeW }))),
    [w, h, color, strokeW, seed],
  );
  return (
    <div style={{ position: 'relative', width: w, height: h, ...style }}>
      <svg width={w} height={h} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        {paths.map((d, i) => (
          <DrawPath key={i} d={d} at={at + i * 6} dur={dur} color={color} width={strokeW} />
        ))}
      </svg>
      {children && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {children}
        </div>
      )}
    </div>
  );
};

// ─── 2) SketchCircle — handgezeichneter Kreis (Fokus/Highlight) um ein Element ──
export const SketchCircle: React.FC<{
  size?: number; at?: number; dur?: number; color?: string; strokeW?: number; seed?: number;
  children?: React.ReactNode; padding?: number; style?: React.CSSProperties;
}> = ({ size = 220, at = 0, dur = 20, color = SKETCH.accent, strokeW = 5, seed = 2, children, padding = 0, style }) => {
  const s = size + padding * 2;
  const paths = useMemo(
    () => strokePaths(gen.ellipse(s / 2, s / 2, s - 10, s * 0.86 - 10, roughOpts(seed, { stroke: color, strokeWidth: strokeW }))),
    [s, color, strokeW, seed],
  );
  return (
    <div style={{ position: 'relative', width: s, height: s, ...style }}>
      {children && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {children}
        </div>
      )}
      <svg width={s} height={s} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        {paths.map((d, i) => <DrawPath key={i} d={d} at={at} dur={dur} color={color} width={strokeW} />)}
      </svg>
    </div>
  );
};

// ─── 3) SketchUnderline — handgezeichnete Unterstreichung unter einem Wort ──────
export const SketchUnderline: React.FC<{
  w?: number; at?: number; dur?: number; color?: string; strokeW?: number; seed?: number;
  double?: boolean; style?: React.CSSProperties;
}> = ({ w = 260, at = 0, dur = 14, color = SKETCH.accent, strokeW = 6, seed = 3, double = false, style }) => {
  const paths = useMemo(() => {
    const pts: [number, number][] = double
      ? [[4, 6], [w * 0.35, 0], [w * 0.68, 8], [w - 4, 2]]
      : [[4, 6], [w * 0.5, 0], [w - 4, 7]];
    return strokePaths(gen.curve(pts, roughOpts(seed, { stroke: color, strokeWidth: strokeW })));
  }, [w, color, strokeW, seed, double]);
  return (
    <svg width={w} height={16} style={{ overflow: 'visible', display: 'block', ...style }}>
      {paths.map((d, i) => <DrawPath key={i} d={d} at={at} dur={dur} color={color} width={strokeW} />)}
    </svg>
  );
};

// ─── 4) SketchArrow — handgezeichneter Pfeil zwischen zwei Punkten ──────────────
export const SketchArrow: React.FC<{
  x1: number; y1: number; x2: number; y2: number; at?: number; dur?: number;
  color?: string; strokeW?: number; seed?: number; curved?: boolean;
}> = ({ x1, y1, x2, y2, at = 0, dur = 18, color = SKETCH.ink, strokeW = 4, seed = 4, curved = true }) => {
  const headLen = 22, ang = Math.atan2(y2 - y1, x2 - x1);
  const wingA = ang + Math.PI - 0.5, wingB = ang + Math.PI + 0.5;
  const shaft = useMemo(() => {
    const mx = (x1 + x2) / 2 - (y2 - y1) * (curved ? 0.14 : 0);
    const my = (y1 + y2) / 2 + (x2 - x1) * (curved ? 0.14 : 0);
    const pts: [number, number][] = curved ? [[x1, y1], [mx, my], [x2, y2]] : [[x1, y1], [x2, y2]];
    return strokePaths(gen.curve(pts, roughOpts(seed, { stroke: color, strokeWidth: strokeW })));
  }, [x1, y1, x2, y2, color, strokeW, seed, curved]);
  const head = useMemo(() => strokePaths(gen.linearPath(
    [[x2 - headLen * Math.cos(wingA), y2 - headLen * Math.sin(wingA)], [x2, y2], [x2 - headLen * Math.cos(wingB), y2 - headLen * Math.sin(wingB)]],
    roughOpts(seed + 1, { stroke: color, strokeWidth: strokeW }),
  )), [x2, y2, wingA, wingB, color, strokeW, seed]);
  return (
    <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none' }}>
      {shaft.map((d, i) => <DrawPath key={`s${i}`} d={d} at={at} dur={dur} color={color} width={strokeW} />)}
      {head.map((d, i) => <DrawPath key={`h${i}`} d={d} at={at + dur * 0.7} dur={dur * 0.4} color={color} width={strokeW} />)}
    </svg>
  );
};

// ─── 5) SketchIconCard — 3 Karten nebeneinander (Icon + Label), Rahmen skizziert ─
export const SketchIconCard: React.FC<{
  icon: IconName | string; label: string; at?: number; w?: number; h?: number; color?: string; seed?: number;
}> = ({ icon, label, at = 0, w = 280, h = 320, color = SKETCH.ink, seed = 5 }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 14, E.spring);
  return (
    <div style={{ opacity: Math.min(p * 1.4, 1), transform: `translateY(${(1 - p) * 20}px) scale(${0.92 + p * 0.08})` }}>
      <SketchBox w={w} h={h} at={at} color={color} strokeW={3.5} seed={seed}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
          <Lucide name={icon} size={64} color={SKETCH.accent} glow={false} stroke={2} />
          <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 30, color: SKETCH.ink, textAlign: 'center' }}>{label}</div>
        </div>
      </SketchBox>
    </div>
  );
};

// ─── 6) SketchChecklist — Zeilen haken sich nacheinander handgezeichnet ab ──────
export const SketchChecklist: React.FC<{
  items: string[]; at?: number; step?: number; w?: number; color?: string; accent?: string;
}> = ({ items, at = 0, step = 22, w = 620, color = SKETCH.ink, accent = SKETCH.accent }) => {
  const boxSize = 44;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 30, width: w }}>
      {items.map((text, i) => {
        const rowAt = at + i * step;
        const boxPaths = strokePaths(gen.rectangle(4, 4, boxSize - 8, boxSize - 8, roughOpts(10 + i, { stroke: color, strokeWidth: 3.2 })));
        const checkPaths = strokePaths(gen.linearPath(
          [[9, 24], [18, 34], [37, 8]], roughOpts(20 + i, { stroke: accent, strokeWidth: 4.5 }),
        ));
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <svg width={boxSize} height={boxSize} style={{ overflow: 'visible', flexShrink: 0 }}>
              {boxPaths.map((d, k) => <DrawPath key={`b${k}`} d={d} at={rowAt} dur={12} color={color} width={3.2} />)}
              {checkPaths.map((d, k) => <DrawPath key={`c${k}`} d={d} at={rowAt + 10} dur={12} color={accent} width={4.5} />)}
            </svg>
            <SketchUnderlineText text={text} at={rowAt + 8} />
          </div>
        );
      })}
    </div>
  );
};

// Zeile mit sanftem Auftritt (kein Draw-On nötig — nur Text der Checklist).
const SketchUnderlineText: React.FC<{ text: string; at: number }> = ({ text, at }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 12, E.out);
  return (
    <span style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 32, color: SKETCH.ink, opacity: p, transform: `translateX(${(1 - p) * 12}px)`, display: 'inline-block' }}>
      {text}
    </span>
  );
};

// ─── 7) SketchWireframeBox — grobe Wireframe-Blöcke lösen sich zu Sketch-Box auf ─
export const SketchWireframeBox: React.FC<{
  w?: number; h?: number; at?: number; label?: string; color?: string; seed?: number;
}> = ({ w = 420, h = 240, at = 0, label, color = SKETCH.ink, seed = 6 }) => {
  const f = useCurrentFrame();
  const resolve = prog(f, at + 24, at + 46, E.inOut); // Blöcke → echte Sketch-Box
  const blocks = useMemo(() => ([
    { x: 0, y: 0, w: w * 0.42, h: h * 0.42 },
    { x: w * 0.5, y: 0, w: w * 0.5, h: h * 0.28 },
    { x: 0, y: h * 0.5, w: w, h: h * 0.16 },
    { x: 0, y: h * 0.72, w: w * 0.6, h: h * 0.14 },
  ]), [w, h]);
  const boxPaths = useMemo(
    () => strokePaths(gen.rectangle(4, 4, w - 8, h - 8, roughOpts(seed, { stroke: color, strokeWidth: 4 }))),
    [w, h, color, seed],
  );
  return (
    <div style={{ position: 'relative', width: w, height: h }}>
      <div style={{ position: 'absolute', inset: 0, opacity: Math.min(prog(f, at, at + 14, E.out) * (1 - resolve), 1) }}>
        {blocks.map((b, i) => (
          <div key={i} style={{ position: 'absolute', left: b.x, top: b.y, width: b.w, height: b.h, background: '#D8D0BE', borderRadius: 6 }} />
        ))}
      </div>
      <svg width={w} height={h} style={{ position: 'absolute', inset: 0, overflow: 'visible', opacity: resolve }}>
        {boxPaths.map((d, i) => <DrawPath key={i} d={d} at={at + 20} dur={20} color={color} width={4} />)}
      </svg>
      {label && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: resolve,
          fontFamily: 'Inter', fontWeight: 700, fontSize: 30, color: SKETCH.ink }}>
          {label}
        </div>
      )}
    </div>
  );
};
