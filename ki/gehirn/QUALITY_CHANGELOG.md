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
