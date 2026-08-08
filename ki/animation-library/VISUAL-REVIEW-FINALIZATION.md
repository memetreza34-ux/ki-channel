# Visual Review Finalization

## Warum dieser Schritt existiert

Ein technisch erfolgreicher Remotion-Release beweist, dass Dateien erzeugt und ihre Runtime-Daten korrekt verdrahtet wurden. Er beweist nicht automatisch, dass ein Mensch die 22 Production-Kompositionen und sechs semantischen Edge Cases visuell geprüft hat.

Die manuelle Sichtprüfung besitzt deshalb einen eigenen, an die konkrete Rendergeneration gebundenen Nachweis.

## 1. Technischen Full-Release erzeugen

```bash
node scripts/run-content-release.mjs full
```

Der technische Report liegt danach unter:

```text
out/content-release-run/full-summary.json
```

Ein grüner Report ist an den aktuellen Git-HEAD gebunden. Prüfen lässt er sich separat mit:

```bash
node scripts/verify-content-release-summary.mjs full
```

Ein Report eines früheren Commits wird abgelehnt.

## 2. Review-Galerie öffnen

```text
out/content-review-gallery/index.html
```

Die Full-Galerie enthält:

- 22 Production-Kompositionen,
- 6 Edge Cases,
- 7 Kontrollframes pro Karte,
- 28 vollständige Videos,
- Sprechertext,
- Meaning Contract,
- bei Edge Cases das erwartete Verhalten.

Jede Galerie besitzt eine `reviewId`. Sie wird aus der konkreten Masterplan-/Edge-Rendergeneration und deren Source-Fingerprint abgeleitet. Eine neue Rendergeneration erzeugt damit einen anderen Nachweiskontext.

## 3. Pro Karte sechs Entscheidungen treffen

Für jede der 28 Karten müssen bestätigt werden:

1. `approved` — Karte tatsächlich visuell geprüft,
2. `contentCorrect` — Sprecherinhalt visuell korrekt,
3. `noDemoDebug` — keine Demo-/Debug-Texte,
4. `noFakePrecision` — keine unbelegten exakten Zahlen,
5. `stateChangeClear` — Start → Veränderung → Ergebnis verständlich,
6. `endHoldClear` — End-Hold lesbar und ohne Überlappung.

Zusätzlich kann pro Karte eine Review-Notiz hinterlegt werden.

Die Browser-Galerie speichert den Fortschritt lokal unter der jeweiligen Review-ID. Ein neuer Release erbt deshalb nicht einfach die Häkchen einer alten Rendergeneration.

## 4. Review-Nachweis exportieren

In der Galerie:

```text
Review JSON exportieren
```

Die erzeugte Datei heißt:

```text
visual-review.json
```

Sie danach nach folgendem Pfad legen:

```text
out/content-review-gallery/visual-review.json
```

Der Export enthält:

- `reviewId`,
- `reviewedAt`,
- 28 Karten,
- Composition-/Frame-/Video-Metadaten,
- alle manuellen Entscheidungen,
- optionale Notizen.

## 5. Manuellen Nachweis technisch prüfen

```bash
node scripts/verify-content-visual-review.mjs
```

Der Verifier schlägt unter anderem fehl bei:

- falscher oder alter Review-ID,
- Smoke- statt Full-Galerie,
- weniger als 28 Videos,
- weniger als 28 Karten,
- doppelten/fehlenden Karten,
- abweichender Composition-/Frame-/Video-Metadaten,
- `approved !== true`,
- einem einzigen nicht bestätigten Pflichtcheck,
- Review-Zeitpunkt vor der aktuellen Galerie-Generation.

## 6. Gesamten Release finalisieren

Wenn technischer Full-Release und manueller Review-Nachweis vorhanden sind:

```bash
node scripts/finalize-content-release.mjs
```

Der Finalizer prüft in fester Reihenfolge:

```text
1. verify-content-release-summary.mjs full
2. verify-content-review-gallery.mjs full
3. verify-content-visual-review.mjs
```

Nur wenn alle drei Schritte grün sind, wird geschrieben:

```text
out/content-release-run/finalization.json
```

Ein erfolgreicher Finalisierungsnachweis enthält unter anderem:

- `status: passed`,
- aktuellen `gitHead`,
- exakte `reviewId`,
- Zeitpunkt des technischen Full-Runs,
- Zeitpunkt der manuellen Review,
- Zeitpunkt der Finalisierung,
- `manualVisualReviewVerified: true`,
- drei bestandene Finalizer-Schritte.

## 7. Was nicht als Freigabe zählt

Nicht ausreichend sind:

- nur `animation-library:verify`,
- nur ein Smoke-Render,
- nur vorhandene MP4-/PNG-Dateien,
- nur Häkchen im Browser ohne exportierten Nachweis,
- ein `visual-review.json` einer anderen Review-ID,
- ein Full-Summary eines älteren Git-HEADs,
- ein technisch grüner Full-Run ohne manuelle 28/28 Sichtprüfung.

## 8. Merge-Regel

Für den aktuellen 22er Production-Scope gilt als endgültiger Abschluss:

```text
run-content-release full
+ 28/28 manuelle Review-Entscheidungen
+ finalize-content-release
= Release technisch und manuell nachgewiesen
```

Die 66 weiteren Experimental-/Advanced-/Final-Varianten gehören nicht in diesen aktuellen 22er Release-Scope. Ihre spätere Freigabe folgt separat `CONTENT-VARIANT-PROMOTION.md`.
