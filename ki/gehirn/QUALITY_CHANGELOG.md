# Kanalweites Qualitäts-Änderungsprotokoll

Pflichtstandard: CONTINUOUS_IMPROVEMENT.md. Dieses Protokoll wird nach jedem tatsächlich geprüften Video und zusätzlich bei allgemeinen, belegten Produktionsverbesserungen aktualisiert.

| Datum | Video / Version | Beobachtung + Beleg | Priorität | Video-Fix | Dauerhafte Änderung in Repo-Regel/Template/Test | Nachprüfung |
|---|---|---|---|---|---|---|
| – | Noch kein neuer Review-Eintrag | Nicht mit erfundenen Bewertungen füllen | – | – | – | – |

## Bei jedem Update beantworten

- Was ist im echten Video konkret besser bzw. schlechter als zuvor?
- Welche Ursache liegt vor (Script, Visual-Prompt, Rendering, Timing, Audio, Fakten oder Packaging)?
- Was wurde im aktuellen Video geändert? In welcher Datei und an welcher Stelle?
- Was wurde **dauerhaft** im Repository geändert, damit sich der Fehler nicht wiederholt?
- Hat ein neuer Render/Test die Korrektur belegt, oder ist sie noch unbestätigt?
- Was ist die nächste kontrollierbare Qualitätsverbesserung?

Nach ungefähr fünf fertigen Videos: systemweites Audit, wiederkehrende Risiken und aktive Verbesserungsprioritäten aktualisieren. Zuschauer-Learnings aus veröffentlichten Videos separat in LEARNINGS.md pflegen. Keine nicht überprüften globalen Regeln aus einem Einzelfall ableiten.

| 2026-10-17 | GPT-6 Intelligent UI, Phase-1-Code | Hinzufügen des zweiten Longform-Moduls ließ feste Ein-Modul-Zähler in Wiring-Gate und ProductionRoot-Test scheitern (GitHub Actions PR #73, fehlgeschlagene Runs dokumentiert). | P1 / Pipeline | Neues Video vollständig registriert, beide bestehenden Module explizit geprüft | `scripts/check-production-visual-contracts.mjs`: mindestens zwei Longform-Module und konkrete Modulnamen statt exakter Gesamtzahl; `scripts/check-repository-wiring.mjs` / `ki/src/productionRootIsolation.test.ts`: zukunftsfähige Mindestanzahl. | CI auf dem neuen Commit erneut ausführen; noch nicht als bestanden markieren. |
| 2026-10-17 | GPT-6 Intelligent UI, Phase-3-Assembly | Echte Voiceover-Audiodateien (3 Takes) per Whisper.cpp ausgerichtet; Inkonsistenz zwischen berechnetem Sparbetrag (260 €) und interpoliertem Bar-Wert (263 €) entdeckt und behoben. | P2 / Visuelle Präzision | Bar-Label in `IntelligentUIVisuals.tsx` direkt an berechnetes `total` gebunden; `DARSTELLUNGSWAHL`-Schriftgröße für Cards optimiert | Regel in `post-video-improvement.md`: UI-Charts und begleitende Gleichungen müssen aus identischen Variablen gespeist werden. | 8 Kapitelstills und finaler 9.927-Frame-Master gerendert und visuell verifiziert. |
| 2026-10-17 | GPT-6 Intelligent UI, Phase-3-Review | Audit ergab 44px-Lücke im Stromkreis (Ch 5: Schalterhebel endete bei x=916 statt 960 bei `close=1`) und schwere Motion-Beat-Desynchronisation in Ch 4, 5, 7, 8 (Animationen liefen 10–15s vor den gesprochenen Triggern ab). | P1 / Visuelle & Didaktische Integrität | In `IntelligentUIVisuals.tsx`: Schalterhebelgeometrie korrigiert (`925+35*close`), Textkollision entschärft (y=60), Keyframes in Ch 1, 4, 5, 6, 7, 8 präzise an Whisper-Wort-Timings gebunden. | Regel in `post-video-improvement.md`: Nicht nur Kapitelgrenzen schneiden, sondern interne Motion-Beats immer gegen Whisper-Wort-Timestamps verifizieren. | Stills an Trigger-Frames gerendert, FERTIGES-VIDEO.mp4 neu gerendert (9.927 Frames), alle Tests bestanden. |
| 2026-10-17 | GPT-6 Intelligent UI, Review + Fassung v2 (Claude) | Erste Studio-Fassung: ca. 80 % Standbild, 14 s leerer Bildschirm, Times-Schrift, verdeckte Inhalte, nachgebautes OpenAI-Logo, unbelegte Verfügbarkeitsangaben; Agent hatte sich selbst Human Creative PASS gegeben. | P0 / Bewegung + Wahrheit | `studio/projekte/gpt6-intelligent-ui/Video.tsx` neu aufgebaut: Wortzeiten-Kopplung, große mittige Inhalte, Toki bedient UI, Kapitel 7 nach Quellen | Wurzel-`fontFamily` setzen; Beats über `at('Wort')`; Agenten-Selbstfreigabe ungültig (siehe post-video-improvement.md) | Kontaktbögen aller Kapitel + Kamerafahrten angesehen, Typecheck ohne Fehler; Armans Sichtprüfung offen. |
