# KI-Kanal — Reel-Gehirn

## Ziel

Ein Reel erklärt **eine** KI-Idee mit klarem Spannungsbogen und sichtbarem Mechanismus. Kein Mini-Vortrag, keine Feature-Liste.

Planung typischerweise ca. 40–60 Sekunden, wenn der Inhalt das trägt. **Finale Länge kommt aus dem echten lokalen Voiceover**, nicht aus einer alten Plansekunde.

## Spannungsbogen

```text
HOOK
→ warum betrifft es den Zuschauer?
→ sichtbare Mechanik
→ Aha / Einordnung
→ kurzer End-Hold
```

## Szenenregel

Jede Szene braucht einen dominanten Erklärgedanken:

`SETUP → AKTION → KONSEQUENZ → PAYOFF`

Mindestens ein klarer Hero-Moment pro Szene.

## Visual Beats

Zuerst Inhalt, danach Reuse prüfen.

```text
Sprecherphrase
→ Bedeutung
→ sichtbarer Startzustand
→ Reveal
→ Settle
→ lesbarer Hold
→ Endzustand
→ REUSE_EXACT oder NEW_BUILD
```

`REUSE_EXACT` nur bei echtem semantischem Fit. Sonst NEW_BUILD.

## Motion

High Energy ≠ High Speed.

- wichtige neue Zustände nach Reveal/Settle lesbar halten
- kritischer Hold bei 30 fps meist ca. 12–24 Frames
- Hero-/Payoff-Hold meist ca. 18–30 Frames
- unabhängige Informationen meist 6–12 Frames staffeln
- höchstens 1–2 neue unabhängige Informationen gleichzeitig, wenn sie aktiv verstanden werden müssen
- wenn Audio zu kurz ist: Visual vereinfachen, nicht hektisch machen

## Product/UI-first

Bei konkreten Apps, Websites, Plattformen oder Features zuerst produktnahe UI/Device/Browser-Szene prüfen. Abstrakte Kreise/Nodes nur, wenn sie wirklich klarer erklären.

## Light-First

- Fullscreen-Hintergründe standardmäßig hell
- kräftige Akzentfarben erlaubt
- dunkle Cards in heller Szene erlaubt
- dunkle Fullscreen-Szene nur als dokumentierte Ausnahme
- kein einzelner dunkler Stilbruch nur für Abwechslung

## Text-Hierarchie

### Zwischenüberschrift

- oben mittig
- kurz, typischerweise 3–7 Wörter
- passendes Icon
- ordnet ein, kopiert nicht den Sprechertext
- keine interne Regie-/Debug-Zeile

### Caption

Einzige Geometrie: `CAPTION_SAFE_POSITION.md` + `ki/src/reels/captionSafe.ts`.

Kanonisch 1080×1920:

- `bottom: 250px`
- `104px` links/rechts
- max. `860px`
- max. 2 Zeilen
- kompakte Sinnblöcke
- halbtransparente Glass-/Blur-Overlay-Fläche
- aktiver Sprecherfokus in Szenen-Akzentfarbe
- **kein separater Footer / kein zweiter Hintergrund**

Caption ist Voice-Locked zum tatsächlich verwendeten Audio.

### Animationstext

- kurze Objekt-/Zustandslabels
- keine Satzkopie des Voiceovers
- interne Planner-/Goal-Texte nie sichtbar

## Caption-/Visual-Trennung

- Szenen-Hintergrund bleibt fullscreen
- bedeutungstragende Hauptvisuals nach Möglichkeit bis ca. `y=1440–1480`
- Caption liegt als Overlay darüber
- wenn Kollision entsteht: Visual höher/kompakter/new-build
- nicht Caption auf alte hohe 500+/520px-Werte zurückschieben
- keine harte weiße Footer-Zone erzeugen

## Audio / Timeline

Verbindlich: `AUDIO_PIPELINE.md`.

Finale Reihenfolge:

```text
lokaler Audio-Master
→ ffprobe
→ Whisper/Voice-Lock
→ Szenen + finalDurationInFrames schreiben
→ prepare-reel-render.mjs
→ Render
```

Remote-Audio ist nur Provenance und niemals finaler Render-Master.

## Bewegungsqualität

- eine dominante Bewegung pro Beat
- maximal wenige starke gleichzeitige Bewegungen
- Kamera nur bei echtem Fokuswechsel
- Endzustand braucht Hold
- keine Deko-Bewegung ohne Erklärfunktion
- 1x-Review Pflicht

## Bilder / Assets

Wenn Code die Aussage hochwertig kontrollierbar baut → Remotion-native.

Externe Bilder nur bei echtem Mehrwert. Markenassets nur echt/lizenzierbar, nie aus Erinnerung nachzeichnen.

## Grounding

- sichtbare Zahlen nur mit Quelle
- keine erfundenen Rankings/Prozente
- Sprechertext → Visual Beats → konkrete Mechanik → Render-Props

## Qualitätsgate

Vor Freigabe:

- Hook ohne Ton grob verständlich
- jeder bedeutungstragende Sprecherabschnitt hat Visual Beat
- kein Fremd-/Alt-Template-Reuse
- keine zu schnellen/unlesbaren Zustände
- Light-First kohärent
- Caption nach Shared-Geometrie
- Audio lokal und Voice-Locked
- Szenen/Dauer stimmen mit Audio
- finaler MP4 hörbar
- Motion-Review gehört per SHA256 zum exakten Final-MP4
- Export-Paket vollständig

Erst nach tatsächlichem Ansehen/Anhören freigeben.
