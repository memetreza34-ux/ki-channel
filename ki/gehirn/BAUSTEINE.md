# 🧰 KI-Kanal — Baustein-Katalog nach Mechanik

Diese Datei ist **kein Satz→Komponente-Router mehr**.

Ein gesprochener Satz darf niemals automatisch zu `Card`, `Table`, `Badge`, `FeatureGrid` oder einer anderen vorhandenen Komponente werden.

## Verbindliche Reihenfolge

```text
Sprecherbedeutung
→ Visual Beat
→ was muss der Zuschauer sehen?
→ Hauptverb / Zustandsänderung
→ Visual Modality
→ Mechanik
→ erst jetzt: passt ein vorhandener Baustein EXAKT?
```

Autoritativ davor:

- `STORY_RETENTION.md`
- `FAKTENQUELLEN.md`
- `REELS.md`
- `VISUAL_STRATEGY.md`

Bausteine leben überwiegend in `@studio/core`; Signaturen stehen in `core/brand-kit/KATALOG.md`.

## Grundregel

> Ein vorhandener Baustein spart Implementierungszeit. Er darf niemals die kreative Entscheidung ersetzen.

`REUSE_EXACT` nur, wenn Mechanik, räumliche Beziehung, Zustandsänderung und Aussage wirklich passen.

Wenn nicht: `NEW_BUILD` oder die in `visual-strategy.md` gewählte andere Modality.

---

## 1. Echte oder abstrahierte Tool-/UI-Zustände

### Vor Auswahl zuerst fragen

Ist die **reale Produktoberfläche oder das echte Ergebnis Teil des Beweises**?

- Ja → `REAL_CAPTURE` prüfen.
- Nein, nur der Mechanismus zählt → Remotion-native UI kann sinnvoll sein.

### Mögliche Bausteine

- `ChatUI`
- `AiThinking`
- `Terminal`
- `GlassCodeBlock`
- `LiveCodeCompile`

### Gut geeignet für

- Prompt → Antwort
- Code → Output
- klaren UI-Zustandswechsel

### Nicht verwenden für

- aktuelle Tool-Oberfläche, wenn deren tatsächliches Verhalten/Design Teil der Aussage ist
- generische „KI arbeitet“-Szene ohne konkrete UI-Bedeutung

---

## 2. Text → Token / Datenfluss

Mögliche Bausteine:

- `TokenStream`
- Nodes/Paths aus der Animation-Library
- custom SVG/Path-Mechanik

Gut geeignet, wenn wirklich sichtbar werden soll:

```text
Text
→ Zerlegung
→ Token/Datenobjekte
→ Weiterverarbeitung
```

Nicht automatisch jeden LLM-Satz als Token-Chips darstellen.

---

## 3. Generierung / Reveal

Mögliche Bausteine:

- `AiCanvasReveal`
- `MaskReveal`
- custom Transform-/Morph-Mechanik

Nur wenn **Entstehung/Transformation selbst** die Aussage trägt.

Ein Reveal ist keine Universaltransition.

---

## 4. Vorher / Nachher

Mögliche Mechaniken:

- `BeforeAfterSlider` — derselbe Gegenstand/Zustand vor und nach Veränderung
- `CompareSplit` — zwei parallele Zustände/Alternativen

Nicht verwechseln:

- Wisch-Reveal ≠ zwei unabhängige Dinge vergleichen
- Vergleich ≠ Rangliste

Wenn ein reales Tool-Ergebnis demonstriert wird, reale Captures/Assets verwenden, falls sie die Wahrheit der Aussage tragen.

---

## 5. Prozess / Reise / Reihenfolge

Bevorzugte sichtbare Verben:

- reist
- durchläuft
- verbindet
- verzweigt
- blockiert
- passiert ein Gate
- kehrt zurück

Mögliche Bausteine:

- Path-/Node-Mechaniken
- `NumberedSteps`, wenn echte nummerierte Schritte erklärt werden
- `Checklist`, wenn tatsächliche Prüfpunkte abgehakt werden
- custom Prozessgrafik

Nicht jeden Ablauf als Reihe von Karten bauen.

---

## 6. Vergleich / Abwägung

Mögliche Bausteine:

- `CompareSplit`
- `ComparisonBars`
- `Balance`

Nur wenn die Aussage wirklich zwei Zustände/Optionen gegenüberstellt.

Kein künstliches „VS“, nur weil zwei Begriffe im Satz vorkommen.

---

## 7. Verifizierte Zahlen und Daten

Mögliche Bausteine:

- `DramaticNumber`
- `BigStat`
- `Counter`
- `PercentRing`
- `StatBar`
- `Gauge`
- `Donut`
- `PiePremium`
- `BarsPremium`
- `GrowthChart`
- `AreaPremium`
- `LabeledAxisChart`
- `Table`
- `Ranking`

### Harte Regel

Solche Bausteine dürfen nur sichtbare Werte tragen, wenn `source-ledger.md` die Zahlen/Rankings stützt oder sie **klar als Illustration** gekennzeichnet sind.

Nicht erlaubt:

- erfundene Prozentwerte als Modellwahrscheinlichkeit
- erfundene Latenz
- unbelegte „10× besser“-Claims
- Rankings ohne Grundlage
- Achsen/Charts ohne sinnvolle Skala/Quelle

Ein Chart wird nicht eingesetzt, nur weil Zahlen vorkommen. Er muss einen Vergleich oder Verlauf besser verständlich machen.

---

## 8. Netzwerke / Beziehungen

Mögliche Bausteine:

- `Constellation`
- `Mindmap`
- custom Nodes/Edges

Nur wenn **Beziehungen zwischen Elementen** die Aussage sind.

Nicht als dekoratives „KI-Netzwerk“ verwenden.

---

## 9. Risiko / Fehler / Grenze

Mögliche Mechaniken:

- `IconStrike` — ein einzelner falscher/entfernter Zustand
- `DontDoInstead` — mehrere echte Gegenüberstellungen
- `Balance` — Trade-off
- Gate/Block/Reject-New-Build

Rot markiert Risiko/Fehler/Grenze, aber Farbe allein erklärt den Fehler nicht.

Die Szene braucht weiterhin eine sichtbare Handlung oder Zustandsänderung.

---

## 10. Dokument / Quelle / Beleg

Dokumente, Dateien und Quellen dürfen bewusst als Karten-/Paper-Objekte erscheinen, weil die Form **semantisch das Objekt selbst** ist.

Sinnvolle Mechaniken:

```text
Quelle erscheint
→ wird gesucht/geöffnet
→ wird verifiziert oder verworfen
```

Keine erfundene real wirkende Quelle als Demonstration. Demo-Quelle sichtbar als Beispiel kennzeichnen.

---

## 11. Schritte / Checkliste

Mögliche Bausteine:

- `NumberedSteps`
- `Checklist`
- `CheckCards`

Nur für tatsächliche Schrittfolge oder Prüfung.

Nicht einsetzen, wenn der Sprecher nur drei lose Informationen aufzählt. In diesem Fall zuerst prüfen, ob das Reel überhaupt zu listenartig geschrieben ist.

---

## 12. Feature-/Gründe-Grid

Mögliche Bausteine:

- `FeatureGrid`
- `CheckCards`

**Sparsam verwenden.**

Ein Grid ist eine sinnvolle Informationsform, wenn mehrere gleichrangige Dinge gleichzeitig verglichen/überblickt werden müssen.

Es ist kein Default für:

- „3 Vorteile“
- „3 Fehler“
- „3 Gründe“

Wenn jeder Punkt eine eigene sichtbare Handlung besitzt, sind individuelle Beats meist stärker.

---

## 13. Typografischer Akzent

Mögliche Bausteine:

- `KineticCenterBuild`
- `BigStat`
- `MaskReveal`
- kurze `Badge`

Nur als kurzer Akzent, wenn Sprache selbst der visuelle Gegenstand ist.

Nicht mehrere Sekunden Sprechertext durch großen Text ersetzen.

---

## 14. Caption

Caption ist **kein normaler Szenenbaustein**.

Die globale Caption folgt:

- `CAPTION_SAFE_POSITION.md`
- `REELS.md`
- realem finalen Audio-Timing

Keine zufällige andere Caption-Animation pro Szene nur für Abwechslung.

Wiedererkennbarkeit und Lesbarkeit sind wichtiger als Effektvariation.

---

## 15. Physische / räumliche Metapher

Wenn ein abstrakter Mechanismus durch eine physische Szene klarer wird:

1. in `visual-strategy.md` entscheiden, ob `REMOTION_NATIVE`, `HYBRID`, `EXTERNAL_STILL_REQUIRED` oder `EXTERNAL_MOTION_REQUIRED`
2. Metapher exakt beschreiben
3. erst dann vorhandene Komponenten prüfen

Mögliche Remotion-native Elemente:

- custom SVG
- Paths/Shapes
- pseudo-3D
- Three.js, wenn echte Tiefe hilft

Wenn Raum, Material oder organische Komplexität extern deutlich stärker sind, keine Code-Lösung erzwingen.

---

## 16. Hintergrund

`LivingBackground`, `ShaderBG`, `FilmGrain` oder andere Hintergründe sind **optional**, nicht „immer“.

Default:

- ruhiger heller Markenraum
- nur so viel Tiefe/Bewegung wie nötig

Ein Hintergrund darf:

- Fokus unterstützen
- Raum/Tiefe geben
- Zustandswechsel subtil verstärken

Er darf nicht:

- permanent Aufmerksamkeit ziehen
- Leerlauf kaschieren
- jede Szene künstlich „lebendig“ machen

---

## 17. Kamera und Übergänge

Mögliche Techniken:

- `WhipIn`
- `ZoomPunch`
- `PushThrough`
- `KenBurns`
- `Dissolve`
- `WaveWipe`
- Remotion-TransitionSeries

**Keine Regel „nie zweimal gleich“.**

Auswahl nur nach Bedeutung:

- Hard Cut = Standard
- Push/Travel = räumliche Fortsetzung
- Morph = derselbe Gegenstand ändert Zustand/Form
- Dissolve = bewusster weicher Zeit-/Zustandswechsel
- Zoom = echter Fokuswechsel

Variation ohne semantischen Grund ist Deko.

---

## 18. News / aktuelle Tools

Zeitdruck ist **kein Grund für schwächere visuelle Qualität**.

Bei News zuerst entscheiden:

- braucht man reales Produkt-Capture?
- gibt es einen klaren Vorher/Nachher-Zustand?
- welche Änderung ist für Zuschauer wirklich relevant?

Nicht automatisch `ChatUI + Badge + Table` verwenden.

Bei aktueller Produktoberfläche/Feature-Demo ist `REAL_CAPTURE` oft ehrlicher und schneller als künstlicher UI-Nachbau.

---

## 19. Hook

Es gibt **keinen Hook-Baustein als Default**.

Der Hook kommt aus `STORY_RETENTION.md` und kann visuell sein als:

- unerwartetes Ergebnis
- Konflikt
- echte Demonstration
- sichtbarer Fehler
- Vorher/Nachher
- konkrete Frage mit sofort beginnender Mechanik

`BigStat`, Text oder MaskReveal nur dann, wenn genau das der stärkste Hook ist.

---

## 20. Neue Bausteine

Neue shared Komponente nur bauen, wenn:

- sie einen wiederkehrenden **semantischen Mechanismus** abbildet
- mindestens mehrere plausible zukünftige Einsätze existieren
- sie nicht nur die Optik eines einzelnen Reels generalisiert

Shared → `core/brand-kit` und `KATALOG.md` aktualisieren.

Reel-spezifische Mechanik → lokal als `NEW_BUILD` belassen.

## Schlussregel

```text
Vorhandener Baustein vorhanden ≠ Baustein verwenden.

Exact semantic fit
+ passende Modality
+ passende Zustandsänderung
= Reuse erlaubt.
```

Wenn das Ergebnis trotz korrektem Code wie eine animierte Präsentation wirkt, zurück zu `VISUAL_STRATEGY.md` statt weitere Cards oder Transitions hinzuzufügen.
