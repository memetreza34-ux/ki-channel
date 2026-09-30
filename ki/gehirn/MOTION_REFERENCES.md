# Motion Reference System — externe Mechaniken richtig nutzen

**Status:** verbindlich für neue Remotion-Production-Reels  
**Ziel:** bessere Animationen durch gezielte Referenzsuche, ohne Template-Look oder Dependency-Chaos.

Diese Datei regelt, **wann und wie** externe Open-Source-Motion-Quellen konsultiert werden. Sie ersetzt weder `VISUAL_STRATEGY.md` noch `BEWEGUNG.md` noch die Remotion-Capability-Gates.

## Kernregel

Eine externe Animation darf niemals bestimmen, **was** eine Szene erzählt.

Die Reihenfolge ist immer:

```text
Story / Aussage
→ Visual Strategy
→ Visual Beat
→ Motion Choreography
→ Motion Reference Search
→ Mechanik verstehen
→ an eigene Bildwelt anpassen
→ Remotion Source
→ Render
→ Creative QA
```

Nicht erlaubt:

```text
coole Animation finden
→ Inhalt darum bauen
```

## Was eine gute Referenz liefert

Eine Referenz darf uns helfen bei:

- Bewegungsmechanik
- Stagger-/Wave-Logik
- Mask-/Reveal-Prinzip
- Kamera-/Depth-Idee
- Shape-/Path-Morph
- Typografie-Choreography
- UI-/Terminal-/Code-Verhalten
- Chart-/Datenanimation
- Transition mit echter semantischer Kontinuität
- 2.5D-/3D-Aufbau
- Effekt-/Shader-Idee

Eine Referenz liefert **nicht automatisch**:

- unsere Farben
- unsere Typografie
- unser Layout
- unsere Story
- unser Timing
- unseren Hook
- unsere visuelle Hierarchie
- unseren finalen Source

## Kanonischer Katalog

Die maschinenlesbare Wahrheit liegt in:

```text
ki/src/motion/referenceCatalog.ts
```

### 1. Remotion Official

Repository: `remotion-dev/remotion`

**Modus:** `official-reference`

Immer zuerst verwenden für:

- API-Wahrheit
- Versionskompatibilität
- Paths / Shapes
- Effects
- Motion Blur
- Transitions
- Three
- Lottie
- Rive
- Rendering / Studio

Eine Drittquelle darf eine aktuelle Remotion-API nicht „beweisen“. Bei Unsicherheit zählt die offizielle Doku.

### 2. Onda

Repository: `degueba/onda`  
Lizenz: MIT, geprüft 2026-09-30  
Modus: `source-reference`

Stark bei:

- Motion Tokens
- Word Stagger
- Mask Reveals
- Draw-on
- Terminal / Browser
- Code Diff
- Charts
- Kamera-Primitiven

Besonders wertvoll für den Editorial-Tech-Stil unseres Kanals.

### 3. Remocn

Repository: `Remocn/remocn`  
Lizenz: MIT, geprüft 2026-09-30  
Modus: `source-reference`

Stark bei:

- Typography
- Blur Reveals
- Matrix Decode
- Number Motion
- Device Mockups
- Grid Pixelation
- Chromatic Motion

Gut als Hero-/Polish-Referenz, aber nicht als komplette Bildwelt übernehmen.

### 4. RemotionUI

Repository: `riaz37/remotion-ui`  
Lizenz: MIT, geprüft 2026-09-30  
Modus: `source-reference`

Großer Discovery-Katalog für:

- Social Motion
- Captions
- Audio Visualization
- Maps
- Transitions
- Motion Tokens

Regel: möglichst kleine passende Mechanik auswählen; niemals die komplette UI-Grammatik eines fremden Systems übernehmen.

### 5. Remotion Bits

Repository: `av/remotion-bits`  
Lizenz: MIT, geprüft 2026-09-30  
Modus: `cli-source-reference`

Im Root bereits vorgesehen:

```bash
npm run bits:find
npm run bits:fetch
npm run bits:mcp
```

Typische Suche:

```text
animated counter
code block
staggered motion
matrix rain
scene3d
typewriter
```

`bits:fetch` kommt **erst nach** Visual Strategy + Choreography. Ein schneller Fetch darf keine kreative Entscheidung ersetzen.

### 6. React Video Editor Remotion Templates

Repository: `reactvideoeditor/remotion-templates`  
Lizenz: MIT, geprüft 2026-09-30  
Modus: `source-reference`

Besonders nützlich für:

- Bar/Line/Area/Donut Charts
- Counter
- Text Highlight
- Parallax
- Whip Pan
- Pixel Transition

Sehr guter Implementierungs-Referenzpunkt für Daten-/Benchmark-Szenen. Finaler Look muss trotzdem kanal-eigen sein.

### 7. snapcn

Repository: `snapcndev/snapcn`  
Lizenz: MIT, geprüft 2026-09-30  
Modus: `source-reference`

Besonders nützlich für:

- AI Chat
- Prompt / Search Typing
- Terminal
- Phone / Laptop
- Text Reveal / Build
- Logo Assemble
- Orbit Gallery

Nur für Software-/KI-/Tool-Stories einsetzen. Nicht aus Gewohnheit Geräte-Mockups in wissenschaftliche Erklärungen drücken.

### 8. AnimeFX

Repository: `voltwake/animefx`  
Lizenz: MIT, geprüft 2026-09-30  
Modus: `inspiration-only`

Stark bei:

- Shader-Ideen
- Distortion
- Glitch
- seekbaren Effekten
- Three-/WebGL-Ideen
- Effects Search

**Nicht installieren.** Aktueller AnimeFX-Stand verlangt Node `>=22.12.0`; das KI-Repo läuft bewusst auf Node 20. Mechanik studieren und bei Bedarf Remotion-native nachbauen.

### 9. Motion Canvas

Repository: `motion-canvas/motion-canvas`  
Lizenz: MIT, geprüft 2026-09-30  
Modus: `inspiration-only`

Stark bei:

- Vektor-Erklärungen
- Voice-synchroner Choreography
- Diagramm-Motion
- didaktischer Szenenführung

Nicht als zweite Video-Runtime installieren. Wir übernehmen Denkweisen, nicht den Runtime-Stack.

## Suchprozess pro Beat

Vor der Suche muss der Beat mindestens beantworten:

```text
Was verändert sich sichtbar?
Welches Objekt trägt die Aussage?
Welche räumliche Beziehung muss verstanden werden?
Was ist der Startzustand?
Was ist der Endzustand?
Was ist der Hero-Moment?
```

Danach Suchbegriffe aus **Mechanik**, nicht aus Styling bilden.

Gut:

```text
token stream stagger
path travel
number comparison
mask reveal object
terminal agent flow
shape morph
center-out tiles
```

Schlecht:

```text
cool animation
viral effect
cinematic purple animation
```

## Auswahlregel

Eine Referenz ist nur dann ein Treffer, wenn mindestens drei Punkte passen:

1. gleiche oder sehr ähnliche Mechanik
2. gleiche räumliche Beziehung
3. gleiche Art von Zustandswechsel
4. ähnliche Informationsdichte
5. gleiche Rolle im Beat (Hero / Support / Texture)

Wenn nur Farbe/Look beeindruckt, ist es **kein** Mechanik-Treffer.

## Copy-/Adapt-Regel

Bei `source-reference` oder `cli-source-reference`:

1. Lizenzstatus im Katalog prüfen.
2. Nur den notwendigen Source-/Mechanikteil übernehmen.
3. Copyright-/Lizenzhinweis erhalten, wenn die Lizenz das verlangt.
4. Farben, Typografie, Layout und Timing an das KI-System anpassen.
5. lokale Motion Tokens / `easing.ts` / `choreography.ts` verwenden.
6. keinen fremden globalen Design-System-Layer einschleppen.
7. Typecheck + Render + Creative QA.

Bei `inspiration-only`:

- keine Dependency installieren
- keinen kompletten Runtime-Codepfad kopieren
- Prinzip in Remotion-native Mechanik übersetzen

## Effects-Regel

`@remotion/effects` darf als kontrolliertes Finish genutzt werden, wenn der Effekt eine bereits verständliche Mechanik unterstützt, z. B.:

- Fokus / Blur
- Distortion als Bedeutungswechsel
- Color-/LUT-Zustand
- Tile/Pattern als echte Darstellung
- gezielter visueller Verlust oder Gewinn

Nicht erlaubt:

```text
schwache Szene
+ Blur
+ Glow
+ Distortion
= angeblich gute Animation
```

Effects sind Support, nicht Story-Ersatz. Sie zählen deshalb vorerst **nicht** als eigene Primary Beat-Capability.

## 3D-Regel

Aktuell vorhanden:

- `three`
- `@react-three/fiber`
- `@remotion/three`

Nicht standardmäßig hinzufügen:

- `@react-three/drei`
- `@react-three/postprocessing`

Diese Pakete werden erst per kontrolliertem Dependency-PR ergänzt, wenn eine konkrete Hero-Szene sie wirklich benötigt.

## Kein Render-Time-Netzwerk

Der Katalog dient Planung und Implementierung.

Production-Source darf niemals während des Renderns:

- GitHub-Repos laden
- Remote Source fetchen
- MCP aufrufen
- `bits:find` ausführen
- externe Beispiele dynamisch importieren

Alles benötigte muss vor dem Render lokal und versioniert vorhanden sein.

## Creative QA nach Reference-Reuse

Zusätzlich zu `CREATIVE_QA.md` prüfen:

- Erkennt man noch unsere Bildwelt?
- Sieht die Szene nach Template aus?
- Wurde nur die Mechanik übernommen oder auch unnötig der Skin?
- Ist das Timing an Voice/Beat angepasst?
- Gibt es eine klare Start→Veränderung→Ergebnis-Lesbarkeit?
- Funktioniert die Szene ohne Kenntnis der Referenz?
- Ist der Hero auf Smartphone-Größe stark genug?

Wenn die Antwort auf „Sieht das nach einem fremden Template aus?“ **ja** lautet: nicht freigeben.

## Priorität

Für neue Reels gilt:

```text
1. vorhandene eigene exakte Mechanik
2. offizielle Remotion-Primitive
3. externe Remotion-Source-Referenz
4. NEW_BUILD
5. Inspiration aus anderer Runtime → Remotion-native Übersetzung
```

Nicht Ziel dieses Systems ist, jede Szene aus einer Library zu bauen.

Ziel ist:

> Der Agent soll nicht jedes Mal Animation von null erfinden müssen, aber trotzdem jedes Video individuell choreografieren.
