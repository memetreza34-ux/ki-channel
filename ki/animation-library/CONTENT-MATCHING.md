# Content-first Animation Matching

## Ziel

Die bestehende Repository-Struktur, der Animationskatalog, der Creative-Brain-State und die Remotion-Galerie bleiben erhalten. Die Animationen werden jedoch nicht mehr nur nach Tags, Neuheit und Abwechslung ausgewählt. Der konkrete Sprechertext steuert jetzt:

1. die Auswahl der visuellen Familie,
2. den Bedeutungsvertrag der Szene,
3. die sichtbaren Objekte und Beschriftungen im Prototyp,
4. die Remotion-Props,
5. die kompilierten Motion-Events,
6. die Freigabe im Masterplan.

Eine Animation gilt nur dann als produktionsbereit, wenn ihr dominanter sichtbarer Mechanismus den gesprochenen Inhalt tatsächlich übernimmt.

## Bedeutungsvertrag pro Szene

Aus jedem Sprechertext wird deterministisch ein `SceneMeaningContract` erzeugt:

- Kommunikationsziel
- Startzustand
- sichtbare Veränderung
- Endzustand
- wichtige Subjekte
- wichtige Aktionen
- erwartete Resultate
- passende visuelle Familien
- passende Erklärmuster
- verpflichtende visuelle Hinweise
- verbotene visuelle Abkürzungen

Beispiel:

```text
Satz: "Der Text wird in einzelne Tokens zerlegt."

Start: ein zusammenhängender lesbarer Text
Veränderung: der Text trennt sich nachvollziehbar in geordnete Einheiten
Ende: die Einheiten bleiben lesbar und bereit für den nächsten Verarbeitungsschritt
```

Eine reine Ranking-, Karten- oder Partikelanimation kann diesen Vertrag nicht erfüllen, selbst wenn sie visuell hochwertig ist.

## Erweiterte Inhaltsbereiche

Die Bedeutungsanalyse deckt unter anderem ab:

- Tokenisierung
- Daten- und Vektorumwandlung
- Bedeutungsräume
- Wahrscheinlichkeit
- Antwortgenerierung
- Retrieval und Quellen
- Kontextfenster
- Prozessabläufe
- Ranking
- Vergleich
- Entscheidungslogik
- Fehlerdiagnose
- Modellschichten
- Attention und Beziehungen
- Kosten und Effizienz
- Last, Latenz und Engpässe
- Sicherheit und Datenschutz
- Wissensupdates
- Veränderung über Zeit
- Mensch–KI-Zusammenarbeit

Allgemeine Einzelwörter reichen nicht für einen semantischen Override. Erforderlich sind eine passende Phrase, mehrere zusammengehörige Signale oder ein eindeutiger Fachbegriff.

## Auswahlregeln

Der Planer bewertet weiterhin:

- semantische Tags
- Neuheit
- Abwechslung
- Produktionssicherheit
- Übergangskontinuität

Zusätzlich verbindlich:

- Übereinstimmung mit dem exakten Sprechertext
- Übereinstimmung mit dem Kommunikationsziel
- sichtbare Darstellung von Start, Veränderung und Ergebnis
- passende Erklärmuster
- Abdeckung notwendiger visueller Hinweise
- `avoidWhen`-Ausschlussregeln
- verfügbare Szenendauer

Neuheit und Abwechslung erhalten eine Inhaltsobergrenze. Eine unpassende Animation kann durch hohe Neuheit keinen guten Gesamtscore mehr erreichen.

## Stabile Planung

Eine Szene, die eine neue Animation benötigt, darf keine vorhandene Bibliotheksanimation unsichtbar reservieren. Deshalb gilt:

- tatsächlich verwendete Animationen, Layouts und Motion-Signaturen bleiben geschützt,
- New-Build-Szenen belegen keine Bibliotheksanimation,
- nachfolgende Szenen werden mit dem realen Zustand weitergeplant,
- Duplicate-, Karten- und Layoutregeln bleiben aktiv.

## Content-aware Remotion-Prototypen

Alle 22 registrierten Kernprototypen sind über `PrototypeContentContext` parametrisierbar und besitzen native Objektbindung.

Das bedeutet: Nicht nur Titel und Untertitel ändern sich. Auch die dominanten sichtbaren Elemente werden aus Szenendaten erzeugt, beispielsweise:

- tatsächliche Wörter im Token-Slicer
- Vektordimensionen und Werte
- Begriffe und Cluster im Bedeutungsraum
- Kandidaten und Wahrscheinlichkeiten
- Entscheidungsfrage, Äste und gewählter Pfad
- Retrieval-Anfrage und Quellen
- Nachrichten und Kapazität des Kontextfensters
- Attention-Knoten und gewichtete Beziehungen
- Antwortwörter und Kontextfäden
- Modellschichten und Zwischenzustände
- Behauptung, Prüfschritte und Warnung
- Latenzpfade und Messwerte
- Ranking-Kandidaten und Kriterien
- Workflow-Stationen
- Eingabequellen und verdichtetes Ergebnis
- Diagnoseschritte und Fehlerquelle
- Kostenlecks und Einsparung
- Vergleichsmodelle und Metriken
- Schutzobjekt und Sicherheitsschichten
- Zeitpunkte und sichtbare Änderungen
- alte und neue Wissensstände
- Mensch–KI-Rollen und Übergaben

Der Test `prototypeContentCoverage.test.ts` vergleicht die Registry direkt mit der nativen Abdeckung. Ein künftig registrierter Prototyp ohne Objektbindung lässt den Test fehlschlagen.

## Render-sichere Sprache

Interne Bedeutungsverträge können technische englische Formulierungen enthalten. Diese bleiben für Planung und Review erhalten, werden aber nicht ungefiltert im deutschen Video angezeigt.

Die Render-Schicht erzeugt stattdessen sichtbare Zustände aus:

- deutschen Begriffen des Sprechertexts,
- Aktions- und Ergebnisbegriffen,
- oder ausdrücklich gelieferten Labels wie `startState`, `visibleChange` und `endState`.

## Remotion-Props

Jede Masterplan-Szene erhält validierte `prototypeRenderProps`:

```json
{
  "content": {
    "title": "Latenz · Kapazität · Engpass",
    "spokenText": "Unter hoher Last steigt die Latenz ...",
    "meaningContract": {
      "communicationGoal": "show-limitation",
      "startState": "...",
      "visibleChange": "...",
      "endState": "...",
      "requiredVisualCues": ["visible-bottleneck"]
    },
    "labels": {},
    "values": {}
  }
}
```

Zusätzliche prototypspezifische Werte können über `labels` und `values` geliefert werden, etwa Kandidatennamen, Messwerte, Quellen, Kosten oder Branch-Zustände.

## Content-matched Render-CLI

Direkter Smoke-Render einer geplanten Szene:

```bash
node scripts/render-content-matched-prototype.mjs \
  <animationId-oder-compositionId> \
  <masterplan.json> \
  smoke \
  <sceneId>
```

Unterstützte Modi:

- `plan`: validiert und schreibt nur den Renderauftrag
- `smoke`: rendert die Smoke-Kontrollframes
- `stills`: rendert alle Kontrollframes
- `video`: rendert MP4
- `all`: rendert Kontrollframes und MP4

Das Skript validiert Sprechertext, Bedeutungsvertrag, Pflicht-Cues, Szenenzuordnung und Animation-ID. Anschließend übergibt es die normalisierten Daten über Remotions offizielles `--props`-Verfahren.

## Content-Fixtures und harter Runtime-Key-Gate

`ki/src/animation-library/content-render-fixtures.json` enthält für **jede der 22 registrierten Kernanimationen genau ein echtes Inhaltsbeispiel** mit Sprechertext und prototypspezifischen Labels beziehungsweise Werten.

Die Fixtures sind nicht nur Beispieldaten. Sie sind Teil der Freigabeprüfung.

`scripts/check-native-prototype-bindings.mjs` prüft vor dem Rendern:

- exakt 22 native Kernkomponenten,
- exakt 22 eindeutige Content-Fixtures,
- jede Komponente verwendet `PrototypeContentContext`,
- jedes Fixture besitzt echten Sprechertext,
- jedes Fixture prüft mindestens einen expliziten Render-Key,
- **jeder einzelne `labels`-/`values`-Key muss von der zugehörigen TSX-Komponente tatsächlich gelesen werden**.

Damit werden Tippfehler wie `path1` statt `slowPath`, `resultCount` statt `evidenceCount` oder `value1` statt `vector1` bereits vor dem Rendern abgelehnt. Ein stiller Rückfall auf Demo-Fallbackwerte darf nicht mehr als bestandene Content-Prüfung gelten.

## Content-aware Release-Artefakte

Der normale Animation-Library-Release prüft nicht mehr ausschließlich die bisherigen Demo-Render.

Für jede der 22 Kernkompositionen wird mit realen Content-Props zusätzlich an vier Phasen gerendert:

- **Frame 30:** Einstieg / Aufbau
- **Frame 90:** zentrale Erklärphase
- **Frame 150:** Ergebnisphase
- **Frame 179:** finaler Hold

Zusätzlich wird für jede Kernkomposition ein vollständiges `content-prototype.mp4` mit denselben realen Content-Props gerendert. Damit werden nicht nur einzelne Zustände, sondern auch der komplette zeitliche Bewegungsablauf der produktionsnahen Variante technisch geprüft.

Bei der aktuellen Konfiguration mit sieben bisherigen Demo-Kontrollframes ergibt ein vollständiger `all`-Lauf pro Prototyp:

- 7 Demo-Stills
- 4 Content-aware Stills
- 1 Demo-Video
- 1 Content-aware Video

Für 22 Prototypen sind das insgesamt **286 technische Release-Artefakte**:

- 154 Demo-Kontrollframes
- 88 Content-aware Kontrollframes
- 22 Demo-Videos
- 22 Content-aware Videos

`scripts/check-animation-library-renders.mjs` akzeptiert für die Freigabe ausschließlich einen frischen Renderplan aus dem Modus `all`. Getrennte oder ältere Still-/Video-Läufe dürfen nicht mehr zu einer scheinbar vollständigen Freigabe zusammenfallen.

Der Checker verlangt außerdem:

- aktuellen Source-Fingerprint,
- alle registrierten Prototypen,
- exakt die aktuellen vier Content-Checkpoints,
- den expliziten Content-Video-Vertrag,
- gültige Bild-/Video-Artefakte,
- vier bestandene Content-Frames pro Kernprototyp,
- ein bestandenes vollständiges Content-Video pro Kernprototyp.

Damit kann weder ein grüner Demo-Render noch ein einzelner erfolgreicher Content-Frame die neue content-aware Runtime allein freigeben.

## Neue Animation statt falscher Wiederverwendung

Wenn keine bestehende Animation den Inhalt ausreichend erklärt, erzeugt das System ein `NewAnimationProposal` mit:

- exaktem Sprechertext
- Bedeutungsvertrag
- Startzustand
- sichtbarer Veränderung
- Endzustand
- Pflicht-Cues
- verbotenen visuellen Abkürzungen
- ausgeschlossenen bereits verwendeten Layouts und Motion-Signaturen

Ein Proposal ist noch keine implementierte Animation. Eine `new-build`-Szene bleibt im Masterplan blockiert, bis:

1. die TSX-Komponente gebaut wurde,
2. sie im Katalog existiert,
3. sie in der Remotion-Registry registriert wurde,
4. ihre Kontrollframes geprüft wurden.

## Remotion-Event-Payload

Das kompilierte `main-animation`-Event enthält:

- den exakten Sprechertext
- Kommunikationsziel
- Startzustand
- sichtbare Veränderung
- Endzustand
- Subjekt-, Aktions- und Ergebnisbegriffe
- Pflicht-Cues
- verbotene Cues
- visuelle Familie
- Layoutfamilie
- Motion-Signatur

Ein fehlender semantischer Payload ist ein harter Blocker.

## Review-Gate

Eine Szene wird abgelehnt, wenn:

- die Animation auch mit einem völlig anderen Sprechertext funktionieren würde
- die Bewegung nur dekorativ ist
- die Animation nur den Untertitel wiederholt
- Startzustand, Veränderung oder Endzustand fehlen
- eine unpassende visuelle Familie verwendet wird
- `avoidWhen` zutrifft
- eine neue Animation nur geplant, aber noch nicht implementiert ist
- die Animation nicht in der Registry vorhanden ist

## Kompatibilität

Unverändert bleiben:

- Verzeichnisstruktur
- Katalogschema
- Creative-Brain-State
- öffentlicher Planer-Aufruf
- Reel-Lifecycle
- bestehende Composition-IDs
- bestehende Galerie-Render ohne Props
- bestehende Imports aus `planner.ts`

Ohne `content`-Props rendert die Galerie weiterhin ihre bisherigen Demonstrationsdaten. Mit Props übernimmt dieselbe Komposition den konkreten Szeneninhalt.

## Prüfung

Regressionstests und Release-Gates decken unter anderem ab:

- Bedeutungsverträge
- Inhaltsfit vor Neuheit
- harte `avoidWhen`-Ablehnung
- stabile Planung nach New-Build-Szenen
- zentrale Verwendung der erweiterten Bedeutungsanalyse
- Erhalt manuell formulierter Verträge
- Persistenz durch Analyse, Produktion, Masterplan und Remotion-Events
- vollständige Registry-Abdeckung aller 22 Prototypen
- serialisierbare Render-Props
- deutschsprachige Renderzustände ohne Mutation des Quellvertrags
- Blockierung nicht implementierter New-Build-Animationen
- 22/22 Content-Fixture-Abdeckung
- Ablehnung unbenutzter oder falsch geschriebener Fixture-Keys
- vier Content-aware Kontrollphasen pro Prototyp
- vollständiges Content-aware Video pro Prototyp
- Ablehnung gemischter oder veralteter Release-Artefakte

## Noch ausstehende reale Freigabe

Der vollständige Repository-TypeScript-, Vitest- und Remotion-Lauf muss weiterhin ausgeführt werden:

```bash
node scripts/verify-content-matched-runtime.mjs
npm run animation-library:verify
npm run animation-library:full-release-check
```

GitHub Actions beendet Jobs in diesem privaten Repository aktuell vor dem ersten Schritt. Es entstehen weder Checkout-Schritte noch Logs. Deshalb darf der Draft-PR erst nach einem funktionierenden lokalen oder GitHub-basierten Gesamtlauf freigegeben werden.

Die zusätzlichen technischen Content-Frames und Content-Videos ersetzen außerdem keine visuelle Qualitätskontrolle. Vor dem Merge müssen insbesondere Lesbarkeit, Objektüberlagerungen, Timing, Bewegungsrhythmus und tatsächliche semantische Verständlichkeit der gerenderten Content-Varianten kontrolliert werden.
