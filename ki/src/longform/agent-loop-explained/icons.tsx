import React from 'react';

/**
 * Icon-Sammlung fuer die Kapitel-Bilder.
 *
 * Reine SVG-Pfade ohne Bitmaps, damit sie in jeder Groesse scharf bleiben und
 * sich einzeichnen lassen, statt nur aufzupoppen.
 */
/** Kleine Icon-Sammlung fuer die Kapitel. */
export const ICONS = {
  suche: <><circle cx="14" cy="14" r="8" /><path d="M20 20l7 7" /></>,
  datei: <><path d="M4 8a2 2 0 012-2h7l3 4h10a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2z" /></>,
  code: <><path d="M11 10l-7 6 7 6M21 10l7 6-7 6" /></>,
  browser: <><rect x="3" y="6" width="26" height="20" rx="3" /><path d="M3 12h26M8 9h.01M12 9h.01" /></>,
  modell: <><circle cx="16" cy="16" r="9" /><circle cx="16" cy="16" r="3" /><path d="M16 2v4M16 26v4M2 16h4M26 16h4" /></>,
  ziel: <><circle cx="16" cy="16" r="11" /><circle cx="16" cy="16" r="6" /><circle cx="16" cy="16" r="1.6" /></>,
  check: <><circle cx="16" cy="16" r="12" /><path d="M10 16.5l4 4 8-8.5" /></>,
  warn: <><path d="M16 5L29 27H3z" /><path d="M16 13v6M16 23h.01" /></>,
  schild: <><path d="M16 3l11 4v9c0 7-4.7 11.4-11 13-6.3-1.6-11-6-11-13V7z" /><path d="M11 16l3.5 3.5L21 13" /></>,
  loop: <><path d="M27 16a11 11 0 11-3.6-8.1" /><path d="M27 5v7h-7" /></>,
  stop: <><circle cx="16" cy="16" r="12" /><path d="M11 11l10 10M21 11L11 21" /></>,
  db: <><ellipse cx="16" cy="8" rx="11" ry="4" /><path d="M5 8v16c0 2.2 4.9 4 11 4s11-1.8 11-4V8" /><path d="M5 16c0 2.2 4.9 4 11 4s11-1.8 11-4" /></>,
} as const;
