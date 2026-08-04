# Animation Library Roadmap

## Grundsatz

Die Bibliothek wächst nicht durch wahlloses Kopieren von Szenen. Jede neue Animation muss mindestens eines dieser Probleme lösen:

- ein bisher schlecht erklärbares Konzept verständlich visualisieren
- eine zu häufig verwendete Familie durch eine andere Metapher ersetzen
- einen neuen Bewegungsrhythmus einführen
- einen inhaltlich notwendigen Übergang ermöglichen
- eine bestehende Animation nach echtem Renderfeedback verbessern

## Bestand

| Ebene | Umfang | Status |
|---|---:|---|
| semantische Katalogeinträge | 88 | Code vorhanden, nicht ausgeführt geprüft |
| visuelle Familien | 22 | Code vorhanden |
| Varianten pro Familie | 4 | Code vorhanden |
| priorisierte Prototyp-Ideen | 22 | im Katalog markiert |
| ausführbare Remotion-Prototypen | 18 | Code vorhanden, nicht gerendert |
| Choreografieplaner | 1 | Code vorhanden, nicht ausgeführt geprüft |
| Produktionsplaner | 1 | Code vorhanden, nicht ausgeführt geprüft |
| Proposal-Compiler | 1 | Code vorhanden, nicht ausgeführt geprüft |
| Creative Brain | 1 | Code vorhanden, nicht ausgeführt geprüft |
| Batch-Lernpipeline | 1 | Code vorhanden, nicht ausgeführt geprüft |
| automatisches Brain-Tuning | 1 | Code vorhanden, nicht ausgeführt geprüft |
| Bibliotheks-Audit | 1 | Code vorhanden, nicht ausgeführt geprüft |
| Render-Review-Promotion | 1 | Code vorhanden, nicht ausgeführt geprüft |

## Batch 1 – sechs Basisprototypen

1. Knowledge Magnet
2. Budget Leak Meter
3. Context Window Train
4. Decision Tree Burst
5. Human AI Relay
6. Knowledge Tree Graft

## Batch 2 – allgemeine Erklär- und Businessanimationen

1. Magnetic Phrase Slicer
2. Vector Prism Converter
3. Dynamic Podium Rise
4. Subway Workflow Map
5. Funnel Compression Output
6. Anomaly X-Ray Scanner

## Batch 3 – zentrale KI-Erkläranimationen

1. Meaning Terrain
2. Dependency Bridge Builder
3. Probability Fluid Columns
4. Residual River
5. Answer Loom
6. Confidence Glass Crack

Alle drei Batches sind als Remotion-Code vorhanden. Vor einer Freigabe müssen sie gemeinsam geprüft werden.

### Freigabekriterien je Prototyp

- sieben Prüfframes ohne Überlauf
- vollständiges MP4 ohne leere oder eingefrorene Abschnitte
- klare Bedeutung ohne Ton
- keine Hauptanimation gleicht einem anderen Prototyp
- mobile Lesbarkeit
- keine rein dekorative Dauerbewegung
- Anfang, Wendepunkt und Abschluss sind sichtbar choreografiert
- mindestens ein sinnvoller Ein- und Ausgang für Übergänge
- aktueller Quellfingerprint
- Render-Review ohne Blocker

## Batch 4 – noch fehlende Familienabdeckung

Als Nächstes werden die vier noch nicht als ausführbarer Code vertretenen visuellen Familien priorisiert und um zwei zusätzliche Premium-Metaphern ergänzt:

1. Performance/Scaling – `throughput-pipe-pressure`
2. Time/Change – `timeline-microscope`
3. Comparison – `benchmark-racetrack`
4. Security/Privacy – bevorzugte neue Sicherheitsmetapher
5. Automation – `automation-conveyor-cells`
6. Verification – `source-checkpoint-gates`

Danach wären mindestens 22 Familien durch ausführbare Prototypen abgedeckt.

## Batch 5 – besondere Metaphern

1. Hallucination Mirage
2. Evidence Jury
3. Predictive Type Orchestra
4. Context Thread Braider
5. Confidence Weather Map
6. Tradeoff Landscape Route

Diese Animationen besitzen höhere Komplexität. Sie werden erst gebaut, wenn die ersten 18 Prototypen Typecheck, Prüfframes und Bewegungsprüfung bestanden haben.

## Produktionsstatus

Jeder Eintrag durchläuft diese Zustände:

```text
concept
→ prototype
→ verified
→ optional retired
```

### concept

- Konzept und semantischer Einsatz sind dokumentiert.
- Es existiert noch keine verlässliche Remotion-Komponente.

### prototype

- ausführbarer Remotion-Code existiert
- echte Render- und Sichtprüfung fehlen noch oder sind noch nicht vollständig bestanden

### verified

- TypeScript und Tests erfolgreich
- definierte PNG-Prüfframes erfolgreich
- MP4 erfolgreich
- manuelle visuelle Abnahme erfolgreich
- Verwendung in mindestens einer echten Reel-Szene geprüft
- `renderReview.ts` meldet keine Blocker

### retired

- technisch veraltet
- visuell zu schwach
- zu ähnlich zu besseren Varianten
- wiederholt schlechte Nutzer- oder Leistungsbewertung

Eine ausgemusterte Animation wird nicht gelöscht. Sie bleibt für Historie und alte Reels referenzierbar, darf aber nicht neu ausgewählt werden.

## Auswahl für neue Reels

Der Produktionsplaner folgt dieser Reihenfolge:

1. Aussage und Erklärziel verstehen
2. passende Familien bestimmen
3. ungeeignete Familien ausschließen
4. letzte Reels und aktuelle Szenehistorie prüfen
5. mehrere Gesamtchoreografien bewerten
6. besten abwechslungsreichen Plan wählen
7. bei zu niedrigem Wert eine neue Animation fordern
8. Proposal in einen vollständigen Build-Vertrag übersetzen
9. Animation implementieren und rendern
10. Render-Review ins Brain zurückführen
11. Gewichte nur bei wiederholter Evidenz kontrolliert anpassen

## Bibliothekswachstum

Ein neues Konzept wird nur aufgenommen, wenn folgende Felder vollständig sind:

- eindeutige ID
- Familie
- Layoutfamilie
- Bewegungssignatur
- Neuheitsgruppe
- semantische Tags
- Erklärmuster
- Ausschlussfälle
- Grundbausteine
- Übergangs-Tags
- Kamerastil
- Bewegungsrichtung
- Energie
- Dichte
- Komplexität
- empfohlene Dauer
- Startbewertung
- Build-Phasen
- Implementierungsregeln

## Aktuelles Renderziel

```text
18 Prototypen × 7 PNGs = 126 PNG-Dateien
18 Prototypen × 1 MP4 = 18 MP4-Dateien
144/144 technisch gültige Artefakte
```

## Ziel nach den ersten fünf Batches

```text
88 dokumentierte Konzepte
mindestens 24 tatsächlich ausführbare Prototypen
mindestens 22 vertretene visuelle Familien
mindestens 12 visuell verifizierte Animationen
keine exakte Wiederholung innerhalb eines Reels
mindestens 4 visuelle Familien pro Reel
neue Animation bei unzureichender Passung statt erzwungener Vorlage
Brain-Updates nur auf Basis nachvollziehbarer Beobachtungen
```
