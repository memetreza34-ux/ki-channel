# Runtime Content Derivation

## Ziel

Die Auswahl einer semantisch passenden Animation reicht nicht aus, wenn ihre inneren Mechanikwerte anschließend auf Demo-Defaults zurückfallen.

Der echte Produktionspfad leitet deshalb für jede der 22 aktuell production-ready Kernanimationen prototypspezifische `labels` und `values` direkt aus dem Sprechertext und dem `SceneMeaningContract` ab.

## Produktionskette

```text
Sprechertext
→ SceneMeaningContract
→ production-ready Animation
→ derivePrototypeRuntimeContent(...)
→ prototypspezifische labels / values
→ createPrototypeRenderProps(...)
→ ChannelReelMasterPlan
→ Remotion Composition
```

`channelReelMasterPlan.ts` übergibt jetzt ausdrücklich:

```ts
labels: runtimeContent.labels
values: runtimeContent.values
```

Damit ist der Deriver Teil des echten Renderpfads und nicht nur ein Test-/Fixture-Helfer.

## Production Eligibility

Direkte Library-Wiederverwendung benötigt jetzt vier technische ID-Gates:

```text
EXECUTABLE_ANIMATION_MANIFEST_IDS
∩ NATIVE_CONTENT_BOUND_PROTOTYPE_IDS
∩ CONTENT_RENDERABLE_ANIMATION_IDS
∩ CONTENT_DERIVER_ANIMATION_IDS
```

Für direkte Library-Reuse muss der konkrete Katalogeintrag zusätzlich `prototype` oder `verified` sein.

Eine neue 23. content-aware Variante kann daher nicht versehentlich production-ready werden, solange ihr prototypspezifischer Deriver fehlt.

## Ableitungsprinzipien

Der Deriver ist deterministisch und benötigt weder Netzwerk noch LLM-Aufruf.

Er verwendet:

- exakten deutschen Sprechertext,
- Subjekt-, Aktions- und Ergebnisbegriffe aus dem Meaning Contract,
- Satzteile und explizite Entitäten,
- echte Zahlen und Prozentwerte aus dem Text,
- ausgeschriebene deutsche Zahlen für wichtige numerische Mechanismen,
- Negations-/Unsicherheits-Signale,
- Fehler-/Retry-Signale,
- starke/schwache Beziehungsbegriffe,
- Zeit-/Versionshinweise.

Er soll keine scheinbar präzisen Fakten erfinden. Wo eine Animation eine rein illustrative Repräsentation benötigt, werden deterministische relative Werte aus dem konkreten Begriff erzeugt; reale Messwerte werden nur übernommen, wenn sie im Sprechertext vorhanden sind.

## Beispiele

### Latenz

```text
„Die Latenz sinkt ... von 780 Millisekunden auf 340 Millisekunden.“
```

wird zu:

```json
{
  "slowLatency": 780,
  "fastLatency": 340
}
```

Auch `siebenhundertachtzig` und `dreihundertvierzig` werden erkannt.

### Wahrscheinlichkeit

```text
„... steigt auf sechsundsechzig Prozent.“
```

setzt den dominanten Endwert auf `66` und verteilt den Rest konsistent auf die übrigen Kandidaten.

### Knowledge Update

`unsicher`, `nicht verifiziert` oder ähnliche Signale setzen den abgeleiteten Confidence-Wert unter die Verifikationsschwelle. Die Revision darf dann nicht fortgeschrieben werden.

### Retrieval / Funnel

Relevanz-, Negations- und Verwerfungsbegriffe steuern `sourceXRelevant` bzw. `inputXKeep`, sodass die sichtbare Auswahl nicht mehr positional oder rein dekorativ ist.

### Relationship Network

Explizite Prozentwerte wie `86 %`, `72 %`, `18 %` werden direkt zu `weight12`, `weight23` und `weakWeight`.

## 22/22 Coverage

`prototypeRuntimeContentDeriver.test.ts` prüft:

- Deriver-ID-Menge = aktuelle production-ready ID-Menge,
- alle 22 Animationen liefern ihre prototypspezifischen Schlüssel,
- deutsche ausgeschriebene Zahlen,
- Latenzwerte,
- Wahrscheinlichkeiten,
- Knowledge-Verification,
- Retrieval-/Funnel-Filter,
- Attention-/Relationship-Gewichte.

Der dependency-freie `scripts/check-native-prototype-bindings.mjs` vergleicht zusätzlich:

```text
22 native Komponenten
= 22 prototype-render-config IDs
= 22 Runtime-Deriver IDs
```

und prüft, dass `channelReelMasterPlan.ts` die abgeleiteten Labels/Werte wirklich in die Render-Props einspeist.

## Production-Derived Release Gate

Die bisherigen handgeschriebenen Content-Fixtures bleiben wertvoll für Source-Key-, Layout- und Edge-Case-Prüfungen. Zusätzlich existiert jetzt ein eigener Produktionspfad-Render:

```bash
node scripts/render-production-derived-content.mjs plan
node scripts/verify-production-derived-content.mjs
```

Der fokussierte Runtime-Verify führt diesen `plan`-Lauf für alle 22 Kernanimationen automatisch aus.

Für die vollständige visuelle Freigabe:

```bash
node scripts/render-production-derived-content.mjs all
node scripts/verify-production-derived-content.mjs --complete
```

Der vollständige Verifier prüft:

- 22/22 Animationen,
- aktuellen Source-Fingerprint,
- Props gegen eine frische Re-Derivation,
- normalisierte Render-Props,
- Render-Request-ID und Composition-ID,
- erwartete Kontroll-PNGs mit echter PNG-Signatur,
- Content-MP4 mit MP4-Header.

Damit kann eine grüne Fixture-Matrix nicht mehr verdecken, dass der echte Produktions-Deriver falsche oder veraltete Props erzeugt.

## Ausbau auf weitere Varianten

Eine zusätzliche der 66 bereits technisch ausführbaren Varianten soll erst dann in direkte Content-Produktion aufgenommen werden, wenn alle vier ID-Gates erfüllt sind und ein prototypspezifischer Deriver existiert.

Ein bloßer semantischer Shell-Wrapper ist ausdrücklich keine Production-Freigabe.
