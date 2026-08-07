# Production Eligibility for Content-Matched Animations

## Warum es zwei verschiedene Grenzen gibt

Der Animationskatalog enthält mehr technisch ausführbare Varianten als aktuell vollständig content-aware Varianten.

Aktueller Stand:

- **88** Kataloganimationen besitzen eine ausführbare Remotion-Implementierung.
- **22** Kernanimationen besitzen zusätzlich native Content-Objektbindung.
- Nur diese **22** dürfen im content-matched Produktionspfad direkt als bestehende Library-Animation wiederverwendet werden.

Eine technisch renderbare Animation ist damit nicht automatisch für die Content-Produktion freigegeben.

## Produktionsregel

`productionEligibility.ts` bildet die ID-Schnittmenge aus:

```text
EXECUTABLE_ANIMATION_IDS
∩
NATIVE_CONTENT_BOUND_PROTOTYPE_IDS
```

Das Ergebnis ist:

```text
PRODUCTION_READY_LIBRARY_ANIMATION_IDS
```

Für konkrete Katalogeinträge gilt zusätzlich:

```text
status !== retired
```

`getProductionReadyLibraryEntries()` filtert den übergebenen Katalog deshalb auf native, ausführbare und nicht zurückgezogene Entries.

`planProductionReelAnimations()` verwendet nur diese Menge für echte Library-Wiederverwendung.

Der allgemeine Creative-/Choreography-Planner wird bewusst **nicht** global eingeschränkt. Analyse, Katalogpflege und Expansion dürfen weiterhin alle Konzepte und ausführbaren Varianten kennen.

## Verhalten bei nicht freigegebenen Varianten

### Nicht registrierter Katalogeintrag

Ein Entry, dessen `animationId` nicht ausführbar registriert ist, darf niemals als `source: "library"` in einem Produktionsplan erscheinen.

### Ausführbar, aber nur Semantic Shell

Auch eine ausführbare Remotion-Variante wird nicht direkt wiederverwendet, wenn sie keine native Content-Objektbindung besitzt.

### Retired

Eine ansonsten production-ready ID wird nicht wiederverwendet, wenn der aktuelle Katalogeintrag `status: "retired"` trägt.

### Kein freigegebener Kandidat übrig

Wenn nach dem Produktionsfilter kein passender wiederverwendbarer Kandidat bleibt, erzeugt der Content-first Planner ein `NewAnimationProposal`.

Die Szene wird dann:

```text
source: new-build
```

und bleibt bis zur echten Implementierung/Registrierung blockiert.

## Defense in Depth

Die Produktionsgrenze wird nicht nur an einer Stelle geprüft.

### 1. Production Planner

`productionPlanner.ts` gibt dem Content-first Planner nur production-ready Library-Entries zur direkten Wiederverwendung.

Ein `new-build` setzt `readyForImplementation` ausdrücklich auf `false`, unabhängig davon, ob aktuell zusätzlich eine Warnung existiert. Die Sicherheit hängt damit nicht von Warntexten ab.

### 2. Plan Diagnostics

`planDiagnostics.ts` erzeugt den Blocker:

```text
non-production-ready-library-selection
```

falls ein Raw-Plan trotz Planner-Schutz eine nicht freigegebene Library-ID enthält.

### 3. Channel Masterplan

`channelReelMasterPlan.ts` behandelt eine nicht production-ready `source: library`-Szene als internen Invariantenbruch und bricht sofort ab.

Ein normaler `new-build` bleibt dagegen ein erwarteter Masterplan-Blocker, bis seine Runtime existiert.

### 4. Release Finalization

`finalizeReelAnimationProduction()` prüft vor jedem Release-Review den **aktuellen** Katalog und die aktuelle Runtime-Freigabe.

Damit gilt:

- fehlender aktueller Katalogeintrag → keine Finalisierung,
- keine ausführbare native Content-Bindung → keine Finalisierung,
- `retired` → keine Finalisierung,
- ein geplanter New-Build kann nicht allein durch einen positiven Review `verified` werden.

Wichtig: Die Finalisierung startet aus dem vom Aufrufer gelieferten **aktuellen Katalog**. Der ältere `catalogEntry` aus dem Plan wird nicht mehr vor dem Review zurückgeschrieben.

Das schützt insbesondere den Fall:

```text
Planung: new-build / concept
→ Animation wird später real implementiert und katalogisiert
→ Review
```

Die neue Implementierungs-/Katalogversion bleibt erhalten und wird nicht durch den alten Plan-Snapshot wieder auf `concept` zurückgesetzt.

## Relevante Dateien

```text
ki/src/animation-library/executionCatalog.ts
ki/src/animation-library/prototypeContentCoverage.ts
ki/src/animation-library/productionEligibility.ts
ki/src/animation-library/productionPlanner.ts
ki/src/animation-library/planDiagnostics.ts
ki/src/animation-library/channelReelMasterPlan.ts
ki/src/animation-library/reelLifecycle.ts
```

Regressionstests:

```text
ki/src/animation-library/__tests__/productionPlanner.test.ts
ki/src/animation-library/__tests__/productionExecutableGuard.test.ts
ki/src/animation-library/__tests__/reelPlanningPipeline.test.ts
ki/src/animation-library/__tests__/planDiagnostics.test.ts
ki/src/animation-library/__tests__/channelReelMasterPlanContentBinding.test.ts
ki/src/animation-library/__tests__/reelLifecycle.test.ts
```

## Abgesicherte Fälle

Die Tests prüfen unter anderem:

1. Die Produktions-ID-Menge enthält aktuell exakt 22 Animationen.
2. Jede dieser IDs ist technisch ausführbar.
3. Jede dieser IDs besitzt native Content-Objektbindung.
4. Ein absichtlich hoch bewerteter, aber nicht registrierter Fake-Entry wird nicht wiederverwendet.
5. Wenn ausschließlich nicht registrierte Entries übergeben werden, entsteht ein `new-build`.
6. Eine technisch ausführbare, aber nur `semantic-shell-only` gebundene Variante wird ebenfalls nicht wiederverwendet.
7. Ein `retired` Entry wird trotz production-ready ID nicht wiederverwendet.
8. Derselbe Schutz gilt im öffentlichen Sprechertext→Reel-Planungspfad.
9. Diagnostics blockiert eine eingeschleuste Shell-only-Library-Auswahl.
10. Der Masterplan schlägt bei einer eingeschleusten nicht production-ready Library-ID sofort fehl.
11. Ein noch nicht runtime-registrierter New-Build kann nicht finalisiert werden.
12. Aktuelle Katalogmetadaten werden bei Finalisierung nicht durch den älteren Plan-Snapshot überschrieben.

## Ausbau auf mehr als 22 direkte Reuse-Varianten

Weitere der 88 ausführbaren Varianten können später in die Produktionsmenge aufgenommen werden, sobald sie denselben Vertrag erfüllen wie die 22 Kernprototypen:

- native sichtbare Objektbindung an `PrototypeContentContext`,
- echte prototypspezifische `labels`-/`values`-Nutzung,
- semantische Bewegungslogik,
- Content-Fixture,
- Runtime-Key-Gate,
- visuelle Renderprüfung.

Erst danach sollte ihre ID in `NATIVE_CONTENT_BOUND_PROTOTYPE_IDS` aufgenommen werden. Die Produktions-ID-Menge erweitert sich dann automatisch über die Schnittmenge. Der konkrete Katalogeintrag muss zusätzlich weiterhin nicht `retired` sein.
