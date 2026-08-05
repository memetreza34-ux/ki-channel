# Satz-zu-Motion-System

Dieses Modul wandelt kurze deutsche Sätze deterministisch in vertikale Remotion-Szenen um. Mehrere Sätze können zusätzlich zu einer gemeinsamen Timeline verbunden, gespeichert und als zusammenhängendes Video gerendert werden.

## Einzelne Szene bauen

```ts
import {buildMotionScene} from './motion-system';

const {storyboard, quality} = buildMotionScene({
  sentence: 'Der KI-Agent nutzt Browser und Dateien für die Aufgabe.',
});
```

`buildMotionScene()` kombiniert:

1. Satzklassifikation
2. Default-Storyboard
3. stabile Storyboard-ID
4. optionale inhaltsspezifische Labels
5. optionale FPS-Anpassung
6. optionale Audio-Synchronisierung
7. Schema-Validierung
8. visuelle Qualitätsprüfung

## Inhaltsspezifische Beschriftungen

```ts
const result = buildMotionScene({
  sentence: 'Die KI fasst einen langen Bericht zusammen.',
  elementLabels: {
    input: 'Langer Bericht',
    output: 'Kurzfassung',
  },
  labels: ['Bericht', 'KI', 'Kurzfassung'],
});
```

Sicherheitsregeln:

- unbekannte Element-IDs werden abgelehnt
- leere Beschriftungen werden abgelehnt
- Schema-Längenbegrenzungen bleiben aktiv
- Visualtyp, Elemente und Beats werden nicht still ersetzt
- Anpassungen passieren vor der Audio-Synchronisierung

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

Jeder Typ besitzt eine eigene Stage. `MotionScene` verwendet eine exhaustive Switch-Zuordnung. Ein neuer Visualtyp kann dadurch nicht unbemerkt in einem unpassenden Fallback landen.

## Mehrere Sätze als Timeline

```ts
import {
  buildMotionTimeline,
  MotionTimelineComposition,
} from './motion-system';

const timeline = buildMotionTimeline({
  fps: 30,
  gapFrames: 8,
  scenes: [
    {
      sentence: 'Die KI erhält eine komplexe Aufgabe.',
      elementLabels: {input: 'Aufgabe', output: 'Arbeitsplan'},
    },
    {
      sentence: 'Der KI-Agent nutzt Browser und Dateien.',
      elementLabels: {result: 'Quellenbasis'},
    },
    {
      sentence: 'Die Daten fließen durch die KI zum Ergebnis.',
      elementLabels: {output: 'Analyse'},
    },
  ],
});
```

Die Timeline liefert für jede Szene:

- Startframe und exklusiven Endframe
- Dauer in Frames
- Start- und Endzeit in Sekunden
- validiertes Storyboard
- Qualitätsbericht

Zusätzlich enthält sie:

- gemeinsame FPS
- Abstand zwischen Szenen
- Gesamtdauer
- zusammengefasste Qualitätsprobleme mit Szenenindex
- einen globalen `passed`-Status

Timeline-Regeln:

- mindestens eine und höchstens 100 Szenen
- gemeinsame FPS von 24 bis 60
- Abstand von 0 bis 900 Frames
- unterschiedliche explizite Storyboard-IDs
- automatisch erzeugte IDs werden bei wiederholten Sätzen deterministisch ergänzt
- explizite IDs werden reserviert und niemals still umbenannt

`MotionTimelineComposition` rendert die geplanten Szenen mit Remotion-`Sequence` nacheinander. Abstände erscheinen als weißer Zwischenraum.

Eine vierteilige Demo ist unter folgender Composition registriert:

```text
Motion-Timeline-Demo
```

## Beat-gesteuerte Animationen

Alle spezialisierten Stages lesen ihre sichtbaren Zeitpunkte aus `storyboard.beats`.

- `show`: Element erscheint
- `connect`: Daten- oder Werkzeugfluss startet
- `dim`: Element wird zurückgenommen
- `highlight`: Ergebnis wird hervorgehoben
- `shake`: Fehlerimpuls
- `pulse`: Abschluss einer Agenten-Schleife

Hilfsfunktionen:

```ts
import {
  findBeatFrame,
  findMissingStageTimings,
  getStageTimingRequirements,
  resolveBeatFrame,
} from './motion-system';
```

Fehlende Stage-Timings verwenden kontrollierte Fallback-Frames und erzeugen die Qualitätswarnung `missing-stage-timing`.

## Audio-Synchronisierung

```ts
const result = buildMotionScene({
  sentence: 'Die KI nutzt Dateien.',
  words: [
    {text: 'KI', startMs: 200, endMs: 400},
    {text: 'Dateien', startMs: 1000, endMs: 1300},
  ],
});
```

Der Wortabgleich ist tokenbasiert und priorisiert eindeutige Begriffe:

- mehrteilige Labels wie `KI-Agent` können über `KI` oder `Agent` erkannt werden
- vollständige Phrasen werden zuerst gesucht
- bei ähnlichen Labels wie `Variante A` und `Variante B` wird der unterscheidende Token bevorzugt
- kurze Fachbegriffe wie `KI` müssen exakt übereinstimmen
- einzelne Buchstaben erzeugen keine zufälligen Teiltreffer
- ungültige oder negative Timestamps werden ignoriert
- Wörter werden zeitlich sortiert

Die Synchronisierung erhält die Animationsreihenfolge:

- Folgeaktionen behalten ihren Abstand zum zugehörigen `show`-Beat
- `show` und `highlight` fallen nicht automatisch auf denselben Frame
- Verbindungen starten erst, wenn Quelle und Ziel sichtbar sind
- der Connector-Abstand entspricht bei jeder FPS ungefähr 0,2 Sekunden
- Beats werden inklusive sichtbarer Dauer innerhalb der Szene gehalten
- die maximale Szenendauer bleibt 900 Frames

Wird `alignStoryboardToWords()` direkt mit einer anderen FPS aufgerufen, wird zuerst das vollständige Storyboard zeitproportional retimed. Nicht synchronisierte Beats behalten dadurch ihre Zeit in Sekunden.

## FPS korrekt ändern

Eine FPS-Änderung darf nicht nur das Feld `fps` ersetzen, weil sonst das Video in Sekunden kürzer oder länger wird. Die Runtime skaliert deshalb Dauer, Beat-Start und Beat-Dauer gemeinsam.

```ts
const result = buildMotionScene({
  sentence: 'Die KI erstellt eine Zusammenfassung.',
  fps: 60,
});
```

Das Standard-Storyboard besitzt 150 Frames bei 30 FPS. Bei 60 FPS entstehen 300 Frames, sodass die Szenendauer weiterhin fünf Sekunden beträgt.

Niedrigere API:

```ts
import {retimeMotionStoryboardFps} from './motion-system';

const at60Fps = retimeMotionStoryboardFps(storyboard, 60);
```

Erlaubt sind ganzzahlige FPS-Werte von 24 bis 60.

## Layout-Sicherheit

### Satz-Safe-Zone

`getSentenceTypography()` passt die Schriftgröße anhand der Satzlänge und sehr langer Einzelwörter an. Kurze Sätze bleiben groß, längere Sätze werden stufenweise verkleinert.

Qualitätsgrenzen:

- über 140 Zeichen: Warnung
- über 220 Zeichen: Qualitätsfehler

### Prozesskette

`createProcessChainLayout()` verteilt bis zu vier Karten innerhalb eines festen 880-Pixel-Bereichs. Die letzte Karte bleibt vollständig innerhalb der 1080-Pixel-Komposition. Connector-Breiten können nicht negativ werden.

### Ranking

Ranking-Balken verwenden Prozentbreiten statt fester Pixelwerte. Die Stage zeigt höchstens acht Einträge und verändert das übergebene Array nicht.

## Validierung

```ts
import {assertMotionStoryboard, validateMotionStoryboard} from './motion-system';

const result = validateMotionStoryboard(input);
if (!result.ok) console.error(result.issues);

const storyboard = assertMotionStoryboard(input);
```

Geprüft werden unter anderem:

- doppelte Element- und Beat-IDs
- unbekannte Ziel- und Quell-IDs
- erforderliche Elemente je Visualtyp
- mindestens ein Werkzeug bei `tool-orchestration`
- mindestens zwei Metriken bei `ranking`
- `connect` benötigt eine gültige Quelle
- Quelle und Ziel dürfen nicht identisch sein
- Beat-Start und vollständige Beat-Dauer müssen innerhalb der Szene liegen
- FPS-, Dauer-, Label- und Elementgrenzen

## Qualitätsprüfung

`inspectMotionStoryboardQuality()` meldet praktische Render-Risiken:

- zu langer Satz
- zu lange Elementlabels
- zu viele Elemente
- fehlende sichtbare Labels
- sehr kurze Szene
- sehr späte Beats
- fehlende Stage-Timings
- mehrere unterschiedliche Aktionen desselben Elements auf demselben Frame
- mehr Inhalte als eine Stage sichtbar darstellen kann

Warnungen blockieren den Render nicht. Qualitätsfehler setzen `passed` auf `false`.

## Versioniertes JSON

Storyboards und Timelines können deterministisch als versionierte JSON-Dokumente gespeichert werden.

```ts
import {
  parseMotionStoryboardJson,
  parseMotionTimelineJson,
  serializeMotionStoryboard,
  serializeMotionTimeline,
} from './motion-system';

const storyboardJson = serializeMotionStoryboard(storyboard);
const loadedStoryboard = parseMotionStoryboardJson(storyboardJson);

const timelineJson = serializeMotionTimeline(timeline);
const loadedTimeline = parseMotionTimelineJson(timelineJson);
```

Aktuelle Dokumentversion:

```text
1
```

Beim Laden einer Timeline werden geprüft:

- Dokumenttyp und Version
- gemeinsame FPS
- fortlaufende Szenenindizes
- korrekte Start- und Endframes
- Abstand zwischen Szenen
- Gesamtdauer
- eindeutige Storyboard-IDs
- jedes enthaltene Storyboard über das vollständige Zod-Schema

Qualitätsberichte werden nach dem Laden neu berechnet und nicht blind aus der Datei übernommen.

## Preview

`MotionPreviewRoot` registriert:

- eine Composition je Visualtyp
- die zusätzliche Composition `Motion-Timeline-Demo`

Format:

- 1080 × 1920
- 30 FPS für Standardbeispiele
- weißer Hintergrund mit KI-Kanal-Farben
- Titel-Safe-Zone oben
- Satz-Safe-Zone unten

Der isolierte CLI-Einstieg ist:

```text
ki/src/motion-system/remotion-entry.tsx
```

Damit hängen Motion-Tests und Render nicht von anderen Kanal-Compositions oder Workspace-Paketen ab.

## Tests und Typecheck

```bash
npm run motion:script-check
npm run motion:test
npm run motion:typecheck
npm run motion:verify
```

`motion:verify` führt aus:

1. Syntaxprüfung der gemeinsamen Render-Konfiguration und Node-Skripte
2. alle Motion-System-Tests
3. isolierten TypeScript-Check über `ki/tsconfig.motion.json`
4. Erzeugung des Renderplans

Die Testmatrix umfasst zusätzlich:

- Audio-Synchronisierung über alle zehn Visualtypen
- FPS-Retiming bei 24, 30 und 60 FPS
- vollständige Beat-Dauer innerhalb der Szene
- deterministische Ergebnisse
- Prozessketten- und Ranking-Grenzen
- adaptive Satz-Typografie
- Timeline-Planung und eindeutige IDs
- Timeline-Preview und Renderprüfpunkte
- JSON-Roundtrips und manipulierte Dokumente

## Renderprüfung der Einzeltypen

```bash
npm run motion:smoke
npm run motion:render-stills
npm run motion:render-videos
npm run motion:render-all
```

Gezielte Render:

```bash
MOTION_TYPES=input-output,comparison npm run motion:render-stills
MOTION_FRAMES=0,75,149 npm run motion:render-stills
MOTION_CONCURRENCY=2 npm run motion:render-stills
```

Ausgabe:

```text
out/motion-system/<visualtyp>/
```

## Renderprüfung der Timeline

Schnelle Prüfung der Mitte jeder Demo-Szene:

```bash
npm run motion:timeline-smoke
```

Vollständige Timeline-Prüfung mit fünf PNGs und einem finalen MP4:

```bash
npm run motion:timeline-render
npm run motion:check-timeline
```

Ausgabe:

```text
out/motion-system/timeline-demo/
```

Timeline-Berichte:

```text
out/motion-system/timeline-render-plan.json
out/motion-system/timeline-release-report.json
```

Die CLI verwendet `npx --no-install` und lädt keine andere Remotion-Version nach.

## Render-Artefakte kontrollieren

```bash
npm run motion:check-stills
npm run motion:check-videos
npm run motion:check-renders
npm run motion:check-timeline
```

Kernsystem:

- 50 PNG-Prüfframes
- 10 MP4-Dateien
- 60 gültige Render-Artefakte

Timeline-Demo:

- 5 PNG-Prüfframes
- 1 MP4-Datei
- 6 gültige Render-Artefakte

Insgesamt umfasst der vollständige Freigabelauf damit **66 Render-Artefakte**.

Geprüft werden Existenz, Dateigröße, PNG-Signatur und MP4-`ftyp`-Header.

Berichte:

```text
out/motion-system/release-report.json
out/motion-system/timeline-release-report.json
```

## Vollständige Freigabeläufe

Schneller Lauf mit Codeprüfung, zehn Einzeltyp-Smokes und vier Timeline-Smokes:

```bash
npm run motion:release-check
```

Vollständiger Lauf:

```bash
npm run motion:full-release-check
```

Der vollständige Befehl führt aus:

1. Skript-Syntaxprüfung
2. Tests
3. Typecheck
4. Renderplan
5. 50 Einzeltyp-PNGs
6. 10 Einzeltyp-MP4s
7. technische Prüfung der 60 Einzeltyp-Dateien
8. 5 Timeline-PNGs
9. Timeline-MP4
10. technische Prüfung der 6 Timeline-Dateien

## GitHub Actions

Der Workflow liegt unter `.github/workflows/motion-system-checks.yml` und ist derzeit nur manuell über `workflow_dispatch` startbar.

Der manuelle Smoke-Job ist für Folgendes vorbereitet:

- Frame 75 aller zehn Visualtypen
- Mitte jeder Szene der Timeline-Demo
- Upload beider Renderpläne und aller Smoke-Bilder

Der private Repository-Runner hat die bisherigen Jobs vor dem ersten Workflow-Schritt beendet. GitHub lieferte dabei keine Steps, Logs oder Diagnose-Artefakte. Deshalb bestätigt ein roter historischer Lauf keinen konkreten Codefehler. Die Actions-, Billing- oder Runner-Einstellung muss separat geprüft werden.

## Prüfung vor Merge

1. `npm run motion:full-release-check`
2. `release-report.json` meldet 60 von 60 gültigen Dateien
3. `timeline-release-report.json` meldet 6 von 6 gültigen Dateien
4. alle elf Preview-Compositions auf Textüberlauf, Überschneidungen und Safe-Zones prüfen
5. Audio-verschobene Beat-Frames sichtbar kontrollieren
6. erst danach den Draft-Status entfernen und mergen

Der Feature-Branch bleibt bis dahin getrennt von `main`.
