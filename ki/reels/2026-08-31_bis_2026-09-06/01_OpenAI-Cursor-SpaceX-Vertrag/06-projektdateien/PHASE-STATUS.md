# PHASE STATUS

## Aktuell
`RENDER-REVIEW-REWORK IMPLEMENTIERT — NEUER LOKALER RENDER ERFORDERLICH`

Ein Nutzer-Render vom 30.08.2026 wurde visuell geprüft. Die dabei gemeldeten Probleme sind in `RENDER-REVIEW-2026-08-30.md` dokumentiert und im Source reworked. Dieser GitHub-Stand beweist noch keinen neuen Render-PASS.

## Phase 1 / Source-Rework
- Thema und Primärquellen: implementiert
- Voiceover-Skript: 152 Wörter, content-locked
- Scene-Voice-Map: content-locked
- Story: **35 Visual Beats** nach Render-Review, mit `sentenceId + progress` Sync-Metadaten
- Captions: shared Zone auf **bottom 330 / 40 px / max 928 px / 6-Wort-Gruppen** angehoben
- Visual Stage: von Headline bis zur angehobenen Caption-Zone genutzt
- Motion: Cable Draw/Break, Date Stamp, Timeline Playhead, Scan, Astra Collision, Routing Spine, Gate Pipeline, Access Pulse
- Mikrodetails: Daten, Status, Funktionen, Route 1/3–3/3, Source-Metadaten
- SFX: **14** semantische Events geplant; nicht als Mindestquote
- SFX Voice-Sync: `ki/scripts/sync-reel-sfx-to-captions.mjs` vor CC0-Auflösung
- Visuals: native-first + Official Source Cards, keine Render-Time-Remote-Medien
- Remotion-Source: Rework implementiert auf Stabilisierung-Branch

## Verbindliche Timing-Regel
Nach echtem lokalem Forced Alignment:

1. `node ki/scripts/align-reel-local.mjs <reel-package-dir>`
2. `node ki/scripts/sync-reel-sfx-to-captions.mjs <reel-package-dir>`
3. `node ki/scripts/resolve-reel-sfx.mjs <reel-package-dir>`
4. Story-/Repo-/Motion-Gates
5. neuer Render
6. Social-Audio-Master
7. exakter 1x Review gegen `RENDER-REVIEW-2026-08-30.md`

Major visual reveals lesen finale Caption-/Satzzeiten aus dem Contract; starre Szenen-Prozente sind nur Fallback.

## Noch nicht behauptet
- Typecheck des neuen Reworks: NOT RUN in dieser GitHub-Quellumgebung
- Storytelling-Validator des neuen Reworks: NOT RUN lokal
- neuer Render nach Rework: NOT RUN hier
- Caption-/Visual-/Motion-PASS des neuen Reworks: PENDING NEW RENDER
- SFX-Balance-PASS: PENDING NEW RENDER

## Nutzer-Audio
Produktions-Voiceover bleibt ausschließlich Nutzer-Input. Die Binärdatei wird nicht von ChatGPT/Codex/Antigravity erzeugt oder heruntergeladen. GitHub-Quellzugriff kann nicht beweisen, ob die lokale Voice-Datei des Nutzers aktuell vorhanden ist.
