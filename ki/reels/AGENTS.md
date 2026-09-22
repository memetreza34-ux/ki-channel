# KI-Reels — Produktionsvertrag V2

Gilt für alle Produktionspakete unter `ki/reels/` und erweitert `REPO-STATE.md`, `AGENTS.md`, `ki/AGENTS.md` und `ki/gehirn/MASTER.md`.

Legacy-Reels ohne `06-projektdateien/production-contract-v2.json` bleiben lesbar. **Neue Reels** werden mit V2 angelegt.

## Struktur ist unveränderlich

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

Die sechs nummerierten Ordner niemals entfernen, umbenennen, verschieben oder flach zusammenlegen.

## Phasenstatus ist Pflicht

`06-projektdateien/PHASE-STATUS.md` entscheidet, welche Arbeit gerade zulässig ist.

- Phase 1 offen → Story, Fakten, Visual Strategy, Planung und Code-Grundlage vervollständigen
- Phase 2 → Mensch erzeugt reales Voiceover und nur ausdrücklich benötigte reale Medien/Captures
- Phase 3 → Agent integriert Audio/Assets, synchronisiert, prüft und rendert

Phase 3 darf kein Phase-1-Reel aus Bequemlichkeit neu entwerfen.

## V2-Reihenfolge

```text
Creative Brief
→ Source Ledger
→ finaler Sprechertext
→ Visual Beats
→ Visual Strategy
→ Animation-/Shot-Plan
→ Source
→ Voiceover / reale Pflichtmedien
→ Timeline
→ Render
→ technische QA
→ Creative QA
```

Direkt vom Thema in Remotion-Code springen ist nicht zulässig.

## Phase-1-Pflichtinhalt V2

Ein V2-Reel ist erst Phase-1-fertig, wenn mindestens vorhanden sind:

- `06-projektdateien/production-contract-v2.json`
- `06-projektdateien/creative-brief.md`
- `06-projektdateien/source-ledger.md`
- finaler Sprechertext in `01-script-audio/voiceover.md`
- reiner Copy-Fließtext in `01-script-audio/VOICEOVER-ZUM-KOPIEREN.txt`
- `06-projektdateien/visual-strategy.md`
- `06-projektdateien/reel.json`
- `scene-plan.md`, falls reel-spezifischer Plan getrennt geführt wird
- `06-projektdateien/animation-plan.md`
- `03-caption/subtitle-cues.json`
- `03-caption/platform-copy.md`
- `02-bilder/asset-manifest.json`
- bei externem Still-/Hybrid-/Motion-Bedarf `02-bilder/image-prompts.md` bzw. Shot-Brief
- `06-projektdateien/creative-review.md` als offenes Phase-3-Review-Artefakt
- Assembly-/Agent-Auftrag, falls benötigt
- Review-Checkliste, falls reel-spezifisch benötigt
- ausführbarer Source unter `ki/src/reels/<slug>/`
- registrierte Composition
- fokussierte Source-/Contract-Checks

Ein Script-/Plan-only Paket ist nicht Phase-1-fertig.

## Story Contract

Vor dem finalen Script gilt `ki/gehirn/STORY_RETENTION.md`.

`creative-brief.md` beantwortet mindestens:

- Viewer promise
- Hook tension
- 3-second proof
- Why care
- Core mechanism
- Payoff
- Memorable moment
- Truth risk

Wenn Hook, Mechanismus oder sichtbarer Höhepunkt nicht konkret sind: **noch kein Source-Code**.

## Fakten Contract

Es gilt `ki/gehirn/FAKTENQUELLEN.md`.

`source-ledger.md` ist Pflicht für relevante Claims, insbesondere:

- aktuelle Features/Modelle
- Preise/Limits/Pläne
- sichtbare Zahlen/Prozentwerte
- Rankings/Benchmarks
- reale Quellen/Paper
- aktuelle News
- kritische fachliche Vereinfachungen

Kein sichtbarer Demo-Wert darf wie echter Messwert wirken.

Claims mit Recheck-Pflicht werden vor Publishing erneut geprüft.

## Visual Beat Contract

Vor Implementierung Sprechertext in **Visual Beats** zerlegen.

Ein Beat kann ein Wort, eine Phrase, ein Halbsatz, Satz oder zusammenhängende Satzgruppe sein.

Für jeden Beat festhalten:

```text
Sprecherstelle
→ Bedeutung
→ Zuschauer muss sehen
→ Hauptverb
→ Startzustand
→ sichtbare Veränderung
→ Endzustand
→ Visual Modality
→ Mechanikfamilie
→ REUSE_EXACT oder NEW_BUILD
→ Sprecher-Timing
```

Nicht jedes Wort braucht Bewegung. Jede echte Bedeutungsänderung braucht aber eine bewusste visuelle Entscheidung.

## Visual Modality Contract — kein Remotion-Default

Es gilt `ki/gehirn/VISUAL_STRATEGY.md`.

Für jeden Beat primär eine Modality festlegen:

```text
REMOTION_NATIVE
REAL_CAPTURE
HYBRID
EXTERNAL_STILL_REQUIRED
EXTERNAL_MOTION_REQUIRED
```

### `REMOTION_NATIVE`

Für exakte, kontrollierbare Erklärung:

- UI
- Daten/Diagramme
- Prozesse
- Tokens/Nodes/Pfade
- Code/Terminal
- abstrakte technische Mechanismen

### `REAL_CAPTURE`

Wenn das **echte Produktverhalten selbst Beweis** ist.

Nicht durch erfundene UI ersetzen, wenn gerade aktuelle Oberfläche/Feature-Verhalten Teil der Aussage ist.

### `HYBRID`

Räumliches/physisches Hero-Motiv plus präzise Remotion-Schichten.

### `EXTERNAL_STILL_REQUIRED`

Wenn räumliche/organische Komplexität als Still deutlich stärker ist als Code.

### `EXTERNAL_MOTION_REQUIRED`

Nur wenn komplexe physische Bewegung selbst Bedeutungsträger ist und Code sichtbar schlechter/unverhältnismäßig wäre.

**Keine Modality ist pauschal Premium oder Default. Beste Erklärung gewinnt.**

## Reuse Contract

Erst Story → Beat → Modality → Mechanik. Danach Library prüfen.

`REUSE_EXACT` nur wenn wirklich passt:

- Mechanik
- räumliche Beziehung
- Zustandsänderung
- semantische Aussage
- notwendige Daten-/Textstruktur

„Ähnlich“, „haben wir schon“ oder „passt ungefähr“ reicht nicht.

Ohne exakten Fit: `NEW_BUILD` oder das in der Visual Strategy verlangte reale/externe Medium.

Phase 3 darf diese Entscheidung nicht aus Bequemlichkeit ersetzen.

## Anti-Karten-/Panel-Regel

Karten sind sinnvoll, wenn sie semantisch wirklich UI, Dokument, Nachricht, Datei, Datensatz oder Token darstellen.

Nicht als Standardcontainer für abstrakte Aussagen.

Richtwerte:

- karten-/panelbasierte Hauptbeats normalerweise höchstens etwa ein Drittel
- nicht mehr als zwei aufeinanderfolgende Beats mit derselben Hauptgrammatik
- mindestens ein bewusst geplanter Hero-/Memorable-Moment
- Wiederholung nur, wenn sie Teil desselben fortlaufenden Prozesses ist

## Phase-3 Timeline Contract

Das echte Voiceover ist die akustische Grundlage.

Bei zu schnellem/zu langsamem Abschnitt:

1. Animation, Hold, Szenenlänge und Beat-Timing anpassen
2. natürliche Pause an Phrase-/Satzgrenze leicht anpassen
3. nur wenn nötig komplette Phrase/Cue pitch-erhaltend lokal retimen
4. Caption-Cues/Wort-Timestamps auf final verwendetes Audio neu synchronisieren

Verbindlich:

- niemals Speedwechsel mitten im Wort
- keine abrupten Speed-Sprünge
- Pitch erhalten
- Wortlaut/Reihenfolge bleiben gleich
- bevorzugt ungefähr `0.97x–1.03x`
- bei echtem Bedarf bis ungefähr `0.94x–1.06x`
- darüber lieber neues Voiceover
- verwendete Retiming-Faktoren dokumentieren

Ziel: **Stimme, Visual Beat, Zustandswechsel und Caption treffen denselben Moment.**

## Sichtbares Textlayout

Verbindlich: `ki/gehirn/REELS.md`, `ki/gehirn/CAPTION_SAFE_POSITION.md`, `ki/src/reels/captionSafe.ts`.

Bei 1080 × 1920:

- eine kurze Zwischenüberschrift oben mittig
- semantisch passendes Icon
- Titel/Icon in dunklem Marken-Lila `#6E45C9`
- keine zusätzliche Header-Unterzeile
- Caption ohne weiße Box
- Sans-Serif und smartphone-lesbar
- aktiver Sprecherfokus in Marken-Lila
- Caption standardmäßig `bottom: 520px`
- horizontal ca. `104px` Sicherheitsabstand
- bevorzugte maximale Caption-Breite ca. `820px`
- normalerweise 4–6 Wörter pro sichtbarem Sinnblock
- maximal 2 Zeilen gleichzeitig
- finale Caption-Timestamps aus finalem Audio

## Caption-/Visual-Safe-Zone

Bei 1080 × 1920:

- Hauptvisuals möglichst bis etwa `y≈1240–1280` abschließen
- sichtbare Luft zwischen Hauptvisual und Caption
- technischer Guard ungefähr ab `y≈1440` nur als letzte Sicherung
- kein wichtiges Objekt/Label hinter oder unter Caption
- rechte Feed-Interaktionsleiste mitdenken

Wenn Platz fehlt: Visual höher/kompakter/neu bauen. **Caption nicht nach unten verschieben.**

Wird wichtiges Visual geclippt, ist das Layout fehlerhaft.

## Externe Medien und Asset-Manifest

Phase 1 darf Bedarf/Prompt/Shot-Brief definieren, aber keine fehlende Datei vortäuschen.

Manifest-Status soll den realen Zustand ausdrücken, z. B.:

- `NOT_REQUIRED`
- `MISSING_REQUIRED`
- `PROVIDED`
- `VERIFIED`

Fehlt in Phase 3 ein `MISSING_REQUIRED`-Pflichtasset: stoppen oder zurück zu Phase 2. Nicht generisch ersetzen.

Still-/Hybrid-Prompts folgen `ki/BILDSTIL.md`.

REAL_CAPTURE dokumentiert mindestens Produkt, Datum und Zweck.

## Post-Render-Qualität

Technische Prüfung: `ki/gehirn/POST_RENDER_REVIEW.md`.

Creative Prüfung: `ki/gehirn/CREATIVE_QA.md`.

Insbesondere:

- Einstieg innerhalb weniger Augenblicke lesbar und interessant
- Hauptmechanik groß genug für Smartphone
- keine mehrere Sekunden statische Grafik, während neue Sprecherbedeutung weiterläuft
- kein unnötiger Leerraum bei gleichzeitig kleiner Kernanimation
- letzte Szene entwickelt sich bis zur letzten inhaltlichen Phrase
- aktuelle Source muss zum geprüften Render gehören
- nach Source-/Caption-Änderung neuer Render + neuer Review

## Creative Review ist Pflicht

`06-projektdateien/creative-review.md` dokumentiert den finalen Zuschauer-Test.

Nicht freigeben bei:

- schwachem Hook
- Leerlauf
- repetitiver Karten-/Panelserie
- fehlendem sichtbaren Mechanismus
- keinem erinnerbaren visuellen Moment
- Kernidee nur durch Text statt Visual verständlich
- ungeerdeten Zahlen/Claims
- Smartphone-Unlesbarkeit

Technisch bestanden + kreativ langweilig = **nicht fertig**.

## Plattform-Copy

`03-caption/platform-copy.md` ist die reel-spezifische Quelle für Publishing-Copy.

Mindestens getrennte Bereiche für:

- neutralen Kerntitel
- YouTube Shorts
- Instagram
- TikTok
- Facebook Reels
- Snapchat, falls genutzt

Plattformtexte dürfen fachliche Aussage nicht verändern oder mehr versprechen als das Reel liefert.

## Autorität innerhalb eines V2-Reels

1. `PHASE-STATUS.md`
2. `production-contract-v2.json`
3. `creative-brief.md`
4. `source-ledger.md`
5. `voiceover.md` / `VOICEOVER-ZUM-KOPIEREN.txt`
6. `visual-strategy.md`
7. `reel.json`
8. `scene-plan.md`, falls vorhanden
9. `animation-plan.md`
10. `subtitle-cues.json`
11. `platform-copy.md`
12. `asset-manifest.json` / externe Asset-Briefs
13. `creative-review.md`

Widerspruch erkennen, nicht verstecken.

## Fertig bedeutet wirklich fertig

Ein Reel ist erst fertig, wenn:

- Phase-1-Verträge vollständig sind
- reales Voiceover vorhanden ist
- alle Pflichtmedien real vorhanden sind
- Tests/TypeScript bestanden sind
- Smoke-Frames angesehen wurden
- finales MP4 angesehen wurde
- Audio/Visual/Captions synchron sind
- relevante Fakten-Rechecks erledigt sind
- technische QA bestanden ist
- Creative Review = PASS

`veröffentlicht` ist ein nachgelagerter Publishing-Status und ersetzt keine technische oder kreative Freigabe.
