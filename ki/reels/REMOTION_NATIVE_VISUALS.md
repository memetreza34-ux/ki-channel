# Remotion-native Visuals — dauerhafte Reel-Regel

Diese Regel gilt ab sofort für die Planung **jedes neuen Reels**.

## Prinzip

**Symbole, UI und erklärende Grafiken werden bevorzugt direkt in Remotion nachgebaut.**

Nicht zuerst nach einem Bild suchen oder ein Bild generieren, wenn derselbe Inhalt sauber als kontrollierbare React-/SVG-/CSS-Komponente gebaut werden kann.

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

## Bilder nur bei echtem Mehrwert

Bild-KI oder externe Assets nur verwenden, wenn mindestens einer dieser Punkte zutrifft:

- fotografischer oder cinematic Look ist selbst Teil der Aussage
- komplexe reale/organische Szene
- aufwendige physische Materialien oder Produkte
- komplexe 3D-Umgebung, die in Remotion unverhältnismäßig teuer wäre
- Menschen/Hände oder reale Umgebung sind inhaltlich notwendig

Dann als **HYBRID** arbeiten: Bild für das komplexe Motiv, Remotion für alle präzisen Informationsschichten.

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

## Visual-Beat-Entscheidung

Jeder Visual Beat bekommt neben `NEW_BUILD` / `REUSE_EXACT` eine Medium-Entscheidung:

```text
REMOTION_NATIVE
IMAGE_REQUIRED
HYBRID
```

`REMOTION_NATIVE` ist der Standard.

`IMAGE_REQUIRED` und `HYBRID` brauchen eine konkrete Begründung, warum React/SVG/CSS/Remotion die Aussage nicht mindestens genauso gut und kontrollierbarer darstellen kann.

## Qualitätsziel

Der Vorteil von Remotion-native Visuals soll aktiv genutzt werden:

- exakt zum Sprecher animieren
- Zustände framegenau verändern
- Elemente gezielt hervorheben
- Farben/Größen/Positionen sauber im Brand halten
- jederzeit nachträglich korrigierbar
- keine zufälligen Bild-KI-Fehler in UI oder Schrift
- konsistenter Look über das komplette Reel

Kurz:

> **Wenn es ein Symbol, Interface, Diagramm oder erklärbares grafisches System ist: zuerst in Code bauen. Bilder nur dort, wo Bilder wirklich besser sind.**
