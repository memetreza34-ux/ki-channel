# 🎬 Bewegungssprache

Verbindliche Motion-Regeln für den Kanal. Abgeleitet aus `KANAL.md`, `VISUAL_STRATEGY.md` und der Methode aus `.claude/skills/motion-art-direction`.

## Grundregel

> Die **Bewegungssprache** soll wiedererkennbar sein. Die **visuelle Idee** darf und soll je nach Inhalt unterschiedlich sein.

**Runtime-Wahrheit:** `ki/src/motion/easing.ts` und `ki/src/motion/choreography.ts`. Werte aus Skills, Core-Helfern oder externen Referenzen sind Beratung/Quelle, aber dürfen die KI-Runtime nicht stillschweigend überschreiben.

Wiederverwenden:

- Easing-Charakter
- Timing-Disziplin
- Fokus-Hierarchie
- Ruhe/Schärfe
- Markenwirkung

Nicht aus Bequemlichkeit wiederverwenden:

- dieselbe Card-Grammatik
- dieselbe Szene
- dieselbe Kamerafahrt
- dieselbe Entry-Mechanik
- dieselbe visuelle Metapher

Erst Bedeutung/Modality/Mechanik bestimmen, dann Bewegung.

## Einordnung

`KANAL.md` sagt: modern, klar, kompetent, ohne Hype-Lärm oder Fake-Wunder. Gleichzeitig ist Short-Form kein Geschäftsbericht: Bewegungen dürfen **entschieden und aufmerksamkeitsstark** sein, wenn sie Bedeutung tragen.

Die passende Persönlichkeit ist deshalb:

> **Editorial Tech — ruhige Basis, scharfe bedeutungsgetriebene Ereignisse.**

Nicht verspielt. Nicht hyperaktiv. Aber auch nicht steril oder behäbig.

## Spezifikation

| Eigenschaft | Festlegung |
|---|---|
| Signaturkurve | `cubic-bezier(0.2, 0, 0, 1)` — `MOTION_EASING.enter` |
| Grundtakt | ungefähr 10–12 Frames bei 30 fps |
| Dauernskala | Mikro ca. 5–8 · Standard ca. 10–16 · Hero ca. 16–24 Frames |
| Übergangsfamilie | Harter Schnitt als Standard. Übergang nur bei echter semantischer Kontinuität |
| Staffelrhythmus | `staggerDelay()`, nicht alles gleichzeitig |
| Bewegungsintensität | Distanz/Skalierung nach Objektgewicht und Aussage; keine unnötig riesigen Wege |
| Überschwinger | normalerweise 0 % bei Erklärinhalten; Ausnahme nur mit klarer semantischer Begründung |
| End-Hold | so lang wie zum Lesen/Verstehen nötig; **kein pauschaler Stillstand nach jedem Micro-Beat** |

Die Werte sind Produktionsrichtlinien, keine Einladung, jedes Objekt identisch zu timen.

## Erlaubte Kurven

Wenige Kurven halten die Marke zusammen.

| Kurve | Wofür | Regel |
|---|---|---|
| `enter` | Eintritt, Aufzeichnen, Einschwingen | Standard für klare Eintritte |
| `exit` | Austritt, Abtreten, Verblassen | sparsam; nicht alles muss sichtbar „rausanimieren“ |
| `move` | Versetzen eines sichtbar bleibenden Elements | für echte räumliche Zustandsänderung |
| `loop` | ausschließlich echte Schleifen/fortlaufende Prozesse | nicht als Dauerbewegung für Deko |
| `anticipate` | nur bei inhaltlich sinnvoller Vorbereitung/Gegenbewegung | nicht als allgemeiner Stiltrick |
| `pop` | normalerweise gesperrt | spielzeugartiger Overshoot passt selten; nur explizit begründete Ausnahme |

## Bewegungshierarchie

Pro Beat gibt es einen **dominanten Fokus**. Das bedeutet nicht, dass exakt nur ein Element bewegt werden darf.

| Ebene | Was | Wie |
|---|---|---|
| Held | bedeutungstragender Zustandswechsel | klarster Fokus, größte semantische Bewegung |
| Stütze | Kontext/Reaktion | unterstützt zeitlich/räumlich den Held, konkurriert nicht |
| Textur | Hintergrund/Atmosphäre | optional, kontrastarm, nie Ersatz für Inhalt |

Wenn mehrere Elemente gleichzeitig nötig sind, müssen sie dieselbe Aussage unterstützen statt um Aufmerksamkeit zu konkurrieren.

## Tempo und Retention

Motion darf keinen künstlichen Leerlauf erzeugen.

- Wenn Sprecherbedeutung weitergeht, darf das Bild nicht nur wegen einer Stilregel stillstehen.
- Ein fortlaufender Prozess darf ohne Zwischen-Hold weiterlaufen.
- Ein End-Hold ist sinnvoll, wenn das Ergebnis gelesen/verstanden werden muss.
- Micro-Beats dürfen schneller aufeinander folgen, wenn sie semantisch zusammengehören.
- Große Zustandswechsel brauchen mehr Zeit als kleine Fokuswechsel.
- Nicht jede Szene benötigt einen sichtbaren Ein- **und** Austritt; Hard Cut spart oft Zeit und wirkt klarer.

`STORY_RETENTION.md` bestimmt den Bedeutungsrhythmus; Motion folgt ihm.

## Zurückhaltung

- Nicht das ganze Bild gleichzeitig ohne Hierarchie bewegen.
- Nicht Wischer **und** Drehung **und** Blende stapeln, wenn ein Mechanismus reicht.
- Keine Schleifenbewegung an Text, den der Zuschauer gerade lesen muss.
- Kein dekoratives Wackeln, Schweben oder Pulsieren nur gegen Leerlauf.
- Kein Zoom, nur weil einige Sekunden vergangen sind.
- Keine Effektvariation als Selbstzweck.

## Memorable Moment statt Dauerfeuer

Jedes starke Reel soll mindestens einen bewusst geplanten visuellen Höhepunkt besitzen.

Das bedeutet **nicht**, dass alle anderen Beats langweilig sein müssen.

Erlaubt:

- kleinere Pattern Interrupts
- neue Mechanikfamilie bei neuer Bedeutung
- kurze starke Fokuswechsel
- dynamische Prozessentwicklung

Der Hero-Moment bleibt der klarste visuelle Höhepunkt, aber nicht die einzige interessante Bewegung im Reel.

## Übergänge

Hard Cut ist Standard.

Andere Übergänge nur mit Bedeutung:

- Push/Travel → räumliche Fortsetzung
- Morph → dasselbe Objekt ändert Form/Zustand
- Dissolve → bewusster weicher Zeit-/Zustandswechsel
- Mask/Reveal → etwas wird tatsächlich aufgedeckt
- Zoom → echter Fokus-/Maßstabswechsel

Keine Regel „nie zweimal derselbe Übergang“. Konsistenz ist besser als zufällige Variation.

## Kamerabewegung

Kamera ist ein Erklärwerkzeug, kein Retention-Trick.

Sinnvoll:

- Fokus auf Detail
- Wechsel von Überblick zu Ursache
- räumlicher Prozess
- Größen-/Maßstabsvergleich

Nicht sinnvoll:

- permanenter Ken-Burns-Effekt
- zufälliges Push-in pro Satz
- Kamera, die die Lesbarkeit von UI/Text verschlechtert

## REAL_CAPTURE / HYBRID

Bei Captures oder externen Assets gilt dieselbe Bewegungssprache.

- Crop/Zoom nur für Fokus
- keine künstliche Bewegung, wenn das Capture bereits genug sichtbare Aktion hat
- Hybrid-Overlay synchron zum realen Ereignis
- externes Motion-Asset nicht zusätzlich mit unnötigen Kameratricks überladen

## Prüfung vor dem Rendern

Maschinell prüfbare Regeln bleiben über Motion-/Diversity-Tests abgesichert.

Was zwingend visuell geprüft werden muss:

- Fokus ist sofort klar
- Bewegung beginnt/endet passend zur Sprecherbedeutung
- kein erzwungener Leerlauf
- kein unnötiges Effektstapeln
- Hero-Moment wirklich stärker als normale Beats
- Pattern Interrupts tragen neue Bedeutung
- Motion bleibt auf Smartphone lesbar

`POST_RENDER_REVIEW.md` und `CREATIVE_QA.md` sind deshalb wichtiger als reine Kurven-/Frame-Tests.

## Sichere Zonen

`CAPTION_SAFE_POSITION.md` ist verbindlich.

Der technische Animations-Cutoff um `y≈1440` ist nur letzte Sicherung. Hauptvisuals sollen vorher bereits so komponiert sein, dass nichts Wichtiges sichtbar abgeschnitten wird.
