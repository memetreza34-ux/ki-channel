# 📱 KI-Kanal — Reel-Gehirn

## Ziel

Ein Reel erklärt **eine** KI-Idee mit einem klaren Spannungsbogen, einem sichtbaren Mechanismus und einem konkreten Aha.

Kein Mini-Vortrag. Keine Feature-Liste. Keine animierte PowerPoint.

Die Reihenfolge ist verbindlich:

```text
Story / Hook
→ Fakten
→ Sprechertext
→ Visual Beats
→ Visual Strategy
→ Mechanik
→ Source
→ echtes Audio
→ Render
→ Creative QA
```

Details:

- `STORY_RETENTION.md`
- `FAKTENQUELLEN.md`
- `VISUAL_STRATEGY.md`
- `CREATIVE_QA.md`

## Länge

50–60 Sekunden sind erlaubt, wenn das Thema diese Tiefe trägt. Sie sind **kein Streckziel**.

- kein Zusatzsatz nur für Wortzahl
- kein langsamer Hold nur für Laufzeit
- kein künstlich hektisches Sprechen, um zu viel Inhalt unterzubringen
- wenn das Versprechen nach 35–45 Sekunden erfüllt ist, darf das Reel enden
- wenn 60 Sekunden nicht reichen, Thema enger schneiden

Das echte Voiceover bestimmt Phase 3. Geschätzte Cue-Zeiten sind nur Planung.

## Spannungsbogen

```text
HOOK      Ergebnis, Konflikt, Beweis oder echte Frage
EINSATZ   warum betrifft das den Zuschauer?
MECHANIK  Ursache / Ablauf / Vergleich sichtbar machen
AHA       klare Einordnung, Grenze oder Ergebnis
ENDE      konkrete Regel/Entscheidung; CTA nur wenn natürlich
```

Der Hook beginnt ohne Begrüßung, Kanalname oder „Heute zeige ich …“.

## Vor dem Script: Creative Brief

V2-Reels führen `06-projektdateien/creative-brief.md`.

Pflicht:

- Viewer promise
- Hook tension
- 3-second proof
- Why care
- Core mechanism
- Payoff
- Memorable moment
- Truth risk

Wenn Hook, Mechanismus oder Memorable Moment nicht konkret sind: **noch kein Remotion-Code**.

## Szenen- und Visual-Beat-Regel

Eine Szene trägt einen dominanten Erklärgedanken, kann aber mehrere Micro-Beats enthalten.

Jeder bedeutungstragende Beat braucht:

```text
Sprecherstelle
→ Bedeutung
→ Zuschauer muss sehen
→ Hauptverb
→ Startzustand
→ sichtbare Veränderung
→ Endzustand
```

Gute Hauptverben:

- wählt
- zerfällt
- verbindet
- prüft
- blockiert
- sortiert
- vergleicht
- öffnet
- sucht
- verwirft
- verwandelt
- reist

Schwaches Hauptverb: nur „erscheint“.

Nicht jedes Wort muss animiert werden. Aber Bedeutungsänderungen brauchen eine bewusste sichtbare Reaktion.

## Visual Strategy kommt vor Technik

Für jeden Beat zuerst in `06-projektdateien/visual-strategy.md` die primäre Modality wählen:

- `REMOTION_NATIVE`
- `REAL_CAPTURE`
- `HYBRID`
- `EXTERNAL_STILL_REQUIRED`
- `EXTERNAL_MOTION_REQUIRED`

Erst danach:

1. Mechanik entwerfen
2. Art Direction / Shot Composition
3. prüfen, ob vorhandene Library exakt passt
4. bei exaktem Fit `REUSE_EXACT`
5. sonst `NEW_BUILD` oder erforderliches reales/external Asset

**Verboten:** vorhandene Animation wählen und Inhalt passend machen.

## REUSE_EXACT

Wiederverwendung ist nur erlaubt, wenn alle Punkte passen:

- Mechanik
- räumliche Beziehung
- Zustandsänderung
- semantische Aussage
- notwendige Text-/Datenstruktur

„Ähnlich“ reicht nicht.

Library = Werkzeugkasten, nicht Ideengeber.

## Anti-Karten-Grammatik

Karten/Panels sind sinnvoll, wenn sie wirklich etwas darstellen:

- UI
- Dokument
- Datei
- Nachricht
- Datensatz
- Token/Chip

Nicht als Standard für abstrakte Aussagen.

Richtwerte:

- normalerweise höchstens etwa ein Drittel der Hauptbeats primär Karten/Panel
- nicht mehr als zwei aufeinanderfolgende Beats mit derselben Hauptgrammatik
- mindestens ein bewusst geplanter Hero-/Memorable-Moment
- Diversity nicht künstlich erzwingen, wenn ein fortlaufender Prozess bewusst konsistent bleiben muss

## Bewegungsqualität

- eine dominante Bewegung pro Beat
- maximal drei starke gleichzeitige Bewegungen
- Startzustand sofort lesbar
- sichtbare Ursache/Wirkung statt Dekoration
- Endzustand braucht Hold
- Hard Cut ist Standard
- Transition nur bei echter Objekt-/Form-/Zustandskontinuität
- Zoom nur bei echtem Fokuswechsel
- keine Partikel/Glow als Ersatz für Erklärung
- kein permanentes Hintergrundwackeln

Motion beantwortet **was sich ändert und warum**, nicht nur „wie kann etwas hübsch reinfliegen?“.

## Text-Hierarchie

### Zwischenüberschrift + Icon

- pro Szene eine kurze Zwischenüberschrift, normalerweise 3–7 Wörter
- oben mittig
- semantisch passendes Icon
- Titel/Icon in dunklem Marken-Lila `#6E45C9`
- keine zweite erklärende Unterzeile
- Header ordnet ein, er wiederholt nicht den kompletten Sprechertext

### Caption

`CAPTION_SAFE_POSITION.md` ist verbindlich.

Bei 1080 × 1920 als Standard:

- `bottom: 520px`
- horizontal ca. `104px` Sicherheitsabstand
- bevorzugte maximale Breite ca. `820px`
- normalerweise 4–6 Wörter pro Sinnblock
- maximal 2 Zeilen gleichzeitig
- kein weißer Caption-Kasten
- aktiver Sprechfokus in Marken-Lila
- finale Wort-/Cue-Timestamps nur aus echtem Audio

### Animationstext

- wenige Objekt-/Zustandslabels
- keine Satzkopie
- keine internen Planner-/Goal-/Debug-Texte

```text
Sprecher = Aussage
Caption = sprachliche Lesbarkeit
Visual = Erklärung
Header = Kapitelmarker
```

## Caption-/Visual-Trennung

Für 1080 × 1920:

- Hauptvisuals nach Möglichkeit bis etwa `y≈1240–1280` abschließen
- sichtbare Luft zur Caption anstreben
- ungefähr ab `y=1440` harter technischer Guard
- kein wichtiges Visual/Label hinter oder unter der Caption
- rechts Feed-Interaktionsleiste mitdenken
- wenn Visual zu tief reicht: Visual neu komponieren, nicht Caption verschieben

Ein abgeschnittenes Hauptobjekt ist kein bestandener Guard, sondern Layoutfehler.

## REAL_CAPTURE

Reale UI/Capture einsetzen, wenn das tatsächliche Produktverhalten selbst Teil des Beweises ist.

Pflicht:

- Produkt/Datum dokumentieren
- sensible Daten entfernen
- nur relevante Fläche zeigen
- aktuelle UI/Feature-Aussagen im Source Ledger prüfen
- nicht mit erfundener UI ersetzen, wenn gerade die echte Oberfläche wichtig ist

## Externe Still-/Hybrid-/Motion-Assets

Nur verwenden, wenn `VISUAL_STRATEGY.md` sie begründet.

- Still/Hybrid folgt `ki/BILDSTIL.md`
- exaktes Asset im Manifest
- fehlendes Pflichtasset als `MISSING_REQUIRED`
- Remotion ergänzt präzise Texte, Pfeile, UI, Zahlen, Fokus und Captions
- kein Füllasset nur für Abwechslung

Fehlt ein Pflichtasset in Phase 3: nicht stillschweigend eine generische Karte bauen.

## Timeline-Regel

Echtes Voiceover ist der akustische Master.

Für jeden Beat:

```text
gesprochene Phrase
→ tatsächliche Start-/Endzeit
→ sichtbarer Beat-Start
→ Zustandswechsel
→ Hold/Übergang
→ Caption-/Wort-Timing
```

Reihenfolge bei Timingproblemen:

1. Animation/Hold/Szenenlänge anpassen
2. natürliche Pause leicht anpassen
3. nur wenn nötig ganze Phrase pitch-erhaltend retimen
4. Captions danach exakt neu synchronisieren

Retiming:

- nicht mitten im Wort
- keine abrupten Sprünge
- bevorzugt `0.97x–1.03x`
- bei echtem Bedarf bis ungefähr `0.94x–1.06x`
- stärkere Änderung → neues Voiceover
- nicht künstlich auf exakt 60 Sekunden zwingen

## Fakten und Grounding

`FAKTENQUELLEN.md` und `06-projektdateien/source-ledger.md` sind für V2 verbindlich.

Besonders prüfen:

- sichtbare Zahlen/Prozentwerte
- Preise/Limits
- aktuelle Modell-/Feature-Namen
- Benchmarks/Rankings
- reale Quellen/Paper
- Produktverhalten
- Aussagen, die durch „immer“, „nie“, „alle“ zu absolut werden

Illustrative Motion-Werte dürfen nie wie echte Messergebnisse aussehen.

## Hero-/Memorable-Moment

Jedes Reel plant mindestens einen visuellen Höhepunkt, sofern die Idee ein Reel rechtfertigt.

Nicht ausreichend:

- Text wird größer
- Glow wird stärker
- Kamera zoomt ohne neue Aussage

Gut ist ein Moment, an dem die Kernidee sichtbar **passiert**.

## Creative QA

Nach dem finalen Render zusätzlich zu technischen Checks `CREATIVE_QA.md` durchführen und in `06-projektdateien/creative-review.md` dokumentieren.

Stop bei:

- schwachem Hook
- Leerlauf
- repetitiver Karten-/Panelserie
- fehlendem sichtbaren Mechanismus
- keinem erinnerbaren visuellen Moment
- unnötiger Textdopplung
- Smartphone-Unlesbarkeit
- ungeerdeten Zahlen/Claims

## Qualitätsgate Phase 1

Vor Voiceover muss vorhanden sein:

- Creative Brief bestanden
- Source Ledger fachlich sauber
- finaler Sprechertext
- vollständige Visual Beats
- Visual Strategy pro Beat
- Hero-Moment bestimmt
- Animation-/Shot-Plan
- externe Medienentscheidung + Manifest
- Captions/Plattform-Copy Basis
- `reel.json`
- ausführbarer Source

## Qualitätsgate Phase 3

Vor Freigabe:

- echtes Audio analysiert
- Pflichtassets real vorhanden
- Audio/Visual/Captions synchron
- keine Caption-Kollision
- Smoke-Frames angesehen
- finales MP4 angesehen
- Source Ledger Rechecks erledigt
- technische Checks bestanden
- Creative Review = PASS

Technisch bestanden + kreativ langweilig = **nicht fertig**.
