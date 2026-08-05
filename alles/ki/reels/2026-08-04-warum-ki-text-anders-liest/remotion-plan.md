# Remotion-Umsetzungsplan

## Zielstruktur

```text
ki/src/reels/why-ai-reads-differently/
├── index.ts
├── composition.tsx
├── constants.ts
├── types.ts
├── ReelWhyAIReadsDifferently.tsx
├── scenes/
│   ├── SentenceTokenShatterScene.tsx
│   ├── TokenVectorScannerScene.tsx
│   ├── EmbeddingClusterOrbitScene.tsx
│   ├── AttentionThreadWeaveScene.tsx
│   ├── NextTokenBranchRaceScene.tsx
│   ├── TransformerLayerElevatorScene.tsx
│   ├── AnswerWordAssemblyScene.tsx
│   └── BrilliantWrongSplitBalanceScene.tsx
├── components/
│   ├── ReelCaption.tsx
│   ├── TokenCapsule.tsx
│   ├── VectorDigits.tsx
│   ├── GlowThread.tsx
│   ├── ProbabilityPath.tsx
│   └── SceneTransitionBridge.tsx
└── __tests__/
    ├── reelContract.test.ts
    ├── sceneUniqueness.test.ts
    └── frameBounds.test.ts
```

## Composition

```text
ID: Reel-WhyAIReadsDifferently
Breite: 1080
Höhe: 1920
FPS: 30
Dauer: 1080 Frames
```

Die Composition wird zusätzlich in `MotionPreviewRoot.tsx` oder einem separaten Reel-Preview-Root registriert. Bestehende Motion-System-Compositions dürfen nicht verändert oder entfernt werden.

## Szenensequenzen

| Szene | Start | Dauer | Endframe exklusiv |
|---|---:|---:|---:|
| 1 | 0 | 114 | 114 |
| 2 | 114 | 120 | 234 |
| 3 | 234 | 120 | 354 |
| 4 | 354 | 135 | 489 |
| 5 | 489 | 165 | 654 |
| 6 | 654 | 135 | 789 |
| 7 | 789 | 150 | 939 |
| 8 | 939 | 141 | 1080 |

## Technische Animationsregeln

- Animationen ausschließlich aus `useCurrentFrame()`, `interpolate()`, `spring()` und deterministischen mathematischen Funktionen ableiten.
- Kein `Math.random()` zur Renderzeit. Zufallswerte nur aus einem festen Seed erzeugen.
- Keine CSS-Transitions oder zeitabhängigen Browser-APIs.
- Alle Texte und wichtigen Objekte innerhalb der Safe-Zone halten.
- Bewegungen bei Szenenanfang und -ende kontrolliert fortsetzen; kein kompletter visueller Reset.
- Die letzte visuelle Form einer Szene wird als Ausgangsform der nächsten Szene genutzt.
- Kleine Komponenten dürfen wiederverwendet werden, vollständige Szenenkompositionen nicht.

## Szene 1: SentenceTokenShatterScene

- Satz als einzelne Wortsegmente rendern, aber anfangs wie eine geschlossene Zeile ausrichten.
- Bei Frame 28 beginnt eine 10-Frame-Spannungsphase.
- Frames 38–74: Segmente lösen sich mit unterschiedlicher X-, Y- und Z-Illusion.
- Frames 72–114: Tokens richten sich auf den Eintritt in die Scannerkammer aus.
- Keine Glasbruchgrafik; Bruchgefühl über Offset, Rotation, Blur und kurze Linienimpulse erzeugen.

## Szene 2: TokenVectorScannerScene

- Scannerkammer als transparente SVG-/CSS-Struktur.
- Scanbalken bewegt sich vertikal und aktiviert Token für Token.
- Unter dem Scanpunkt wechseln Tokenlabels in kurze Vektoren wie `[0.18, -0.42, 0.91]`.
- Vectorwerte sind feste Beispieldaten und bleiben deterministisch.
- Am Ende werden die Vektoren in einzelne Punkte zerlegt.

## Szene 3: EmbeddingClusterOrbitScene

- Perspektive über Skalierung, Y-Offset, Blur und Layerreihenfolge simulieren; Three.js nur einsetzen, wenn es die Stabilität nicht verschlechtert.
- Mindestens drei Cluster mit klar unterschiedlichen Schwerpunktpositionen.
- Kameraorbit maximal 12 Grad, damit keine Motion-Sickness entsteht.
- Punkte dürfen nie rein dekorativ wirken: Clusterlabels müssen die Bedeutungsnähe nachvollziehbar machen.

## Szene 4: AttentionThreadWeaveScene

- Wortknoten asymmetrisch verteilen.
- Verbindungsstärken als Datenmodell definieren.
- Starke Threads erhalten höhere Opazität und größere Strichbreite.
- Threads wachsen entlang einer SVG-Path-Länge, nicht per einfachem Fade-in.
- Pulsbewegung erst nach vollständigem Verbindungsaufbau.

## Szene 5: NextTokenBranchRaceScene

- Drei Pfade besitzen unterschiedliche Kurvenformen.
- Wahrscheinlichkeiten werden über Keyframes interpoliert, nicht zufällig generiert.
- Kandidaten bewegen sich entsprechend ihrer aktuellen Wahrscheinlichkeit.
- Der Gewinner darf erst in den letzten 35 Frames eindeutig feststehen.
- Prozentzahlen müssen technisch konsistent sein und dürfen zusammen nicht zwangsläufig 100 ergeben, da nur Top-Kandidaten gezeigt werden.

## Szene 6: TransformerLayerElevatorScene

- Vier schwebende Ebenen mit eigenem visuellen Zweck.
- Gewinnerkapsel bewegt sich vertikal durch jede Ebene.
- Pro Ebene verändert sich genau ein sichtbares Merkmal.
- Keine horizontale Prozesskette; die Vertikalität unterscheidet diese Szene bewusst von vorhandenen Motion-System-Stages.

## Szene 7: AnswerWordAssemblyScene

- Wörter kommen aus verschiedenen Tiefen und rasten in einer Satzzeile ein.
- Kein klassischer Cursor-Typewriter.
- Textlayout muss bei variabler Wortlänge stabil bleiben.
- Neue Wörter dürfen die bisherige Zeile leicht verschieben, aber nicht springen lassen.

## Szene 8: BrilliantWrongSplitBalanceScene

- Satzfläche wird per Clip-Path in zwei Seiten getrennt.
- Waage als eigenes SVG mit physikalisch plausibler Rotationsachse.
- Erst scheinbare Sicherheit, dann Quellenwarnung und kontrolliertes Kippen.
- Abschlusstext bleibt mindestens 40 Frames vollständig sichtbar.

## Untertitel

- Wortweise Untertitel sind nicht Teil der Bildmitte.
- Optional nur kurze Kernaussagen pro Szene in der oberen Safe-Zone.
- Maximal zwei Textzeilen gleichzeitig.
- Hook und Schluss dürfen größer sein als erklärende Zwischentexte.

## Testframes

```text
0, 38, 74, 113,
114, 154, 194, 233,
234, 274, 314, 353,
354, 399, 444, 488,
489, 544, 599, 653,
654, 699, 744, 788,
789, 839, 889, 938,
939, 986, 1033, 1079
```

Jeder dieser Frames muss ohne Überlauf, fehlende Elemente oder ungewollte leere Fläche renderbar sein.
