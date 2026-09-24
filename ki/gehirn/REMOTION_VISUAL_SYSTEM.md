# Remotion Visual System — 100% Composition Policy

Diese Datei definiert, wie der KI-Kanal Remotion als vollständiges visuelles Produktionssystem nutzt.

## Kernregel

> **Jeder finale Reel-Frame wird in Remotion komponiert und gerendert.**

Remotion ist nicht nur Animationssoftware am Ende der Pipeline. Es ist die visuelle Hauptbühne für:

- Illustrationen
- Icons
- Logos/Badges
- UI-Nachbauten
- Browser-/App-Fenster
- Code-Szenen
- Diagramme
- Rankings
- Vergleiche
- Datenvisualisierung
- Geräte-/Produkt-Mockups
- 2D/2.5D-Szenen
- räumliche Layer
- Screenshots/Captures als Beweis-Layer
- Captions
- Motion
- finale Komposition

## Was „100 % Remotion“ bedeutet

`100 % Remotion` bedeutet:

1. Jede finale Szene existiert als Remotion-Composition.
2. Jede Bewegung ist framegenau über Remotion gesteuert.
3. Eigene erklärende Visuals werden bevorzugt direkt mit React + SVG + CSS + Shapes + Paths + optional Three gebaut.
4. Reale Screenshots/Captures werden nur als echte Quellenebene in die Remotion-Composition eingebettet.
5. Externe Medien ersetzen nicht die eigentliche Komposition.
6. Kein externer Videoeditor ist nötig, um die visuelle Hauptstory zusammenzubauen.

Das bedeutet **nicht**, dass reale Beweise erfunden werden dürfen. Ein nachgebautes UI ist eine Illustration und darf nicht als realer Screenshot ausgegeben werden.

## Standard für neue Current-AI-Reels

Für normale Reels gilt diese Reihenfolge:

```text
Sprecherbedeutung
→ sichtbare Idee
→ Remotion-native Illustration/UI/Objekt
→ Motion-Choreografie
→ optional echte Beweisquelle einbetten
→ Caption
→ finaler Remotion-Render
```

### Bevorzugte Produktionsarten

1. `REMOTION_NATIVE`
   - Standard für konstruierte Visuals.
   - React, SVG, CSS, @remotion/shapes, @remotion/paths, Masken, Layer, 2.5D, Three.

2. `REAL_CAPTURE`
   - Nur wenn tatsächliches Produktverhalten selbst eine Behauptung belegt.
   - Capture bleibt echtes Quellenmaterial, wird aber in Remotion geschnitten, gerahmt, hervorgehoben und animiert.

3. `HYBRID`
   - Echter Screenshot/Capture + Remotion-Overlays, Fokus, Callouts, Masken oder Vergleichsschichten.

4. `EXTERNAL_STILL_REQUIRED` / `EXTERNAL_MOTION_REQUIRED`
   - Ausnahme, nicht Standard.
   - Nur wenn die Aussage nativ deutlich schlechter oder nicht sinnvoll darstellbar wäre.
   - Muss in `visual-strategy.md` ausdrücklich begründet werden.
   - Auch dann bleibt Remotion die finale Composition.

## Kein Bildgenerator als Standard

Für diesen Kanal gilt bei neuen Short-Form-Reels:

> **Code-build first.**

Bevor ein extern generiertes Bild oder Video geplant wird, muss geprüft werden, ob Remotion die Aussage hochwertig selbst bauen kann.

Typische Dinge, die nicht mehr automatisch ein externes Bild brauchen:

- Laptop auf Schreibtisch
- Smartphone
- Browserfenster
- Chat-App
- KI-Modell als abstraktes System
- Server/GPU/Cloud
- GitHub-Repository
- Terminal
- Code-Editor
- Dokument/PDF
- Kamera/Bild
- Mikrofon/Audio
- Modellvergleich
- Rangliste
- Preisvergleich
- Vorher/Nachher
- Datenfluss
- Datei-/Ordnerstruktur
- Agenten-Workflow

## Bildartige Remotion-Szenen

Remotion darf Szenen bauen, die wie eigenständige Illustrationen wirken.

Mögliche Techniken:

- SVG-Flächen und eigene Pfade
- CSS-Gradients
- Layering
- weiche Schatten
- Masken und Clip Paths
- Perspective / rotateX / rotateY
- Parallax
- Depth Blur
- pseudo-3D
- React Three Fiber, wenn echte Tiefe nötig ist
- große Hero-Objekte statt kleiner Karten
- gezielte Kamera-Pushes
- X-Ray-/Cutaway-Looks
- Exploded Views
- Morphs und Recomposition

Die Szene darf hochwertig und bildhaft sein, aber keine echte Aufnahme vortäuschen.

## Icons

Icons werden bevorzugt direkt als SVG/Vector gebaut.

Regeln:

- keine Emoji als finale Haupticons
- konsistente Strichstärke
- einfache Silhouette
- smartphone-lesbar
- semantisch eindeutig
- Animation über Path-Reveal, Mask, Scale, Morph oder Layer statt beliebigem Bounce

## Logos und Marken

### Offizielles Logo verfügbar

Wenn ein offizielles Logo/Brand-Asset für redaktionelle Darstellung rechtmäßig verfügbar und als echtes Asset vorhanden ist, darf es in Remotion eingebettet werden.

### Kein offizielles Asset vorhanden

Nicht versuchen, ein komplexes Markenlogo so nachzuzeichnen, dass es als offizielles Original wirkt.

Stattdessen:

- neutraler Textname
- eigener Modell-/Tool-Badge
- generisches Kategorie-Icon

Ein stilisierter Markenhinweis darf nicht mit einem offiziellen Logo verwechselt werden.

## UI-Nachbauten

Remotion darf Interfaces nachbauen, wenn das Ziel **Erklärung** ist.

Geeignet:

- vereinfachtes Chatfenster
- generischer Code-Editor
- generisches Terminal
- generische GitHub-artige Repo-Struktur
- vereinfachte Modell-Auswahl
- Ranking-/Benchmark-Ansicht

Kennzeichnung/Truth-Regel:

- Nachbau nie als echten Screenshot ausgeben.
- Wenn exakte reale UI/Feature-Verfügbarkeit eine Behauptung belegt, echten Capture verwenden.
- Keine erfundenen Preise, Buttons, Modellnamen oder Resultate als reales Produktverhalten darstellen.

## Code-Szenen

Code wird als echte visuelle Mechanik behandelt, nicht nur als Textkarte.

Mögliche Bausteine:

- Editor-Chrome
- Zeilennummern
- Syntaxfarben
- Cursor
- Code-Reveal
- Diff vorher/nachher
- Terminal-Ausgabe
- Dateibaum
- Build-/Testzustand
- Fehler → Fix → Erfolg

Nur so viel Code zeigen, wie auf dem Smartphone lesbar und für die Aussage nötig ist.

## GitHub-Szenen

GitHub-/Open-Source-Reels sollen möglichst nicht aus Screenshot-Slides bestehen.

Remotion kann nativ bauen:

- Repo-Header
- Stars/Forks nur mit geerdeten echten Werten
- Dateibaum
- README-Auszug
- Release-Badge
- Commit-/Version-Timeline
- Terminal-Installation
- Demo-Output
- Architekturfluss

Wenn ein echter Repo-Screenshot Beweiswert hat, darf er eingebettet werden.

## Vergleiche und Rankings

Remotion-native bevorzugt:

- gemeinsame Bewertungsachse
- animierte Score-Zeilen
- Head-to-head
- Kategorie-Gewinner
- Stärken-/Schwächen-Matrix
- Preis-/Leistungsachse
- Ergebnis-A/B
- Ranking-Leiter

Rankings brauchen echte Kriterien und aktuellen Datumsstand; Animation darf keine Genauigkeit vortäuschen, die nicht aus den Quellen kommt.

## 2.5D und Three

Three/3D ist erlaubt, wenn räumliche Tiefe etwas erklärt.

Geeignet:

- Modellschichten
- Daten-/Kontext-Korridor
- Gerät/Chip
- Server-Rack
- Netzwerk
- räumliches Repository-/Dateisystem

Nicht verwenden, nur weil 3D spektakulärer wirkt.

## Real-Capture-Regel

Ein echter Capture bleibt erforderlich, wenn die Aussage lautet oder impliziert:

- „So sieht die Funktion aktuell aus.“
- „Das Tool macht tatsächlich genau das.“
- „Hier ist das reale Ergebnis.“
- „Diese Option/Schaltfläche existiert aktuell.“
- „Dieses Modell erzeugte diesen Output.“

Dann gilt:

```text
REAL CAPTURE
→ in Remotion importieren
→ relevante Stelle fokussieren
→ Overlays/Zoom/Masken/Labels in Remotion
→ Wahrheit nicht durch Nachbau ersetzen
```

## Visuelle Qualitätsregeln

Auch bei 100 % Remotion verboten:

- Card + Text als Standard für jeden Beat
- drei fast identische Panels hintereinander
- zufällige Partikel
- Glow als Ersatz für Gestaltung
- generischer Cyberpunk
- permanente Kamerafahrt ohne Erklärfunktion
- unlesbarer Mini-Code
- falsche UI als scheinbar realer Beweis
- gefälschte Logos oder Markenassets

## Zielbild

Der Zuschauer soll nicht denken:

> „Das ist ein PowerPoint-Video.“

Sondern:

> „Das sieht wie ein eigener animierter Tech-Kanal aus.“

Dafür werden große Hero-Visuals, Objekte, Pfade, räumliche Ebenen, UI-Mechaniken und Transformationen genutzt.

## Produktions-Gate

Vor Freigabe der Visual Strategy muss beantwortet sein:

- Was wird nativ in Remotion gebaut?
- Welche Illustrationen/Icons werden als SVG/React gebaut?
- Welche UI ist bewusst ein Nachbau?
- Welche reale UI/Capture ist als Beweis nötig?
- Welche externen Medien sind wirklich unvermeidbar?
- Wie bleibt jede Szene auch ohne externe Bildgenerierung visuell stark?
- Wo liegt der Hero-Moment?

Wenn ein Beat nur deshalb externes Bildmaterial verlangt, weil die Remotion-Idee noch nicht ausgearbeitet wurde: **zurück in die Visual Strategy**.
