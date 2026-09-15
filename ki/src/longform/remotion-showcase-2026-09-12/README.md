# Remotion Showcase 2026-09-12

Isolierter 40-Sekunden-Testfilm, um die visuelle Remotion-Fähigkeit getrennt von Astra zu beurteilen.

## Enthalten

- 1920×1080 / 30 FPS / 40 s
- 7 klar unterschiedliche Szenen
- kinetic hook
- echter vom Nutzer bereitgestellter Remotion/QuickTime-Screenshot als lokales Bild-Asset
- echter CC0-B-Roll-Clip aus Wikimedia Commons, vor dem Render lokal materialisiert und zu H.264 1920×1080/30 normalisiert
- echtes CC0-Workspace-Foto aus Wikimedia Commons
- deutlich sichtbare animierte SVG-Icons (Video, Bild, Cursor, Code, Audio, Chart, 3D, FX)
- Parallax, Crop, Zoom/Pan und Media-Compositing
- frame-synchroner Recharts-Datenplot + Counter
- Three.js / React Three Fiber über `@remotion/three`
- Skia + Shapes + Blur + Noise
- mehrere lokale SFX aus `ki/public/sfx`
- kein `Math.random()`
- keine Remote-Medien während des Remotion-Renders

## Media-Materialisierung

Der Render-Helper ruft zuerst automatisch auf:

```bash
node scripts/prepare-remotion-showcase-media.mjs
```

Dabei werden zwei vorab lizenzgeprüfte Wikimedia-Assets lokal materialisiert. Wenn Download, ffmpeg, Provenance oder ein Pflichtasset fehlt, wird der Render **abgebrochen**. Es gibt keinen Placeholder-Fallback.

Verwendete Quellen:

- `Speed typing with dvorak.webm` — Wikimedia Commons — CC0 1.0
- `Laptop on a desk.jpg` — Wikimedia Commons — CC0 1.0
- `user-remotion-studio.jpg` — vom Nutzer für dieses Projekt bereitgestellter Screenshot

Die erzeugte lokale Provenance liegt nach dem Prep unter:

`ki/public/showcase/PROVENANCE.generated.json`

## Render

```bash
node scripts/with-longform-node20.mjs scripts/render-remotion-showcase.mjs
```

Output:

`out/remotion-showcase-2026-09-12/remotion-showcase.mp4`

Ein erzeugtes MP4 ist erst nach visueller Prüfung ein akzeptierter Test-Render.
