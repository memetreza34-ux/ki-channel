# Content-Motion Edge-Case Renders

## Zweck

Die normalen 22 Content-Fixtures prüfen pro registrierter Kernanimation einen produktionsnahen Standardfall. Zusätzlich existieren sechs gezielte Gegenbeispiele für Mechanismen, die bei einer rein positiven Demo leicht unentdeckt falsch bleiben können.

Die Edge-Cases liegen in:

```text
ki/src/animation-library/content-motion-edge-cases.json
```

Der statische Gate liegt in:

```text
scripts/check-content-motion-edge-cases.mjs
```

Der Render-Runner liegt in:

```text
scripts/render-content-motion-edge-cases.mjs
```

## Abgesicherte Gegenbeispiele

### 1. Wissensupdate unter Verifikationsschwelle

`knowledge-update-rejects-low-confidence`

Die neue Information besitzt weniger Vertrauen als `verificationThreshold`. Erwartet wird:

- Prüfung ist sichtbar,
- keine Übernahme in den Baum,
- keine Revisionserhöhung,
- alter Wissensstand bleibt sichtbar aktiv.

### 2. Retrieval mit expliziter Relevanz

`retrieval-respects-explicit-relevance`

Die relevanten Quellen liegen absichtlich nicht an den ersten Positionen. Erwartet wird:

- nur `sourceXRelevant = 1` wird angezogen,
- `sourceXRelevant = 0` wird aussortiert,
- die sichtbare Belegzahl entspricht der tatsächlichen Relevanzmenge.

### 3. Funnel mit explizitem Keep/Drop

`funnel-drops-explicit-noise`

Drei Inputs werden behalten und drei verworfen. Erwartet wird:

- verworfene Inputs verlassen den Ergebnisfluss,
- nur behaltene Inputs erzeugen die Verdichtung,
- das Endergebnis darf nicht so aussehen, als hätten alle sechs Quellen beigetragen.

### 4. Workflow mit echter Rückfallroute

`workflow-shows-explicit-retry-route`

Der Sprechertext beschreibt ausdrücklich einen Fehler und Rücksprung. Erwartet wird:

- `showAlternative = 1` aktiviert die Rückfallroute,
- die Route erklärt den Rücksprung zur Prüfung,
- im normalen Erfolgs-Fixture bleibt diese Route aus.

### 5. Bedeutungsraum mit nicht-positionalen Clustern

`semantic-space-respects-nonpositional-clusters`

Die Begriffe wechseln absichtlich zwischen Cluster 1 und 2. Erwartet wird:

- Clusterbildung folgt `conceptXCluster`,
- nicht der alten Regel „erste drei gegen letzte drei“,
- semantisch gleiche Begriffe landen trotz Eingabereihenfolge gemeinsam.

### 6. Attention mit expliziten Gewichten

`attention-weights-drive-relationship-strength`

Die beiden starken Kanten besitzen 93 % und 71 %, die schwache Direktkante 8 %. Erwartet wird:

- sichtbare Linienbreite folgt den Gewichten,
- Prozentwerte stimmen mit den Props überein,
- 8-%-Direktverbindung wird sichtbar verworfen.

## Statisches Gate

```bash
node scripts/check-content-motion-edge-cases.mjs
```

Der Checker validiert unter anderem:

- genau sechs eindeutige Gegenbeispiele,
- vollständigen Sprechertext und Meaning Contract,
- mindestens einen erforderlichen visuellen Cue,
- jeden expliziten `labels`-/`values`-Key gegen den tatsächlichen TSX-Runtime-Zugriff,
- `confidence < verificationThreshold`,
- gemischte Retrieval-Relevanz,
- gemischtes Funnel-Keep/Drop,
- explizite Retry-Route,
- nicht-positionale Cluster-Zuordnung,
- schwaches Attention-Gewicht unter beiden starken Gewichten.

Das Gate ist Bestandteil von:

```bash
node scripts/verify-content-matched-runtime.mjs
npm run animation-library:verify
```

## Rendern

Alle sechs Fälle nur planen:

```bash
node scripts/render-content-motion-edge-cases.mjs plan
```

Smoke-Frames für alle sechs Fälle:

```bash
node scripts/render-content-motion-edge-cases.mjs smoke
```

Alle Kontrollframes:

```bash
node scripts/render-content-motion-edge-cases.mjs stills
```

Vollständige Videos:

```bash
node scripts/render-content-motion-edge-cases.mjs video
```

Stills und Videos gemeinsam:

```bash
node scripts/render-content-motion-edge-cases.mjs all
```

Nur einen einzelnen Fall rendern:

```bash
node scripts/render-content-motion-edge-cases.mjs all knowledge-update-rejects-low-confidence
```

Ausgabe:

```text
out/content-motion-edge-cases/<case-id>/
```

Zusätzlich entsteht:

```text
out/content-motion-edge-cases/edge-case-render-summary.json
```

Das Summary enthält pro Fall Animation-ID, erwartetes Verhalten, Modus und Ausgabepfad.

## Freigaberegel

Vor dem Merge des Content-Matching-PRs sollen zusätzlich zu den 22 normalen Content-Kompositionen mindestens die sechs Edge-Cases als Smoke/Stills geprüft werden. Für eine vollständige visuelle Freigabe wird empfohlen:

```bash
node scripts/render-content-motion-edge-cases.mjs all
```

Die technische Ausführung ersetzt keine visuelle Kontrolle. Insbesondere muss geprüft werden, ob das erwartete Gegenbeispiel wirklich eindeutig erkennbar ist und kein dekorativer Bewegungsrest die gegenteilige Aussage vermittelt.
