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

Bevorzugt **40–55 Sekunden**, wenn das Thema es trägt. 60 Sekunden sind kein Ziel.

- kein Zusatzsatz nur für Wortzahl
- kein langer Hold nur für Laufzeit
- kein künstlich hektisches Sprechen
- wenn das Versprechen nach 35–45 Sekunden erfüllt ist, darf das Reel enden
- wenn 60 Sekunden nicht reichen, Thema enger schneiden
- Zielbereich für viele Scripts: ungefähr 105–135 gesprochene Wörter

Das echte Voiceover bestimmt Phase 3. Geschätzte Cue-Zeiten sind nur Planung.

## Spannungsbogen

```text
HOOK      konkrete Situation / sichtbarer Konflikt / überraschendes Ergebnis
EINSATZ   warum betrifft das den Zuschauer?
MECHANIK  Ursache / Ablauf / Vergleich sichtbar machen
AHA       klare Einordnung, Grenze oder Ergebnis
ENDE      konkrete Regel/Entscheidung; CTA nur wenn natürlich
```

Der Hook beginnt ohne Begrüßung, Kanalname oder „Heute zeige ich …“.

**Technische Begriffe gehören nicht in die ersten Sekunden, wenn ein konkretes Beispiel denselben Gedanken verständlicher macht.** Erst Situation zeigen, dann Begriff benennen.

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

Eine Szene trägt einen dominanten Erklärgedanken, aber normalerweise **2–4 sichtbare Micro-Beats**.

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
- fokussiert
- zoomt in einen relevanten Bereich
- setzt sich zusammen

Schwaches Hauptverb: nur „erscheint“.

### Motion-Dichte V2.2

Für normale Erklär-Reels gilt:

- ungefähr alle **1,5–3 Sekunden** eine bedeutungstragende sichtbare Zustandsänderung
- kein fertiger statischer Zustand länger als etwa **2,5 Sekunden**, außer ein bewusster Hold ist für Verständnis nötig
- mindestens zwei echte Zustandswechsel pro längerer Szene
- wichtige Sprecherwörter dürfen konkrete Motion-Cues auslösen
- nicht jedes Wort animieren; nur Bedeutungsänderungen
- Bewegung muss Ursache/Wirkung, Fokus oder Fortschritt zeigen

## Remotion darf Bilder bauen

`REMOTION_NATIVE` bedeutet nicht nur Boxen, Text und Diagramme.

Wenn es zum Thema passt, soll Remotion selbst **bildartige Szenen** erzeugen:

- SVG-/CSS-Illustrationen
- Objekte und kleine Umgebungen
- pseudo-fotografische Flat-/2.5D-Szenen
- Geräte, Räume, Schreibtische, Dokumente, Personen-Silhouetten
- eigene semantische Icons
- Masken, Clipping, Layer, Schatten, Perspektive, Parallax
- Objektzerlegung und Objekt-Morphs

Ein externes Bild ist nicht nötig, wenn eine klar lesbare Remotion-Illustration den Gedanken besser kontrollierbar erklärt.

**Icons:** bevorzugt eigene SVG-Pfade oder kontrollierte Vector-Komponenten. Keine Emoji als finale Haupticons, wenn ein sauberer Vektor möglich ist.

## Visual Strategy kommt vor Technik

Für jeden Beat zuerst in `06-projektdateien/visual-strategy.md` die primäre Modality wählen:

- `REMOTION_NATIVE`
- `REAL_CAPTURE`
- `HYBRID`
- `EXTERNAL_STILL_REQUIRED`
- `EXTERNAL_MOTION_REQUIRED`

Erst danach Mechanik und Source bestimmen.

**Verboten:** vorhandene Animation wählen und Inhalt passend machen.

## REUSE_EXACT

Wiederverwendung ist nur erlaubt, wenn Mechanik, räumliche Beziehung, Zustandsänderung, semantische Aussage und Text-/Datenstruktur wirklich passen.

Library = Werkzeugkasten, nicht Ideengeber.

## Anti-Karten-Grammatik

Karten/Panels sind sinnvoll, wenn sie wirklich UI, Dokument, Datei, Nachricht, Datensatz oder Token darstellen.

Nicht als Standard für abstrakte Aussagen.

Richtwerte V2.2:

- normalerweise höchstens **ein Viertel** der Hauptbeats primär Karten/Panel
- nicht mehr als zwei aufeinanderfolgende Beats mit derselben Hauptgrammatik
- mindestens ein bewusst geplanter Hero-/Memorable-Moment
- mindestens die Hälfte der Beats sollte objekt-, pfad-, form-, raum-, illustration- oder prozessbasiert funktionieren
- eine Szene aus nur Header + Karte + Caption ist kein fertiger Visual Beat

## Bewegungsqualität

- eine dominante Bewegung pro Micro-Beat
- maximal drei starke gleichzeitige Bewegungen
- Startzustand sofort lesbar
- sichtbare Ursache/Wirkung statt Dekoration
- Endzustand braucht kurzen Hold
- Hard Cut ist Standard
- Transition nur bei echter Objekt-/Form-/Zustandskontinuität
- Zoom nur bei echtem Fokuswechsel
- keine Partikel/Glow als Ersatz für Erklärung
- kein permanentes Hintergrundwackeln

## Text-Hierarchie V2.2

### Zwischenüberschrift + Icon

- pro Szene eine kurze Zwischenüberschrift, normalerweise 3–7 Wörter
- oben mittig
- semantisch passendes Icon
- Titel/Icon in dunklem Marken-Lila `#6E45C9`
- Header animiert kurz zum Szenenstart und bleibt danach ruhig
- keine zweite erklärende Unterzeile

### Caption

`CAPTION_SAFE_POSITION.md` ist verbindlich.

Bei 1080 × 1920 als Standard:

- `bottom: 300px`
- horizontal ca. `104px` Sicherheitsabstand
- bevorzugte maximale Breite ca. `820px`
- normalerweise 4–6 Wörter pro Sinnblock
- maximal 2 Zeilen gleichzeitig
- kein weißer Caption-Kasten
- aktiver Sprechfokus in Marken-Lila
- finale Wort-/Cue-Timestamps nur aus echtem Audio

### Animationstext

Standardmäßig nur, wenn er **semantisch nötig** ist:

- kurze Objekt-/UI-Labels
- Zahlen/Daten, die wirklich erklärt werden
- Zustände, die ohne Label nicht eindeutig lesbar wären

Nicht als Standard verwenden:

- graue Hilfssätze
- Meta-Texte wie „vereinfachte Darstellung“
- Text, der nur erklärt, was die Animation bereits sichtbar macht
- Satzkopien aus dem Sprechertext
- keine internen Planner-/Goal-/Debug-Texte

```text
Sprecher = Aussage
Caption = sprachliche Lesbarkeit
Visual = Erklärung
Header = Kapitelmarker
```

Wenn das Visual ohne zusätzlichen Satz verständlich ist, wird der Satz **weggelassen**.

## Caption-/Visual-Trennung

Für 1080 × 1920:

- Hauptvisuals dürfen ungefähr bis `y≈1380–1420` reichen, solange die Caption frei bleibt
- sichtbare Luft zur Caption anstreben
- kein wichtiges Visual/Label hinter der Caption
- rechts Feed-Interaktionsleiste mitdenken

## REAL_CAPTURE

Reale UI/Capture einsetzen, wenn das tatsächliche Produktverhalten selbst Teil des Beweises ist.

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

Bei Schlüsselwörtern sollen Motion-Cues nach Möglichkeit auf dem realen Wortstart liegen.

## Fakten und Grounding

`FAKTENQUELLEN.md` und `06-projektdateien/source-ledger.md` sind für V2 verbindlich.

Besonders prüfen: sichtbare Zahlen, aktuelle Modell-/Feature-Namen, Benchmarks, reale Quellen/Paper und absolute Aussagen.

Illustrative Motion-Werte dürfen nie wie echte Messergebnisse aussehen.

## Hero-/Memorable-Moment

Jedes Reel plant mindestens einen visuellen Höhepunkt, sofern die Idee ein Reel rechtfertigt.

Nicht ausreichend: Text wird größer, Glow wird stärker oder Kamera zoomt ohne neue Aussage.

Gut ist ein Moment, an dem die Kernidee sichtbar **passiert**.

## Creative QA

Nach dem finalen Render zusätzlich zu technischen Checks `CREATIVE_QA.md` durchführen.

Stop bei:

- schwachem Hook
- abstraktem Thema ohne konkreten Zuschaueranker
- Leerlauf / lange statische Holds
- repetitiver Karten-/Panelserie
- fehlendem sichtbaren Mechanismus
- keinem erinnerbaren visuellen Moment
- unnötiger Textdopplung oder grauen Hilfstexten
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
- Audio/Visual/Captions synchron
- wichtige Motion-Cues an echten Sprecherstellen ausgerichtet
- keine Caption-Kollision
- keine unnötige vierte Textebene
- Smoke-Frames angesehen
- finales MP4 normal und auf Smartphone-Größe angesehen
- technische Checks bestanden
- Creative Review = PASS

Technisch bestanden + kreativ langweilig = **nicht fertig**.
