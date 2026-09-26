# Visual Quality V3 — Pflicht für neue KI-Reels

Ab **Reel 05 der Woche 2026-09-21** und für alle späteren Wochen gilt zusätzlich zum V2-Produktionsvertrag dieses Gate.

Ziel: Ein Reel darf nicht mehr technisch grün sein und trotzdem wie eine leere Präsentation wirken.

## 1. Hook ist ein eigenes Produkt

Die ersten 0–3 Sekunden müssen ohne Audio bereits verständlich machen, warum man weitersehen soll.

Pflicht:
- Hero-Objekt belegt mindestens 28% der nutzbaren Visual-Fläche.
- mindestens zwei semantische visuelle Anker (z. B. Produkt + Warnung, Modell + Datum).
- Produkt-/Brand-Anker ist wahrnehmbar groß; Mini-Badge oben links zählt nicht.
- mindestens zwei echte Zustandsänderungen in Sekunde 1.
- mindestens drei echte Zustandsänderungen in den ersten 3 Sekunden.
- starker Kontrast.
- Konflikt/Konsequenz sichtbar.
- Kernbotschaft auch ohne Sprecher grob verständlich.

## 2. Icons und Illustrationen sind Bedeutung, nicht Deko

Eine Szene braucht mindestens zwei semantische visuelle Anker aus:
- Icon
- Illustration
- Gerät
- Terminal/Code
- Server/Cloud
- Modellchip
- Diagramm mit realer Bedeutung
- Produkt-/Brand-Anker

Ein winziges Icon, ein Punkt oder ein dekorativer Kreis zählt nicht.

Wiederverwendbare Bausteine liegen unter:
- `ki/src/visual-system/TechVisualKit.tsx`
- `ki/src/visual-system/SemanticVisualKit.tsx`

Offizielle Markenlogos nur als echte, unveränderte Markenassets. Ohne echtes Asset: Produktname + neutrales Kategorie-Icon.

## 3. Shot-Archetypen statt Kartenserie

Erlaubte V3-Archetypen:
- `hero-impact`
- `object-transformation`
- `split-comparison`
- `ui-demo`
- `network-flow`
- `device-scene`
- `timeline-deadline`
- `zoom-detail`
- `terminal-code`
- `final-verdict`

Regeln:
- nie derselbe Archetyp direkt hintereinander.
- bei Reels mit mindestens vier Szenen mindestens vier verschiedene Archetypen.
- Card/Panel ist kein Archetyp und darf nur semantischer Bestandteil sein.

## 4. Hero-Größe und visuelle Dichte

Pro Szene:
- Hero mindestens 18% der nutzbaren Visual-Fläche.
- mindestens drei Support-Elemente.
- mindestens drei unterschiedliche Formfamilien.
- mindestens zwei echte Zustandsänderungen.
- mindestens zwei Micro-Beats.
- reale Bewegungsdistanz von mindestens ca. 60 px oder mindestens vier bedeutende Zustandswechsel.

Große leere Fläche ist nur erlaubt, wenn sie die Aussage trägt. Sie darf fehlende visuelle Idee nicht kaschieren.

## 5. Kontrast

Der Editorial-Light-Look bleibt, aber nicht alles darf Pastell sein.

- Hook: immer `strong`.
- Ink/Dunkelviolett für Hero-Kontrast aktiv verwenden.
- Rot ausschließlich für Risiko/Stop/Fehler.
- Grün ausschließlich für Vorteil/OK/weiter offen.
- höchstens 25% der Szenen dürfen bewusst `soft` sein.

## 6. Visual Quality Manifest

Jedes neue Phase-1-fertige Reel braucht:

`06-projektdateien/visual-quality-v3.json`

und einen Source-Vertrag:

`ki/src/reels/<slug>/visualQuality.ts`

Der Source-Vertrag muss `assertVisualQualityV3(...)` ausführen.

Beispielstruktur:

```json
{
  "version": 3,
  "sourceQualityContract": "ki/src/reels/mein-reel/visualQuality.ts",
  "hook": {
    "heroAreaRatio": 0.32,
    "semanticVisualAnchors": 3,
    "brandAnchorAreaRatio": 0.05,
    "stateChangesFirstSecond": 2,
    "stateChangesFirst3Seconds": 4,
    "contrast": "strong",
    "conflictVisible": true,
    "keyMessageVisible": true
  },
  "scenes": [],
  "targetScores": {
    "hook": 8.5,
    "visualVariety": 8.5,
    "motion": 8.5,
    "iconIllustrationUse": 8.5,
    "readability": 8.5,
    "overall": 8.5
  }
}
```

CI prüft diesen Vertrag mit `scripts/check-visual-quality-v3.mjs`.

## 7. Kontaktblatt vor finalem Video

Vor dem finalen Render:
1. 12–18 repräsentative Frames rendern.
2. Kontaktblatt öffnen.
3. Hook separat beurteilen.
4. Wiederholte Layouts markieren.
5. zu kleine Hero-Objekte markieren.
6. fehlende Icons/Illustrationen markieren.
7. zu blasse/weiße Frames markieren.
8. erst danach final rendern.

Automatische Metriken sind Warnsystem, keine kreative Freigabe.

## 8. Creative Score

Vor Freigabe jeweils mindestens 8/10:
- Hook
- Visual Variety
- Motion
- Icon/Illustration Use
- Readability
- Overall

Ein technischer PASS ersetzt diese Bewertung nicht.

## 9. Produktionsreihenfolge

`Thema → Hook-Konzept → Shot-Archetypen → Icons/Illustrationen/Brand-Anker → Storyboard → Remotion → Kontaktblatt → Creative Score >= 8/10 → finaler Render`

Wenn das Kontaktblatt langweilig aussieht, wird **nicht** durch mehr Glow/Partikel gerettet. Hook, Shot oder Hero-Visual wird neu gebaut.
