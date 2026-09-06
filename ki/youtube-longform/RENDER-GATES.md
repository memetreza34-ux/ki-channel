# YouTube Longform — harte Render-Gates

Gilt für Longform v1 ab 2026-09-05.

Ein technisch renderbares Remotion-Projekt ist noch kein zulässiger Produktionsrender. Review/Release nur über:

```bash
node scripts/render-ki-longform-master.mjs <longform-package>
```

Der kanonische Pfad erzwingt:

1. Pre-Render-Readiness
2. Render-Lock mit SHA-256
3. H.264 / CRF 18 / yuv420p
4. Zwei-Pass-Audio-Mastering auf ca. -16 LUFS / -1.5 dBTP
5. Master-QA
6. Kontaktbögen alle ca. 8 Sekunden
7. `RENDER-RESULT.json`

Das Ergebnis ist nur ein `LONGFORM_REVIEW_CANDIDATE_READY_NOT_RELEASED`.

## Render wird blockiert bei

- fehlendem Nutzer-Voiceover
- nicht voice-gelockten Kapiteln
- Timeline, die nicht zum echten Audio passt
- nicht geprüften Claims
- nicht lokal materialisierten/ungeprüften Medien
- falschem oder fehlendem SHA-256
- generierten Fake-Belegen für reale Claims
- fehlender Composition-ID/Registry
- README-only-Source ohne TSX
- sichtbaren Platzhaltern wie `TODO`, `TBD`, `PLACEHOLDER`, `Payoff Visual`, `Demo Visual`, `B-Roll here`
- direkten Remote-Bild-/Video-URLs im Render-Source
- uncommitted/untracked Longform-Source

## Post-Render Master-QA

Blockiert u. a. bei:

- falschem Codec/Format/FPS
- extrem niedriger 1080p-Videobitrate
- Audio-/Video-Dauerdrift
- Tail-Stille > 2 s
- Freeze/Stagnation >= 15 s; ab 8 s Warnung
- Loudness außerhalb ca. -16 ±0.8 LUFS
- True Peak > -1 dBTP

Reports:

```text
06-projektdateien/RENDER-LOCK.json
06-projektdateien/review/AUDIO-MASTER.json
06-projektdateien/review/MASTER-QA.json
06-projektdateien/review/CONTACT-SHEET-*.jpg
06-projektdateien/review/RENDER-RESULT.json
```

Der komplette 1x-Review bleibt Pflicht.

## Regression aus dem Astra-Fehlrender

Der fehlerhafte Test vom 2026-09-06 zeigte genau die künftig verbotenen Zustände:

- ca. 84,5 s Stille am Ende
- statische Blöcke von ca. 33–67 s
- Platzhalterflächen
- extrem niedrige 1080p-Bitrate
- -21 LUFS mit +4,72 dBTP Peak
- geplante reale Medien nicht materialisiert
- kein kanonisch implementierter TSX-Source auf dem Branch

Dieser MP4 ist ausschließlich Negativbeispiel und keine Basis für den finalen Astra-Master.
