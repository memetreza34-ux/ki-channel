# Final Review Checklist — GPT-6 Astra 2026-09-11

## Phase 1
- [x] komplett neues Skript
- [x] Research-Stand 11.09.2026
- [x] aktuelle OpenAI-Produkt-/Safety-/Agents-Quellen
- [x] konkrete Official-Screenshots geplant
- [x] konkrete reale B-Roll-/Bildkandidaten mit Source/Lizenz
- [x] neue sieben Visual Worlds
- [x] drei neue Thumbnail-Konzepte
- [x] keine erfundenen Frame-Timings

## Phase 2 — Nutzer
- [ ] finales `voiceover.wav` oder `voiceover.mp3` vorhanden
- [ ] echte Dauer via ffprobe gemessen
- [ ] Forced Alignment real ausgeführt
- [ ] Kapitel auf reale Audiozeiten gelockt
- [ ] Word-/Sentence-Timings gespeichert

## Phase 3 — Medien
- [ ] alle required Official-Screenshots via echtem Browser lokal erfasst
- [ ] jeder Screenshot mit Source-URL und SHA-256 gebunden
- [ ] required B-Roll tatsächlich heruntergeladen
- [ ] B-Roll semantisch visuell geprüft
- [ ] B-Roll auf 1920×1080 / 30 FPS normalisiert
- [ ] Originalton entfernt, wo nicht benötigt
- [ ] jedes required Asset `APPROVED`
- [ ] jedes required Asset `rightsVerified=true`
- [ ] Attributionen in `sources.md`
- [ ] keine Render-Time-Remote-Medien
- [ ] keine generierten Medien als Realwelt-Beleg

## Phase 3 — Remotion
- [ ] echte Voice-Lock-Timeline
- [ ] keine festen gleich langen Kapitel
- [ ] alle sieben Visual Worlds sichtbar umgesetzt oder bewusst dokumentiert reduziert
- [ ] Source Desk nutzt echte lokale Proof-Screenshots
- [ ] Agent Workspace zeigt Ablauf statt Dashboard-Collage
- [ ] Benchmark Lab kennzeichnet Herstellerclaims
- [ ] Cyber-Visuals enthalten keine operative Angriffsanleitung
- [ ] Monitorability-Visuals kennzeichnen adversariale Testbedingungen
- [ ] Agents API und Astra werden nicht zu einem Fake-Produkt verschmolzen
- [ ] Control Stack im Payoff vollständig
- [ ] keine Placeholder/TODO/TBD-Texte
- [ ] keine Fake-OpenAI-UI
- [ ] keine praktisch unveränderte Strecke >= 15 s
- [ ] statische Wirkung ab 8 s bewusst reviewed
- [ ] SFX nach Voice-Lock synchronisiert

## Pre-Render
- [ ] TypeScript bestanden
- [ ] fokussierte Tests bestanden
- [ ] Longform-Structure-Gate bestanden
- [ ] Render-Readiness bestanden
- [ ] Source committed/clean
- [ ] Composition-ID gesetzt und registriert
- [ ] Render-Lock erzeugt

## Master
- [ ] nur kanonischer Longform-Master-Renderer verwendet
- [ ] H.264 / 1920×1080 / 30fps / yuv420p
- [ ] AAC 48kHz Stereo
- [ ] Audio etwa -16 LUFS / -1.5 dBTP gemastert
- [ ] kein Tail-Silence-Fehler
- [ ] kein Freeze-Gate-Fehler
- [ ] `MASTER-QA.json.status = PASSED`
- [ ] Contact Sheets erzeugt und geprüft

## YouTube Package
- [ ] Thumbnail A gerendert
- [ ] Thumbnail B gerendert
- [ ] Thumbnail C gerendert
- [ ] alle drei klein geprüft
- [ ] selectedVariant gesetzt
- [ ] SRT erzeugt und geprüft
- [ ] VTT erzeugt und geprüft
- [ ] Transcript geprüft
- [ ] Sources vollständig
- [ ] Titel/Beschreibung final
- [ ] aktuelle Astra-Verfügbarkeit unmittelbar vor Publish neu geprüft

## Finaler 1x Review
- [ ] exakter gemasterter Master komplett ohne Skip angesehen
- [ ] keine leeren Flächen
- [ ] keine Fake-Evidence
- [ ] Source-Proofs lesbar
- [ ] B-Roll passt semantisch
- [ ] Audio/SFX angenehm
- [ ] Kapitelübergänge klar
- [ ] sauberer End-Hold
- [ ] SHA des angesehenen Masters dokumentiert
- [ ] finaler `05-export/video.mp4` byte-identisch zum reviewed Master

Erst danach darf `RELEASE-PLAN.json.status` auf `READY` gesetzt werden.
