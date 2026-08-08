# Production Eligibility for Content-Matched Animations

## Warum es mehrere technische Grenzen gibt

Der Animationskatalog enthält mehr technisch ausführbare Varianten als aktuell vollständig content-aware und direkt über den Content-Renderer adressierbare Varianten.

Aktueller Stand:

- **88** Kataloganimationen besitzen eine ausführbare Remotion-Implementierung.
- **22** Kernanimationen besitzen zusätzlich native Content-Objektbindung.
- Diese **22** sind außerdem in `prototype-render-config.json` für den konkreten Content-Renderpfad registriert.
- Nur diese Schnittmenge darf im content-matched Produktionspfad direkt als bestehende Library-Animation wiederverwendet werden.

Eine technisch renderbare Animation ist damit nicht automatisch für die Content-Produktion freigegeben.

## Produktionsregel

`productionEligibility.ts` bildet die ID-Schnittmenge aus:

```text
EXECUTABLE_ANIMATION_IDS
∩
NATIVE_CONTENT_BOUND_PROTOTYPE_IDS
∩
CONTENT_RENDERABLE_ANIMATION_IDS
```

`CONTENT_RENDERABLE_ANIMATION_IDS` wird direkt aus `prototype-render-config.json` abgeleitet.

Das Ergebnis ist:

```text
PRODUCTION_READY_LIBRARY_ANIMATION_IDS
```

Für konkrete Katalogeinträge gilt zusätzlich:

```text
status !== retired
```

`getProductionReadyLibraryEntries()` filtert den übergebenen Katalog deshalb auf native, ausführbare, im Content-Renderer konfigurierte und nicht zurückgezogene Entries.

`planProductionReelAnimations()` verwendet nur diese Menge für echte Library-Wiederverwendung.

Der allgemeine Creative-/Choreography-Planner wird bewusst **nicht** global eingeschränkt. Analyse, Katalogpflege und Expansion dürfen weiterhin alle Konzepte und ausführbaren Varianten kennen.

## Verhalten bei nicht freigegebenen Varianten

### Nicht registrierter Katalogeintrag

Ein Entry, dessen `animationId` nicht ausführbar registriert ist, darf niemals als `source: "library"` in einem Produktionsplan erscheinen.

### Ausführbar, aber nur Semantic Shell

Auch eine ausführbare Remotion-Variante wird nicht direkt wiederverwendet, wenn sie keine native Content-Objektbindung besitzt.

### Native und ausführbar, aber nicht im Content-Renderer konfiguriert

Eine ID darf ebenfalls nicht production-ready werden, solange sie in `prototype-render-config.json` fehlt. Dadurch kann der Produktionsplan keine Animation freigeben, die `render-content-matched-prototype.mjs` später als unbekannt ablehnen würde.

### Retired

Eine ansonsten production-ready ID wird nicht wiederverwendet, wenn der aktuelle Katalogeintrag `status: "retired"` trägt.

### Kein freigegebener Kandidat übrig

Wenn nach dem Produktionsfilter kein passender wiederverwendbarer Kandidat bleibt, erzeugt der Content-first Planner ein `NewAnimationProposal`.

Die Szene wird dann:

```text
source: new-build
```

und bleibt bis zur echten Implementierung/Registrierung blockiert.

## Runtime-Promotion eines New-Builds

`source: "new-build"` beschreibt die **Herkunft** einer Szene. Es darf nicht dauerhaft bedeuten, dass diese Szene nie runtime-ready werden kann.

Deshalb wird die aktuelle Bereitschaft anhand der `animationId` neu bewertet:

```text
new-build geplant
→ TSX/Remotion-Komponente implementiert
→ Animation ausführbar registriert
→ native Content-Bindung eingetragen
→ prototype-render-config.json ergänzt
→ dieselbe animationId wird runtime-ready
```

Der historische Source-Wert bleibt dabei `new-build`.

`getPrototypeContentBindingLevel()` prüft deshalb zuerst, ob die konkrete ID inzwischen native Content-Bindung besitzt. Wenn ja, lautet das Binding auch bei historischer Quelle `new-build`:

```text
native-object-binding
```

`areProductionRuntimeScenesReady()` bildet die vollständige Runtime-Regel zentral für Production Planner und Implementierungsbrief ab.

Damit muss nach einer Implementierung nicht künstlich neu geplant oder `source` nachträglich auf `library` umgeschrieben werden.

Zusätzlich werden veraltete Planwarnungen entfernt, sobald die Runtime den zuvor fehlenden Zustand aufgelöst hat, insbesondere:

- `one or more scenes require a content-specific animation before production`
- eine alte `only 0 visual families were selected`-Warnung, wenn die realen Produktionsszenen inzwischen eine Familie besitzen

## Defense in Depth

Die Produktionsgrenze wird nicht nur an einer Stelle geprüft.

### 1. Production Planner

`productionPlanner.ts` gibt dem Content-first Planner nur production-ready Library-Entries zur direkten Wiederverwendung.

`readyForImplementation` wird aus der aktuellen Runtime-Bereitschaft der Szenen abgeleitet. Ein noch nicht implementierter New-Build bleibt `false`; eine später wirklich ausführbare, nativ gebundene und im Content-Renderer konfigurierte ID kann dagegen runtime-ready werden, ohne ihre Historie zu verlieren.

### 2. Plan Diagnostics

`planDiagnostics.ts` erzeugt den Blocker:

```text
non-production-ready-library-selection
```

falls ein Raw-Plan trotz Planner-Schutz eine nicht freigegebene Library-ID enthält.

### 3. Channel Masterplan

`channelReelMasterPlan.ts` behandelt eine nicht production-ready `source: library`-Szene als internen Invariantenbruch und bricht sofort ab.

Ein normaler, noch nicht implementierter `new-build` bleibt ein erwarteter Masterplan-Blocker. Sobald dieselbe ID später runtime-ready ist, darf der Masterplan die Szene als `native-object-binding` behandeln, während `fullAnimationSource` weiterhin `new-build` bleibt.

### 4. Release Finalization

`finalizeReelAnimationProduction()` prüft vor jedem Release-Review den **aktuellen** Katalog und die aktuelle Runtime-Freigabe.

Damit gilt:

- fehlender aktueller Katalogeintrag → keine Finalisierung,
- keine vollständige Production-Eligibility → keine Finalisierung,
- `retired` → keine Finalisierung,
- ein geplanter New-Build kann nicht allein durch einen positiven Review `verified` werden.

Wichtig: Die Finalisierung startet aus dem vom Aufrufer gelieferten **aktuellen Katalog**. Der ältere `catalogEntry` aus dem Plan wird nicht mehr vor dem Review zurückgeschrieben.

Das schützt insbesondere den Fall:

```text
Planung: new-build / concept
→ Animation wird später real implementiert und katalogisiert
→ Runtime + Content-Render-Konfiguration werden ergänzt
→ Review
```

Die neue Implementierungs-/Katalogversion bleibt erhalten und wird nicht durch den alten Plan-Snapshot wieder auf `concept` zurückgesetzt. Nach erfolgreicher Runtime-Registrierung kann derselbe historisch als `new-build` geplante Eintrag regulär reviewed und `verified` werden.

## Relevante Dateien

```text
ki/src/animation-library/executionCatalog.ts
ki/src/animation-library/prototype-render-config.json
ki/src/animation-library/prototypeContentCoverage.ts
ki/src/animation-library/productionEligibility.ts
ki/src/animation-library/productionPlanner.ts
ki/src/animation-library/implementationBrief.ts
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
ki/src/animation-library/__tests__/prototypeContentCoverage.test.ts
ki/src/animation-library/__tests__/channelReelMasterPlanContentBinding.test.ts
ki/src/animation-library/__tests__/reelLifecycle.test.ts
```

## Abgesicherte Fälle

Die Tests prüfen unter anderem:

1. Die Produktions-ID-Menge enthält aktuell exakt 22 Animationen.
2. Jede dieser IDs ist technisch ausführbar.
3. Jede dieser IDs besitzt native Content-Objektbindung.
4. Jede dieser IDs ist im Content-Render-Config registriert.
5. Ein absichtlich hoch bewerteter, aber nicht registrierter Fake-Entry wird nicht wiederverwendet.
6. Wenn ausschließlich nicht registrierte Entries übergeben werden, entsteht ein `new-build`.
7. Eine technisch ausführbare, aber nur `semantic-shell-only` gebundene Variante wird ebenfalls nicht wiederverwendet.
8. Ein `retired` Entry wird trotz production-ready ID nicht wiederverwendet.
9. Derselbe Schutz gilt im öffentlichen Sprechertext→Reel-Planungspfad.
10. Diagnostics blockiert eine eingeschleuste Shell-only-Library-Auswahl.
11. Der Masterplan schlägt bei einer eingeschleusten nicht production-ready Library-ID sofort fehl.
12. Ein noch nicht runtime-registrierter New-Build kann nicht finalisiert werden.
13. Eine historische `new-build`-Szene wird nach realer Registrierung als nativ content-bound erkannt.
14. Der Implementierungsbrief wird nach dieser Runtime-Promotion wieder bereit und entfernt aufgelöste Warnungen.
15. Ein historischer New-Build kann nach echter Runtime-Implementierung regulär finalisiert werden, ohne `source` umzuschreiben.
16. Aktuelle Katalogmetadaten werden bei Finalisierung nicht durch den älteren Plan-Snapshot überschrieben.

## Ausbau auf mehr als 22 direkte Reuse-Varianten

Weitere der 88 ausführbaren Varianten können später in die Produktionsmenge aufgenommen werden, sobald sie denselben Vertrag erfüllen wie die 22 Kernprototypen:

- native sichtbare Objektbindung an `PrototypeContentContext`,
- echte prototypspezifische `labels`-/`values`-Nutzung,
- semantische Bewegungslogik,
- Content-Fixture,
- Runtime-Key-Gate,
- Eintrag in `prototype-render-config.json`,
- visuelle Renderprüfung.

Erst danach sollte ihre ID in `NATIVE_CONTENT_BOUND_PROTOTYPE_IDS` aufgenommen werden. Die Produktions-ID-Menge erweitert sich dann automatisch über die vollständige Schnittmenge. Der konkrete Katalogeintrag muss zusätzlich weiterhin nicht `retired` sein.
