// ════════════════════════════════════════════════════════════════════════════
//  STUDIO CORE · THEME
//  Brand-Identität lebt NICHT im core, sondern pro Kanal (channels/<name>/brand).
//  <ThemeProvider value={BRAND}> setzt CSS-Variablen (--accent, --accent-dk,
//  --accent-lt, --bg, --bg-deep) — Bausteine nutzen var(--accent) bzw. useTheme().
// ════════════════════════════════════════════════════════════════════════════
import React, { createContext, useContext } from 'react';
import { AbsoluteFill } from 'remotion';
import { C } from './tokens';

export type Theme = {
  accent: string;      // Signatur-Akzent des Kanals
  accentDk?: string;   // dunklere Variante (Glows/Verläufe)
  accentLt?: string;   // hellere Variante
  bg: string;          // Haupt-Hintergrund des Kanals
  bgDeep?: string;     // tiefere Variante (Vignette/Verlauf)
};

// Neutraler Fallback — bewusst KEIN Kanal-Grün. Jeder Kanal überschreibt das.
export const defaultTheme: Theme = {
  accent:   C.blue,
  accentDk: '#1E5BB8',
  accentLt: C.blueLt,
  bg:       C.bgNeutral,
  bgDeep:   C.bgDeep,
};

const ThemeCtx = createContext<Theme>(defaultTheme);
export const useTheme = (): Theme => useContext(ThemeCtx);

// Setzt Context UND CSS-Variablen, damit Bausteine var(--accent) nutzen können.
export const ThemeProvider: React.FC<{ value: Theme; children: React.ReactNode }> = ({ value, children }) => {
  const vars = {
    '--accent': value.accent,
    '--accent-dk': value.accentDk ?? value.accent,
    '--accent-lt': value.accentLt ?? value.accent,
    '--bg': value.bg,
    '--bg-deep': value.bgDeep ?? value.bg,
  } as React.CSSProperties;
  return (
    <ThemeCtx.Provider value={value}>
      <AbsoluteFill style={vars}>{children}</AbsoluteFill>
    </ThemeCtx.Provider>
  );
};
