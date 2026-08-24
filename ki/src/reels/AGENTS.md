# KI Production Reels — Remotion-native Source Contract

Gilt für alle ausführbaren Reel-Sources unter `ki/src/reels/`.

## Code vor Bild

Wenn ein visueller Bestandteil hochwertig mit React, SVG, CSS, Canvas, WebGL und Remotion gebaut werden kann, wird er direkt in Code gebaut.

Default `REMOTION_NATIVE`:

- App-/Browser-/Smartphone-/Desktop-UI
- Icons/Symbole
- Buttons/Cards/Tabs/Dialoge
- Charts/Diagramme/Prozesse
- Nodes/Pfeile/Connectoren
- Zustandswechsel/Before-After
- Hero-Motive und pseudo-3D-Kompositionen

Externe Bilder nur, wenn Fotorealistik, reales Produkt/Markenasset oder komplexes organisches Motiv klar besser ist. Bei `HYBRID` bleiben Text/UI/Labels/Diagramme Remotion-native.

## Product/UI-first

Bei Apps, Websites, Plattformen und Features zuerst eine konkrete Produkt-/UI-Szene prüfen. Generische Kreise/Nodes sind kein Default, wenn UI die Aussage klarer erklärt.

## Motion

High Energy ≠ High Speed.

Wichtige Zustände:

`REVEAL → SETTLE → READABLE HOLD`

- 1–2 neue unabhängige Informationen gleichzeitig
- wichtige Zustände nicht nur wenige Frames zeigen
- Hero-Moment lesbar halten
- Motion muss erklären, fokussieren, verbinden, transformieren oder abschließen
- 1x-Post-Render-Test ist Pflicht

## Light-First

- Fullscreen-Hintergründe standardmäßig hell
- kräftige Akzente erlaubt
- dunkle Fullscreen-Szene nur dokumentierte Ausnahme
- kein einzelner dunkler Stilbruch zwischen hellen Szenen

## Caption ist Shared Source Contract

Für 1080×1920 gelten ausschließlich:

- `ki/gehirn/CAPTION_SAFE_POSITION.md`
- `ki/src/reels/captionSafe.ts`

Kanonisch:

- `bottom: 250px`
- horizontal `104px`
- max. `860px`
- max. 2 Zeilen
- halbtransparente Glass-/Blur-Overlay-Caption
- aktiver Sprecherfokus in Szenen-Akzentfarbe
- **kein separater Footer / kein zweiter Hintergrund**

Neue Sources verwenden:

- `REEL_CAPTION_SAFE`
- `REEL_CAPTION_WRAPPER_STYLE`
- `REEL_CAPTION_GLASS_STYLE`

Keine eigenen alten Caption-Werte neu hart codieren.

## Audio ist lokales Runtime-Asset

Verbindlich: `ki/gehirn/AUDIO_PIPELINE.md`.

Source darf keine TTS-/CDN-/Remote-URL als finalen Audio-Default enthalten.

Vor Render:

```bash
node ki/scripts/prepare-reel-audio.mjs <reel-package-dir>
```

`Root.tsx` verwendet danach:

`staticFile('runtime-audio/<compositionId>.mp3')`

Neue aktive Reel-Komponenten sollen bei leerem `voiceoverSrc` fehlschlagen statt still zu rendern.

## Markenassets

- keine Logos aus Erinnerung nachzeichnen
- echte zulässige lokale Markenassets unverändert verwenden
- bei strengen Regeln Umgebung/Kamera/Container animieren statt Logo zu verfälschen

## Qualitäts-Gate

Vor Freigabe:

- Visual passt exakt zur Sprecherbedeutung
- Smartphone-lesbar
- Hauptmechanik groß genug
- Caption nach Shared-Geometrie
- Fullscreen-Hintergrund durchgehend
- keine Fremd-/Alt-Visuals
- Motion bei 1x verständlich
- Audio lokal + Voice-Locked
- aktueller Render gehört zum aktuellen Source-Stand
