# Warum KI deinen Text anders liest

**Reel-ID:** `2026-08-04-warum-ki-text-anders-liest`  
**Composition-ID:** `Reel-WhyAIReadsDifferently`  
**Format:** 1080 × 1920, 30 FPS, 36 Sekunden  
**Zielgruppe:** deutschsprachige KI-Einsteiger, 16–35 Jahre  
**Status:** Phase 1 geplant und Phase 2 als Remotion-Code umgesetzt; Typecheck, echte Render und visuelle Abnahme stehen noch aus.

## Ziel

Das Reel erklärt in kurzer Form, warum ein Sprachmodell Text nicht wie ein Mensch liest. Es zeigt die Kette von Tokens über Zahlen, Bedeutungsraum, Attention und Wahrscheinlichkeiten bis zur erzeugten Antwort.

## Kreatives Prinzip

Jede Szene verwendet eine eigene visuelle Familie und eine eigene Hauptbewegung. Es gibt keine wiederholte vollständige Szenenanimation.

| Szene | Kernidee | Animation-ID |
|---|---|---|
| 1 | Satz zerfällt in Tokens | `sentence-token-shatter-v1` |
| 2 | Tokens werden Zahlen | `token-vector-scanner-v1` |
| 3 | Zahlen ordnen sich im Bedeutungsraum | `embedding-cluster-orbit-v1` |
| 4 | Attention verbindet wichtige Begriffe | `attention-thread-weave-v1` |
| 5 | mögliche nächste Wörter konkurrieren | `next-token-branch-race-v1` |
| 6 | Modellschichten verfeinern die Auswahl | `transformer-layer-elevator-v1` |
| 7 | Antwort setzt sich Wort für Wort zusammen | `answer-word-assembly-v1` |
| 8 | überzeugend klingend, aber potenziell falsch | `brilliant-wrong-split-balance-v1` |

## Phase-2-Qualität

- acht eigenständige Szenenkompositionen statt Wiederholung der zehn allgemeinen Motion-Stages
- feste obere Überschrift in jeder Szene
- kinetische Untertitel mit manuellen Wort-Frames
- besondere Animation und Hervorhebung aller Kernwörter
- sieben unterschiedliche Übergangsfamilien
- deterministisches Sounddesign direkt aus generierten WAV-Daten
- zusätzliche Erkläranimationen, wenn sie den Inhalt verständlicher machen
- optionaler `voiceoverSrc` für die spätere finale Sprachspur
- 32 definierte Prüf-Frames und ein technisches 33-Artefakte-Freigabetor

## Dateien

- `reel.json`: maschinenlesbarer Produktionsvertrag
- `voiceover.md`: finaler Sprechtext und Zeitfenster
- `scene-plan.md`: inhaltliche und visuelle Szenenplanung
- `remotion-plan.md`: technische Umsetzung in Remotion
- `PHASE-2-IMPLEMENTATION.md`: tatsächlich umgesetzte Choreografie, Sound und Prüfkommandos
- `asset-prompts.md`: optionale Asset-Prompts
- `audio-plan.md`: Musik-, SFX- und Timingplan
- `caption.md`: Social-Media-Caption und Hashtags
- `codex-task.md`: ursprünglicher Arbeitsauftrag für Codex
- `review-checklist.md`: technische und visuelle Abnahme

## Code

```text
ki/src/reels/why-ai-reads-differently/
```

Die Composition ist in `MotionPreviewRoot.tsx` im Ordner `Reels-Phase-2` registriert.

## Prüfung

```bash
npm run reel:why-ai:verify
npm run reel:why-ai:smoke
npm run reel:why-ai:full-release-check
```

Erst wenn Tests, Typecheck, 32 PNG-Prüfframes, MP4 und visuelle Kontrolle erfolgreich sind, gilt das Reel als freigegeben.

## Referenzstil

Das hochgeladene Demo-Reel dient nur als Ausgangspunkt für die Markenwirkung: heller Hintergrund, dunkle Typografie und violetter Akzent. Die neue Version ist deutlich stärker komponiert, räumlicher und abwechslungsreicher geplant. Die Animationen dürfen nicht bloß dieselben Karten mit anderen Texten zeigen.
