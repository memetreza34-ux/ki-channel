# Longform Final Review — GPT-6 Astra

## Phase 1
- [x] Thema klar und Longform-tauglich
- [x] aktuelle Recherche mit offiziellen und unabhängigen Quellen
- [x] Claims strukturiert
- [x] Gegenpositionen/Unsicherheiten sichtbar
- [x] Kapitelstruktur vorhanden
- [x] finaler Phase-1-Sprechertext vorhanden
- [x] Visual-Story-Plan vorhanden
- [x] Media-Plan vorhanden
- [x] konkrete offizielle Proof-Quellen und B-Roll-Kandidaten in Phase 1 gelockt
- [x] Nutzer muss keine Bilder/B-Roll beschaffen
- [x] drei Thumbnail-Konzepte vorhanden

## Phase 2 — einzige Nutzeraufgabe
- [ ] finales Produktions-Voiceover vom Nutzer vorhanden
- [ ] reale Audiolänge gemessen
- [ ] Forced Alignment abgeschlossen
- [ ] Kapitel auf reale Timings gelockt
- [ ] `CHAPTERS.status` = `VOICE_LOCKED` oder später `READY`

## Phase 3 — Media / Motion
- [ ] alle benötigten offiziellen Source-Proof-Assets lokal materialisiert
- [ ] B-Roll lokal materialisiert und auf echte Voice-Timings zugeschnitten
- [ ] Rechte/Provenance jedes externen Assets geprüft
- [ ] `MEDIA-PLAN.status` mindestens `READY_FOR_RENDER`
- [ ] jedes notwendige Asset `APPROVED` + `rightsVerified=true` + lokale Datei + korrekter SHA-256
- [ ] keine Render-Time-Remote-Medien
- [ ] keine KI-generierten Fake-Belege für reale Claims
- [ ] Remotion-Source als echte TS/TSX-Implementierung vollständig gebaut
- [ ] Composition-ID in `LONGFORM-VERSION.json` gesetzt und in `ki/src/Root.tsx` registriert
- [ ] keine sichtbaren Platzhalter (`TODO`, `TBD`, `PLACEHOLDER`, `Payoff Visual`, `Demo Visual`, `B-Roll here` usw.)
- [ ] Longform-Source vor Produktionsrender committed/clean
- [ ] Animation story-driven, nicht template-locked
- [ ] visuelle Welten wechseln tatsächlich entsprechend der Story
- [ ] keine operative Cyber-Anleitung im Visual
- [ ] SFX nach realen Audio-Timings gelockt

## Pre-Render Hard Gate
- [ ] `node scripts/check-ki-longform-render-readiness.mjs <paket>` bestanden
- [ ] `06-projektdateien/RENDER-LOCK.json` erzeugt
- [ ] Render-Lock bindet Voiceover, Media, Claims, Kapitel, Source und Root-Registry per SHA-256
- [ ] Produktionsreview nur über `node scripts/render-ki-longform-master.mjs <paket>`
- [ ] direkter/raw Remotion-Render wird niemals als Review-Master behandelt

## Technical / Master QA
- [ ] Longform-Strukturgate bestanden
- [ ] TypeScript bestanden
- [ ] Tests bestanden
- [ ] Smoke-/Stills geprüft
- [ ] kanonischer CRF-18-Render technisch erfolgreich
- [ ] 1920x1080 / 30 FPS / H.264 / yuv420p / AAC 48 kHz Stereo geprüft
- [ ] Zwei-Pass-Audio-Master auf ca. -16 LUFS / -1.5 dBTP durchgeführt
- [ ] `MASTER-QA.json.status` = `PASSED`
- [ ] keine Tail-Stille > 2 Sekunden
- [ ] keine Freeze-/praktisch statische Strecke >= 15 Sekunden
- [ ] Warnungen ab 8 Sekunden statischer Strecke bewusst visuell geprüft
- [ ] Videobitrate/Kompression plausibel; kein extrem niedrig komprimierter 1080p-Master
- [ ] Kontaktbögen `CONTACT-SHEET-*.jpg` geprüft

## YouTube Package
- [ ] 3 Thumbnail-Varianten gerendert
- [ ] gewählte Thumbnail-Variante klein geprüft
- [ ] Titel final
- [ ] Beschreibung final
- [ ] Produktverfügbarkeit unmittelbar vor Veröffentlichung neu geprüft
- [ ] Kapitel aus finalem Voice-Lock erzeugt
- [ ] SRT geprüft
- [ ] VTT geprüft
- [ ] Transcript geprüft
- [ ] sources.md vollständig
- [ ] manifest.json vollständig

## 1x Review — exakter Master
- [ ] kompletter gemasterter Review-Master einmal ohne Skip angesehen
- [ ] Fakten stimmen mit CLAIMS.json überein
- [ ] keine leeren/Placeholder-Flächen
- [ ] keine Fake-OpenAI-UI oder generierten Screenshots als reale Evidence
- [ ] keine langweiligen/überladenen Passagen
- [ ] B-Roll und Source-Proofs passen semantisch
- [ ] Kapitelüberschriften kollidieren nicht mit Visuals
- [ ] Text auf Laptop/TV lesbar
- [ ] Audio/SFX nicht ermüdend
- [ ] keine Debug-/Planner-Texte sichtbar
- [ ] sauberer End-Hold ohne unnötige Stille
- [ ] `oneXReviewCompletedAt` dokumentiert
- [ ] SHA-256 des tatsächlich angesehenen Masters in `reviewedMasterSha256` dokumentiert
- [ ] finaler `05-export/video.mp4` ist byte-identisch mit dem geprüften Review-Master

## Negativtest

Der hochgeladene Fehlrender vom 2026-09-06 ist ausdrücklich **nicht freigabefähig** und darf nicht weiterverwendet werden. Details: `FAILED-RENDER-2026-09-06.md`.

Erst wenn alle relevanten Punkte real bestanden sind, darf `RELEASE-PLAN.json` auf `READY` gesetzt werden.
