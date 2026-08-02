# Motion-System-Architektur

## Ziel

Das Motion-System trennt Inhalt, Zeitplanung, Darstellung und Renderprüfung. Dadurch kann ein Satz oder ein vollständiger Sprechtext verarbeitet werden, ohne dass die React-Komponenten selbst Klassifikation, Audio-Parsing oder Datenvalidierung übernehmen müssen.

## Datenfluss

```text
Satz / Skript
    │
    ├─ scriptTimeline.ts
    │    └─ mehrere Szenensätze
    │
    ├─ router.ts
    │    ├─ tokenbasierte Klassifikation
    │    └─ Default-Storyboard
    │
    ├─ customization.ts
    │    └─ inhaltsspezifische Beschriftungen
    │
    ├─ fps.ts
    │    └─ zeitproportionales FPS-Retiming
    │
    ├─ audioSync.ts
    │    └─ Beat-Ausrichtung auf Wort-Timestamps
    │
    ├─ schema.ts
    │    └─ strukturelle und semantische Validierung
    │
    ├─ quality.ts
    │    └─ nicht blockierende Renderwarnungen
    │
    ├─ timeline.ts
    │    └─ globale Szenenpositionen und Gesamtdauer
    │
    ├─ MotionScene.tsx / MotionTimeline.tsx
    │    └─ Remotion-Darstellung
    │
    └─ Renderplan, CLI und Artefaktprüfung
```

## Modulgrenzen

### `router.ts`

Verantwortlich für:

- Text normalisieren
- Visualtyp bestimmen
- Klassifikation erklären
- sichere Default-Elemente und Default-Beats erzeugen

Nicht verantwortlich für:

- Wort-Timestamps
- FPS-Retiming
- React-Rendering
- Dateiausgabe

### `customization.ts`

Ändert ausschließlich explizit erlaubte sichtbare Beschriftungen. Unbekannte Element-IDs und leere Werte werden abgelehnt. Struktur und Visualtyp bleiben erhalten.

### `fps.ts`

Skaliert gemeinsam:

- Szenendauer
- Beat-Start
- Beat-Dauer

Eine Änderung von 30 auf 60 FPS verdoppelt die Framewerte und erhält die Zeit in Sekunden.

### `audioSync.ts`

Arbeitet auf einem bereits korrekt retimten Storyboard. Es verschiebt `show`-Beats auf gesprochene Zielbegriffe und erhält relative Abstände nachfolgender Aktionen. Verbindungen berücksichtigen sichtbare Quell- und Zielzustände.

### `schema.ts`

Blockiert ungültige Daten, unter anderem:

- doppelte IDs
- unbekannte Beat-Referenzen
- fehlende Pflicht-Elemente
- ungültige Connect-Quellen
- Beats außerhalb der Szene
- Beat-Dauer über das Szenenende hinaus

### `quality.ts`

Meldet praktische Risiken, die nicht zwingend ein ungültiges Datenmodell darstellen:

- lange Beschriftungen
- überladene Stages
- späte Beats
- fehlende Stage-Timings
- kollabierte Folgeaktionen
- zu lange Sätze

Nur Probleme mit `severity: 'error'` setzen `passed` auf `false`.

### `timeline.ts`

Plant bereits gebaute Szenen auf einer gemeinsamen Frameachse. Es ändert keine lokalen Beat-Frames. Jede Szene beginnt bei lokalem Frame null und wird durch Remotion `Sequence` an die globale Position gesetzt.

### `scriptTimeline.ts`

Ist eine Komfortschicht vor `timeline.ts`. Die Datei segmentiert Fließtext und erzeugt `BuildMotionSceneInput`-Objekte. Die eigentliche Szenenlogik bleibt in `runtime.ts`.

### React-Stages

React-Komponenten erhalten:

- sichtbare Beschriftungen
- konkrete Beat-Frames
- Layoutpositionen

Sie klassifizieren keinen Text und verändern keine Storyboards.

## Zentrale Invarianten

1. Alle Storyboards bestehen das Zod-Schema.
2. Alle Element- und Beat-IDs sind innerhalb eines Storyboards eindeutig.
3. Jeder Beat endet vollständig innerhalb der Szenendauer.
4. Jede Stage verwendet echte Storyboard-Beats oder einen dokumentierten Fallback.
5. Eine FPS-Änderung erhält die Dauer in Sekunden, solange die 900-Frame-Grenze nicht greift.
6. Eine Timeline verwendet genau eine FPS-Zahl.
7. Timeline-Szenen besitzen eindeutige Storyboard-IDs.
8. Timeline-Startframes sind streng aus vorherigem Ende und konfiguriertem Abstand abgeleitet.
9. Render-Targets und Prüfframes stammen aus `render-config.json`.
10. `main` erhält das System erst nach erfolgreicher Laufzeit- und Renderprüfung.

## Öffentliche Einstiegspunkte

### Einzelne Szene

```ts
buildMotionScene(input)
```

### Vollständiges Skript

```ts
buildMotionTimelineFromScript(input)
```

### Bereits vorbereitete Szenen

```ts
buildMotionTimeline(input)
```

### Externe Storyboards validieren

```ts
validateMotionStoryboard(input)
assertMotionStoryboard(input)
```

### Persistenz

```ts
serializeMotionStoryboard(storyboard)
parseMotionStoryboardJson(json)
serializeMotionTimeline(timeline)
parseMotionTimelineJson(json)
```

### Timeline-Navigation

```ts
resolveMotionTimelineFrame(timeline, frame)
resolveMotionTimelineTime(timeline, seconds)
```

## Renderarchitektur

`render-config.json` ist die gemeinsame Quelle für:

- Visualtypen
- Einzeltyp-Prüfframes
- Smoke-Frames
- Timeline-ID
- Timeline-Dauer
- Timeline-Prüfframes

Die Datei wird auf zwei Wegen geprüft:

- `renderConfig.ts` für TypeScript, Tests und Remotion
- `scripts/motion-render-config.mjs` für Node-CLI-Skripte

`timelineRenderPlan.ts` vergleicht die berechnete Timeline-Demo zusätzlich mit dem Manifest und bricht bei Drift ab.

## Freigabestufen

### Codeprüfung

```bash
npm run motion:verify
```

### Schnelle visuelle Prüfung

```bash
npm run motion:release-check
```

### Vollständige Prüfung

```bash
npm run motion:full-release-check
```

Der vollständige Lauf erwartet:

- 50 Einzeltyp-PNGs
- 10 Einzeltyp-MP4s
- 5 Timeline-PNGs
- 1 Timeline-MP4
- zwei erfolgreiche maschinenlesbare Artefaktberichte

## Erweiterung um einen neuen Visualtyp

Ein neuer Typ ist erst vollständig integriert, wenn alle Punkte umgesetzt sind:

1. `motionVisualTypeSchema`
2. Pflicht-Elemente im Storyboard-Schema
3. Klassifikationsmuster
4. Default-Storyboard
5. eigene Stage
6. exhaustive Zuordnung in `MotionScene`
7. Stage-Timing-Anforderungen
8. Beispiel-Storyboard
9. Render-Manifest
10. Audio-, FPS-, Schema-, Preview- und Renderplan-Tests

Fehlt einer dieser Schritte, sollen Tests oder exhaustive TypeScript-Prüfungen die Erweiterung sichtbar blockieren.
