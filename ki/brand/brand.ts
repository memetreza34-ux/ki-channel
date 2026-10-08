// KI — Kanal-Identität (Brand + Theme). Baut auf @studio/core, setzt das Eigene.
import { FONT } from '@studio/core';

export const BRAND = {
  name:     'KI',
  handle:   '@ki',
  topic:    'Künstliche Intelligenz verständlich erklärt (Tools, Konzepte, News)',
  voice:    'neugierig, klar — immer „du"',
  // Backward-compatible CSS font string used throughout the existing Remotion scenes.
  font:     FONT.body,
  // Full typography palette for new code that explicitly distinguishes display/body.
  fonts:    FONT,
  // KI-Longform nutzt bewusst Inter auch als Display-Schrift.
  // Bebas Neue bleibt im Shared Core verfügbar, ist aber keine KI-Default-Typografie mehr.
  titleFont: FONT.body,
  displayFont: FONT.body,
  bodyFont:  FONT.body,
  codeFont: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  // Theme:
  accent:   '#B98CFF',       // 🟣 Lila — premium/besonders
  accentDk: '#6E45C9',
  bg:       '#FFFFFF',       // 2026-07-18: Plan-Änderung — komplett weißer Hintergrund
  bgDeep:   '#F3F0FA',       // leicht lila-getönt für Vignette/Tiefe auf Weiß
  ink:      '#1A1A2E',       // Standard-Textfarbe auf hellem BG (statt Weiß)
} as const;
