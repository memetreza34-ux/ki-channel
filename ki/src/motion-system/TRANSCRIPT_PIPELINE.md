# Globale Transkript-zu-Timeline-Pipeline

Diese Pipeline verarbeitet Wort-Timestamps, die sich auf den gesamten Sprechtext beziehen. Sie trennt die globalen Zeiten automatisch in lokale Zeitachsen für die einzelnen Motion-Szenen.

## Problem

`alignStoryboardToWords()` erwartet Wortzeiten relativ zum Beginn einer einzelnen Szene. Eine Transkription eines vollständigen Voiceovers liefert dagegen normalerweise globale Werte:

```text
Szene 1 beginnt bei 0 ms
Szene 2 beginnt bei 4.800 ms
Szene 3 beginnt bei 9.300 ms
```

Würden diese Werte unverändert in jede Szene übernommen, würden spätere Animationen viel zu spät starten und die Szenendauer unnötig wachsen.

## Zuordnung prüfen

```ts
import {mapMotionTranscriptToScenes} from './motion-system';

const scenes = mapMotionTranscriptToScenes({
  script: 'Die KI nutzt Dateien. Danach entsteht das Ergebnis.',
  words: [
    {text: 'Die', startMs: 0, endMs: 100},
    {text: 'KI', startMs: 150, endMs: 300},
    {text: 'nutzt', startMs: 350, endMs: 500},
    {text: 'Dateien', startMs: 900, endMs: 1150},
    {text: 'Danach', startMs: 1800, endMs: 2000},
    {text: 'entsteht', startMs: 2050, endMs: 2250},
    {text: 'das', startMs: 2300, endMs: 2400},
    {text: 'Ergebnis', startMs: 2700, endMs: 3000},
  ],
});
```

Jeder Eintrag enthält:

- Szenenindex
- segmentierten Satz
- globalen Start in Millisekunden
- globales Ende in Millisekunden
- gesprochene Dauer
- Wort-Timestamps relativ zum Szenenbeginn

Für die zweite Szene wird aus dem globalen Wert `1800 ms` lokal wieder `0 ms`.

## Timeline direkt bauen

```ts
import {buildMotionTimelineFromTranscript} from './motion-system';

const {timeline, transcriptScenes} = buildMotionTimelineFromTranscript({
  script,
  words,
  fps: 60,
  gapFrames: 12,
});
```

Ablauf:

1. Skript deterministisch segmentieren
2. Transkript-Wörter chronologisch sortieren
3. jedes Szenentoken sequentiell im Transkript suchen
4. begrenzte Füllwörter tolerieren
5. globale Wortzeiten pro Szene auswählen
6. Zeiten auf den lokalen Szenenbeginn normalisieren
7. Storyboards bauen und Beats synchronisieren
8. Szenen auf einer gemeinsamen Timeline planen

Die Eingabearrays werden dabei nicht verändert.

## Füllwörter und Suchfenster

Standardmäßig dürfen zwischen zwei erwarteten Skripttokens bis zu acht zusätzliche Transkripttokens liegen. Dadurch können kleine Abweichungen wie `also`, `ähm` oder Wiederholungen verarbeitet werden.

```ts
const scenes = mapMotionTranscriptToScenes({
  script,
  words,
  maxSkippedTokensPerMatch: 2,
});
```

Erlaubter Bereich:

```text
0 bis 50 übersprungene Tokens pro Treffer
```

Für ein exakt erwartetes Transkript kann die Toleranz deaktiviert werden:

```ts
maxSkippedTokensPerMatch: 0
```

Kann eine Szene nicht sequentiell zugeordnet werden, wird der Vorgang mit Szenennummer und Satz abgebrochen. Es erfolgt keine still geschätzte Zuordnung.

## Sichtbares Label und gesprochenes Wort trennen

Ein sichtbares Element kann anders heißen als das Wort im Voiceover:

```ts
const result = buildMotionTimelineFromTranscript({
  script,
  words,
  sceneOverrides: [
    {
      elementLabels: {files: 'Dokumente'},
      audioKeywords: {files: ['Dateien']},
    },
  ],
});
```

Damit bleibt auf der Karte `Dokumente` sichtbar, während der Beat weiterhin auf das gesprochene Wort `Dateien` reagiert.

Regeln für `audioKeywords`:

- nur bekannte Element-IDs
- höchstens acht Begriffe pro Element
- höchstens 64 Zeichen pro Begriff
- keine leeren Einträge
- explizite Begriffe haben Vorrang vor dem sichtbaren Label
- normalisierte Duplikate werden entfernt

## Produktionsmodus

```ts
import {buildProductionMotionTimelineFromTranscript} from './motion-system';

const result = buildProductionMotionTimelineFromTranscript({
  script,
  words,
  fps: 30,
  gapFrames: 8,
});
```

Der Produktionseinstieg erzwingt:

- harte Schema-Validierung
- Qualitätsfehler als Ausnahme
- keine fehlenden Stage-Timings
- keine kollabierten Folgeaktionen
- keine von der Stage ignorierten Elemente
- keine Überschreitung dynamischer Stage-Limits

## Grenzen

- Transkript-Wörter benötigen endliche, nicht negative Millisekundenwerte.
- `endMs` darf nicht vor `startMs` liegen.
- Das Transkript muss mindestens ein verwertbares Wort enthalten.
- Die Zuordnung erfolgt in der gesprochenen Reihenfolge; rückwärts verwendete Textpassagen werden nicht wiederverwendet.
- Starke inhaltliche Abweichungen zwischen Skript und gesprochenem Text müssen vor der Timeline-Erzeugung korrigiert werden.
- Szenenabstände werden weiterhin über `gapFrames` festgelegt. Globale Pausen aus dem Transkript werden als Metadaten erhalten, aber nicht automatisch als variable Timeline-Lücken eingefügt.
