# Fließtext-zu-Motion-Timeline

Die Skript-Pipeline wandelt einen vollständigen deutschen Sprechtext in mehrere validierte Motion-Szenen und anschließend in eine gemeinsame Remotion-Timeline um.

## Direkter Einstieg

```ts
import {buildMotionTimelineFromScript} from './motion-system';

const timeline = buildMotionTimelineFromScript({
  script: `
    Die KI erhält eine komplexe Aufgabe.
    Der KI-Agent nutzt Browser und Dateien für die Recherche.
    Die Daten fließen durch die KI zu einem klaren Ergebnis.
    Im Vergleich ist die geprüfte Antwort besser als der erste Entwurf.
  `,
  fps: 30,
  gapFrames: 8,
});
```

Die Funktion führt aus:

1. Leerzeichen und Zeilenumbrüche normalisieren
2. Fließtext an Satzzeichen und Zeilenenden segmentieren
3. übliche deutsche Abkürzungen schützen
4. überlange Szenentexte an Wortgrenzen teilen
5. optional kurze Folgesätze zusammenführen
6. jeden Satz über `buildMotionScene()` routen und validieren
7. alle Szenen chronologisch in `buildMotionTimeline()` einplanen

## Nur segmentieren

```ts
import {segmentMotionScript} from './motion-system';

const sentences = segmentMotionScript(script, {
  maxCharactersPerScene: 180,
  mergeShorterThan: 15,
});
```

Grenzen:

- `maxCharactersPerScene`: 40 bis 220
- `mergeShorterThan`: 0 bis zur maximalen Szenenlänge
- höchstens 100 erzeugte Szenen

Einzelne Wörter, die selbst länger als die Grenze sind, werden deterministisch in Teilstücke zerlegt. Keine Szene überschreitet dadurch die angegebene Zeichengrenze.

## Geschützte Abkürzungen

Die Segmentierung trennt nicht innerhalb häufiger deutscher Formen wie:

- `z. B.`
- `d. h.`
- `u. a.`
- `bzw.`
- `ca.`
- `etc.`
- `Dr.`
- `Prof.`
- `Nr.`
- `vgl.`

Normale Satzenden wie `kurz.` oder `wird.` bleiben davon unberührt.

## Standardwerte für alle Szenen

```ts
const timeline = buildMotionTimelineFromScript({
  script,
  sceneDefaults: {
    labels: ['Eingabe', 'KI', 'Ergebnis'],
  },
});
```

`sceneDefaults` unterstützt alle Einstellungen von `buildMotionScene()` außer `sentence` und `fps`, zum Beispiel:

- Wort-Timestamps
- sichtbare Labels
- Elementbeschriftungen
- explizite Storyboard-ID

Für verschiedene Wort-Timestamps oder IDs sollten gezielte Szenen-Overrides verwendet werden.

## Einzelne Szenen anpassen

```ts
const timeline = buildMotionTimelineFromScript({
  script: 'Die KI erstellt Text. Die KI erstellt ein Bild.',
  sceneDefaults: {
    labels: ['Inhalt', 'KI', 'Ergebnis'],
  },
  sceneOverrides: [
    {
      elementLabels: {
        input: 'Notizen',
        output: 'Text',
      },
    },
    {
      elementLabels: {
        input: 'Beschreibung',
        output: 'Bild',
      },
    },
  ],
});
```

Die Reihenfolge entspricht exakt den erzeugten Szenen. Mehr Overrides als Szenen werden abgelehnt, damit keine Konfiguration still verloren geht.

## Segmentierung zuerst prüfen

Für produktive Pipelines ist ein zweistufiger Ablauf sinnvoll:

```ts
import {
  createMotionSceneInputsFromScript,
  buildMotionTimeline,
} from './motion-system';

const scenes = createMotionSceneInputsFromScript({
  script,
  maxCharactersPerScene: 180,
});

// Szenen hier anzeigen, speichern oder manuell ergänzen.

const timeline = buildMotionTimeline({
  scenes,
  fps: 30,
  gapFrames: 8,
});
```

Damit kann eine Benutzeroberfläche zuerst die automatische Satzaufteilung anzeigen und erst nach Bestätigung die Timeline bauen.

## Timeline navigieren

```ts
import {
  resolveMotionTimelineFrame,
  resolveMotionTimelineTime,
} from './motion-system';

const atFrame = resolveMotionTimelineFrame(timeline, 233);
const atTime = resolveMotionTimelineTime(timeline, 7.8);
```

Das Ergebnis unterscheidet zwischen:

- `kind: 'scene'` mit Szene, lokalem Frame und Fortschritt
- `kind: 'gap'` mit vorheriger Szene, nächster Szene und Position in der Lücke

Frames außerhalb der Timeline werden abgelehnt.

## Speichern und wieder laden

```ts
import {
  serializeMotionTimeline,
  parseMotionTimelineJson,
} from './motion-system';

const json = serializeMotionTimeline(timeline);
const restored = parseMotionTimelineJson(json);
```

Beim Laden werden Version, Storyboards, IDs, FPS, Szenenpositionen, Abstände und Gesamtdauer erneut validiert. Qualitätsberichte werden neu berechnet.

## Rendern

Die integrierte Demo-Timeline kann so geprüft werden:

```bash
npm run motion:timeline-smoke
npm run motion:timeline-render
npm run motion:check-timeline
```

Für eine dynamisch erzeugte Timeline wird eine Remotion-Composition mit `MotionTimelineComposition` registriert und deren Dauer auf `timeline.totalDurationInFrames` gesetzt.

## Tests

Die Skript-Pipeline ist unter anderem abgesichert gegen:

- leere Skripte
- falsche Segmentierungsgrenzen
- Satztrennung innerhalb deutscher Abkürzungen
- falsche Teiltreffer bei normalen Satzenden
- überlange Sätze und Einzelwörter
- zu viele Szenen-Overrides
- variable Audiodauern innerhalb einer Timeline
- doppelte Storyboard-IDs
- unterschiedliche FPS innerhalb einer Timeline
