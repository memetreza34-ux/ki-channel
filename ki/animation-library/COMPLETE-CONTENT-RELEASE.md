# Complete Content Release

## Ziel

Eine Animation gilt erst dann als vollständig freigegeben, wenn nicht nur der generische Remotion-Prototyp funktioniert, sondern auch der echte Content-Produktionspfad mit prototypspezifisch abgeleiteten, bereinigten und dem richtigen sichtbaren Objekt zugeordneten Sprechertext-Daten geprüft wurde.

## 0. Ein-Befehl-Runner

Für den normalen Abschluss gibt es jetzt einen zentralen Runner:

```bash
node scripts/run-content-release.mjs verify
node scripts/run-content-release.mjs smoke
node scripts/run-content-release.mjs full
```

### `verify`

Führt nacheinander aus:

1. `verify-content-matched-runtime.mjs`,
2. `npm run animation-library:verify`.

### `smoke`

Führt zuerst alle Verify-Gates aus und erzeugt danach:

- 22 Production-Smoke-Sets,
- 6 Edge-Case-Smoke-Sets,
- technische Artefaktprüfung,
- 22+6 Smoke-Review-Galerie,
- Stale-Artefaktprüfung.

### `full`

Führt zuerst alle Verify-Gates aus und danach:

1. `render-all-content-release.mjs`,
2. `verify-all-content-release.mjs`.

Nur wenn jeder Child-Prozess erfolgreich endet, erhält der Run den Status `passed`. Der aktuelle Lauf schreibt **vor dem ersten Child-Prozess** bereits `status: running`; dadurch kann ein alter erfolgreicher Report nicht während eines neuen oder abgebrochenen Laufs wie ein aktueller Erfolg aussehen. Bei `running` bleibt `completedAt` bewusst `null`.

Die maschinenlesbaren Reports liegen unter:

```text
out/content-release-run/verify-summary.json
out/content-release-run/smoke-summary.json
out/content-release-run/full-summary.json
```

Bei einem Fehler enthält der Report `status: failed`, die Fehlermeldung und die bereits ausgeführten Schritte. Ein Full-Report mit `passed` ersetzt trotzdem **nicht** die manuelle visuelle Freigabe.

## 1. Fokussierte technische Prüfung

```bash
node scripts/verify-content-matched-runtime.mjs
npm run animation-library:verify
```

Diese Prüfungen decken unter anderem ab:

- Content-first Auswahl,
- Production Eligibility,
- ausführbares 88er Manifest,
- 22+66-Partition des ausführbaren Katalogs,
- sichere Promotion-Gates der 66 Zusatzvarianten,
- Registry-Alignment,
- 22 native Content-Bindings,
- 22 Runtime-Content-Deriver,
- Sanitizer und finale Objekt-Association,
- Diagnostics / Lifecycle / Masterplan,
- finale Runtime-Key-Gates,
- kanonische Release-Topologie,
- semantische Edge-Case-Verträge,
- Syntax der Release-/Review-Skripte,
- Remotion-Renderaufträge im Plan-Modus.

Die 66 Experimental-/Advanced-/Final-Varianten sind kein Blocker für den aktuellen 22er Production-Release. Ihr separater Promotionsvertrag steht in `CONTENT-VARIANT-PROMOTION.md`.

## 2. Kanonischer vollständiger Renderlauf

```bash
node scripts/render-all-content-release.mjs
```

Der Runner erzeugt nacheinander:

1. die bestehende vollständige Animationsbibliothek-Matrix,
2. 22/22 Masterplan-Content-Renders über die echte Grounding-Kette,
3. die sechs semantischen Edge-Case-Renders,
4. `out/content-review-gallery/index.html` als zentrale visuelle Review-Oberfläche.

Die Masterplan-Renders werden nicht nur aus dem rohen Deriver erzeugt. Es gilt verbindlich:

```text
Sprechertext
→ Meaning Contract
→ derivePrototypeRuntimeContent()
→ sanitizePrototypeRuntimeContent()
→ associatePrototypeRuntimeContent()
→ createPrototypeRenderProps()
→ render-content-matched-prototype.mjs
→ Remotion Composition
```

Vor jedem Masterplan- und Edge-Case-Render wird der jeweilige Fallordner gelöscht und neu angelegt. Dadurch kann ein Smoke-Lauf keine PNGs oder MP4s aus einem älteren Full-Lauf erben.

## 3. Kanonische technische Releaseprüfung

```bash
node scripts/verify-all-content-release.mjs
```

Dabei werden geprüft:

- bestehender vollständiger Animationsbibliothek-Releasevertrag,
- 22/22 Masterplan-Content-Artefakte,
- aktueller Source-Fingerprint einschließlich Deriver, Sanitizer, Association und Loader,
- frische Re-Derivation, Bereinigung und Objekt-Zuordnung aller Runtime-Labels/-Werte,
- erneuter Aufruf des echten `createPrototypeRenderProps()`,
- gespeicherte vs. erwartete Render-Props,
- Animation-/Composition-IDs der Render-Requests,
- Kontroll-PNGs anhand der PNG-Signatur,
- Content-MP4s anhand des MP4-Headers,
- sechs Edge Cases mit exakter Frame-Menge, PNG-Signatur, MP4-Header, Props und Render-Request,
- statische Edge-Case-Verträge,
- finale Runtime-Keys gegen tatsächlich konsumierte TSX-Keys,
- vollständige 22+6 Full-Review-Galerie.

## 4. Smoke-Review vs. Full-Review

Smoke und Full sind bewusst getrennte Verträge.

### Smoke

```bash
node scripts/render-masterplan-content-release.mjs smoke
node scripts/verify-masterplan-content-release.mjs
node scripts/render-content-motion-edge-cases.mjs smoke
node scripts/verify-content-motion-edge-case-renders.mjs smoke
node scripts/build-content-review-gallery.mjs
node scripts/verify-content-review-gallery.mjs smoke
```

Bei der aktuellen Render-Config bedeutet Smoke:

- 22 Production-Kompositionen × 3 Kontrollframes,
- 6 Edge Cases × 3 Kontrollframes,
- insgesamt 84 Review-Frames,
- keine Videos.

Der Smoke-Verifier schlägt fehl, wenn trotzdem ein MP4 vorhanden ist. Das schützt vor Stale-Artefakten aus einem älteren Full-Run.

### Full

```bash
node scripts/render-all-content-release.mjs
node scripts/verify-all-content-release.mjs
```

Bei der aktuellen Render-Config bedeutet Full für die 22+6 Content-Review-Schicht:

- 28 Karten × 7 Kontrollframes = 196 Frames,
- 28 Videos,
- Masterplan-Manifest muss `mode=all` haben,
- Edge-Case-Summary muss `mode=all` haben.

`verify-content-review-gallery.mjs full` prüft diese Mengen explizit.

## 5. Masterplan-Content isoliert prüfen

Schneller Plan-Test für alle 22 Kernanimationen:

```bash
node scripts/render-masterplan-content-release.mjs plan
node scripts/verify-masterplan-content-release.mjs
```

Vollständige Masterplan-Content-Freigabe:

```bash
node scripts/render-masterplan-content-release.mjs all
node scripts/verify-masterplan-content-release.mjs --complete
```

Dieser Pfad ist die Referenz für die produktive Datenkette. Ein Skript, das nur `derivePrototypeRuntimeContent()` aufruft, ist kein vollständiger Produktionsrelease.

## 6. GitHub Actions

`.github/workflows/motion-system-checks.yml` bleibt bewusst `workflow_dispatch`-basiert.

GitHub Actions pflegt keinen eigenen Content-Release-Ablauf mehr. Der Workflow bietet denselben Parameter wie lokal:

```text
release_mode = verify | smoke | full
```

Nach Dependency-Installation und dem separaten Legacy-Motion-Check ruft CI ausschließlich auf:

```bash
node scripts/run-content-release.mjs "${{ inputs.release_mode }}"
```

Damit sind lokaler Abschluss und CI für den Content-Pfad identisch. `check-canonical-content-release-paths.mjs` verbietet direkte Kopien der Masterplan-/Edge-/Review-/Full-Release-Befehle im Workflow und erzwingt die Nutzung des Unified Runners.

Am 8. August 2026 wurde ein minimaler branch-spezifischer Probe-Workflow ausgeführt. GitHub beendete den Job vor Step 1 mit `runner_id=0` und einer leeren Step-Liste. Die Check-Annotation nennt die konkrete Ursache:

```text
The job was not started because recent account payments have failed or your spending limit needs to be increased.
Please check the 'Billing & plans' section in your settings.
```

Der Probe-Workflow wurde danach wieder entfernt. Bis Billing/Spending-Limit korrigiert ist, darf dieser Actions-Fehler nicht als Code-Testfehler interpretiert werden.

## 7. Kompatibilitätsbefehle

Die älteren Befehle bleiben nur erhalten, damit bestehende Aufrufe nicht brechen:

```bash
node scripts/render-complete-content-release.mjs
node scripts/verify-complete-content-release.mjs
```

Beide delegieren vollständig an die kanonischen `all-content`-Befehle. Sie dürfen nicht wieder auf einen Deriver-only-Pfad zurückgestellt werden. `check-canonical-content-release-paths.mjs` erzwingt diese Release-Topologie statisch.

## 8. Production-Derived-Diagnostik ist keine Freigabe

`render-production-derived-content.mjs` und `verify-production-derived-content.mjs` bleiben als niedrigere Diagnoseebene erhalten. Sie prüfen bewusst nur die direkte Derivation und können bei der Fehlersuche nützlich sein.

Sie sind **kein Release-Gate** und dürfen nicht als Beweis für Produktionsreife verwendet werden, weil dort Sanitizer, finale Association und der exakte Masterplan-Payload-Pfad nicht die Freigabegrundlage bilden.

## 9. Manuelle visuelle Freigabe bleibt Pflicht

Technisch gültige Dateien beweisen nicht automatisch, dass eine Erklärung visuell richtig verstanden wird.

Nach dem vollständigen Renderlauf öffnen:

```text
out/content-review-gallery/index.html
```

### 22 Masterplan-Content-Kompositionen

Für jede Animation mindestens prüfen:

- Startzustand,
- zentraler Erklärmoment,
- Ergebniszustand,
- finaler Hold,
- vollständiges Video.

Prüffragen:

- Entspricht die dominante Bewegung wirklich dem Sprechertext?
- Sind Subjekt, Aktion und Ergebnis sichtbar nachvollziehbar?
- Werden explizite Zahlen/Relationen korrekt dargestellt?
- Bleiben Zahlen am richtigen Kandidaten, Pfad oder Messobjekt?
- Widersprechen sichtbarer Sieger, Summary-Text und Messwerte einander nirgends?
- Gibt es keine Demo-Daten oder falsche Default-Begriffe mehr?
- Würde ein völlig anderer Sprechertext dieselbe Animation unverändert verwenden können? Falls ja, ist sie zu generisch.

### Sechs Edge Cases

Zusätzlich die dokumentierten Gegenbedingungen prüfen:

1. Confidence unter Threshold ersetzt Wissen nicht.
2. Retrieval folgt expliziter Relevanz statt Position.
3. Funnel lässt verworfene Inputs nicht ins Ergebnis.
4. Retry-Route erscheint nur beim echten Fehler-/Retry-Inhalt.
5. Semantic Space folgt Cluster-Daten statt Arrayposition.
6. Relationship-Linienstärken folgen den übergebenen Gewichten.

## 10. Releaseentscheidung

Der Draft-PR darf erst freigegeben werden, wenn entweder der Ein-Befehl-Full-Runner erfolgreich war:

```bash
node scripts/run-content-release.mjs full
```

oder die äquivalenten Einzelschritte vollständig grün waren:

```text
verify-content-matched-runtime
+ animation-library:verify
+ render-all-content-release
+ verify-all-content-release
+ manuelle 22er Content-Prüfung
+ manuelle 6er Edge-Case-Prüfung
= bestanden
```

Auch nach einem technisch grünen `full` bleibt die manuelle 22+6 Sichtprüfung Pflicht. Bis dahin bleibt der PR Draft.
