# Production Eligibility for Content-Matched Animations

## Warum es zwei verschiedene Grenzen gibt

Der Animationskatalog enthält mehr technisch ausführbare Varianten als aktuell vollständig content-aware Varianten.

Aktueller Stand:

- **88** Kataloganimationen besitzen eine ausführbare Remotion-Implementierung.
- **22** Kernanimationen besitzen zusätzlich native Content-Objektbindung.
- Nur diese **22** dürfen im content-matched Produktionspfad direkt als bestehende Library-Animation wiederverwendet werden.

Eine technisch renderbare Animation ist damit nicht automatisch für die Content-Produktion freigegeben.

## Produktionsregel

`productionEligibility.ts` bildet die Schnittmenge aus:

```text
EXECUTABLE_ANIMATION_IDS
∩
NATIVE_CONTENT_BOUND_PROTOTYPE_IDS
```

Das Ergebnis ist:

```text
PRODUCTION_READY_LIBRARY_ANIMATION_IDS
```

`planProductionReelAnimations()` filtert den übergebenen Katalog vor der eigentlichen Choreographie auf genau diese IDs.

Der allgemeine Creative-/Choreography-Planner wird bewusst **nicht** global eingeschränkt. Analyse, Katalogpflege und Expansion dürfen weiterhin alle Konzepte und ausführbaren Varianten kennen.

## Verhalten bei nicht freigegebenen Varianten

### Nicht registrierter Katalogeintrag

Ein Entry, dessen `animationId` nicht ausführbar registriert ist, darf niemals als `source: "library"` in einem Produktionsplan erscheinen.

### Ausführbar, aber nur Semantic Shell

Auch eine ausführbare Remotion-Variante wird nicht direkt wiederverwendet, wenn sie keine native Content-Objektbindung besitzt.

### Kein freigegebener Kandidat übrig

Wenn nach dem Produktionsfilter kein passender wiederverwendbarer Kandidat bleibt, erzeugt der Content-first Planner ein `NewAnimationProposal`.

Die Szene wird dann:

```text
source: new-build
```

und bleibt bis zur echten Implementierung/Registrierung blockiert.

## Relevante Dateien

```text
ki/src/animation-library/executionCatalog.ts
ki/src/animation-library/prototypeContentCoverage.ts
ki/src/animation-library/productionEligibility.ts
ki/src/animation-library/productionPlanner.ts
```

Regressionstests:

```text
ki/src/animation-library/__tests__/productionPlanner.test.ts
ki/src/animation-library/__tests__/productionExecutableGuard.test.ts
ki/src/animation-library/__tests__/reelPlanningPipeline.test.ts
```

## Abgesicherte Fälle

Die Tests prüfen unter anderem:

1. Die Produktionsmenge enthält aktuell exakt 22 Animationen.
2. Jede dieser IDs ist technisch ausführbar.
3. Jede dieser IDs besitzt native Content-Objektbindung.
4. Ein absichtlich hoch bewerteter, aber nicht registrierter Fake-Entry wird nicht wiederverwendet.
5. Wenn ausschließlich nicht registrierte Entries übergeben werden, entsteht ein `new-build`.
6. Eine technisch ausführbare, aber nur `semantic-shell-only` gebundene Variante wird ebenfalls nicht wiederverwendet.
7. Derselbe Schutz gilt im öffentlichen Sprechertext→Reel-Planungspfad.

## Ausbau auf mehr als 22 direkte Reuse-Varianten

Weitere der 88 ausführbaren Varianten können später in die Produktionsmenge aufgenommen werden, sobald sie denselben Vertrag erfüllen wie die 22 Kernprototypen:

- native sichtbare Objektbindung an `PrototypeContentContext`,
- echte prototypspezifische `labels`-/`values`-Nutzung,
- semantische Bewegungslogik,
- Content-Fixture,
- Runtime-Key-Gate,
- visuelle Renderprüfung.

Erst danach sollte ihre ID in `NATIVE_CONTENT_BOUND_PROTOTYPE_IDS` aufgenommen werden. Die Produktionsmenge erweitert sich dann automatisch über die Schnittmenge.
