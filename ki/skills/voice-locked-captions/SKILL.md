# Skill: Voice-Locked Captions

## Zweck

Verhindert, dass Phase-1-Schätzungen als finale Caption-, Wort-, Szenen- oder Composition-Timings verwendet werden.

## Zwei getrennte Skript-Wahrheiten

Für jedes Reel gibt es künftig zwei Pflichtdateien:

```text
01-script-audio/VOICEOVER-ZUM-KOPIEREN.txt
01-script-audio/SCENE-VOICE-MAP.json
```

`VOICEOVER-ZUM-KOPIEREN.txt` enthält **nur** den exakten Sprechertext.

`SCENE-VOICE-MAP.json` enthält vor dem Alignment die explizite Zuordnung:

```text
Satz S01 → scene1
Satz S02 → scene2
Satz S03 → scene2
...
```

Der Agent darf diese Zuordnung später **nicht aus dem Audio erraten**. Er muss nur noch herausfinden, **wann** der bereits gemappte Satz in der Runtime-WAV gesprochen wird.

## Autorität

Sobald der lokale Voiceover-Master existiert, wird zuerst die deterministische Runtime-Audiospur erzeugt:

```bash
node ki/scripts/prepare-reel-audio.mjs <reel-package-dir>
```

Danach gilt:

`SCENE-VOICE-MAP + Runtime-PCM-WAV → Wort-Timestamps → Caption-Gruppen → Szenengrenzen → Visual Beats → Composition-Dauer`

Nicht umgekehrt.

Die Runtime-WAV unter `public/runtime-audio/<compositionId>.wav` ist exakt die Audiospur, die Remotion später rendert. Damit werden MP3-Container-Padding und ein zweites verlustbehaftetes Encoding aus der finalen Timing-Kette entfernt.

Verbindliche Audioquelle: `ki/gehirn/AUDIO_PIPELINE.md`.

## Whisper / Alignment

Für Phase 3 müssen präzise Wort-Timestamps aus der **vorbereiteten Runtime-WAV** erzeugt werden, bevorzugt mit Whisper bzw. einer gleichwertig präzisen Alignment-Methode.

Wichtig:

- Der kanonische Sprechertext bleibt Text-Autorität; STT-Fehler dürfen ihn nicht umschreiben.
- `SCENE-VOICE-MAP.json` bleibt Szenen-Autorität; Alignment darf keine Sätze in andere Szenen verschieben.
- Caption-Blöcke dürfen einen gemappten Satz in mehrere kleine Cues teilen.
- Alle Cues einer Szene zusammen müssen den gemappten Sprechertext dieser Szene exakt rekonstruieren.
- Das Ergebnis muss als echte `words[]`-Timings in `subtitle-cues.json` landen.

## Scene-Voice-Lock

Vor Production-Render:

```bash
node ki/scripts/validate-scene-voice-map.mjs <reel-package-dir>
```

Der Validator prüft:

- alle gemappten Satztexte zusammen ergeben exakt `VOICEOVER-ZUM-KOPIEREN.txt`
- jede Satz-ID ist eindeutig
- jeder Satz zeigt auf eine existierende Szene
- die Satz-/Szenen-Reihenfolge läuft nicht rückwärts
- jede Szene besitzt mindestens einen gemappten Satz
- alle Captions einer Szene rekonstruieren exakt den gemappten Sprechertext dieser Szene
- bei `VOICE_LOCKED` beginnt jede Szene am ersten gemappten gesprochenen Wort, innerhalb des erlaubten Frame-Toleranzfensters
- Szene 1 darf nur einen kleinen bewusst erlaubten Lead vor dem ersten Wort haben

Damit wird aus:

```text
Audio hören → raten, welche Szene gemeint ist
```

verbindlich:

```text
Satz ist bereits scene3 zugeordnet
→ echte Wortzeit von S04 finden
→ scene3 an diesem Audio-Anker starten
```

## Finale Datenanforderung

`subtitle-cues.json` muss vor Production-Render:

- `timingStatus` beginnend mit `VOICE_LOCKED` haben
- pro Cue `words[]` enthalten
- Worttexte den Cue-Text exakt rekonstruieren
- keine Wortüberlappungen haben
- Cue-/Wortframes innerhalb der Voice-Locked-Szenengrenzen halten
- jede Cue-`sceneId` muss zur `SCENE-VOICE-MAP.json` passen

`reel.json` muss gleichzeitig:

- `sceneVoiceMap.file` setzen
- `format.finalDurationInFrames` setzen
- alle Szenen kontinuierlich von Frame 0 bis finalDuration führen
- pro Szene `timingStatus: VOICE_LOCKED` setzen
- `audio.observedAudioDurationSeconds` bzw. gleichwertige Dauer der Runtime-WAV dokumentieren

## Caption-Gruppen

- nach Sinn/Phrase gruppieren
- typischerweise 3–6 Wörter
- maximal 2 Zeilen
- natürliche Pausen respektieren
- kein aktives Wort während echter Sprechpause
- ein Satz darf in mehrere Cues geteilt werden, aber nicht zwischen Szenen springen

Layout kommt **nicht** aus diesem Skill, sondern ausschließlich aus `captionSafe.ts` / `CAPTION_SAFE_POSITION.md`.

## Visual-Sync

Starke Beats hängen an denselben Wortzeiten wie Szene und Caption:

```text
gemappter Satz / Schlüsselphrase
→ echter Frame in der Runtime-WAV
→ Scene-Start oder visueller Trigger
→ Caption derselben Szene
```

Szenenwechsel werden nicht mehr aus einer alten Planlänge übernommen.

## Wenn Audio kürzer/länger als Planung ist

1. Runtime-WAV erzeugen und echte dekodierte Dauer messen
2. Wortzeiten der bereits gemappten Sätze bestimmen
3. Szenenstarts an deren erste echte Wörter setzen
4. Szenen/Animation/Holds an diese Stimme anpassen
5. Visuals reduzieren, falls zu viele Informationen in eine Phrase gepackt wurden
6. `reel.json` und Caption-Timings neu schreiben

Nie das Voiceover gegen alte Plan-Cues laufen lassen.

## Validierung

Vor Production-Render:

```bash
node ki/scripts/prepare-reel-audio.mjs <reel-package-dir>
# Alignment gegen public/runtime-audio/<compositionId>.wav
node ki/scripts/validate-scene-voice-map.mjs <reel-package-dir>
node ki/scripts/validate-voice-locked-captions.mjs <reel-package-dir>
node ki/scripts/prepare-reel-render.mjs <reel-package-dir>
```

`prepare-reel-render.mjs` führt den Scene-Voice-Gate erneut aus und bindet `SCENE-VOICE-MAP.json` per SHA256 in den Render-Provenance-Lock ein.

## Freigabe

Kein Final-Render, wenn:

- `SCENE-VOICE-MAP.json` fehlt oder unvollständig ist
- Satz → Szene nicht eindeutig festgelegt ist
- Caption-Text einer Szene nicht zum gemappten Sprechertext passt
- Szenenstart nicht zum ersten gemappten Wort passt
- Runtime-WAV fehlt
- Wort-Timestamps fehlen
- Timingstatus nur Preview/Planning ist
- Composition-Dauer noch Planwert ist
- Caption hörbar vor-/nachläuft
