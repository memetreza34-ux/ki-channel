# KI-Channel — kanonischer Repository-Stand

**Status:** 2026-09-22

Diese Datei ist der Einstiegspunkt für jeden neuen Chat, Codex-, Antigravity- oder anderen Coding-Agenten.

## 1. Kanonischer Branch

`main` ist der einzige kanonische Produktionsstand.

Andere `feature/*`, `fix/*`, `codex/*` und `backup/*` Branches sind Historie, Sicherungen oder frühere Arbeitsstände. Sie dürfen nicht als aktuelle Wahrheit verwendet werden, außer der Nutzer nennt einen solchen Branch ausdrücklich.

Neue normale Änderungen starten von `main` auf einem Arbeitsbranch. `main` wird nicht direkt verändert, außer der Nutzer verlangt ausdrücklich Repository-Stabilisierung/Kanonisierung oder arbeitet bewusst am kanonischen Produktionssystem.

## 2. Verbindliche Lesereihenfolge

Bei KI-Kanal-Arbeit gilt:

1. `REPO-STATE.md`
2. `AGENTS.md`
3. `ki/AGENTS.md`
4. `ki/gehirn/MASTER.md`
5. danach die passende Domäne:
   - Reel-Arbeit → `ki/reels/AGENTS.md`
   - Story/Hook → `ki/gehirn/STORY_RETENTION.md`
   - Fakten/Quellen → `ki/gehirn/FAKTENQUELLEN.md`
   - Visual-Auswahl → `ki/gehirn/VISUAL_STRATEGY.md`
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

Planung, Audio, reale Assets/Captures und Export eines Reels liegen ausschließlich hier:

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
06-projektdateien/creative-review.md
06-projektdateien/PHASE-STATUS.md
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
- Bildsprache nach Inhalt wählen, nicht automatisch Remotion maximieren
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
→ Visual Beats
→ Visual Strategy
→ Animation-/Shot-Plan
→ Asset-/Capture-Entscheidung
→ Captions/Packaging
→ reel.json
→ ausführbare Source + Composition
```

Phase 1 beginnt ausdrücklich **nicht** mit Remotion-Code.

### Phase 2 — Mensch

Immer:

- echtes Voiceover erzeugen und in `01-script-audio/` ablegen

Nur wenn Phase 1 es ausdrücklich als Pflicht geplant hat:

- REAL_CAPTURE aufnehmen
- externes Still-/Hybrid-/Motion-Asset bereitstellen

Wenn kein externes Medium nötig ist, bleibt Phase 2 weiterhin Voiceover-only.

### Phase 3 — Codex / Antigravity

```text
reale Medien prüfen
→ Audio analysieren
→ semantische Timeline synchronisieren
→ technische Checks
→ Smoke-Review
→ Final-Render
→ technische Post-Render-QA
→ Creative QA
→ Fakten-Rechecks
```

Codex/Antigravity bauen ein Phase-1-fertiges Reel nicht aus Bequemlichkeit neu von Null.

Fehlt Audio in Phase 3: exakt `PHASE 2 AUDIO FEHLT`.

Fehlt ein als Pflicht markiertes reales Asset/Capture, wird es nicht durch eine generische Karte oder Fake-Datei ersetzt.

## 7. Kanonische kreative Entscheidungsreihenfolge

Für Short-Form gilt:

```text
1. Was soll der Zuschauer am Ende verstanden haben?
2. Was erzeugt sofort Neugier/Reibung?
3. Welche Claims müssen geprüft werden?
4. Was sagt der Sprecher tatsächlich?
5. Welche Visual Beats entstehen aus der Bedeutung?
6. Was muss der Zuschauer bei jedem Beat sehen?
7. Welches Hauptverb beschreibt die sichtbare Handlung?
8. Welche Visual Modality erklärt es am besten?
9. Welcher Mechanismus/Shot setzt diese Modality um?
10. Erst jetzt vorhandene Library/Remotion-Technik prüfen.
```

Verbindliche Modalities:

- `REMOTION_NATIVE`
- `REAL_CAPTURE`
- `HYBRID`
- `EXTERNAL_STILL_REQUIRED`
- `EXTERNAL_MOTION_REQUIRED`

**Keine Modality ist pauschal Default oder Premium. Beste Erklärung gewinnt.**

## 8. Verbindliche visuelle Identität

- Short-Form standardmäßig 1080 × 1920 / 30 FPS
- Longform aktuell 1920 × 1080 / 30 FPS
- heller editorialer Grundlook
- dunkle Schrift
- Marken-Lila `#B98CFF` als primärer Fokus-Akzent
- dunkles Lila `#6E45C9` für Tiefe/Kontrast
- faceless, keine erkennbaren Gesichter
- keine Cyberpunk-/Neon-Standardästhetik
- Sprechertext, Caption, Header und Visual haben getrennte Aufgaben
- keine erfundenen Zahlen oder real wirkenden Fake-Quellen
- keine monotone Karten-/Panelserie aus Bequemlichkeit
- mindestens ein geplanter visueller Höhepunkt pro Reel, sofern die Idee ein Reel rechtfertigt

### Karten-/Panel-Regel

Karten/Panels sind semantisch sinnvoll für UI, Dokument, Nachricht, Datei, Datensatz oder Token.

Sie sind kein Standardcontainer für abstrakte Aussagen.

Richtwerte für neue Reels:

- Karten-/Panel-Hauptbeats normalerweise höchstens ungefähr ein Drittel
- nicht mehr als zwei gleiche Hauptgrammatiken direkt hintereinander, sofern nicht bewusst derselbe Prozess fortgesetzt wird
- reale Tool-UI prüfen, wenn reales Produktverhalten selbst der Beweis ist

Details: `ki/gehirn/MASTER.md`, `ki/gehirn/REELS.md`, `ki/gehirn/VISUAL_STRATEGY.md`, `ki/BILDSTIL.md`.

## 9. Story-/Retention-Qualität

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

## 10. Fakten-/Quellen-Qualität

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

## 11. QA — technisch UND kreativ

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
- Tests/TypeScript
- Asset-Pfade
- Audio-Sync
- Safe Zones
- Smoke-Frames
- Render-Validierung

Creative QA umfasst:

- Hook
- Tempo/Leerlauf
- visuelle Wiederholung
- Kartenlastigkeit
- sichtbaren Mechanismus
- Memorable Moment
- Smartphone-Eindruck
- Wirkung sichtbarer Zahlen/Claims

Verbindlich:

- `ki/gehirn/POST_RENDER_REVIEW.md`
- `ki/gehirn/CREATIVE_QA.md`
- bei V2-Reels `06-projektdateien/creative-review.md`

Ein technisch gültiges MP4 ist nicht automatisch kreativ freigegeben.

## 12. Bekannte externe Einschränkungen

- GitHub Actions ist für dieses private Repository derzeit auf Konto-/Billing-/Runner-Ebene kein verlässlicher aktueller Qualitätsbeweis. Wenn kein Run entsteht, lokale/ausführbare Checks nicht als ersetzt betrachten.
- Nur tatsächlich ausgeführte Tests, Typechecks, Renders und Reviews dürfen als bestanden gemeldet werden.
- Fehlende externe Medien, Audio oder Lockfiles niemals halluzinieren.

Diese Betriebsgrenzen sind keine Erlaubnis, Struktur-, Test-, Story-, Fakten- oder Qualitätsregeln zu umgehen.
