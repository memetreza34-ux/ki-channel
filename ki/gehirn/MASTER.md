# KI-Channel — MASTER-GEHIRN

Diese Datei verbindet Identität, Reel-Logik, Longform, Audio, Visuals und Publishing.

## Autoritative Quellen

1. `REPO-STATE.md`
2. `AGENTS.md` / `ki/AGENTS.md`
3. diese Datei
4. `KANAL.md`
5. `REELS.md`
6. `AUDIO_PIPELINE.md`
7. `PRODUKTIONSABLAUF.md`
8. `PLATTFORMEN.md`
9. `../BILDSTIL.md`
10. named Produktionspaket + Source

Widersprüche werden an der höheren Quelle korrigiert, nicht still geraten.

## Kernziel

> Komplexe KI so erklären, dass ein normaler deutschsprachiger Zuschauer den Mechanismus schnell versteht — visuell stark, sachlich geerdet und ohne Hype-Lärm.

## Kanalprinzipien

- deutsch
- faceless
- verständlich vor technisch beeindruckend
- Nutzen/Aha vor Feature-Liste
- Wahrheit vor Reichweitenversprechen
- ein kanonischer Content-Master; Plattformen sind Packaging
- Short-Form typischerweise 40–60 Sekunden, wenn das Thema es trägt; reale Audiodauer ist final
- Longform ist eigenständig und wird nicht aus Reels künstlich aufgeblasen

## Reel-Entscheidungsreihenfolge

```text
1. Was sagt der Sprecher genau?
2. Welche Visual Beats stecken darin?
3. Was muss sichtbar passieren, damit man es versteht?
4. Ist produktnahe UI / echtes Asset besser als abstrakte Metapher?
5. Gibt es exakten Reuse-Fit? Wenn nein: NEW_BUILD.
6. Welche kurze Überschrift + Icon ordnet die Szene ein?
7. Welche wenigen Labels sind nötig?
8. Ist der Ablauf bei 1x lesbar?
9. Passt alles in die kanonische Caption-/Feed-Geometrie?
10. Trägt der Schluss bis zur letzten Sprecherphrase?
```

Nicht zulässig: „Wir haben diese Animation schon, also benutzen wir sie irgendwie.“

## Visual Beat / Motion Contract

Jede neue bedeutungstragende Sprecherstelle erhält eine bewusste visuelle Reaktion.

Wichtige Zustände folgen:

```text
REVEAL → SETTLE → READABLE HOLD
```

High Energy bedeutet **nicht** High Speed.

- bedeutungslose Dauerbewegung vermeiden
- wichtige neue Information nicht durchblitzen lassen
- unabhängige Informationen staffeln
- Hero-/Payoff-Zustand kurz lesbar halten
- Post-Render bei 1x prüfen

Details: `ki/skills/high-energy-remotion-reels/` und `ki/skills/motion-readability-light-first/`.

## Visual Hierarchy Short-Form

```text
ZWISCHENÜBERSCHRIFT + ICON
= oben mittig, kompakt, klare Szenenorientierung

ANIMATION / UI / BILD
= große konkrete visuelle Erklärung
= Fullscreen-Hintergrund; kein künstlicher Footer

ANIMATIONSTEXT
= kurze Objekt-/Zustandslabels

CAPTION
= Voice-Locked
= kanonisch bottom: 250px
= max. 2 Zeilen
= halbtransparente Glass-/Blur-Overlay-Fläche
= aktiver Sprecherfokus in Szenen-Akzentfarbe
```

Die einzige Caption-Geometrie liegt in `ki/src/reels/captionSafe.ts` und `CAPTION_SAFE_POSITION.md`.

## Light-First

- Fullscreen-Hintergründe standardmäßig hell: Offwhite, Hellgrau, Cyan/Mint/Blau/Creme sehr hell
- kräftige Akzentfarben ausdrücklich erlaubt
- dunkle Fullscreen-Szenen nur als dokumentierte Ausnahme
- kein Stilbruch nur für künstliche Variation

## Remotion-native Maximum

Wenn ein Bestandteil hochwertig mit React/SVG/CSS/Canvas/WebGL/Remotion gebaut werden kann, bleibt er kontrollierbar in Code.

Externe Bilder/Assets nur, wenn sie einen echten Mehrwert haben oder reale Marken-/Produktdarstellung benötigen. Keine Fake-Logos oder erfundenen Medien.

## Audio — eine Wahrheit

Verbindlich: `AUDIO_PIPELINE.md`.

Voiceover darf real durch ein verfügbares Tool **oder** durch Mensch/Nutzer entstehen.

Final gilt nur:

```text
lokaler Audio-Master
→ ffprobe
→ Whisper / Voice-Lock
→ Szenen/Captions anpassen
→ prepare-reel-audio.mjs
→ Remotion-Render aus local runtime asset
```

Remote-URL ist nur Provenance, niemals finaler Render-Master.

## Timing Contract

Das lokal final verwendete Voiceover ist Audio-Autorität.

- Composition-Dauer nicht aus einer alten Plansekunde ableiten
- Szenengrenzen auf echte Sprecher-/Bedeutungsgrenzen
- Captions wortgenau Voice-Locked
- bei zu kurzer Phrase Visual vereinfachen statt hektisch beschleunigen
- lokales Time-Stretching nur natürlich/pitch-erhaltend und begrenzt

## Publishing-Modell

Short-Form wird einmal unter `ki/reels/` produziert. YouTube Shorts, Instagram Reels, TikTok, Facebook Reels und Snapchat verwenden denselben freigegebenen Master, soweit technisch möglich.

Plattform-Copy liegt in `03-caption/platform-copy.md`.

## Produktionsmodell

```text
PHASE 1 — Inhalt + Source
PHASE 2 — reales Voiceover beschaffen (Tool oder Mensch)
PHASE 3 — Audio locken + Timeline + Reviews + Render + Export
```

Wenn Voiceover bereits im selben Auftrag real per Tool erzeugt wurde, darf direkt in Phase 3 weitergearbeitet werden.

## Finaler Endzustand

Ein Reel ist nicht fertig bei `render complete`.

Pflicht:

- Entertainment-Gate
- Voice-Lock-Gate
- Motion-Readability-Gate
- ggf. Source-Isolation
- Video-/Audio-Gate
- Cover + Caption + Manifest
- Export-Package-Validator
- finalen exportierten MP4 tatsächlich ansehen und anhören

Erst dann:

`FINAL VIDEO READY — EXPORT PACKAGE READY`

## Git-/Speicherregel

Git versioniert die **reproduzierbare Produktionswahrheit**:

- Source
- Skript
- Provenance
- Timings/Whisper-Daten
- Contracts
- Reviews
- Export-Manifest/Metadaten

Große Binärdateien wie MP4/WAV/MP3/PNG bleiben standardmäßig lokal oder in Artifact-Storage, solange Git LFS nicht eingerichtet ist. Eine `.gitignore`-Datei und eine Speichern-Regel dürfen sich nicht widersprechen.

## Wahrheitspflicht

Nur tatsächlich ausgeführte Schritte als bestanden melden. Keine Medien, URLs, Audio, Tests, Render oder Review-Ergebnisse erfinden.
