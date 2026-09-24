# Visual Strategy — Remotion-first, Wahrheit vor Nachbau

Diese Datei entscheidet, **welche visuelle Form einen Sprecher-Beat am besten erklärt** und wie sie anschließend umgesetzt wird.

Sie steht vor Library-Auswahl, konkreter Remotion-Implementierung und externen Medienentscheidungen.

Zusätzlich verbindlich: `REMOTION_VISUAL_SYSTEM.md`.

## Grundregel

> Zuerst: **Was muss der Zuschauer sehen, damit die Aussage sofort verständlich wird?**  
> Danach: **Wie bauen wir das hochwertig in Remotion?**

Für neue Short-Form-Reels ist Remotion die **universelle finale Composition und Render-Engine**.

Das bedeutet:

- eigene Visuals möglichst nativ mit React/SVG/CSS/Shapes/Paths/Three bauen
- reale Screenshots/Captures nur als echte Beweisquelle in Remotion einbetten
- keine externe Bild-/Video-Generierung als normalen Standardweg
- finale Szene, Motion, Caption und Layout immer in Remotion

## 1. Zwei Ebenen unterscheiden

### A. Beweis-/Quellenebene

Was braucht die Aussage als Wahrheitsträger?

- kein reales Medium nötig
- echter Screenshot
- echter Screen-/Produkt-Capture
- echtes offizielles Markenasset
- ausnahmsweise externes Still/Motion-Asset

### B. Ausführungsebene

Die finale Ausführung ist bei neuen Reels **immer Remotion**.

Auch reale Captures werden in Remotion:

- geschnitten
- gerahmt
- gezoomt
- maskiert
- beschriftet
- hervorgehoben
- mit anderen Ebenen kombiniert

## 2. Visual-Modality-Router

Für jeden bedeutungstragenden Beat eine primäre Strategie wählen.

### `REMOTION_NATIVE` — bevorzugter Standard

Verwenden, wenn die Aussage ohne echten Produktbeweis sauber gebaut werden kann.

Das umfasst ausdrücklich:

- SVG-/CSS-Illustrationen
- eigene Vector-Icons
- Browser-/App-Mockups
- Chat-Oberflächen
- Code-Editoren
- Terminal
- GitHub-/Repo-Darstellungen
- Diagramme und Datenvisualisierung
- Rankings und Vergleiche
- Geräte und kleine Umgebungen
- pseudo-fotografische Flat-/2.5D-Szenen
- Masken, Clipping, Perspektive und Layer
- Objektzerlegung, Morphs, Fokusfahrten und Parallax
- Prozessketten, Tokens, Nodes, Pfade und Netzwerke
- @remotion/shapes und @remotion/paths
- React Three Fiber, wenn echte Tiefe die Erklärung verbessert

Wenn ein konkretes Objekt, eine UI-Situation oder ein technischer Ablauf die Erklärung trägt, wird **zuerst ein nativer Remotion-Build geprüft**.

### `REAL_CAPTURE`

Verwenden, wenn das **tatsächliche Produktverhalten selbst der Beweis** ist.

Beispiele:

- exakte neue Funktion
- reales Modell-Ergebnis
- echte aktuelle UI
- reale Option/Schaltfläche
- tatsächlicher Workflow

Der Capture ersetzt nicht Remotion; er wird als Medienebene in die Remotion-Composition eingebettet.

### `HYBRID`

Verwenden, wenn echter Beweis + Remotion-Erklärung zusammen stärker sind.

Beispiele:

- echter Screenshot + Fokusrahmen
- echter Output + A/B-Vergleich
- echter GitHub-Stand + animierter Dateibaum/Callouts
- echter Benchmark + eigene erklärende Achse

### `EXTERNAL_STILL_REQUIRED`

Nur Ausnahme.

Nur wenn ein statisches Motiv nativ deutlich schlechter wäre und für die Aussage wirklich nötig ist.

### `EXTERNAL_MOTION_REQUIRED`

Nur Ausnahme.

Nur wenn komplexe physische Bewegung selbst Bedeutungsträger ist und Remotion-native Umsetzung unverhältnismäßig oder sichtbar schlechter wäre.

Auch diese Medien werden final in Remotion komponiert.

## 3. Standardentscheidung für diesen Kanal

Für neue Current-AI-Reels gilt grundsätzlich:

```text
REMOTION_NATIVE
→ wenn Wahrheit keinen echten Capture verlangt

REAL_CAPTURE / HYBRID
→ wenn reales Produktverhalten Beweiswert hat

EXTERNAL_STILL / EXTERNAL_MOTION
→ nur begründete Ausnahme
```

Damit bleibt der Kanal **code-first und Remotion-first**, ohne echte Produktoberflächen zu fälschen.

## 4. Was Remotion selbst bauen soll

Nicht automatisch als externes Bild planen:

- Laptop
- Smartphone
- Browser
- Chat-App
- Terminal
- Code-Editor
- Dokument/PDF
- GitHub-Repository
- Datei-/Ordnerstruktur
- Cloud/Server/GPU/Chip
- Datenfluss
- Agenten-Workflow
- KI-Modell als abstraktes System
- Ranking
- Vergleich
- Preis-/Leistungsübersicht
- Vorher/Nachher
- Mikrofon/Audio
- Bild-/Video-Workflow
- Modellkarten
- Timeline

Diese Dinge werden bevorzugt als eigene Remotion-Illustration gebaut.

## 5. UI-Nachbau vs. echter Screenshot

Ein Remotion-UI-Nachbau ist eine **Illustration**.

Er darf verwendet werden, um:

- einen Workflow zu erklären
- eine generische Chat-Interaktion zu zeigen
- Code/Terminal logisch darzustellen
- eine Repo-Struktur zu visualisieren
- einen Vergleich übersichtlich zu machen

Er darf **nicht** als echter Beweis für aktuelle Produktdetails ausgegeben werden.

Wenn die Aussage lautet:

- „So sieht es aktuell aus“
- „Diese Option gibt es jetzt“
- „Dieses Modell erzeugte genau diesen Output“

→ echten Capture verwenden.

## 6. Logos und Icons

### Icons

Bevorzugt direkt als eigene SVG-/Vector-Pfade.

- keine Emoji als finales Haupticon
- klare Silhouette
- konsistente Strichstärke
- smartphone-lesbar
- semantisch eindeutig

### Markenlogos

Wenn ein echtes offizielles Logo-Asset vorhanden und redaktionell nutzbar ist, darf es in Remotion eingebettet werden.

Kein komplexes Markenlogo so nachzeichnen, dass es fälschlich wie das offizielle Original wirkt.

Wenn kein echtes Asset vorliegt:

- Markenname als Text
- eigener neutraler Badge
- Kategorie-Icon

## 7. Code- und GitHub-Szenen

Remotion darf native Tech-Szenen bauen:

- Code-Editor-Chrome
- Zeilennummern
- Syntaxfarben
- Cursor
- Diff vorher/nachher
- Terminal-Ausgabe
- Dateibaum
- Build-/Testzustände
- Repo-Header
- Release-Badge
- Commit-/Version-Timeline
- README-Auszug
- Architekturfluss

Echte GitHub-Werte wie Stars, Releases oder Versionsnummern nur mit Grounding verwenden.

## 8. Rankings und Vergleiche

Nicht nur Karten nebeneinander stellen.

Bevorzugte Remotion-Mechaniken:

- gemeinsame Bewertungsachse
- Ranking-Leiter
- Head-to-head
- A/B-Output
- animierte Kategorie-Gewinner
- Preis-/Leistungsachse
- Stärken-/Schwächen-Matrix
- Morph zwischen zwei Zuständen

Rankings brauchen klare Kriterien und Datumsstand.

## 9. Bildartige Remotion-Szenen

Remotion darf wie ein Illustrationssystem eingesetzt werden.

Geeignet:

- große Hero-Objekte
- 2.5D
- Parallax
- Layering
- weiche Schatten
- Perspektive
- Masken
- X-Ray/Cutaway
- Exploded View
- Morphs
- räumliche Recomposition
- Three bei echter Tiefenlogik

Ziel: eigene animierte Tech-Bildwelt statt „PowerPoint mit Cards“.

## 10. Karten-/Boxen-Regel

Karte, Pill, Panel oder Rounded Rectangle nur, wenn sie semantisch wirklich ein Objekt darstellt:

- UI-Element
- Dokument
- Datensatz
- Nachricht
- Datei
- Token/Chip

Nicht als Standardübersetzung für abstrakte Aussagen.

Schwach:

```text
Aussage → weiße Karte → Text → nächste Karte
```

Stärker:

```text
Aussage → Objekt/Illustration/Beziehung → sichtbare Handlung → veränderter Endzustand
```

## 11. Diversity Contract

Ein Reel soll zusammengehören, aber nicht in einer einzigen Grammatik feststecken.

Richtwerte:

- nicht mehr als zwei aufeinanderfolgende Beats mit derselben Hauptgrammatik
- karten-/panelbasierte Hauptbeats normalerweise höchstens etwa ein Viertel
- mindestens die Hälfte der Beats objekt-, pfad-, form-, raum-, illustration- oder prozessbasiert
- mindestens ein klarer Hero-/Memorable-Moment
- bei Tool-/News-Reels mindestens eine echte visuelle Veränderung oder Demo, nicht nur Logos/Text

Mögliche Mechanikfamilien:

- Objekt/physische Metapher
- Remotion-Illustration/Umgebung
- Prozess/Pfad
- Transformation/Morph
- Vergleich
- echte UI/Capture
- Dokument/Quelle
- räumliche 2.5D-/3D-Szene
- Diagramm/Daten
- Code/Terminal
- GitHub/Repo
- Typografie-Akzent

## 12. Jede Szene braucht eine Verb-Idee

Gut:

- zerfällt
- verbindet
- wählt
- blockiert
- sortiert
- prüft
- vergleicht
- öffnet
- sucht
- verwirft
- verwandelt
- fokussiert
- setzt sich zusammen
- klappt auf
- kompiliert
- startet
- rankt
- diffed

Schwach:

- zeigt
- erscheint
- steht da
- blendet Text ein

## 13. Motion-Dichte

Planungsrichtwert:

- alle 1,5–3 Sekunden eine sinnvolle Zustandsänderung
- 2–4 Micro-Beats pro längerer Szene
- statischer Hold über 2,5 Sekunden nur mit Begründung
- zentrale Motion-Cues später an echte Voiceover-Wörter koppeln

## 14. Visual Beat Sheet

`06-projektdateien/visual-strategy.md` dokumentiert pro Beat:

```text
Beat-ID
Sprecherstelle
Bedeutung
Zuschauer muss sehen
Hauptverb
Startzustand
sichtbare Veränderung
Endzustand
Modality
Warum diese Modality
Remotion-Build-Idee
Mechanikfamilie
Hero beat: JA/NEIN
benötigter Zuschauertext
reale Quelle/Capture, falls Beweis nötig
```

Erst danach folgt `animation-plan.md`.

## 15. Anti-Dekoration

Nicht als Problemlösung akzeptieren:

- mehr Glow
- mehr Partikel
- zufällige Kamerafahrt
- unnötige 3D-Tiefe
- permanent bewegte Hintergründe
- Übergang zwischen jedem Beat
- Text groß machen, wenn eigentlich eine Erklärung fehlt

Motion dient Fokus, Ursache/Wirkung oder Zustandsänderung.

## 16. Production-Gate

Vor Implementierung muss `visual-strategy.md` zeigen:

- was nativ in Remotion gebaut wird
- welche Icons/Illustrationen als SVG/React entstehen
- welche UI bewusst nur ein Nachbau ist
- welche reale UI/Capture als Beweis nötig ist
- warum ein externes Still/Motion-Asset wirklich unvermeidbar wäre
- wo der Hero-Moment liegt
- wie Kartenlastigkeit vermieden wird
- wie die Szene über ihre gesamte Dauer visuell weiterentwickelt wird

Wenn ein Beat nur deshalb ein externes Bild verlangt, weil die Remotion-Idee noch nicht ausgearbeitet wurde: **zurück in die Planung**.

Wenn die Strategie überwiegend aus „Card + Label“ besteht: **zurück in die Planung**.
