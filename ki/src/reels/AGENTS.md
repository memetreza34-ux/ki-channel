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

### NEW_BUILD bedeutet wirklich neu

Für einen Hero-Beat bedeutet `NEW_BUILD` standardmäßig **reel-spezifischer TSX-Source** oder eine bewusst passende Komposition aus `ki/src/motion-engine/`.

`NEW_BUILD` bedeutet ausdrücklich **nicht**:

> eines von wenigen generischen Recipe-Layouts wählen und nur Labels austauschen.

`CreativeRecipeRuntime` bleibt als Utility-/Scaffold-System erlaubt, aber es ist **kein automatischer Hero-Default** und kein Qualitätsbeweis.

## Creative-Director-/Diversity-Pfad

Production-Reels müssen Wiederholung bewusst behandeln, aber **Diversity ist keine Quote**.

Zulässig sind:

1. planbasierte Vorbereitung über `planReelAnimationsFromText` / `prepareReelAnimationProduction`
2. bewusst handgeschriebene Reel-Szenen mit authored Visual Manifest
3. reel-spezifische Hero-Szenen auf Basis der Motion Engine V1

Die zentrale Library darf Vorschläge liefern. Sie darf die Szene nicht auf eine generische Grammatik reduzieren.

### Für planbasierte Reels

- `REUSE_EXACT`/Library-Szenen über registrierte content-aware Prototypes
- `NEW_BUILD` erzeugt für Hero-Beats bevorzugt reel-spezifischen Source bzw. Motion-Engine-Choreografie
- `CreativeRecipeRuntime` ist nur Scaffold/Utility, wenn sein Mechanismus tatsächlich passt
- `creativeRecipeId` und `runtimeMechanisms` sind technische Hinweise, keine kreative Pflicht
- ein lokales `visualByScene`-Mapping ist für bewusst handgeschriebene Hero-Szenen ausdrücklich zulässig
- gleiche Mechanik darf wiederkehren, wenn sie zur Kanalgrammatik und Aussage passt
- es gibt **keine Pflicht**, eine bestimmte Anzahl verschiedener Capabilities, Archetypen oder Primärprimitives zu verbrauchen

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

- vollständiges Visual zweimal ohne semantischen Grund
- Card-Dominanz trotz besserer Mechanik
- gleiche Szene nur mit anderem Text recycelt
- Hero-Motion besteht nur aus Fade/Slide/Scale-In und anschließendem langen Stillstand
- Kamera bewegt sich nur dekorativ ohne Reaktion auf die Handlung

Nicht blockierend allein:

- wiederholte Hauptprimitive
- wiederholter Archetyp
- nur zwei passende Remotion-Capabilities im ganzen Reel

Kohärenz ist wichtiger als künstlich erzwungene Vielfalt.

Die alte `ki/src/motion-system/`-Welt darf für Preview/Legacy bestehen, ist aber kein alternativer Produktionsweg zum Umgehen aktueller Contracts.

## Anti-Karten-Grammatik im Source

Cards/Panels sind erlaubt, wenn sie semantisch tatsächlich UI, Dokument, Nachricht, Datei, Datensatz oder Token sind.

Nicht zulässig als bequemer Ersatz für geplante Prozess-/Objekt-/Capture-/Hybridmechanik.

Wenn `visual-strategy.md` beispielsweise `REAL_CAPTURE` oder `HYBRID` verlangt, darf Source nicht einfach eine Card-Version desselben Gedankens bauen.

## Caption-Position ist Source-Vertrag

Für 1080 × 1920 Production-Reels sind `ki/gehirn/CAPTION_SAFE_POSITION.md` und `ki/src/reels/captionSafe.ts` verbindlich.

- neue Reel-Sources verwenden `REEL_CAPTION_SAFE` bzw. `REEL_CAPTION_WRAPPER_STYLE`
- Standard: `bottom: 520px`
- horizontaler Sicherheitsabstand: `104px`
- bevorzugte maximale Caption-Breite: `820px`
- normalerweise 4–6 Wörter pro sichtbarem Sinnblock, maximal 2 Zeilen
- letzte ungefähr 420px unten nicht für kritische Information
- Bereich 420–500px nur als Puffer
- bedeutungstragende Hauptvisuals möglichst bis ungefähr `y≈1240–1280` abschließen
- keine Altwerte als neue Caption-Position hart codieren
- wenn Platz fehlt, Visual ändern; Caption nicht Richtung Plattform-UI drücken

Eine Caption-Positionsänderung verlangt neuen Render + Smartphone-/Feed-Review.

## Motion Engine V1 — Hero-Regel

`ki/gehirn/MOTION_ENGINE.md` ist für neue Hero-Szenen verbindlich.

Hero-Motion soll einen lesbaren Bewegungsbogen besitzen:

```text
Anticipation
→ Acceleration / Travel
→ Impact oder Reveal
→ Overshoot / Follow-through
→ Settle
→ Alive Hold
```

Nicht jede Szene braucht alle sechs Phasen, aber ein Hero darf nicht nur aus `opacity + translate + scale` bestehen.

Bevorzugte Bausteine:

- `CinematicCameraRig`
- `ChoreographedObject`
- `ImpactShake`
- `AliveHold`
- `DirectionalBlur`
- oder gleichwertige reel-spezifische framebasierte Choreografie

### Kamera

Kamera darf aktiv choreografiert werden:

- push-in / pull-back
- track-left / track-right
- push-through
- whip-left / whip-right
- impact-push
- controlled orbit

Kamera reagiert auf die Handlung oder erklärt Raum. Permanenter Drift ist kein Ersatz für Motion Direction.

### Geschwindigkeit

Schnelle Bewegung muss lesbar sein, z. B. durch:

- Motion Blur / Directional Blur
- Stretch/Squash
- Follow-Camera / Whip
- klare Trajectory

## Allgemeine Motion-Regeln

- deterministisch
- kein `Math.random()` im Render
- keine Render-Time-Netzwerkaufrufe/Downloads
- direkte Frame-Seeks müssen funktionieren
- Hard Cut ist Standard
- Transition nur bei echter semantischer Kontinuität
- eine dominante Bewegung pro Beat; mehrere Bewegungen nur choreografiert und hierarchisch
- Easing passend zur Bewegung; lineare Progression nur bei semantisch linearer Bewegung
- Gruppen nicht blind gleichzeitig einblenden
- Endzustand ausreichend halten, aber nicht tot stehen lassen
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
