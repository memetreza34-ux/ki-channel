# KI-Kanal Reel-Pakete

Jedes Reel wird als vollständiges Produktionspaket gespeichert. Planung und Umsetzung sind getrennt:

1. **Phase 1 – Reel-Paket:** Thema, Hook, Sprechtext, Szenen, visuelle Konzepte, Assets, Audio, Caption, Codex-Auftrag und Review-Kriterien.
2. **Phase 2 – individuelle Remotion-Umsetzung:** Jede Szene erhält eine inhaltlich passende Komposition. Vollständige Szenenanimationen werden innerhalb eines Reels nicht wiederholt.

## Verzeichnisstandard

```text
ki/reels/YYYY-MM-DD-slug/
├── README.md
├── reel.json
├── voiceover.md
├── scene-plan.md
├── remotion-plan.md
├── asset-prompts.md
├── audio-plan.md
├── caption.md
├── codex-task.md
└── review-checklist.md
```

## Verbindliche Abwechslungsregeln

- Keine vollständige Szenenanimation zweimal im selben Reel.
- Keine identische Layoutfamilie direkt hintereinander.
- Wiederverwendbar sind nur kleine primitives wie Text, Connectoren, Partikel, Zähler und Karten.
- Jede Szene erhält eine eindeutige `animationId`.
- Die verwendeten Animationen werden in `animation-history.json` registriert.
- Eine alte `animationId` darf nur wiederverwendet werden, wenn Konzept, Layout und Hauptbewegung deutlich verändert wurden.
- Inhaltliche Passung ist wichtiger als bloße Neuheit.
- Ein Reel muss mindestens vier unterschiedliche visuelle Familien verwenden.

## Qualitätsziel

Eine Szene gilt nur dann als gelungen, wenn der Zuschauer den gesprochenen Satz auch ohne Ton grundsätzlich verstehen kann. Technisch korrekte, aber inhaltlich austauschbare Animationen gelten als nicht bestanden.
