# KI-Channel — Agent Operating Contract

## Start here

Vor jeder Arbeit:

1. `REPO-STATE.md`
2. bei `ki/` → `ki/AGENTS.md`
3. `ki/gehirn/MASTER.md`
4. passende Domäne (`ki/reels/AGENTS.md`, Longform, Plattformen)
5. named Reel/Source und nächstes `AGENTS.md`

Bei Audio zusätzlich verbindlich: `ki/gehirn/AUDIO_PIPELINE.md`.

## Mission

Dieses Repository produziert hochwertige deutsche faceless KI-Erklärinhalte mit Remotion. Agenten arbeiten wie Produktionsingenieure: klare Quelle der Wahrheit, semantisch passende Visualisierung, reproduzierbare Pipeline, echte Prüfungen und wahrheitsgemäße Statusmeldungen.

## Git und Branches

- `main` ist der kanonische Produktionsstand.
- Normale Änderungen auf einem Arbeitsbranch.
- `main` nicht direkt verändern, außer der Nutzer verlangt ausdrücklich Stabilisierung/Kanonisierung.
- Historische Branches/PRs sind keine aktuelle Wahrheit.
- PRs nicht mergen/ready setzen, außer die Aufgabe verlangt es.
- Keine unrelated Dateien anfassen.

## 3-Phasen-Modell für Reels

### Phase 1 — Inhalt + Source

Muss enthalten:

- finales Skript + `VOICEOVER-ZUM-KOPIEREN.txt`
- für neue Reels **60–75 Sekunden** Ziel-Laufzeit
- bevorzugt **150–175 Wörter**, bis **190 Wörter** ohne Sonderfreigabe
- `reel.json.scriptBudget.targetMinSeconds = 60` und `targetMaxSeconds = 75`
- Szenen-/Animationsplan
- Caption-Basis
- Plattform-Copy
- Bild-/Asset-Entscheidung
- `reel.json`
- ausführbaren Remotion-Source
- Composition-Registrierung
- Entertainment-/Motion-Readability-Grundlage
- klaren `PHASE-STATUS.md`

Geschätzte Timings sind nur Preview. Das Wortbudget ist Planung; die echte Laufzeit kommt später aus dem Voice-Lock.

### Phase 2 — Voiceover beschaffen

Voiceover darf **real** auf zwei Arten entstehen:

1. mit einem tatsächlich verfügbaren Voice-/TTS-Tool im selben Auftrag, oder
2. durch Nutzer/Mensch.

Wenn Audio bereits real per Tool erzeugt wurde, muss nicht künstlich auf einen Human-only-Schritt gewartet werden.

Verbindlich ist `ki/gehirn/AUDIO_PIPELINE.md`:

- Remote-/Provider-URL nur als Provenance
- echtes Audio lokal am kanonischen `audio.targetFile`
- keine Render-Time-Netzwerkquelle
- vor Render `prepare-reel-audio.mjs`

### Phase 3 — Sync, Review, Render, Export

Mit lokalem Audio:

- Runtime-PCM-WAV erzeugen / Pause-Kompression
- bekanntes Skript per lokalem Forced Alignment exakt gegen die Runtime-WAV ausrichten
- `WORD-TIMINGS.json`, Szenen und Captions Voice-Locked schreiben
- tatsächliche finale Dauer prüfen: neue Reels müssen 60–75 Sekunden erreichen oder eine dokumentierte Ausnahme besitzen
- SFX und lokale Visuals auflösen
- TypeScript/fokussierte Tests
- Pre-Render-/Provenance-Gate
- Roh-Render
- Social-Audio-Master
- Smoke-/Hero-/Contact-Sheet-Review
- Motion-Readability bei 1x
- Finalizer + vollständiges `05-export/`-Paket

Fehlt das lokale Audio: `PHASE 2 AUDIO FEHLT` bzw. bei bereits dokumentierter Tool-Generation `AUDIO DOWNLOAD/PREP FEHLT`.

## Autoritative Reel-Dateien

Wenn vorhanden, gilt grob:

1. `06-projektdateien/PHASE-STATUS.md`
2. `06-projektdateien/reel.json`
3. `01-script-audio/voiceover.md` / `VOICEOVER-ZUM-KOPIEREN.txt`
4. `01-script-audio/audio-source.json` (nur Provenance)
5. `01-script-audio/SCENE-VOICE-MAP.json`
6. `01-script-audio/WORD-TIMINGS.json` nach Voice-Lock
7. `scene-plan.md`
8. `animation-plan.md`
9. `03-caption/subtitle-cues.json`
10. `03-caption/platform-copy.md`
11. Asset-Manifest/Prompts
12. `ENTERTAINMENT-REVIEW.md`
13. `MOTION-READABILITY-REVIEW.md`
14. Assembly-/Review-Dateien

Widersprüche nicht still übergehen; an der Ursache korrigieren.

## Remotion-Regeln

- deterministisch: `useCurrentFrame`, `interpolate`, `spring`, `Sequence`
- kein `Math.random()` im Render
- **keine Render-Time-Netzwerkdownloads**
- lokale Runtime-Medien über vorbereitete `public/`-Assets / `staticFile`
- Hard Cut nur, wenn keine bessere semantische Transition nötig ist
- High Energy bedeutet nicht High Speed
- wichtige Zustände: `REVEAL → SETTLE → READABLE HOLD`
- längere 60–75-s-Reels brauchen mehrere Visual Beats; keine langen statischen Holds nur zum Füllen
- keine Demo-Zahlen als Fakten
- keine internen Regie-/Goal-Texte sichtbar

## Text-/Layout-Hierarchie

- Überschrift: kurz, ordnet ein
- Caption: gesprochener Inhalt, Voice-Locked
- Animationstext: kurze Objekt-/Zustandslabels
- Animation: zeigt Mechanismus

Caption-Geometrie ausschließlich aus `ki/src/reels/captionSafe.ts` / `CAPTION_SAFE_POSITION.md`.

## Medien-Wahrheit

**Erlaubt:** Medien tatsächlich mit einem verfügbaren Tool erzeugen oder echte Nutzer-/Repository-Assets verwenden.

**Verboten:** Medien, Dateien, URLs, Logos, Render oder Testergebnisse erfinden/behaupten, die nicht tatsächlich existieren.

Für Tool-generierte Medien gilt:

- Provenance dokumentieren
- benötigten lokalen Master wirklich herunterladen/erzeugen
- lokal technisch prüfen
- keine Remote-URL als finalen Render-Master verwenden

Große Binärmedien bleiben standardmäßig außerhalb normalem Git, solange Git LFS nicht eingerichtet ist. Code, Provenance, Timings, Manifest und Review-Dokumentation werden versioniert.

## Wahrheitspflicht

Nie behaupten, dass Test, Typecheck, Forced Alignment, Voice-Lock, Render, Audio, visuelle Prüfung oder Export bestanden sind, wenn dies nicht tatsächlich ausgeführt wurde.

Bei Blocker nennen:

- exakter Befehl
- Fehler
- betroffene Datei
- nächste sinnvolle Aktion

Keine Fehler mit `any`, `@ts-ignore`, deaktivierten Tests, Fake-Assets, Fake-Berichten oder geschwächten Validatoren verstecken.
