# Satz-zu-Motion-System

Dieses Modul wandelt kurze deutsche Sätze deterministisch in vertikale Remotion-Szenen um.

## Einstieg

```ts
import {createDefaultStoryboard, MotionScene} from './motion-system';

const storyboard = createDefaultStoryboard(
  'Der KI-Agent nutzt Browser, Dateien und E-Mail für die Aufgabe.',
);
```

`MotionScene` erwartet ein Zod-validiertes `MotionStoryboard`.

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

## Preview

`MotionPreviewRoot` registriert je Visualtyp eine eigene Composition im Ordner `Motion-System-Preview`.

Format:

- 1080 × 1920
- 30 FPS für die Standardbeispiele
- weiße Fläche mit KI-Kanal-Farben
- Titel-Safe-Zone oben
- Satz-Zone unten

## Audio-Synchronisierung

```ts
import {alignStoryboardToWords} from './motion-system';

const aligned = alignStoryboardToWords(storyboard, [
  {text: 'Browser', startMs: 900, endMs: 1200},
]);
```

Ungültige oder negative Wort-Timestamps werden ignoriert. Die Szene wird maximal auf 900 Frames erweitert.

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
