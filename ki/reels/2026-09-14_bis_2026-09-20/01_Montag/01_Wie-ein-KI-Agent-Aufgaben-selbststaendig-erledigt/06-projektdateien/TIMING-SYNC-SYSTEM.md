# Timing-Sync-System — Audio → Untertitel → Szenen → Animationen

Dieses Reel darf im finalen Render **keine unabhängigen Planungstimings** für Audio, Untertitel, Szenen oder Animationen verwenden.

## Eine einzige Timing-Autorität

Die einzige Autorität nach Nutzer-Audio ist:

`01-script-audio/WORD-TIMINGS.json`

Diese Datei entsteht ausschließlich aus dem echten Nutzer-Voiceover über den bestehenden lokalen Alignment-Pfad:

```bash
node ki/scripts/align-reel-local.mjs <reel-package-dir>
```

Danach werden alle weiteren Timings daraus abgeleitet.

## Verbindliche Reihenfolge

```text
Nutzer-Voiceover
→ Pause-Kompression
→ Forced Alignment
→ WORD-TIMINGS.json
→ finale Caption-Cues
→ Scene-Timings
→ Reveal-/Animation-Timings
→ SFX-Timings
→ finalDurationInFrames
→ Render
```

## Harte Regeln

1. `subtitle-cues.json` ist vor Alignment nur Preview. Im Production-Render muss es aus `WORD-TIMINGS.json` neu gebaut worden sein.
2. Szenen dürfen nach Alignment nicht mehr nur mit frei geschätzten Start-/End-Frames laufen. Ihre Grenzen werden aus dem ersten und letzten gemappten Wort der zugehörigen Sätze bestimmt.
3. Große Animationen/Reveals werden über `sentenceId + anchorPhrase` an echte gesprochene Wörter gekoppelt. Fallback-Progress darf nur vor Alignment verwendet werden.
4. SFX werden erst nach finalen Caption-/Scene-Timings synchronisiert.
5. Die Remotion-Gesamtdauer kommt aus dem echten aligned Audio und nicht aus `planningDurationInFrames`.
6. Fehlt `WORD-TIMINGS.json`, darf ein Production-Render nicht als synchronisiert/final gelten.
7. Cover/Intro vor dem ersten gesprochenen Wort darf einen festen Lead besitzen; danach gilt Audio als Master.

## Sync-Toleranzen

- Caption-Start zum gesprochenen Wort: Ziel ±2 Frames, maximal ±4 Frames bei 30 fps.
- Major Reveal zum Anchor-Wort: Ziel ±3 Frames, maximal ±5 Frames.
- Szenenwechsel: bevorzugt in Sprechpause oder Satzgrenze; niemals mitten im gemappten Wort.
- SFX: sichtbares Ereignis und Tonereignis maximal ±3 Frames auseinander.

## Production-Gate

Vor einem finalen Render müssen mindestens diese Zustände gelten:

```text
AUDIO_ALIGNED = true
WORD_TIMINGS_PRESENT = true
CAPTIONS_DERIVED_FROM_WORD_TIMINGS = true
SCENES_DERIVED_FROM_WORD_TIMINGS = true
MAJOR_REVEALS_WORD_LOCKED = true
SFX_RESYNCED_AFTER_ALIGNMENT = true
DURATION_FROM_ALIGNED_AUDIO = true
```

Wenn einer dieser Punkte fehlt, Status:

`TIMING_SYNC_NOT_READY`

und kein finaler PASS.
