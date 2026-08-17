# 📱 KI-Kanal — Reel-Gehirn

## Ziel

Ein Reel erklärt **eine** KI-Idee mit einem klaren Spannungsbogen und einem sichtbaren Mechanismus. Kein Mini-Vortrag, keine Feature-Liste.

**Neue Standardlänge:** ungefähr **50–60 Sekunden**. Als Planungsrichtwert meist ungefähr **120–150 gesprochene Wörter**, abhängig von natürlichem Sprechtempo. Nicht künstlich strecken; das echte Voiceover bestimmt in Phase 3 die finale Dauer. Kürzer nur, wenn die Idee wirklich vorher vollständig erklärt ist.

## Spannungsbogen

```text
HOOK      Reibung, Frage oder überraschender wahrer Effekt
EINSATZ   warum betrifft das den Zuschauer?
MECHANIK  Ursache / Ablauf / Vergleich sichtbar machen
AHA       klare Einordnung oder Ergebnis
ENDE      kurzer Hold; CTA nur wenn natürlich
```

## Szenenregel

Jede Szene braucht genau einen dominanten Erklärgedanken:

```text
Startzustand
→ sichtbare Veränderung
→ Ergebniszustand
```

Wenn die Bewegung keinen Inhalt erklärt, entfernen.

## Animationsregel — Inhalt zuerst, Library danach

**Es ist verboten, zuerst eine vorhandene Animation auszuwählen und den Inhalt anschließend passend zu machen.**

Für jeden neuen Sprechertext gilt zuerst:

1. Sprechertext in bedeutungstragende **Visual Beats** zerlegen.
2. Für jeden Beat bestimmen, **was der Zuschauer genau sehen muss**, damit die Aussage verständlich wird.
3. Erst danach prüfen, ob eine bestehende Remotion-Animation diesen Mechanismus **exakt** abbildet.
4. Passt keine vorhandene Animation exakt, wird eine **individuelle reel-spezifische Remotion-Animation** gebaut.

Ein Visual Beat kann je nach Inhalt sein:

- ein einzelnes wichtiges Wort
- eine kurze Wortgruppe
- ein Halbsatz
- ein ganzer Satz
- mehrere Sätze, wenn sie sichtbar denselben Mechanismus fortsetzen

Die Granularität wird **nach Bedeutung**, nicht nach einer festen Sekunden- oder Szenenregel gewählt.

### Pflicht für jeden Visual Beat

`animation-plan.md` muss mindestens dokumentieren:

```text
Sprecherstelle
→ gemeinte Aussage
→ sichtbarer Startzustand
→ konkrete Bewegung / Veränderung
→ sichtbarer Endzustand
→ REUSE_EXACT oder NEW_BUILD
→ Timing relativ zum Sprecher
```

**REUSE_EXACT** ist nur erlaubt, wenn Mechanik, räumliche Beziehung, Zustandsänderung und Aussage wirklich passen. „Ähnlich“, „kann man dafür benutzen“ oder „haben wir schon“ reicht nicht.

**NEW_BUILD ist der Normalfall**, wenn eine individuelle Animation die Aussage besser erklärt.

Eine Szene darf deshalb mehrere aufeinanderfolgende Micro-Animationen enthalten. Wenn sich die Bedeutung mitten im Satz ändert, soll sich auch sichtbarer Fokus, Objektzustand oder Animation passend mitändern. Nicht jedes Wort braucht Bewegung; aber jedes bedeutungstragende Wort / jede bedeutungstragende Phrase braucht eine bewusste visuelle Entscheidung.

Keine dekorative Füllanimation. Keine Animation nur wegen Wiederverwendung. Keine semantisch falsche Library-Animation.

## Timeline-Regel — Stimme und Animation werden gemeinsam feinjustiert

Das finale Voiceover ist kein starres Hindernis, sondern der akustische Master für die reale Timeline.

Phase 3 muss für jeden Visual Beat prüfen:

```text
gesprochene Phrase
→ tatsächliche Start-/Endzeit
→ sichtbarer Beat-Start
→ Zustandswechsel
→ Hold / Übergang
→ Caption-/Wort-Timing
```

Wenn die Stimme an einer einzelnen Stelle zu schnell oder zu langsam für die geplante visuelle Erklärung ist, gilt diese Reihenfolge:

1. Animation, Hold, Szenenlänge und Übergänge anpassen.
2. Natürliche Pause vor/nach der Phrase leicht verkürzen oder verlängern.
3. Nur wenn nötig die **ganze Phrase / den ganzen Cue pitch-erhaltend leicht schneller oder langsamer machen**.
4. Danach Untertitel und aktive Wortmarkierung exakt auf die tatsächlich verwendete Audiospur synchronisieren.

Audio-Retiming:

- nicht innerhalb eines Wortes
- nicht mit abrupten Speed-Sprüngen
- bevorzugt ungefähr `0.97x–1.03x`
- bei echtem Bedarf ungefähr bis `0.94x–1.06x`
- Pitch erhalten
- niemals Wörter schneiden, ersetzen, umstellen oder hinzufügen
- stärkere Änderung als ungefähr ±6 % bedeutet: lieber Voiceover neu erzeugen als hörbare Audio-Verzerrung akzeptieren
- Gesamtdauer nicht künstlich auf exakt 60 Sekunden zwingen

**Perfekte Timeline bedeutet:** Sprecherbedeutung, Animation, Zustandswechsel, Untertitel und Pausen fühlen sich gleichzeitig richtig an. Natürlichkeit der Stimme hat Vorrang vor einer starren Sekundenmarke.

## Text-Hierarchie — keine Dopplung

### Zwischenüberschrift oben

- pro Szene genau eine kurze Zwischenüberschrift, normalerweise 3–7 Wörter
- **oben mittig** statt linksbündiger großer Headline
- direkt mit einem **semantisch passenden Icon** kombinieren
- Icon und Zwischenüberschrift bilden zusammen einen kompakten Kapitelmarker
- die komplette Zuschauer-Zwischenüberschrift ist **Lila**, bevorzugt dunkles Marken-Lila `#6E45C9`
- das Icon ist ebenfalls lila, visuell deutlich genug und etwas größer als ein normales UI-Icon
- Richtwert bei 1080 × 1920: Icon-Container ungefähr 68–76 px, Icon selbst ungefähr 38–44 px
- keine zweite Unterzeile direkt unter der Zwischenüberschrift
- keine lange Erklärung im Header
- niemals interner `goal`, Planner-, Debug- oder Regietext
- Zwischenüberschrift ordnet die Szene ein, sie kopiert nicht den gesprochenen Satz

### Untertitel — plattformsicherer Feed-Bereich

`CAPTION_SAFE_POSITION.md` ist für die genaue Position verbindlich.

- Untertitel decken den gesprochenen Text vollständig ab
- **kein weißer Kasten, keine Caption-Card, kein flächiger Hintergrund**
- Text steht frei auf dem Bild und erhält nur so viel Schatten/Outline, wie für Lesbarkeit nötig ist
- bei 1080 × 1920 gilt als Standard **`bottom: 460px`**
- der sichtbare Caption-Block liegt dadurch typischerweise ungefähr im Bereich **y≈1340–1470**, abhängig von Schriftgröße und Zeilenanzahl
- die letzten ungefähr **360 px** am unteren Rand sind für Untertitel und andere kritische Informationen tabu
- ungefähr **360–440 px Abstand vom unteren Rand** gelten nur als Puffer, nicht als bevorzugte Caption-Position
- Untertitel normalerweise als **4–6 Wörter pro sichtbarem Sinnblock**, maximal **2 Zeilen gleichzeitig**
- links/rechts mindestens ungefähr 70 px Sicherheitsabstand
- Untertitel sind klarer Sans-Serif-Text, keine dekorative Serifenschrift
- aktives Wort bzw. aktive Wortgruppe wird synchron zum Sprecher in Marken-Lila hervorgehoben
- bereits gesprochene Wörter bleiben normal dunkel; nur der aktuelle Sprechfokus wird lila
- mit echtem Audio in Phase 3 echte Cue-/Wort-Timestamps an das Voiceover anpassen; nur proportional geschätzte Wortzeiten sind niemals die finale Freigabe
- die Caption darf **nicht nach unten verschoben werden**, um Platz für ein zu tiefes Visual zu schaffen

Die genaue Plattform-UI kann sich je nach App, Gerät, Caption-Länge und Oberfläche verändern. Deshalb ist `bottom: 460px` ein konservativer kanalinterner Cross-Platform-Standard und kein behaupteter universeller Plattformwert.

### Animationstext

- 0–3 kurze Labels gleichzeitig als Standard
- benennt Objekt, Zustand oder Kategorie
- keine Satzkopie des Voiceovers
- keine langen Erklärsätze

### Verbotene Dopplung

Nicht gleichzeitig denselben Gedanken als Zwischenüberschrift + zusätzliche Unterzeile + Animationssatz + Untertitel zeigen.

```text
Sprecher = Aussage
Untertitel = sprachliche Lesbarkeit + Sprechersynchronität
Animation = visuelle Erklärung
Zwischenüberschrift + Icon = Kapitel/Kerngedanke
```

## Caption-/Visual-Trennung

Für Production-Reels gilt eine **harte Trennung** zwischen erklärendem Visual und Caption-/Feed-Bereich.

Bei 1080 × 1920:

- die Caption sitzt standardmäßig mit `bottom: 460px`
- neue bedeutungstragende Hauptvisuals sollen nach Möglichkeit bis ungefähr **y≈1280–1320** abgeschlossen sein
- zwischen Hauptvisual und Caption ungefähr **80–120 px** sichtbare Luft anstreben
- der bestehende technische Clip-Guard um ungefähr `y=1440` bleibt eine letzte Sicherung, ist aber **nicht** die eigentliche Caption-Positionsregel
- kein wichtiges Animationsobjekt, keine Karte, kein Node, keine Linie, kein Partikel und kein Animationslabel darf mit dem sichtbaren Caption-Block konkurrieren
- wenn eine Animation zu tief reicht: Animation höher setzen, neu komponieren oder kompakter bauen
- **Untertitel niemals nach unten verschieben, nur um Platz für eine Animation zu schaffen**
- wenn der Clip-Guard wichtigen Inhalt abschneidet, ist das Reel **nicht freigabefähig** und muss neu layoutet werden

Die reale Kollision im Render entscheidet. Ein Element kann technisch oberhalb einer alten Clip-Grenze liegen und trotzdem visuell zu nah an der höher positionierten Caption sein.

## Safe Zones — 1080 × 1920

Als dauerhafte Produktionsrichtlinie:

- keine kritische Schrift direkt am oberen Rand
- Zwischenüberschrift + Icon kompakt im oberen sicheren Bereich platzieren
- seitlich mindestens ca. 70 px Luft für kritischen Text
- die letzten ungefähr **360 px** unten nicht für Untertitel oder andere kritische Informationen verwenden
- Bereich **360–440 px vom unteren Rand** nur als Sicherheits-Puffer behandeln
- Caption standardmäßig bei **`bottom: 460px`**
- Hauptvisuals für neue Reels möglichst bis ungefähr **y≈1280–1320** abschließen
- zwischen Hauptanimation und Untertitel möglichst ungefähr 80–120 px sichtbare Luft lassen
- wenn ein Mechanismus in den Caption-Bereich ragt: Animation höher/kompakter/new-build; Untertitel bleiben an ihrer sicheren Position
- dekorative Fortschrittsleisten oder andere UI direkt am unteren Rand sind im Production-Reel zu vermeiden

Vor finaler Freigabe den tatsächlichen Plattform-/Feed-Eindruck auf Smartphone-Größe prüfen. Ein Source-Change der Caption-Position macht eine frühere Render-Freigabe ungültig.

## Visualisierung

Entscheidungsreihenfolge:

1. **individuellen visuellen Mechanismus aus dem Sprecherinhalt entwerfen**
2. prüfen, ob vorhandene Low-Level-Primitives dafür helfen
3. vorhandene production-ready Library-Animation nur bei **exaktem semantischem Fit** wiederverwenden
4. sonst reel-spezifischer Remotion-New-Build
5. Bild/Hybrid nur, wenn räumliche/illustrative Komplexität echten Mehrwert bringt

Die Animation Library ist Werkzeugkasten, **nicht Ideengeber für den Inhalt**.

## Bewegungsqualität

- eine dominante Bewegung pro Visual Beat
- maximal drei starke gleichzeitige Bewegungen
- öffnender Zustand muss sofort lesbar sein
- Endzustand braucht Hold
- Hard Cut ist Standard
- Übergang nur bei echter Objekt-/Form-/Zustandskontinuität
- Zoom nur bei tatsächlichem Fokuswechsel
- keine dekorativen Partikel-/Glow-Schichten als Ersatz für Inhalt
- Sprecherbedeutung und sichtbare Zustandsänderung müssen zeitlich zusammenpassen

## Bilder

Bildbedarf in Phase 1 ausdrücklich entscheiden.

Wenn Bild:

- `ki/BILDSTIL.md` anwenden
- Prompt unter `02-bilder/image-prompts.md`
- Asset in `asset-manifest.json`
- Bild-KI baut 3D-/räumliche Szene
- Remotion baut Zwischenüberschrift + Icon, Untertitel, Zahlen, Pfeile, Diagramme und präzise Labels

Wenn kein Bild: `BILDER NICHT ERFORDERLICH` dokumentieren. Keine Füllbilder.

## Brand

- 1080 × 1920 / 30 FPS als Standard
- weiß/hell
- dunkler Fließ-/Animations-Text
- Marken-Lila `#B98CFF`
- dunkles Lila `#6E45C9` für Zwischenüberschrift und aktiven Fokus
- faceless
- Smartphone zuerst

## Fakten und Grounding

- sichtbare Zahlen nur, wenn Sprechertext/Quelle sie trägt
- Gewinner/Ranking/Prozent nur bei echter Grounding-Grundlage
- illustrative interne Motion-Werte dürfen nicht als Fakten sichtbar werden
- Sprechertext → Meaning Contract → **Visual Beats** → individuelle Mechanik → Render-Props

## Qualitätsgate

Vor Freigabe tatsächlich prüfen:

- Skript liegt standardmäßig im längeren 50–60-Sekunden-Korridor, sofern Inhalt das trägt
- jeder bedeutungstragende Sprecherabschnitt hat einen dokumentierten Visual Beat
- keine Animation wurde nur gewählt, weil sie bereits existierte
- REUSE nur bei exaktem semantischem Fit; sonst NEW_BUILD
- Voiceover, Visual Beats, Szenenwechsel und Captions sind auf derselben realen Timeline synchron
- lokale Voiceover-Speedkorrekturen sind unhörbar/natürlich, pitch-erhaltend und innerhalb des Qualitätskorridors
- Zwischenüberschrift oben mittig, vollständig lila und mit deutlich lesbarem passendem Icon
- keine zusätzliche Header-Unterzeile
- Untertitel ohne Hintergrundkarte
- Caption bei 1080×1920 standardmäßig `bottom: 460px`
- maximal 2 Zeilen und kompakte 4–6-Wort-Sinnblöcke, sofern der reel-spezifische Text nichts Begründetes anderes verlangt
- Untertitel nicht von Plattform-UI gefährdet
- aktive lila Hervorhebung folgt dem echten Sprecher
- Hauptanimation und wichtige Animationslabels konkurrieren nicht mit dem Caption-Block
- technische Clip-Grenze schneidet keinen wichtigen Inhalt ab
- keine abgeschnittene Schrift
- keine Zwischenüberschriften-/Caption-/Visual-Überlappung
- keine internen Regietexte sichtbar
- keine unnötige Textdopplung
- keine leere erste Sekunde
- klarer End-Hold
- mobile Lesbarkeit
- Motion passt semantisch exakt
- Bilder frei von Wasserzeichen, Prompttext, zufälliger Schrift und Gesichtern
- finale MP4 normal abspielen und ansehen
- nach jeder Caption-Positionsänderung neu rendern und erneut auf Smartphone-/Feed-Größe prüfen
