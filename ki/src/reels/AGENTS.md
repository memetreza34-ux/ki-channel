# KI Production Reels — Remotion-native Visual Contract

Gilt für **alle** ausführbaren Reel-Sources unter `ki/src/reels/`.

## Pflicht-Skills vor jeder Reel-Änderung

Vor Planung oder Änderung eines Short-Form-Sources lesen und anwenden:

- `ki/skills/high-energy-remotion-reels/SKILL.md`
- `ki/skills/voice-locked-captions/SKILL.md`

Der erste Skill verhindert kleine statische Card-Kompositionen und fordert Maximum-Remotion. Der zweite verhindert finale Caption-/Szenen-Timings auf Basis von Phase-1-Schätzungen.

## Grundregel — maximal Code vor Bild

Wenn ein visueller Bestandteil hochwertig mit React, SVG, CSS, Canvas, WebGL und Remotion gebaut werden kann, wird er **direkt in Code gebaut** und nicht als gerendertes PNG/JPG aus einer Bild-KI eingebettet.

Das gilt nicht nur für UI und technische Grafiken. Ziel ist, **so viel wie möglich vom gesamten sichtbaren Reel Remotion-native zu bauen**, inklusive stilisierter Illustrationen, Hero-Motive, Cover-Kompositionen, Mockups und pseudo-3D-Szenen.

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
- illustrative Hero-Motive und Cover-Kompositionen
- Geräte, Ordner, Dokumente, Clouds, Server, Datenpakete und ähnliche Erklärobjekte
- stilisierte Produktdarstellungen, wenn echte Fotorealistik nicht notwendig ist
- pseudo-3D mit Layering, CSS-Transforms, SVG, Schatten, Gradients und Perspektive
- visuelle Metaphern wie Wege, Türen, Trichter, Schichten, Container, Netzwerke und Waagen
- einfache stilisierte Räume, Schreibtische, Bühnen und technische Umgebungen
- Licht-, Glas-, Material- und Tiefenillusionen, soweit sauber kontrollierbar

**Für diese Kategorien sind statische KI-Bilder als Ersatz grundsätzlich nicht erlaubt, wenn der Code-Nachbau technisch und gestalterisch vernünftig möglich ist.**

## Kein PowerPoint-Look — High-Energy ist Source-Vertrag

Eine weiße Card mit kleiner Mechanik in großem Leerraum ist **kein** ausreichender Reel-Visualstandard.

Für neue Short-Form-Sources gilt zusätzlich:

- Hauptmechanik groß und dominant; typischerweise ungefähr `55–85 %` der nutzbaren Visual-Safe-Fläche
- solange neue Sprecherbedeutung kommt, ungefähr alle `0.6–1.5 s` einen semantischen Micro-Beat anstreben
- praktisch unveränderte Zustände über ungefähr `1.8 s` sind ein Review-Warnsignal, sofern kein bewusster End-Hold vorliegt
- pro Szene normalerweise `3–6` unterscheidbare Visual Beats
- Kamera-Push/Pan, Parallax, pseudo-3D, SVG-Masken, Morphing, Partikel, Flüsse, kinetische Typografie und Layer-Reveals aktiv prüfen
- Szene soll mindestens einen starken visuellen Moment besitzen, der auch als Einzelbild verständlich/markant ist
- Card/Pill/Badge sind Unterelemente, nicht automatisch die Hauptkomposition

Bewegung bleibt semantisch. Keine zufälligen Wackel-/Bounce-Effekte ohne Funktion.

## Logos, Bilder und echte Assets

Ein lokales, zulässiges Logo oder Markenasset darf und soll bei inhaltlicher Relevanz animiert werden, zum Beispiel über SVG-Stroke, Mask-Reveal, Layer-Aufbau, Light-Sweep, Depth-Pop oder Übergang in die Hauptmechanik.

**Markenlogo nie ungenau aus Erinnerung nachzeichnen.** Echtes lokales Asset verwenden oder klar textbasiert referenzieren.

Relevante Bilder/Screenshots ebenfalls nicht nur statisch einblenden. Je nach Aussage: Fokus-Zoom, Crop-Travel, Mask-Reveal, 2.5D, Parallax, Cutout-Layer, Device-/Browser-Integration oder Remotion-native Informationslayer verwenden.

## Bevorzugte Technik

Reihenfolge:

1. React-Komponenten für semantische Struktur
2. SVG für Icons, Illustrationen, Linien, Diagramme, Masken und frei skalierbare Formen
3. CSS für Layout, Flächen, Schatten, Karten, Geräte-/Fensterrahmen, Perspektive und pseudo-3D
4. Remotion für Timing, Interpolation, Sequenzen, Zustände, Kamera und Sprecher-Synchronität
5. Canvas für komplexere 2D-Zeichenlogik
6. WebGL / Three.js, wenn echte räumliche Tiefe die Aussage verbessert
7. externes Bild erst als letzte Option

Alle wichtigen visuellen Bestandteile sollen skalierbar, deterministisch und framegenau steuerbar bleiben.

## Wann ein Bild trotzdem sinnvoll ist

Externe oder generierte Bilder sind nur zulässig, wenn die Aussage etwas benötigt, das in Remotion unverhältnismäßig teuer oder qualitativ deutlich schwächer wäre, zum Beispiel:

- echte Fotorealistik
- komplexe organische Motive
- reale Menschen/Hände, wenn inhaltlich unvermeidbar
- ein konkretes reales Produkt, das exakt erkennbar sein muss
- komplexe physische Materialien/Naturdetails
- komplexe räumliche 3D-Umgebungen
- bewusst fotografischer / cinematic Look

Vorher muss geprüft werden, ob eine **stilisierte Remotion-Illustration** die Aussage nicht genauso gut oder besser erklärt.

Auch bei externem Bild gilt: **Text, UI, Pfeile, Zahlen, Diagramme, Labels, Geräte-/Browserrahmen und präzise Zustände nicht in das Bild backen.** Diese Ebenen bleiben Remotion-native.

## Cover-Regel

Cover werden standardmäßig ebenfalls in Remotion gebaut, wenn der Hook als kontrollierte Hero-Komposition mit Typografie, SVG, Devices, UI, Before/After, pseudo-3D und Schatten umsetzbar ist.

Ein externes Cover-Bild ist nur dann gerechtfertigt, wenn echte Fotografie, ein reales Produkt oder eine komplexe organische Szene notwendig ist.

## Medium-Entscheidung pro Visual Beat

Zusätzlich zu `NEW_BUILD` / `REUSE_EXACT` muss bei der Umsetzung unterschieden werden:

- `REMOTION_NATIVE` — vollständig React/SVG/CSS/Canvas/WebGL/Remotion
- `IMAGE_REQUIRED` — externes Bild ist inhaltlich wirklich erforderlich
- `HYBRID` — Bild nur für komplexen unvermeidbaren Motivteil; alle steuerbaren Informationsschichten in Remotion

`REMOTION_NATIVE` ist der Default und soll maximal ausgereizt werden.

Wenn `IMAGE_REQUIRED` oder `HYBRID` gewählt wird, muss klar begründbar sein, warum auch eine hochwertige stilisierte Remotion-Version nicht die bessere kontrollierbare Lösung ist.

## Caption-Position ist Source-Vertrag

Für 1080 × 1920 Production-Reels sind `ki/gehirn/CAPTION_SAFE_POSITION.md` und `ki/src/reels/captionSafe.ts` verbindlich.

- neue Reel-Sources müssen `REEL_CAPTION_SAFE` bzw. `REEL_CAPTION_WRAPPER_STYLE` aus `../captionSafe` verwenden
- Standard: **`bottom: 520px`**
- horizontaler Sicherheitsabstand: **`104px` links/rechts**
- bevorzugte maximale Caption-Breite: **`820px`**
- sichtbare Caption normalerweise 3–6 Wörter pro Sinnblock, maximal 2 Zeilen
- die letzten ungefähr **420px** unten nicht für Caption oder kritische Information verwenden
- Bereich 420–500px vom unteren Rand nur als Puffer behandeln
- Visuals so komponieren, dass sie nicht mit dem höheren Caption-Block konkurrieren
- neue bedeutungstragende Visuals nach Möglichkeit bis ungefähr **y≈1240–1280** abschließen
- keine Altwerte wie 264/270/360/440/460px als neue Caption-Position hart codieren
- wenn Platz fehlt, Visual ändern; Caption nicht in Richtung Plattform-UI drücken

Eine Caption-Positionsänderung ist ein Source-Change und verlangt einen neuen Render plus Smartphone-/Feed-Review. Ein alter MP4 darf den neuen Stand nicht freigeben.

## Caption-Timing ist ab Phase 3 audio-locked

Sobald echtes Voiceover existiert:

- Phase-1-Cues sind nicht mehr autoritativ
- tatsächliche Audio-Dauer bestimmt Composition-Dauer
- echte Sprech-/Pausengrenzen bestimmen Cue- und Szenengrenzen
- `words[]` mit start/end Frames ist für finale Captions Pflicht
- eine echte Sprechpause darf **kein** proportional weiterwanderndes aktives Wort erzeugen
- proportionaler Active-Word-Fallback ist nur für Phase-1-Preview zulässig
- Visual Beats sollen auf dieselben Wort-/Phrasenmarker reagieren

Finale Caption-Synchronität zusätzlich mit `ki/scripts/validate-voice-locked-captions.mjs` prüfen.

## Qualitätsregeln

- keine Screenshot-Optik, wenn dieselbe UI sauber nativ nachgebaut werden kann
- keine zufälligen AI-generierten Symbole oder UI-Texte
- keine Bitmap-Icons, wenn SVG möglich ist
- keine KI-generierten Illustrationen aus Bequemlichkeit, wenn eine gute Code-Illustration möglich ist
- keine unnötigen Asset-Abhängigkeiten
- keine visuelle Deko ohne erklärende Funktion
- Smartphone-Lesbarkeit vor Detailreichtum
- kritische Labels kurz und groß genug
- Code-Visuals dürfen nicht wie PowerPoint aussehen: Hierarchie, Tiefe, Schatten, Perspektive, Layering und Objektgröße aktiv gestalten
- Sprecherbedeutung → sichtbarer Zustand → Animation → Caption bleiben framegenau synchron
- Caption-Safe-Position und alle übergeordneten Reel-Verträge bleiben vollständig gültig

## Entscheidungsfrage

Vor jedem Bildasset zuerst fragen:

> **Kann ich das als hochwertige stilisierte Illustration, pseudo-3D-Szene, SVG, UI, Objektkomposition oder Motion-Graphic direkt in Remotion bauen?**

Wenn **ja** → in Remotion bauen.

Wenn **teilweise** → Hybrid, aber nur den unvermeidbaren externen Motivteil als Bild nutzen.

Wenn **nein** → Bild konkret begründen.
