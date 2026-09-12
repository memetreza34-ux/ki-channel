# Media Mix Proof — Vertical Reel

Isolierter 12-Sekunden-Test, der exakt die gewünschte Hybrid-Richtung des KI-Kanals beweisen soll: Remotion-native Animation + echtes Bild + echte B-Roll in einem 9:16-Reel.

## Ablauf

- 0–3 s: native Remotion-Hook mit Typografie, Cards, Spring/Interpolate und Bewegung
- 3–6 s: echtes CC0-Foto als lokales `<Img>` mit Crop/Pan/Zoom und Remotion-Overlay
- 6–9 s: echter CC0-B-Roll-Clip als lokales `<OffthreadVideo>` mit Remotion-Typografie und Progress-Motion
- 9–12 s: B-Roll + Nutzerbild + native Remotion-Animation gleichzeitig im Frame

Technik: 1080×1920, 30 FPS, 360 Frames, H.264/yuv420p.

## Reale Medien

Der Test nutzt bewusst dieselben provenance-geprüften Showcase-Quellen aus `ki/public/showcase/SOURCES.md`:

- `Laptop on a desk.jpg` — CC0
- `Speed typing with dvorak.webm` — CC0; lokal vor Render zu MP4 normalisiert
- `user-remotion-studio.jpg` — vom Nutzer bereitgestelltes Projektbild

Es gibt keinen Remote-Media-Zugriff während des Remotion-Renders und keinen Placeholder-Fallback.

## Render

Vom Repository-Root:

```bash
node scripts/with-longform-node20.mjs scripts/render-media-mix-proof.mjs
```

Der Helper materialisiert Bild und B-Roll zuerst über `scripts/prepare-remotion-showcase-media.mjs`, rendert danach die isolierte Composition `MediaMixProofVertical` und prüft per ffprobe 1080×1920 sowie ungefähr 12 Sekunden Laufzeit.

Output:

```text
out/media-mix-proof/media-mix-proof-vertical.mp4
```

Erst ein real erzeugtes MP4 plus 1x-Sichtprüfung darf als visueller PASS bezeichnet werden.
