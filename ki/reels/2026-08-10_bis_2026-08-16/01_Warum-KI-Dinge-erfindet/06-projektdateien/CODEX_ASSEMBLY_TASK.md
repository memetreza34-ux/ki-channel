# Phase-3 Assembly Task

Dieses Reel ist bereits in Phase 1 geplant und implementiert. Nicht von Null neu bauen.

1. Kanonische Docs + `PHASE-STATUS.md` lesen.
2. `voiceover.wav` oder `voiceover.mp3` suchen. Fehlt Audio: exakt `PHASE 2 AUDIO FEHLT` stoppen.
3. Audio integrieren und reale Dauer messen.
4. Visual Beats, Szenen, Holds und Animationen an das echte Voiceover anpassen, ohne Sprechertext, Headlines oder Animation-IDs umzuschreiben.
5. Wenn eine Phrase lokal zu schnell/zu langsam ist: zuerst natürliche Pause an Phrase-/Satzgrenze korrigieren; nur wenn nötig die komplette Phrase/den Cue pitch-erhaltend leicht retimen.
6. Retiming nur an natürlichen Grenzen, nie mitten im Wort; bevorzugt `0.97x–1.03x`, bei echtem Bedarf bis ca. `0.94x–1.06x`; darüber neues Voiceover verlangen statt hörbarer Verzerrung.
7. Exakte Cue-/Wort-Timestamps gegen das final tatsächlich verwendete Audio erzeugen; nur aktueller Sprechfokus lila.
8. Prüfen, dass sichtbare Zustandswechsel genau zur gemeinten Sprecherphrase passieren.
9. Prüfen, dass Hauptanimation und wichtige Labels oberhalb der Caption-Zone bleiben.
10. TypeScript/Tests/Contract-Checks wirklich ausführen.
11. Mindestens Öffnung/Mitte/Ende jeder Szene plus relevante Visual-Beat-Wechsel als Smoke-Frames rendern und visuell prüfen.
12. Finalen MP4 rendern und normal + smartphone-groß ansehen und anhören; Voiceover darf an keiner Stelle künstlich beschleunigt/gedehnt wirken.
13. Im Abschlussbericht lokale Retiming-Stellen + Faktoren nennen oder `kein Retiming nötig` melden.
14. Status nur für tatsächlich erledigte Schritte aktualisieren.
