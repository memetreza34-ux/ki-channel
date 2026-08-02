# Satz-zu-Motion-System

Dieses Modul wandelt kurze deutsche Sätze deterministisch in vertikale Remotion-Szenen um.

## Schnellster Einstieg

```ts
import {buildMotionScene, MotionScene} from './motion-system';

const {storyboard, quality} = buildMotionScene({
  sentence: 'Der KI-Agent nutzt Browser, Dateien und E-Mail für die Aufgabe.',
});
```

`buildMotionScene()` kombiniert Router, optionale Audio-Synchronisierung, Schema-Validierung und Qualitätsprüfung in einem einzigen Aufruf.

Mit Wort-Timestamps:

```ts
const result = buildMotionScene({
  sentence: 'Die KI nutzt Dateien.',
  fps: 30,
  words: [
    {text: 'Die', startMs: 0, endMs: 100},
    {text: 'KI', startMs: 200, endMs: 400},
    {text: 'Dateien', startMs: 1000, endMs: 1300},
  ],
});
```

`MotionScene` erwartet ein validiertes `MotionStoryboard`.

## Unterstützte Visualtypen

- `input-output`
- `before-after`
- `comparison`
- `error-path`
- `context-window`
- `process-chain`
- `ranking`
- `data-flow`
- `tool-orchestration`
- `agent-loop`

## Niedrigere APIs

Für eigene Abläufe können Router, Audio-Sync und Validierung einzeln genutzt werden:

```ts
import {
  alignStoryboardToWords,
  assertMotionStoryboard,
  createDefaultStoryboard,
  inspectMotionStoryboardQuality,
  validateMotionStoryboard,
} from './motion-system';

const base = createDefaultStoryboard('Die KI erstellt ein Ergebnis.');
const aligned = alignStoryboardToWords(base, []);
const validated = assertMotionStoryboard(aligned);
const quality = inspectMotionStoryboardQuality(validated);

const result = validateMotionStoryboard(validated);
if (!result.ok) {
  console.error(result.issues);
}
```

Geprüft werden unter anderem:

- doppelte Element- und Beat-IDs
- unbekannte Ziel- und Quell-IDs
- Beats außerhalb der Szenendauer
- erlaubte FPS-, Dauer-, Label- und Elementgrenzen

## Qualitätsprüfung

`inspectMotionStoryboardQuality()` ergänzt die harte Schema-Validierung um visuelle Warnungen:

- Satz länger als 140 Zeichen
- Labels länger als 24 Zeichen
- mehr als acht Elemente
- fehlende sichtbare Labels
- sehr kurze Szenen
- Beats kurz vor Szenenende

Warnungen blockieren den Render nicht. Qualitätsfehler setzen `passed` auf `false`.

## Preview

`MotionPreviewRoot` registriert je Visualtyp eine eigene Composition im Ordner `Motion-System-Preview`.

Format:

- 1080 × 1920
- 30 FPS für die Standardbeispiele
- weiße Fläche mit KI-Kanal-Farben
- Titel-Safe-Zone oben
- Satz-Zone unten

## Prüfung vor Merge

Im Repository-Root ausführen:

```bash
npm test
npm run typecheck
```

Danach alle Compositions unter `Motion-System-Preview` im Remotion Studio visuell prüfen.

Besonders kontrollieren:

- Textüberlauf
- überlappende Karten
- Safe-Zones oben und unten
- Animationen bei Frame 0, 75 und 149
- 1080 × 1920 Render

Der Feature-Branch darf erst nach erfolgreichem Test und Preview-Check in `main` übernommen werden.
