# Motion-System: Produktionsmodus

Diese Datei beschreibt den Pfad, der für echte Videoerzeugung statt für experimentelle Vorschauen verwendet werden soll.

## Zwei Qualitätsmodi

`buildMotionScene()` arbeitet standardmäßig im Modus `report`:

```ts
const result = buildMotionScene({
  sentence: 'Die KI erstellt eine Zusammenfassung.',
});

console.log(result.quality);
```

Qualitätsfehler werden im Ergebnis zurückgegeben. Das ist für Editoren und interaktive Oberflächen sinnvoll, weil die Szene weiterhin angezeigt und korrigiert werden kann.

Für automatisierte Produktion kann `strict` verwendet werden:

```ts
const result = buildMotionScene({
  sentence: 'Die KI erstellt eine Zusammenfassung.',
  qualityMode: 'strict',
});
```

Sobald der Qualitätsbericht einen Fehler enthält, wird `MotionQualityError` ausgelöst. Die Ausnahme enthält sowohl das Storyboard als auch den vollständigen Qualitätsbericht.

## Empfohlene Produktions-APIs

Damit `strict` nicht versehentlich vergessen oder durch eine Szenenoption überschrieben wird, existieren drei feste Einstiegspunkte:

```ts
buildProductionMotionScene(input);
buildProductionMotionTimeline(input);
buildProductionMotionTimelineFromScript(input);
```

Beispiel für einen vollständigen Sprechtext:

```ts
const timeline = buildProductionMotionTimelineFromScript({
  script: `
    Die KI erhält eine Aufgabe.
    Der KI-Agent nutzt Browser und Dateien.
    Danach entsteht ein geprüftes Ergebnis.
  `,
  fps: 30,
  gapFrames: 8,
});
```

Diese APIs erzwingen den strikten Qualitätsmodus in jeder erzeugten Szene.

## Sichtbare Stage-Verträge

`getRenderedStageElementIds()` beschreibt, welche Element-IDs eine Stage tatsächlich darstellt.

`findUnrenderedStageElements()` findet Storyboard-Elemente, die im aktuellen Layout nicht sichtbar werden würden. Die Qualitätsprüfung meldet sie mit dem Code:

```text
unrendered-element
```

Dadurch können zusätzliche Elemente nicht mehr still im Storyboard verbleiben, obwohl die Stage sie ignoriert.

Aktuelle dynamische Grenzen:

- Tool-Orchestrierung: höchstens drei Werkzeuge
- Prozesskette: `step-1` bis `step-4`
- Ranking: höchstens acht Einträge

## Beat-Sichtbarkeit

Der zentrale `ProcessingCore` ist vor seinem `startFrame` vollständig unsichtbar. Erst danach wird er über eine kontrollierte 16-Frame-Animation eingeblendet.

Der Fehlerpfad zeigt jetzt die vollständige Kette:

```text
Eingabe → KI-Core → Fehler oder Prüfung
```

Der KI-Core verwendet dabei den echten `ai/show`-Beat des Storyboards. Audio-Synchronisierung und FPS-Retiming wirken deshalb auch auf diesen sichtbaren Schritt.

## Technische Render-Artefakte

Die finale Prüfung kontrolliert nicht nur Dateinamen und einfache Signaturen.

PNG-Anforderungen:

- gültige PNG-Signatur
- gültiger `IHDR`-Header
- exakt 1080 × 1920 Pixel
- mindestens 1024 Bytes

MP4-Anforderungen:

- gültiger `ftyp`-Header
- mindestens 4096 Bytes

Die Teilberichte stehen in:

```text
out/motion-system/release-report.json
out/motion-system/timeline-release-report.json
```

Jeder Dateieintrag enthält zusätzlich:

- Medientyp
- Dateigröße
- Signaturstatus
- Mindestgrößenstatus
- bei PNG Breite, Höhe und Dimensionsstatus

Nach beiden Teilprüfungen erzeugt `motion:check-release` den gemeinsamen Bericht:

```text
out/motion-system/combined-release-report.json
```

Der kombinierte Bericht kontrolliert zusätzlich, dass die Zähler noch zum aktuellen Render-Manifest passen. Erwartet werden exakt:

- 60 Einzeltyp-Artefakte
- 6 Timeline-Artefakte
- 66 Artefakte insgesamt

Veraltete Berichte mit abweichenden Zählern oder einem inkonsistenten `passed`-Status werden abgelehnt.

## Produktionsprüfung

Schneller Code- und Smoke-Test:

```bash
npm run motion:release-check
```

Vollständige Freigabeprüfung:

```bash
npm run motion:full-release-check
```

Nur die vorhandenen Teilberichte zusammenführen und prüfen:

```bash
npm run motion:check-release
```

`motion:verify` enthält sowohl die Vitest-Suite als auch die Node-Test-Suiten für Artefakt- und Freigabeberichte.

Ein Merge ist erst zulässig, wenn:

1. Tests und Typecheck erfolgreich sind.
2. alle zehn Einzeltyp-Compositions gerendert wurden.
3. die Timeline-Demo gerendert wurde.
4. `release-report.json` 60 von 60 Dateien bestätigt.
5. `timeline-release-report.json` 6 von 6 Dateien bestätigt.
6. `combined-release-report.json` 66 von 66 Dateien bestätigt.
7. alle elf Compositions visuell geprüft wurden.
