# Lokales Forced Alignment — kanonischer Sync-Standard

Diese Datei ist die kanonische Regel für **Stimme ↔ Untertitel ↔ Szene**.

## Ziel

Das Repo kennt den Sprechertext bereits vor dem Audio. Deshalb wird für finale Timings **kein freies Transkriptionsraten** mehr als Standard verwendet.

Finale Reihenfolge:

```text
VOICEOVER-ZUM-KOPIEREN.txt
+
SCENE-VOICE-MAP.json
+
exakte Runtime-PCM-WAV
        ↓
lokales Forced Alignment
        ↓
WORD-TIMINGS.json
        ↓
subtitle-cues.json
        ↓
automatische Szenengrenzen
        ↓
VOICE_LOCKED
```

## Kosten / Limits

Die Standardlösung läuft lokal:

- keine Cloud-API nötig
- kein Abo
- keine Minuten-/Zeichenquote
- nach dem ersten Model-Download beliebig oft nutzbar
- Grenze ist nur lokale Rechenzeit/Speicher

## Backend-Auswahl

### Apple Silicon — bevorzugt

`mlx-qwen3`

- Paket: `mlx-audio==0.5.0`
- Modell: `mlx-community/Qwen3-ForcedAligner-0.6B-8bit`
- Deutsch unterstützt
- Paket: MIT
- Modell: Apache-2.0
- Modellgröße ca. 1.3 GB; Download nur beim ersten Gebrauch

### Andere Systeme — Fallback

`ctc-german`

- Code: `MahmoudAshraf97/ctc-forced-aligner`, auf Repo-Commit `11855d1de76af2b490dd2e8e2db2661805ae90a0` gepinnt
- Modell: `facebook/wav2vec2-large-xlsr-53-german`
- Modell: Apache-2.0
- Sprache: Deutsch
- CPU oder CUDA

**Wichtig:** Das standardmäßige MMS-Modell des CTC-Projekts wird absichtlich **nicht** benutzt. Seine Standardgewichte sind CC-BY-NC und sind deshalb nicht der kanonische Modellpfad für monetarisierte/commercial Reels.

## Einmalige Installation

Automatisch passend zum Rechner:

```bash
npm run aligner:setup
```

Explizit:

```bash
npm run aligner:setup -- --backend=mlx-qwen3
npm run aligner:setup -- --backend=ctc-german
```

Die Python-Umgebung liegt lokal unter `.cache/reel-aligner-venv/` und wird nicht committed.

## Ein Reel synchronisieren

```bash
npm run reel:align -- <reel-package-dir>
```

Der Befehl macht automatisch:

1. Runtime-PCM-WAV aus dem echten Voiceover erzeugen
2. exakten Sprechertext gegen diese WAV forciert ausrichten
3. `01-script-audio/WORD-TIMINGS.json` schreiben
4. Caption-Blöcke aus echten Wortzeiten erzeugen
5. jeden Caption-Block über `SCENE-VOICE-MAP.json` der richtigen Szene zuordnen
6. Szenenstarts aus dem ersten tatsächlich gesprochenen Wort der jeweiligen Szene ableiten
7. finale Composition-Dauer aus der Runtime-WAV setzen
8. Scene-Voice- und Voice-Lock-Gates ausführen

Es gibt **kein fuzzy guessing**. Wenn Wortanzahl oder Wortreihenfolge nicht exakt zum kanonischen Sprechertext passen, schlägt der Vorgang fehl statt falsche Timings zu akzeptieren.

## Dateien

```text
01-script-audio/
├── VOICEOVER-ZUM-KOPIEREN.txt   # Text-Autorität
├── SCENE-VOICE-MAP.json          # Satz → Szene
├── WORD-TIMINGS.json             # lokale Forced-Alignment-Ausgabe
└── voiceover.mp3/.wav            # lokaler Master

03-caption/
└── subtitle-cues.json            # aus WORD-TIMINGS erzeugt
```

## Warum nicht Whisper als Standard?

Whisper bleibt nützlich für unbekanntes Audio. Bei diesen Reels ist der Text aber bereits exakt bekannt. Forced Alignment beantwortet daher die richtige Frage:

> Wann wurde **dieser bekannte Text** tatsächlich gesprochen?

und nicht:

> Was könnte hier gesprochen worden sein?

Whisper kann als Diagnose-/Fallback-Werkzeug bleiben, ist aber nicht mehr die primäre Timing-Autorität für normale KI-Voiceover.

## Production Gate

Nach erfolgreichem Alignment werden die erzeugten JSON-Dateien geprüft und committed. Erst danach:

```bash
node ki/scripts/prepare-reel-render.mjs <reel-package-dir>
```

Kein Production-Render mit Planning-/Preview-Cues.
