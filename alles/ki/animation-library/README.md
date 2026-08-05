# Animation Library + Creative Brain

## Ziel

Das System verhindert, dass neue Reels immer wieder dieselben vollständigen Animationen verwenden. Es verbindet:

1. einen Katalog mit semantisch beschriebenen Animationen,
2. einen Reel-Planer mit Anti-Wiederholungslogik,
3. einen Produktionsplaner für vorhandene und neue Animationen,
4. einen Proposal-Compiler für fehlende Visualisierungen,
5. ein versioniertes Creative Brain,
6. Lern-, Tuning-, Audit- und Render-Review-Pipelines,
7. ein eigenes Remotion-Render- und Freigabesystem.

## Sicherer Parallelbetrieb

Die Entwicklung liegt auf:

```text
feature/animation-library-brain
```

Der Branch wurde von `feature/sentence-to-motion-system` abgezweigt. Claude Code kann deshalb das Referenz-Reel auf dem ursprünglichen Branch testen, ohne dass zwei Agenten dieselben Dateien verändern.

`main` bleibt unverändert. Es existiert kein Merge und kein zusätzlicher PR.

## Bibliotheksumfang

```text
88 Animationskonzepte
22 visuelle Familien
4 eigenständige Varianten pro Familie
22 ausführbare Remotion-Prototypen
22/22 Familien mit ausführbarem Prototyp
```

Jeder Eintrag besitzt unter anderem:

- stabile `animationId`
- visuelle Familie
- Layoutfamilie
- eindeutige Bewegungssignatur
- semantische Tags und Erklärmuster
- Ausschlussfälle
- Grundbausteine
- Übergangsverträge
- Kamerastil und Bewegungsrichtung
- Energie, Dichte und Komplexität
- empfohlene Dauer
- Startwerte für Verständlichkeit, Neuheit und Produktionssicherheit

Der Katalog liegt unter:

```text
ki/src/animation-library/catalog.ts
```

## Ausführbare Prototypen

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
| `Library-Meaning-Terrain` | Meaning Terrain | Bedeutungsraum |
| `Library-Dependency-Bridge-Builder` | Dependency Bridge Builder | Beziehungen/Attention |
| `Library-Probability-Fluid-Columns` | Probability Fluid Columns | Wahrscheinlichkeit |
| `Library-Residual-River` | Residual River | Modellverarbeitung |
| `Library-Answer-Loom` | Answer Loom | Antwortgenerierung |
| `Library-Confidence-Glass-Crack` | Confidence Glass Crack | Risiko/Wahrheit |
| `Library-Encryption-Vault-Layers` | Encryption Vault Layers | Sicherheit/Datenschutz |
| `Library-Latency-Tunnel-Race` | Latency Tunnel Race | Performance/Skalierung |
| `Library-Timeline-Microscope` | Timeline Microscope | Zeit/Veränderung |
| `Library-Benchmark-Racetrack` | Benchmark Racetrack | Vergleich |

Code und eigener Remotion-Einstieg:

```text
ki/src/animation-library/prototypes/
ki/src/animation-library/remotion-entry.tsx
```

## Reel- und Produktionsplanung

`planner.ts` verwendet eine begrenzte Beam Search und bewertet für das gesamte Reel:

- semantische Passung
- Neuheit
- Abwechslung der visuellen Familien
- unterschiedliche Layouts und Bewegungssignaturen
- Produktionssicherheit
- Anschlussfähigkeit der Übergänge
- Energie, Richtung und Komplexität
- Cooldowns und Kartenlimit

`productionPlanner.ts` erzeugt für jede Szene entweder:

- eine konkrete Bibliotheksauswahl oder
- einen neuen Build-Vertrag.

Der Ausgabeplan enthält Auswahlquelle, Animation-ID, Bewertung, Gründe, Build-Spezifikation, Gesamtchoreografie und Qualitätswarnungen.

## Neue Animationen

Unterschreitet die beste vorhandene Animation den Qualitätswert, erstellt der Planer einen `NewAnimationProposal` statt eine unpassende Vorlage zu erzwingen.

`proposalCompiler.ts` übersetzt ihn in einen Bauvertrag mit:

- neuer Animation-ID
- garantiert nicht verbotener Layoutfamilie
- garantiert nicht verbotener Bewegungssignatur
- passenden Grundbausteinen
- Übergangsverträgen
- Kamerastil
- vier Phasen: `establish`, `explain`, `contrast`, `resolve`
- verbindlichen Determinismus-, Safe-Zone- und Renderregeln

Eine neue Animation gilt als nicht bestanden, wenn sie nur aus bekannten Karten mit anderen Texten besteht.

## Creative Brain

Das Brain speichert:

- Auswahlgewichte
- Anti-Wiederholungsregeln
- Nutzung und Cooldowns
- akzeptierte, überarbeitete und abgelehnte Animationen
- erlernte Werte für Verständlichkeit, Neuheit und Produktionssicherheit
- Nutzerfeedback, Renderreviews und Leistungsdaten
- versionierte Fakten und neue Informationen

Neue Informationen ersetzen ältere Fakten nur, wenn sie mindestens genauso aktuell und ausreichend zuverlässig sind. Der alte Verlauf bleibt erhalten.

### Lernpipeline

`learningPipeline.ts` verarbeitet Beobachtungen und Nutzungsdaten chronologisch und idempotent. Doppelte Ereignisse werden nicht erneut gelernt.

`brainTuning.ts` verändert Gewichte nur bei wiederholter Evidenz:

- Wiederholungsbeschwerden erhöhen Neuheit und Reel-Abwechslung
- Verständlichkeitsprobleme erhöhen semantische Passung
- Renderfehler erhöhen Produktionssicherheit
- einzelne Rückmeldungen lösen keine großen Regeländerungen aus

## Qualität und Freigabe

`libraryAudit.ts` prüft unter anderem:

- doppelte IDs
- doppelte Layout-/Bewegungssignaturen
- fehlende oder überfüllte Familien
- schwache semantische Tags
- unvollständige Übergänge
- Kartenkonzentration
- niedrige Produktionssicherheit

`prototypeCoverage.ts` prüft getrennt vom Katalogstatus, ob tatsächlich eine ausführbare Komponente pro Familie registriert ist. Der aktuelle Zielzustand ist `22/22`.

`renderReview.ts` darf den Status nur auf `verified` setzen, wenn:

- alle PNGs und das MP4 technisch gültig sind
- der Quellfingerprint aktuell ist
- die Animation ohne Ton verständlich bleibt
- mobile Lesbarkeit und Safe-Zones stimmen
- kein Überlauf vorliegt
- die Bewegung deterministisch ist
- Mindestwerte für Verständlichkeit, Neuheit und Produktionssicherheit erreicht werden

Eine ausgemusterte Animation wird nicht automatisch reaktiviert.

## Persistenz

Creative-Brain-Zustände werden als versionierte JSON-Snapshots mit portablem Fingerprint gespeichert. Beschädigte oder nachträglich veränderte Snapshots werden abgelehnt.

## Befehle

```bash
npm run animation-library:verify
npm run animation-library:plan
npm run animation-library:smoke
npm run animation-library:stills
npm run animation-library:videos
npm run animation-library:render
npm run animation-library:check
npm run animation-library:full-release-check
```

Erwarteter Renderumfang:

```text
Smoke: 22 × 3 = 66 PNG-Dateien
Voll: 22 × 7 = 154 PNG-Dateien
Videos: 22 MP4-Dateien
Gesamt: 176/176 technisch gültige Artefakte
```

Bericht:

```text
out/animation-library/release-report.json
```

## Ehrlicher Status

Katalog, Planer, Proposal-Compiler, Creative Brain, Lernpipeline, automatisches Tuning, Persistenz, Audit, Coverage-Report, Render-Review, Tests, Render-System und 22 Remotion-Prototypen sind als Code vorhanden.

Noch nicht bestätigt sind:

- erfolgreicher TypeScript-Lauf
- bestandene Vitest-Tests
- erfolgreiche Remotion-Render
- visuelle Qualität der 154 Prüfbilder
- Bewegungsqualität der 22 MP4-Dateien

Diese Punkte dürfen erst nach dem tatsächlichen Lauf als bestanden markiert werden.
