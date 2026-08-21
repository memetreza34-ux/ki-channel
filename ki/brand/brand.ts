// KI — Kanal-Identität (Brand + Theme). Baut auf @studio/core, setzt das Eigene.
import { FONT } from '@studio/core';

export const BRAND = {
  name:     'KI',
  handle:   '@ki',
  topic:    'Künstliche Intelligenz verständlich erklärt (Tools, Konzepte, News)',
  voice:    'neugierig, klar — immer „du"',
  font:     FONT.body,
  fonts:    FONT,
  // Theme:
  accent:   '#B98CFF',       // 🟣 Lila — premium/besonders
  accentDk: '#6E45C9',
  bg:       '#FFFFFF',       // 2026-07-18: Plan-Änderung — komplett weißer Hintergrund
  bgDeep:   '#F3F0FA',       // leicht lila-getönt für Vignette/Tiefe auf Weiß
  ink:      '#1A1A2E',       // Standard-Textfarbe auf hellem BG (statt Weiß)
} as const;
