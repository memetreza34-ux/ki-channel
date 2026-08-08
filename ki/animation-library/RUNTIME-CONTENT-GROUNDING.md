# Runtime Content Grounding

## Ziel

Die ausgewählte Animation darf nicht nur thematisch passen. Sichtbare Objekte, Zahlen, Gewinner, Reihenfolgen und Zustandsänderungen müssen aus dem tatsächlichen Sprechertext ableitbar sein.

Der kanonische Produktionspfad lautet:

```text
spokenText
→ SceneMeaningContract
→ derivePrototypeRuntimeContent()
→ sanitizePrototypeRuntimeContent()
→ associatePrototypeRuntimeContent()
→ createPrototypeRenderProps()
→ Remotion composition
```

Nur dieser vollständige Pfad gilt als Masterplan-/Release-Pfad.

## 1. Deriver

`prototypeRuntimeContentDeriver.ts` erzeugt für die 22 content-ready Kernprototypen prototypspezifische Labels und Steuerwerte aus Sprechertext und Meaning Contract.

Diese Werte dürfen intern illustrativ sein, solange sie nicht als angeblich gemessene Fakten angezeigt werden.

## 2. Sanitizer

`prototypeRuntimeContentSanitizer.ts` verhindert unzulässige sichtbare Präzision und unbelegte Aussagen.

Beispiele:

- keine Euro-/Cent-Beträge ohne echte Kostenangabe
- keine Millisekunden ohne echte Zeitangabe
- keine Prozentwerte ohne echte Prozentangabe
- kein Ranking-Sieger ohne Score oder explizite Gewinneraussage
- kein Benchmark-Sieger ohne Score oder explizite Gewinneraussage
- negierte Aussagen wie `Tool A ist nicht der Gewinner` dürfen keinen Sieger grounden
- strukturierte Entitäten wie `Tool A`, `Modell B` oder `Antwort C` haben Vorrang vor zufällig großgeschriebenen Satzanfangs-Nomen

## 3. Objektgenaue Association

`prototypeRuntimeContentAssociation.ts` ist die finale Zuordnungsstufe vor den Render-Props.

Sie stellt sicher, dass echte Werte beim richtigen sichtbaren Objekt bleiben:

- `Tool B erreicht 88 Punkte, Tool A erreicht 96 Punkte` → B = 88, A = 96
- `Modell B erreicht 88 Punkte, Modell A erreicht 96 Punkte` → B = 88, A = 96
- Kostenwerte bleiben in gesprochener Reihenfolge
- eine Kostensteigerung darf nicht durch Sortieren der Zahlen in eine angebliche Einsparung umgedeutet werden

Bei Cost-Efficiency gilt zusätzlich: Wenn der zweite echte Kostenwert nicht niedriger als der erste ist, werden die exakten Savings-Werte entfernt. Die Szene darf dann keine erfundene Einsparsumme zeigen.

## 4. Exact vs. relative

Interne Steuerwerte und sichtbare Fakten sind getrennt.

### Exakte Werte

Ein Wert darf als Zahl im Bild erscheinen, wenn der Sprechertext ihn tatsächlich nennt und die Einheit bzw. Bedeutung eindeutig zugeordnet werden kann.

### Relative Werte

Wenn keine echte Zahl vorliegt, darf eine Animation weiterhin eine qualitative Veränderung darstellen, zum Beispiel:

- schneller / langsamer
- höher / niedriger
- steigt / sinkt
- relevant / verworfen
- Position offen

Sie darf dann jedoch keine Demo-Zahl wie `780 ms`, `94 €`, `66 %` oder `96 Punkte` als reale Aussage ausgeben.

## 5. Grounded outcomes

Für Probability, Ranking und Benchmark werden Gewinneraussagen separat gegroundet.

Ein finaler Sieger ist nur zulässig, wenn mindestens eines gilt:

1. genügend explizite Werte begründen die Reihenfolge, oder
2. der Sprechertext benennt den Gewinner eindeutig.

Winner-Cues dürfen nicht über Komma-/Satzgrenzen auf einen anderen Kandidaten überspringen und werden bei Negationen wie `nicht`, `kein`, `weder`, `nie` verworfen.

## 6. Release-Gates

Der Masterplan-Release verwendet dieselbe Runtime-Kette wie die echte Produktion:

```text
derive
→ sanitize
→ associate
→ createPrototypeRenderProps
```

`scripts/check-production-derived-runtime-keys.mjs` prüft anschließend, dass alle finalen Label-/Value-Keys von der zugehörigen TSX-Komponente tatsächlich konsumiert werden.

Der Release-Fingerprint enthält Deriver, Sanitizer, Association, Payload-Builder, Masterplan, Render-Skripte und Prototype-Komponenten. Änderungen an einer dieser Stufen machen alte Release-Artefakte ungültig.

## 7. Verifikation

Technische Kernprüfung:

```bash
node scripts/verify-content-matched-runtime.mjs
npm run animation-library:verify
```

Kanonischer kompletter Content-Release:

```bash
node scripts/render-all-content-release.mjs
node scripts/verify-all-content-release.mjs
```

Danach weiterhin manuell prüfen:

- alle 22 content-ready Kernkompositionen
- Start
- Erklärhöhepunkt
- Ergebnis
- End-Hold
- vollständiges Video
- alle semantischen Edge-Case-Renders gegen ihr `expectedBehavior`

Ein grüner Dateisignatur-/TypeScript-/Vitest-Check ersetzt die visuelle Bedeutungsprüfung nicht.
