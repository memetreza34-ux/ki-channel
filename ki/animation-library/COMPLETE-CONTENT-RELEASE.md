# Complete Content Release

## Ziel

Eine Animation gilt erst dann als vollständig freigegeben, wenn nicht nur der generische Remotion-Prototyp funktioniert, sondern auch der echte Content-Produktionspfad mit prototypspezifisch abgeleiteten Sprechertext-Daten geprüft wurde.

## 1. Fokussierte technische Prüfung

```bash
node scripts/verify-content-matched-runtime.mjs
```

Dieser Pfad prüft unter anderem:

- Content-first Auswahl,
- Production Eligibility,
- ausführbares 88er Manifest,
- Registry-Alignment,
- 22 native Content-Bindings,
- 22 Runtime-Content-Deriver,
- Diagnostics / Lifecycle / Masterplan,
- Runtime-Key-Gates,
- semantische Edge-Case-Verträge,
- Remotion-Renderauftrag im Plan-Modus.

## 2. Kanonischer vollständiger Renderlauf

```bash
node scripts/render-all-content-release.mjs
```

Der Runner erzeugt nacheinander:

1. die bestehende vollständige Animationsbibliothek-Matrix,
2. 22/22 Masterplan-Content-Renders mit dem echten Runtime-Deriver und dem echten `createPrototypeRenderProps()`,
3. die sechs semantischen Edge-Case-Renders.

## 3. Kanonische technische Releaseprüfung

```bash
node scripts/verify-all-content-release.mjs
```

Dabei werden geprüft:

- bestehender vollständiger Animationsbibliothek-Releasevertrag,
- 22/22 Masterplan-Content-Artefakte,
- aktueller Source-Fingerprint,
- frische Re-Derivation aller Runtime-Labels/-Werte,
- erneuter Aufruf des echten `createPrototypeRenderProps()`,
- gespeicherte vs. erwartete Render-Props,
- Animation-/Composition-IDs der Render-Requests,
- Kontroll-PNGs anhand der PNG-Signatur,
- Content-MP4s anhand des MP4-Headers,
- statische Edge-Case-Verträge,
- abgeleitete Runtime-Keys gegen tatsächlich konsumierte TSX-Keys.

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

Dieser Pfad entspricht der echten Datenkette:

```text
Sprechertext
→ Meaning Contract
→ Prototype Runtime Content Deriver
→ createPrototypeRenderProps()
→ render-content-matched-prototype.mjs
→ Remotion Composition
```

## 5. Manuelle visuelle Freigabe bleibt Pflicht

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

## 6. Releaseentscheidung

Der Draft-PR darf erst freigegeben werden, wenn:

```text
verify-content-matched-runtime
+ render-all-content-release
+ verify-all-content-release
+ manuelle 22er Content-Prüfung
+ manuelle 6er Edge-Case-Prüfung
= bestanden
```

Bis dahin bleibt der PR Draft.

## Hinweis zu älteren Production-Derived-Skripten

`render-production-derived-content.mjs` und `verify-production-derived-content.mjs` bleiben als zusätzliche niedrigere Deriver-Prüfung erhalten.

Für die endgültige Releaseentscheidung ist der neuere Masterplan-Pfad maßgeblich, weil er zusätzlich denselben `createPrototypeRenderProps()` wie `ChannelReelMasterPlan` verwendet.
