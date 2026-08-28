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

## Phase-1 Script-Budget

Für normale kurze Reels gilt als Standard:

- bevorzugt **55–75 gesprochene Wörter**
- bis **80 Wörter** noch zulässig
- über **80 Wörter** nur mit bewusster dokumentierter Ausnahme in `reel.json.scriptBudget`
- längere Laufzeit darf nicht durch unnötige Erklärsätze entstehen

Der Codex-Transfer-Test mit 86 Wörtern landete trotz sauberer Pause-Kompression bei rund 44 Sekunden. Deshalb wird die Laufzeit bereits in Phase 1 über das Skript begrenzt, nicht erst nach dem Render.

Vor Production-Render prüft:

`node ki/scripts/validate-reel-script-budget.mjs <reel-package-dir>`

## Echte Visual-Momente

Bewährter Standard aus den Transfer-Tests:

- ungefähr **70–80 % native UI / Text / Diagramm / Motion**
- ungefähr **20–30 % echte Bilder/Screens**
- typischerweise **1–2 starke externe Visual-Momente pro Reel**
- kein Stockbild nur zum Füllen

Echte Bilder sind besonders sinnvoll für reale Geräte, Server, Chips, Rechenzentren, Orte, Produkte oder andere Motive, bei denen ein Foto die Aussage schneller glaubwürdig macht als eine künstliche UI-Karte.

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

`Root.tsx` verwendet danach lokale Runtime-Audio-Dateien unter `public/runtime-audio/`.

Neue aktive Reel-Komponenten sollen bei leerem `voiceoverSrc` fehlschlagen statt still zu rendern.

## Markenassets

- keine Logos aus Erinnerung nachzeichnen
- echte zulässige lokale Markenassets unverändert verwenden
- bei strengen Regeln Umgebung/Kamera/Container animieren statt Logo zu verfälschen

## Qualitäts-Gate

Vor Freigabe:

- Script-Budget bewusst eingehalten oder Ausnahme dokumentiert
- Visual passt exakt zur Sprecherbedeutung
- Smartphone-lesbar
- Hauptmechanik groß genug
- Caption nach Shared-Geometrie
- Fullscreen-Hintergrund durchgehend
- keine Fremd-/Alt-Visuals
- echte Bilder nur mit sauberem Rechte-/Local-File-/SHA256-Vertrag
- Motion bei 1x verständlich
- Audio lokal + Voice-Locked
- SFX bei 1x tatsächlich angehört
- aktueller Render gehört zum aktuellen Source-Stand
