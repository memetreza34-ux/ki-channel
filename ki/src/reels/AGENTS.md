# KI Production Reels — Remotion-native Visual Contract

Gilt für **alle** ausführbaren Reel-Sources unter `ki/src/reels/`.

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

## Verbindlicher Creative-Director-Pfad

Ein Production-Reel darf die zentrale Anti-Wiederholungslogik nicht umgehen.

Zulässig sind nur zwei Wege:

1. Das Reel entsteht aus `planReelAnimationsFromText` / `prepareReelAnimationProduction` und trägt den daraus erzeugten ProductionPlan, Implementierungsbrief und Visual Fingerprint bis in die Umsetzung.
2. Eine bewusst handgeschriebene Reel-Szene besitzt ein explizites authored Visual Manifest und muss `assertAuthoredVisualDiversity(...)` bestehen.

Für **planbasierte** Reels gilt zusätzlich:

- die konkrete Szenenausgabe läuft standardmäßig über `ProductionSceneRuntimeRenderer`
- `REUSE_EXACT`/Library-Szenen werden dort über die registrierten content-aware Prototypes aufgelöst
- `NEW_BUILD` startet dort über den im BuildSpec festgelegten `CreativeRecipeRuntime`
- `creativeRecipeId` und `runtimeMechanisms` aus dem Implementierungsbrief sind verbindliche Ausgangsgrammatik, keine optionale Deko
- ein lokales `visualByScene`-Mapping darf den zentralen Renderer nicht ersetzen, nur wenn eine bewusst handgeschriebene Ausnahme mit authored Visual Manifest vorliegt
- der generische Recipe-Runtime ist ein Implementierungs-Scaffold und **keine automatische Release-Freigabe**; vor `verified` bleibt technischer + manueller Render-Review Pflicht

Für handgeschriebene Szenen muss pro Szene mindestens festgehalten werden:

- eindeutige `sceneId`
- eindeutige `visualId`
- `primaryPrimitive`
- `cameraMotion`
- `depthStyle`
- `entryMechanism`
- `medium`
- `direction`
- `visualFamily`
- `layoutFamily`
- `motionSignature`

Andere Animation-IDs oder andere Texte gelten **nicht** als ausreichende visuelle Variation.

Blockierend sind insbesondere:

- vollständiges Visual zweimal im selben Reel
- gleiche Layout-Familie direkt hintereinander
- gleiche Motion-Signature direkt hintereinander
- visuelle Fingerprint-Ähnlichkeit über dem Hard-Limit
- zu geringe Hauptprimitive-Vielfalt bei längeren Reels
- Card-Dominanz trotz vorhandener besserer Erklärmechanik

Drei Szenen mit gleicher Hauptprimitive, statischer Kamera oder flacher Tiefe sind mindestens ein Review-Warnsignal und müssen bewusst begründet oder verbessert werden. Solche weichen Diversity-Warnungen blockieren die Implementierung nicht automatisch, dürfen aber vor finaler Freigabe nicht ignoriert werden.

Die alte `ki/src/motion-system/`-Welt darf für Preview/Legacy erhalten bleiben, ist aber **kein alternativer Produktionsweg**, um die aktuelle Creative-Director-/Diversity-Prüfung zu umgehen.

## Caption-Position ist Source-Vertrag

Für 1080 × 1920 Production-Reels sind `ki/gehirn/CAPTION_SAFE_POSITION.md` und `ki/src/reels/captionSafe.ts` verbindlich.

- neue Reel-Sources müssen `REEL_CAPTION_SAFE` bzw. `REEL_CAPTION_WRAPPER_STYLE` aus `../captionSafe` verwenden
- Standard: **`bottom: 520px`**
- horizontaler Sicherheitsabstand: **`104px` links/rechts**
- bevorzugte maximale Caption-Breite: **`820px`**
- sichtbare Caption normalerweise 4–6 Wörter pro Sinnblock, maximal 2 Zeilen
- die letzten ungefähr **420px** unten nicht für Caption oder kritische Information verwenden
- Bereich 420–500px vom unteren Rand nur als Puffer behandeln
- Visuals so komponieren, dass sie nicht mit dem höheren Caption-Block konkurrieren
- neue bedeutungstragende Visuals nach Möglichkeit bis ungefähr **y≈1240–1280** abschließen
- keine Altwerte wie 264/270/360/440/460px als neue Caption-Position hart codieren
- wenn Platz fehlt, Visual ändern; Caption nicht in Richtung Plattform-UI drücken

Eine Caption-Positionsänderung ist ein Source-Change und verlangt einen neuen Render plus Smartphone-/Feed-Review. Ein alter MP4 darf den neuen Stand nicht freigeben.

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
- Sprecherbedeutung → sichtbarer Zustand → Animation bleiben framegenau synchron
- Caption-Safe-Position und alle übergeordneten Reel-Verträge bleiben vollständig gültig

## Entscheidungsfrage

Vor jedem Bildasset zuerst fragen:

> **Kann ich das als hochwertige stilisierte Illustration, pseudo-3D-Szene, SVG, UI, Objektkomposition oder Motion-Graphic direkt in Remotion bauen?**

Wenn **ja** → in Remotion bauen.

Wenn **teilweise** → Hybrid, aber nur den unvermeidbaren externen Motivteil als Bild nutzen.

Wenn **nein** → Bild konkret begründen.