# KI Channel

Produktions-Repository für einen deutschen, vollständig faceless KI-Erklärkanal mit Story-, Grounding-, Visual-Strategy-, Remotion- und Multi-Plattform-Publishing-System.

## Für neue Chats und Agenten

**Immer zuerst `REPO-STATE.md` lesen.** Dort stehen kanonischer Branch, aktuelle Architektur und verbindliche Produktionslogik.

`main` ist der kanonische Produktionsstand. Historische Arbeits-/Backup-Branches sind keine aktuelle Quelle, solange der Nutzer sie nicht ausdrücklich nennt.

## Kernprinzip

```text
Story vor Script
Fakten vor Behauptung
Visual Strategy vor Technik
beste Erklärung vor Tool-Präferenz
technische QA + Creative QA vor Freigabe
```

Das Repository soll nicht nur fehlerfreie Videos rendern. Es soll verhindern, dass technisch saubere, aber langsame, repetitive oder kartenlastige Reels als fertig gelten.

## Architektur

```text
.
├── REPO-STATE.md                 # höchste Repository-Wahrheit
├── AGENTS.md                     # Agent-Betriebsvertrag
├── GEMINI.md                     # Antigravity/Gemini-Vertrag
├── core/                         # @studio/core – Brand/UI-Bausteine
├── ki/                           # @studio/ki – Kanal- und Content-System
│   ├── gehirn/
│   │   ├── MASTER.md
│   │   ├── KANAL.md
│   │   ├── STORY_RETENTION.md
│   │   ├── FAKTENQUELLEN.md
│   │   ├── REELS.md
│   │   ├── VISUAL_STRATEGY.md
│   │   ├── CREATIVE_QA.md
│   │   ├── POST_RENDER_REVIEW.md
│   │   ├── PLATTFORMEN.md
│   │   └── PRODUKTIONSABLAUF.md
│   ├── BILDSTIL.md
│   ├── animation-library/
│   ├── reels/                    # kanonische Short-Form-Produktionspakete
│   ├── youtube-longform/         # eigenständiges Longform-Format
│   ├── plattformen/              # Publishing-Regeln, keine Medien-Duplikate
│   └── src/
│       ├── animation-library/
│       ├── motion-system/
│       ├── reels/                # nur ausführbarer Short-Form-Source
│       └── longform/             # nur ausführbarer Longform-Source
├── scripts/
├── docs/
└── .github/workflows/
```

Workspaces:

- `core` → `@studio/core`
- `ki` → `@studio/ki`

## Short-Form-Produktionspaket

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

Ausführbarer Source bleibt separat unter `ki/src/reels/<slug>/`.

### Neues Reel — V2

```bash
npm run new-video -- "Reel Titel"
```

Das Scaffold erzeugt automatisch unter `06-projektdateien/`:

- `production-contract-v2.json`
- `creative-brief.md`
- `source-ledger.md`
- `visual-strategy.md`
- `creative-review.md`
- `PHASE-STATUS.md`

Legacy-Reels ohne V2-Vertrag bleiben erhalten und kompatibel. Neue Reels verwenden V2.

Strukturprüfung:

```bash
npm run ki:reel:structure-check
```

## V2-Produktionsreihenfolge

### Phase 1 — ChatGPT

```text
Creative Brief / Story
→ Fakten & Quellen
→ finaler Sprechertext
→ Visual Beats
→ Visual Strategy
→ Animation-/Shot-Plan
→ Asset-/Capture-Entscheidung
→ Captions + Plattform-Copy
→ reel.json
→ ausführbare Source + Composition
```

Phase 1 benötigt noch kein echtes Voiceover.

### Phase 2 — Mensch

Immer:

- echtes Voiceover

Nur wenn die Visual Strategy es ausdrücklich verlangt:

- REAL_CAPTURE
- externes Still-/Hybrid-/Motion-Asset

### Phase 3 — Codex / Antigravity

```text
reale Medien prüfen
→ Audio analysieren
→ Visual Beats/Caption an echte Stimme koppeln
→ technische Checks
→ Smoke-Frames prüfen
→ Final Render
→ Post-Render Review
→ Creative QA
→ Fakten-Recheck
```

Details: `ki/gehirn/PRODUKTIONSABLAUF.md`.

## Visual Strategy

Es gibt keinen pauschalen „Remotion für alles“-Default mehr.

Für jeden bedeutungstragenden Beat wird zuerst entschieden, welche Bildsprache die Aussage am besten erklärt:

- `REMOTION_NATIVE` — kontrollierte UI, Daten, Prozesse, technische Mechanismen
- `REAL_CAPTURE` — echtes Produktverhalten ist Teil des Beweises
- `HYBRID` — räumliches/physisches Motiv + kontrollierte Remotion-Overlays
- `EXTERNAL_STILL_REQUIRED` — komplexe räumliche/organische Momentaufnahme
- `EXTERNAL_MOTION_REQUIRED` — komplexe physische Bewegung ist selbst Bedeutungsträger

Erst danach wird Library/Remotion-Technik gewählt.

Details: `ki/gehirn/VISUAL_STRATEGY.md`.

## Kreativer Qualitätsstandard

Neue Reels benötigen vor Source:

- klaren Viewer Promise
- Hook ohne Vorrede
- 3-second proof
- sichtbaren Kernmechanismus
- Payoff
- mindestens einen geplanten Memorable/Hero-Moment
- Truth Risk / Faktenrisiko

Karten/Panels sind nur sinnvoll, wenn sie semantisch echte UI, Dokumente, Dateien, Nachrichten, Datensätze oder Tokens darstellen.

Technisch bestanden + kreativ langweilig = **nicht fertig**.

Details: `ki/gehirn/STORY_RETENTION.md`, `ki/gehirn/REELS.md`, `ki/gehirn/CREATIVE_QA.md`.

## Fakten & Quellen

Aktuelle, messbare oder produktabhängige Claims werden in `source-ledger.md` geerdet.

Besonders:

- Preise/Limits/Pläne
- Modell-/Feature-Verfügbarkeit
- sichtbare Zahlen/Prozentwerte
- Rankings/Benchmarks
- reale Quellen/Paper
- News
- aktuelle Produktoberfläche/-funktion

Keine scheinpräzisen Demo-Werte als Fakten.

Details: `ki/gehirn/FAKTENQUELLEN.md`.

## Publishing / Plattformen

Ein Short-Form-Reel wird **einmal** produziert. YouTube Shorts, Instagram Reels, TikTok, Facebook Reels und Snapchat verwenden denselben freigegebenen Master, solange keine technisch notwendige Anpassung erforderlich ist.

Plattform-spezifische Copy liegt pro Reel in:

```text
03-caption/platform-copy.md
```

YouTube Longform ist ein eigenes Format und wird nicht automatisch aus Reels aufgeblasen.

## Visuelle Identität

- hell, editorial, premium
- Marken-Lila `#B98CFF`
- dunkle Schrift `#1A1A2E`
- faceless
- keine generische Cyberpunk-/Neon-Optik
- Animation erklärt statt dekoriert
- beste Bildsprache nach Inhalt statt Tool-Default
- Überschrift, Caption und Animationstext duplizieren sich nicht unnötig
- Plattformtitel/Thumbnail versprechen nie mehr als der Inhalt liefert

## Technische Gates

```bash
npm run repo:wiring-check
npm run ki:reel:structure-check
npm run typecheck
npm test
npm run content:runtime:verify
npm run repo:verify
```

Release:

```bash
npm run release:verify
npm run release:smoke
npm run release:full
```

Ein technischer Render ist keine kreative Freigabe.

## Bekannte Betriebsgrenzen

GitHub Actions kann für dieses private Repository auf Konto-/Billing-/Runner-Ebene ausfallen und ist dann kein Qualitätsbeweis. Nur tatsächlich ausgeführte lokale/ausführbare Checks dürfen als bestanden gelten.

Fehlende Assets, Audios, Captures oder Lockfiles niemals vortäuschen.
