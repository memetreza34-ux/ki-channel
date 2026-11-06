# Motion-Skills

Installiert aus [iart-ai/motion-design-skills](https://github.com/iart-ai/motion-design-skills) (MIT, Copyright (c) 2026 iart.ai).
Unveraendert uebernommen, nur die fuer diesen Kanal relevante Teilmenge.

| Skill | Wofuer |
|---|---|
| `animation-principles` | Timing, Easing-Kurven, Stagger, Gewicht. Die Zahlenbasis fuer `studio/kit/motion.ts`. |
| `motion-art-direction` | Was ueberhaupt Bewegung verdient: Hero / Support / Texture. |
| `beat-sync-editing` | Schnittrhythmus, Retiming, Speed-Ramps. Ergaenzt `motion-system/beatTiming.ts`. |
| `shot-composition` | Raster, Safe Areas, Fokushierarchie. Ergaenzt die Sicherheitszonen im Skill `wissens-short`. |
| `color-motion` | Farbverlaeufe und perzeptuelle Interpolation ueber Zeit. |

Bewusst nicht installiert: `after-effects`, `logo-animation`, `motion-background`,
`remotion-video` (die offiziellen `remotion-*` Skills sind global schon vorhanden).

## Verbindliche Regel

Lineare Bewegung ist im Produktionscode nicht zulaessig, ausser fuer Endlos-Schleifen
(Spinner, Marquee) und live mitlaufende Zaehler. Fuer alles andere Kurven aus
`studio/projekte/wissen/bausteine.tsx` (`outQuint`) bzw. `studio/kit/motion.ts`.

## Eigene Skills

| Skill | Wofuer |
|---|---|
| `wissens-short` | Standard fuer jedes Kanal-Video: Allgemeinwissen-Short im Denkwuerfel-Look. |
| `erklaervideo` | Allgemeiner Ablauf fuer andere Videos in `studio/` (Werbung, Spots). Vertrag: `studio/CLAUDE.md`. |

Agent dazu: `.claude/agents/video-kritiker.md` (unabhaengige Sichtpruefung eines Kontaktbogens).
