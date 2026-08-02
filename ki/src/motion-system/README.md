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

Eine gesetzte FPS-Zahl wird auch ohne Wort-Timestamps übernommen und anschließend durch das Storyboard-Schema geprüft.

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

Jeder dieser Typen besitzt eine eigene Stage. `MotionScene` rendert die Typen über eine exhaustive Switch-Zuordnung, sodass ein künftig ergänzter Typ nicht still in einen unpassenden Fallback läuft.

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

## Preview und isolierter Einstiegspunkt

`MotionPreviewRoot` registriert je Visualtyp eine eigene Composition im Ordner `Motion-System-Preview`.

Für Tests und CLI-Render wird bewusst nicht der vollständige Kanal-Einstieg verwendet, sondern:

```text
ki/src/motion-system/remotion-entry.tsx
```

Dieser Einstieg registriert ausschließlich die Motion-Preview. Dadurch hängt die Prüfung nicht von anderen Kanal-Compositions oder deren lokalen Paketen ab.

Format:

- 1080 × 1920
- 30 FPS für die Standardbeispiele
- weiße Fläche mit KI-Kanal-Farben
- Titel-Safe-Zone oben
- Satz-Zone unten

## Fokussierte Verifikation

Die komplette codebasierte Motion-Prüfung läuft über:

```bash
npm run motion:verify
```

Der Befehl führt nacheinander aus:

1. Motion-System-Tests
2. isolierten strikten TypeScript-Check über `ki/tsconfig.motion.json`
3. Erzeugung des Renderplans

Einzelbefehle:

```bash
npm run motion:test
npm run motion:typecheck
npm run motion:render-plan
```

## Render-Verifikationsplan

`MOTION_RENDER_PLAN` liefert für alle zehn Compositions feste Prüfframes:

```ts
import {MOTION_RENDER_PLAN} from './motion-system';

for (const item of MOTION_RENDER_PLAN) {
  console.log(item.compositionId, item.checkpoints);
}
```

Pro Composition werden Start, 25 %, 50 %, 75 % und letzter Frame geprüft.

## Automatische Render-Kommandos

`MOTION_RENDER_COMMANDS` erzeugt reproduzierbare Remotion-Befehle für alle Prüfframes und finalen MP4-Dateien:

```ts
import {MOTION_RENDER_COMMANDS} from './motion-system';

for (const item of MOTION_RENDER_COMMANDS) {
  console.log(item.frameCommands);
  console.log(item.finalRenderCommand);
}
```

Die Befehle nutzen `npx --no-install` und standardmäßig den isolierten Motion-Einstiegspunkt. Dadurch wird keine fremde Remotion-Version nachgeladen.

## Ausführbare Renderprüfung

```bash
npm run motion:render-plan
npm run motion:render-stills
npm run motion:render-videos
npm run motion:render-all
```

Bedeutung:

- `motion:render-plan`: schreibt und zeigt den Prüfplan
- `motion:render-stills`: rendert fünf Prüfbilder je Visualtyp
- `motion:render-videos`: rendert ein finales MP4 je Visualtyp
- `motion:render-all`: führt Still- und Video-Render vollständig aus

Die Ergebnisse landen standardmäßig unter:

```text
out/motion-system/<visualtyp>/
```

### Gezielte Render

Nur ausgewählte Visualtypen:

```bash
MOTION_TYPES=input-output,comparison npm run motion:render-stills
```

Nur ausgewählte Frames:

```bash
MOTION_FRAMES=0,75,149 npm run motion:render-stills
```

Kontrollierte Parallelität:

```bash
MOTION_CONCURRENCY=2 npm run motion:render-stills
```

Erlaubt sind ein bis vier parallele Aufgaben. Eigene Pfade können über `MOTION_ENTRY_POINT` und `MOTION_OUTPUT_DIR` gesetzt werden.

## GitHub Actions

Der Workflow `.github/workflows/motion-system-checks.yml` ist in zwei Stufen aufgeteilt:

1. `verify`: Tests, isolierter Typecheck und Renderplan
2. `smoke-render`: repräsentativer Still-Render von `input-output` bei Frame 75

Renderplan und Smoke-Bild werden als Workflow-Artefakte gespeichert. Der vollständige Zehn-Typen-Render bleibt bewusst ein lokaler Freigabeschritt.

## Prüfung vor Merge

Im Repository-Root ausführen:

```bash
npm run motion:verify
npm run motion:render-stills
npm run motion:render-videos
```

Danach alle Compositions unter `Motion-System-Preview` im Remotion Studio visuell prüfen.

Besonders kontrollieren:

- Textüberlauf
- überlappende Karten
- Safe-Zones oben und unten
- alle Frames aus `MOTION_RENDER_PLAN`
- finale 1080 × 1920 Videos

Der Feature-Branch darf erst nach erfolgreichem CI-Lauf, lokalem Render und Preview-Check in `main` übernommen werden.
