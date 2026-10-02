import {cancelRender, continueRender, delayRender, staticFile} from 'remotion';

const FACES: Array<[family: string, file: string, weight: string]> = [
  ['Inter', 'fonts/Inter-400.woff2', '400'],
  ['Inter', 'fonts/Inter-600.woff2', '600'],
  ['Inter', 'fonts/Inter-700.woff2', '700'],
  ['Inter', 'fonts/Inter-800.woff2', '800'],
  ['Inter', 'fonts/Inter-900.woff2', '900'],
  ['Bebas Neue', 'fonts/BebasNeue-400.woff2', '400'],
  ['Space Grotesk', 'fonts/SpaceGrotesk-500.woff2', '500'],
  ['Space Grotesk', 'fonts/SpaceGrotesk-700.woff2', '700'],
  ['Archivo Black', 'fonts/ArchivoBlack-400.woff2', '400'],
  ['Fraunces', 'fonts/Fraunces-600.woff2', '600'],
  ['Fraunces', 'fonts/Fraunces-800.woff2', '800'],
  ['Caveat', 'fonts/Caveat-600.woff2', '600'],
  ['Caveat', 'fonts/Caveat-700.woff2', '700'],
  ['Nunito', 'fonts/Nunito-700.woff2', '700'],
  ['Nunito', 'fonts/Nunito-800.woff2', '800'],
  ['Nunito', 'fonts/Nunito-900.woff2', '900'],
  ['JetBrains Mono', 'fonts/JetBrainsMono-500.woff2', '500'],
  ['JetBrains Mono', 'fonts/JetBrainsMono-700.woff2', '700'],
];

let started = false;

/** Lädt die lokalen Schriften genau einmal; der Render wartet darauf. */
export const loadFonts = () => {
  if (started || typeof document === 'undefined') return;
  started = true;
  const handle = delayRender('Schriften laden');
  Promise.all(
    FACES.map(([family, file, weight]) => {
      const face = new FontFace(family, `url(${staticFile(file)}) format('woff2')`, {weight});
      document.fonts.add(face);
      return face.load();
    }),
  )
    .then(() => continueRender(handle))
    .catch((err) => cancelRender(err));
};

loadFonts();
