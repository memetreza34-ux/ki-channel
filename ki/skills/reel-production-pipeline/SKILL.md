---
name: reel-production-pipeline
description: >
  Verbindlicher V2-Workflow zur Produktion eines neuen KI-Channel-Reels.
  Aktivieren, wenn ein neues Reel angelegt, Phase 1 vervollständigt oder ein
  bestehendes V2-Reel in Phase 3 mit echtem Audio assembliert wird.
---

# Reel Production Pipeline V2

## Zweck

Dieser Skill setzt den Produktionsvertrag aus `ki/gehirn/MASTER.md`,
`ki/gehirn/PRODUKTIONSABLAUF.md` und `ki/reels/AGENTS.md` praktisch um.

**Wichtig:** Neue Reels beginnen nicht mit Audio und nicht mit Remotion-Code.

```text
Story
→ Fakten
→ Sprechertext
→ Visual Beats
→ Visual Strategy
→ Source
→ echtes Voiceover / reale Pflichtmedien
→ Timeline
→ Render
→ technische QA
→ Creative QA
```

## Voraussetzungen

- Repository-Status/Branch geprüft
- `REPO-STATE.md`, `ki/AGENTS.md`, `ki/gehirn/MASTER.md`, `ki/reels/AGENTS.md` gelesen
- für neue Reels: noch **kein Audio erforderlich**
- vorhandene reale Medien dürfen verwendet werden; fehlende Medien niemals vortäuschen

## Kritische Regeln

### Story vor Technik

Vor Script/Source `ki/gehirn/STORY_RETENTION.md` anwenden.

### Fakten vor finalem Script

`ki/gehirn/FAKTENQUELLEN.md` und `source-ledger.md` verwenden.

### Bildsprache vor Remotion

`ki/gehirn/VISUAL_STRATEGY.md` entscheidet pro Beat:

- `REMOTION_NATIVE`
- `REAL_CAPTURE`
- `HYBRID`
- `EXTERNAL_STILL_REQUIRED`
- `EXTERNAL_MOTION_REQUIRED`

Keine pauschale Remotion-Default-Regel.

### Keine Asset-Halluzination

Phase 1 darf Asset-Bedarf, Prompt/Shot-Brief und erwarteten Dateinamen definieren. Phase 3 darf nur real vorhandene Dateien verwenden.

### Audio-basierte Synchronisation

Finale Timings werden in Phase 3 aus dem echten Voiceover bestimmt. Keine lineare Gesamtframe-Verteilung und keine Szenenbildung allein nach „fünf längsten Pausen“.

Pausen sind ein Signal, **Sprecherbedeutung ist der Master**.

---

# Phase 1 — komplette Grundlage ohne echtes Audio

## Schritt 1: Reel mit V2-Scaffold anlegen

```bash
node scripts/new-ki-reel.mjs "Reel Titel" [YYYY-MM-DD]
node scripts/check-ki-reel-folder-structure.mjs
```

Erwartete Struktur:

```text
ki/reels/<WOCHE>/<NN_Reel-Titel>/
├── 01-script-audio/
├── 02-bilder/
├── 03-caption/
├── 04-pdf/
├── 05-export/
└── 06-projektdateien/
```

V2 legt automatisch an:

- `production-contract-v2.json`
- `creative-brief.md`
- `source-ledger.md`
- `visual-strategy.md`
- `creative-review.md`
- `PHASE-STATUS.md`

## Schritt 2: Creative Brief vervollständigen

In `06-projektdateien/creative-brief.md`:

- Viewer promise
- Hook tension
- 3-second proof
- Why care
- Core mechanism
- Payoff
- Memorable moment
- Truth risk

Wenn Hook/Mechanismus/Memorable Moment unklar: noch kein Code.

## Schritt 3: Source Ledger

In `06-projektdateien/source-ledger.md` relevante Claims erfassen.

Besonders:

- aktuelle Features/Modelle
- Preise/Limits
- sichtbare Zahlen
- Rankings/Benchmarks
- reale Paper/Quellen
- News
- aktuelle Tool-Oberfläche/-Funktion

Status pro Claim: `VERIFIED`, `QUALIFIED` oder `REMOVE`.

## Schritt 4: finalen Sprechertext schreiben

Erstellen:

```text
01-script-audio/voiceover.md
01-script-audio/VOICEOVER-ZUM-KOPIEREN.txt
```

Der Copy-Text enthält ausschließlich den finalen gesprochenen Wortlaut.

Keine Länge künstlich auf 50–60 Sekunden strecken.

## Schritt 5: Visual Beats + Visual Strategy

`06-projektdateien/visual-strategy.md` vervollständigen.

Pro Beat:

```text
Beat-ID
Sprecherstelle
Bedeutung
Zuschauer muss sehen
Hauptverb
Startzustand
sichtbare Veränderung
Endzustand
Modality
Mechanikfamilie
Hero beat JA/NEIN
Asset/Capture falls nötig
```

Danach erst `animation-plan.md`.

## Schritt 6: Asset-/Capture-Entscheidung

### Remotion-native

Kein externes Asset nötig.

### REAL_CAPTURE

Dokumentieren:

- Produkt
- Capture-Datum
- Zweck/Claim
- erwarteter Dateiname

### Still/Hybrid/Motion extern

- Asset-/Shot-Brief schreiben
- bei Still/Hybrid `ki/BILDSTIL.md` anwenden
- Manifest-Eintrag mit realem Status
- fehlt Datei: `MISSING_REQUIRED`

Nicht durch generische Karten ersetzen.

## Schritt 7: Projektdateien vervollständigen

Mindestens:

```text
06-projektdateien/reel.json
06-projektdateien/animation-plan.md
03-caption/subtitle-cues.json
03-caption/platform-copy.md
02-bilder/asset-manifest.json
```

Audio-unabhängige Cue-Zeiten sind nur Planungswerte.

## Schritt 8: Source erstellen

Source ausschließlich unter:

```text
ki/src/reels/<slug>/
```

Production-Composition über den kanonischen Production-Root registrieren.

Nicht:

- Voiceover statisch importieren, bevor Phase 2 existiert
- Planung in den Source-Ordner kopieren
- Library-Animation aus Bequemlichkeit verwenden

## Schritt 9: Phase-1-Checks

```bash
node scripts/check-ki-reel-folder-structure.mjs
npm run typecheck
npm test
```

Nur tatsächlich ausgeführte Checks als bestanden markieren.

Phase 1 ist fertig, wenn Story, Grounding, Visual Strategy, Planung und ausführbare Source vorhanden sind.

---

# Phase 2 — Mensch: reale Medien

## Voiceover

`VOICEOVER-ZUM-KOPIEREN.txt` wortgetreu vertonen.

Bevorzugt:

```text
01-script-audio/voiceover.wav
```

Alternativ `.mp3`.

## Nur wenn Visual Strategy es verlangt

Zusätzlich bereitstellen:

- REAL_CAPTURE
- externes Still-/Hybrid-/Motion-Asset

Exakter Dateiname aus Manifest/Briefing.

Phase 2 ändert keine Planungs-/Source-Dateien.

---

# Phase 3 — Assembly mit echtem Audio

## Schritt 1: Preflight

- `PHASE-STATUS.md` lesen
- Creative Brief, Source Ledger, Visual Strategy lesen
- Voiceover real vorhanden?
- alle `MISSING_REQUIRED`-Pflichtmedien real vorhanden?

Fehlt Audio:

```text
PHASE 2 AUDIO FEHLT
```

## Schritt 2: Audio analysieren

Dauer z. B. mit:

```bash
ffprobe -v error -show_entries format=duration -of csv=p=0 <audio-datei>
```

Pausen können zusätzlich mit `silencedetect` analysiert werden:

```bash
ffmpeg -i <audio-datei> -af silencedetect=noise=-30dB:d=0.3 -f null -
```

**Aber:** Szenengrenzen entstehen aus Sprecherbedeutung + realen Phrasen/Pausen, nicht aus einer festen Anzahl längster Pausen.

Wenn Wort-/Phrase-Timestamps technisch verfügbar sind, diese bevorzugen.

## Schritt 3: Timeline an echte Stimme koppeln

Für jeden Visual Beat:

```text
reale Phrase
→ reale Start-/Endzeit
→ sichtbarer Beat-Start
→ Zustandswechsel
→ Hold/Übergang
→ Caption-Timing
```

Bei Timingproblem:

1. Visual/Hold/Szene anpassen
2. natürliche Pause leicht anpassen
3. nur falls nötig ganze Phrase pitch-erhaltend leicht retimen
4. Captions danach auf final verwendetes Audio synchronisieren

## Schritt 4: Audio/Assets integrieren

- reale Dateien verwenden
- keine Render-Time-Downloads
- Audio explizit über Production-Props/Source integrieren
- fehlende Medien nicht vortäuschen

## Schritt 5: technische Checks

Mindestens passende Repo-Befehle ausführen:

```bash
node scripts/check-ki-reel-folder-structure.mjs
npm run typecheck
npm test
```

Zusätzliche reel-spezifische Checks, falls vorhanden.

## Schritt 6: Smoke-Frames

Pro Szene/Beat relevante Zustände rendern:

- Opening
- Mid/Mechanikwechsel
- End-Hold
- kritische Caption-/Safe-Zone-Zeitpunkte

Stills **tatsächlich ansehen**.

## Schritt 7: Final rendern

Mit dem Production-Entry/Composition-Workflow des Repos rendern.

Finale Datei unter `05-export/` ablegen, sofern reel-spezifischer Vertrag nichts anderes sagt.

## Schritt 8: technische Post-Render-QA

`ki/gehirn/POST_RENDER_REVIEW.md` anwenden.

Prüfen:

- Audio-Spur
- Dauer
- Caption-Kollision
- Smartphone-Lesbarkeit
- keine geclippten Hauptvisuals
- keine falschen Assets/Props

## Schritt 9: Creative QA

`ki/gehirn/CREATIVE_QA.md` anwenden.

`06-projektdateien/creative-review.md` vervollständigen.

Nicht freigeben bei:

- schwachem Hook
- Leerlauf
- repetitiver Karten-/Panelserie
- fehlendem sichtbaren Mechanismus
- keinem Memorable Moment
- Kernidee nur über Text verständlich
- ungrounded sichtbaren Zahlen/Claims

Finaler Status nur bei `creative-review.md = PASS`.

---

## Checkliste

### Phase 1

- [ ] V2-Scaffold
- [ ] Creative Brief fertig
- [ ] Source Ledger fertig
- [ ] finaler Sprechertext + Copy-Datei
- [ ] Visual Strategy pro Beat
- [ ] Hero/Memorable Moment geplant
- [ ] Animation-/Shot-Plan
- [ ] Asset-Manifest mit realen Status
- [ ] Captions/Plattform-Copy Basis
- [ ] reel.json
- [ ] Source + Composition
- [ ] Struktur/Tests/Typecheck tatsächlich ausgeführt

### Phase 3

- [ ] echtes Audio vorhanden
- [ ] alle Pflichtmedien vorhanden
- [ ] echte Audioanalyse
- [ ] semantische Beat-Timings
- [ ] Captions am finalen Audio
- [ ] technische Checks bestanden
- [ ] Smoke-Frames angesehen
- [ ] finaler MP4 angesehen
- [ ] technische Post-Render-QA bestanden
- [ ] Source-Ledger-Rechecks erledigt
- [ ] Creative QA bestanden
- [ ] `creative-review.md` = PASS

## Typische Fehler

| Fehler | Ursache | Korrektur |
|---|---|---|
| Reel wirkt wie PowerPoint | Karten als Standardvisual | Visual Strategy neu: Verb/Mechanik/Modality bestimmen |
| technisch stark, Hook schwach | Code vor Story | zurück zu Creative Brief |
| aktuelle Aussage falsch | kein Source Ledger/Recheck | Claim prüfen/qualifizieren/entfernen |
| echte UI durch Fake-UI ersetzt | Remotion als Default | `REAL_CAPTURE` prüfen |
| Animation asynchron | lineare Frame-Aufteilung | echte Phrase-/Pausen-Timings verwenden |
| Pflichtasset fehlt | Manifest ignoriert | zurück zu Phase 2, nicht Ersatz erfinden |
| Tests grün, Video langweilig | nur technische QA | Creative QA als Stop-Gate |
