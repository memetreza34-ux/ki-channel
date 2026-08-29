# KI-Reels — Produktionsvertrag

Gilt für alle Produktionspakete unter `ki/reels/`.

## Struktur — fail-closed

```text
ki/reels/YYYY-MM-DD_bis_YYYY-MM-DD/NN_Reel-Titel/
├── README.md
├── 01-script-audio/
├── 02-bilder/
├── 03-caption/
├── 04-pdf/
├── 05-export/
└── 06-projektdateien/
```

Ausführbarer TS/TSX-Code liegt separat unter `ki/src/reels/<slug>/`.

**Harte Strukturregel:** Ein Reel-Paket ist nicht gültig, wenn auch nur einer der sechs nummerierten Pflichtordner fehlt. Jeder Pflichtordner muss mindestens eine Datei enthalten (`.gitkeep`, `README.md` oder echte Produktionsdatei), weil Git leere Ordner nicht versioniert.

Neue Reel-Pakete grundsätzlich über den kanonischen Generator anlegen:

```bash
npm run new-video -- "Reel Titel" YYYY-MM-DD
```

Manuell angelegte oder importierte Reel-Pakete müssen exakt dieselbe Struktur erfüllen.

Nach **jeder** Änderung, Erstellung, Migration oder Integration unter `ki/reels/**` ist vor einer Erfolgsmeldung zwingend auszuführen:

```bash
npm run ki:reel:structure-check
```

Schlägt dieser Befehl fehl, darf kein Agent das Reel als `IMPLEMENTIERT`, `PHASE 1 FERTIG`, `BEREIT FÜR AUDIO`, `RENDER-READY` oder ähnlich melden. Erst die Struktur korrigieren und erneut prüfen.

Der Strukturcheck validiert zusätzlich den Generator selbst: Alle sechs Pflichtordner und Git-stabile Platzhalter müssen weiterhin im Scaffold vorhanden sein.

## Phase 1 — Inhalt + Source

Pflicht:

- `VOICEOVER-ZUM-KOPIEREN.txt` mit exakt dem später gesprochenen Text
- neues Standard-Reel zielt auf **60–75 Sekunden** tatsächliche Voice-Locked-Laufzeit
- bevorzugt **150–175 gesprochene Wörter**, bis **190 Wörter** ohne Sonderfreigabe
- `reel.json.scriptBudget.targetMinSeconds = 60` und `targetMaxSeconds = 75`
- `SCENE-VOICE-MAP.json`: jeder Satz wird vor dem Audio-Lock einer Szene zugeordnet
- `reel.json`
- Szene-/Animationsplan
- Entertainment- und Motion-Review-Struktur
- Preview-Captions nur als Planung
- Plattform-Copy + Final-Caption
- ausführbarer Source + Composition

Bevor Phase 1 als abgeschlossen und das Reel an den Nutzer für Phase 2 übergeben wird, ist `npm run ki:reel:structure-check` Pflicht.

Vor Production-Render wird das Skriptbudget fail-closed geprüft:

```bash
node ki/scripts/validate-reel-script-budget.mjs <reel-package-dir>
```

Nach dem lokalen Voice-Lock prüft `prepare-reel-render.mjs` zusätzlich die echte finale Laufzeit. Für neue Reels gilt: unter 60 oder über 75 Sekunden blockiert den Production-Render, solange keine dokumentierte Ausnahme vorliegt.

## Phase 2 — Voiceover ausschließlich vom Nutzer

Der Nutzer erstellt das vollständige Produktions-Voiceover selbst und legt es manuell unter `reel.json.audio.targetFile` ab.

Normaler Pfad:

`01-script-audio/voiceover.mp3`

Agenten dürfen **kein** Produktions-Voiceover erzeugen oder herunterladen. Keine TTS-/Voice-Tools, keine Provider-URLs und keine Preview-Dateien als Ersatz.

Fehlt die Datei, bleibt der Reel auf:

`PHASE 2 — WARTET AUF NUTZER-AUDIO`

## Phase 3 — lokaler Sync, Render, Export

Primärer Timing-Weg bei bekanntem Sprechertext:

```text
Nutzer-Voiceover
→ Runtime-PCM-WAV
→ lokales Forced Alignment des bekannten Textes
→ WORD-TIMINGS.json
→ finale Caption-Cues
→ automatische Szenengrenzen aus SCENE-VOICE-MAP
→ VOICE_LOCKED
```

Ein-Kommando-Sync:

```bash
node ki/scripts/align-reel-local.mjs <reel-package-dir>
```

Danach müssen bestehen:

```bash
node ki/scripts/validate-local-forced-alignment.mjs <reel-package-dir>
node ki/scripts/validate-scene-voice-map.mjs <reel-package-dir>
node ki/scripts/validate-voice-locked-captions.mjs <reel-package-dir>
node ki/scripts/prepare-reel-render.mjs <reel-package-dir>
```

Die gelockten JSON-Dateien werden vor dem Production-Render committed.

## Visual / Motion

- Product/UI-first bei konkreten Apps/Features
- Light-First
- `SETUP → AKTION → KONSEQUENZ → PAYOFF`
- wichtige Zustände: `REVEAL → SETTLE → READABLE HOLD`
- höchstens 1–2 neue unabhängige Informationen gleichzeitig
- ungefähr 70–80 % native UI/Text/Diagramm/Motion
- ungefähr 20–30 % echte Bilder/Screens, normalerweise 1–2 starke externe Visual-Momente
- externe Visuals nur bei echtem Mehrwert und mit lokalem Rechte-/SHA256-Vertrag
- Kameraeffekte wie Push, Pan, Focus, Parallax und Scan nur mit Erklärfunktion
- SFX müssen semantisch zum sichtbaren Ereignis passen und bei 1x tatsächlich angehört werden

## Caption Layout

Einzige Wahrheit:

- `ki/gehirn/CAPTION_SAFE_POSITION.md`
- `ki/src/reels/captionSafe.ts`

Bei 1080×1920: bottom 250px, 104px Inset, max 860px, max 2 Zeilen, Glass-/Blur-Overlay, kein separater Footer.

## Finaler Export

Nach finalem MP4 + echtem 1x-Review:

```bash
node ki/scripts/finalize-reel-export.mjs <reel-package-dir> <rendered-video.mp4>
node ki/scripts/validate-reel-export-package.mjs <reel-package-dir>
```

Erst nach vollständiger Prüfung:

`FINAL VIDEO READY — EXPORT PACKAGE READY`
