# Performance Learning — aus echten Veröffentlichungen lernen

Diese Datei regelt, wie der Kanal aus realen Zuschauerreaktionen lernt, ohne einzelnen Ausreißern oder erfundenen „guten Benchmarks“ hinterherzulaufen.

## Grundsatz

> Produktionsregeln werden durch echte wiederkehrende Muster verbessert, nicht durch Bauchgefühl nach einem einzelnen Upload.

Creative QA bewertet vor Veröffentlichung. Performance Learning bewertet danach, was Zuschauer tatsächlich getan haben.

## 1. Keine universellen Magic Benchmarks

Keine pauschalen Internetwerte wie „70 % Retention ist immer gut“ als harte Wahrheit übernehmen.

Vergleichen bevorzugt mit:

- eigenen früheren Videos
- derselben Plattform
- ähnlicher Laufzeit
- ähnlichem Content-Typ
- ähnlichem Veröffentlichungsalter

Plattformmetriken können unterschiedlich definiert sein und sich ändern.

## 2. Relevante Signale

Nur Metriken dokumentieren, die die Plattform tatsächlich bereitstellt.

### Short-Form

Besonders hilfreich:

- Views / Reichweite
- Zuschauerbindung in den ersten Sekunden, falls verfügbar
- durchschnittliche Wiedergabedauer
- durchschnittlicher angesehener Prozentanteil
- Completion/Ende erreicht, falls verfügbar
- Rewatches/Loops, falls ableitbar
- Shares
- Saves/Favoriten
- Kommentare
- Profil-/Kanalaktionen, falls verfügbar

### Longform

Zusätzlich besonders relevant:

- Impressionen
- CTR von Titel/Thumbnail
- durchschnittliche Wiedergabedauer
- Retention-Kurve nach Kapitel/Zeitpunkt
- Endscreen-/Weiterklick-Signale, falls verfügbar

## 3. Erst Diagnose, dann Änderung

Schwache Performance nicht automatisch mit „Algorithmus“ erklären.

Mögliche Diagnoseklassen:

### `HOOK_FAILURE`

Starker Abfall unmittelbar am Anfang.

Prüfen:

- beginnt das Video mit Vorrede?
- ist Konflikt/Ergebnis sichtbar genug?
- passt erster Frame zur gesprochenen Aussage?
- verspricht Packaging etwas anderes als der Einstieg?

### `EXPECTATION_MISMATCH`

Klick/Start gut, danach schneller Einbruch.

Prüfen:

- löst der Inhalt das Hook-Versprechen wirklich ein?
- kommt die eigentliche Antwort zu spät?
- war Titel/Cover zu stark formuliert?

### `MIDDLE_FATIGUE`

Anfang funktioniert, Mitte verliert deutlich.

Prüfen:

- wiederholt sich die visuelle Grammatik?
- wird erklärt statt entwickelt?
- gibt es zu lange statische Sprecherabschnitte?
- fehlt ein neuer Bedeutungs-/Mechanikschritt?

### `PAYOFF_TOO_LATE`

Zuschauer bekommt die entscheidende Antwort erst sehr spät.

Prüfen:

- kann der Aha-Moment früher beginnen?
- ist Kontext überdimensioniert?
- kann das Thema enger werden?

### `GOOD_WATCH_LOW_ACTION`

Watch-Verhalten ordentlich, aber wenig Saves/Shares/Kommentare.

Prüfen:

- ist der praktische Nutzen konkret?
- ist die Schlussregel merk-/teilbar?
- war der Inhalt interessant, aber ohne persönliche Konsequenz?

### `PACKAGING_PROBLEM`

Vor allem bei Longform: Inhalt/Retention gut bei wenig Klicks.

Prüfen:

- Titel/Thumbnail-Idee
- Klarheit des Nutzens
- visueller Fokus
- Erwartung statt Clickbait

## 4. Per-Reel Performance Review

Nach Veröffentlichung kann im Reel-Paket optional angelegt werden:

```text
06-projektdateien/performance-review.md
```

Empfohlene Struktur:

```text
# Performance Review

Veröffentlicht am:
Plattform:
Review-Zeitpunkt:
Laufzeit:
Content-Säule:
Hook-Typ:
Visual-Hauptmechanik:

## Verfügbare Metriken
[nur echte Werte eintragen]

## Kurven-/Verhaltensbeobachtung

## Wahrscheinlichste Diagnose
HOOK_FAILURE | EXPECTATION_MISMATCH | MIDDLE_FATIGUE | PAYOFF_TOO_LATE | GOOD_WATCH_LOW_ACTION | PACKAGING_PROBLEM | STRONG | UNKLAR

## Was wahrscheinlich funktioniert hat

## Was wahrscheinlich nicht funktioniert hat

## Nächster kontrollierter Test
[nur 1–2 konkrete Änderungen]

## Soll eine globale Regel geändert werden?
NEIN / NOCH NICHT / JA MIT BEGRÜNDUNG
```

Keine fehlenden Metriken erfinden.

## 5. Nicht aus einem Reel überlernen

Eine globale Produktionsregel normalerweise erst ändern, wenn:

- dasselbe Muster über mehrere vergleichbare Veröffentlichungen wiederkehrt
- oder ein offensichtlicher qualitativer Fehler unabhängig von Performance-Daten sichtbar ist

Richtwert für datengetriebene Regeländerungen: mindestens etwa **3 vergleichbare Fälle**, bevor aus einem Muster eine globale Regel wird.

Das ist kein statistischer Beweis, sondern Schutz vor Überreaktion auf einen einzelnen Ausreißer.

## 6. Kontrollierte Tests

Wenn möglich nur wenige Dinge gleichzeitig verändern.

Beispiele:

- gleicher Themen-Typ, aber direkterer Hook
- ähnliche Länge, aber früherer Payoff
- ähnliche Erklärung, aber REAL_CAPTURE statt abstrakter UI
- ähnlicher Hook, aber weniger Karten-/Panelgrammatik
- ähnliches Thema, aber sichtbarere praktische Konsequenz

Wenn Hook, Länge, Thema, Visualstil und Packaging gleichzeitig geändert werden, ist kaum klar, was geholfen hat.

## 7. Was das Repo lernen soll

Über mehrere Veröffentlichungen beobachten:

### Themen

- welche Content-Säulen ziehen wiederholt?
- welche Angles funktionieren besser als bloße Oberthemen?
- Evergreen vs. Current vs. Hybrid

### Hooks

- Ergebnis zuerst
- Konflikt zuerst
- Demonstration zuerst
- Frage zuerst
- Vorher/Nachher

### Visuals

- echte UI/Capture
- Prozess/Pfad
- räumliche Metapher
- Transformation
- Vergleich
- Dokument/Quelle

### Tempo

- welche Laufzeiten funktionieren für welche Themen?
- wo entstehen wiederkehrende Leerlaufstellen?

### Payoff

- praktische Regel
- Aha-Moment
- Limit/Einordnung
- Workflow-Ergebnis

## 8. Performance darf Wahrheit nicht überschreiben

Nicht aus Performance-Daten ableiten:

- stärkere unbelegte Behauptungen
- künstlich dramatischere Fakten
- Fake-Zahlen
- falsche Quellen
- irreführende Titel/Thumbnails

Wenn ein falscher oder übertriebener Claim besser performen würde, bleibt er trotzdem verboten.

## 9. Feedback zurück ins System

Wiederkehrende, belastbare Erkenntnisse werden nur gezielt in die passende Datei übertragen:

- Themenmuster → `THEMENWAHL.md`
- Hook/Story → `STORY_RETENTION.md`
- Visualmuster → `VISUAL_STRATEGY.md`
- Reel-Struktur → `REELS.md`
- Publishing/Packaging → `PLATTFORMEN.md`

Nicht jede Beobachtung direkt in `MASTER.md` schreiben. `MASTER.md` bleibt stabil und verweist auf die spezialisierten Regeln.
