# Phase-3 Assembly Task

Dieses Reel ist in Phase 1 geplant und implementiert. Nicht neu erfinden.

1. Kanonische Docs, `ki/gehirn/POST_RENDER_REVIEW.md`, `PHASE-STATUS.md`, `../02-bilder/cover-brief.md` und lokalen Agent-Vertrag lesen.
2. `voiceover.wav` oder `voiceover.mp3` suchen; fehlt beides: exakt `PHASE 2 AUDIO FEHLT` melden.
3. reale Audio-Dauer messen und render-sicher integrieren.
4. Szenen-/Visual-Beat-Grenzen und Holds an echte Sprecherphrasen anpassen.
5. natürliche Pausen an Phrase-/Satzgrenzen bei Bedarf leicht korrigieren.
6. nur wenn danach nötig: komplette Phrase/Cue pitch-erhaltend retimen; bevorzugt 0.97x–1.03x, bei echtem Bedarf bis ca. 0.94x–1.06x.
7. niemals mitten im Wort retimen, Wörter schneiden/duplizieren oder abrupt Geschwindigkeit wechseln.
8. Subtitle-Cues und Wort-Timestamps gegen das final tatsächlich verwendete Audio neu bestimmen.
9. Untertitel sichtbar in kurze semantische 4–6-Wort-Gruppen teilen; maximal 2 Zeilen, keine zwei kompletten Sätze gleichzeitig.
10. alle `NEW_BUILD`-Visual-Beats semantisch erhalten.
11. prüfen, dass ab `y=1440` keinerlei Animation sichtbar ist.
12. Frame 0, Smartphone-Größe, kurze Labels und visuelle Dichte prüfen.
13. speziell letzte 10–15 Sekunden prüfen: Responsive-Test → Fehlerzustand → gezielte Korrektur → funktionierender Prototyp müssen bis zur letzten Phrase sichtbar fortschreiten.
14. eigenständiges Cover nach `../02-bilder/cover-brief.md` erstellen; normalen Reel-Frame nicht als Cover verwenden.
15. Cover in Smartphone-Größe prüfen.
16. TypeScript, fokussierte Tests und Strukturchecks tatsächlich ausführen.
17. Opening/Mid/End plus relevante Beat-Wechsel als Smoke-Frames rendern und ansehen.
18. finalen MP4 rendern, technisch validieren und normal + Smartphone-Größe ansehen/anhören.
19. nach Source-Änderungen immer neu rendern; alten MP4 niemals als Freigabe verwenden.
20. lokale Retiming-Stellen/Faktoren nennen oder `kein Retiming nötig` melden.
21. Status nur für tatsächlich erledigte Schritte aktualisieren.
