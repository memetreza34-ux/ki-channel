# KI-Channel — kanonischer Repository-Stand

**Status:** 2026-09-28

Diese Datei ist der Einstiegspunkt für jeden neuen Chat, Codex-, Antigravity- oder anderen Coding-Agenten.

## 1. Kanonischer Branch

`main` ist der einzige kanonische Produktionsstand.

Andere `feature/*`, `fix/*`, `strategy/*`, `codex/*` und `backup/*` Branches sind Arbeitsstände, Historie oder Sicherungen. Sie dürfen nicht als aktuelle Wahrheit verwendet werden, außer der Nutzer nennt einen solchen Branch ausdrücklich.

Neue normale Änderungen starten von `main` auf einem Arbeitsbranch. `main` wird nicht direkt verändert, außer der Nutzer verlangt ausdrücklich Repository-Stabilisierung/Kanonisierung oder arbeitet bewusst am kanonischen Produktionssystem.

## 2. Verbindliche Lesereihenfolge

Bei KI-Kanal-Arbeit gilt:

1. `REPO-STATE.md`
2. `AGENTS.md`
3. `ki/AGENTS.md`
4. `ki/gehirn/MASTER.md`
5. danach die passende Domäne:
   - Kanal/Themen → `ki/gehirn/KANAL.md` + `ki/gehirn/THEMENWAHL.md`
   - Reel-Arbeit → `ki/reels/AGENTS.md`
   - Story/Hook → `ki/gehirn/STORY_RETENTION.md`
   - Fakten/Quellen → `ki/gehirn/FAKTENQUELLEN.md`
   - **Kanal-Bildwelt / Art Direction → `ki/gehirn/ART_DIRECTION.md`**
   - Visual-Auswahl → `ki/gehirn/VISUAL_STRATEGY.md`
   - Remotion-Visualbau → `ki/gehirn/REMOTION_VISUAL_SYSTEM.md`
   - Remotion-Implementierung/Render → `ki/skills/remotion-production-orchestration/SKILL.md` + `ki/gehirn/WERKZEUGE.md`
   - Creative Review → `ki/gehirn/CREATIVE_QA.md`
   - YouTube Longform → `ki/youtube-longform/AGENTS.md`
   - Plattform/Publishing → `ki/gehirn/PLATTFORMEN.md` + `ki/plattformen/AGENTS.md`
6. das ausdrücklich genannte Reel/Longform-Video/Format und dessen nächstes `AGENTS.md`
7. erst danach konkrete Pläne, Source- oder Plattformdateien

Für ausführbaren Source gelten zusätzlich die nächstliegenden Source-Verträge:

- Reels → `ki/src/reels/AGENTS.md`
- Longform → `ki/src/longform/AGENTS.md`

Ältere Dokumente, alte PR-Beschreibungen, Demo-Code und historische Branches dürfen diese Reihenfolge nicht überschreiben.

## 3. Kanonische Short-Form-Produktionsstruktur

Planung, Audio, reale Captures/Quellenmedien und Export eines Reels liegen ausschließlich hier:

```text
ki/reels/YYYY-MM-DD_bis_YYYY-MM-DD/NN_Reel-Titel/
├── README.md
├── 01-script-audio/
├── 02-bilder/
├── 03-caption/
├── 04-pdf/
├── 05-export/
└── 06-projektdateien/
```

Ausführbarer Remotion-Code liegt getrennt hier:

```text
ki/src/reels/<slug>/
```

Planungsdateien werden niemals nach `ki/src/reels/` verschoben. Ein Produktionspaket wird niemals direkt unter `ki/` oder flach unter `ki/reels/<slug>/` angelegt.

### V2 für neue Reels

Neue Reels werden ausschließlich mit:

```bash
node scripts/new-ki-reel.mjs "Reel Titel"
```

angelegt und führen mindestens:

```text
06-projektdateien/production-contract-v2.json
06-projektdateien/creative-brief.md
06-projektdateien/source-ledger.md
06-projektdateien/visual-strategy.md
06-projektdateien/art-direction-calibration.json
06-projektdateien/creative-review.md
06-projektdateien/PHASE-STATUS.md
```

Falls der Generator die Kalibrierdatei noch nicht erzeugt, einmalig:

```bash
node scripts/init-art-direction-calibration.mjs "ki/reels/<Woche>/<Reel>"
```

Legacy-Reels ohne `production-contract-v2.json` bleiben erhalten und lesbar. Sie sind keine Vorlage für neue Produktionslogik.

## 4. Kanonische YouTube-Longform-Struktur

YouTube Longform ist ein separates aktives Produktionsformat.

```text
ki/youtube-longform/YYYY-MM-DD/NN_Video-Titel/
├── README.md
├── 01-script-audio/
├── 02-visuals/
├── 03-thumbnail/
├── 04-metadata/
├── 05-export/
└── 06-projektdateien/
```

Ausführbarer Source:

```text
ki/src/longform/<slug>/
```

Aktueller Formatstandard:

- 1920 × 1080
- 30 FPS
- 16:9
- finale Laufzeit nach echtem Voiceover typischerweise 5:00–6:00 Minuten, wenn das Thema diese Länge trägt
- finale visuelle Composition in Remotion
- echte Captures/Quellenmedien bei Bedarf als Layer in Remotion
- Thumbnail als eigene Composition

Aktives erstes Video:

```text
ki/youtube-longform/2026-08-16/01_Mit-KI-eine-App-bauen/
```

Video-Composition: `KI-Longform-AIAppWorkflow`
Thumbnail-Composition: `KI-Longform-AIAppWorkflow-Thumbnail`

## 5. Plattform-/Publishing-Struktur

Plattformlogik liegt hier:

```text
ki/plattformen/
├── youtube/
├── instagram/
├── tiktok/
├── facebook/
└── snapchat/
```

Diese Ordner enthalten Publishing-Regeln und Templates, **keine zweite Produktionswahrheit**.

Short-Form wird einmal produziert. YouTube Shorts, Instagram Reels, TikTok, Facebook Reels und Snapchat verwenden denselben freigegebenen Master, solange keine technisch notwendige Anpassung erforderlich ist.

Plattform-spezifische Copy eines Reels gehört nach:

```text
03-caption/platform-copy.md
```

YouTube Longform ist separat und wird nicht automatisch aus Reels erzeugt.

## 6. Verbindliches V2-Produktionsmodell für neue Reels

### Phase 1 — ChatGPT

```text
Creative Brief / Story
→ Fakten & Quellen
→ finaler Sprechertext
→ Art Direction Fit
→ Visual Beats / Visual Strategy
→ nur 3 Kalibrier-Szenen: Hook + Mechanism + Payoff
→ Human Creative APPROVED
→ Visual Quality V4
→ Remotion-Capability-Auswahl
→ restlicher Source + Composition
→ Beweis-/Capture-Entscheidung
→ Captions/Packaging
→ reel.json
```

Phase 1 beginnt ausdrücklich **nicht** mit Remotion-Code.

**Vollproduktion ist gesperrt**, solange `art-direction-calibration.json` nicht ausdrücklich menschlich auf `APPROVED` steht und `fullReelBuildAllowed=true` ist. Automatisches CI darf diese Freigabe nie selbst setzen.

### Phase 2 — Mensch

Immer:

- echtes Voiceover erzeugen und in `01-script-audio/` ablegen

Nur wenn Phase 1 es ausdrücklich als echten Beweis geplant hat:

- REAL_CAPTURE aufnehmen
- offizielles/reales Quellenasset bereitstellen

Wenn kein echtes Quellenmedium nötig ist, bleibt Phase 2 Voiceover-only.

### Phase 3 — Codex / Antigravity

```text
echte Medien prüfen
→ Audio analysieren
→ semantische Timeline synchronisieren
→ Remotion-Readiness
→ Smoke-Review
→ Final-Render
→ technische Post-Render-QA
→ Creative QA
→ unabhängiger Release-Review
→ Fakten-Rechecks
```

Codex/Antigravity bauen ein Phase-1-fertiges Reel nicht aus Bequemlichkeit neu von Null.

Für neue generische Phase-3-Reels gilt `remotion-production-builder`; der finale Master wird anschließend unabhängig durch `remotion-release-reviewer` geprüft.

Fehlt Audio in Phase 3: exakt `PHASE 2 AUDIO FEHLT`.

Fehlt ein als Pflicht markierter echter Capture, wird er nicht durch erfundene UI oder Fake-Datei ersetzt.

## 7. Kanonische kreative Entscheidungsreihenfolge

Für Short-Form gilt:

```text
1. Was soll der Zuschauer am Ende verstanden haben?
2. Was erzeugt sofort Neugier/Reibung?
3. Welche Claims müssen geprüft werden?
4. Was sagt der Sprecher tatsächlich?
5. Welche Visual Beats entstehen aus der Bedeutung?
6. Welche physische Metapher / welches Hero-Objekt trägt die Aussage?
7. Welche Material- und Kamerasprache aus ART_DIRECTION.md passt?
8. Welche sichtbare Handlung verändert den Zustand?
9. Braucht die Aussage eine echte Beweisquelle oder reicht ein nativer Remotion-Build?
10. Erst jetzt passende Remotion-Capability/Library prüfen.
```

### Quellen-/Beweisebene

Die Wahrheit entscheidet:

- `REMOTION_NATIVE` — bevorzugt, wenn kein realer Produktbeweis nötig ist
- `REAL_CAPTURE` — wenn tatsächliches Produktverhalten selbst der Beweis ist
- `HYBRID` — echter Capture + Remotion-Erklärung
- externe Still-/Motion-Medien — nur begründete Ausnahme

### Ausführungsebene

**Jeder finale Reel-Frame wird in Remotion komponiert und gerendert.**

Ein REAL_CAPTURE bleibt echtes Quellenmaterial, wird aber als Layer in Remotion verwendet. Ein UI-Nachbau ist nur Illustration und darf nicht als echter Screenshot ausgegeben werden.

## 8. Remotion-Produktionswahrheit

Für echte Production-Compositions:

- `ki/src/ProductionRoot.tsx` ist die kanonische Production-Registrierung.
- `ki/src/production-entry.tsx` registriert ausschließlich `ProductionRoot`.
- `ki/src/index.ts` / `ki/src/Root.tsx` dienen Studio/Preview und dürfen `MotionPreviewRoot` sowie das **Art-Direction Lab** enthalten.
- Art-Direction-Lab und `MotionPreviewRoot` dürfen niemals in den echten Production-Entry gelangen.
- alle `remotion`- und `@remotion/*`-Pakete bleiben auf exakt derselben Version.
- neue APIs aus Dokumentation/Skills werden gegen die im Repo installierte Version geprüft.
- Render-Timing ist framebasiert; kein CSS-Animationstiming und kein `Math.random()` im Production-Render.

Remotion ist für neue Inhalte nicht nur Animationsebene, sondern auch das code-first Visual-System für:

- Illustrationen
- SVG-Icons
- UI-Mockups
- Code/Terminal
- GitHub-/Repo-Szenen
- Diagramme
- Rankings/Vergleiche
- Geräte/Objekte
- 2.5D
- Shapes/Paths
- Three, wenn echte Tiefenlogik nötig ist

Vor dem ersten echten Produktions-Test und vor relevanten Remotion-Releases:

```bash
node scripts/verify-remotion-integration.mjs
node scripts/run-remotion-readiness.mjs
```

`REMOTION READINESS: PASS` ist das technische Start-Gate für den echten End-to-End-Test. Es ersetzt nicht den späteren visuellen Review.

## 9. Verbindliche visuelle Identität

Kanalwelt: **`physical-ai-editorial-v1`** aus `ki/gehirn/ART_DIRECTION.md`.

- Short-Form standardmäßig 1080 × 1920 / 30 FPS
- Longform aktuell 1920 × 1080 / 30 FPS
- hochwertige physische Editorial-Welt statt generischer Remotion-/Dashboard-Ästhetik
- warmes Off-White, Graphit, Papier, Acrylic, Glas, Metall, Ceramic
- Marken-Lila `#B98CFF` / `#6E45C9` primär als Energie-/Informationsakzent, nicht als komplette Welt
- faceless, keine erkennbaren Gesichter
- **keine Cyberpunk-/Neon-Standardästhetik**
- **keine Floating-Pill-Clouds oder HUD-/Dashboard-Grammatik als Standard**
- Sprechertext, Caption, Header und Visual haben getrennte Aufgaben
- keine erfundenen Zahlen oder real wirkenden Fake-Quellen
- keine monotone Karten-/Panelserie aus Bequemlichkeit
- mindestens ein geplanter visueller Höhepunkt pro Reel, sofern die Idee ein Reel rechtfertigt

Normale physische Szene als Richtwert:

```text
1 Hero
+ 0–3 Support-Objekte
+ 0–2 kurze Visual-Labels
+ höchstens 1 UI-Panel, wenn UI wirklich semantisch nötig ist
+ Purple-Flächenziel normalerweise <= 18%
```

### Karten-/Panel-Regel

Karten/Panels sind semantisch sinnvoll für UI, Dokument, Nachricht, Datei, Datensatz oder Token.

Sie sind kein Standardcontainer für abstrakte Aussagen.

Richtwerte für neue Reels:

- Karten-/Panel-Hauptbeats normalerweise höchstens ungefähr ein Viertel
- nicht mehr als zwei gleiche Hauptgrammatiken direkt hintereinander, sofern nicht bewusst derselbe Prozess fortgesetzt wird
- mindestens die Hälfte der Beats objekt-, pfad-, form-, raum-, code-, illustration- oder prozessbasiert
- reale Tool-UI verwenden, wenn reales Produktverhalten selbst der Beweis ist

Details: `ki/gehirn/ART_DIRECTION.md`, `ki/gehirn/MASTER.md`, `ki/gehirn/VISUAL_STRATEGY.md`, `ki/gehirn/REMOTION_VISUAL_SYSTEM.md`, `ki/gehirn/REELS.md`.

## 10. Story-/Retention-Qualität

`ki/gehirn/STORY_RETENTION.md` ist vor Source verbindlich.

Neue Reels brauchen:

- klaren Viewer Promise
- Hook ohne Vorrede
- 3-second proof
- sichtbaren Kernmechanismus
- Payoff
- Memorable Moment
- Truth Risk

50–60 Sekunden sind kein Laufzeitziel. Ein Reel endet, wenn sein Versprechen erfüllt ist.

## 11. Fakten-/Quellen-Qualität

`ki/gehirn/FAKTENQUELLEN.md` ist verbindlich.

Aktuelle oder messbare Aussagen werden in `source-ledger.md` geerdet, insbesondere:

- Preise/Limits/Pläne
- Modell-/Feature-Verfügbarkeit
- sichtbare Zahlen/Prozentwerte
- Rankings/Benchmarks
- reale Quellen/Paper
- News
- aktuelle Produktoberfläche/-funktion

Claims mit Recheck-Pflicht werden vor Veröffentlichung erneut geprüft.

## 12. QA — technisch UND kreativ

Statusbegriffe niemals vermischen:

```text
geplant
implementiert
technisch getestet
gerendert
visuell geprüft
kreativ geprüft
freigegeben
veröffentlicht
```

Technische QA umfasst u. a.:

- Strukturvertrag
- Remotion-Integration/Versionsgleichstand
- Tests/TypeScript
- Asset-Pfade
- Audio-Sync
- Safe Zones
- Smoke-Frames
- Render-Validierung

Creative QA umfasst:

- Art-Direction-Fit
- Hero-Dominanz
- Material-/Kamera-Kohärenz
- Hook
- Tempo/Leerlauf
- visuelle Wiederholung
- Karten-/Panel-/Pill-Dichte
- sichtbaren Mechanismus
- Memorable Moment
- Smartphone-Eindruck
- Wirkung sichtbarer Zahlen/Claims
- kein Fake-Capture
- keine gefälschten Markenassets

Verbindlich:

- `ki/gehirn/ART_DIRECTION.md`
- `ki/gehirn/POST_RENDER_REVIEW.md`
- `ki/gehirn/CREATIVE_QA.md`
- bei V2-Reels `06-projektdateien/creative-review.md`
- finaler unabhängiger `remotion-release-reviewer`

Ein technisch gültiges MP4 ist nicht automatisch kreativ freigegeben.

## 13. CI- und Wahrheitspflicht

GitHub Actions ist ein zusätzlicher reproduzierbarer Qualitätsbeweis, wenn ein Run tatsächlich ausgeführt wurde. Pull Requests gegen `main`, die relevante Repo-/Remotion-Dateien ändern, müssen die `Repository and Content System Checks` bestehen.

CI ersetzt keinen visuellen oder akustischen Human-/Agent-Review des finalen Videos. Umgekehrt darf ein nicht ausgeführter CI-Run niemals als bestanden behauptet werden.

Nur tatsächlich ausgeführte Tests, Typechecks, Renders und Reviews dürfen als bestanden gemeldet werden.

Fehlende reale Medien, Audio oder Lockfiles niemals halluzinieren.
