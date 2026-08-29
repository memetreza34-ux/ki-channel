# KI-Kanal — verbindlicher Reel-Produktionsablauf

Dieser Ablauf ist der Normalfall für jedes neue Short-Form-Reel.

## Phase 1 — Inhalt + Source

Ziel: vollständige Produktionsgrundlage, bevor Timing geraten werden müsste.

Pflicht:

- Thema/Fakten/Quellen
- finales `voiceover.md`
- exaktes `VOICEOVER-ZUM-KOPIEREN.txt`
- neues Standard-Reel: **60–75 Sekunden** tatsächliche Voice-Locked-Laufzeit
- bevorzugt **150–175 gesprochene Wörter**, bis **190 Wörter** ohne Sonderfreigabe
- `reel.json.scriptBudget.targetMinSeconds = 60` und `targetMaxSeconds = 75`
- kürzer/länger nur mit dokumentierter Ausnahme in `reel.json.scriptBudget`
- `SCENE-VOICE-MAP.json`: jeder exakte Satz gehört genau zu einer Szene
- Szenenplan + `animation-plan.md`
- semantische `sfx-events.json`
- `visual-assets.json`: bewusste Visual-Entscheidung pro Szene
- `ENTERTAINMENT-REVIEW.md`
- `MOTION-READABILITY-REVIEW.md` zunächst `PENDING`
- `subtitle-cues.json` nur als Preview-Basis, solange kein Audio-Lock vorliegt
- Plattform-Copy + `FINAL-CAPTION.txt`
- `reel.json`
- ausführbarer Source unter `ki/src/reels/<slug>/`
- Composition in `Root.tsx`

### Script-Budget- und Laufzeit-Gate

Vor Production-Render prüft fail-closed:

```bash
node ki/scripts/validate-reel-script-budget.mjs <reel-package-dir>
```

Nach dem Voice-Lock ist die echte Audio-Dauer maßgeblich: neue Reels müssen **60 bis 75 Sekunden** lang sein. Zu kurze Reels werden nicht mit Leerlauf gestreckt; zu lange Reels werden nicht durch hektisches Sprechen gerettet.

### Visual Beat Contract

Für wichtige Beats dokumentieren:

```text
Sprecherphrase
→ Bedeutung
→ Startzustand
→ Reveal
→ Settle
→ lesbarer Hold
→ Endzustand
→ NEW_BUILD / REUSE_EXACT
```

### Visual-Asset-Entscheidung

Pro Szene bewusst wählen:

- `NATIVE_UI`
- `OFFICIAL_SOURCE_CARD`
- `WIKIMEDIA_COMMONS`
- `GITHUB_RAW`

Richtwert: ungefähr 70–80 % native Visuals und 20–30 % echte Bilder/Screens; meist 1–2 starke externe Visual-Momente statt Füllmaterial.

Kamera-/Motion-Effekte wie Push, Pan, Focus, Parallax und Scan nur mit Erklär-/Fokusnutzen. Semantische SFX werden an sichtbare Events gebunden und später bei 1x gehört.

---

## Phase 2 — Nutzer erstellt das Voiceover

Verbindlich: `AUDIO_PIPELINE.md`.

**Nur der Nutzer erzeugt das Produktions-Voiceover.**

Ablauf:

1. Agent stellt das finale `VOICEOVER-ZUM-KOPIEREN.txt` bereit.
2. Nutzer erzeugt das vollständige Voiceover selbst.
3. Nutzer legt die Audiodatei manuell unter `reel.json -> audio.targetFile` ab, normalerweise `01-script-audio/voiceover.mp3`.
4. Erst danach darf Phase 3 beginnen.

Agenten dürfen nicht:

- selbst TTS/Voiceover erzeugen,
- Voice-/TTS-Tools für das Produktionsaudio verwenden,
- Audiodateien aus Provider-/Remote-URLs herunterladen,
- Preview-Audio als Ersatz benutzen.

Wenn die Datei fehlt: **STOP — WARTET AUF NUTZER-AUDIO**.

---

## Phase 3 — Timing-Lock, Assets, Render, Master, Review, Export

### 1. Runtime-Audio + Pause-Kompression

```bash
node ki/scripts/prepare-reel-audio.mjs <reel-package-dir>
```

Ergebnis: `public/runtime-audio/<compositionId>.wav`.

### 2. Exaktes lokales Forced Alignment

```bash
node ki/scripts/align-reel-local.mjs <reel-package-dir>
```

Daraus entstehen:

- `WORD-TIMINGS.json`
- finale Caption-Cues
- finale Szenengrenzen
- finale Composition-Dauer
- `VOICE_LOCKED`
- automatische SFX-Auflösung nach finalen Szenenframes

### 3. Externe Visuals lokal auflösen

```bash
node ki/scripts/resolve-reel-visual-assets.mjs <reel-package-dir>
node ki/scripts/validate-reel-visual-assets.mjs <reel-package-dir>
```

Keine Remote-Media-URL im Remotion-Render.

### 4. Source/Timing/Asset-Änderungen committen

Renderrelevante JSON-/Source-Dateien finalisieren und committen.

### 5. Pre-Render-Gates

```bash
node ki/scripts/prepare-reel-render.mjs <reel-package-dir>
```

Dieser Schritt prüft Script-Budget, tatsächliche Voice-Locked-Dauer von 60–75 Sekunden und bindet Source, Scene-Voice-Map, Word-Timings, Captions, SFX, Visuals, Nutzer-Audio, Runtime-WAV und finale Dauer.

### 6. Remotion-Roh-Render

1080×1920, 30 fps, lokale Runtime-Medien.

### 7. Social-Audio-Master

```bash
node ki/scripts/master-reel-video.mjs <raw-render.mp4> <mastered-render.mp4>
node ki/scripts/validate-social-audio-master.mjs <mastered-render.mp4>
node ki/scripts/validate-final-video.mjs <mastered-render.mp4>
```

Ziel: etwa −16 LUFS Integrated, −1,5 dBTP True Peak.

### 8. Exakten gemasterten MP4 bei 1x reviewen

Prüfen:

- Opening/Hook
- Pacing und Pausen
- Caption-/Voice-Sync
- SFX-Timing und Lautstärke
- echte Bilder: Relevanz, Crop, Bewegung
- Zoom/Focus/Parallax
- Source-Proof-Lesbarkeit
- keine visuelle Überladung
- Stimme klar
- Gesamtdauer 60–75 Sekunden oder dokumentierte Ausnahme

### 9. Final-Export

```bash
node ki/scripts/finalize-reel-export.mjs <reel-package-dir> <mastered-render.mp4>
node ki/scripts/validate-reel-export-package.mjs <reel-package-dir>
```

Erst nach echtem Ansehen/Anhören:

`FINAL VIDEO READY — EXPORT PACKAGE READY`

## Stop-Bedingungen

Nicht als fertig melden bei:

- fehlendem **Nutzer-Voiceover**
- Versuch eines Agenten, Voiceover zu erzeugen oder herunterzuladen
- Script außerhalb des zulässigen Budgets ohne dokumentierte Ausnahme
- Voice-Locked-Dauer außerhalb 60–75 Sekunden ohne dokumentierte Ausnahme
- Remote-Audio oder Remote-Bild als Renderquelle
- fehlendem Forced Alignment / Voice-Lock
- falscher Szenen-/Audio-Dauer
- unresolved oder nicht lizenzgeprüften externen Visuals
- zu schnellen/unlesbaren Beats
- Caption-/Visual-Kollision
- fehlgeschlagenen Tests/Validatoren
- stummem oder zu leisem Video
- nicht bestandenem Social-Audio-Master
- fehlendem Export-Paket
- nicht angesehenem/nicht angehörtem gemasterten Final-MP4
