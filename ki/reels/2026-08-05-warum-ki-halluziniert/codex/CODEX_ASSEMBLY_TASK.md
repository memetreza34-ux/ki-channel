# Codex-Auftrag — Warum KI halluziniert

## Branch

Arbeite ausschließlich auf:

```text
feature/codex-reel-ai-halluzinationen
```

`main` darf nicht verändert werden.

## Zuerst lesen

1. alle geltenden `AGENTS.md`
2. `../README.md`
3. `../reel.json`
4. `../script/voiceover.md`
5. `../scenes/README.md` und alle acht Szenendateien
6. `../visuals/image-prompts.md`
7. `../visuals/animation-plan.md`
8. `../assets/asset-manifest.json`
9. danach den generierten `CODEX-BRIEF.generated.md`

## Vor dem Programmieren

```bash
git status
git branch --show-current
git log -5 --oneline
npm run codex:reel:prepare -- 2026-08-05-warum-ki-halluziniert --ready
```

Bei fehlenden Pflichtassets sofort stoppen. Keine Platzhalter, fremden Bilder oder stumme Audiodateien erzeugen.

## Umsetzung

Erstelle genau eine Produktionscomposition:

```text
Reel-WhyAIHallucinates
```

Quellcode:

```text
ki/src/reels/why-ai-hallucinates/
```

Empfohlene Struktur:

```text
contract.ts
assetHelpers.ts
subtitleCues.ts
ReelWhyAIHallucinates.tsx
remotion-entry.tsx
components/
scenes/
__tests__/
```

Die Inhalte sind bereits freigegeben. Voiceover, Szenenreihenfolge, Frames, Bildprompts, Animation-IDs und Übergänge nicht neu erfinden.

## Pflichten

- ausschließlich Assets aus `../assets/asset-manifest.json`
- `staticFile()` und zentralisierte Assetpfade
- jedes gesprochene Wort als Untertitel
- maximal neun bereits gesprochene Wörter sichtbar
- finale Wortzeiten aus `voiceover.wav`
- kein Bild nur mit Standardzoom
- maximal drei starke Bewegungen gleichzeitig
- `soundMode = off`
- keine Musik und keine synthetischen SFX
- letzter Frame zeigt `KI-ANTWORTEN PRÜFEN` und `SICHER ≠ WAHR`

## Tests

Mindestens prüfen:

- 1080 × 1920, 30 FPS, 1080 Frames
- acht lückenlose Szenen
- eindeutige Szenen- und Animations-IDs
- keine direkt wiederholten Layouts oder Bewegungssignaturen
- Assetpfade vorhanden und zentralisiert
- Untertitel innerhalb der Szenen und sortiert
- Szene 2 ergibt exakt 100 Prozent
- Szene 7 verwendet unveränderte fiktive Vergleichswerte
- Audio bleibt standardmäßig ohne SFX
- finaler Inhalt ist auf Frame 1079 sichtbar

## Render und Abnahme

1. TypeScript und fokussierte Tests ausführen.
2. Alle 32 Checkpoints rendern.
3. Jeden Checkpoint in voller und mobiler Größe prüfen.
4. Fehler an ihrer Ursache korrigieren.
5. aktuelles MP4 mit Voiceover rendern.
6. MP4 vollständig in normaler Geschwindigkeit ansehen.
7. technische PNG-/MP4-Prüfung ausführen.
8. nur tatsächlich bestandene Punkte in `review-checklist.md` markieren.

## Abschlussbericht

Melde Branch, Commit-SHA, geänderte Dateien, Befehle und Ergebnisse, gefundene und fehlende Assets, Umsetzung pro Szene, visuelle Korrekturen, Audio-/Untertitelstatus, Artefaktpfade, technische Prüfung, Restprobleme und Bestätigung, dass `main` unverändert blieb.

Nicht „fertig“ melden, solange das aktuelle MP4 nicht wirklich gerendert und angesehen wurde.
