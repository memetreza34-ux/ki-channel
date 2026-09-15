# KI Production Reels — Remotion-native Source Contract

Gilt für alle ausführbaren Reel-Sources unter `ki/src/reels/`.

Zusätzlich verbindlich: `ki/gehirn/STORYTELLING_MOTION.md` und bei Story-Arbeit `.agents/skills/remotion-storytelling/SKILL.md`.

## Code vor Bild

Wenn ein visueller Bestandteil hochwertig mit React, SVG, CSS, Canvas, WebGL und Remotion gebaut werden kann, wird er direkt in Code gebaut.

Default `REMOTION_NATIVE`:

- App-/Browser-/Smartphone-/Desktop-UI
- Icons/Symbole
- Buttons/Cards/Tabs/Dialoge
- Charts/Diagramme/Prozesse
- Nodes/Pfeile/Connectoren
- Zustandswechsel/Before-After
- Hero-Motive und 3D-Kompositionen
- Story-Beats, Kamera-Reframes, TransitionSeries und prozedurale Hintergründe

Externe Bilder nur, wenn Fotorealistik, reales Produkt/Markenasset oder komplexes organisches Motiv klar besser ist. Bei `HYBRID` bleiben Text/UI/Labels/Diagramme Remotion-native.

## Narrative Source-Pflicht

Neue Reels sind keine Folge langer statischer Karten. Standard bei 60–75 Sekunden:

- mindestens 15 konkrete Visual Beats
- jede Szene mindestens zwei sichtbare Zustandsänderungen
- Story-Arc enthält mindestens `HOOK`, `PROOF`, `CONSEQUENCE`, `PAYOFF`
- jede zentrale Sprecher-Aussage erhält eine sichtbare Reaktion
- kein praktisch unveränderter Visual State länger als 4,5 Sekunden bei aktivem Voiceover, außer bewusst benötigte Lesepause
- Kamera/Zoom/Transition/SFX haben eine erkennbare Erklär-, Fokus-, Verbindungs- oder Payoff-Funktion

Bevor ein neues Reel als Phase-1-fertig gilt:

`node ki/scripts/validate-storytelling-motion.mjs <reel-package-dir>`

## Kanonische Story-Bausteine

Vor one-off Code zuerst wiederverwenden:

### `StoryMotion.tsx`

- `StoryBeat`
- `StoryCamera`
- `ImpactNumber`
- `StoryProgressRail`
- `StoryCutFlash`
- `StoryChapterLabel`
- `StoryTexture`

### `StoryMediaLayers.tsx`

- `StoryThreeHero` über `@remotion/three`
- `StoryLottieLayer` über `@remotion/lottie`
- `StoryRiveLayer` über `@remotion/rive`, ausschließlich lokal
- `StorySkiaBackdrop` über `@remotion/skia`

### Story-Transitions

`@remotion/transitions` und `TransitionSeries` nutzen, wenn wirklich ein Szenen-/Zustandswechsel stattfindet. `slide`, `wipe`, `bookFlip` und andere Presentations nicht wahllos mischen.

`@remotion/effects` nur subtil/semantisch: z. B. Paper/Noise/Light/Distortion als erzählerische Schicht, nicht als Dauerfilter-Spam.

`@remotion/sfx` ist als Remotion-Capability verfügbar, aber der Produktionspfad bleibt beim bestehenden lokalen deterministischen CC0-SFX-System.

## Product/UI-first

Bei Apps, Websites, Plattformen und Features zuerst eine konkrete Produkt-/UI-Szene prüfen. Generische Kreise/Nodes sind kein Default, wenn UI die Aussage klarer erklärt.

## Phase-1 Script- und Laufzeit-Budget

Für neue Reels gilt als Standard:

- **60–75 Sekunden** tatsächliche Voice-Locked-Laufzeit
- bevorzugt **150–175 gesprochene Wörter**
- bis **190 Wörter** ohne Sonderfreigabe
- `reel.json.scriptBudget.targetMinSeconds = 60`
- `reel.json.scriptBudget.targetMaxSeconds = 75`
- kürzer/länger nur mit bewusster dokumentierter Ausnahme
- Laufzeit darf nicht durch unnötige Erklärsätze oder künstlich langsames Sprechen erzeugt werden

Das Wortbudget ist nur Phase-1-Planung. Die echte Autorität ist das lokale Nutzer-Voiceover nach Pause-Kompression und Forced Alignment. `prepare-reel-render.mjs` muss die finale Voice-Locked-Dauer gegen 60–75 Sekunden prüfen.

Vor Production-Render prüft:

`node ki/scripts/validate-reel-script-budget.mjs <reel-package-dir>`

## Echte Visual-Momente

Bewährter Standard:

- ungefähr **70–80 % native UI / Text / Diagramm / Motion**
- ungefähr **20–30 % echte Bilder/Screens**
- typischerweise **1–2 starke externe Visual-Momente pro Reel**
- kein Stockbild nur zum Füllen

Echte Bilder sind besonders sinnvoll für reale Geräte, Server, Chips, Rechenzentren, Orte, Produkte oder offizielle Proof-Momente, bei denen ein reales Visual die Aussage schneller glaubwürdig macht als eine künstliche UI-Karte.

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

Für 1080×1920 gibt es genau **eine numerische Autorität**:

- `ki/src/reels/captionSafe.ts`

Markdown-Dateien und einzelne Reel-Sources dürfen die Caption-Geometrie nicht als zweite Zahlenquelle duplizieren. `ki/gehirn/CAPTION_SAFE_POSITION.md` erklärt die Regel, aber bei einem Widerspruch gewinnt immer der ausführbare Source-Contract und die Drift muss repariert werden.

Neue Sources verwenden ausschließlich:

- `REEL_CAPTION_SAFE`
- `REEL_CAPTION_WRAPPER_STYLE`
- `REEL_CAPTION_GLASS_STYLE`

Zusätzlich gelten:

- maximal zwei sichtbare Caption-Zeilen gemäß Shared Contract
- halbtransparente Glass-/Blur-Overlay-Caption
- aktiver Sprecherfokus in Szenen-Akzentfarbe
- **kein separater Footer / kein zweiter Hintergrund**
- keine eigenen alten Caption-Werte hart codieren

## Audio ist lokales Runtime-Asset

Verbindlich: `ki/gehirn/AUDIO_PIPELINE.md`.

Das Produktions-Voiceover wird ausschließlich vom Nutzer erstellt. Source darf keine TTS-/CDN-/Remote-URL als finalen Audio-Default enthalten.

Vor Render durchläuft das Reel den kanonischen Sync-Einstieg:

```bash
npm run reel:sync -- <reel-package-dir>
```

Der Sync-Orchestrator erzeugt bzw. validiert die lokale Runtime-Audio-Datei und die darauf gebundenen Word-/Scene-/Caption-/Choreografie-Daten. `Root.tsx` verwendet danach lokale Runtime-Audio-Dateien unter `public/runtime-audio/`.

Neue aktive Reel-Komponenten sollen bei leerem `voiceoverSrc` fehlschlagen statt still zu rendern.

## Medien lokal vor Render

- keine Render-Time-Netzwerkdownloads
- Lottie JSON lokal
- Rive `.riv` lokal
- Bilder/Screens lokal und Rechte/SHA-gebunden
- 3D-Assets lokal, wenn externe Dateien benötigt werden
- `StoryRiveLayer` lehnt HTTP(S)-Quellen bewusst ab

## Markenassets

- keine Logos aus Erinnerung nachzeichnen
- echte zulässige lokale Markenassets unverändert verwenden
- bei strengen Regeln Umgebung/Kamera/Container animieren statt Logo zu verfälschen

## Qualitäts-Gate

Vor Freigabe:

- Script-Budget bewusst eingehalten oder Ausnahme dokumentiert
- finale Voice-Locked-Dauer 60–75 Sekunden oder Ausnahme dokumentiert
- Storytelling-Gate bestanden
- mindestens 15 echte Visual Beats für Standard-Reel
- Storyfluss bei 1x nachvollziehbar
- keine statischen Präsentationsstrecken über Story-Limit
- Visual passt exakt zur Sprecherbedeutung
- Smartphone-lesbar
- Hauptmechanik groß genug
- Caption nach Shared-Geometrie
- Fullscreen-Hintergrund durchgehend
- keine Fremd-/Alt-Visuals
- echte Bilder nur mit sauberem Rechte-/Local-File-/SHA256-Vertrag
- Motion bei 1x verständlich
- Audio lokal + Voice-Locked
- SFX bei 1x tatsächlich angehört und sichtbar motiviert
- aktueller Render gehört zum aktuellen Source-Stand
