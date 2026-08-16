# Remotion-native Visuals — dauerhafte Reel-Regel

Diese Regel gilt ab sofort für die Planung **jedes neuen Reels**.

Zusätzlich verbindlich: `REMOTION_NATIVE_VISUALS_MAXIMUM.md`. Diese verschärfte Regel bedeutet, dass nicht nur UI und Grafiken, sondern möglichst auch illustrative Bildwelten, Cover, Mockups, Objekte und stilisierte pseudo-3D-Szenen zuerst direkt in Remotion gebaut werden.

## Prinzip

**Alles, was hochwertig mit React, SVG, CSS, Canvas, WebGL und Remotion darstellbar ist, wird bevorzugt direkt in Remotion gebaut.**

Nicht zuerst nach einem Bild suchen oder ein Bild generieren, wenn derselbe Inhalt sauber als kontrollierbare Code-Komponente oder stilisierte Code-Illustration gebaut werden kann.

Der Standard ist nicht mehr nur „UI in Remotion“, sondern **„so viel vom gesamten sichtbaren Reel wie technisch und gestalterisch sinnvoll in Remotion“**.

## Standardmäßig Remotion-native bauen

- Icons und Symbole
- Browser-, App-, Smartphone- und Desktop-Oberflächen
- Buttons, Inputs, Cards, Tabs, Dialoge und Menüs
- Code-/Terminal-Fenster und Dateibäume
- Charts, Diagramme, Prozessketten und Timelines
- Pfeile, Linien, Connectoren, Nodes und Statuspunkte
- Git-/GitHub-Mechaniken wie Commits, Branches, Pull Requests und Merge-Verläufe
- Badges, Labels, Zahlen, Fortschritt, Checks und Fehlermarker
- abstrakte technische Formen und einfache 2D-/2.5D-Objekte
- Before/After-, Ursache/Wirkung- und Zustandswechsel
- illustrative Hero-Motive
- stilisierte Cover-Kompositionen
- Geräte-, Ordner-, Dokument-, Cloud-, Server- und Datenobjekte
- stilisierte Produktdarstellungen ohne zwingende Fotorealistik
- pseudo-3D über Layering, CSS-Transforms, SVG, Schatten und Gradients
- visuelle Metaphern wie Wege, Türen, Trichter, Schichten, Netzwerke, Waagen und Container
- einfache stilisierte Räume, Schreibtische, Bühnen und technische Umgebungen
- Licht-, Tiefen-, Schatten-, Glas- und Materialillusionen, soweit sauber in Code umsetzbar

## Bilder nur als letzte Option

Bild-KI oder externe Assets nur verwenden, wenn `REMOTION_NATIVE` trotz ernsthaftem Designversuch klar unterlegen wäre und mindestens einer dieser Punkte zutrifft:

- echte Fotorealistik ist Teil der Aussage
- komplexe reale/organische Szene
- reale Person/Hände sind inhaltlich unverzichtbar
- ein konkretes reales Produkt muss exakt dargestellt werden
- sehr komplexe Materialien/Naturdetails sind zentral
- komplexe 3D-Umgebung wäre in Remotion unverhältnismäßig teuer und qualitativ klar schlechter

Vor einem Bild muss ausdrücklich geprüft werden, ob eine **stilisierte Code-Illustration** die Aussage nicht klarer und konsistenter vermitteln kann.

Dann möglichst als **HYBRID** arbeiten: nur der unvermeidbare reale/komplexe Motivteil als Bild, Remotion für alle präzisen Informationsschichten.

## Cover ebenfalls Remotion-first

Ein Cover ist nicht automatisch ein Bild-KI-Asset.

Wenn sich die Hook mit großen Formen, Device-/UI-Mockups, SVG-Illustration, Before/After, pseudo-3D, Typografie, Schatten und kontrollierter Komposition sauber darstellen lässt, wird das Cover ebenfalls Remotion-native gebaut.

Bild-Cover nur, wenn echte Fotografie, ein reales Produkt oder eine komplexe organische Szene tatsächlich notwendig ist.

## Nie in ein generiertes Bild backen, wenn Remotion es übernehmen kann

- Überschriften
- Untertitel
- UI-Text
- Zahlen
- Code
- Buttons
- Pfeile
- Diagramme
- Labels
- Statusanzeigen
- animierte Fokuszustände
- Geräte-/Browserrahmen
- einfache Symbole
- Before/After-Trennungen
- Prozesslinien und Zustandswechsel

## Visual-Beat-Entscheidung

Jeder Visual Beat bekommt neben `NEW_BUILD` / `REUSE_EXACT` eine Medium-Entscheidung:

```text
REMOTION_NATIVE
IMAGE_REQUIRED
HYBRID
```

`REMOTION_NATIVE` ist der Standard und soll aktiv maximal ausgereizt werden.

`IMAGE_REQUIRED` ist eine seltene Ausnahme und braucht eine konkrete Begründung, warum auch eine stilisierte React-/SVG-/CSS-/Canvas-/WebGL-Lösung die Aussage sichtbar schlechter darstellen würde.

`HYBRID` bedeutet: nur der wirklich notwendige externe Motivanteil ist Bild; alle kontrollierbaren Ebenen bleiben Code.

## Qualitätsziel

Der Vorteil von Remotion-native Visuals soll aktiv genutzt werden:

- exakt zum Sprecher animieren
- Zustände framegenau verändern
- Elemente gezielt hervorheben
- Farben/Größen/Positionen sauber im Brand halten
- jederzeit nachträglich korrigierbar
- keine zufälligen Bild-KI-Fehler in UI oder Schrift
- konsistenter Look über das komplette Reel
- Code-Illustrationen mit echter Tiefenwirkung, Schatten und visueller Hierarchie statt Präsentationsfolien-Look

Wenn ein Remotion-Visual zu flach oder technisch wirkt, wird zuerst **Design, Tiefe, Objektgröße, Perspektive, Layering und Motion verbessert**. Nicht vorschnell auf Bild-KI ausweichen.

Kurz:

> **Versuche wirklich alles Machbare zuerst direkt in Remotion zu bauen — Symbole, UI, Grafiken, Illustrationen, Mockups, Cover und stilisierte Bildwelten. Externe Bilder nur, wenn sie objektiv nötig oder deutlich besser sind.**
