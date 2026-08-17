# Produktionsstatus — Wie KI ein Bild versteht

## Phase 1 — ChatGPT

**Status:** IMPLEMENTIERT

Vorhanden:

- finaler Sprechertext + Copy-Fließtext
- Szenen-/Visual-Planung
- Baseline-/Audio-Captions
- Plattform-Copy
- Remotion-Sources unter `ki/src/reels/ai-image-understanding/` und dem später ergänzten `ki/src/reels/how-ai-sees/`
- Composition-Registrierung
- Review-/Assembly-Grundlage

## Phase 2 — Mensch

**Status:** AUDIO VORHANDEN

Im aktuellen Branch ist `01-script-audio/voiceover.mp4` vorhanden und in die aktuelle Reel-Composition eingebunden.

## Phase 3 — Codex / Antigravity

**Status:** REVISION IMPLEMENTIERT — RERENDER ERFORDERLICH

Die Caption-Position wurde nach dem vorhandenen Render von `bottom: 270px` auf den neuen Feed-Safe-Standard `bottom: 460px` geändert.

Dadurch gilt ausdrücklich:

- ein bereits vorhandener MP4 ist **kein** visueller Freigabebeweis für den aktuellen Source-Stand
- beide aktiven Caption-Implementierungen verwenden jetzt `bottom: 460px`
- neuer Render erforderlich
- danach Smartphone-/Feed-Sichttest durchführen
- besonders prüfen: Caption ungefähr y≈1340–1470, maximal 2 Zeilen, keine Kollision mit Visuals und keine Plattform-UI-nahe Position
- falls Visuals mit der höheren Caption kollidieren: Visual höher/kompakter setzen; Caption nicht wieder nach unten verschieben

Nicht als aktuell bestanden behauptet:

- TypeScript/Vitest für den jetzigen Source-Stand
- neuer Smoke-Render nach Caption-Revision
- neuer Final-Render nach Caption-Revision
- visuelle Endfreigabe des jetzigen Source-Stands
