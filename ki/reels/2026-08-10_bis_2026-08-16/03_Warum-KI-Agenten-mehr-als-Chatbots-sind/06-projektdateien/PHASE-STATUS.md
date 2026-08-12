# Produktionsstatus — Warum KI-Agenten mehr als Chatbots sind

## Phase 1 — ChatGPT

**Status:** POST-RENDER-SOURCE-REVISION IMPLEMENTIERT

Vorhanden:
- 134-Wörter-Sprechertext + reine Copy-Datei
- fünf Szenen / 14 bedeutungstragende Visual Beats
- alle Visuals reel-spezifische `NEW_BUILD`-Remotion-Mechaniken
- lila Zwischenüberschrift + großes semantisches Icon
- harte Caption-Zone ab y=1440
- keine Animation unter/hinter den Untertiteln
- Subtitle-Basiscues + Plattform-Copy
- keine externen Bilder erforderlich
- ausführbarer Source unter `ki/src/reels/ai-agents/`
- Composition `KI-AIAgents`
- Contract-Test angelegt
- Phase-3-Auftrag enthält adaptive Voice-Timeline-Regeln

### Referenzrender-Review 2026-08-12

Ein außerhalb des Repos bereitgestellter Referenzrender wurde visuell geprüft. Festgestellte Punkte wurden in der Source überarbeitet:

- Hauptvisuals und Karten deutlich größer / smartphone-lesbarer
- weniger visuelle Leere durch stärkere Nutzung der vorhandenen Fläche
- interne Labels größer und kürzer
- Szene 5 in mehrere sichtbare Zustände aufgeteilt statt langer statischer Endphase
- finale Pipeline erhält bis zum Ende eine fortlaufende, semantisch passende Signalbewegung
- erstes Visual ist ab Frame 0 schwach sichtbar, damit der Start nicht leer wirkt
- Caption-Zone ab y=1440 bleibt unverändert geschützt

**Wichtig:** Diese überarbeitete Source ist nach der Änderung noch nicht neu gerendert und visuell freigegeben.

**Nicht behauptet:** aktueller TypeScript-/Vitest-/Remotion-Lauf der Revision, neuer Smoke-Render oder finale visuelle/akustische Freigabe.

## Phase 2 — Mensch

**Status:** REFERENZ-AUDIO/RENDER EXISTIERT AUSSERHALB DES REPOS; KANONISCHES AUDIO IM REPO NICHT BESTÄTIGT

Für einen kanonischen Phase-3-Lauf muss `voiceover.wav` oder `voiceover.mp3` im Reel-Paket vorhanden sein. Fehlt es dort, gilt weiterhin exakt: `PHASE 2 AUDIO FEHLT`.

## Phase 3 — Codex / Antigravity

**Status:** RERENDER DER POLIERTEN SOURCE ERFORDERLICH

Audio messen/integreren; Visual Beats + Szenen + Captions an echtes Voiceover ausrichten; natürliche Pausen zuerst; falls lokal nötig pitch-erhaltendes Cue-/Phrase-Retiming bevorzugt 0.97x–1.03x, maximal ungefähr 0.94x–1.06x; danach Wort-Timestamps neu bestimmen; Tests, Smoke-Frames, neuen Final-Render und visuelle/akustische Prüfung ausführen.
