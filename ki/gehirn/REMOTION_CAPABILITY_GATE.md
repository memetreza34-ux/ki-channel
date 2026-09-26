# Remotion Capability Gate

**Status:** verbindlich für neue Visual-Quality-V3-Reels nach Phase 1.

## Warum dieses Gate existiert

Das Repository besitzt viele Remotion-Fähigkeiten, aber ein Reel darf nicht mehr allein deshalb als visuell stark gelten, weil es viele Elemente, Icons oder unterschiedliche Layouts enthält.

Das zentrale Problem, das dieses Gate verhindert:

```text
starke Capability-Policy
→ Agent baut trotzdem Card + Icon + Text
→ Qualitätsmanifest behauptet Vielfalt
→ Source nutzt fast nur React/CSS
```

Künftig gilt:

> Die gewählte Remotion-Mechanik muss pro Beat vor dem Source bewusst entschieden und anschließend im echten Source nachweisbar implementiert werden.

## Pflichtdatei

Jedes neue Phase-1-fertige V3-Reel führt:

```text
06-projektdateien/remotion-capabilities-v1.json
```

Der CI-Check ist:

```bash
node scripts/check-remotion-capabilities.mjs
```

und Bestandteil von:

```bash
node scripts/run-remotion-readiness.mjs
```

Neue Reel-Pakete werden bereits durch `scripts/new-ki-reel.mjs` mit einem leeren, absichtlich noch nicht freigabefähigen Capability-Manifest angelegt. Vor `Phase 1 = FERTIG` muss es vollständig ausgefüllt sein.

## Capability-Palette

Erlaubte Werte:

- `react-svg-css`
- `paths`
- `shapes`
- `three`
- `depth-2.5d`
- `kinetic-typography`
- `terminal-code`
- `data-visualization`
- `object-transformation`
- `motion-blur`
- `transitions`
- `noise`
- `real-capture`

Nicht jede Capability muss in jedem Reel vorkommen. Die Auswahl folgt der Aussage.

## Entscheidungsreihenfolge pro Beat

```text
Sprecherstelle
→ Bedeutung
→ Zuschauer muss sehen
→ Hauptverb
→ beste visuelle Mechanik
→ Primary Remotion capability
→ ergänzende Capabilities
→ konkrete Beat-Source-Datei
→ Source-Build
→ CI prüft Implementierungsbeleg in genau dieser Datei
```

Die Frage ist nicht: **Welche Komponente ist schon bequem vorhanden?**

Die Frage ist: **Welche Remotion-Mechanik erklärt diesen Beat sichtbar am besten?**

## Harte Regeln

1. Der Hook darf nicht nur `react-svg-css` als Primary Capability verwenden.
2. Mindestens 50 % der Beats verwenden eine Advanced Capability als Primary Mechanism.
3. Mindestens drei unterschiedliche Primary Capabilities pro Reel, sofern mindestens vier Beats vorhanden sind.
4. Mindestens ein Beat ist `isHero: true`.
5. Drei gleiche Primary Capabilities hintereinander sind nur bei einem echten fortlaufenden Prozess mit `continuationOfPrevious: true` erlaubt.
6. `card` als Primary Primitive ist nur erlaubt, wenn die Karte selbst semantisch UI, Dokument, Nachricht, Datei, Datensatz oder Token ist. Dann ist `semanticCardReason` Pflicht.
7. Eine Capability im JSON zählt nicht als Nutzung. Der Source muss einen echten Implementierungsbeleg enthalten.
8. Jeder Beat führt `sourceFile`. Dieser Pfad muss zusätzlich in `sourceFiles` stehen.
9. Erlaubt sind ausschließlich `.ts`/`.tsx`-Dateien unter `ki/src/reels/`.
10. Absolute Pfade, URLs, `..`-Traversal und Longform-/fremde Source-Verzeichnisse sind nicht als Capability-Nachweis erlaubt.
11. Capability-Nachweise werden nicht mehr reelweit zusammengeworfen, sondern gegen die dem Beat zugeordnete Source-Datei geprüft.

## Source-Nachweis

Der Checker liest die `sourceFiles` aus dem Manifest. Für jeden Beat prüft er nur die dort unter `sourceFile` genannte Reel-Source.

Beispiele gültiger konkreter Usage-Marker:

| Capability | gültige Source-Indizien |
|---|---|
| `paths` | `<AnimatedDataPath`, `evolvePath(`, `getPointAtLength(` |
| `shapes` | `<ShapeSignal`, `<Circle`, `<Triangle`, `makeCircle(`, `makeTriangle(` |
| `three` | `<ThreeCanvas`, `<mesh`, `<group`, `<perspectiveCamera` |
| `depth-2.5d` | `<DepthStage`, echte `perspective:`-/`translate3d(`-Logik |
| `kinetic-typography` | `<KineticType`, `<KineticNumber` |
| `terminal-code` | `<TerminalMock`, `<CodeDiff`, `<CodeEditor` |
| `data-visualization` | `<BenchmarkAxis`, `<DataChart`, `<LineChart`, `<BarChart`, `<AreaChart` |
| `object-transformation` | `<ObjectTransformation`, `<ObjectMorph` |
| `motion-blur` | `<CameraMotionBlur`, `<Trail` |
| `transitions` | `<TransitionSeries` |
| `noise` | `noise2D(`, `noise3D(` |
| `real-capture` | `<Video`, `<Img`, `<OffthreadVideo`, `staticFile(` |

Ein bloßer Import gilt bewusst nicht als Nachweis. Die Mechanik muss in der zugeordneten Beat-Source tatsächlich verwendet werden.

Für Three gilt weiter die kanalweite Remotion-Regel: Production-Motion wird über `useCurrentFrame()`/Remotion-Timeline gesteuert. Ein unabhängiger R3F-`useFrame()`-Ticker zählt bewusst **nicht** als gültiger Capability-Nachweis.

## High-Level-Visuals

Damit Advanced Capabilities nicht schwerer zu verwenden sind als Cards, stellt das Repo bereit:

```text
ki/src/visual-system/AdvancedMotionKit.tsx
```

Aktuell:

- `AnimatedDataPath` — echte `@remotion/paths`-Pfadentwicklung + bewegtes Payload
- `KineticType` — große framebasierte Typografie als Hauptvisual
- `DepthStage` — kontrollierte 2.5D-Perspektive/Parallax
- `ShapeSignal` — echte `@remotion/shapes`-Geometrie
- `ObjectTransformation` — sichtbarer Objektzustandswechsel statt Vorher/Nachher-Cards

Diese Komponenten sind Startpunkte, keine Pflichtästhetik. Wenn eine Szene eine bessere individuelle Lösung braucht: `NEW_BUILD`.

## Beispielmanifest

```json
{
  "version": 1,
  "sourceFiles": [
    "ki/src/reels/example/Hook.tsx",
    "ki/src/reels/example/Speed.tsx",
    "ki/src/reels/example/Code.tsx",
    "ki/src/reels/example/Verdict.tsx"
  ],
  "beats": [
    {
      "beatId": "hook",
      "sourceFile": "ki/src/reels/example/Hook.tsx",
      "isHook": true,
      "isHero": true,
      "primaryCapability": "object-transformation",
      "capabilities": ["object-transformation", "kinetic-typography"],
      "primaryPrimitive": "object",
      "rationale": "Das Modell wechselt sichtbar seinen Zustand; der Konflikt ist deshalb vor dem Voiceover verständlich."
    },
    {
      "beatId": "speed",
      "sourceFile": "ki/src/reels/example/Speed.tsx",
      "primaryCapability": "paths",
      "capabilities": ["paths", "motion-blur"],
      "primaryPrimitive": "path",
      "rationale": "Zwei bewegte Datenrouten machen Geschwindigkeit als sichtbares Rennen statt als Prozentkarte verständlich."
    },
    {
      "beatId": "code",
      "sourceFile": "ki/src/reels/example/Code.tsx",
      "primaryCapability": "terminal-code",
      "capabilities": ["terminal-code", "kinetic-typography"],
      "primaryPrimitive": "code",
      "rationale": "Die Implementierung selbst ist die Aussage, daher ist Code das semantische Hauptobjekt."
    },
    {
      "beatId": "verdict",
      "sourceFile": "ki/src/reels/example/Verdict.tsx",
      "primaryCapability": "shapes",
      "capabilities": ["shapes", "kinetic-typography"],
      "primaryPrimitive": "shape",
      "rationale": "Ein geometrischer Endzustand erzeugt eine eigene finale Silhouette statt einer weiteren Zusammenfassungskarte."
    }
  ]
}
```

## Visual Strategy Marker

`visual-strategy.md` muss zusätzlich explizit die Begriffe enthalten:

```text
Primary Remotion capability
Capability rationale
```

Der kanonische Reel-Generator legt diese Spalten automatisch im Beat Sheet an.

## Anti-Missbrauch

Nicht erlaubt:

- Capability nur im Manifest nennen, aber im Source nicht verwenden
- Capability irgendwo anders im Reel verwenden und damit einen Beat ohne echte Nutzung freischalten
- fremde oder außerhalb des Repos liegende Dateien als Source-Nachweis referenzieren
- Three nur als Dekoration einsetzen, wenn 2D die Aussage klarer erklärt
- Motion Blur über schwache Motion legen
- Transitions als Effekt-Sammlung
- Lottie/Rive ohne echtes vorhandenes Asset
- Paths/Shapes nur als Mini-Deko, während das Hauptvisual weiterhin eine abstrakte Card ist

Ziel ist nicht maximaler Effekt-Einsatz. Ziel ist **bessere sichtbare Erklärung durch die passendste Remotion-Mechanik**.
