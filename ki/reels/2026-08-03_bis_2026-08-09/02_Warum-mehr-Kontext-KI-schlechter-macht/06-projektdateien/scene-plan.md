# Scene Plan — Antigravity Context Overload

Gesamtdauer: 30 Sekunden · 1080 × 1920 · 30 FPS · 5 Szenen × 180 Frames.

## Verbindliche Text-Hierarchie

- Der Sprechertext bleibt wortgetreu und wird unten als Caption abgedeckt.
- Oben steht pro Szene nur eine kurze Zuschauer-Überschrift.
- Kein zusätzlicher Sprecher-Satz direkt unter der Überschrift.
- Animationstext erklärt Objekte/Zustände und kopiert den Sprechertext nicht Satz für Satz.
- `goal` ist intern und darf niemals als sichtbare Überschrift verwendet werden.

## Szene 1 — Kontext überladen

- Frames: 0–179
- Zuschauer-Überschrift: **Wenn mehr nicht mehr hilft**
- Animation: `context-window-context-window-train-v1`
- Sprechertext: „Du gibst einer KI mehr Kontext – und die Antwort wird trotzdem schlechter? Genau das kann passieren.“
- Visuelle Labels: `KONTEXT`, `Frage`, `Kerninfo`, `Nebeninfo`, `Beispiel`, `Verlauf`, `Extra`, `FOKUS`.
- Startzustand: Mehrere Informationen bewegen sich in ein begrenztes Kontextfenster.
- Sichtbare Veränderung: Neue Inhalte füllen das Fenster; ältere Inhalte werden nach hinten gedrängt.
- Endzustand: Das Fenster wirkt voll, die Informationskonkurrenz ist klar sichtbar.
- Hauptaussage: Mehr Input kann die Verarbeitung unübersichtlicher machen.
- Keine erfundene Kapazitätszahl anzeigen.

## Szene 2 — Relevanz ist unterschiedlich stark

- Frames: 180–359
- Zuschauer-Überschrift: **Verbindungen entscheiden**
- Animation: `relationship-network-dependency-bridge-builder-v1`
- Sprechertext: „Im Kontext sind nicht alle Informationen gleich wichtig. Starke Beziehungen tragen die Antwort, schwache Details sollten weniger Gewicht bekommen.“
- Visuelle Labels: `Frage`, `Kerninfo`, `Antwort`, `Nebenpfad`; qualitative Stärke statt erfundener Prozente.
- Startzustand: Mehrere beschriftete Informationsknoten stehen zunächst gleichwertig nebeneinander.
- Sichtbare Veränderung: Tragende Beziehungen werden stärker, schwache Verbindungen verlieren visuelles Gewicht.
- Endzustand: Dominante und schwache Beziehungen bleiben klar unterscheidbar.
- Hauptaussage: Kontextqualität hängt von Relevanz ab, nicht nur von Menge.
- Keine Prozentwerte für Beziehungsstärken erfinden.

## Szene 3 — Nur passende Quellen holen

- Frames: 360–539
- Zuschauer-Überschrift: **Nicht alles muss mit**
- Animation: `retrieval-search-knowledge-magnet-v1`
- Sprechertext: „Gute Systeme laden deshalb nicht alles. Sie holen gezielt nur Quellen, die zur aktuellen Frage passen.“
- Visuelle Labels: `AKTUELLE FRAGE`, `Was passt hier?`, `Quelle A` bis `Quelle F`, `ausgewählt`.
- Startzustand: Mehrere mögliche Quellen liegen außerhalb des aktiven Kontexts.
- Sichtbare Veränderung: Nur passende Quellen werden sichtbar zum aktiven Kontext gezogen.
- Endzustand: Relevante Quellen bleiben ausgewählt; unpassende Quellen bleiben draußen.
- Hauptaussage: Retrieval reduziert unnötige Kontextmenge.
- Keine exakte Quellenanzahl behaupten, wenn sie nicht gesprochen wird.

## Szene 4 — Verdichten statt überfüllen

- Frames: 540–719
- Zuschauer-Überschrift: **Signal bleibt. Rauschen geht.**
- Animation: `input-output-funnel-compression-output-v1`
- Sprechertext: „Dann fliegen unpassende Informationen raus. Relevante Fakten bleiben übrig und werden zu einem klaren Kern verdichtet.“
- Visuelle Labels: `Kernfakt`, `Nebeninfo`, `Passend`, `Unpassend`, `Kerninfo`, `Ballast`, `KERN`, `Bereinigter Kern`.
- Startzustand: Mehrere Informationsstücke gehen in denselben Prozess.
- Sichtbare Veränderung: Unpassende Inhalte werden ausgeschleust; relevante Inhalte konvergieren.
- Endzustand: Ein kompakter, lesbarer Informationskern bleibt bestehen.
- Hauptaussage: Gute Kontextverarbeitung filtert und verdichtet.
- Keine künstlichen Zähler für verworfene oder verbleibende Quellen anzeigen.

## Szene 5 — Antwort erst nach Auswahl

- Frames: 720–899
- Zuschauer-Überschrift: **Qualität vor Menge**
- Animation: `generation-answer-loom-v1`
- Sprechertext: „Mehr Kontext ist nicht automatisch besser. Besser ist: auswählen, verdichten und erst dann die Antwort erzeugen.“
- Visuelle Labels: `Frage`, `Auswahl`, `Verdichtung`, `Ziel`, `Kern`, `Antwort`, `ERGEBNIS`, `Klare Antwort`.
- Startzustand: Der verdichtete Informationskern wird als Grundlage sichtbar.
- Sichtbare Veränderung: Daraus entsteht die Antwort schrittweise.
- Endzustand: Eine kurze Ergebnisdarstellung bleibt lesbar stehen.
- Hauptaussage: Relevanter, verdichteter Kontext ist wichtiger als maximale Menge.
- Keine Modellwahrscheinlichkeit oder Tokenzahl erfinden.

## Übergänge

- Harte Schnitte sind Standard.
- Übergänge nur dann weich verbinden, wenn ein Objekt semantisch weitergeführt werden kann.
- Kein generischer Zoom als Hauptbewegung.
- Jede Szene benötigt eine erkennbare Zustandsänderung.
