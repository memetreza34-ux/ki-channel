# Phase-3-Auftrag

0. **Preflight, vor jeder anderen Handlung:** `npm run phase3:check -- ki/youtube-longform/2026-08-16/01_Mit-KI-eine-App-bauen`. Meldet er einen Blocker, ist Phase 3 beendet: Blocker wörtlich zurückgeben, keine Datei anfassen.
1. `PHASE-STATUS.md`, `longform.json`, Skript, Kapitel- und Visualplan lesen.
2. echtes Voiceover in `01-script-audio/` suchen. Fehlt es: exakt `PHASE 2 AUDIO FEHLT` und stoppen.
3. reale Audio-Dauer messen. Liegt die natürliche Aufnahme außerhalb 5:00–6:00, nicht heimlich stark stretchen; Ursache melden und bei deutlicher Abweichung neues Voiceover anfordern.
4. Voiceover render-sicher in `KI-Longform-AIAppWorkflow` integrieren.
5. Kapitelgrenzen anhand echter Satz-/Phrasenpausen und Sprecherbedeutung setzen; keine lineare Pro-Rata-Verteilung.
6. Visual Beats auf reale Sprechstellen legen. Neue Bedeutung → sichtbarer Fokus/Zustand.
7. Animationen/Holds zuerst anpassen. Nur kleine natürliche Audio-Korrekturen an Phrasengrenzen, pitch-erhaltend; dokumentieren.
8. TypeScript, fokussierte Tests und Strukturchecks tatsächlich ausführen.
9. pro Kapitel Opening/Mid/End sowie kritische Beat-Wechsel als Smoke-Frames rendern und ansehen.
10. Thumbnail-Composition rendern und in kleiner Darstellung prüfen.
11. finalen 1920×1080-MP4 rendern, technisch prüfen und vollständig in Normalgeschwindigkeit ansehen.
12. zusätzlich verkleinert prüfen: UI, Labels, Kapitelmarker und Fokus müssen lesbar bleiben.
13. finale YouTube-Kapitelzeitstempel aus dem tatsächlich verwendeten Audio in `04-metadata/youtube.md` eintragen.
14. Review-Checkliste und Status nur für tatsächlich bestandene Punkte aktualisieren.