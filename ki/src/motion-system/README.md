# Satz-zu-Motion-System

Dieses Modul wandelt kurze deutsche Sätze deterministisch in vertikale Remotion-Szenen um.

## Schnellster Einstieg

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
- Beats werden am Szenenende so begrenzt, dass ihre sichtbare Dauer nicht vollständig verloren geht
- die maximale Szenendauer bleibt 900 Frames

## FPS korrekt ändern

Eine FPS-Änderung darf nicht nur das Feld `fps` ersetzen, weil sonst das Video in Sekunden kürzer oder länger wird. Die Runtime skaliert deshalb Dauer, Beat-Start und Beat-Dauer gemeinsam.

```ts
const result = buildMotionScene({
  sentence: 'Die KI erstellt eine Zusammenfassung.',
  fps: 60,
});
```

Das Standard-Storyboard besitzt 150 Frames bei 30 FPS. Bei 60 FPS entstehen 300 Frames, sodass die Szenendauer weiterhin fünf Sekunden beträgt.

Die niedrigere API:

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
- Beats außerhalb der Szenendauer
- FPS-, Dauer-, Label- und Elementgrenzen
- erforderliche Elemente je Visualtyp
- mindestens ein Werkzeug bei `tool-orchestration`
- mindestens zwei Metriken bei `ranking`

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

Warnungen blockieren den Render nicht. Qualitätsfehler setzen `passed` auf `false`.

## Preview

`MotionPreviewRoot` registriert je Visualtyp eine Composition unter `Motion-System-Preview`.

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

1. Syntaxprüfung der Node-Render-Skripte
2. alle Motion-System-Tests
3. isolierten TypeScript-Check über `ki/tsconfig.motion.json`
4. Erzeugung des Renderplans

Die Testmatrix umfasst zusätzlich:

- Audio-Synchronisierung über alle zehn Visualtypen
- FPS-Retiming bei 24, 30 und 60 FPS
- vollständige Beat-Dauer innerhalb der Szene
- deterministische Ergebnisse
- Prozessketten-Grenzen
- adaptive Satz-Typografie

## Renderprüfung

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

Die CLI verwendet `npx --no-install` und lädt keine andere Remotion-Version nach.

## Render-Artefakte kontrollieren

```bash
npm run motion:check-stills
npm run motion:check-videos
npm run motion:check-renders
```

Erwartet werden:

- 50 PNG-Prüfframes
- 10 MP4-Dateien
- 60 gültige Render-Artefakte insgesamt

Geprüft werden Existenz, Dateigröße, PNG-Signatur und MP4-`ftyp`-Header. Der Bericht wird geschrieben nach:

```text
out/motion-system/release-report.json
```

## Vollständiger Freigabelauf

```bash
npm run motion:full-release-check
```

Der Befehl führt Tests, Typecheck, Renderplan, alle Prüfbilder, alle Videos und die Artefaktprüfung aus.

## GitHub Actions

Der Workflow liegt unter `.github/workflows/motion-system-checks.yml` und ist derzeit nur manuell über `workflow_dispatch` startbar.

Der private Repository-Runner hat die bisherigen Jobs vor dem ersten Workflow-Schritt beendet. GitHub lieferte dabei keine Steps, Logs oder Diagnose-Artefakte. Deshalb bestätigt ein roter historischer Lauf keinen konkreten Codefehler. Die Actions-, Billing- oder Runner-Einstellung muss separat geprüft werden.

## Prüfung vor Merge

1. `npm run motion:full-release-check`
2. `release-report.json` meldet 60 von 60 gültigen Dateien
3. alle Compositions visuell auf Textüberlauf, Überschneidungen und Safe-Zones prüfen
4. Audio-verschobene Beat-Frames sichtbar kontrollieren
5. erst danach den Draft-Status entfernen und mergen

Der Feature-Branch bleibt bis dahin getrennt von `main`.
