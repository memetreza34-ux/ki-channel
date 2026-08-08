# Erster echter Content-Grounding-Test

Der erste Testpfad ist bewusst in Stufen aufgebaut: zuerst Production-Eingaben, danach die echte Runtime-Grounding-Kette und erst danach visuelles Rendering.

## Test 0 — Production-Input-Test

```bash
node scripts/check-masterplan-production-inputs.mjs
```

Prüft ohne npm, Vitest oder Remotion:

- exakt 22 Production-Fixtures
- exakt dieselben 22 IDs wie `prototype-render-config.json`
- Production-Fixtures enthalten ausschließlich `animationId` + `spokenText`
- keine direkten Runtime-`labels` oder `values`
- Kosten `94 Cent -> 28 Cent` sind gesprochen
- Probability `66 Prozent` ist gesprochen
- Latenz `780/340 Millisekunden` ist gesprochen
- Ranking-Gewinner und Benchmark-Gewinner sind gesprochen

**Status:** Dieser Test wurde gegen den aktuellen Teststand tatsächlich mit Node ausgeführt und ist grün.

## Test 1 — vollständiger Grounding-Plan

```bash
node scripts/run-first-content-grounding-test.mjs
```

Standardfall:

```text
cost-efficiency-budget-leak-meter-v1
```

Sprechertext:

```text
Drei unnötige Prozessschritte treiben die Kosten zunächst auf 94 Cent;
eine konkrete Optimierung senkt sie anschließend auf 28 Cent.
```

Der Runner führt die echte Runtime-Kette aus:

```text
spokenText
-> enhanceSceneMeaning()
-> derivePrototypeRuntimeContent()
-> sanitizePrototypeRuntimeContent()
-> associatePrototypeRuntimeContent()
-> createPrototypeRenderProps()
-> render-content-matched-prototype.mjs plan
```

Pflichtassertionen:

- Meaning enthält `cost-efficiency`
- `measurementExact = 1`
- `initialCost = 94`
- `optimizedCost = 28`
- prototypspezifische Runtime-Keys wurden erzeugt
- normalisierte Render-Props bleiben unverändert
- `render-request.json` besitzt `mode = plan`
- Composition-ID stimmt mit `prototype-render-config.json` überein

Ergebnisordner:

```text
out/first-content-grounding-test/cost-efficiency-budget-leak-meter-v1/
```

Dort entstehen:

- `grounded-props.json`
- `render-props.json`
- `render-request.json`
- `test-summary.json`

**Status:** Der Test-1-Runner wurde tatsächlich mit Node auf Syntax geprüft. `check-first-content-grounding-test-contract.mjs` wurde ebenfalls tatsächlich ausgeführt und ist grün. Die vollständige Grounding-Ausführung benötigt einen vollständigen Repo-Checkout mit den Runtime-Quelldateien.

## Test 1B — Latenz-Grounding

```bash
node scripts/run-first-content-grounding-test.mjs scale-performance-latency-tunnel-race-v1
```

Zusätzliche Pflichtassertionen:

- Meaning enthält `scale-performance`
- `measurementExact = 1`
- `slowLatency = 780`
- `fastLatency = 340`

## Test 2 — erster visueller Smoke-Test

Erst wenn Test 0 und Test 1 grün sind:

```bash
node scripts/run-content-release.mjs smoke
```

Smoke rendert die 22 Production-Kompositionen und die sechs semantischen Edge Cases mit Kontrollframes und erzeugt die Review-Galerie.

## Full Release

```bash
node scripts/run-content-release.mjs full
```

Ein technischer Full-Run allein ist noch keine visuelle Freigabe. Die 22 Production-Kompositionen plus sechs Edge Cases müssen anschließend über die generationsgebundene Review-Galerie geprüft und mit `finalize-content-release.mjs` finalisiert werden.
