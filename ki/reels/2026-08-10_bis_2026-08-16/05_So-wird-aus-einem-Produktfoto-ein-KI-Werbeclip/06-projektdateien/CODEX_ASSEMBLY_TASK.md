# Phase-3 Assembly Task

Dieses Reel ist in Phase 1 geplant und implementiert. Nicht neu erfinden.

1. Kanonische Docs, `ki/gehirn/POST_RENDER_REVIEW.md`, `PHASE-STATUS.md` und lokalen Agent-Vertrag lesen.
2. `voiceover.wav` oder `voiceover.mp3` suchen; fehlt beides: exakt `PHASE 2 AUDIO FEHLT` melden.
3. reale Audio-Dauer messen und render-sicher integrieren.
4. Szene-/Visual-Beat-Grenzen und Holds zuerst an echte Sprecherphrasen anpassen.
5. natürliche Pausen an Satz-/Phrasengrenzen bei Bedarf leicht korrigieren.
6. nur wenn danach nötig: komplette Phrase/Cue pitch-erhaltend retimen; bevorzugt 0.97x–1.03x, bei echtem Bedarf bis ca. 0.94x–1.06x.
7. niemals mitten im Wort retimen, Wörter schneiden/duplizieren oder abrupt die Geschwindigkeit wechseln.
8. Subtitle-Cues und Wort-Timestamps gegen das final tatsächlich verwendete Audio neu bestimmen.
9. alle `NEW_BUILD`-Visual-Beats semantisch erhalten.
10. prüfen, dass ab `y=1440` keinerlei Animation sichtbar ist.
11. prüfen, dass Frame 0 nicht leer wirkt, Hauptvisuals smartphone-lesbar sind und wichtige Labels ungefähr mindestens 30 px bleiben.
12. Produktkonsistenz über Szene 2–5 prüfen; nur Szene 1 darf absichtlich mehrere widersprüchliche Varianten zeigen.
13. speziell letzte 8–12 Sekunden prüfen: Kontrolle → Korrektur → Workflow → finaler Werbeclip müssen bis zur letzten Phrase sichtbar fortschreiten.
14. TypeScript, fokussierte Tests und Strukturchecks tatsächlich ausführen.
15. Opening/Mid/End plus relevante Beat-Wechsel als Smoke-Frames rendern und ansehen.
16. finalen MP4 rendern, technisch validieren und normal + Smartphone-Größe ansehen/anhören.
17. nach Source-Änderungen immer neu rendern; alten MP4 niemals als Freigabe verwenden.
18. im Abschluss lokale Retiming-Stellen/Faktoren nennen oder `kein Retiming nötig` melden.
19. Status nur für tatsächlich erledigte Schritte aktualisieren.
