# Skill: Motion Readability + Light-First

## Zweck

Verhindert zwei wiederkehrende Fehler:

1. Animationen/Zustände sind bei 1x zu schnell, um sie sauber zu erfassen.
2. einzelne dunkle Fullscreen-Szenen brechen den hellen visuellen Stil.

High Energy bedeutet **nicht** maximale Geschwindigkeit.

## Light-First

Standard:

- helle Fullscreen-Hintergründe
- dunkle Typografie
- kräftige Akzentfarben erlaubt
- dunkle Cards/Objekte in heller Szene erlaubt
- dunkle Fullscreen-Szene nur bei ausdrücklicher/dokumentierter Ausnahme
- kein `hell → plötzlich schwarz → hell` nur für Variation

## Motion-Grundsatz

Jeder wichtige Zustand:

`REVEAL → SETTLE → READABLE HOLD`

Richtwerte bei 30 fps:

- Entrance/Morph: ca. 8–18 Frames
- Settle: ca. 4–8 Frames
- kritischer Informations-Hold: ca. 12–24 Frames
- Hero-/Payoff-Hold: ca. 18–30 Frames
- unabhängige Infos typischerweise 6–12 Frames staffeln

Wenn die Sprecherphrase zu kurz ist: Visual vereinfachen oder Beats neu verteilen. Nicht drei wichtige Dinge in wenige Frames quetschen.

## Informationsdichte

Höchstens 1–2 neue unabhängige Informationsobjekte gleichzeitig, wenn sie aktiv verstanden werden müssen.

Schlecht:

`Antwort + SCHNELL + NIEDRIG + Progress + Zoom gleichzeitig`

Besser:

`Antwort → Hold → SCHNELL → Hold → NIEDRIG → Payoff`

## Audio-Bezug

Nach lokalem Voiceover:

1. Whisper-/Voice-Lock verwenden
2. Visual Trigger an gesprochene Bedeutung binden
3. prüfen, ob Reveal + Hold in die Phrase passen
4. sonst Visual vereinfachen/neu verteilen

## 1x-Review

Der **tatsächliche MP4** muss bei normaler Geschwindigkeit geprüft werden.

Fail, wenn:

- Pause/Zurückspulen nötig ist
- Element verschwindet vor dem Erfassen
- mehrere neue Dinge um Aufmerksamkeit konkurrieren
- Hero-Moment sofort überschrieben wird
- Ablauf hektisch wirkt

## Review muss zum exakten MP4 gehören

`MOTION-READABILITY-REVIEW.md` enthält zusätzlich:

```text
REVIEWED_VIDEO_SHA256: <64 hex chars>
REVIEWED_VIDEO_DURATION_SECONDS: <exact duration>
```

Damit kann kein alter Review versehentlich einen neuen Render freigeben.

Der Validator wird mit **dem tatsächlich geprüften MP4** aufgerufen:

```bash
node ki/scripts/validate-motion-readability-review.mjs <reel-package-dir> <reviewed-video.mp4>
```

Er prüft SHA256 + Dauer gegen die Review-Datei.

## Pflichtfelder

```text
STATUS: PASS
LIGHT_FIRST: PASS
DARK_FULL_FRAME_SCENES: 0
DARK_EXCEPTION_APPROVED: NO
TOO_FAST_BEATS: 0
SIMULTANEOUS_INFO_OVERLOADS: 0
MIN_CRITICAL_HOLD_FRAMES: 12
POST_RENDER_1X_REVIEW: PASS
REVIEWED_VIDEO_SHA256: <sha256>
REVIEWED_VIDEO_DURATION_SECONDS: <seconds>
```

Bei genehmigter dunkler Ausnahme zusätzlich:

```text
DARK_EXCEPTION_APPROVED: YES
DARK_EXCEPTION_REASON: <konkrete Begründung>
```

## Freigabe

Ohne Motion-Readability-PASS für **genau den finalen MP4** kein `FINAL VIDEO READY` und kein Export-Paket.
