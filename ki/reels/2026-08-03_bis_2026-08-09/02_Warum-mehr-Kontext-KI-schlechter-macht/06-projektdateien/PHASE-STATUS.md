# Produktionsstatus — Warum mehr Kontext eine KI schlechter machen kann

## Phase 1 — ChatGPT

**Status:** CODE- UND PLANUNGSGRUNDLAGE VOLLSTÄNDIG ANGELEGT

Vorhanden:

- finaler Sprechertext
- `VOICEOVER-ZUM-KOPIEREN.txt` als reiner Fließtext
- fünf Szenen / fünf production-ready Animationen
- Zuschauer-Zwischenüberschriften oben mittig
- semantisch passende Scene-Icons in `reel.json`
- keine zusätzliche Header-Unterzeile im Production-Reel
- Untertitel ohne weiße Hintergrundkarte
- Untertitel in einer höheren unteren Safe Zone statt direkt am Displayrand
- Marken-Lila als sprechersynchrone Wort-/Phrasenhervorhebung
- Support für exakte Wort-Timestamps; proportionale Wortzeiten sind nur Preview-Fallback
- reduzierte Animationslabels ohne Caption-Kopie
- 1080 × 1920, 30 FPS, 900 Frames als Audio-unabhängige Basis
- Subtitle-Basiscues
- `03-caption/platform-copy.md` mit getrennten Publishing-Texten für YouTube Shorts, Instagram, TikTok, Facebook und Snapchat
- explizite Entscheidung: keine externen Bilder/Videos
- Remotion-Source unter `ki/src/reels/antigravity-context-overload/`
- Meaning → Derive → Sanitize → Associate → Render-Props
- Composition `KI-ContextOverload`
- fokussierte Contract-/Source-Checks vorhanden

**Nicht behauptet:** aktueller vollständiger TypeScript-/Vitest-/Remotion-Lauf, neuer Smoke-Render oder visuelle Freigabe nach dieser Layout-Korrektur.

Ein älterer Render mit linksbündiger Headline, weißer Caption-Card oder zu tiefen Untertiteln ist **keine aktuelle visuelle Freigabe**.

## Phase 2 — Mensch

**Status:** NÄCHSTER SCHRITT — NUR AUDIO

Öffne:

`01-script-audio/VOICEOVER-ZUM-KOPIEREN.txt`

Erzeuge daraus ein zusammenhängendes Voiceover ohne Textänderung und lege es bevorzugt als:

`01-script-audio/voiceover.wav`

alternativ als `voiceover.mp3` ab.

Keine JSON-, Caption-, Plattform-Copy-, Prompt- oder TS/TSX-Dateien ändern.

## Phase 3 — Codex / Antigravity

**Status:** WARTET AUF PHASE-2-AUDIO

Danach:

1. Audio integrieren und reale Dauer messen.
2. Cue- und möglichst Wort-Timestamps am echten Sprecher ausrichten.
3. Prüfen, dass die aktive lila Hervorhebung hörbar zum gesprochenen Wort passt.
4. Header + Icon oben mittig und Untertitel-Safe-Zone in Smoke-Frames prüfen.
5. TypeScript/Tests ausführen.
6. 15 Smoke-Frames visuell prüfen.
7. finales MP4 rendern und in normaler Geschwindigkeit sowie auf Smartphone-Größe ansehen.

Danach ist der freigegebene Master zusammen mit `platform-copy.md` publishing-bereit; tatsächliche Veröffentlichung nur, wenn sie ausdrücklich beauftragt wird.
