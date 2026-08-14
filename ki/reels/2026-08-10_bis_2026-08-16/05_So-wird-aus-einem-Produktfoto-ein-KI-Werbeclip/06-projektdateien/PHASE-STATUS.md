# Produktionsstatus — So wird aus einem Produktfoto ein KI-Werbeclip

## Phase 1 — ChatGPT

**Status:** CODE- UND PLANUNGSGRUNDLAGE VOLLSTÄNDIG ANGELEGT

Vorhanden:
- 146-Wörter-Sprechertext + reine Copy-Datei
- fünf Szenen / 16 bedeutungstragende Visual Beats
- alle Visuals reel-spezifische `NEW_BUILD`-Remotion-Mechaniken
- Content-Säule: **Mit KI erstellen / AI Video / Before-After-Workflow**
- Post-Render-Regeln bereits eingeplant: kein leerer Start, große Kernvisuals, kurze Labels, keine langen statischen Sprecherabschnitte, Schlussprogression bis zur letzten Phrase
- lila Zwischenüberschrift + großes semantisches Icon
- harte Caption-Zone ab `y=1440`
- Subtitle-Basiscues + Plattform-Copy
- keine externen Bilder erforderlich
- ausführbarer Source unter `ki/src/reels/ai-product-ad/`
- Composition `KI-AIProductAd`
- fokussierter Contract-Test angelegt
- Phase-3-Auftrag enthält adaptive Voice-Timeline + Post-Render-Review

**Nicht behauptet:** aktueller TypeScript-/Vitest-/Remotion-Lauf, Smoke-Render oder visuelle/akustische Freigabe.

## Phase 2 — Mensch

**Status:** NÄCHSTER SCHRITT — NUR AUDIO

`01-script-audio/VOICEOVER-ZUM-KOPIEREN.txt` wortgetreu vertonen und bevorzugt als `voiceover.wav` ablegen.

## Phase 3 — Codex / Antigravity

**Status:** WARTET AUF PHASE-2-AUDIO

Audio messen/integreren; Visual Beats + Szenen + Captions an echtes Voiceover ausrichten; ggf. natürliches pitch-erhaltendes Cue-Retiming; Tests, Smoke-Frames, finalen Render und Smartphone/Post-Render-Prüfung durchführen.
