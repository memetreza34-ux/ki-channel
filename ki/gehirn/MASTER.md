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
- neue Short-Form-Reels zielen auf **60–75 Sekunden tatsächliche Voice-Locked-Laufzeit**
- Phase-1-Planwert bevorzugt **150–175 Wörter**, bis **190 Wörter** ohne Sonderfreigabe
- reale Audiodauer ist final und wird nach Forced Alignment hart geprüft
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
11. Bleibt das gesamte Reel ohne statische Füll-Holds über 60–75 Sekunden visuell aktiv?
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
- lange 60–75-s-Szenen brauchen mehrere semantische Beats statt frühem Animationsende + statischem Rest
- Post-Render bei 1x prüfen

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
= Geometrie ausschließlich aus ki/src/reels/captionSafe.ts
= aktuell bottom 330px / inset 76px / maxWidth 928px
= max. 2 Zeilen
= halbtransparente Glass-/Blur-Overlay-Fläche
= aktiver Sprecherfokus in Szenen-Akzentfarbe
```

`ki/src/reels/captionSafe.ts` ist die technische Single Source of Truth. `CAPTION_SAFE_POSITION.md` dokumentiert dieselben Werte menschenlesbar; bei Abweichung gewinnt der Source und die Dokumentation muss korrigiert werden.

## Light-First

- Fullscreen-Hintergründe standardmäßig hell
- kräftige Akzentfarben erlaubt
- dunkle Fullscreen-Szenen nur als dokumentierte Ausnahme
- kein Stilbruch nur für künstliche Variation

## Remotion-native Maximum

Wenn ein Bestandteil hochwertig mit React/SVG/CSS/Canvas/WebGL/Remotion gebaut werden kann, bleibt er kontrollierbar in Code.

Externe Bilder/Assets nur, wenn sie einen echten Mehrwert haben oder reale Marken-/Produktdarstellung benötigen. Keine Fake-Logos oder erfundenen Medien.

## Audio — eine Wahrheit

Verbindlich: `AUDIO_PIPELINE.md`.

**Das Produktions-Voiceover wird ausschließlich vom Nutzer erstellt.** Der Nutzer legt die fertige lokale Datei selbst unter `reel.json.audio.targetFile` ab.

ChatGPT, Codex, Antigravity oder andere Agenten dürfen das Voiceover weder erzeugen noch herunterladen. Remote-/Provider-Audio und Preview-Audio sind kein erlaubter Ersatz.

Final gilt nur:

```text
Nutzer erstellt Voiceover
→ Nutzer legt lokalen Audio-Master in 01-script-audio/
→ Runtime-PCM-WAV + ggf. Pause-Kompression
→ lokales Forced Alignment des bekannten Sprechertexts
→ WORD-TIMINGS.json
→ Szenen/Captions Voice-Locked
→ tatsächliche 60–75-s-Dauer prüfen
→ prepare-reel-render.mjs
→ Remotion-Render aus local runtime asset
```

Fehlt die lokale Nutzerdatei, stoppt die Produktion in Phase 2.

## Timing Contract

Das lokal vom Nutzer bereitgestellte Voiceover ist Audio-Autorität.

- Composition-Dauer nicht aus einer alten Plansekunde ableiten
- neue Reels müssen nach Voice-Lock 60–75 Sekunden erreichen oder eine dokumentierte Ausnahme besitzen
- Szenengrenzen auf echte Sprecher-/Bedeutungsgrenzen
- Captions wortgenau Voice-Locked
- bei zu kurzer Audio-Laufzeit Skript/Voiceover korrigieren statt künstlichen Leerlauf einzubauen
- bei zu langer Audio-Laufzeit Inhalt verdichten statt hektisch zu sprechen oder Motion zu beschleunigen
- lokales Time-Stretching nicht zum Umgehen des Dauergates verwenden

## Publishing-Modell

Short-Form wird einmal unter `ki/reels/` produziert. YouTube Shorts, Instagram Reels, TikTok, Facebook Reels und Snapchat verwenden denselben freigegebenen Master, soweit technisch möglich.

## Produktionsmodell

```text
PHASE 1 — Inhalt + Source + 60–75-s-Ziel
PHASE 2 — Nutzer erstellt und hinterlegt das Voiceover
PHASE 3 — Runtime-WAV + Forced Alignment + Dauer-Lock + SFX/Visuals + Reviews + Render + Export
```

## Finaler Endzustand

Ein Reel ist nicht fertig bei `render complete`.

Pflicht:

- Script-Budget-Gate
- echte 60–75-s-Voice-Locked-Dauer oder dokumentierte Ausnahme
- Entertainment-Gate
- Forced-Alignment-/Voice-Lock-Gate
- Motion-Readability-Gate
- ggf. Source-Isolation
- Video-/Audio-Gate
- Cover + Caption + Manifest
- Export-Package-Validator
- finalen exportierten MP4 tatsächlich ansehen und anhören

Erst dann:

`FINAL VIDEO READY — EXPORT PACKAGE READY`

## Git-/Speicherregel

Git versioniert die reproduzierbare Produktionswahrheit: Source, Skript, Provenance, Timings, Contracts, Reviews und Export-Metadaten. Große Binärdateien wie MP4/WAV/MP3/PNG bleiben standardmäßig lokal oder in Artifact-Storage.

## Wahrheitspflicht

Nur tatsächlich ausgeführte Schritte als bestanden melden. Keine Medien, URLs, Audio, Tests, Render oder Review-Ergebnisse erfinden.
