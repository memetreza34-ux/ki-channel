# Creative-Brain-Wissensverwaltung

## Ziel

Neue Informationen sollen das Creative Brain verbessern, ohne ältere verlässliche Regeln durch schwache oder veraltete Behauptungen zu überschreiben.

Der zentrale Code liegt in:

```text
ki/src/animation-library/knowledgeGovernance.ts
```

## Eingabevertrag

Jede neue Information benötigt:

- eindeutige `observationId`
- stabilen `factKey`
- neuen Wert
- Vertrauen von 0 bis 1
- konkrete Quelle
- Beobachtungszeitpunkt
- nachvollziehbare Notiz

Eine Information ohne Quelle, Zeitstempel, Vertrauen oder Erklärung wird abgelehnt.

## Entscheidungslogik

### Neuer Fakt

Existiert der `factKey` noch nicht, wird der Fakt übernommen und als Beobachtung gespeichert.

### Neuerer und ausreichend verlässlicher Fakt

Eine neuere Information ersetzt den aktuellen Fakt nur, wenn ihre Vertrauenswürdigkeit mindestens 85 Prozent des bisherigen Vertrauens erreicht.

Beispiel:

```text
bisher: 0,90 Vertrauen
Minimum für Ersatz: 0,765
neu: 0,82 → darf übernehmen
```

### Ältere Information

Ein älterer Fakt überschreibt niemals eine neuere aktive Information. Er wird trotzdem im Beobachtungsverlauf gespeichert.

### Zu schwache neue Information

Eine neuere, aber deutlich schwächere Behauptung bleibt im Verlauf sichtbar, ersetzt den aktuellen Fakt jedoch nicht.

Beispiel:

```text
bisher: 0,95 Vertrauen
neu: 0,40 Vertrauen
→ Beobachtung speichern
→ aktiven Fakt nicht ändern
```

### Doppelte Beobachtung

Eine bereits bekannte `observationId` wird idempotent übersprungen. Revision und Wissen ändern sich nicht erneut.

## Transparenter Bericht

`applyKnowledgeCandidates()` liefert für jede Information:

- Status `adopted`
- Status `recorded-not-adopted`
- Status `duplicate-observation`
- Entscheidungsgrund
- vorherigen aktiven Fakt
- danach aktiven Fakt

Zusätzlich werden Gesamtzahlen für übernommene, nur gespeicherte und doppelte Informationen ausgegeben.

## Entscheidungsgründe

```text
new-fact
newer-and-trusted
older-than-current
confidence-too-low
duplicate-observation
```

## Warum schwache Informationen trotzdem gespeichert werden

Ein einzelner schwacher Hinweis soll keine Produktionsregel verändern. Mehrere ähnliche Beobachtungen können später jedoch ein Muster bilden und über die Lern- oder Tuning-Pipeline eine kontrollierte Anpassung auslösen.

Dadurch bleibt das Brain lernfähig, ohne auf jede neue Aussage überzureagieren.

## Beispiele für Fakten

- maximale Untertitelzeilen auf Mobilgeräten
- Mindestdauer des finalen Halteframes
- Standardübergang für ruhige Erklärszenen
- maximal erlaubte Kartenlayouts pro Reel
- bevorzugte Energiekurve bei Risikoerklärungen
- bestätigte Rendergrenzen bestimmter Remotion-Primitives
- Qualitätsregeln aus wiederholtem Nutzerfeedback

## Tests

```text
ki/src/animation-library/__tests__/knowledgeGovernance.test.ts
```

Geprüft werden:

- Aufnahme eines neuen Fakts
- Übernahme einer stärkeren neueren Revision
- Ablehnung eines älteren Fakts
- Ablehnung einer zu schwachen neueren Behauptung
- Speicherung nicht übernommener Beobachtungen
- idempotente doppelte Observation-IDs
- ungültige Vertrauenswerte und Zeitstempel

## Status

Die Wissensverwaltung ist als Code und Testvertrag vorhanden. Sie wurde in dieser Umgebung noch nicht tatsächlich ausgeführt. Deshalb gelten TypeScript- und Teststatus weiterhin als unbestätigt.
