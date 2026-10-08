# Approved KI Visuals — Production Subset

**Zweck:** Die große Core-/Animation-Library bleibt erhalten. Für normale KI-Longform-Produktion gilt aber ein kleinerer freigegebener Werkzeugkasten, damit Agenten nicht aus Effekten statt aus Bedeutung auswählen.

## Standard — bevorzugt

### Struktur / Bühne
- eigener React/SVG/CSS-Build
- `@remotion/shapes`
- `@remotion/paths`
- `ParallaxLayer`
- `PushIn` nur bei echtem Fokuswechsel

### Tech / Produkt
- `Terminal`
- `LiveCodeCompile`
- `CodeCompare`
- `FileTreeReveal`
- `BoundingBox`
- `Cursor`
- echte Captures als Remotion-Layer

### Daten / Vergleich
- `ComparisonBars`
- `BarsPremium` für 3+ Kategorien
- `AreaPremium`
- `DualAreaCompare`
- `LabeledAxisChart`
- `Ranking` / eigene Ranking-Leiter
- große eigene Zahlendarstellung, wenn die Zahl selbst der Hero ist

### Typografie
- `MaskReveal`
- `WordStagger`
- `TextHighlightSweep`
- `KineticCenterBuild` nur für Hero-/Reset-Momente
- `HyperText` nur wenn Scramble inhaltlich passt

### Übergänge
- Hard Cut
- Match/Object Continuity
- `PushThrough` bei echter räumlicher Fortsetzung
- Mask/Reveal bei tatsächlichem Aufdecken
- Morph bei demselben Objekt/Zustand

## Special Case — nur mit Begründung

- Three / React Three Fiber
- `MotionBlur`
- `CameraBlur`
- `LightLeak`
- `ShaderBG`
- `GooBlobs`
- `IconOrbit`
- `Dissolve`
- `WhipIn`
- `ZoomPunch`
- Lottie
- Rive
- GSAP

Die Begründung muss erklären, welchen Bedeutungs- oder Verständlichkeitsgewinn die Mechanik liefert.

## Standardmäßig gesperrt für normale KI-Erklärbeats

Nicht einsetzen, nur weil sie technisch verfügbar sind:

- permanentes `LivingBackground`
- `MatrixRain`
- `HologramGrid`
- `RetroGrid`
- `Meteors`
- `ParticleField`
- `Sparkles`
- `Confetti`
- Dauer-`Float` / Dauer-`Breathe`
- beliebige Glow-/Neon-Schichten
- Card-/Bento-Grids als Default-Szenenbau

Diese Komponenten bleiben im Repo für spezielle Themen/Demos verfügbar.

## Auswahlregel

Vor jeder Library-Auswahl beantworten:

1. Was muss der Zuschauer verstehen?
2. Welches Objekt trägt die Aussage?
3. Was verändert sich sichtbar?
4. Was ist Start- und Endzustand?
5. Braucht die Aussage echten Produktbeweis?
6. Welche der fünf Visual-Familien aus `YOUTUBE_VISUAL_LANGUAGE.md` passt?

Erst danach darf eine Komponente ausgewählt werden.

Wenn kein vorhandener Baustein semantisch exakt passt: **NEW_BUILD**.
