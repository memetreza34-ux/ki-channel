# Phase-3 Assembly Task

Dieses Reel ist in Phase 1 geplant und implementiert. Nicht neu erfinden.

1. Kanonische Docs, `ki/gehirn/POST_RENDER_REVIEW.md`, `PHASE-STATUS.md`, `../02-bilder/cover-brief.md` und lokalen Agent-Vertrag lesen.
2. `voiceover.wav` oder `voiceover.mp3` suchen; fehlt beides: exakt `PHASE 2 AUDIO FEHLT` melden.
3. reale Audio-Dauer messen und render-sicher integrieren.
4. Szenen-/Beat-Grenzen und Holds zuerst an echte Sprecherphrasen anpassen.
5. natürliche Pausen an Phrase-/Satzgrenzen bei Bedarf leicht korrigieren.
6. nur wenn danach nötig komplette Phrase/Cue pitch-erhaltend retimen; bevorzugt 0.97x–1.03x, maximal ca. 0.94x–1.06x.
7. niemals mitten im Wort retimen oder Wörter schneiden/duplizieren.
8. finale Wort-Timestamps gegen das tatsächlich verwendete Audio bestimmen.
9. Caption-Anzeige in kurze semantische Gruppen teilen: normalerweise 4–6 Wörter, maximal 2 Zeilen, niemals zwei komplette Sätze gleichzeitig.
10. alle 16 `NEW_BUILD`-Visual-Beats semantisch erhalten.
11. prüfen, dass ab `y=1440` keinerlei Animation sichtbar ist.
12. Frame 0: App + Button sofort sichtbar; Hauptvisuals smartphone-lesbar; interne Labels ca. 30 px oder größer.
13. speziell die letzte Szene prüfen: erneuter Klick → Fehler weg → Tests grün → Rest läuft → `VERIFIZIERT` muss bis zur letzten Phrase sichtbar fortschreiten.
14. eigenständiges Cover nach `../02-bilder/cover-brief.md` erzeugen; keinen normalen Reel-Frame verwenden.
15. Cover bei Smartphone-Größe prüfen.
16. TypeScript, fokussierte Tests und Strukturchecks tatsächlich ausführen.
17. Opening/Mid/End plus relevante Beat-Wechsel als Smoke-Frames rendern und ansehen.
18. finalen MP4 rendern, technisch validieren und normal + Smartphone-Größe ansehen/anhören.
19. nach Source-Änderungen immer neu rendern; alten MP4 nie als Freigabe verwenden.
20. lokale Retiming-Stellen/Faktoren nennen oder `kein Retiming nötig` melden.
21. Status nur für tatsächlich erledigte Schritte aktualisieren.
