# KI-Channel — Agent Operating Contract

## Start here

Vor jeder Arbeit zuerst `REPO-STATE.md` lesen. Bei Dateien unter `ki/` danach `ki/AGENTS.md` und `ki/gehirn/MASTER.md`.

Zusätzlich je nach Aufgabe:

- Reel-Arbeit → `ki/reels/AGENTS.md`
- Story/Hook → `ki/gehirn/STORY_RETENTION.md`
- Fakten/Quellen → `ki/gehirn/FAKTENQUELLEN.md`
- Visual-Auswahl → `ki/gehirn/VISUAL_STRATEGY.md`
- Plattform/Publishing → `ki/gehirn/PLATTFORMEN.md` + `ki/plattformen/AGENTS.md`

## Mission

Dieses Repository produziert hochwertige deutsche faceless KI-Erklärinhalte. Agenten arbeiten als Produktionsingenieure **und** Creative-Systeme: starke Story, saubere Fakten, passende Bildsprache, präzise Ausführung und ehrliche QA.

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
→ Animation-/Shot-Plan
→ Asset-/Capture-Entscheidung
→ Captions/Plattform-Copy
→ reel.json
→ ausführbare Source + Composition
```

V2-Pflichtartefakte unter `06-projektdateien/`:

- `production-contract-v2.json`
- `creative-brief.md`
- `source-ledger.md`
- `visual-strategy.md`
- `creative-review.md`
- `PHASE-STATUS.md`

Fehlendes Voiceover-Audio ist in Phase 1 normal und kein Grund, die Code-Grundlage aufzuschieben.

**Nicht zulässig:** direkt vom Thema in Remotion-Code springen.

### Phase 2 — Mensch

Immer:

- echtes Voiceover aus dem freigegebenen Fließtext
- bevorzugt `voiceover.wav`, alternativ `voiceover.mp3`

Nur wenn Phase 1 es ausdrücklich verlangt zusätzlich:

- REAL_CAPTURE
- externes Still-/Hybrid-/Motion-Asset

Keine Planungs- oder Source-Dateien in Phase 2 ändern.

### Phase 3 — Codex / Antigravity

Phase 3 beginnt erst mit echtem Audio und allen erforderlichen realen Pflichtmedien.

Der Agent:

- verwendet vorhandene Phase-1-Source
- prüft Pflichtassets/Captures
- integriert Audio/Medien
- misst reale Dauer und Sprechpausen
- synchronisiert Visual Beats und Captions
- führt Struktur-, TypeScript- und fokussierte Tests aus
- rendert/prüft Smoke-Frames
- rendert finales MP4
- prüft technisch **und** kreativ
- dokumentiert `creative-review.md`

Fehlt Audio: `PHASE 2 AUDIO FEHLT`.

Fehlt ein als Pflicht markiertes reales Asset/Capture: nicht durch generische Grafik vortäuschen.

## Autoritative Reel-Dateien V2

Wenn vorhanden, gelten innerhalb des Reels in dieser Reihenfolge:

1. `06-projektdateien/PHASE-STATUS.md`
2. `06-projektdateien/production-contract-v2.json`
3. `06-projektdateien/creative-brief.md`
4. `06-projektdateien/source-ledger.md`
5. `01-script-audio/voiceover.md`
6. `01-script-audio/VOICEOVER-ZUM-KOPIEREN.txt`
7. `06-projektdateien/visual-strategy.md`
8. `06-projektdateien/reel.json`
9. `06-projektdateien/scene-plan.md`, falls vorhanden
10. `06-projektdateien/animation-plan.md`
11. `03-caption/subtitle-cues.json`
12. `03-caption/platform-copy.md`
13. `02-bilder/asset-manifest.json`
14. externe Asset-/Shot-Briefs
15. `06-projektdateien/creative-review.md`

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

## Visual Strategy — kein Tool-Default

`ki/gehirn/VISUAL_STRATEGY.md` entscheidet vor der technischen Implementierung.

Primäre Modalities:

- `REMOTION_NATIVE`
- `REAL_CAPTURE`
- `HYBRID`
- `EXTERNAL_STILL_REQUIRED`
- `EXTERNAL_MOTION_REQUIRED`

**Keine davon ist automatisch Default oder Premium. Beste Erklärung gewinnt.**

Erst nach Modality und Mechanik die Library prüfen.

`REUSE_EXACT` nur bei exaktem semantischem Fit. Sonst `NEW_BUILD` oder das begründete reale/externe Medium.

## Anti-Karten-Grammatik

Karten/Panels nur, wenn sie wirklich UI, Dokument, Nachricht, Datei, Datensatz oder Token darstellen.

Nicht als Standardcontainer für abstrakte Aussagen.

Neue Reels sollen normalerweise:

- nicht mehr als zwei gleiche Hauptgrammatiken direkt hintereinander haben, sofern nicht derselbe Prozess bewusst fortgesetzt wird
- Karten-/Panelbeats auf ungefähr ein Drittel oder weniger begrenzen, wenn andere Mechaniken sinnvoll sind
- mindestens einen Hero-/Memorable-Moment planen

## Remotion-Regeln

- deterministisch: `useCurrentFrame()`, `interpolate()`, `spring()`, `Sequence`
- kein `Math.random()` im Render
- keine Render-Time-Netzwerkaufrufe oder Downloads
- Assets über Repository/staticFile-Pfade
- direkte Frame-Seeks müssen funktionieren
- Hard Cut ist Standard; Übergang nur bei echter semantischer Kontinuität
- eine dominante erklärende Bewegung pro Beat, maximal drei starke Bewegungen gleichzeitig
- Zeitachsen grundsätzlich über kanalweite Easing-Helfer statt mechanisch lineare Motion; lineare Progression nur, wenn sie semantisch wirklich linear ist (z. B. echte kontinuierliche Progressanzeige)
- Gruppen sinnvoll staffeln statt alles gleichzeitig einzublenden
- Bewegungsgeschwindigkeit an Distanz/Objektgewicht anpassen
- keine vollständige Library-Animation mehrfach im selben Reel nur aus Bequemlichkeit

Motion-Grundlagen liegen unter `.claude/skills/` und `ki/gehirn/BEWEGUNG.md`.

## Text-Hierarchie

- Header/Zwischenüberschrift: kurzer Kapitelmarker
- Caption: gesprochener Text
- Animationstext: kurze Objekt-/Zustandslabels
- Visual: zeigt Mechanismus/Zustandsänderung

Interne `goal`, `communicationGoal`, Debug- oder Regietexte niemals sichtbar machen.

Sprechertext nicht gleichzeitig als langen Header und Animationstext duplizieren.

## Externe Bilder/Medien

`ki/BILDSTIL.md` gilt **nachdem** `VISUAL_STRATEGY.md` ein externes Still-/Hybrid-Asset begründet hat.

Generierte/externe Bilder enthalten standardmäßig:

- keine Überschrift
- keine Untertitel
- keine Wasserzeichen
- keine langen Texte

Präzise UI, Zahlen, Labels, Pfeile und Zustände möglichst als kontrollierte Remotion-Ebene.

Das Repository darf fehlende Medien nicht vortäuschen. Phase 1 darf nur Bedarf, Prompt/Shot-Brief und Dateinamen definieren.

## Publishing-Regel

Plattformordner sind Packaging, keine zweite Produktionswahrheit.

Kein zweites Skript, `reel.json` oder Remotion-Projekt nur für YouTube/TikTok/Instagram/Facebook/Snapchat anlegen.

Short-Form-Master bleibt unter `ki/reels/`. Plattform-Copy gehört in `03-caption/platform-copy.md`.

YouTube Longform ist ein separates Format und wird nicht automatisch aus einem Short verlängert.

Zeitabhängige Plattformlimits/Monetarisierungsregeln bei konkreter Veröffentlichung aktuell prüfen.

## QA-Regel

Technische QA:

- Strukturvertrag
- TypeScript/Tests
- Assets/Pfade
- Audio-Sync
- Smoke-Frames
- Render-Validierung
- Safe Zones

Creative QA:

- Hook
- Tempo/Leerlauf
- visuelle Wiederholung
- Kartenlastigkeit
- sichtbarer Mechanismus
- Memorable Moment
- Smartphone-Eindruck
- Faktenwirkung sichtbarer Zahlen/Claims

Verbindlich:

- `ki/gehirn/POST_RENDER_REVIEW.md`
- `ki/gehirn/CREATIVE_QA.md`
- V2: `06-projektdateien/creative-review.md` = PASS

Ein technisch gültiges MP4 ist nicht automatisch freigegeben.

## Wahrheitspflicht

Nie behaupten, dass Tests, Typecheck, Audio-Sync, Smoke-Frames, Render, visuelle Prüfung, Creative QA oder Veröffentlichung bestanden/erfolgt sind, wenn sie nicht tatsächlich ausgeführt wurden.

Bei Blocker nennen:

- exakter Befehl
- Fehler
- betroffene Datei
- nächste sinnvolle Aktion

Keine Fehler mit `any`, `@ts-ignore`, deaktivierten Tests, Fake-Assets, Fake-Berichten oder geschwächten Validatoren verstecken.

## STRIKE KI-Regel — keine künstlichen Assets

Du darfst keine nicht vorhandenen Bilder, Audios, Videos oder Captures als real vorhanden behandeln. Verwende ausschließlich tatsächliche Dateien/Medien. Phase 1 darf Prompts/Shot-Briefs und Asset-Bedarf planen, aber keine Medienexistenz halluzinieren.
