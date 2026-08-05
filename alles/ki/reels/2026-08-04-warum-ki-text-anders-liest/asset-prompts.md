# Asset-Prompts

Die erste Umsetzung soll möglichst vollständig mit Remotion, SVG und CSS funktionieren. Externe Assets sind nur erlaubt, wenn sie echten räumlichen Mehrwert bringen. Keine Texte, Zahlen, Pfeile oder Diagrammbeschriftungen in generierten Bildern.

## Asset 1 – abstrakter Bedeutungsraum

**Einsatz:** optionaler Hintergrund für Szene 3  
**Format:** 1080 × 1920, transparenter Hintergrund bevorzugt

```text
A premium abstract 3D semantic embedding space for a vertical educational technology reel, clusters of small luminous nodes floating in deep space, clear spatial separation between three concept groups, elegant violet and soft lavender glow, subtle depth fog, clean minimal composition, bright neutral background compatibility, sophisticated AI visualization, no text, no labels, no arrows, no interface panels, no humans, no logos, transparent background if possible, high detail but uncluttered, cinematic soft lighting
```

**Negative Prompt:**

```text
text, letters, numbers, watermark, logo, cyberpunk city, dark black background, human brain, humanoid robot, random cables, clutter, excessive bloom, childish cartoon, stock photo look
```

## Asset 2 – transparente Modellschichten

**Einsatz:** optionaler Layer-Unterbau für Szene 6  
**Format:** einzelne transparente PNG- oder WebP-Ebenen

```text
Four separate floating translucent computational layers for a vertical motion graphic, elegant glass-like slabs with subtle internal geometric patterns, each layer visually distinct but part of one coherent system, violet accent light, clean white studio background, centered composition, realistic depth and soft shadows, no text, no symbols, no logos, no human figures, designed as modular transparent assets for animation
```

**Negative Prompt:**

```text
server rack, motherboard photo, text, numbers, neon cyberpunk, dark room, cables, humanoid robot, brain icon, UI dashboard, watermark
```

## Asset 3 – feine räumliche Partikel

**Einsatz:** sparsam als Übergangs- und Tiefenelement  
**Format:** transparente PNG-Sequenz oder statisches Partikelfeld

```text
Sparse premium depth particles for a vertical educational motion design, tiny soft violet and neutral gray points at varied depth, subtle directional flow from foreground to background, clean and minimal, transparent background, no stars, no galaxy, no text, no lens flare, no dense dust cloud
```

## Asset-Regeln

- Assets werden nie als vollständige Szene verwendet.
- Die eigentliche Erklärung entsteht immer in Remotion.
- Generierte Bilder dürfen keine eingebrannten Texte enthalten.
- Alle Assets müssen farblich an die Brand-Tokens aus `reel.json` angepasst werden.
- Ein Asset darf nicht in mehr als zwei Szenen sichtbar sein.
- Bei schlechter Freistellung oder unruhigem Detailgrad wird das Asset verworfen und nativ in Remotion ersetzt.
