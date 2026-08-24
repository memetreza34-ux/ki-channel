# Skill: Voice-Locked Captions

## Zweck

Verhindert, dass Phase-1-Schätzungen als finale Caption-, Wort-, Szenen- oder Composition-Timings verwendet werden.

## Autorität

Sobald der **lokale finale Voiceover-Master** existiert:

`Audio → Wort-Timestamps → Caption-Gruppen → Visual Beats → Szenengrenzen → Composition-Dauer`

Nicht umgekehrt.

Verbindliche Audioquelle: `ki/gehirn/AUDIO_PIPELINE.md`.

## Whisper / Transkription

Für Phase 3 müssen präzise Wort-Timestamps aus dem tatsächlichen lokalen Audio erzeugt werden, bevorzugt mit Whisper bzw. einer gleichwertig präzisen Transkriptionsmethode.

Wichtig:

- Das Repo behauptet **keinen speziellen Alignment-Befehl**, solange dafür kein tatsächlich vorhandenes, getestetes Script existiert.
- `@remotion/install-whisper-cpp` ist als Dependency vorhanden, aber ein Agent darf daraus nicht automatisch behaupten, ein bestimmtes Wrapper-Script existiere.
- Der kanonische Sprechertext bleibt Text-Autorität; STT-Fehler dürfen ihn nicht umschreiben.
- Das Ergebnis muss als echte `words[]`-Timings in `subtitle-cues.json` landen.

## Finale Datenanforderung

`subtitle-cues.json` muss vor Production-Render:

- `timingStatus` beginnend mit `VOICE_LOCKED` haben
- pro Cue `words[]` enthalten
- Worttexte den Cue-Text exakt rekonstruieren
- keine Wortüberlappungen haben
- Cue-/Wortframes innerhalb der Voice-Locked-Szenengrenzen halten

`reel.json` muss gleichzeitig:

- `format.finalDurationInFrames` setzen
- alle Szenen kontinuierlich von Frame 0 bis finalDuration führen
- pro Szene `timingStatus: VOICE_LOCKED` setzen
- `audio.observedAudioDurationSeconds` bzw. gleichwertige echte Audio-Dauer dokumentieren

## Caption-Gruppen

- nach Sinn/Phrase gruppieren
- typischerweise 3–6 Wörter
- maximal 2 Zeilen
- natürliche Pausen respektieren
- kein aktives Wort während echter Sprechpause

Layout kommt **nicht** aus diesem Skill, sondern ausschließlich aus `captionSafe.ts` / `CAPTION_SAFE_POSITION.md`.

## Visual-Sync

Für starke Beats:

```text
gesprochenes Wort / Phrase
→ echter Frame
→ visueller Trigger
→ erwarteter Zustand
```

Szenenwechsel bevorzugt nach Satzende, klarer Pause oder hörbarem Gedankenwechsel.

## Wenn Audio kürzer/länger als Planung ist

1. Szenen/Animation/Holds an echte Stimme anpassen
2. Visuals reduzieren, falls zu viele Informationen in eine Phrase gepackt wurden
3. `reel.json` und Caption-Timings neu schreiben
4. nur bei Bedarf natürliches, pitch-erhaltendes Phrase-Retiming im erlaubten Korridor

Nie das Voiceover gegen alte Plan-Cues laufen lassen.

## Validierung

Vor Production-Render:

```bash
node ki/scripts/validate-voice-locked-captions.mjs <reel-package-dir>
node ki/scripts/prepare-reel-render.mjs <reel-package-dir>
```

`prepare-reel-render.mjs` blockiert insbesondere alte Plan-Dauer, nicht-Voice-Locked-Szenen und fehlendes lokales Audio.

## Freigabe

Kein Final-Render, wenn:

- Wort-Timestamps fehlen
- Timingstatus nur Preview/Planning ist
- Szenen nicht auf echtem Audio liegen
- Composition-Dauer noch Planwert ist
- Caption hörbar vor-/nachläuft
- aktives Wort nicht zur Stimme passt
