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

- `REPO-STATE.md` bestimmt den aktuell autoritativen Arbeitsstand.
- `main` bleibt das Ziel für den kanonischen Produktionsstand.
- Wenn `REPO-STATE.md` ausdrücklich einen laufenden Stabilisierungsbranch nennt, ist dieser für die aktuelle Arbeit autoritativ und darf nicht still durch `main` ersetzt werden.
- Normale Änderungen auf einem Arbeitsbranch.
- `main` nicht direkt verändern, außer der Nutzer verlangt ausdrücklich Stabilisierung/Kanonisierung.
- Historische Branches/PRs sind keine aktuelle Wahrheit.
- PRs nicht mergen/ready setzen, außer die Aufgabe verlangt es.
- Keine unrelated Dateien anfassen.

## Reel-Struktur — Pflichtgate

Für die aktive Woche und alle neuen Reels gilt:

```text
ki/reels/<Woche>/<Wochentag>/<NN_Thema>/
```

Beispiel:

```text
ki/reels/2026-08-31_bis_2026-09-06/
├── 01_Montag/
│   └── 01_OpenAI-Cursor-SpaceX-Vertrag/
├── 02_Dienstag/
│   └── 01_Google-Flow-Gemini-Omni-1-1-Flash/
└── 03_Mittwoch/
    └── 01_Grok-Bot-X-Integration/
```

Wochentage sind fest `01_Montag` bis `07_Sonntag`. Mehrere Reels am selben Tag werden **innerhalb des Tages** als `01_`, `02_`, `03_` nummeriert.

Jeder Themen-/Reel-Ordner besitzt `README.md` sowie `01-script-audio/` bis `06-projektdateien/`.

Git versioniert keine leeren Ordner. Deshalb muss jeder der sechs Pflichtordner mindestens eine persistente Datei enthalten (`.gitkeep`, README oder echte Produktionsdatei).

Neue Reels ausschließlich über den kanonischen Generator anlegen:

```bash
npm run new-video -- "Reel Titel" YYYY-MM-DD
```

- `scripts/new-ki-reel.mjs` routet nach Woche + Wochentag + Topic-Slot.
- `scripts/new-ki-reel-core.mjs` erzeugt den vollständigen Produktions-/Story-/Level-Up-Scaffold.

Nach jeder Erstellung, Migration, Integration oder sonstigen Änderung unter `ki/reels/**` muss **vor jeder Erfolgsmeldung** laufen:

```bash
npm run ki:reel:structure-check
```

Ein Agent darf ein Reel niemals als implementiert, Phase-1-fertig, bereit für Audio oder renderbereit melden, solange dieser Strukturcheck nicht tatsächlich bestanden wurde.

Ab Wochenstart `2026-08-31` ist die Tagesebene fail-closed Pflicht. Ältere abgeschlossene Wochen bleiben Legacy-kompatibel, dürfen aber nicht als Vorlage für neue Reels kopiert werden.

## 3-Phasen-Modell für Reels

### Phase 1 — Inhalt + Source

Muss enthalten:

- finales Skript + `VOICEOVER-ZUM-KOPIEREN.txt`
- für neue Reels **60–75 Sekunden** Ziel-Laufzeit
- bevorzugt **150–175 Wörter**, bis **190 Wörter** ohne Sonderfreigabe
- `reel.json.scriptBudget.targetMinSeconds = 60` und `targetMaxSeconds = 75`
- Szenen-/Animationsplan
- `story-beats.json`
- `LEVEL-UP-PLAN.json`
- Caption-Basis
- Plattform-Copy
- Bild-/Asset-/Brand-/Proof-/Real-Media-Entscheidung
- `reel.json`
- ausführbaren Remotion-Source
- Composition-Registrierung
- Entertainment-/Motion-Readability-Grundlage
- klaren `PHASE-STATUS.md`

Für neue Reels ab `2026-09-03` gilt Level-Up v3 zusätzlich: mindestens 20 Visual Beats, 4 Visual Worlds, 2 Mid-Reel-Reframes, stärkere Brand-Fidelity und normalerweise 3 purposeful real/official Medienmomente bei branded/current-news Stories.

Für neue Reels ab `2026-09-05` gilt zusätzlich Level-Up v4 mit `06-projektdateien/BRAND-MOTION-PLAN.json` und dem dazugehörigen Brand-/Motion-Gate.

Geschätzte Timings sind nur Preview. Das Wortbudget ist Planung; die echte Laufzeit kommt später aus dem Voice-Lock.

Vor Übergabe an Phase 2 müssen tatsächlich bestanden sein:

```bash
npm run ki:reel:structure-check
node ki/scripts/validate-storytelling-motion.mjs <reel-package-dir>
node ki/scripts/validate-reel-level-up.mjs <reel-package-dir>
```

Für v4 zusätzlich:

```bash
node ki/scripts/validate-reel-brand-motion-v4.mjs <reel-package-dir>
```

### Phase 2 — Voiceover: ausschließlich Nutzer

**Harte Regel:** Das Voiceover wird ausschließlich vom Nutzer erstellt und manuell in `01-script-audio/` abgelegt.

Agenten dürfen niemals:

- ein Voiceover erzeugen,
- ein Voice-/TTS-Tool für das Produktionsaudio aufrufen,
- eine Remote-Audiodatei herunterladen,
- eine Preview-Audiodatei als Ersatz verwenden,
- eine fehlende Nutzerdatei automatisch ersetzen.

Der kanonische Pfad steht in `reel.json -> audio.targetFile`, normalerweise:

`01-script-audio/voiceover.mp3`

Fehlt diese lokale Nutzerdatei, lautet der Status ausschließlich:

`PHASE 2 — WARTET AUF NUTZER-AUDIO`

Erst danach darf Phase 3 beginnen.

### Phase 3 — Sync, Review, Render, Export

Mit lokalem Nutzer-Audio:

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

## Autoritative Reel-Dateien

Wenn vorhanden, gilt grob:

1. `06-projektdateien/PHASE-STATUS.md`
2. `06-projektdateien/reel.json`
3. `01-script-audio/voiceover.md` / `VOICEOVER-ZUM-KOPIEREN.txt`
4. `01-script-audio/audio-source.json`
5. `01-script-audio/SCENE-VOICE-MAP.json`
6. `01-script-audio/WORD-TIMINGS.json` nach Voice-Lock
7. `06-projektdateien/story-beats.json`
8. `06-projektdateien/LEVEL-UP-PLAN.json`
9. `06-projektdateien/BRAND-MOTION-PLAN.json` für v4
10. `03-caption/subtitle-cues.json`
11. `03-caption/platform-copy.md`
12. Asset-/Provenance-Dateien
13. `MOTION-READABILITY-REVIEW.md`

Widersprüche nicht still übergehen; an der Ursache korrigieren.

## Remotion-Regeln

- deterministisch: `useCurrentFrame`, `interpolate`, `spring`, `Sequence`
- kein `Math.random()` im Render
- **keine Render-Time-Netzwerkdownloads**
- lokale Runtime-Medien über vorbereitete `public/`-Assets / `staticFile`
- High Energy bedeutet nicht High Speed
- wichtige Zustände: `REVEAL → SETTLE → READABLE HOLD`
- keine langen statischen Holds nur zum Füllen
- keine Demo-Zahlen als Fakten
- keine internen Regie-/Goal-Texte sichtbar

## Text-/Layout-Hierarchie

- Überschrift: kurz, ordnet ein
- Caption: gesprochener Inhalt, Voice-Locked
- Animationstext: kurze Objekt-/Zustandslabels
- Animation: zeigt Mechanismus

Caption-Geometrie ausschließlich aus `ki/src/reels/captionSafe.ts`. `ki/gehirn/CAPTION_SAFE_POSITION.md` dokumentiert dieselbe Source-Geometrie und darf ihr nicht widersprechen.

## Medien-Wahrheit

Bei Produktions-Voiceover gilt ausschließlich Nutzer-Audio. Andere Medien dürfen nur tatsächlich mit erlaubten Tools erzeugt oder aus echten Nutzer-/Repository-Assets verwendet werden.

Verboten sind erfundene Medien, Dateien, URLs, Logos, Render oder Testergebnisse.

Große Binärmedien bleiben standardmäßig außerhalb normalem Git, solange Git LFS nicht eingerichtet ist. Code, Provenance, Timings, Manifest und Review-Dokumentation werden versioniert.

## Wahrheitspflicht

Nie behaupten, dass Strukturcheck, Test, Typecheck, Forced Alignment, Voice-Lock, Render, Audio, visuelle Prüfung oder Export bestanden sind, wenn dies nicht tatsächlich ausgeführt wurde.

Bei Blocker nennen:

- exakter Befehl
- Fehler
- betroffene Datei
- nächste sinnvolle Aktion

Keine Fehler mit `any`, `@ts-ignore`, deaktivierten Tests, Fake-Assets, Fake-Berichten oder geschwächten Validatoren verstecken.
