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
const handle = delayRender('FinanzNeo Fonts laden', { timeoutInMilliseconds: 900000 });
let fontsDone = false;
const finishFonts = () => {
  if (!fontsDone) {
    fontsDone = true;
    continueRender(handle);
  }
};

const faces: FontFace[] = [
  new FontFace('Bebas Neue', `url(${staticFile('fonts/BebasNeue-400.woff2')})`, { weight: '400' }),
  new FontFace('Inter', `url(${staticFile('fonts/Inter-400.woff2')})`, { weight: '400' }),
  new FontFace('Inter', `url(${staticFile('fonts/Inter-600.woff2')})`, { weight: '600' }),
  new FontFace('Inter', `url(${staticFile('fonts/Inter-700.woff2')})`, { weight: '700' }),
  new FontFace('Inter', `url(${staticFile('fonts/Inter-800.woff2')})`, { weight: '800' }),
  new FontFace('Inter', `url(${staticFile('fonts/Inter-900.woff2')})`, { weight: '900' }),
];

Promise.all(
  faces.map((ff) => ff.load().then((loaded) => document.fonts.add(loaded)))
)
  .then(finishFonts)
  .catch((err) => {
    console.error('Font load error', err);
    finishFonts();
  });

setTimeout(finishFonts, 8000);
