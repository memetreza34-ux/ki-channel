# KI-Reels — Produktionsvertrag

Gilt für alle Produktionspakete unter `ki/reels/`.

Zusätzlich verbindlich für neue/narrative Reels:

- `ki/gehirn/STORYTELLING_MOTION.md`
- `ki/gehirn/LEVEL_UP_STANDARD.md`

## Struktur — fail-closed

Seit der aktiven Woche `2026-08-31_bis_2026-09-06` gilt kanonisch:

```text
ki/reels/YYYY-MM-DD_bis_YYYY-MM-DD/
├── 01_Montag/
│   └── 01_Reel-Titel/
├── 02_Dienstag/
│   └── 01_Reel-Titel/
├── 03_Mittwoch/
│   └── 01_Reel-Titel/
├── 04_Donnerstag/
├── 05_Freitag/
├── 06_Samstag/
└── 07_Sonntag/
```

Innerhalb jedes Themen-/Reel-Ordners:

```text
NN_Reel-Titel/
├── README.md
├── 01-script-audio/
├── 02-bilder/
├── 03-caption/
├── 04-pdf/
├── 05-export/
└── 06-projektdateien/
```

Die Hierarchie ist immer:

`Woche → Wochentag → Thema/Reel → 01–06 Produktionsordner`

Mehrere Reels am selben Tag werden **innerhalb des Tages** nummeriert (`01_`, `02_`, `03_` ...). Die Reel-Nummer ist nicht mehr die Wochentagsnummer.

Ausführbarer TS/TSX-Code liegt separat unter `ki/src/reels/<slug>/`.

**Harte Strukturregel:** Ein aktuelles/neues Reel-Paket ist nicht gültig, wenn Wochentagsordner, Themenordner oder einer der sechs Pflichtordner fehlt. Jeder Pflichtordner muss mindestens eine persistente Datei enthalten.

Neue Reel-Pakete grundsätzlich über den kanonischen Generator anlegen:

```bash
npm run new-video -- "Reel Titel" YYYY-MM-DD
```

Der Generator besteht aus:

- `scripts/new-ki-reel.mjs` — bestimmt Woche + Wochentag + Topic-Slot;
- `scripts/new-ki-reel-core.mjs` — erzeugt den vollständigen 01–06-/Story-/Level-Up-Scaffold.

Nach **jeder** Änderung, Erstellung oder Migration unter `ki/reels/**` zwingend:

```bash
npm run ki:reel:structure-check
```

Schlägt der Check fehl, darf kein Agent das Reel als `IMPLEMENTIERT`, `PHASE 1 FERTIG`, `BEREIT FÜR AUDIO` oder `RENDER-READY` melden.

Ältere abgeschlossene Wochen vor `2026-08-31` bleiben Legacy-kompatibel, bis sie aktiv weiterentwickelt/migriert werden. Neue Arbeit darf die alte flache Wochenstruktur nicht kopieren.

## Phase 1 — Inhalt + Source

Pflicht für neue Standard-Reels:

- `VOICEOVER-ZUM-KOPIEREN.txt` mit exakt dem später gesprochenen Text
- **60–75 Sekunden** tatsächliche Voice-Locked-Laufzeit
- bevorzugt **150–175 Wörter**, Hard-Limit **190 Wörter** ohne dokumentierte Ausnahme
- `SCENE-VOICE-MAP.json`
- `reel.json`
- `story-beats.json`
- `LEVEL-UP-PLAN.json`
- Story-/Visual-/Brand-/Proof-/Real-Media-/SFX-Plan
- Plattform-Copy + Final-Caption
- ausführbarer Remotion-Source + Composition

Für neue Reels ab `2026-09-03` gilt Level-Up v3:

- mindestens **20 konkrete Visual Beats**
- mindestens **4 unterscheidbare Visual Worlds**
- mindestens **2 Mid-Reel-Reframes/World-Breaks**
- fertiger Cover-Kandidat in der ersten Sekunde
- bei branded/current-news normalerweise mindestens 2 erkennbare Brand-Momente über mindestens 2 Szenen
- normalerweise mindestens 3 purposeful real/official Media-Momente oder dokumentierte Ausnahme
- keine generischen Funktionsicons als Fake-Logo
- keine ungenaue frei erfundene Logo-Rekonstruktion
- sichtbare Entwicklung ungefähr alle 1,5–3,0 s bei aktiver Sprache
- ein primärer Fokus pro Moment; Caption nie über kritischem Visual

Vor Phase 2 tatsächlich ausführen:

```bash
npm run ki:reel:structure-check
node ki/scripts/validate-storytelling-motion.mjs <reel-package-dir>
node ki/scripts/validate-reel-level-up.mjs <reel-package-dir>
```

Vor Production-Render zusätzlich:

```bash
node ki/scripts/validate-reel-script-budget.mjs <reel-package-dir>
```

## Phase 2 — Voiceover ausschließlich vom Nutzer

Der Nutzer erstellt das vollständige Produktions-Voiceover selbst und legt es manuell im Reel-Paket ab.

Normaler Pfad:

`01-script-audio/voiceover.mp3`

Agenten dürfen **kein** Produktions-Voiceover erzeugen oder herunterladen. Keine TTS-/Voice-Tools, keine Provider-URLs und keine Preview-Dateien als Ersatz.

Fehlt die Datei:

`PHASE 2 — WARTET AUF NUTZER-AUDIO`

## Phase 3 — lokaler Sync, Render, Export

```text
Nutzer-Voiceover
→ Runtime-PCM-WAV
→ Pause-Kompression
→ lokales Forced Alignment
→ WORD-TIMINGS.json
→ finale Caption-Cues
→ Scene-/Reveal-/SFX-Lock
→ VOICE_LOCKED
```

Ein-Kommando-Sync:

```bash
node ki/scripts/align-reel-local.mjs <reel-package-dir>
```

Danach müssen die kanonischen Voice-/Story-/Level-Up-/Render-Gates bestehen.

## Visual / Motion

- nicht „eine Szene = eine statische Karte“
- `HOOK → PROBLEM/CHANGE → PROOF → CONSEQUENCE → PAYOFF`
- zentrale Marke/Produkt visuell wirklich erkennbar machen
- echte offizielle UI/Wordmark/Source bevorzugen, wenn sauber nutzbar
- echte Bilder/Videos nur mit Story-Zweck
- reales Video bevorzugen, wenn Bewegung selbst Teil des Claims ist
- externe Medien vor Render lokal + Provenance + SHA256
- keine Render-Time-Remote-Medien
- `StoryBeat`, `StoryCamera`, `ImpactNumber`, `StoryTexture`, `StoryThreeHero`, lokale Lottie/Rive-/Skia-Layer bevorzugt wiederverwenden
- SFX nur an sichtbaren semantischen Events; Voice bleibt dominant

## Caption Layout

Einzige Wahrheit:

- `ki/gehirn/CAPTION_SAFE_POSITION.md`
- `ki/src/reels/captionSafe.ts`

Aktueller 1080×1920-Default:

- bottom **330 px**
- horizontal inset **76 px**
- max width **928 px**
- ca. **40 px** Schrift
- max. 2 Zeilen
- Ziel max. 6 Wörter je sichtbarer Gruppe
- Cover-Fenster caption-frei

## Finaler 1x-Review

Der exakte gemasterte MP4 ist die einzige Autorität. Für Level-Up-v3-Reels zusätzlich explizit prüfen:

- `COVER_FRAME_READY`
- `COVER_FRAME_CLEAN`
- `BRAND_FIDELITY`
- `BRAND_RECOGNIZABLE_WITHOUT_CAPTION`
- `PRIMARY_BRAND_REAPPEARS`
- `REAL_BRAND_ASSET_USED_OR_EXCEPTION`
- `REAL_PROOF_MOMENT`
- `REAL_MEDIA_MIX`
- `REAL_MEDIA_NOT_JUST_SOURCE_CARDS`
- `SCENE_DENSITY`
- `NO_VISUAL_OVERLAP`
- `VISUAL_WORLD_VARIETY`
- `MID_REEL_REFRAMES`
- `MOTION_GRAMMAR_DIVERSITY`
- `VOICE_PRIORITY_OVER_SFX`

## Finaler Export

```bash
node ki/scripts/finalize-reel-export.mjs <reel-package-dir> <rendered-video.mp4>
node ki/scripts/validate-reel-export-package.mjs <reel-package-dir>
```

Erst nach vollständiger realer Prüfung:

`FINAL VIDEO READY — EXPORT PACKAGE READY`
