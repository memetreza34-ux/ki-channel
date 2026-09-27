# Visual Quality V4 — Story, Semantik und scene-local QA

Ab der Woche **2026-09-28** ersetzt Visual Quality V4 für neue Short-Form-Reels das V3-Gate.

V3 bleibt Legacy-Vertrag für ältere Reels. V4 behebt die zentrale Schwäche von V3: Ein Reel konnte quantitative Anforderungen erfüllen und trotzdem mit leerem Hook-Start, abstrakten Heroes, langen Holds oder schwacher visueller Entwicklung durchkommen.

## Ziel

Eine Szene ist erst dann stark, wenn sie ohne zusätzliche Erklärung als kleine visuelle Handlung funktioniert:

```text
STARTZUSTAND
→ SICHTBARE VERÄNDERUNG
→ ERGEBNIS / PAYOFF
```

Remotion-Capabilities sind Werkzeuge. Sie ersetzen diese visuelle Handlung nicht.

---

## 1. Frame 0 ist Teil des Hooks

Der Hook darf nicht aus Schwarz/Weiß/leerem Hintergrund hineinblenden.

Pflicht:

- Hero bereits in Frame 0 sichtbar
- Kernbotschaft spätestens innerhalb der ersten ca. 0,6 Sekunden visuell angelegt
- erste große sichtbare Veränderung innerhalb der ersten Sekunde
- Hero mindestens 28% der nutzbaren Visual-Fläche
- mindestens zwei konkrete Recognition Cues
- starker Kontrast
- Konflikt/Konsequenz sichtbar

Der automatische V4-Review rendert Frame 0 ausdrücklich mit.

---

## 2. Jede Szene braucht eine echte Visual Story

Pro Szene müssen in `visual-quality-v4.json` und `visual-strategy.md` konkret beschrieben sein:

- `Start state`
- `Visible change`
- `End state`
- `Visual verb`
- `Hero meaning`
- `Recognition cues`
- `Payoff`

Schwache Verben sind kein Visual-Konzept:

- zeigt
- erscheint
- steht da
- blendet ein
- bewegt sich

Stärker sind Verben, die Ursache/Wirkung oder Transformation tragen:

- verbindet
- blockiert
- öffnet
- zerfällt
- verwandelt
- sortiert
- prüft
- überholt
- kollidiert
- klappt auf
- kompiliert
- schaltet frei

---

## 3. Semantischer Hero statt abstrakter Hauptform

Ein Hero ist nicht automatisch gut, nur weil er groß ist.

Jede Szene dokumentiert:

- `semanticType`
- `meaning`
- `screenAreaTarget`
- mindestens zwei `recognitionCues`

Beispiel Gerät:

```text
semanticType: smartphone-browser-device
recognitionCues:
- Browser-Chrome / Top-Bar
- Phone-Rahmen / Notch
- sichtbare Display-Fläche
```

Ein neutrales Rechteck reicht für `device-scene` nicht als Hero.

Recognition Cues beschreiben, **woran der Zuschauer das Objekt erkennt**. Sie sind keine Dekoration.

---

## 4. Motion muss sich über die Szene entwickeln

Eine Szene darf nicht nur in den ersten Frames animieren und danach mehrere Sekunden halten.

Planungsregeln:

- mindestens drei meaningful state changes pro Szene
- mindestens zwei Micro-Beats
- Entry, Development und Payoff separat planen
- Payoff normalerweise zwischen 55% und 95% der Szene
- unbegründeter statischer Hold maximal ca. 2,5 Sekunden
- längerer Hold nur als `intentionalStillness` mit konkreter Begründung; auch dann bleibt die Gesamtlänge begrenzt

Stillness ist erlaubt, wenn sie Bedeutung trägt. Sie ist nicht erlaubt, um fehlende visuelle Entwicklung zu kaschieren.

---

## 5. Scene-local Visual Review

V3 sammelte repräsentative globale Frames. V4 prüft zusätzlich jede einzelne Szene lokal.

Standard-Samples pro Szene liegen ungefähr bei:

- 4%
- 22%
- 40%
- 58%
- 76%
- 95%

Sechs Samples halten die blinden Intervalle klein genug, damit mehrsekündige Holds wesentlich schwerer zwischen Prüfframes verschwinden.

Hook zusätzlich:

- Frame 0
- ca. 0,2 s
- ca. 0,5 s
- ca. 1,0 s

Dadurch kann das System erkennen:

- `EMPTY_HOOK_START`
- `HOOK_TOO_STATIC_FIRST_SECOND`
- `NO_VISIBLE_STORY_CHANGE`
- `STATIC_SCENE_HOLD`
- `WASHED_OUT_SCENE`
- `UNDERBUILT_SCENE`
- `HERO_FOOTPRINT_TOO_SMALL`

Der Review nutzt unter anderem:

- Pixel-Differenz zwischen lokalen Samples
- Edge Density
- Kontrast/Luminanzstreuung
- Weißanteil
- Chroma
- räumliche aktive Visual-Zellen (`activeVisualCellRatio`)

---

## 6. Drei getrennte Freigaben

V4 trennt strikt:

```text
TECHNICAL STATUS
AUTOMATED VISUAL STATUS
HUMAN CREATIVE STATUS
```

### Technical status

Prüft Build, TypeScript, Contracts, Remotion-Integration usw.

### Automated Visual status

Prüft maschinenlesbare Risiken aus gerenderten Frames.

### Human Creative status

Prüft tatsächlich:

- ist der Hook stark?
- ist das Hero sofort verständlich?
- fühlt sich die Szene hochwertig an?
- wirkt die Bewegung sinnvoll statt mechanisch?
- ist die Metapher klar?
- ist die Bildwelt abwechslungsreich und kohärent?

**Automated Visual PASS ist niemals automatisch Human Creative PASS.**

---

## 7. Pflichtmanifest

Neue Phase-1-fertige Reels ab Woche 2026-09-28 benötigen:

```text
06-projektdateien/visual-quality-v4.json
```

Beispiel:

```json
{
  "version": 4,
  "compositionId": "KI-Example",
  "fps": 30,
  "sourceQualityContract": "ki/src/reels/example/visualQuality.ts",
  "hook": {
    "sceneId": "scene-01",
    "firstFrameHeroVisible": true,
    "keyMessageByFrame": 12,
    "firstMajorChangeByFrame": 24,
    "heroAreaRatio": 0.34,
    "semanticVisualAnchors": 3,
    "recognitionCues": ["Produkt-Hero", "sichtbare Konsequenz"],
    "contrast": "strong",
    "conflictVisible": true,
    "keyMessageVisible": true,
    "visualVerb": "breaks"
  },
  "scenes": [
    {
      "sceneId": "scene-01",
      "archetype": "hero-impact",
      "startFrame": 0,
      "durationFrames": 150,
      "story": {
        "startState": "Altes Modell steht dominant im Zentrum",
        "visibleChange": "Neues Modell schlägt sichtbar durch den alten Zustand",
        "endState": "Neues Modell und Preisvorteil dominieren das Bild",
        "visualVerb": "breaks"
      },
      "hero": {
        "semanticType": "model-core",
        "meaning": "Das neue Modell ersetzt sichtbar den alten Zustand",
        "screenAreaTarget": 0.36,
        "recognitionCues": [
          {"id": "model-label", "description": "klarer Modellname am Core"},
          {"id": "price-drop", "description": "sichtbarer Preiswechsel als Ergebnis"}
        ]
      },
      "meaningfulStateChanges": 4,
      "microBeats": 3,
      "contrast": "strong",
      "motionPlan": {
        "entry": "Hero ist bereits in Frame 0 sichtbar",
        "development": "Alt-Zustand bricht auf und wird ersetzt",
        "payoff": "Neuer Zustand füllt den Frame",
        "payoffAtProgress": 0.78,
        "maxStaticHoldFrames": 60,
        "intentionalStillness": false
      }
    }
  ],
  "targetScores": {
    "hook": 8.5,
    "semanticClarity": 8.5,
    "storyMotion": 8.5,
    "visualVariety": 8.5,
    "readability": 8.5,
    "overall": 8.5
  }
}
```

---

## 8. Source-Vertrag

Wie bei V3 besitzt jedes V4-Reel einen Source-Vertrag:

```text
ki/src/reels/<slug>/visualQuality.ts
```

Er exportiert klar benannt:

```text
VISUAL_QUALITY_V4
```

und führt aus:

```text
assertVisualQualityV4(...)
```

Der JSON-Vertrag ist Planung/CI-Wahrheit; der Source-Vertrag schützt die ausführbare Composition.

---

## 9. CI und lokale Befehle

Contract-Gate:

```bash
node scripts/check-visual-quality-v4.mjs
```

Scene-local Render-Review für ein Reel:

```bash
node scripts/render-visual-quality-v4-review.mjs --manifest="ki/reels/.../06-projektdateien/visual-quality-v4.json" --fail-on-severe=true
```

PR-CI prüft nur betroffene V4-Reels über:

```bash
node scripts/run-changed-v4-visual-reviews.mjs
```

Die Outputs liegen unter:

```text
05-export/visual-review-v4/
├── contact-sheet-v4.jpg
├── visual-review-v4.json
└── frames/
```

### CI-Infrastrukturfehler nicht mit Codefehler verwechseln

Wenn ein GitHub-Actions-Job bereits vor dem ersten Step endet (`steps: []`) und keine Logs erzeugt, ist das **kein verwertbares Code-Testresultat**.

Dann gilt:

1. einmal neu ausführen oder durch einen sachlich sinnvollen kleinen Commit neu triggern,
2. erst bei tatsächlich gestarteten Steps das Ergebnis als PASS/FAIL bewerten,
3. einen V4-System-PR nicht allein aufgrund eines `steps: []`-Runs mergen,
4. aber einen solchen Infrastrukturfehler auch nicht als Visual-/Code-Failure dokumentieren.

---

## 10. Was V4 konkret verhindern soll

V4 wurde aus realen Review-Fehlern abgeleitet und soll insbesondere verhindern:

1. Hook startet leer und baut sich erst später auf.
2. Großes Objekt ist visuell abstrakt und semantisch nicht erkennbar.
3. Szene animiert kurz und bleibt danach mehrere Sekunden fast unverändert.
4. Helle Szene verliert Hero und Kontrast in viel Weißraum.
5. Eine Metapher wird nur beschriftet statt als Handlung gezeigt.
6. Technische Remotion-Capabilities werden benutzt, aber die Szene erzählt trotzdem nichts.
7. Ein grüner CI-Lauf wird fälschlich als kreative Freigabe interpretiert.

---

## 11. Qualitätsprinzip

> Erst visuelle Handlung, dann semantischer Hero, dann Motion, dann Remotion-Technik.

Nicht:

```text
Capability auswählen → Effekt bauen → Text darüberlegen
```

Sondern:

```text
Bedeutung
→ Startzustand
→ sichtbare Handlung
→ Ergebnis
→ erkennbare Hero-Semantik
→ passende Remotion-Capability
→ scene-local Render-Review
→ Human Creative Review
```

Das ist der verbindliche V4-Weg für neue Reels.
