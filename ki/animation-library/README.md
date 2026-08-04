# Animation Library + Creative Brain

## Ziel

Dieses System verhindert, dass neue Reels immer wieder dieselben vollständigen Animationen verwenden. Es verbindet inzwischen sechs Ebenen:

1. eine große semantisch beschriebene Animationsbibliothek,
2. einen Reel-Planer mit Abwechslungs- und Wiederholungsschutz,
3. einen Produktionsplaner für bestehende und neu zu bauende Animationen,
4. einen Proposal-Compiler für wirklich neue Szenen,
5. ein versioniertes Creative Brain mit Lern- und Tuning-Pipeline,
6. ein eigenes Render-, Prüf- und Bibliotheks-Auditsystem.

## Sicherer Parallelbetrieb

Die Entwicklung liegt auf:

```text
feature/animation-library-brain
```

Der Branch wurde vom Stand von `feature/sentence-to-motion-system` abgezweigt. Dadurch kann Claude Code das Referenz-Reel auf dem ursprünglichen Branch testen, ohne dass beide Agenten gleichzeitig dieselben Dateien verändern.

`main` wird nicht verändert. Es existiert noch kein Merge und kein zusätzlicher PR.

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

Zwölf eigenständige Prototypen aus zwölf verschiedenen Familien sind als ausführbare Remotion-Compositions vorhanden:

| Composition | Animation | Familie |
|---|---|---|
| `Library-Knowledge-Magnet` | Knowledge Magnet | Retrieval/Search |
| `Library-Budget-Leak-Meter` | Budget Leak Meter | Kosten/Effizienz |
| `Library-Context-Window-Train` | Context Window Train | Kontextfenster |
| `Library-Decision-Tree-Burst` | Decision Tree Burst | Entscheidungslogik |
| `Library-Human-AI-Relay` | Human AI Relay | Mensch-KI-Zusammenarbeit |
| `Library-Knowledge-Tree-Graft` | Knowledge Tree Graft | Lernen/Aktualisierung |
| `Library-Magnetic-Phrase-Slicer` | Magnetic Phrase Slicer | Tokenisierung |
| `Library-Vector-Prism-Converter` | Vector Prism Converter | Datenumwandlung |
| `Library-Dynamic-Podium-Rise` | Dynamic Podium Rise | Ranking |
| `Library-Subway-Workflow-Map` | Subway Workflow Map | Prozessfluss |
| `Library-Funnel-Compression-Output` | Funnel Compression Output | Input/Output |
| `Library-Anomaly-XRay-Scanner` | Anomaly X-Ray Scanner | Fehlererkennung |

Die Prototypen liegen unter:

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

## Produktionsplaner

`productionPlanner.ts` verbindet den Choreografieplaner mit der tatsächlichen Umsetzung.

Für jede Szene entsteht entweder:

- eine konkrete Auswahl aus der vorhandenen Bibliothek oder
- eine vollständige neue Build-Spezifikation.

Der Produktionsplan enthält:

- Quelle `library` oder `new-build`
- endgültige Animation-ID
- Katalogeintrag
- Bewertungsgründe
- Build-Spezifikation für neue Animationen
- visuelle Familien, Layouts und Bewegungssignaturen des gesamten Reels
- Qualitätswarnungen
- eindeutigen Status `readyForImplementation`

## Neue Animation statt unpassender Wiederholung

Erreicht keine vorhandene Animation den Mindestwert, liefert der Planer keine schlechte Notlösung. Er erstellt einen `NewAnimationProposal` mit:

- benötigten semantischen Schlagwörtern
- vorgeschlagener visueller Familie
- verbotenen, bereits verwendeten Layouts
- verbotenen Bewegungssignaturen
- vorgeschlagener neuer Bewegungsrichtung
- vorgeschlagener Energie

`proposalCompiler.ts` übersetzt diesen Vorschlag in einen echten Bauvertrag mit:

- neuer stabiler Animation-ID
- garantiert nicht verbotener Layoutfamilie
- garantiert nicht verbotener Bewegungssignatur
- passenden Grundbausteinen
- Übergangsverträgen
- Kamerastil
- Energie, Dichte und Komplexität
- vier Choreografiephasen `establish`, `explain`, `contrast`, `resolve`
- verpflichtenden Implementierungsregeln

Eine neue Animation gilt ausdrücklich als nicht bestanden, wenn sie nur aus bestehenden Karten mit anderen Texten besteht.

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

### Batch-Lernen

`learningPipeline.ts` verarbeitet Beobachtungen und Animationsnutzung chronologisch und idempotent:

- doppelte Beobachtungen werden nicht erneut gelernt
- doppelte Reel-/Szenen-/Animationsnutzung wird übersprungen
- neue Katalogeinträge werden vorher mit dem Brain abgeglichen
- Fakten und Qualitätswerte werden in einer reproduzierbaren Reihenfolge aktualisiert

### Automatisches Tuning

`brainTuning.ts` verändert Regeln nur bei wiederholter Evidenz:

- mehrere Beschwerden über Wiederholung erhöhen Neuheits- und Abwechslungsgewicht
- mehrere Verständlichkeitsprobleme erhöhen semantische Passung
- mehrere Render- oder Produktionsfehler erhöhen Produktionssicherheit
- wenige oder einzelne Rückmeldungen verändern die Gewichte nicht sofort
- alle Gewichte bleiben normalisiert und Änderungen sind begrenzt

## Bibliotheks-Audit

`libraryAudit.ts` prüft unter anderem:

- doppelte Animation-IDs
- doppelte Layout-/Bewegungssignaturen
- unter- oder überfüllte Familien
- fehlende Prototype-Abdeckung
- zu schwache semantische Tags
- unvollständige Übergangsverträge
- zu hohe Kartenkonzentration
- zu niedrige Produktionssicherheit bei Prototypen

Der aktuelle Zielvertrag bleibt:

```text
22 Familien × 4 Varianten = 88 eindeutige Konzepte
```

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
12 Prototypen × 3 Smoke-Frames = 36 PNG-Dateien
```

### Vollständige Prototyp-Prüfung

```bash
node scripts/render-animation-library.mjs all
node scripts/check-animation-library-renders.mjs
```

Erwartung:

```text
12 Prototypen × 7 PNG-Dateien = 84 PNG-Dateien
12 Prototypen × 1 MP4-Datei = 12 MP4-Dateien
96/96 technisch gültige Artefakte
```

Der technische Bericht liegt anschließend unter:

```text
out/animation-library/release-report.json
```

## Ehrlicher Status

Der Katalog, beide Planerebenen, der Proposal-Compiler, das Creative Brain, Batch-Lernen, automatisches Tuning, Persistenz, Audit, Tests, Render-System und zwölf ausführbare Remotion-Prototypen sind als Code vorhanden.

Noch nicht bestätigt sind:

- TypeScript-Erfolg in einer echten lokalen Umgebung
- bestandene Vitest-Tests
- erfolgreiche Remotion-Render
- visuelle Qualität der 84 Prüfbilder
- Bewegungsqualität der zwölf MP4-Dateien

Diese Punkte dürfen erst nach dem tatsächlichen Lauf als bestanden markiert werden.
