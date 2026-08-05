# Creative Brain

## Zweck

Das Creative Brain ist keine freie, unkontrollierte KI. Es ist ein nachvollziehbares, versioniertes Entscheidungssystem für Reel-Choreografie.

Es soll zwei Fehler verhindern:

1. Eine technisch gute Animation wird so oft wiederverwendet, dass alle Reels gleich aussehen.
2. Eine neue Animation wird nur wegen ihrer Neuheit eingesetzt, obwohl sie den gesprochenen Satz schlecht erklärt.

## Bewertungsgewichte

Aktuelle Startverteilung:

| Signal | Gewicht |
|---|---:|
| semantische Passung | 45 % |
| Neuheit | 24 % |
| Abwechslung im Reel | 16 % |
| Produktionssicherheit | 10 % |
| Übergangskontinuität | 5 % |

Die Summe muss immer exakt 100 Prozent ergeben. Ungültige Gewichtszustände werden vom Schema abgelehnt.

## Warum semantische Passung vorne liegt

Eine Animation darf nicht gewählt werden, nur weil sie lange nicht genutzt wurde. Sie muss den Satz erklären.

Beispiel:

```text
Satz: „Die KI sucht passende Belege in Dokumenten.“
```

Ein Knowledge-Magnet, Suchradar oder Archiv-Spotlight ist sinnvoll. Ein Tacho wäre neu, aber inhaltlich falsch.

## Wiederholungsschutz

### Innerhalb eines Reels

- keine identische `animationId`
- keine gleiche Layoutfamilie direkt hintereinander
- starke Strafe für bereits genutzte Bewegungssignaturen
- Strafe für wiederholte visuelle Familien
- Strafe für gleiche Bewegungsrichtung
- Obergrenze für Karten als Hauptvisualisierung

### Zwischen Reels

- exakte Animation mindestens fünf Reels sperren
- exakte Animation mindestens zwanzig Szenen sperren
- kürzlich genutzte visuelle Familie erhält einen niedrigeren Neuheitswert
- ähnliche Layout- und Bewegungsbegriffe erzeugen zusätzliche Strafen

Eine Familie wird nicht komplett verboten. Ein neues Retrieval-Reel darf weiterhin eine Suchanimation verwenden, aber nicht wieder dieselbe Knowledge-Magnet-Komposition, wenn eine andere passende Suchmetapher vorhanden ist.

## Gesamtplanung statt Einzelentscheidung

Der Planer nutzt Beam Search. Er behält mehrere mögliche Szenenfolgen und vergleicht deren Gesamtergebnis.

Ohne Gesamtplanung könnte ein sehr guter Kandidat für Szene 1 gewählt werden, der später drei ähnliche Layouts erzwingt. Die Beam Search kann stattdessen die minimal schwächere erste Auswahl nehmen, wenn dadurch das gesamte Reel deutlich abwechslungsreicher wird.

## Neue Animation automatisch anfordern

Eine Szene erhält einen Vorschlag für eine neue Animation, wenn:

- `mustBeNew` gesetzt ist
- kein Kandidat zulässig ist
- der beste Kandidat unter dem Mindestwert 68 liegt

Der Vorschlag enthält keine beliebige Idee, sondern klare Konstruktionsgrenzen:

- erforderliche Semantik
- bevorzugte Familie
- bereits verbotene Layouts
- bereits verbotene Bewegungssignaturen
- nächste sinnvolle Bewegungsrichtung
- passende Energie

## Lernereignisse

### render-review

Quelle: manuelle Prüfung von PNGs und MP4.

Geeignet für:

- Layoutfehler
- schlechte Lesbarkeit
- unruhige Bewegung
- fehlende visuelle Erklärung
- Übergangsprobleme

Lernrate: mittel.

### user-feedback

Quelle: direkte Rückmeldung des Nutzers.

Geeignet für:

- „zu langweilig“
- „passt nicht zum Satz“
- „zu technisch“
- „diese Animation gefällt mir“
- „nicht ständig Karten verwenden“

Lernrate: am stärksten.

### performance-metric

Quelle: echte Reel-Daten wie Haltequote oder Abbruchstelle.

Geeignet für:

- wiederholt schwache Hook-Animation
- starke oder schwache Szene bei vergleichbaren Themen
- mögliche Überladung

Lernrate: vorsichtig, weil Leistungsdaten von vielen Faktoren beeinflusst werden.

### new-knowledge

Quelle: neue geprüfte Information über Inhalte, Regeln oder Produktionsanforderungen.

Geeignet für:

- neue Plattform-Safe-Zones
- geänderte Markenregeln
- neue technische Erkenntnisse
- aktualisierte Fakten für Erklär-Reels

Lernrate: bei Animationswerten niedrig; Fakten werden getrennt versioniert.

## Faktenaktualisierung

### Regel 1: Aktualität

Ein neuer Fakt muss mindestens genauso aktuell sein wie der gespeicherte Fakt.

### Regel 2: Vertrauenswürdigkeit

Ein neuer Fakt muss mindestens 85 Prozent der Vertrauensstärke des bestehenden Fakts besitzen.

Beispiel:

```text
Gespeicherter Fakt: Vertrauen 0,95
Neue Behauptung: Vertrauen 0,40
Ergebnis: gespeicherter Fakt bleibt aktiv
```

```text
Gespeicherter Fakt: Vertrauen 0,95
Neue verifizierte Information: Vertrauen 0,92
Ergebnis: neuer Fakt darf den alten Fakt versioniert ersetzen
```

### Regel 3: Verlauf bleibt erhalten

Auch abgelehnte oder schwache Beobachtungen bleiben in `observations` gespeichert. Dadurch ist nachvollziehbar, warum das aktive Wissen nicht verändert wurde.

## Bewertung einer Animation nach Feedback

Jede Animation besitzt lernende Werte:

- `learnedSemanticClarity`
- `learnedNovelty`
- `learnedProductionConfidence`

Die Werte werden mit einem gleitenden Mittel aktualisiert. Neues Feedback ersetzt den alten Wert nicht vollständig.

Direktes Nutzerfeedback wirkt stärker als ein einzelner Messwert.

## Zustandsrevision

Jede tatsächliche Änderung erhöht `revision` um eins:

- neue Beobachtung
- neue Nutzung
- neue Animation im Katalog
- aktualisierte Gewichte
- neuer oder ersetzter Fakt

Doppelte Beobachtungs-IDs werden ignoriert. Dadurch darf derselbe Renderbericht nicht zweimal lernen.

## Speicherung

Ein Snapshot enthält:

- Schema-Version
- Katalog-Version
- Zeitpunkt
- Fingerprint
- vollständigen Brain-Zustand

Beim Laden wird der Fingerprint neu berechnet. Passt er nicht, wird der Snapshot abgelehnt.

## Noch nicht umgesetzt

Diese Funktionen sind bewusst noch offen:

- automatische Auswertung echter Social-Media-Metriken
- automatische Bildanalyse gerenderter PNGs
- automatische Erkennung von Textüberlauf aus Pixeln
- automatische Persistenz in einer Datenbank
- automatisches Mergen neuer Prototypen

Sie werden erst ergänzt, wenn die aktuelle deterministische Grundlage durch echte Tests bestätigt wurde.
