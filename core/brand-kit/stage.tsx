// ════════════════════════════════════════════════════════════════════════════
//  STUDIO CORE · STAGE  — Layout- & Choreografie-Motor
//  Verhindert baulich: Quetschen, Überlappung, falsche Größen, lose Cuts.
//  - Raster/Zonen  → ganze Fläche nutzen, definierte Slots (keine Überlappung)
//  - Move (Posen)  → Elemente BLEIBEN und bewegen sich weich (Choreografie)
//  - Focus/dim     → Wichtiges hervorheben, Rest zurücknehmen
// ════════════════════════════════════════════════════════════════════════════
import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { E, CLAMP, a } from './tokens';
import { useTheme } from './theme';

export const CANVAS = { w: 1920, h: 1080 } as const;
export const MARGIN = 96; // Safe-Margin — nie Inhalt dichter an den Rand

export const SAFE = {
  x: MARGIN, y: MARGIN, w: CANVAS.w - 2 * MARGIN, h: CANVAS.h - 2 * MARGIN,
} as const;

export type Box = { position: 'absolute'; left: number; top: number; width: number; height: number };

/** Zelle aus einem Raster (Default 12×6) über der Safe-Area. Slots überlappen nie. */
export function cell(col: number, row: number, colSpan = 1, rowSpan = 1, cols = 12, rows = 6): Box {
  const cw = SAFE.w / cols, ch = SAFE.h / rows;
  return {
    position: 'absolute',
    left: SAFE.x + col * cw,
    top: SAFE.y + row * ch,
    width: cw * colSpan,
    height: ch * rowSpan,
  };
}

/** Häufige, nicht-überlappende Kompositions-Zonen (ganze Fläche). */
export const ZONE = {
  full:    () => cell(0, 0, 12, 6),
  left:    () => cell(0, 0, 6, 6),
  right:   () => cell(6, 0, 6, 6),
  top:     () => cell(0, 0, 12, 3),
  bottom:  () => cell(0, 3, 12, 3),
  center:  () => cell(2, 1, 8, 4),
  hero:    () => cell(0, 1, 8, 4),   // großes Hauptelement links/mitte
  side:    () => cell(8, 1, 4, 4),   // Stützelement rechts
  topLeft: () => cell(0, 0, 6, 3),
  topRight:() => cell(6, 0, 6, 3),
  botLeft: () => cell(0, 3, 6, 3),
  botRight:() => cell(6, 3, 6, 3),
} as const;

/**
 * Fabrik für den Layout-Motor auf einer beliebigen Canvas-Größe (z. B. 1080×1920
 * für Shorts/Reels — `cell`/`ZONE`/`SAFE` oben sind fest auf 1920×1080 kalibriert).
 * Liefert eine eigene `safe`/`cell`/`ZONE` gebunden an die übergebene Canvas.
 */
export function makeGrid(canvas: { w: number; h: number }, margin = MARGIN) {
  const safe = { x: margin, y: margin, w: canvas.w - 2 * margin, h: canvas.h - 2 * margin };
  function gridCell(col: number, row: number, colSpan = 1, rowSpan = 1, cols = 12, rows = 6): Box {
    const cw = safe.w / cols, ch = safe.h / rows;
    return {
      position: 'absolute',
      left: safe.x + col * cw,
      top: safe.y + row * ch,
      width: cw * colSpan,
      height: ch * rowSpan,
    };
  }
  const gridZone = {
    full:    () => gridCell(0, 0, 12, 6),
    left:    () => gridCell(0, 0, 6, 6),
    right:   () => gridCell(6, 0, 6, 6),
    top:     () => gridCell(0, 0, 12, 3),
    bottom:  () => gridCell(0, 3, 12, 3),
    center:  () => gridCell(2, 1, 8, 4),
    hero:    () => gridCell(0, 1, 8, 4),
    side:    () => gridCell(8, 1, 4, 4),
    topLeft: () => gridCell(0, 0, 6, 3),
    topRight:() => gridCell(6, 0, 6, 3),
    botLeft: () => gridCell(0, 3, 6, 3),
    botRight:() => gridCell(6, 3, 6, 3),
  } as const;
  return { safe, cell: gridCell, ZONE: gridZone };
}

/** Box als Flex-Container (zentriert) — bequem zum Platzieren von Inhalt in einer Zone. */
export const Slot: React.FC<{ box: Box; align?: string; justify?: string; children: React.ReactNode;
  style?: React.CSSProperties }> = ({ box, align = 'center', justify = 'center', children, style }) => (
  <div style={{ ...box, display: 'flex', alignItems: align, justifyContent: justify, ...style }}>
    {children}
  </div>
);

// ─── Choreografie: ein Element bleibt bestehen & bewegt sich zwischen Posen ───
export type Key = { f: number; x?: number; y?: number; scale?: number; opacity?: number; rot?: number };

/** Tweent ein Element weich durch Pose-Keyframes (object permanence statt harter Cuts). */
export const Move: React.FC<{ keys: Key[]; children: React.ReactNode; style?: React.CSSProperties }> = ({
  keys, children, style,
}) => {
  const f = useCurrentFrame();
  const frames = keys.map((k) => k.f);
  const at = (sel: (k: Key) => number | undefined, def: number) => {
    const vals = keys.map((k) => sel(k) ?? def);
    return frames.length === 1 ? vals[0] : interpolate(f, frames, vals, { ...CLAMP, easing: E.out });
  };
  const x = at((k) => k.x, 0), y = at((k) => k.y, 0);
  const s = at((k) => k.scale, 1), o = at((k) => k.opacity, 1), r = at((k) => k.rot, 0);
  return (
    <div style={{ position: 'absolute', transform: `translate(${x}px,${y}px) scale(${s}) rotate(${r}deg)`,
      opacity: o, ...style }}>
      {children}
    </div>
  );
};

// ─── Hervorhebung: Wichtiges groß + Glow, Rest zurücknehmen ──────────────────
/** Hebt das fokussierte Element hervor (Scale + Akzent-Glow aus dem Theme). */
export const Focus: React.FC<{ on?: boolean; amount?: number; children: React.ReactNode;
  style?: React.CSSProperties }> = ({ on = true, amount = 0.06, children, style }) => {
  const theme = useTheme();
  return (
    <div style={{ transform: `scale(${on ? 1 + amount : 1})`,
      filter: on ? `drop-shadow(0 0 42px ${a(theme.accent, 0.55)})` : 'none', ...style }}>
      {children}
    </div>
  );
};

/** Style zum Zurücknehmen aller NICHT-fokussierten Elemente. */
export const dim = (active: boolean): React.CSSProperties =>
  active ? { opacity: 0.32, filter: 'saturate(0.65)' } : {};
