# Phase-3 Assembly Task

Dieses Reel ist in Phase 1 bereits geplant und implementiert. Nicht neu erfinden.

1. Kanonische Docs + `PHASE-STATUS.md` + lokalen Agent-Vertrag lesen.
2. `voiceover.wav` oder `voiceover.mp3` suchen; fehlt beides: exakt `PHASE 2 AUDIO FEHLT`.
3. reale Audio-Dauer messen und render-sicher integrieren.
4. Exact Word Sync ausführen:

```bash
node scripts/sync-reel-word-timings.mjs --dir "ki/reels/2026-08-10_bis_2026-08-16/02_Warum-unklare-Prompts-die-KI-raten-lassen"
```

   Der Lauf muss jedes Whisper-Wort gegen den freigegebenen Sprechertext prüfen. Bei Wortabweichung stoppen; niemals Final-Timestamps linear schätzen.
5. `03-caption/subtitle-cues.json`, `03-caption/word-timestamps.json` und `06-projektdateien/word-sync-report.json` prüfen. `exactWordTimings` muss `true` und der Report `PASS` sein.
6. Szene/Visual-Beat-Grenzen und Holds zuerst an das echte Voiceover anpassen.
7. natürliche Pausen an Phrase-/Satzgrenzen bei Bedarf leicht verkürzen/verlängern.
8. nur wenn danach lokal nötig: komplette Phrase/Cue pitch-erhaltend retimen; bevorzugt 0.97x–1.03x, bei echtem Bedarf bis ca. 0.94x–1.06x.
9. niemals mitten im Wort retimen, Wörter schneiden/duplizieren oder abrupt die Geschwindigkeit wechseln; darüber neues Voiceover anfordern. Nach jeder Audioänderung Exact Word Sync erneut ausführen.
10. nur aktueller Sprechfokus lila; finale Caption-/Wort-Timestamps müssen aus dem tatsächlich gerenderten Audio stammen.
11. alle zwölf `NEW_BUILD`-Visual-Beats semantisch erhalten; keine Library-Substitution aus Bequemlichkeit.
12. prüfen, dass ab y=1440 keinerlei bedeutungstragende Animation sichtbar ist.
13. `node scripts/run-remotion-readiness.mjs` sowie reel-spezifische Tests tatsächlich ausführen.
14. Für den integrierten echten Test bevorzugt den kanonischen E2E-Befehl verwenden:

```bash
node scripts/render-first-real-ki-reel.mjs all
```

   Der Befehl verweigert fehlendes Audio, führt Exact Word Sync + Readiness aus, bindet ausschließlich eine temporäre Kopie des echten Voiceovers über Remotion `staticFile()` ein, rendert Smoke-Frames und anschließend `05-export/FERTIGES-REEL.mp4`. Das Original-Audio bleibt unverändert.
15. Opening/Mid/End plus alle relevanten Beat-Wechsel als Smoke-Frames tatsächlich ansehen; die drei automatisch gerenderten Frames sind Mindestprüfung, nicht vollständige Creative QA.
16. finalen MP4 technisch validieren und normal + smartphone-groß ansehen/anhören.
17. im Abschluss lokale Retiming-Stellen/Faktoren nennen oder `kein Retiming nötig` melden.
18. `creative-review.md` und Status nur für tatsächlich erledigte Schritte aktualisieren.
