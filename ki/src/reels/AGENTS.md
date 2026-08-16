# KI Production Reels — Remotion-native Visual Contract

Gilt für **alle** ausführbaren Reel-Sources unter `ki/src/reels/`.

## Grundregel — Code vor Bild

Wenn ein visueller Bestandteil sauber mit React, SVG, CSS und Remotion gebaut werden kann, wird er **direkt in Code gebaut** und nicht als gerendertes PNG/JPG aus einer Bild-KI eingebettet.

Das betrifft insbesondere:

- Icons und Symbole
- App-, Browser-, Smartphone- und Desktop-UI
- Buttons, Inputs, Cards, Tabs, Menüs und Dialoge
- Codefenster, Terminalfenster und Dateibäume
- Diagramme, Charts, Balken, Kreise und Fortschrittsanzeigen
- Nodes, Verbindungen, Pfeile, Linien und Prozessgrafiken
- Timelines, Branches, Commits und Versionsverläufe
- Tabellen, Badges, Statusanzeigen und Labels
- abstrakte technische Objekte und einfache 2D-/2.5D-Formen
- Zustandswechsel, Before/After-Mechaniken und interaktive Abläufe

**Für diese Kategorien sind statische KI-Bilder als Ersatz grundsätzlich nicht erlaubt, wenn der Code-Nachbau technisch vernünftig möglich ist.**

## Bevorzugte Technik

Reihenfolge:

1. React-Komponenten für semantische Struktur
2. SVG für Icons, Linien, Diagramme und frei skalierbare Formen
3. CSS für Layout, Flächen, Schatten, Karten, Geräte-/Fensterrahmen und einfache Perspektive
4. Remotion für Timing, Interpolation, Sequenzen, Zustände und Sprecher-Synchronität
5. Canvas/WebGL/3D nur dann, wenn die Aussage es wirklich braucht

Alle wichtigen visuellen Bestandteile sollen skalierbar, deterministisch und framegenau steuerbar bleiben.

## Wann ein Bild trotzdem sinnvoll ist

Externe oder generierte Bilder sind nur bevorzugt, wenn die Aussage etwas benötigt, das in Remotion unverhältnismäßig teuer oder qualitativ deutlich schwächer wäre, zum Beispiel:

- echte oder stilisierte Fotografie
- komplexe organische Motive
- Menschen/Hände, wenn inhaltlich unvermeidbar
- aufwendige physische Produkte oder Materialien
- komplexe räumliche 3D-Umgebungen
- sehr detailreiche natürliche Szenen
- bewusst fotografischer / cinematic Look

Auch dann gilt: **Text, UI, Pfeile, Zahlen, Diagramme, Labels und präzise Zustände nicht in das Bild backen.** Diese Ebenen bleiben Remotion-native.

## Medium-Entscheidung pro Visual Beat

Zusätzlich zu `NEW_BUILD` / `REUSE_EXACT` muss bei der Umsetzung gedanklich unterschieden werden:

- `REMOTION_NATIVE` — vollständig React/SVG/CSS/Remotion
- `IMAGE_REQUIRED` — externes Bild ist inhaltlich wirklich erforderlich
- `HYBRID` — Bild nur für komplexes Motiv; alle steuerbaren Informationsschichten in Remotion

Wenn `IMAGE_REQUIRED` oder `HYBRID` gewählt wird, muss klar begründbar sein, warum `REMOTION_NATIVE` nicht die bessere kontrollierbare Lösung ist.

## Qualitätsregeln

- keine Screenshot-Optik, wenn dieselbe UI sauber nativ nachgebaut werden kann
- keine zufälligen AI-generierten Symbole oder UI-Texte
- keine Bitmap-Icons, wenn SVG möglich ist
- keine unnötigen Asset-Abhängigkeiten
- keine visuelle Deko ohne erklärende Funktion
- Smartphone-Lesbarkeit vor Detailreichtum
- kritische Labels kurz und groß genug
- Sprecherbedeutung → sichtbarer Zustand → Animation bleiben framegenau synchron
- Caption-Zone und alle übergeordneten Reel-Verträge bleiben vollständig gültig

## Entscheidungsfrage

Vor jedem Bildasset zuerst fragen:

> **Kann ich das sauber, hochwertig und kontrollierbar mit React/SVG/CSS in Remotion bauen?**

Wenn **ja** → in Remotion bauen.

Wenn **nein** → Bild/Hybrid begründen und nur den wirklich notwendigen Bildanteil extern erzeugen.
