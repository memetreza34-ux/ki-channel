# Produktionsstatus — Warum KI Dinge erfindet

## Phase 1 — ChatGPT

**Status:** CODE- UND PLANUNGSGRUNDLAGE VOLLSTÄNDIG ANGELEGT — LAYOUT-REVISION NACH NUTZERFEEDBACK

Vorhanden:
- finaler Sprechertext + Copy-Datei
- fünf Szenen / fünf eindeutige production-ready Animationen
- Nutzerfeedback: die aktuellen Animationen werden als gute visuelle Richtung beibehalten; nicht ohne Grund ersetzen
- komplett lila Zwischenüberschriften oben mittig
- große semantische Scene-Icons
- keine Header-Unterzeile
- transparente, höhere Untertitelzone mit aktivem lila Sprechfokus
- Hauptanimation zentral nach oben versetzt gemäß aktuellem Production-Shell
- **neue harte Caption-Zone:** ab ungefähr `y=1440` darf keine sichtbare Animation weiterlaufen
- Production-Shell besitzt dafür zusätzlich einen Clip-Guard; abgeschnittener wichtiger Inhalt wäre trotzdem ein Layoutfehler
- Subtitle-Basiscues
- Plattform-Copy
- explizite Entscheidung: keine externen Bilder/Videos
- Remotion-Source unter `ki/src/reels/ai-hallucinations/`
- Composition `KI-Hallucinations`
- fokussierter Contract-Test angelegt

Das hochgeladene/ältere Render mit sichtbaren Animationselementen bis unter bzw. hinter den Untertitelbereich ist **nicht die aktuelle Layout-Freigabe**. Der nächste Render muss die harte Caption-Zone einhalten.

Die neue Regel „Visual Beats zuerst, individuelle Animation vor ungefährer Library-Reuse“ gilt verbindlich für **alle neu geplanten Reels ab dieser Revision**. Dieses bereits geplante Reel behält die vom Nutzer positiv bewerteten Animationen; nur nachweisbare Layout-/Synchronisationsfehler werden korrigiert.

Ebenfalls für neue Reels ab dieser Revision: Short-Form-Skripte standardmäßig ausführlicher auf ungefähr **50–60 Sekunden** planen, sofern der Inhalt das trägt.

**Nicht behauptet:** vollständiger aktueller TypeScript-/Vitest-/Remotion-Lauf, neuer Smoke-Render oder visuelle Freigabe nach der Caption-Zone-Revision.

## Phase 2 — Mensch

**Status:** NÄCHSTER SCHRITT — NUR AUDIO

`01-script-audio/VOICEOVER-ZUM-KOPIEREN.txt` exakt vertonen und bevorzugt als `01-script-audio/voiceover.wav` ablegen.

## Phase 3 — Codex / Antigravity

**Status:** WARTET AUF PHASE-2-AUDIO

Danach:

1. Audio integrieren und echte Dauer messen.
2. Cue-/Wort-Timestamps synchronisieren.
3. aktuelle Animationen beibehalten, da sie als visuelle Richtung akzeptiert wurden.
4. prüfen, dass **ab ungefähr y=1440 keine Animation sichtbar ist**.
5. falls der Clip-Guard wichtigen Inhalt abschneidet: Animation höher/kompakter layouten.
6. TypeScript/Tests ausführen.
7. relevante Beat-Wechsel sowie Opening/Mid/End-Hold in Smoke-Frames prüfen.
8. finalen MP4 rendern und normal sowie auf Smartphone-Größe ansehen.
