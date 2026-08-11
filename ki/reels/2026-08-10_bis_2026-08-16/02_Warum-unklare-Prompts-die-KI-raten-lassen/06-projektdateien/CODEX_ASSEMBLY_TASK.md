# Phase-3 Assembly Task

Dieses Reel ist in Phase 1 bereits geplant und implementiert. Nicht neu erfinden.

1. Kanonische Docs + `PHASE-STATUS.md` + lokalen Agent-Vertrag lesen.
2. `voiceover.wav` oder `voiceover.mp3` suchen; fehlt beides: `PHASE 2 AUDIO FEHLT`.
3. reale Audio-Dauer messen und render-sicher integrieren.
4. Szene/Visual-Beat-Grenzen und Holds zuerst an das echte Voiceover anpassen.
5. natürliche Pausen an Phrase-/Satzgrenzen bei Bedarf leicht verkürzen/verlängern.
6. nur wenn danach lokal nötig: komplette Phrase/Cue pitch-erhaltend retimen; bevorzugt 0.97x–1.03x, bei echtem Bedarf bis ca. 0.94x–1.06x.
7. niemals mitten im Wort retimen, Wörter schneiden/duplizieren oder abrupt die Geschwindigkeit wechseln; darüber neues Voiceover anfordern.
8. Subtitle-Cues und Wort-Timestamps gegen das final tatsächlich verwendete Audio neu bestimmen; nur aktueller Sprechfokus lila.
9. alle zwölf `NEW_BUILD`-Visual-Beats semantisch erhalten; keine Library-Substitution aus Bequemlichkeit.
10. prüfen, dass ab y=1440 keinerlei Animation sichtbar ist.
11. TypeScript, fokussierte Tests und Strukturchecks tatsächlich ausführen.
12. Opening/Mid/End plus alle relevanten Beat-Wechsel als Smoke-Frames rendern und ansehen.
13. finalen MP4 rendern, technisch validieren und normal + smartphone-groß ansehen/anhören.
14. im Abschluss lokale Retiming-Stellen/Faktoren nennen oder `kein Retiming nötig` melden.
15. Status nur für tatsächlich erledigte Schritte aktualisieren.
