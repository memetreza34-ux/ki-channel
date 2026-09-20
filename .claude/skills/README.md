# Motion-Skills

Installiert aus [iart-ai/motion-design-skills](https://github.com/iart-ai/motion-design-skills) (MIT, Copyright (c) 2026 iart.ai).
Unveraendert uebernommen, nur die fuer diesen Kanal relevante Teilmenge.

| Skill | Wofuer |
|---|---|
| `animation-principles` | Timing, Easing-Kurven, Stagger, Gewicht. Die Zahlenbasis fuer `ki/src/motion/easing.ts`. |
| `motion-art-direction` | Was ueberhaupt Bewegung verdient: Hero / Support / Texture. |
| `beat-sync-editing` | Schnittrhythmus, Retiming, Speed-Ramps. Ergaenzt `motion-system/beatTiming.ts`. |
| `shot-composition` | Raster, Safe Areas, Fokushierarchie. Ergaenzt `ki/gehirn/CAPTION_SAFE_POSITION.md`. |
| `color-motion` | Farbverlaeufe und perzeptuelle Interpolation ueber Zeit. |

Bewusst nicht installiert: `after-effects`, `logo-animation`, `motion-background`,
`remotion-video` (die offiziellen `remotion-*` Skills sind global schon vorhanden).

## Verbindliche Regel

Lineare Bewegung ist im Produktionscode nicht zulaessig, ausser fuer Endlos-Schleifen
(Spinner, Marquee). Fuer alles andere laeuft die Zeitachse ueber
`easedProgress` aus `ki/src/motion/easing.ts`.
