# Animation Library + Creative Brain

## Ziel

Dieses System verhindert, dass neue Reels immer wieder dieselben vollständigen Animationen verwenden. Es verbindet drei Ebenen:

1. eine große semantisch beschriebene Animationsbibliothek,
2. einen Reel-Planer mit Abwechslungs- und Wiederholungsschutz,
3. ein versioniertes Creative Brain, das aus Renderprüfungen, Nutzerfeedback, Leistungsdaten und neuen Informationen lernt.

## Sicherer Parallelbetrieb

Die Entwicklung liegt auf:

```text
feature/animation-library-brain
```

Der Branch wurde vom aktuellen Stand von `feature/sentence-to-motion-system` abgezweigt. Dadurch kann Claude Code das Referenz-Reel auf dem ursprünglichen Branch testen, ohne dass beide Agenten gleichzeitig dieselben Dateien verändern.

`main` wird nicht verändert. Es existiert noch kein Merge und kein neuer PR.

## Aktueller Umfang

### Katalog

```text
88 Animationskonzepte
22 visuelle Familien
4 eigenständige Varianten pro Familie
```

Jeder Bibliothekseintrag besitzt unter anderem:

- stabile `animationId`
- visuellen Typ
- Layoutfamilie
- eindeutige Bewegungssignatur
- semantische Schlagwörter
- Erklärmuster
- ungeeignete Einsatzfälle
- verwendbare Grundbausteine
- mögliche Übergänge hinein und hinaus
- Kamerastil
- Hauptbewegungsrichtung
- Energie, Dichte und Komplexität
- empfohlene Szenendauer
- Startwerte für Verständlichkeit, Neuheit und Produktionssicherheit

Der Katalog befindet sich in:

```text
ki/src/animation-library/catalog.ts
```

### Bereits als Remotion-Code umgesetzt

Sechs neue Prototypen sind ausführbar:

| Composition | Animation | Familie |
|---|---|---|
| `Library-Knowledge-Magnet` | Knowledge Magnet | Retrieval/Search |
| `Library-Budget-Leak-Meter` | Budget Leak Meter | Kosten/Effizienz |
| `Library-Context-Window-Train` | Context Window Train | Kontextfenster |
| `Library-Decision-Tree-Burst` | Decision Tree Burst | Entscheidungslogik |
| `Library-Human-AI-Relay` | Human AI Relay | Mensch-KI-Zusammenarbeit |
| `Library-Knowledge-Tree-Graft` | Knowledge Tree Graft | Lernen/Aktualisierung |

Diese Prototypen liegen unter:

```text
ki/src/animation-library/prototypes/
```

Sie verwenden einen eigenen Remotion-Einstieg und greifen nicht in die Composition des gerade von Claude Code geprüften Reels ein:

```text
ki/src/animation-library/remotion-entry.tsx
```

## Reel-Planer

`planner.ts` bewertet nicht nur, welche Animation grundsätzlich zum Satz passt. Die Auswahl berücksichtigt:

- semantische Passung
- Erklärmuster
- erlernte Neuheit
- Abwechslung im gesamten Reel
- Produktionssicherheit
- Anschlussfähigkeit an den vorherigen Übergang
- bereits verwendete visuelle Familien
- bereits verwendete Layouts
- bereits verwendete Bewegungssignaturen
- Energie und Bewegungsrichtung
- Komplexitätsgrenzen
- Kartenlimit
- Cooldown vorheriger Reels

Die Planung erfolgt mit einer begrenzten Beam Search. Dadurch wird nicht jede Szene isoliert und gierig entschieden. Der Planer betrachtet mehrere mögliche Gesamtfolgen und bevorzugt eine abwechslungsreiche Choreografie für das komplette Reel.

### Neue Animation statt unpassender Wiederholung

Erreicht keine vorhandene Animation den Mindestwert, liefert der Planer keine schlechte Notlösung. Er erstellt einen `NewAnimationProposal` mit:

- benötigten semantischen Schlagwörtern
- vorgeschlagener visueller Familie
- verbotenen, bereits verwendeten Layouts
- verbotenen Bewegungssignaturen
- vorgeschlagener neuer Bewegungsrichtung
- vorgeschlagener Energie

Damit wächst die Bibliothek genau dort, wo ein neues Reel eine bisher fehlende Visualisierung benötigt.

## Creative Brain

Das Creative Brain speichert:

- Lerngewichte
- globale Anti-Wiederholungsregeln
- Nutzungszahlen pro Animation
- angenommene, überarbeitete und abgelehnte Varianten
- erlernte Werte für Verständlichkeit, Neuheit und Produktionssicherheit
- Cooldowns
- vollständige Nutzungshistorie
- Beobachtungen
- versionierte Fakten

### Neue Informationen aktualisieren

Neue Informationen überschreiben bestehendes Wissen nicht blind.

Eine Information ersetzt einen vorhandenen Fakt nur, wenn sie:

1. mindestens genauso aktuell ist und
2. eine ausreichend hohe Vertrauenswürdigkeit besitzt.

Eine schwache neue Behauptung darf einen älteren, stark belegten Fakt nicht verdrängen. Alle Beobachtungen bleiben im Verlauf erhalten.

### Lernquellen

Das Brain akzeptiert vier Ereignistypen:

- `render-review`
- `user-feedback`
- `performance-metric`
- `new-knowledge`

Direktes Nutzerfeedback erhält die stärkste Lernrate. Ein einzelner unsicherer Messwert verändert das System deutlich vorsichtiger.

## Bestehende Animationshistorie

`historyAdapter.ts` importiert die bereits verwendeten acht Szenen des ersten Referenz-Reels aus:

```text
ki/reels/animation-history.json
```

Dabei werden auch visuelle Familie, Layout und Bewegungssignatur berücksichtigt. Neue Bibliothekseinträge aus derselben Familie bleiben erlaubt, erhalten aber einen niedrigeren Neuheitswert. Exakte Wiederholungen werden deutlich stärker blockiert.

## Persistenz

Creative-Brain-Zustände können als versionierte JSON-Snapshots gespeichert werden. Jeder Snapshot besitzt einen portablen Fingerprint. Nachträglich veränderte oder beschädigte Snapshots werden beim Laden abgelehnt.

```text
ki/src/animation-library/persistence.ts
```

## Prüfungen

### Syntax, TypeScript, Tests und Renderplan

```bash
node scripts/verify-animation-library.mjs
```

### Schnelle Testbilder

```bash
node scripts/render-animation-library.mjs smoke
```

Erwartung:

```text
6 Prototypen × 3 Smoke-Frames = 18 PNG-Dateien
```

### Vollständige Prototyp-Prüfung

```bash
node scripts/render-animation-library.mjs all
node scripts/check-animation-library-renders.mjs
```

Erwartung:

```text
6 Prototypen × 7 PNG-Dateien = 42 PNG-Dateien
6 Prototypen × 1 MP4-Datei = 6 MP4-Dateien
48/48 technisch gültige Artefakte
```

Der technische Bericht liegt anschließend unter:

```text
out/animation-library/release-report.json
```

## Ehrlicher Status

Der Katalog, der Planer, das Creative Brain, die Persistenz, die Tests, das Render-System und sechs ausführbare Remotion-Prototypen sind als Code vorhanden.

Noch nicht bestätigt sind:

- TypeScript-Erfolg in einer echten lokalen Umgebung
- bestandene Vitest-Tests
- erfolgreiche Remotion-Render
- visuelle Qualität der 42 Prüfbilder
- Bewegungsqualität der sechs MP4-Dateien

Diese Punkte dürfen erst nach dem tatsächlichen Lauf als bestanden markiert werden.
