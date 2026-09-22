# Animation Plan — Warum KI auf dieselbe Frage anders antwortet

**Status:** PHASE 1 FERTIG

- 1080 × 1920, 30 fps, Planlänge 47 s / 1410 Frames.
- Hard Cuts zwischen Beats; keine dekorativen Übergänge.
- Header pro Szene kurz, oben mittig, lila Icon + lila Titel.
- Hauptvisuals bleiben oberhalb der Caption-Safe-Zone.
- Captions nutzen `REEL_CAPTION_WRAPPER_STYLE`; Phase-1-Cues werden nach echtem Voiceover in Phase 3 neu synchronisiert.
- Keine externen Assets; alle Mechaniken REMOTION_NATIVE.
- Keine sichtbaren Demo-Prozentwerte. Token-Stärken nur relativ über Größe/Position.
- Kein `Math.random()`, keine CSS-Keyframes/Transitions.

## Timing

| Szene | Frames | Mechanik | Dominante Aktion |
|---|---:|---|---|
| s01-hook-split | 0–120 | split-path | ein Input teilt sich sichtbar |
| s02-probability-field | 120–390 | radial-token-field | Kandidaten bauen sich um den nächsten Token auf |
| s03-sampling-selector | 390–570 | sampling-selector | Sweep wählt einen Kandidaten |
| s04-context-fork | 570–750 | branching-path | Token trifft Weiche |
| s05-sentence-cascade | 750–930 | dual-word-cascade | zwei Satzketten wachsen auseinander |
| s06-temperature-fan | 930–1140 | distribution-fan | Fächer wird enger/breiter |
| s07-reproducibility | 1140–1320 | alignment-rails | drei Stellschrauben rasten ein |
| s08-creative-payoff | 1320–1410 | decision-balance | Stabilität/Variation wird bewusst gewählt |
