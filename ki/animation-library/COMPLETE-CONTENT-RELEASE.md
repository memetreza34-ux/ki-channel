# Complete Content Release

## Ziel

Eine Animation gilt erst dann als vollständig freigegeben, wenn nicht nur der generische Remotion-Prototyp funktioniert, sondern auch der echte Content-Produktionspfad mit prototypspezifisch abgeleiteten, bereinigten und dem richtigen sichtbaren Objekt zugeordneten Sprechertext-Daten geprüft wurde.

## 1. Fokussierte technische Prüfung

```bash
node scripts/verify-content-matched-runtime.mjs
npm run animation-library:verify
```

Diese Prüfungen decken unter anderem ab:

- Content-first Auswahl,
- Production Eligibility,
- ausführbares 88er Manifest,
- Registry-Alignment,
- 22 native Content-Bindings,
- 22 Runtime-Content-Deriver,
- Sanitizer und finale Objekt-Association,
- Diagnostics / Lifecycle / Masterplan,
- finale Runtime-Key-Gates,
- kanonische Release-Topologie,
- semantische Edge-Case-Verträge,
- Remotion-Renderaufträge im Plan-Modus.

## 2. Kanonischer vollständiger Renderlauf

```bash
node scripts/render-all-content-release.mjs
```

Der Runner erzeugt nacheinander:

1. die bestehende vollständige Animationsbibliothek-Matrix,
2. 22/22 Masterplan-Content-Renders über die echte Grounding-Kette,
3. die sechs semantischen Edge-Case-Renders.

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
- statische Edge-Case-Verträge,
- finale Runtime-Keys gegen tatsächlich konsumierte TSX-Keys.

## 4. Masterplan-Content isoliert prüfen

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

## 5. Kompatibilitätsbefehle

Die älteren Befehle bleiben nur erhalten, damit bestehende Aufrufe nicht brechen:

```bash
node scripts/render-complete-content-release.mjs
node scripts/verify-complete-content-release.mjs
```

Beide delegieren vollständig an die kanonischen `all-content`-Befehle. Sie dürfen nicht wieder auf einen Deriver-only-Pfad zurückgestellt werden. `check-canonical-content-release-paths.mjs` erzwingt diese Release-Topologie statisch.

## 6. Production-Derived-Diagnostik ist keine Freigabe

`render-production-derived-content.mjs` und `verify-production-derived-content.mjs` bleiben als niedrigere Diagnoseebene erhalten. Sie prüfen bewusst nur die direkte Derivation und können bei der Fehlersuche nützlich sein.

Sie sind **kein Release-Gate** und dürfen nicht als Beweis für Produktionsreife verwendet werden, weil dort Sanitizer, finale Association und der exakte Masterplan-Payload-Pfad nicht die Freigabegrundlage bilden.

## 7. Manuelle visuelle Freigabe bleibt Pflicht

Technisch gültige Dateien beweisen nicht automatisch, dass eine Erklärung visuell richtig verstanden wird.

Deshalb nach dem vollständigen Renderlauf manuell prüfen:

### 22 Masterplan-Content-Kompositionen

Für jede Animation mindestens:

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

## 8. Releaseentscheidung

Der Draft-PR darf erst freigegeben werden, wenn:

```text
verify-content-matched-runtime
+ animation-library:verify
+ render-all-content-release
+ verify-all-content-release
+ manuelle 22er Content-Prüfung
+ manuelle 6er Edge-Case-Prüfung
= bestanden
```

Bis dahin bleibt der PR Draft.
