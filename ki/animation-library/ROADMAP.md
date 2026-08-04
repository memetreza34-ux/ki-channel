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
| ausführbare Remotion-Prototypen | 6 | Code vorhanden, nicht gerendert |
| Planer | 1 | Code vorhanden, nicht ausgeführt geprüft |
| Creative Brain | 1 | Code vorhanden, nicht ausgeführt geprüft |

## Batch 1 – aktuelle sechs Prototypen prüfen

Vor weiteren Komponenten werden diese sechs Animationen gerendert und visuell bewertet:

1. Knowledge Magnet
2. Budget Leak Meter
3. Context Window Train
4. Decision Tree Burst
5. Human AI Relay
6. Knowledge Tree Graft

### Freigabekriterien je Prototyp

- sieben Prüfframes ohne Überlauf
- vollständiges MP4 ohne leere oder eingefrorene Abschnitte
- klare Bedeutung ohne Ton
- keine Hauptanimation gleicht einem anderen Prototyp
- mobile Lesbarkeit
- keine rein dekorative Dauerbewegung
- Anfang, Wendepunkt und Abschluss sind sichtbar choreografiert
- mindestens ein sinnvoller Ein- und Ausgang für Übergänge

## Batch 2 – sechs stark benötigte KI-Erkläranimationen

Nach Batch 1 werden priorisiert:

1. `probability-probability-fluid-columns-v1`
2. `model-processing-residual-river-v1`
3. `generation-answer-loom-v1`
4. `risk-contrast-confidence-glass-crack-v1`
5. `relationship-network-dependency-bridge-builder-v1`
6. `semantic-space-meaning-terrain-v1`

Diese sechs decken typische KI-Reel-Sätze ab, ohne die Animationen des ersten Referenz-Reels zu kopieren.

## Batch 3 – Alltag, Business und Technik

1. Latency Tunnel Race
2. Load Balancing City
3. Token Cost Conveyor
4. Automation Conveyor Cells
5. Source Checkpoint Gates
6. Version Evolution Tree

## Batch 4 – besondere Metaphern

1. Hallucination Mirage
2. Evidence Jury
3. Predictive Type Orchestra
4. Context Thread Braider
5. Confidence Weather Map
6. Tradeoff Landscape Route

Diese Animationen besitzen höhere Komplexität. Sie werden erst gebaut, wenn die einfacheren Prototypen ein stabiles Komponentenfundament geliefert haben.

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

### retired

- technisch veraltet
- visuell zu schwach
- zu ähnlich zu besseren Varianten
- wiederholt schlechte Nutzer- oder Leistungsbewertung

Eine ausgemusterte Animation wird nicht gelöscht. Sie bleibt für Historie und alte Reels referenzierbar, darf aber nicht neu ausgewählt werden.

## Auswahl für neue Reels

Der Planer folgt dieser Reihenfolge:

1. Aussage und Erklärziel verstehen
2. passende Familien bestimmen
3. ungeeignete Familien ausschließen
4. letzte Reels und aktuelle Szenehistorie prüfen
5. mehrere Gesamtchoreografien bewerten
6. besten abwechslungsreichen Plan wählen
7. bei zu niedrigem Wert eine neue Animation fordern

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

## Ziel nach den ersten vier Batches

```text
88 dokumentierte Konzepte
24 tatsächlich ausführbare Prototypen
mindestens 12 visuell verifizierte Animationen
keine exakte Wiederholung innerhalb eines Reels
mindestens 4 visuelle Familien pro Reel
neue Animation bei unzureichender Passung statt erzwungener Vorlage
```
