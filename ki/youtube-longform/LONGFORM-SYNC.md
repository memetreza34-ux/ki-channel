# YouTube Longform — Explicit Voice/Visual Sync

Gilt für `LONGFORM_V1`-Produktionen mit `syncContract: LONGFORM_CHOREOGRAPHY_V1`.

## Ziel

Die finale Longform-Timeline wird nicht aus Prozentwerten, geschätzten Kapitellängen oder einzelnen unbeschränkten Triggerframes gebaut. Zeit-Autorität ist das finale Nutzer-Voiceover.

```text
VOICEOVER.txt + CHAPTER-VOICE-MAP.json + finales voiceover.wav|mp3
→ Known-Transcript Forced Alignment
→ WORD-TIMINGS.json
→ unabhängiger CTC-Gegencheck
→ ALIGNMENT-QUALITY.json
→ CHOREOGRAPHY-PLAN.json
→ CHOREOGRAPHY-RESOLVED.json
→ TIMELINE-AUDIT.md
→ Remotion createLongformChoreographyTiming()
→ kanonischer Render-Gate
```

## Phase 1: vor der Aufnahme

`VOICEOVER.txt` ist der exakte gesprochene Wortlaut ohne Markdown. `CHAPTER-VOICE-MAP.json` segmentiert exakt denselben Text in Kapitel und Sätze. Die Verkettung aller `sentence.text` muss `VOICEOVER.txt` nach Whitespace-Normalisierung exakt rekonstruieren.

`CHOREOGRAPHY-PLAN.json` plant nur semantische Visualwechsel. Longform braucht **nicht** für jedes Wort einen Beat. Ein Visual kann viele Sekunden in HOLD bleiben, wenn die Story das verlangt.

Jeder Beat besitzt mindestens:

- `id`, `chapterId`, `sentenceId`
- `speech.start` und `speech.end` mit `SENTENCE_START`, `SENTENCE_END`, `PHRASE_START` oder `PHRASE_END`
- `visual.target` und optional `visual.kind` / `visual.mediaAssetId`
- `visual.start` und `visual.end`
- `enterFrames` und `exitFrames`
- optional `sfx` mit exaktem Timing-Ref

Beispiel:

```json
{
  "id": "ch2-b04",
  "chapterId": "chapter-02",
  "sentenceId": "ch2-s03",
  "speech": {
    "start": {"type": "PHRASE_START", "phrase": "der Agent prüft das Ergebnis"},
    "end": {"type": "PHRASE_END", "phrase": "der Agent prüft das Ergebnis"}
  },
  "visual": {
    "kind": "UI",
    "target": "verification-panel",
    "start": {"ref": "speechStart", "offsetFrames": -4},
    "end": {"ref": "beatStart", "beatId": "ch2-b05", "offsetFrames": 0},
    "enterFrames": 8,
    "exitFrames": 8
  }
}
```

Vor Audio-Sync muss der Planstatus `READY_FOR_ALIGNMENT` oder `PLANNED_REQUIRES_AUDIO_ALIGNMENT` sein.

## Phase 2: Nutzer

Der Nutzer legt ausschließlich das finale `voiceover.wav` oder `voiceover.mp3` in `01-script-audio/` ab.

## Phase 3A: ein Sync-Befehl

Auf Apple Silicon für strikten Zwei-Modell-Konsens den primären MLX/Qwen-Aligner verwenden:

```bash
node scripts/with-longform-node20.mjs scripts/sync-ki-longform.mjs <package> --backend=mlx-qwen3
```

Der Befehl läuft fail-closed durch fünf Gates:

1. primäres Known-Transcript Forced Alignment;
2. unabhängiger `ctc-german`-Gegencheck;
3. exakte Sprach- und Visualintervalle kompilieren;
4. `TIMELINE-AUDIT.md` schreiben;
5. Choreografie hart validieren.

Wenn ein Wort, eine Phrase, ein Kapitel, ein Zeitfenster oder ein Gegencheck nicht eindeutig passt, wird nichts geraten.

## Erzeugte Timing-Artefakte

```text
01-script-audio/
├── WORD-TIMINGS.json
└── SPEECH-CUES.json

06-projektdateien/
├── ALIGNMENT-QUALITY.json
├── CHOREOGRAPHY-RESOLVED.json
├── LONGFORM-TIMING-STATUS.json
└── TIMELINE-AUDIT.md

05-export/
├── subtitles.srt
├── subtitles.vtt
└── transcript.txt
```

`CHOREOGRAPHY-RESOLVED.json` ist nach erfolgreichem Sync die finale Timing-Autorität für Visuals und SFX.

## Remotion-Vertrag

Der finale Source importiert die exakte aufgelöste Datei und benutzt den gemeinsamen Helper:

```ts
import choreographyResolved from '../../../youtube-longform/.../06-projektdateien/CHOREOGRAPHY-RESOLVED.json';
import {createLongformChoreographyTiming} from '../choreographyTiming';

const timing = createLongformChoreographyTiming(choreographyResolved);
const verification = timing.local('chapter-02', 'ch2-b04');
```

`localVisual` enthält explizit:

```text
startFrame
→ enterEndFrame
→ holdStartFrame
→ holdEndFrame
→ exitStartFrame
→ endFrame
```

Die Animation darf innerhalb dieses Fensters komplex sein, aber ihr semantischer Lebenszyklus darf nicht wieder auf willkürliche Prozentwerte der Gesamtdauer zurückfallen.

## Produktionsrender

Der kanonische Render ruft automatisch den Sync-Readiness-Gate auf:

```bash
node scripts/with-longform-node20.mjs scripts/render-ki-longform-master.mjs <package>
```

Vor Render muss u. a. gelten:

- `WORD-TIMINGS.json.status = LOCAL_FORCED_ALIGNMENT_ACCEPTED`
- `ALIGNMENT-QUALITY.json.status = ALIGNMENT_CONSENSUS_PASSED`
- `CHAPTERS.json.status = VOICE_LOCKED`
- `CHOREOGRAPHY-RESOLVED.json.status = CHOREOGRAPHY_LOCKED`
- `LONGFORM-TIMING-STATUS.json.status = LONGFORM_TIMING_LOCKED`
- `TIMELINE-AUDIT.md` vorhanden
- Source konsumiert `createLongformChoreographyTiming()`
- Source bindet die exakte `CHOREOGRAPHY-RESOLVED.json`
- referenzierte reale Medien sind approved/rechtegeprüft

## Longform-Pacing

Exakte Synchronisation bedeutet nicht Daueranimation. Typische sinnvolle Intervalle können sein:

- kurzer UI-/Text-Reveal: 1–4 s;
- Diagramm/Prozess: 5–15 s;
- Source/Beweis: so lange wie nötig zum Lesen;
- B-Roll: semantisch passend und bewusst begrenzt;
- komplexe Demo: mehrere gesprochene Phrasen, aber weiterhin mit explizitem Start/Ende.

Das System synchronisiert **Bedeutungswechsel**, nicht jedes einzelne Wort mit einem Effekt.
