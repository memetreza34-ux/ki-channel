# Remotion Animation Capabilities — verbindliche Technik-Policy

**Recherche-Stand:** 2026-09-24  
**Remotion-Dokumentation zuletzt geprüft:** 2026-09-18  
**Aktueller Repo-Stand:** Remotion `4.0.488`

Diese Datei ergänzt `MASTER.md`, `VISUAL_STRATEGY.md`, `REMOTION_VISUAL_SYSTEM.md`, `REELS.md` und `PRODUKTIONSABLAUF.md`.

## Ziel

Remotion wird für den Kanal nicht nur als Animationswerkzeug, sondern als **vollständiges code-first Visual-System** verwendet.

```text
Bedeutung
→ visuelle Mechanik
→ Remotion-Build
→ Visual Fingerprint
→ framegenaue Motion
→ finaler Remotion-Render
```

Echte Captures oder offizielle Assets können als Quellenebene eingebettet werden. Sie ersetzen nicht die Remotion-Composition.

## Aktueller Versionshinweis

Das Repository verwendet aktuell `remotion` und die meisten `@remotion/*` Pakete in Version `4.0.488`.

Alle Remotion-Pakete müssen exakt dieselbe Version behalten. Kein blindes Upgrade ohne echten Installationslauf, Typecheck, Tests und Smoke-Render.

## 1. React + SVG + CSS — Hauptsystem

**Status:** bevorzugter Default für konstruierte Visuals.

Geeignet für:

- UI und Browser-/App-Simulationen
- Code-Editoren und Terminal
- GitHub-/Repo-Szenen
- Diagramme, Nodes und Connectoren
- Typografie
- eigene Icons
- Masken
- pseudo-3D / 2.5D
- Objektkompositionen
- Geräte-/Produkt-Mockups
- kontrollierte Zustandswechsel
- Rankings und Vergleiche
- bildartige Illustrationen

Regel:

> Wenn eine Aussage sauber und hochwertig nativ gebaut werden kann, bleibt sie Remotion-native.

`native` bedeutet ausdrücklich nicht `Card`. Große Objekte, SVG, Masks, Clip Paths, Perspektive, Layering, Objekt-Morphing und Hero-Kompositionen aktiv einsetzen.

## 2. Eigene Icons

Finale Haupticons bevorzugt als SVG/Vector-Pfade bauen.

Qualitätsregeln:

- keine Emoji als Haupticon
- konsistente Strichstärke
- klare Silhouette
- smartphone-lesbar
- semantisch eindeutig
- Animation über Path-Reveal, Mask, Scale, Morph oder Layer statt beliebigem Bounce

## 3. Logos / Markenassets

Wenn ein echtes offizielles Logo-Asset vorhanden und redaktionell passend ist, darf es in Remotion eingebettet werden.

Nicht erlaubt:

- ein komplexes Markenlogo nachzeichnen und als offizielles Original ausgeben
- erfundene Brand-Assets als real behandeln

Ohne offizielles Asset bevorzugt:

- Markenname als Text
- eigener neutraler Badge
- Kategorie-Icon

## 4. UI-Mockups

Remotion darf Interfaces nativ nachbauen, wenn sie als **Erklärung** dienen.

Geeignet:

- generisches Chatfenster
- Code-Editor
- Terminal
- Browser
- generische Repo-Struktur
- Modell-Auswahl
- Ranking-/Benchmark-Ansicht

Truth-Regel:

> Ein UI-Nachbau ist eine Illustration, kein realer Screenshot.

Wenn exakte aktuelle UI, Option, Schaltfläche oder reales Ergebnis eine Behauptung belegt, echten Capture verwenden und in Remotion einbetten.

## 5. Code- und GitHub-Visuals

Remotion-native Bausteine:

- Editor-Chrome
- Syntaxfarben
- Zeilennummern
- Cursor
- Code-Reveal
- Diff vorher/nachher
- Terminal-Ausgabe
- Dateibaum
- Build-/Teststatus
- Repo-Header
- README-Auszug
- Release-Badge
- Commit-/Version-Timeline
- Architekturfluss

Echte Werte wie Stars, Forks, Releases oder Versionsnummern nur geerdet darstellen.

## 6. `@remotion/paths` + `@remotion/shapes`

**Status:** installiert und ausdrücklich erwünscht.

Geeignet für:

- Pfad-Reveals
- Prozesswege
- Netzwerke
- Datenfluss
- Diagramme
- geometrische Transformationen
- organischere Vektorformen
- eigene Icons
- Ranking-/Vergleichsachsen

Bevor ein Prozess als Reihe von Cards gebaut wird, prüfen, ob ein räumlicher Pfad, eine Formtransformation oder ein wachsendes Netzwerk die Aussage besser erklärt.

## 7. `@remotion/three` / React Three Fiber

**Status:** installiert.

Geeignet für:

- echte räumliche Tiefe
- Kamerafahrten durch Daten-/Kontext-Layer
- 3D-Objekte
- räumliche Netzwerke
- Layer-Korridore
- Geräte-/Produkt-Mockups
- Server/GPU/Chip-Szenen

Verbindlich:

- Bewegung über `useCurrentFrame()`/Remotion-Timeline steuern
- nicht über unabhängigen `useFrame()`-Ticker animieren
- bei `<Sequence>` innerhalb von Three `layout="none"` berücksichtigen
- 3D nur verwenden, wenn Tiefe Erklärung verbessert

## 8. `@remotion/lottie`

**Status:** installiert.

Nur bei real vorhandenem, hochwertigem und semantisch passendem Lottie-Asset.

Keine Lottie-Datei erfinden oder nur zur Abwechslung extern beschaffen. Ohne vorhandenes Asset bleibt Remotion-native der Standard.

## 9. `@remotion/rive`

**Status:** installiert.

Nur bei real vorhandenem `.riv`-Asset mit exaktem Fit. Rive ist kein Ersatz für individuelle Remotion-Szenen.

## 10. `@remotion/motion-blur`

**Status:** installiert.

Geeignet für:

- schnelle Objektbewegung
- Whip-/Push-Bewegungen
- Kameraimpulse
- kontrollierte Bewegungsenergie

Nur als Finish einer sinnvollen Bewegung, nie als Rettung schwacher Visuals.

## 11. `@remotion/transitions`

**Status:** installiert.

Standard bleibt Hard Cut, wenn keine echte Objekt-, Form-, Richtungs- oder Zustandskontinuität existiert.

Übergänge sind semantische Verbindungen, keine Effektsammlung.

## 12. GSAP

`gsap` ist installiert; `@remotion/gsap` ist aktuell nicht installiert.

Bis zu einem kontrollierten Dependency-Upgrade:

- kein normaler GSAP-Wall-Clock-Ticker für Production-Animationen
- keine unabhängigen GSAP-Timelines außerhalb von `useCurrentFrame()`

## 13. Deprecated: `@remotion/light-leaks`

Nicht mehr für neue Production-Visuals verwenden.

## Visual-Fingerprint-Pflicht

Eine andere `animationId` reicht nicht als Beweis für visuelle Vielfalt.

Betrachtet werden mindestens:

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

Unerwünschte Wiederholung:

```text
Card + locked + flat + slide
Card + locked + flat + fade-slide
Card + locked + flat + scale-slide
```

Auch mit verschiedenen IDs bleibt die visuelle Grammatik zu ähnlich.

## Technik-Auswahl pro Beat

### Prozess / Datenfluss

Bevorzugt:

1. SVG/Paths/Shapes
2. räumliche Objektbewegung
3. Three bei echter Tiefenlogik
4. Cards nur wenn UI/Card selbst der erklärte Gegenstand ist

### Transformation

Bevorzugt:

1. Objekt-/Shape-Morph
2. Mask/Reveal
3. Layer-Recomposition
4. Three bei räumlicher Transformation

### Vergleich / Ranking

Nicht automatisch Split-Screen-Cards.

Alternativen:

- gemeinsame Achse
- Ranking-Leiter
- Waage
- Morph zwischen Zuständen
- räumliche Distanz
- Overlay/X-Ray
- A/B-Output
- Preis-/Leistungsachse

### Risiko / Fehler

Alternativen zur roten Card:

- Bruch
- Instabilität
- X-Ray
- Drift
- Leck
- Kollaps
- Pfadabweichung
- Signalverlust

### Hook

Nicht automatisch große Card + Text. Bevorzugt einen sofort verständlichen visuellen Widerspruch, eine Transformation, echten Output oder starkes Hero-Objekt.

## Real-Capture-Einbettung

Wenn ein echter Capture Beweiswert hat:

```text
REAL CAPTURE
→ in Remotion importieren
→ crop/zoom/focus
→ Mask/Frame/Callout
→ ggf. A/B-Vergleich
→ Caption/Voice-Sync
→ finaler Remotion-Render
```

Ein Fake-Nachbau darf niemals den echten Beweis ersetzen.

## Production-Gate

Vor Phase-1-Freigabe eines Reels prüfen:

- jeder finale Beat hat eine klare Remotion-Build-Idee
- externe Bild-/Video-Generierung ist nicht aus Bequemlichkeit eingeplant
- echte Captures nur dort, wo sie Beweiswert haben
- keine zwei direkt benachbarten Szenen mit nahezu gleichem Visual Fingerprint, wenn eine Alternative existiert
- keine drei Szenen hintereinander mit demselben Primary Primitive
- keine drei Szenen hintereinander ausschließlich `locked` Camera, wenn Variation sinnvoll ist
- Lottie/Rive nur mit real vorhandenem Asset
- Three nur mit echter erklärender Funktion
- Motion Blur nur als Finish
- Transition nur mit semantischer Begründung
- kein deprecated `light-leaks` in neuen Visuals
- keine gefälschten Logos
- kein UI-Nachbau als scheinbar realer Screenshot

## Quellen für künftige Aktualisierung

Bei Versions-/API-Fragen immer aktuelle Remotion-Dokumentation prüfen, insbesondere zu:

- Lottie
- Rive
- Three
- Motion Blur
- Transitions
- GSAP
- Paths
- Shapes

Diese Datei ist eine Repo-Policy, kein Ersatz für aktuelle API-Dokumentation.
