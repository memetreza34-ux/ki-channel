# Remotion Animation Capabilities — verbindliche Technik-Policy

**Recherche-Stand:** 2026-09-20  
**Remotion-Dokumentation geprüft:** 2026-09-18  
**Aktueller Repo-Stand:** Remotion `4.0.488`

Diese Datei ergänzt `MASTER.md`, `REELS.md`, `PRODUKTIONSABLAUF.md` und die Source-Verträge. Sie verhindert, dass installierte Animationsmöglichkeiten ungenutzt bleiben oder ungeeignete Techniken nur aus Effektgründen eingesetzt werden.

## Ziel

Der Kanal soll nicht auf eine einzige visuelle Grammatik wie `Card + Fade + Slide + Linie` kollabieren. Für jeden Visual Beat wird zuerst die verständlichste visuelle Mechanik gewählt und danach die passende Technik.

```text
Bedeutung
→ visuelle Mechanik
→ Visual Fingerprint
→ passende Remotion-Technik
→ framegenaue Umsetzung
```

Nicht umgekehrt.

## Aktueller Versionshinweis

Das Repository verwendet aktuell `remotion` und die meisten `@remotion/*` Pakete in Version `4.0.488`.

Die am 2026-09-20 geprüfte Remotion-Dokumentation zeigt bereits `4.0.526` als aktuelle gemeinsame Paketversion. Remotion empfiehlt, `remotion` und alle `@remotion/*` Pakete auf exakt derselben Version zu halten und keine gemischten Versionen zu verwenden.

**Kein blindes Upgrade.** Das Repository besitzt derzeit noch kein vertrauenswürdig erzeugtes kanonisches `package-lock.json`. Ein Versionsupgrade erfolgt erst mit echtem Installationslauf, Typecheck, Tests und Smoke-Render.

## 1. React + SVG + CSS — Standard

**Status:** bevorzugter Default

Geeignet für:

- UI und Browser/App-Simulationen
- Diagramme, Nodes und Connectoren
- Typografie
- Icons
- Masken
- pseudo-3D
- Objektkompositionen
- kontrollierte Zustandswechsel
- Layering und Perspektive

Regel:

> Wenn eine Aussage sauber und hochwertig nativ gebaut werden kann, bleibt sie Remotion-native.

Aber: `native` bedeutet nicht automatisch `Card`. SVG, Masks, Clip Paths, Perspektive, Objekt-Morphing, Layering und große Hero-Objekte müssen aktiv genutzt werden.

## 2. `@remotion/paths` + `@remotion/shapes`

**Status:** installiert und für neue Visuals ausdrücklich erwünscht

Geeignet für:

- Pfad-Reveals
- Prozesswege
- Netzwerke
- Datenfluss
- Diagramme
- geometrische Transformationen
- organischere Vektorformen
- sichtbare Ursache-Wirkungs-Beziehungen

Bevor ein Prozess als Reihe von Cards gebaut wird, prüfen, ob ein einzelner räumlicher Pfad, eine Formtransformation oder ein wachsendes Netzwerk die Aussage besser erklärt.

## 3. `@remotion/three` / React Three Fiber

**Status:** installiert

Aktuelle Remotion-Fähigkeiten:

- `ThreeCanvas`
- `ThreeWebGPUCanvas`
- React Three Fiber
- Video-Texturen
- framegenaue Remotion-Hooks innerhalb der 3D-Szene

Geeignet für:

- echte räumliche Tiefe
- Kamerafahrten durch Daten-/Kontext-Layer
- 3D-Objekte
- räumliche Netzwerke
- Layer-Korridore
- Geräte-/Produkt-Mockups
- Mechaniken, bei denen 2D/Pseudo-3D die Aussage sichtbar schwächer machen würde

Verbindlich:

- Bewegung über `useCurrentFrame()`/Remotion-Timeline steuern
- nicht über einen unabhängigen `useFrame()`-Ticker animieren
- bei `<Sequence>` innerhalb von Three `layout="none"` berücksichtigen
- Server-/Render-Konfiguration für ANGLE prüfen
- 3D nicht als Dekoration verwenden

Three ist kein Pflicht-Effekt pro Reel. Es ist eine zusätzliche visuelle Familie, wenn echte Tiefe die Erklärung verbessert.

## 4. `@remotion/lottie`

**Status:** installiert

Geeignet für:

- bereits vorhandene hochwertige Lottie-Vektorassets
- komplexe vorgefertigte Icon-/Illustrationsbewegungen
- wiederverwendbare Markenanimationen, wenn sie exakt zum Inhalt passen

Aktuelle Remotion-Unterstützung:

- vorwärts/rückwärts abspielen
- Geschwindigkeit steuern
- lokale und entfernte Dateien
- Metadaten wie Dauer und Dimensionen

Wichtige Grenze:

Lottie-Expressions können beim framegenauen Seeking über `lottie-web` nicht immer deterministisch rendern und dadurch flackern. Jede Lottie-Datei muss deshalb im echten Render geprüft werden.

**STRIKE-Regel:** Kein Lottie-Asset erfinden oder extern beschaffen, wenn es der Nutzer nicht bereitgestellt hat. Ohne vorhandenes Asset bleibt Remotion-native der Default.

## 5. `@remotion/rive`

**Status:** installiert

Geeignet für:

- vorhandene `.riv`-Assets
- hochwertige interaktive Vektoranimationen
- komplexe vektorbasierte Zustände, die bereits in Rive modelliert wurden

Rive ist kein Ersatz für eine individuelle Remotion-Szene. Es wird nur eingesetzt, wenn ein echtes passendes Rive-Asset vorhanden ist und der sichtbare Mechanismus exakt zur Sprecherbedeutung passt.

**STRIKE-Regel:** Keine `.riv`-Dateien erfinden oder aus unbekannter Quelle voraussetzen.

## 6. `@remotion/motion-blur`

**Status:** installiert

Aktuelle Kernwerkzeuge:

- `Trail`
- `CameraMotionBlur`

Geeignet für:

- schnelle Objektbewegung
- Whip-/Push-Bewegungen
- Kameraimpulse
- kontrollierte Bewegungsenergie

Nicht verwenden, um schwache Kompositionen interessanter erscheinen zu lassen. Erst klare Bewegung bauen, dann Blur als physikalisch plausibles Finish ergänzen.

## 7. `@remotion/transitions`

**Status:** installiert

Neben klassischen `fade`, `slide`, `wipe`, `flip`, `clockWipe` und `iris` unterstützt die aktuelle Remotion-Generation unter anderem komplexere HTML-in-Canvas-Präsentationen wie:

- `zoomBlur`
- `dreamyZoom`
- `filmBurn`
- `linearBlur`
- `bookFlip`
- `zoomInOut`
- `dissolve`
- `ripple`
- `crosswarp`
- `crossZoom`
- `swap`
- `blurSlide`

Regel:

> Übergänge sind semantische Verbindungen, keine Effektsammlung.

Standard bleibt Hard Cut, wenn keine echte Objekt-, Form-, Richtungs- oder Zustandskontinuität existiert.

## 8. GSAP

**Repo-Status:** `gsap` ist installiert; `@remotion/gsap` ist aktuell nicht installiert.

Die aktuelle offizielle Remotion-Integration `@remotion/gsap` erzeugt eine pausierte GSAP-Timeline und sucht sie framegenau über Remotion. Das ist für Scrubbing und Rendering deterministisch.

Bis `@remotion/gsap` sauber als gleichversionierte Remotion-Abhängigkeit installiert und getestet wurde:

- kein normaler GSAP-Wall-Clock-Ticker für Production-Animationen
- keine unabhängigen GSAP-Timelines, die außerhalb von `useCurrentFrame()` laufen
- bestehendes `gsap` nicht nur deshalb verwenden, weil es installiert ist

Nach einem kontrollierten Dependency-Upgrade kann `@remotion/gsap` für komplexe, aber weiterhin deterministische Choreografien geprüft werden.

## 9. Deprecated: `@remotion/light-leaks`

Das Repo führt aktuell `@remotion/light-leaks` in `package.json`.

Die aktuelle Remotion-Dokumentation kennzeichnet dieses Paket als **deprecated**.

Regel:

- nicht mehr für neue Production-Visuals verwenden
- vorhandene Nutzung bei Gelegenheit migrieren
- Entfernung aus `package.json` erst im kontrollierten Dependency-/Lockfile-Lauf

## Visual-Fingerprint-Pflicht

Eine andere `animationId` reicht nicht als Beweis für visuelle Vielfalt.

Mindestens diese Dimensionen werden betrachtet:

```text
primaryPrimitive
cameraMotion
depthStyle
entryMechanism
medium
direction
visualFamily
layoutFamily
motionSignature
```

Beispiele für unerwünschte Wiederholung:

```text
Card + locked + flat + slide
Card + locked + flat + fade-slide
Card + locked + flat + scale-slide
```

Auch wenn alle drei Animationen verschiedene IDs und Texte haben, ist ihre visuelle Grammatik zu ähnlich.

## Technik-Auswahl pro Beat

### Prozess / Datenfluss

Bevorzugt:

1. SVG/Paths/Shapes
2. räumliche Objektbewegung
3. Three bei echter Tiefenlogik
4. Cards nur wenn eine UI/Card selbst der erklärte Gegenstand ist

### Transformation

Bevorzugt:

1. Objekt-/Shape-Morph
2. Mask/Reveal
3. Layer-Recomposition
4. Three bei räumlicher Transformation

### Vergleich

Nicht automatisch Split-Screen-Cards. Alternativen:

- gemeinsame Achse
- Waage
- Morph zwischen Zuständen
- räumliche Distanz
- Overlay/X-Ray
- Vorher/Nachher als ein Objekt

### Risiko / Fehler

Alternativen zu roter Card:

- Bruch
- Instabilität
- X-Ray
- Drift
- Leck
- Kollaps
- Pfadabweichung
- Signalverlust

### Hook

Nicht automatisch große Card + Text. Bevorzugt ein sofort verständlicher visueller Widerspruch, eine Transformation oder ein starkes Hero-Objekt.

## Production-Gate

Vor Phase-1-Freigabe eines Reels prüfen:

- keine zwei direkt benachbarten Szenen mit nahezu gleichem Visual Fingerprint, wenn eine Alternative existiert
- keine drei Szenen hintereinander mit demselben Primary Primitive
- keine drei Szenen hintereinander ausschließlich `locked` Camera
- keine drei Szenen hintereinander ausschließlich `flat`, wenn Inhalt Tiefen-/Objektvariation sinnvoll erlaubt
- Lottie/Rive nur mit real vorhandenem Asset
- Three nur mit echter erklärender Funktion
- Motion Blur nur als Finish einer sinnvollen Bewegung
- Transition nur mit semantischer Begründung
- kein deprecated `light-leaks` in neuen Visuals

## Quellen für künftige Aktualisierung

Bei Versions-/API-Fragen immer aktuelle Remotion-Dokumentation prüfen:

- `/docs/lottie`
- `/docs/rive`
- `/docs/three`
- `/docs/motion-blur`
- `/docs/transitions`
- `/docs/gsap`
- `/docs/paths`
- `/docs/shapes`

Diese Datei ist eine Repo-Policy, kein Ersatz für aktuelle API-Dokumentation.