# Audio-first-Synchronisationsvertrag

Dieser Vertrag gilt für jedes neue KI-Reel mit `standardId: ki-animation-only-reel-v2`.

## Einzige finale Zeitquelle

```text
timeline/final-sync.json
```

Sobald finales Audio vorhanden ist, dürfen geschätzte Frames, Fallback-Untertitel oder vorab gleichmäßig verteilte Szenenlängen nicht mehr vom Produktionscode verwendet werden.

## Vorgeschriebenes Datenmodell

```json
{
  "version": 1,
  "status": "final-transcript-aligned",
  "fps": 30,
  "audio": {
    "durationSeconds": 60.12,
    "speechStartSeconds": 0.28,
    "speechEndSeconds": 58.31
  },
  "composition": {
    "durationInFrames": 1802,
    "outroHoldFrames": 53
  },
  "captions": [
    {
      "id": "caption-01",
      "sceneId": "scene-01",
      "text": "Der vollständige Satz erscheint sofort.",
      "startFrame": 8,
      "endFrame": 132,
      "lineCount": 1,
      "bottomPx": 220,
      "revealMode": "instant",
      "wordHighlight": false,
      "progressIndicator": "single-violet-line"
    }
  ],
  "scenes": [
    {
      "id": "scene-01",
      "startFrame": 0,
      "endFrame": 194,
      "speechStartFrame": 8,
      "speechEndFrame": 160,
      "resultHoldFrames": 34
    }
  ],
  "beats": [
    {
      "sceneId": "scene-01",
      "expression": "wichtiger Sinnabschnitt",
      "transcriptStartFrame": 54,
      "animationStartFrame": 56,
      "resultFrame": 126
    }
  ]
}
```

## Pflichtprüfungen

### Audio

- `speechStartSeconds` höchstens 0,6 Sekunden
- `speechEndSeconds` kleiner oder gleich `durationSeconds`
- Composition endet 1,2 bis 2,2 Sekunden nach dem letzten gesprochenen Wort
- keine künstliche Verlängerung auf eine vorher festgelegte Zielzeit

### Szenen

- lückenlos ab Frame 0
- Szenenwechsel an Satz- oder Sinnpausen
- maximal 6 Frames Abstand zur zugehörigen Pause
- `resultHoldFrames` mindestens 30 bei 30 FPS
- Szene endet nicht vor ihrem gesprochenen Inhalt

### Bedeutungsbeats

- ein bis drei Beats pro Szene
- `animationStartFrame` höchstens 5 Frames vor oder nach `transcriptStartFrame`
- Animation beginnt niemals deutlich vor dem gesprochenen Sinnabschnitt
- Ergebnis bleibt bis zum Szenenende oder mindestens 30 Frames stabil

### Untertitel

- vollständiger Satz oder Sinnabschnitt erscheint sofort
- `revealMode` muss `instant` sein
- `wordHighlight` muss `false` sein
- `progressIndicator` muss `single-violet-line` sein
- Unterkante zwischen 210 und 235 px
- maximal zwei Zeilen
- Text bleibt während der gesamten Cue-Dauer stabil
- nur die violette Linie bewegt sich von 0 auf 100 Prozent
- erster Untertitel erscheint spätestens 3 Frames nach Sprachbeginn

## Produktionscode

Der Remotion-Code muss finale Daten importieren oder als Props erhalten. Nicht erlaubt:

- lokale hart codierte Untertitelframes im finalen Build
- gleichmäßig auf 60 oder 65 Sekunden verteilte Szenen
- Wort-für-Wort-Reveal
- `visibleCount` anhand geschätzter Satzdauer
- mehrere unabhängige Timing-Dateien
- Fallback-Cues, sobald `final-sync.json` existiert

## Render-Reihenfolge

```text
Audio normalisieren
→ transkribieren
→ final-sync.json erzeugen
→ Contract validieren
→ Remotion-Code auf finale Daten umstellen
→ TypeScript und Tests
→ Checkpoints
→ Kontaktbogen
→ MP4
→ normale Geschwindigkeit ansehen
→ Smartphone-Größe prüfen
```

## Freigabe

Ein technischer Render ist nicht freigegeben, solange nicht dokumentiert wurde:

- größte Trigger-Abweichung
- größte Szenengrenzen-Abweichung
- Sprachende
- Composition-Ende
- Schluss-Hold
- Untertitel-Unterkante
- keine aktive Fallback-Zeitquelle
