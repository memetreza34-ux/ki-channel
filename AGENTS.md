# KI-Channel — Agent Operating Contract

## Start here

Vor jeder Arbeit zuerst `REPO-STATE.md` lesen. Bei Dateien unter `ki/` danach `ki/AGENTS.md` und `ki/gehirn/MASTER.md`.

Zusätzlich je nach Aufgabe:

- Reel-Arbeit → `ki/reels/AGENTS.md`
- Story/Hook → `ki/gehirn/STORY_RETENTION.md`
- Fakten/Quellen → `ki/gehirn/FAKTENQUELLEN.md`
- Visual-Auswahl → `ki/gehirn/VISUAL_STRATEGY.md`
- neue Reels ab Woche 2026-09-28 → `ki/gehirn/VISUAL_QUALITY_V4.md`
- Remotion-Visualsystem → `ki/gehirn/REMOTION_VISUAL_SYSTEM.md`
- Plattform/Publishing → `ki/gehirn/PLATTFORMEN.md` + `ki/plattformen/AGENTS.md`

## Mission

Dieses Repository produziert hochwertige deutsche faceless KI-Inhalte. Agenten arbeiten als Produktionsingenieure **und** Creative-Systeme: starke Story, saubere Fakten, passende Bildsprache, präzise Remotion-Ausführung und ehrliche QA.

Technische Perfektion allein ist kein Erfolg, wenn das Ergebnis langsam, repetitiv oder visuell schwach ist.

## Git und Branches

- `main` ist der kanonische Produktionsstand.
- Historische `feature/*`, `fix/*`, `codex/*` und `backup/*` Branches niemals als aktuelle Wahrheit behandeln, wenn der Nutzer sie nicht ausdrücklich nennt.
- Für normale Arbeit von `main` einen Arbeitsbranch verwenden.
- `main` nicht direkt verändern, außer der Nutzer verlangt ausdrücklich Repository-Stabilisierung/Kanonisierung.
- Keine PRs mergen, schließen oder als ready markieren, außer die Aufgabe umfasst das ausdrücklich.
- Keine unrelated Dateien anfassen.

## V2-Produktionsmodell für neue Reels

### Phase 1 — ChatGPT

Phase 1 liefert die komplette Grundlage vor echtem Audio.

Reihenfolge:

```text
Creative Brief
→ Source Ledger
→ finaler Sprechertext
→ Visual Beats
→ Visual Strategy
→ Visual Quality V4 Story-/Hero-Vertrag
→ Remotion-Build-/Shot-Plan
→ Beweis-/Capture-Entscheidung
→ Captions/Plattform-Copy
→ reel.json
→ ausführbare Remotion-Source + Composition
```

V2-Pflichtartefakte unter `06-projektdateien/`:

- `production-contract-v2.json`
- `creative-brief.md`
- `source-ledger.md`
- `visual-strategy.md`
- `creative-review.md`
- `PHASE-STATUS.md`
- für neue Reels ab Woche 2026-09-28: `visual-quality-v4.json`
- `remotion-capabilities-v1.json`

Fehlendes Voiceover-Audio ist in Phase 1 normal und kein Grund, die Code-Grundlage aufzuschieben.

**Nicht zulässig:** direkt vom Thema in Remotion-Code springen.

### Phase 2 — Mensch

Immer:

- echtes Voiceover aus dem freigegebenen Fließtext
- bevorzugt `voiceover.wav`, alternativ `voiceover.mp3`

Nur wenn Phase 1 es ausdrücklich als echten Beweis verlangt zusätzlich:

- REAL_CAPTURE
- offizielles/reales Quellenasset

Keine Planungs- oder Source-Dateien in Phase 2 ändern.

### Phase 3 — Codex / Antigravity

Phase 3 beginnt erst mit echtem Audio und allen erforderlichen realen Pflichtmedien.

Der Agent:

- verwendet vorhandene Phase-1-Source und die darin gebaute Remotion-Komposition
- prüft echte Pflicht-Captures/Quellenassets
- integriert Audio/Medien in Remotion
- misst reale Dauer und Sprechpausen
- synchronisiert Visual Beats und Captions
- führt Struktur-, TypeScript- und fokussierte Tests aus
- rendert/prüft Smoke-Frames
- führt bei V4-Reels den scene-local Render-Review aus
- rendert finales MP4
- prüft technisch, automatisch visuell **und** menschlich kreativ
- dokumentiert `creative-review.md`

Fehlt Audio: `PHASE 2 AUDIO FEHLT`.

Fehlt ein als Pflicht markierter echter Capture: nicht durch erfundene UI oder generische Grafik vortäuschen.

## Autoritative Reel-Dateien V2

Wenn vorhanden, gelten innerhalb des Reels in dieser Reihenfolge:

1. `06-projektdateien/PHASE-STATUS.md`
2. `06-projektdateien/production-contract-v2.json`
3. `06-projektdateien/creative-brief.md`
4. `06-projektdateien/source-ledger.md`
5. `01-script-audio/voiceover.md`
6. `01-script-audio/VOICEOVER-ZUM-KOPIEREN.txt`
7. `06-projektdateien/visual-strategy.md`
8. `06-projektdateien/visual-quality-v4.json`, falls V4-Reel
9. `06-projektdateien/reel.json`
10. `06-projektdateien/scene-plan.md`, falls vorhanden
11. `06-projektdateien/animation-plan.md`
12. `03-caption/subtitle-cues.json`
13. `03-caption/platform-copy.md`
14. `02-bilder/asset-manifest.json`
15. echte Capture-/Quellen-Briefs
16. `06-projektdateien/creative-review.md`

Widersprüche nicht still auflösen. Höher priorisierte Quelle erhalten und Konflikt an der Ursache korrigieren.

Legacy-Reels ohne V2-Vertrag behalten ihre vorhandene Autorität, werden aber nicht als Vorlage für neue Produktionslogik behandelt.

## Story- und Retention-Regel

`ki/gehirn/STORY_RETENTION.md` kommt vor Script und Motion.

Vor Source müssen konkret sein:

- Viewer Promise
- Hook
- 3-second proof
- Core Mechanism
- Payoff
- Memorable Moment
- Truth Risk

Technik rettet keine schwache Idee.

## Faktenregel

`ki/gehirn/FAKTENQUELLEN.md` ist verbindlich.

Aktuell prüfen insbesondere:

- Preise/Limits/Pläne
- Modell-/Feature-Verfügbarkeit
- sichtbare Zahlen/Prozentwerte
- Benchmarks/Rankings
- reale Quellen/Paper
- News
- aktuelle Produktoberfläche/-funktion

Keine Demo-Zahl als Fakt darstellen. Keine erfundene real wirkende Quelle.

## Visual Strategy — Remotion ist die Ausführungsebene

`ki/gehirn/VISUAL_STRATEGY.md` entscheidet vor der technischen Implementierung. `ki/gehirn/VISUAL_QUALITY_V4.md` macht die Visual-Story für neue Reels maschinenprüfbar. `ki/gehirn/REMOTION_VISUAL_SYSTEM.md` definiert danach den Bauweg.

**Verbindlich:** Jeder finale Reel-Frame wird in Remotion komponiert und gerendert.

Für neue V4-Reels gilt pro Szene vor Capability-Auswahl zwingend:

```text
Startzustand
→ sichtbare Veränderung
→ Endzustand / Payoff
```

Zusätzlich braucht der Hero eine konkrete semantische Bedeutung und mindestens zwei Recognition Cues. Eine große abstrakte Form oder ein bloß animiertes Rechteck erfüllt den Hero-Vertrag nicht, wenn ein konkretes Gerät/Objekt gemeint ist.

Für die Beweis-/Quellenebene bleibt die Wahrheit entscheidend:

- `REMOTION_NATIVE` — bevorzugter Standard für konstruierte Erklärvisuals
- `REAL_CAPTURE` — wenn reales Produktverhalten selbst der Beweis ist; anschließend in Remotion einbetten
- `HYBRID` — echter Capture + Remotion-Overlays
- externe Still-/Motion-Medien — nur begründete Ausnahme

Das ist kein Freibrief für Fake-UI. Ein Remotion-Nachbau ist eine Illustration. Wenn exakte aktuelle UI oder reales Ergebnis eine Behauptung belegt, echten Capture verwenden.

Erst nach Story, Visual Strategy und Beweisentscheidung die Library prüfen.

`REUSE_EXACT` nur bei exaktem semantischem Fit. Sonst `NEW_BUILD`.

## Remotion-native Baupflicht

Bevor ein externes generiertes Bild/Video geplant wird, aktiv prüfen, ob die Szene hochwertig nativ gebaut werden kann.

Remotion-native umfasst ausdrücklich:

- SVG-/CSS-Illustrationen
- Icons
- Browser/App-Mockups
- Code/Terminal
- GitHub-/Repo-Szenen
- Diagramme
- Rankings/Vergleiche
- Geräte/Objekte
- 2.5D
- Shapes/Paths
- Three bei echter Tiefenlogik

Externe Bild-/Video-Generierung ist für neue Short-Form-Reels **nicht der Standardweg**.

## Anti-Karten-Grammatik

Karten/Panels nur, wenn sie wirklich UI, Dokument, Nachricht, Datei, Datensatz oder Token darstellen.

Nicht als Standardcontainer für abstrakte Aussagen.

Neue Reels sollen normalerweise:

- nicht mehr als zwei gleiche Hauptgrammatiken direkt hintereinander haben, sofern nicht derselbe Prozess bewusst fortgesetzt wird
- Karten-/Panelbeats auf ungefähr ein Viertel oder weniger begrenzen, wenn andere Mechaniken sinnvoll sind
- mindestens einen Hero-/Memorable-Moment planen
- mindestens die Hälfte der Visual Beats objekt-, pfad-, code-, raum-, form-, illustration- oder prozessbasiert bauen

## Remotion-Regeln

- deterministisch: `useCurrentFrame()`, `interpolate()`, `spring()`, `Sequence`
- kein `Math.random()` im Render
- keine Render-Time-Netzwerkaufrufe oder Downloads
- Assets über Repository/staticFile-Pfade
- direkte Frame-Seeks müssen funktionieren
- Hard Cut ist Standard; Übergang nur bei echter semantischer Kontinuität
- eine dominante erklärende Bewegung pro Beat, maximal drei starke Bewegungen gleichzeitig
- Zeitachsen grundsätzlich über kanalweite Easing-Helfer statt mechanisch lineare Motion; lineare Progression nur, wenn sie semantisch wirklich linear ist
- Gruppen sinnvoll staffeln statt alles gleichzeitig einzublenden
- Bewegungsgeschwindigkeit an Distanz/Objektgewicht anpassen
- keine vollständige Library-Animation mehrfach im selben Reel nur aus Bequemlichkeit
- Hook-Hero bei V4 bereits in Frame 0 sichtbar; kein Fade-from-empty als Einstieg
- unbegründeter statischer Hold bei V4 maximal ungefähr 2,5 Sekunden

Motion-Grundlagen liegen unter `.claude/skills/` und `ki/gehirn/BEWEGUNG.md`.

## Text-Hierarchie

- Header/Zwischenüberschrift: kurzer Kapitelmarker
- Caption: gesprochener Text
- Animationstext: kurze Objekt-/Zustandslabels
- Visual: zeigt Mechanismus/Zustandsänderung

Interne `goal`, `communicationGoal`, Debug- oder Regietexte niemals sichtbar machen.

Sprechertext nicht gleichzeitig als langen Header und Animationstext duplizieren.

## Logos, UI und echte Beweise

- eigene generische Icons bevorzugt als SVG/Vector bauen
- offizielles Logo nur als echtes vorhandenes Asset verwenden, wenn redaktionell passend
- komplexes Markenlogo nicht so nachbauen, dass es als offizielles Original wirkt
- generische UI darf als Illustration in Remotion gebaut werden
- echte aktuelle Produkt-UI als Beweis → REAL_CAPTURE
- reale Resultate/Outputs niemals erfinden

## Publishing-Regel

Plattformordner sind Packaging, keine zweite Produktionswahrheit.

Kein zweites Skript, `reel.json` oder Remotion-Projekt nur für YouTube/TikTok/Instagram/Facebook/Snapchat anlegen.

Short-Form-Master bleibt unter `ki/reels/`. Plattform-Copy gehört in `03-caption/platform-copy.md`.

YouTube Longform ist ein separates Format und wird nicht automatisch aus einem Short verlängert.

Zeitabhängige Plattformlimits/Monetarisierungsregeln bei konkreter Veröffentlichung aktuell prüfen.

## QA-Regel

V4 trennt drei Freigaben strikt:

```text
Technical status
Automated Visual status
Human Creative status
```

Technische QA:

- Strukturvertrag
- TypeScript/Tests
- Assets/Pfade
- Audio-Sync
- Smoke-Frames
- Render-Validierung
- Safe Zones

Automated Visual QA bei V4:

- Frame 0 / Hook-Start
- scene-local Samples bei ungefähr 5/33/66/92%
- Start-End-Visualänderung
- statische Holds
- ausgewaschene/unterbaute Frames
- tatsächlicher Visual-Footprint

Creative QA:

- Hook
- Tempo/Leerlauf
- visuelle Wiederholung
- Kartenlastigkeit
- sichtbaren Mechanismus
- semantische Erkennbarkeit des Hero
- Memorable Moment
- Smartphone-Eindruck
- Faktenwirkung sichtbarer Zahlen/Claims
- kein Fake-Capture
- keine gefälschten Logos

Verbindlich:

- `ki/gehirn/VISUAL_QUALITY_V4.md` für neue Reels ab Woche 2026-09-28
- `ki/gehirn/POST_RENDER_REVIEW.md`
- `ki/gehirn/CREATIVE_QA.md`
- V2: `06-projektdateien/creative-review.md` = PASS

**Automated Visual PASS ist niemals Human Creative PASS.** Ein technisch gültiges MP4 oder ein grüner CI-Lauf ist nicht automatisch freigegeben.

## Wahrheitspflicht

Nie behaupten, dass Tests, Typecheck, Audio-Sync, Smoke-Frames, Render, visuelle Prüfung, Creative QA oder Veröffentlichung bestanden/erfolgt sind, wenn sie nicht tatsächlich ausgeführt wurden.

Bei Blocker nennen:

- exakter Befehl
- Fehler
- betroffene Datei
- nächste sinnvolle Aktion

Keine Fehler mit `any`, `@ts-ignore`, deaktivierten Tests, Fake-Assets, Fake-Berichten oder geschwächten Validatoren verstecken.

## STRIKE KI-Regel — keine künstlichen Beweisassets

Du darfst keine nicht vorhandenen Screenshots, Audios, Videos, Captures oder offiziellen Markenassets als real vorhanden behandeln.

Remotion-native Illustrationen und UI-Mockups dürfen konstruiert werden, solange sie klar Erklärung sind und nicht als echter Produktbeweis ausgegeben werden.
