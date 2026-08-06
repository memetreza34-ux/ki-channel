# Codex animation-only reel template

Diese Vorlage gilt für jedes neu erstellte KI-Reel mit `standardId: ki-animation-only-reel-v2`.

## Standard

- 1080 × 1920, 30 FPS
- ungefähr 58 bis 70 Sekunden
- 125 bis 145 Wörter
- 8 bis 9 Szenen
- 100 Prozent Remotion-Animation
- keine generierten Szenenbilder
- genau ein statisches Cover mit einem Satz
- Voiceover und Wiedergabe bei 1,00x
- keine Musik und keine SFX
- ein Hauptobjekt, eine Hauptbewegung und ein Ergebnis pro Szene
- maximal zwei unterstützende Elemente
- maximal drei Bedeutungsbeats pro Szene
- mindestens eine Sekunde Ergebnis-Hold

## Audio-first

Die anfänglichen Szenenframes sind ausschließlich Platzhalter.

Nach dem finalen Voiceover muss Codex:

```text
Audio transkribieren
→ timeline/final-sync.json erzeugen
→ Szenengrenzen ersetzen
→ Animationstrigger ersetzen
→ Untertitel ersetzen
→ Composition-Dauer ersetzen
```

Der finale Render darf keine geschätzte oder vorab gleichmäßig verteilte Zeitquelle verwenden.

## Untertitel

- vollständiger Satz erscheint sofort
- keine Wort-für-Wort-Einblendung
- keine Einzelwort-Hervorhebung
- Unterkante 210 bis 235 px
- genau eine violette Fortschrittslinie
- zentrale Komponente: `ki/src/components/StableSentenceCaption.tsx`

## Dateien

- `voiceover.md`: finaler Fließtext
- `scene-plan.md`: ein Hauptgedanke und eine einfache Choreografie pro Szene
- `semantic-beats.json`: ein bis drei Sinnabschnitte pro Szene
- `cover.md`: ein Satz und ein Hauptmotiv
- `reel.json`: v2-Vertrag
- `final-sync.template.json`: Struktur der finalen Audio-Timeline
- `subtitle-contract.md`: stabiles Satz-Untertitelsystem
- `CODEX_ASSEMBLY_TASK.md`: Audio-first-Auftrag
- `review-checklist.md`: harte Freigabegates

Vor der Nutzung alle `REPLACE_ME`-Werte ersetzen. Nicht direkt aus dem Template rendern.
