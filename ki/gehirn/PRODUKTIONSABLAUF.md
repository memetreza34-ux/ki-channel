# KI-Kanal — verbindlicher 3-Phasen-Produktionsablauf

Dieser Ablauf ist der Normalfall für jedes neue Short-Form-Reel.

**Welches Werkzeug in welchem Schritt:** `WERKZEUGE.md`.

## Grundsatz

Phase 1 beginnt **nicht mit Code**.

```text
Thema
→ Creative Brief / Story
→ Fakten & Quellen
→ finaler Sprechertext
→ Visual Beats
→ Visual Strategy
→ Animation-/Shot-Plan
→ Source
→ Voiceover
→ Timeline
→ Render
→ technische QA
→ Creative QA
```

Neue Reels verwenden den V2-Produktionsvertrag aus dem Scaffold.

---

## Phase 1 — ChatGPT: komplette Grundlage

Ziel: Nach Phase 1 muss der Mensch im Normalfall nur noch das Voiceover erzeugen. Externe Medien/REAL_CAPTURE kommen nur hinzu, wenn die Visual Strategy sie ausdrücklich als notwendig begründet.

### Schritt 1 — Creative Brief

Vor Script oder Remotion-Code `06-projektdateien/creative-brief.md` vervollständigen.

Pflicht:

- Viewer promise
- Hook tension
- 3-second proof
- Why care
- Core mechanism
- Payoff
- Memorable moment
- Truth risk

Regeln: `STORY_RETENTION.md`.

**Stop:** Hook, Mechanismus oder sichtbarer Höhepunkt unklar → noch kein Code.

### Schritt 2 — Fakten & Quellen

`06-projektdateien/source-ledger.md` anlegen/vervollständigen.

Ins Ledger gehören insbesondere:

- aktuelle Produkt-/Modell-/Feature-Aussagen
- sichtbare Zahlen, Preise, Rankings, Limits
- reale Paper/Quellen
- Benchmarks
- News
- kritische Vereinfachungen

Regeln: `FAKTENQUELLEN.md`.

**Stop:** sichtbare Zahl/aktuelle Behauptung ohne tragende Grundlage → Script nicht finalisieren.

### Schritt 3 — finaler Sprechertext

Erstellen:

- `01-script-audio/voiceover.md`
- denselben Sprechertext ohne Szenen/Anweisungen als `01-script-audio/VOICEOVER-ZUM-KOPIEREN.txt`

Länge ist Inhaltsergebnis, kein Selbstzweck. 50–60 Sekunden sind möglich, aber nichts wird künstlich gestreckt.

Der Text muss:

- mit dem eigentlichen Hook beginnen
- eine klare Entwicklung statt Feature-/Faktenliste haben
- fachlich mit dem Source Ledger übereinstimmen
- mit einem konkreten Aha, Limit oder Handlungsresultat enden

### Schritt 4 — Visual Beats und Visual Strategy

Sprechertext in bedeutungstragende Visual Beats zerlegen.

Für jeden Beat zuerst `06-projektdateien/visual-strategy.md` dokumentieren:

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
Asset/Capture, falls nötig
```

Erlaubte primäre Modalities:

- `REMOTION_NATIVE`
- `REAL_CAPTURE`
- `HYBRID`
- `EXTERNAL_STILL_REQUIRED`
- `EXTERNAL_MOTION_REQUIRED`

Regeln: `VISUAL_STRATEGY.md`.

**Verboten:** zuerst vorhandene Library-Animation auswählen und Inhalt passend machen.

### Schritt 5 — Produktionsplan

Danach erstellen:

- Szenenplan
- `06-projektdateien/animation-plan.md`
- Sprecherstelle → Bedeutung → Startzustand → Veränderung → Endzustand → Umsetzung → Timing
- `REUSE_EXACT` oder `NEW_BUILD` nur nach semantischem Fit
- Zuschauer-Zwischenüberschriften und minimale Labels ohne Caption-Dopplung
- Hero-/Memorable-Moment explizit markieren
- Diversity prüfen: keine unnötige Folge gleicher Karten-/Panelgrammatik

### Schritt 6 — externe Medienentscheidung

Für jeden externen Bedarf:

- Still/Hybrid → `ki/BILDSTIL.md`
- Real Capture → Produkt/Datum/Zweck dokumentieren
- Motion-Asset → Shot-/Motion-Brief dokumentieren
- erwarteten Dateinamen im Manifest festlegen
- fehlende Pflichtmedien als `MISSING_REQUIRED` markieren

Phase 1 darf fehlende Assets **nicht vortäuschen**.

Wenn kein externes Medium nötig ist, ausdrücklich dokumentieren.

### Schritt 7 — Caption, Copy und Projektvertrag

Erstellen/vervollständigen:

- `03-caption/subtitle-cues.json` als Audio-unabhängige Basis
- `03-caption/platform-copy.md`
- `02-bilder/asset-manifest.json` bzw. allgemeines Asset-Manifest mit realem Status
- `06-projektdateien/reel.json`
- `06-projektdateien/production-contract-v2.json`
- Assembly-Auftrag
- Review-Checkliste
- `06-projektdateien/creative-review.md` als noch offenes finaler Review-Artefakt
- `PHASE-STATUS.md`

Plattform-Copy ist Packaging und verändert die fachliche Aussage nicht.

### Schritt 8 — ausführbare Source

Erst jetzt:

- Source unter `ki/src/reels/<slug>/`
- Composition-Registrierung
- reel-spezifische Micro-Animationen
- Library nur bei exaktem Fit
- Caption-Safe-Zone berücksichtigen
- Content-Grounding Sprecher → Meaning → Visual Beat → Modality → Mechanik → Render-Props
- fokussierte Tests und TypeScript

### Phase-1-Fertigkriterium

Phase 1 ist erst fertig, wenn Story, Grounding, Visual Strategy, Planung und ausführbare Code-Grundlage vorhanden sind.

Der normale nächste Schritt lautet dann:

> **PHASE 2: Voiceover erzeugen.**

Falls `REAL_CAPTURE` oder ein externes Pflichtasset vorgesehen ist, gehört auch dieses reale Medium zu Phase 2.

Nur Script/Plan ohne ausführbaren Source ist nicht Phase-1-fertig.

---

## Phase 2 — Mensch: reale Medien

### Immer

1. `01-script-audio/VOICEOVER-ZUM-KOPIEREN.txt` öffnen.
2. Text wortgetreu mit der gewünschten Stimme erzeugen.
3. bevorzugt `voiceover.wav`, alternativ `voiceover.mp3` speichern.
4. Datei in `01-script-audio/` ablegen.

### Nur wenn Phase 1 es verlangt

- notwendiges REAL_CAPTURE aufnehmen
- notwendiges externes Still-/Motion-Asset erzeugen/bereitstellen
- exakt unter dem im Manifest vereinbarten Dateinamen ablegen

Keine Planungs-/Source-Dateien in Phase 2 ändern.

Wenn der Sprechertext geändert werden soll, zurück zu Phase 1.

### Phase-2-Fertigkriterium

- echte Audiodatei liegt vor
- alle als `MISSING_REQUIRED` markierten Pflichtmedien, die für den finalen Render nötig sind, liegen real vor

---

## Phase 3 — Codex oder Antigravity: Assembly und Release

Phase 3 verwendet die Phase-1-Grundlage und baut nicht kreativ von Null neu.

### Timeline-Prinzip

Das echte Voiceover ist der akustische Master.

Reihenfolge bei Timingproblemen:

1. Visual-Beat-, Szenen- und Hold-Timing anpassen
2. natürliche Pausen an Satz-/Phrasengrenzen leicht anpassen
3. nur wenn nötig eine ganze Phrase/Cue pitch-erhaltend leicht retimen
4. Captions/Wort-Timestamps exakt auf das tatsächlich verwendete Audio legen

Audio-Retiming:

- niemals mitten im Wort
- keine abrupten Speed-Sprünge
- Pitch erhalten
- Wortlaut/Reihenfolge unverändert
- bevorzugt `0.97x–1.03x`
- bei echtem Bedarf bis ungefähr `0.94x–1.06x`
- stärkere Änderung → neues Voiceover statt hörbarer Verzerrung

Wenn retimed wurde, Abschnitt + Faktor im Abschlussbericht nennen.

### Pflichten Phase 3

1. Branch/Status und Produktionsvertrag prüfen.
2. `creative-brief.md`, `source-ledger.md`, `visual-strategy.md`, `PHASE-STATUS.md` lesen.
3. Struktur-/Preflight-Checks ausführen.
4. echtes Voiceover finden; bei Fehlen mit `PHASE 2 AUDIO FEHLT` stoppen.
5. alle Pflichtassets/Captures aus Manifest prüfen; fehlendes Pflichtmedium nicht durch generische Grafik ersetzen.
6. reale Audio-Dauer und Sprechpausen analysieren.
7. Audio render-sicher integrieren.
8. Szenengrenzen/Cues anhand realer Audioanalyse ausrichten; keine rein lineare Gesamtframe-Verteilung.
9. sichtbare Zustandswechsel an gemeinte Sprecherphrase koppeln.
10. genehmigte Modality-/REUSE_EXACT-/NEW_BUILD-Entscheidungen erhalten.
11. Caption-/Visual-Trennung prüfen; kein erklärender Inhalt im reservierten Bottom-Bereich.
12. Strukturcheck, fokussierte Tests und TypeScript ausführen.
13. Opening/Mid/End-Holds und relevante Beat-Wechsel als Smoke-Frames rendern.
14. Smoke-Frames tatsächlich visuell prüfen.
15. finales MP4 rendern.
16. MP4 technisch validieren und normal sowie auf Smartphone-Größe ansehen.
17. `CREATIVE_QA.md` vollständig durchführen.
18. Ergebnis in `06-projektdateien/creative-review.md` dokumentieren.
19. Claims mit Recheck-Pflicht vor Publishing erneut prüfen.
20. Status nur für tatsächlich abgeschlossene Punkte aktualisieren.

## Stop-Bedingungen

Nicht als fertig melden bei:

- fehlendem Audio
- fehlendem Pflichtasset/Capture
- fehlender Phase-1-Source
- fehlendem Creative Brief / Visual Strategy / Source Ledger bei V2-Reels
- fehlgeschlagenen Tests/Strukturchecks
- Text-/Caption-Mismatch
- hörbar künstlichem Audio-Retiming
- überlappender/abgeschnittener Typografie
- internen Regie-/Debug-Texten im Video
- unnötiger Textdopplung
- ungrounded Zahlen oder aktuellen Claims
- einer Animation, die nur ungefähr statt exakt zum Sprecher passt
- fehlenden Visual Beats
- sichtbarer erklärender Animation in der Caption-Zone
- ungeprüften Smoke-Frames
- nicht angesehenem finalen MP4
- nicht bestandenem Creative Review
- Hook/Tempo/Kartenlastigkeit, die im Creative Review als Stop-Fehler markiert wurden

## Kurzform

```text
PHASE 1 — ChatGPT
Story → Fakten → Script → Visual Strategy → Source
        ↓
PHASE 2 — Mensch
Voiceover + nur die ausdrücklich benötigten realen Medien
        ↓
PHASE 3 — Codex / Antigravity
Audio/Assets prüfen → Timeline → Render → technische QA → Creative QA
        ↓
PUBLISHING
freigegebenen Master plattformgerecht verpacken
```
