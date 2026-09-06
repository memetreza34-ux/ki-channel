# GPT-6 Astra: Was sich wirklich geändert hat

**Format:** YouTube Longform v1  
**Datum:** 2026-09-05  
**Status:** PHASE1_READY / BAD_RENDER_REJECTED / WAITING_FOR_USER_VOICEOVER  
**Source:** `ki/src/longform/2026-09-05-gpt-6-astra-was-sich-wirklich-aendert/`

## Kernfrage

GPT-6 Astra ist nicht nur ein weiteres Modell mit höheren Benchmark-Werten. Das Video erklärt, was sich bei Computer-/Agentenarbeit praktisch ändert, was OpenAIs eigene Einstufung `Critical` im Cyberbereich bedeutet und warum Astra laut OpenAI gleichzeitig besser ausgerichtet, aber schwerer über Chain-of-Thought zu überwachen ist.

## Story-Versprechen

Nach dem Video soll klar sein:

1. welche Astra-Fähigkeiten tatsächlich neu/relevant sind,
2. was OpenAIs Benchmark- und Produktclaims bedeuten und nicht bedeuten,
3. warum die `Critical`-Cyberstufe wichtig ist,
4. wie ein Modell sicherer und trotzdem schwerer überwachbar sein kann,
5. was das für normale Nutzer, Unternehmen und agentische Workflows praktisch bedeutet.

## Verantwortlichkeiten

**Nutzer:** ausschließlich finales Produktions-Voiceover.

**Agent/Produktionssystem:** komplette Medienarbeit. Dazu gehören Bilder, B-Roll, offizielle Screenshots/Assets, Quellenrecherche, Rechte-/Lizenzprüfung, Provenance, lokale Materialisierung, Zuschnitt und Integration.

## Phase 1 — abgeschlossen

- Research: abgeschlossen für Skriptstand 2026-09-05
- Claims: strukturiert und mit Quellen belegt
- Kapitel: strukturiert, reale Timings erst nach Voiceover
- Sprechertext: vorhanden
- konkrete offizielle Proof-Quellen: gelockt
- konkrete B-Roll-Kandidaten: gelockt
- Medienbeschaffung: Agent-Aufgabe
- Visual-Story-Plan: vorhanden
- Thumbnail: drei Konzepte geplant

## Abgelehnter Prototyp

Der vom Nutzer hochgeladene 3:23-Test wurde am 2026-09-06 analysiert und **vollständig verworfen**. Er darf weder als Master noch als Source-Vorlage weiterverwendet werden.

Hauptprobleme:

- ca. 84,5 Sekunden Stille am Ende
- statische Abschnitte von ca. 33–67 Sekunden
- sichtbare Placeholder-Flächen
- praktisch keine echte B-Roll
- ungeeignete/fiktiv wirkende Evidence-UI
- extrem niedrige Videobitrate
- Audio-Master außerhalb Ziel

Details: `06-projektdateien/FAILED-RENDER-2026-09-06.md`.

## Neue Render-Regel

Ein neuer Astra-Review-Master darf ausschließlich über den kanonischen Longform-Renderpfad entstehen:

```bash
node scripts/render-ki-longform-master.mjs ki/youtube-longform/2026-09-05/01_GPT-6-Astra-Was-sich-wirklich-aendert
```

Der Render wird technisch blockiert, solange unter anderem:

- finales Nutzer-Voiceover fehlt,
- Kapitel nicht voice-locked sind,
- benötigte Medien nicht lokal/rights-verified/SHA-gebunden sind,
- keine echte TSX-Composition existiert,
- `compositionId` nicht registriert ist,
- Source Platzhalter enthält.

## Aktueller nächster Schritt

**Nur Nutzer:** finales Voiceover aus `01-script-audio/VOICEOVER-ZUM-KOPIEREN.txt` erzeugen und als `voiceover.wav` oder `voiceover.mp3` bereitstellen.

Danach vollständig Agent/Phase 3:

`Audio messen → Forced Alignment → reale Kapitel-Timings → Medien lokal materialisieren → Rechte/SHA binden → TSX-Source komplett neu bauen → freie story-driven Animation → SFX → kanonischer CRF-18-Render → Audio-Master → Master-QA → Kontaktbogen → Thumbnail/Subtitles → kompletter 1x-Review → Release-Gate`.

Verträge: `ki/youtube-longform/LONGFORM-V1.md` und `ki/youtube-longform/RENDER-GATES.md`.
