# Content-first Animation Matching

## Ziel

Die bestehende Repository-Struktur, Animationsbibliothek, Produktionspipeline und Remotion-Renderlogik bleiben erhalten. Diese Erweiterung verändert nur die Entscheidungsebene zwischen Sprechertext und Animation.

Eine Animation darf nicht mehr ausgewählt werden, nur weil sie neu, abwechslungsreich oder technisch stabil ist. Sie muss den konkreten gesprochenen Inhalt sichtbar erklären.

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

Neuheit und Abwechslung erhalten eine Inhaltsobergrenze: Eine unpassende Animation kann durch hohe Neuheit keinen guten Gesamtscore mehr erreichen.

## Neue Animation statt falscher Wiederverwendung

Wenn keine bestehende Animation den Inhalt ausreichend erklärt, erzeugt das System weiterhin einen `NewAnimationProposal`. Dieser enthält jetzt zusätzlich:

- den exakten Sprechertext
- den Bedeutungsvertrag
- den benötigten Startzustand
- die verpflichtende sichtbare Veränderung
- den benötigten Endzustand
- Pflicht-Cues
- verbotene visuelle Abkürzungen

Der Proposal-Compiler überträgt diese Angaben direkt in Phasen und Implementierungsregeln.

## Review-Gate

Eine Szene wird abgelehnt, wenn:

- die Animation auch mit einem völlig anderen Sprechertext funktionieren würde
- die Bewegung nur dekorativ ist
- die Animation nur den Untertitel wiederholt
- Startzustand, Veränderung oder Endzustand fehlen
- eine unpassende visuelle Familie verwendet wird
- `avoidWhen` zutrifft

## Kompatibilität

Unverändert bleiben:

- Verzeichnisstruktur
- Katalogschema
- Creative-Brain-State
- Produktionsplaner-Aufruf
- Reel-Lifecycle
- Remotion-Prototypen
- Renderbefehle
- bestehende Imports aus `planner.ts`

`planner.ts` exportiert weiterhin dieselbe öffentliche API und leitet intern auf den content-first Planer weiter.

## Prüfung

Neue Regressionstests prüfen insbesondere:

- korrekte Bedeutungsverträge
- inhaltliche Passung vor Neuheit
- echte Verwendung von `avoidWhen`
- stabile Planung nach einer erzwungenen neuen Szene
- Übergabe des exakten sichtbaren Wandels an neue Animationen
