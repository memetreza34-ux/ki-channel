# KI-Reels

## Kanonische Struktur

Jedes echte Short-Form-Produktionsreel liegt ausschließlich unter:

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

Neue Pakete nur mit:

```bash
node scripts/new-ki-reel.mjs "Reel Titel"
```

Danach:

```bash
node scripts/check-ki-reel-folder-structure.mjs
```

## Vor dem Anlegen

Wenn das Thema noch nicht feststeht, zuerst `ki/gehirn/THEMENWAHL.md` anwenden.

Nicht jede technisch machbare Idee muss produziert werden. Relevanz, Hook-Potenzial, sichtbarer Mechanismus, praktischer Payoff und Grounding müssen tragen.

## Produktionsphasen V2

### Phase 1 — ChatGPT

```text
Creative Brief / Story
→ Source Ledger
→ finaler Sprechertext
→ Visual Beats
→ Visual Strategy
→ Animation-/Shot-Plan
→ Asset-/Capture-Entscheidung
→ Captions / Plattform-Copy
→ reel.json
→ ausführbare Source + Composition
```

Echtes Voiceover darf in Phase 1 fehlen.

### Phase 2 — Mensch

Immer:

- echtes Voiceover

Nur wenn `visual-strategy.md` es ausdrücklich verlangt:

- REAL_CAPTURE
- externes Still-/Hybrid-/Motion-Asset

Wenn kein externes Medium benötigt wird, bleibt Phase 2 Voiceover-only.

### Phase 3 — Codex / Antigravity

```text
reale Medien prüfen
→ Audio analysieren
→ semantische Timeline synchronisieren
→ Tests/TypeScript
→ Smoke-Review
→ Final-Render
→ technische QA
→ Creative QA
→ Fakten-Recheck
```

Details: `ki/gehirn/PRODUKTIONSABLAUF.md`.

## V2-Pflichtdateien

Neue Reels führen unter `06-projektdateien/` mindestens:

- `production-contract-v2.json`
- `creative-brief.md`
- `source-ledger.md`
- `visual-strategy.md`
- `creative-review.md`
- `PHASE-STATUS.md`

Wenn Phase 1 als `FERTIG` markiert wird, prüft der Strukturvalidator zusätzlich, ob zentrale Inhalte tatsächlich ausgefüllt sind und die benötigten Produktionsartefakte existieren.

Wenn Phase 3 als `FERTIG` markiert wird, darf Creative Review nicht mehr offen sein, echtes Audio muss vorhanden sein und kein Pflichtasset darf noch `MISSING_REQUIRED` sein.

## Visual Strategy

Kein pauschaler Remotion-Default.

Pro bedeutungstragendem Beat wird zuerst eine primäre Modality gewählt:

- `REMOTION_NATIVE`
- `REAL_CAPTURE`
- `HYBRID`
- `EXTERNAL_STILL_REQUIRED`
- `EXTERNAL_MOTION_REQUIRED`

Danach erst Mechanik/Library/Source.

Details: `ki/gehirn/VISUAL_STRATEGY.md`.

## Creative QA

Technisch bestanden bedeutet nicht automatisch fertig.

Vor Freigabe:

- Hook prüfen
- Leerlauf prüfen
- Karten-/Panel-Wiederholung prüfen
- sichtbaren Mechanismus prüfen
- Memorable Moment prüfen
- Smartphone-Eindruck prüfen
- sichtbare Zahlen/Claims prüfen

Details: `ki/gehirn/CREATIVE_QA.md`.

## Plattform-Publishing

Ein Reel wird einmal produziert. Plattform-spezifische Titel/Captions liegen pro Reel unter:

```text
03-caption/platform-copy.md
```

YouTube Shorts, Instagram Reels, TikTok, Facebook Reels und Snapchat dürfen denselben freigegebenen Master verwenden. Kein zweites Produktionspaket pro Plattform anlegen.

Details: `ki/gehirn/PLATTFORMEN.md` und `ki/plattformen/`.

## Nach Veröffentlichung

Wenn echte Performance-Daten vorliegen, kann pro Reel optional angelegt werden:

```text
06-projektdateien/performance-review.md
```

Auswertung folgt `ki/gehirn/PERFORMANCE_LEARNING.md`.

Keine universellen Internet-Benchmarks als Wahrheit übernehmen. Bevorzugt mit eigenen vergleichbaren Videos derselben Plattform/Laufzeit vergleichen.

## Kein Template-Ordner

Es gibt bewusst **keinen** flachen `_codex-hybrid-template` mehr. Der Generator und die kanonischen Agent-/Gehirn-Dateien sind die einzige Vorlage. Dadurch können neue Chats keinen veralteten Flat-Layout-Workflow kopieren.

## Legacy-Pakete

Ältere Reels können historische Dokumentnamen oder frühere Phasenbegriffe enthalten und noch keinen V2-Vertrag besitzen.

Sie bleiben lesbar und kompatibel, sind aber **keine Vorlage für neue Reels**.

Wenn ein Legacy-Paket weiterbearbeitet oder neu veröffentlicht wird, aktuelle Wahrheits-, Fakten- und QA-Regeln gelten weiterhin.

## Source

Ausführbarer Remotion-Code bleibt separat:

```text
ki/src/reels/<slug>/
```

Planungsdateien werden nicht dorthin kopiert.
