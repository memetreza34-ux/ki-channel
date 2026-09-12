# Remotion Showcase 2026-09-12

Isolierter 40-Sekunden-Testfilm, um die visuelle Remotion-Fähigkeit getrennt von Astra zu beurteilen.

## Enthalten

- 1920×1080 / 30 FPS / 40 s
- 7 klar unterschiedliche Szenen
- kinetic hook
- native Remotion-Studio/UI-Rekonstruktion mit Kamera-Zoom/Pan
- lokale Bild-/Icon-artige SVG-Kompositionen
- Media-Board mit fail-closed B-Roll-Slot
- frame-synchroner Recharts-Datenplot + Counter
- Three.js / React Three Fiber über `@remotion/three`
- Skia + Shapes + Blur + Noise
- mehrere lokale SFX aus `ki/public/sfx`
- kein `Math.random()`
- keine Remote-Medien zur Renderzeit

## B-Roll-Hinweis

Im aktuellen GitHub-Branch ist noch kein neuer realer B-Roll-Clip für diesen Showcase materialisiert. Der Test behauptet deshalb keinen Fake-B-Roll-PASS. Die Media-Szene zeigt die Compositing-/Regie-Fähigkeit und markiert den Real-B-Roll-Pfad ausdrücklich fail-closed. Ein realer Clip kann anschließend lokal materialisiert und in dieselbe Szene gesetzt werden.

## Render

```bash
node scripts/with-longform-node20.mjs scripts/render-remotion-showcase.mjs
```

Output:
`out/remotion-showcase-2026-09-12/remotion-showcase.mp4`

Ein erzeugtes MP4 ist erst nach visueller Prüfung ein akzeptierter Test-Render.
