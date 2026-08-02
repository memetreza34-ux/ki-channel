# Satz-zu-Motion-System

Dieses Modul wandelt kurze deutsche Sätze deterministisch in vertikale Remotion-Szenen um.

## Schnellster Einstieg

```ts
import {buildMotionScene, MotionScene} from './motion-system';

const {storyboard, quality} = buildMotionScene({
  sentence: 'Der KI-Agent nutzt Browser und Dateien für die Aufgabe.',
});
```

`buildMotionScene()` kombiniert:

1. Satzklassifikation
2. Default-Storyboard
3. optionale Audio-Synchronisierung
4. Schema-Validierung
5. visuelle Qualitätsprüfung

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

Jeder Typ besitzt eine eigene Stage. `MotionScene` verwendet eine exhaustive Switch-Zuordnung. Ein künftig ergänzter Visualtyp kann dadurch nicht unbemerkt in einem unpassenden generischen Fallback landen.

## Beat-gesteuerte Animationen

Alle zehn spezialisierten Stages verwenden die Frames aus `storyboard.beats`.

Beispiele:

- `show` bestimmt das Erscheinen einer Karte
- `connect` bestimmt den Beginn eines Daten- oder Werkzeugflusses
- `dim` steuert das Zurücknehmen eines Elements
- `highlight` steuert den hervorgehobenen Gewinner
- `shake` steuert den Fehlerimpuls
- `pulse` steuert den Abschluss einer Agenten-Schleife

Damit verändert eine Audio-Synchronisierung nicht nur abstrakte Daten. Die sichtbare Remotion-Animation verschiebt sich tatsächlich mit den Wort-Timestamps.

Die Hilfsfunktionen stehen auch separat zur Verfügung:

```ts
import {
  findBeatFrame,
  findMissingStageTimings,
  getStageTimingRequirements,
  resolveBeatFrame,
} from './motion-system';

const outputFrame = resolveBeatFrame(
  storyboard,
  {targetId: 'output', action: 'show'},
  98,
);

const missing = findMissingStageTimings(storyboard);
```

Fehlende Stage-Timings blockieren einen Render nicht. Die Stage verwendet einen kontrollierten Fallback-Frame und die Qualitätsprüfung erzeugt eine Warnung mit dem Code `missing-stage-timing`.

## Audio-Synchronisierung

Der Wortabgleich arbeitet tokenbasiert:

- mehrteilige Labels wie `KI-Agent` können über `KI` oder `Agent` erkannt werden
- kurze Begriffe wie `KI` müssen exakt übereinstimmen
- einzelne Buchstaben erzeugen keine falschen Teiltreffer
- Connection-Beats werden am gesprochenen Ziel ausgerichtet, nicht an der Quelle
- ungültige oder negative Timestamps werden ignoriert
- Wörter werden vor der Verarbeitung zeitlich sortiert
- die Szenendauer bleibt auf maximal 900 Frames begrenzt

## Validierung

Für importierte oder extern erzeugte Storyboards:

```ts
import {assertMotionStoryboard, validateMotionStoryboard} from './motion-system';

const result = validateMotionStoryboard(input);
if (!result.ok) {
  console.error(result.issues);
}

const storyboard = assertMotionStoryboard(input);
```

Geprüft werden unter anderem:

- doppelte Element- und Beat-IDs
- unbekannte Ziel- und Quell-IDs
- Beats außerhalb der Szenendauer
- erlaubte FPS-, Dauer-, Label- und Elementgrenzen
- erforderliche Elemente je Visualtyp
- mindestens ein Werkzeug bei `tool-orchestration`
- mindestens zwei Metriken bei `ranking`

## Qualitätsprüfung

`inspectMotionStoryboardQuality()` ergänzt die harte Schema-Validierung um praktische Render-Hinweise:

- Satz länger als 140 Zeichen
- Labels länger als 24 Zeichen
- mehr als acht Elemente
- fehlende sichtbare Labels
- sehr kurze Szenen
- Beats kurz vor Szenenende
- fehlende Beat-Timings einer spezialisierten Stage

Warnungen blockieren den Render nicht. Qualitätsfehler setzen `passed` auf `false`.

## Preview und isolierter Einstiegspunkt

`MotionPreviewRoot` registriert je Visualtyp eine eigene Composition im Ordner `Motion-System-Preview`.

Für CLI-Render und Smoke-Tests wird bewusst nicht der vollständige Kanal-Einstieg verwendet, sondern:

```text
ki/src/motion-system/remotion-entry.tsx
```

Dieser Einstieg registriert ausschließlich die Motion-Preview. Die Prüfung hängt dadurch nicht von anderen Kanal-Compositions oder lokalen Workspace-Paketen ab.

Format:

- 1080 × 1920
- 30 FPS für die Standardbeispiele
- weißer Hintergrund mit KI-Kanal-Farben
- Titel-Safe-Zone oben
- Satz-Safe-Zone unten

## Fokussierte Verifikation

Die komplette codebasierte Prüfung:

```bash
npm run motion:verify
```

Der Befehl führt nacheinander aus:

1. Syntaxprüfung der beiden Node-Render-Skripte
2. alle Motion-System-Tests
3. isolierten strikten TypeScript-Check über `ki/tsconfig.motion.json`
4. Erzeugung des Renderplans

Einzelbefehle:

```bash
npm run motion:script-check
npm run motion:test
npm run motion:typecheck
npm run motion:render-plan
```

## Smoke- und Release-Prüfung

Ein repräsentatives mittleres Bild für alle zehn Visualtypen:

```bash
npm run motion:smoke
```

Das erzeugt je Visualtyp Frame 75. Zusammen mit Tests und Typecheck:

```bash
npm run motion:release-check
```

`motion:release-check` führt `motion:verify` und danach den Zehn-Typen-Smoke-Render aus.

## Vollständiger Renderplan

`MOTION_RENDER_PLAN` enthält je Composition:

- Startframe
- 25-Prozent-Frame
- 50-Prozent-Frame
- 75-Prozent-Frame
- letzten Frame

```ts
import {MOTION_RENDER_PLAN} from './motion-system';

for (const item of MOTION_RENDER_PLAN) {
  console.log(item.compositionId, item.checkpoints);
}
```

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
- `motion:render-all`: rendert Prüfbilder und Videos

Die Ergebnisse landen standardmäßig unter:

```text
out/motion-system/<visualtyp>/
```

Gezielte Render:

```bash
MOTION_TYPES=input-output,comparison npm run motion:render-stills
MOTION_FRAMES=0,75,149 npm run motion:render-stills
MOTION_CONCURRENCY=2 npm run motion:render-stills
```

Erlaubt sind ein bis vier parallele Renderaufgaben. Eigene Pfade können über `MOTION_ENTRY_POINT` und `MOTION_OUTPUT_DIR` gesetzt werden.

Die CLI verwendet `npx --no-install`. Es wird keine fremde Remotion-Version nachgeladen.

## Render-Artefakte kontrollieren

Nach dem Render prüft `scripts/check-motion-renders.mjs`, ob alle erwarteten Dateien vorhanden und nicht leer sind.

```bash
npm run motion:check-stills
npm run motion:check-videos
npm run motion:check-renders
```

Erwartet werden:

- 50 PNG-Prüfframes: fünf Frames für jeden der zehn Visualtypen
- 10 finale MP4-Dateien
- insgesamt 60 gültige Render-Artefakte

Das Ergebnis wird zusätzlich als maschinenlesbarer Bericht gespeichert:

```text
out/motion-system/release-report.json
```

Fehlt eine Datei oder besitzt sie null Bytes, endet der Prüfbefehl mit einem Fehlercode und nennt jeden problematischen Pfad.

Der vollständige lokale Freigabelauf ist:

```bash
npm run motion:full-release-check
```

Dieser Befehl führt Tests, Typecheck, Renderplan, alle Still-Render, alle Video-Render und die abschließende Artefaktprüfung aus.

## GitHub Actions

Der Workflow liegt unter:

```text
.github/workflows/motion-system-checks.yml
```

Er enthält zwei Stufen:

1. `verify`: Tests, isolierter Typecheck und Renderplan
2. `smoke-render`: Frame 75 für alle zehn Visualtypen

### Aktueller Runner-Hinweis

Der private GitHub-Actions-Runner beendet Jobs derzeit vor dem ersten Workflow-Schritt. GitHub liefert dabei keine Steps, keine Logs und keine Diagnose-Artefakte. Das deutet auf eine Actions-, Billing- oder Runner-Einstellung des privaten Repositories hin und liefert keinen verwertbaren Codefehler.

Der Workflow ist deshalb vorübergehend nur über `workflow_dispatch` startbar. Sobald die Repository-Einstellung korrigiert ist, muss der Workflow manuell ausgeführt werden. Erst ein tatsächlich erfolgreicher Lauf bestätigt Tests, Typecheck und Smoke-Render in GitHub Actions.

## Prüfung vor Merge

Im Repository-Root ausführen:

```bash
npm run motion:full-release-check
```

Danach alle Compositions unter `Motion-System-Preview` visuell prüfen:

- Textüberlauf
- überlappende Karten
- Safe-Zones oben und unten
- alle Frames aus `MOTION_RENDER_PLAN`
- finale 1080 × 1920-Videos
- sichtbare Reaktion auf Audio-verschobene Beat-Frames
- `release-report.json` zeigt 60 von 60 gültigen Dateien

Der Feature-Branch darf erst nach erfolgreichem Laufzeit-, Render- und Preview-Check in `main` übernommen werden.
