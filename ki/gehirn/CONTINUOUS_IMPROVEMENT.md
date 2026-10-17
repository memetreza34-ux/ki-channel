# Kontinuierliche Verbesserung – oberste Priorität

**P0 – verbindlich für alle Videos, Agenten und Produktionswege (Shorts, Longform, Studio).**

Ziel: Die Qualität jedes Videos systematisch steigern, bis professionelle, hervorragende YouTube-Videos reproduzierbar gelingen. „Perfekt“ oder „9/10“ darf niemals allein aus einem Plan oder einem automatischen Test abgeleitet werden. Wahrheit und nachgewiesene Qualität gehen vor Tempo, Effekten und Videomenge.

## Pflichtzyklus – bei JEDEM Video

1. **Vor Phase 1:** Offene Qualitätsprobleme und wiederverwendbare Erkenntnisse aus QUALITY_CHANGELOG.md lesen. Für das neue Video 1–3 konkrete Verbesserungsziele definieren.
2. **Nach dem ersten Render:** Das tatsächliche Video mit Ton, ohne Ton und in Smartphone-Größe prüfen. Hook/Frame 0, Dramaturgie, Zuschauerverständnis, passende Bilder und Visuals, Abwechslung, Timing, Texteinblendungen, Ton/SFX, Fakten, Wiederholungen und Payoff beurteilen.
3. **Fehler beseitigen:** Jeden P0/P1-Fehler mit Timecode, Ursache, Korrektur und Nachprüfung dokumentieren. Nach Änderungen erneut rendern; ein alter PASS wird ungültig.
4. **Pro Video Qualitätsakte:** Im Produktionspaket unter 06-projektdateien/post-video-improvement.md festhalten, was gelungen ist, was schlecht war, welche systemische Ursache identifiziert wurde, was am Video verbessert wurde und welche Regel/Komponente/Testvorlage sich für die Zukunft ändern muss.
5. **Aus jedem Nutzerfeedback lernen:** Explizites Feedback am Video prüfen UND denselben Fehler künftig verhindern. Nicht nur den einen Render korrigieren, sondern relevante zentrale Regeln, Prompts, Templates oder Regressionstests verbessern.
6. **Nach Veröffentlichung:** Reale Analytics und Zuschauerreaktionen im performance-review.md erfassen. Hypothesen mit entsprechenden Belegen in LEARNINGS.md überführen; fehlende Daten als NICHT VERFÜGBAR kennzeichnen.

## Allgemeine Verbesserung zwischen Videos

- Nach **jedem Video** eine kurze Zeile in QUALITY_CHANGELOG.md mit Erkenntnis, Beleg, umgesetztem Fix (oder begründet keiner globalen Änderung) und Nachprüfung ergänzen.
- Nach circa **5 Produktionen** ein systemweites Qualitätsaudit durchführen. Wiederkehrende Probleme in Hooks, Bildsemantik, Skripten, Thumbnails, Animationen, Text, Synchronisation, Audio, Tempo und Produktionszuverlässigkeit priorisieren.
- Neue Möglichkeiten und Referenzen nur übernehmen, wenn sie einen konkreten Videonutzen besitzen; keine neuen Bibliotheken als Ersatz für echte Qualitätsarbeit.
- Nicht blind virale Kennzahlen nachahmen. Vergleichbare Tests, kontrollierte Veränderungen und ansprechende, sachlich korrekte Inhalte bevorzugen.
- Learnings aus Nutzerfeedback und echter Videoinspektion gehen in QUALITY_CHANGELOG.md. LEARNINGS.md bleibt auf echte Veröffentlichungsdaten beschränkt.

## Fehlerprioritäten

**P0:** Falsche oder irreführende Informationen, Fake-Captures, beschädigtes Audio/Video, unlesbare Kernbotschaft, fehlender essenzieller Inhalt.

**P1:** Schwacher Hook, leere Anfangsframes, unpassende oder repetitive Bildwelten, Text nicht synchron, kein sinnvoller Payoff, unverständliche Diagramme.

**P2:** Detailpolitur, Effekte, kosmetische Feinheiten und nicht blockierende Workflow-Vereinfachungen.

P0/P1 vor Zusatzanimationen. Technischer PASS ist kein kreativer PASS.

## Freigabe und Wahrheit

Ein Qualitätsziel im Quellcode ist **kein tatsächlicher Qualitätsscore**. Nur ausgeführte Tests als bestanden melden. Ohne echten Render keine definitive Bild-/Tonbeurteilung. Verbesserungen ohne erneute Prüfung als IMPLEMENTIERT, NICHT VERIFIZIERT markieren. Nach jeder Produktion im Chat berichten: beobachtete Stärken, Fehler, behobene Probleme, dauerhaft geänderte Repo-Regeln und noch offene Punkte.

Für die konkrete Prüfung zusätzlich POST_RENDER_REVIEW.md und CREATIVE_QA.md; für Zuschauerzahlen PERFORMANCE_LEARNING.md und POST_PUBLISH_LEARNING.md verwenden.
