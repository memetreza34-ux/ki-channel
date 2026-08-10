// ════════════════════════════════════════════════════════════════════════
//  FINANZNEO · FONTS
//  Bebas Neue (Titel/Zahlen) + Inter (Text) — lokal geladen, render-sicher.
// ════════════════════════════════════════════════════════════════════════
import { continueRender, delayRender, staticFile } from 'remotion';

export const FONT = {
  title:   'Bebas Neue',  // große Titel & Zahlen
  display: 'Bebas Neue',  // semantischer Alias für datenbasierte Templates
  body:    'Inter',       // Fließtext & Labels
} as const;

// Module-Level laden -> einmal pro Render. Der Fallback verhindert, dass ein
// einzelner Browser-Tab bei FontFace.load() den kompletten Render blockiert.
const finishFonts = () => {};
