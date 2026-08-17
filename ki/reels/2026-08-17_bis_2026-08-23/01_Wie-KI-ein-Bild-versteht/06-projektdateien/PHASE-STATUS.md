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

Nach einem echten veröffentlichten Instagram-Feed-Screenshot wurde die Caption-Geometrie erneut sicherer gesetzt. Beide aktiven Caption-Implementierungen verwenden jetzt:

- `bottom: 520px`
- ungefähr `104px` horizontalen Sicherheitsabstand links/rechts
- maximal ungefähr `820px` Caption-Breite
- 4–6 Wörter pro sichtbarem Sinnblock
- maximal 2 Zeilen gleichzeitig

Dadurch gilt ausdrücklich:

- ein bereits vorhandener MP4 ist **kein** visueller Freigabebeweis für den aktuellen Source-Stand
- neuer Render erforderlich
- danach Smartphone-/Feed-Sichttest durchführen
- besonders prüfen: Caption ungefähr y≈1260–1400, deutlicher Abstand zu Accountname/Beschreibung und rechter Interaktionsleiste
- neue kritische Visuals möglichst bis y≈1240–1280 abschließen
- falls Visuals mit der höheren Caption kollidieren: Visual höher/kompakter setzen; Caption nicht wieder nach unten verschieben

Nicht als aktuell bestanden behauptet:

- TypeScript/Vitest für den jetzigen Source-Stand
- neuer Smoke-Render nach der 520px-Caption-Revision
- neuer Final-Render nach der 520px-Caption-Revision
- visuelle Endfreigabe des jetzigen Source-Stands
