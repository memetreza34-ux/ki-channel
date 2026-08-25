# Skill: Voice-Locked Captions

## Zweck

Verhindert, dass Phase-1-Schätzungen als finale Caption-, Wort-, Szenen- oder Composition-Timings verwendet werden.

## Zwei getrennte Skript-Wahrheiten

Für jedes Reel gibt es zwei Pflichtdateien:

```text
01-script-audio/VOICEOVER-ZUM-KOPIEREN.txt
01-script-audio/SCENE-VOICE-MAP.json
```

`VOICEOVER-ZUM-KOPIEREN.txt` enthält nur den exakten Sprechertext.

`SCENE-VOICE-MAP.json` legt **vor dem Alignment** fest, welcher exakte Satz zu welcher Szene gehört. Der Agent darf diese Zuordnung später nicht aus dem kompletten Audio erraten.

## Autorität

Sobald der lokale Voiceover-Master existiert:

```bash
node ki/scripts/prepare-reel-audio.mjs <reel-package-dir>
```

Danach gilt:

`SCENE-VOICE-MAP + Runtime-PCM-WAV → Wort-Timestamps → Caption-Gruppen → Szenengrenzen → Visual Beats → Composition-Dauer`

Die Runtime-WAV unter `public/runtime-audio/<compositionId>.wav` ist exakt die Audiospur, die Remotion rendert.

## Alignment

Für Phase 3 müssen präzise Wort-Timestamps aus der Runtime-WAV erzeugt werden.

Verbindlich:

- Sprechertext bleibt Text-Autorität.
- `SCENE-VOICE-MAP.json` bleibt Szenen-Autorität.
- STT darf weder Wörter umschreiben noch Sätze in andere Szenen verschieben.
- Caption-Blöcke dürfen einen Satz in mehrere kleine Cues teilen.
- Alle Cues einer Szene zusammen müssen exakt den gemappten Sprechertext dieser Szene rekonstruieren.
- `subtitle-cues.json` enthält echte `words[]`-Timings.

## Automatischer Scene-Lock

Nach echten Wortzeiten:

```bash
node ki/scripts/lock-scene-timing-from-captions.mjs <reel-package-dir>
```

Das Script setzt automatisch:

- scene1.startFrame = 0
- scene2+ startFrame = erstes wirklich gesprochenes Wort der ersten gemappten Caption dieser Szene
- scene.endFrame = Start der nächsten gemappten Szene
- letzte Szene endet an der realen Runtime-WAV-Dauer
- `format.finalDurationInFrames`
- `audio.observedAudioDurationSeconds`
- alle Szenen auf `timingStatus: VOICE_LOCKED`
- Captions auf `VOICE_LOCKED_SCENE_MAPPED`

Damit muss der Agent Szenengrenzen nicht mehr von Hand schätzen.

## Scene-Voice-Gate

```bash
node ki/scripts/validate-scene-voice-map.mjs <reel-package-dir>
```

Prüft:

- alle gemappten Sätze rekonstruieren exakt `VOICEOVER-ZUM-KOPIEREN.txt`
- Satz-IDs eindeutig
- jeder Satz zeigt auf eine existierende Szene
- Szenen-Reihenfolge läuft nicht rückwärts
- jede Szene hat mindestens einen gemappten Satz
- Caption-Texte pro Szene rekonstruieren exakt den gemappten Sprechertext
- bei `VOICE_LOCKED` startet jede Szene am ersten gemappten gesprochenen Wort innerhalb der Toleranz

## Finale Datenanforderung

`subtitle-cues.json`:

- `timingStatus` beginnt mit `VOICE_LOCKED`
- pro Cue `words[]`
- Worttexte rekonstruieren Cue-Text exakt
- keine Wortüberlappungen
- Cue-/Wortframes innerhalb ihrer Voice-Locked-Szene

`reel.json`:

- `sceneVoiceMap.file` gesetzt
- `format.finalDurationInFrames` gesetzt
- Szenen kontinuierlich von Frame 0 bis finalDuration
- pro Szene `timingStatus: VOICE_LOCKED`
- echte Runtime-WAV-Dauer dokumentiert

## Caption-Gruppen

- typischerweise 3–6 Wörter
- maximal 2 Zeilen
- natürliche Pausen respektieren
- kein aktives Wort während echter Sprechpause
- Sätze dürfen innerhalb derselben Szene in mehrere Cues geteilt werden

Layout kommt ausschließlich aus `captionSafe.ts` / `CAPTION_SAFE_POSITION.md`.

## Visual-Sync

Starke Beats hängen an denselben Wortzeiten wie Szene und Caption:

```text
gemappter Satz / Schlüsselphrase
→ echter Frame in der Runtime-WAV
→ Scene-Start oder visueller Trigger
→ Caption derselben Szene
```

## Validierung vor Production-Render

```bash
node ki/scripts/prepare-reel-audio.mjs <reel-package-dir>
# Alignment gegen public/runtime-audio/<compositionId>.wav
node ki/scripts/lock-scene-timing-from-captions.mjs <reel-package-dir>
node ki/scripts/validate-scene-voice-map.mjs <reel-package-dir>
node ki/scripts/validate-voice-locked-captions.mjs <reel-package-dir>
# gelockte Dateien committen
node ki/scripts/prepare-reel-render.mjs <reel-package-dir>
```

`prepare-reel-render.mjs` führt den Scene-Voice-Gate erneut aus und bindet `SCENE-VOICE-MAP.json` per SHA256 in den Render-Provenance-Lock ein.

## Freigabe

Kein Final-Render, wenn:

- `SCENE-VOICE-MAP.json` fehlt/unvollständig ist
- Satz → Szene nicht eindeutig ist
- Caption-Text einer Szene nicht zum gemappten Sprechertext passt
- Szenenstart nicht zum ersten gemappten Wort passt
- Runtime-WAV fehlt
- Wort-Timestamps fehlen
- Timingstatus nur Preview/Planning ist
- Composition-Dauer noch Planwert ist
- Caption hörbar vor-/nachläuft
