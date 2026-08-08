# Content Variant Promotion

## Zweck

Der ausführbare Animationskatalog enthält 88 Animationen. Davon sind aktuell 22 Kernanimationen vollständig content-aware und production-ready. Die übrigen 66 Varianten bestehen aus drei Sätzen mit jeweils einer Variante pro visueller Familie:

- 22 Experimental-Varianten,
- 22 Advanced-Varianten,
- 22 Final-Varianten.

Diese 66 Varianten sind technisch ausführbar, aber **nicht automatisch für echte Content-Produktion freigegeben**. Viele ihrer dominanten Mechaniken verwenden weiterhin feste Demo-Objekte, feste Rollen, feste Zustände oder illustrative Zahlen.

Beispiele aus dem aktuellen Varianten-Code:

- Token Cost Conveyor verwendet feste Demo-Tokens und illustrative Kosten.
- Memory Shelf Carousel verwendet feste Demo-Nachrichten und eine feste ausgewählte Quelle.
- Belief Ledger Revision verwendet feste Fakten, Quellen, Daten und Confidence-Werte.
- Ranking-, Probability-, Decision- und Performance-Varianten enthalten teilweise feste Kandidaten, Bedingungen oder Messwerte.

Eine bloße Content-Shell mit Sprechertext als Überschrift reicht deshalb ausdrücklich nicht als native Content-Bindung.

## Maschinenlesbarer Vertrag

`contentVariantPromotion.ts` erzeugt für alle 66 Varianten einen Promotion-Report:

```ts
const report = createContentVariantPromotionReport();
```

Jeder Kandidat enthält unter anderem:

- `animationId`,
- Familie und Tier,
- konkrete Mechanik,
- aktuellen Production-Status,
- fehlende Gates,
- verbindliche Anforderung an die dominante Content-Bindung,
- Precision-Policy gegen erfundene Zahlen,
- deterministischen Prioritätswert.

Der Report erwartet aktuell exakt:

```text
66 Varianten
22 Familien
3 Varianten pro Familie
22 Experimental
22 Advanced
22 Final
```

## Pflicht-Gates für eine Promotion

Eine Variante darf nur production-ready werden, wenn alle folgenden Bedingungen gleichzeitig erfüllt sind:

1. **Executable Runtime**
   - die exakte `animationId` ist technisch registriert und renderbar.

2. **Native Mechanism Binding**
   - die dominante Mechanik verwendet echte Szenenobjekte aus `spokenText` + `SceneMeaningContract`;
   - Änderungen am Sprecherinhalt verändern die wesentlichen sichtbaren Objekte/Zustände;
   - bloße Shell-Texte oder ein ausgetauschtes Subtitle reichen nicht.

3. **Content Render Registration**
   - die exakte `animationId` steht in `prototype-render-config.json`;
   - Remotion erhält `PrototypeRenderProps` über den production-nahen Content-Pfad.

4. **Runtime Content Deriver**
   - `derivePrototypeRuntimeContent()` erzeugt für diese Mechanik passende Labels/Werte;
   - die Keys werden von der tatsächlichen TSX-Mechanik konsumiert.

5. **Reusable Catalog Status**
   - direkte Library-Reuse verlangt `prototype` oder `verified`;
   - `retired` bleibt immer ausgeschlossen.

`assertContentVariantPromotionInvariants()` blockiert widersprüchliche Zustände, insbesondere eine production-ready Variante mit noch fehlendem Promotion-Gate.

## Content-Bindung muss mechanikspezifisch sein

Die Anforderungen unterscheiden sich je Familie. Beispiele:

### Input / Output

Die Animation muss konkrete Inputs, die sichtbare Transformation und den tatsächlichen Output binden. Ein generisches Objekt mit den Worten `INPUT` und `OUTPUT` ist noch keine native Content-Bindung.

### Ranking / Comparison / Probability

Kandidaten, Kriterien, Werte und Gewinner müssen am richtigen Objekt hängen. Unvollständige Werte dürfen keinen finalen Sieger erzeugen.

### Kosten / Performance

Interne heuristische Werte dürfen Bewegung steuern, aber keine scheinpräzisen Geld-, Token-, Latenz-, Durchsatz- oder Kapazitätswerte anzeigen. Exakte Werte benötigen explizite Messungen im Sprechertext.

### Mensch + KI

Rollen und Übergaben dürfen nur sichtbar zugeordnet werden, wenn der Sprechertext diese Verantwortung tatsächlich beschreibt.

### Time Change / Learning Update

Keine Demo-Jahre, Demo-Versionen, Confidence-Werte oder künstlichen Revisionen. Aktualisierung/Ersetzung braucht belegte Verifikation oder eine explizit erfüllte Schwelle.

## Pilot-Prozess

Neue Varianten werden **einzeln oder in kleinen, überprüfbaren Wellen** promoted. Für jede Pilotanimation:

1. Kandidat aus `createContentVariantPromotionReport()` auswählen.
2. Harte Demo-Daten der dominanten Mechanik identifizieren.
3. Mechanik auf `PrototypeContentContext` umstellen.
4. prototypspezifischen Runtime-Deriver ergänzen.
5. Sanitizer/Association ergänzen, falls die Mechanik Zahlen, Gewinner, Rollen oder Messwerte zeigt.
6. native Content-Binding-ID registrieren.
7. Composition in die Content-Render-Config aufnehmen.
8. reales Content-Fixture mit Gegenbeispielen hinzufügen.
9. Runtime-Key-Gate und Source-Binding-Gate erweitern.
10. Smoke + Full Release + visuelle Kontrolle bestehen lassen.
11. erst danach Production Eligibility freigeben.

## Keine Massenfreigabe

Folgende Abkürzungen sind verboten:

- alle 66 IDs pauschal in `NATIVE_CONTENT_BOUND_PROTOTYPE_IDS` eintragen,
- alle 66 nur durch `createContentAwarePrototype()` wrappen,
- einen Familien-Deriver blind für andere Mechaniken wiederverwenden, wenn dessen sichtbare Keys nicht zur Mechanik passen,
- Demo-Zahlen als Runtime-Werte behandeln,
- einen generischen Subtitle-Austausch als native Objektbindung deklarieren.

Der vorhandene 22er Production-Pfad bleibt deshalb stabil, bis eine konkrete Zusatzvariante ihren vollständigen Mechanikvertrag erfüllt.

## Tests

`contentVariantPromotion.test.ts` prüft aktuell unter anderem:

- exakt 66 Promotionskandidaten,
- exakt 22 Familien,
- exakt drei Varianten pro Familie,
- alle 66 sind executable,
- alle 66 bleiben aktuell production-blocked,
- native Mechanikbindung, Content-Render-Registration und Runtime-Deriver fehlen weiterhin und werden explizit gemeldet,
- jede Familie besitzt einen deterministischen nächsten Kandidaten,
- precision-sensitive Familien tragen eine explizite No-Fake-Precision-Policy.

Der Test ist Teil von `verify-content-matched-runtime.mjs` und des vollständigen Animation-Library-Vitest-Laufs.
