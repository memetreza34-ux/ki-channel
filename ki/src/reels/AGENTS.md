# KI Production Reels — Source Contract V2

Gilt für **alle ausführbaren Reel-Sources** unter `ki/src/reels/`.

Dieser Vertrag beginnt erst, nachdem Story, Fakten und `visual-strategy.md` festgelegt wurden. Source-Code darf diese Entscheidungen nicht nachträglich auf einen bequemeren Remotion-Pfad reduzieren.

## Grundregel — Source setzt die gewählte Bildsprache um

Die primäre Visual Modality wird **nicht hier erfunden**, sondern kommt aus dem Reel-Paket:

- `REMOTION_NATIVE`
- `REAL_CAPTURE`
- `HYBRID`
- `EXTERNAL_STILL_REQUIRED`
- `EXTERNAL_MOTION_REQUIRED`

`ki/gehirn/VISUAL_STRATEGY.md` ist dafür autoritativ.

### Was Remotion immer kontrolliert, wenn es sinnvoll ist

Unabhängig von der primären Modality bleiben präzise Informationsschichten möglichst kontrollierbar:

- Header/Zwischenüberschrift
- Captions
- exakte Zahlen und Diagramme
- Pfeile, Fokus, Masken und Zustandsmarkierungen
- UI-Overlays und kurze Labels
- zeitliche Zustandswechsel
- Sprecher-Synchronität

Das bedeutet aber **nicht**, dass jedes Hero-Motiv, jede reale Tool-Demo oder jede räumliche Szene aus Prinzip in Code nachgebaut werden muss.

## `REMOTION_NATIVE`

Diese Modality eignet sich besonders für:

- Icons und Symbole
- App-/Browser-/Smartphone-/Desktop-UI, wenn keine reale Capture-Pflicht besteht
- Buttons, Inputs, Cards, Tabs, Menüs und Dialoge
- Code-/Terminalfenster und Dateibäume
- Diagramme, Charts, Timelines und Prozessgrafiken
- Nodes, Verbindungen, Pfeile und Datenfluss
- abstrakte technische Objekte
- Zustandswechsel / Before-After
- kontrollierbare 2D-/2.5D-/Three.js-Erklärmechaniken

Technik-Reihenfolge innerhalb dieser Modality:

1. React für semantische Struktur
2. SVG für skalierbare Formen/Illustrationen
3. CSS für Layout, Flächen, Schatten, Perspektive
4. Remotion für Timing/Sequenzen/Kamera
5. Canvas für komplexere 2D-Zeichenlogik
6. WebGL/Three.js, wenn räumliche Tiefe die Aussage wirklich verbessert

## `REAL_CAPTURE`

Wenn das tatsächliche Produktverhalten Teil des Beweises ist, darf Source nicht aus Bequemlichkeit eine erfundene UI nachbauen.

Source-Aufgaben:

- reale Capture-Datei über Repository-/staticFile-Pfad laden
- Crop, Zoom, Fokus und Markierungen kontrollieren
- vertrauliche Bereiche ggf. maskieren
- präzise Remotion-Overlays darüberlegen
- Capture-Datum/Produktkontext aus dem Produktionspaket respektieren

Keine Render-Time-Netzwerkaufrufe oder Live-Webseiten.

## `HYBRID`

Ein reales/externes räumliches Hero-Motiv darf die Szene tragen, während Remotion die kontrollierbaren Informationsschichten übernimmt.

Typisch:

- räumliche 3D-/Alltagsszene als Asset
- darüber Fokus, Labels, Verbindungen, Zustände und Caption
- Bewegungs-/Kameraeffekte nur soweit sie die Aussage unterstützen

Das Asset darf nicht mit generiertem UI-/Textmüll die kontrollierte Overlay-Ebene ersetzen.

## `EXTERNAL_STILL_REQUIRED`

Wenn die Visual Strategy einen externen Still verlangt:

- nur real vorhandene, im Manifest referenzierte Datei verwenden
- keine Fake-Datei oder Ersatzgrafik erfinden
- Asset in die bestehende Komposition integrieren
- notwendige Text-/Datenebenen weiterhin kontrolliert bauen

Fehlt das Pflichtasset: Phase-3-Stop, kein Karten-Fallback.

## `EXTERNAL_MOTION_REQUIRED`

Für reale/extern erzeugte Motion-Assets:

- nur real vorhandene Datei verwenden
- Dauer, Framerate/Playback und Crop bewusst behandeln
- keine Bewegung doppelt dekorativ überanimieren
- Sprecherbedeutung und entscheidende Motion-Aktion synchronisieren

Fehlt das Pflichtasset: Phase-3-Stop.

## REUSE_EXACT / NEW_BUILD

Die Visual Strategy bestimmt zuerst Modality und Mechanik. Danach darf Library-Reuse geprüft werden.

`REUSE_EXACT` nur bei tatsächlichem Fit von:

- Mechanik
- räumlicher Beziehung
- Zustandsänderung
- semantischer Aussage
- notwendigen Daten-/Textstrukturen

Andere Animation-ID oder anderes Label macht eine Szene nicht automatisch passend oder vielfältig.

Ohne exakten Fit: `NEW_BUILD` innerhalb der gewählten Modality.

## Verbindlicher Creative-Director-/Diversity-Pfad

Production-Reels dürfen die zentrale Anti-Wiederholungslogik nicht umgehen.

Zulässig sind zwei technische Wege:

1. planbasiert über `planReelAnimationsFromText` / `prepareReelAnimationProduction`, wobei ProductionPlan, Implementierungsbrief und Visual Fingerprint bis in die Umsetzung getragen werden
2. bewusst handgeschriebene Reel-Szene mit explizitem authored Visual Manifest und `assertAuthoredVisualDiversity(...)`

Diese technische Diversity-Prüfung ergänzt die V2-Visual-Strategy; sie ersetzt sie nicht.

**Wichtig:** Ein authored Visual Manifest beschreibt die beabsichtigte Bildsprache. Es ist **kein Render-Beweis**. `cameraMotion: parallax`, `entryMechanism: mask` oder `depthStyle: pseudo-3d` gelten kreativ erst dann als umgesetzt, wenn Source und gerenderte Frames diese Wirkung tatsächlich zeigen.

### Für planbasierte Reels

- konkrete Szenenausgabe standardmäßig über `ProductionSceneRuntimeRenderer`
- `REUSE_EXACT`/Library-Szenen über registrierte content-aware Prototypes
- `NEW_BUILD` startet über den im BuildSpec vorgesehenen `CreativeRecipeRuntime`, sofern die gewählte Modality Remotion-native ist
- `creativeRecipeId` und `runtimeMechanisms` sind technische Ausgangsgrammatik, keine kreative Entscheidung vor Story/Visual Strategy
- ein lokales `visualByScene`-Mapping ersetzt den zentralen Renderer nur bei bewusst handgeschriebener Ausnahme mit authored Visual Manifest
- generischer Recipe-Runtime ist Implementierungs-Scaffold, keine automatische Release-Freigabe

### Für handgeschriebene Szenen

Pro Szene mindestens festhalten:

- `sceneId`
- `visualId`
- `primaryPrimitive`
- `cameraMotion`
- `depthStyle`
- `entryMechanism`
- `medium`
- `direction`
- `visualFamily`
- `layoutFamily`
- `motionSignature`

Blockierend bzw. stark zu prüfen:

- vollständiges Visual zweimal im selben Reel
- gleiche Layout-Familie direkt hintereinander ohne semantische Begründung
- gleiche Motion-Signature direkt hintereinander ohne Grund
- Visual-Fingerprint-Ähnlichkeit über Hard-Limit
- zu geringe Hauptprimitive-Vielfalt bei längeren Reels
- Card-Dominanz trotz besserer Mechanik

Drei Szenen mit gleicher Hauptprimitive, statischer Kamera oder flacher Tiefe sind mindestens ein Review-Warnsignal.

Die alte `ki/src/motion-system/`-Welt darf für Preview/Legacy bestehen, ist aber kein alternativer Produktionsweg zum Umgehen aktueller Contracts.

## Anti-Karten-Grammatik im Source

Cards/Panels sind erlaubt, wenn sie semantisch tatsächlich UI, Dokument, Nachricht, Datei, Datensatz oder Token sind.

Nicht zulässig als bequemer Ersatz für geplante Prozess-/Objekt-/Capture-/Hybridmechanik.

Wenn `visual-strategy.md` beispielsweise `REAL_CAPTURE` oder `HYBRID` verlangt, darf Source nicht einfach eine Card-Version desselben Gedankens bauen.

## Caption-Position ist Source-Vertrag

Für 1080 × 1920 Production-Reels sind `ki/gehirn/CAPTION_SAFE_POSITION.md` und `ki/src/reels/captionSafe.ts` verbindlich.

- neue Reel-Sources verwenden `REEL_CAPTION_SAFE` bzw. `REEL_CAPTION_WRAPPER_STYLE`
- Standard: `bottom: 300px`
- horizontaler Sicherheitsabstand: `104px`
- bevorzugte maximale Caption-Breite: `820px`
- normalerweise 4–6 Wörter pro sichtbarem Sinnblock, maximal 2 Zeilen
- letzte ungefähr 220px unten nicht für kritische Information
- Bereich 220–280px nur als Puffer
- bedeutungstragende Hauptvisuals dürfen ungefähr bis `y≈1380–1420` reichen, solange sie nicht mit Caption/UI konkurrieren
- keine Altwerte wie `400`, `460`, `500` oder `520` als neue Caption-Position hart codieren
- wenn Platz fehlt, Visual ändern; Caption nicht Richtung Plattform-UI drücken

Eine Caption-Positionsänderung verlangt neuen Render + Smartphone-/Feed-Review.

## Motion-Choreography ist Pflicht

Zwischen Animation Plan und TSX liegt bei Production-Reels eine verbindliche Choreography-Entscheidung:

```text
Visual Strategy
→ Animation Plan
→ Motion Choreography
→ Remotion Source
→ Draft Render
→ Visual Review
→ Revision
```

Pro bedeutungstragendem Beat festlegen:

- dominante Aktion
- Start / Peak / Settle / Hold
- Easing-Familie
- Stagger-/Wave-Logik bei Gruppen
- Kamera- oder Tiefenreaktion, wenn semantisch nötig
- Follow-through bei gekoppelten Layern
- Kontinuität zum vorherigen/nächsten Beat
- optionaler SFX-Cue, wenn er die physische Wirkung unterstützt

Für wiederverwendbare Choreography-Bausteine `ki/src/motion/choreography.ts` und `ki/src/motion/easing.ts` verwenden.

### Kurze Objektbewegung, längere Gruppenentwicklung

Ein einzelnes Objekt soll normalerweise in der vorhandenen Micro/Standard/Hero-Dauerskala reagieren. Eine Gruppe darf über mehrere Sekunden lebendig bleiben, **indem kurze Einzelbewegungen gestaffelt starten**. Nicht 20 Elemente vier Sekunden lang gemeinsam interpolieren.

Beispiel:

```text
Tile 1: 18 Frames Bewegung
Tile 2: +3 Frames Startversatz
Tile 3: +6 Frames Startversatz
...
Gesamtgruppe: deutlich länger sichtbar in Entwicklung
Einzelobjekt: trotzdem schnell und gewichtet
```

### Kein lokales Universal-Easing

Production-Reels dürfen nicht aus Bequemlichkeit eine lokale `ease()`-Funktion mit einer einzigen Kurve für fast alle Bewegungen definieren. `enter`, `enterEmphasis`, `move`, `exit` und andere zentrale Kurven werden nach Bewegungsbedeutung gewählt.

### Gruppen niemals blind gleichzeitig

Listen, Tiles, Nodes, Tokens, Pfade und ähnliche Gruppen benötigen eine bewusste Reihenfolge, wenn sie als mehrere Ereignisse gelesen werden sollen. Erlaubt sind z. B.:

- center-out
- edge-in
- left-to-right
- cause-to-effect
- relevance-first
- radial

Gleichzeitigkeit ist nur korrekt, wenn die Aussage tatsächlich Gleichzeitigkeit meint.

### Objektkontinuität vor Transition-Effekt

Wenn zwei Beats dasselbe semantische Objekt zeigen, soll bevorzugt dessen Position/Form/Zustand weitergeführt werden. Erst wenn echte Kontinuität nicht sinnvoll ist, Hard Cut oder begründeter Übergang. Ein dekorativer Wipe ersetzt keine Shared-Object-Continuity.

## Motion-Regeln

- deterministisch
- kein `Math.random()` im Render
- keine Render-Time-Netzwerkaufrufe/Downloads
- direkte Frame-Seeks müssen funktionieren
- Hard Cut ist Standard
- Transition nur bei echter semantischer Kontinuität
- eine dominante Bewegung pro Beat, maximal drei starke gleichzeitige Bewegungen
- Easing passend zur Bewegung; lineare Progression nur bei semantisch linearer Bewegung
- Gruppen nicht blind gleichzeitig einblenden
- Endzustand ausreichend halten
- keine Partikel/Glow/Kamerafahrt als Ersatz für fehlende Erklärung

## Qualitätsregeln

- keine Fake-UI, wenn reale UI laut Visual Strategy Beweis ist
- keine zufälligen AI-Symbole oder generierten UI-Texte
- keine Bitmap-Icons, wenn skalierbares SVG die bessere kontrollierbare Ebene ist
- keine unnötigen Asset-Abhängigkeiten
- keine Deko ohne Erklärfunktion
- Smartphone-Lesbarkeit vor Detailreichtum
- kritische Labels kurz und groß genug
- Source respektiert `source-ledger.md`: keine ungrounded sichtbaren Werte
- Sprecherbedeutung → sichtbarer Zustand → Caption bleiben framegenau synchron
- aktueller Render muss exakt zum aktuellen Source-Stand gehören

## Stop-Regel

Wenn Source nur deshalb von der geplanten Modality abweichen soll, weil eine andere Umsetzung technisch schneller ist:

> **nicht still ändern**.

Zur Visual Strategy zurückkehren und die Abweichung fachlich/visuell begründen. Bequemlichkeit ist kein ausreichender Grund.
