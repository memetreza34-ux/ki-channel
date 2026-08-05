# Erweiterte Bibliothek: 44 ausführbare Animationen

## Ziel

Die Bibliothek besitzt jetzt zwei eigenständige, ausführbare Varianten pro visueller Familie:

```text
22 Familien × 2 ausführbare Mechanismen = 44 Remotion-Compositions
```

Die zweite Welle ist keine bloße Farb- oder Textvariante. Jede zusätzliche Composition verwendet einen anderen Erklärmechanismus, ein anderes Layout und eine andere Hauptbewegung.

## Neue zweite Varianten

| Familie | neue Animation | Hauptmechanismus |
|---|---|---|
| Tokenisierung | Syllable Conveyor | Erkennen, Trennen und Sortieren auf einer Förderstrecke |
| Datenumwandlung | Matrix Waterfall Encoder | Information fällt durch Kodierschichten in eine Matrix |
| Bedeutungsraum | Magnetic Concept Constellation | Begriffe ziehen sich an oder stoßen sich ab |
| Beziehungen | Graph Bloom | Ein Kern wächst, schwache Äste werden entfernt |
| Wahrscheinlichkeit | Candidate Orbit Selection | Kandidaten kreisen in unterschiedlichen Radien |
| Modellverarbeitung | Transformer Tunnel | sichtbare Veränderung an mehreren Tunnelringen |
| Antwortgenerierung | Sentence Ribbon Fold | jedes ausgewählte Wort faltet ein Satzband weiter |
| Risiko | Hallucination Mirage | überzeugende Antwort löst sich beim Quellencheck auf |
| Vergleich | Difference Magnifier | bewegliche Linse isoliert entscheidende Unterschiede |
| Ranking | Priority Orbit Stack | orbitierende Elemente bilden eine priorisierte Mitte |
| Prozessfluss | Automation Conveyor Cells | ein Objekt durchläuft spezialisierte Arbeitsstationen |
| Input/Output | Transformation Portal | Input wird innerhalb eines sichtbaren Portals umgeformt |
| Fehlererkennung | Broken Path Repair | Signal stoppt, Bruch wird diagnostiziert und repariert |
| Retrieval | Archive Spotlight Search | Dokumente werden gescannt, Belegzeilen werden extrahiert |
| Sicherheit | Permission Gate City | Identität, Rolle und Umfang öffnen oder sperren Routen |
| Skalierung | Load Balancing City | Verkehr wird vor Überlastung dynamisch umverteilt |
| Kosten | Token Cost Conveyor | Tokens werden gezählt, gefiltert und neu bepreist |
| Zeit/Änderung | Version Evolution Tree | Versionen wachsen, verzweigen und verschmelzen |
| Mensch + KI | Feedback Sculpting | KI-Rohform wird durch menschliche Rückmeldung geformt |
| Entscheidungslogik | If Then Gate Array | nur vollständig erfüllte Bedingungen öffnen einen Pfad |
| Kontextfenster | Memory Shelf Carousel | begrenzter Kontext rotiert, relevantes Wissen wird reaktiviert |
| Lernen/Aktualisierung | Belief Ledger Revision | Quelle, Aktualität und Vertrauen steuern Wissensrevisionen |

## Codepfade

```text
ki/src/animation-library/experimentalRecipes.ts
ki/src/animation-library/experimentalPrototypeRegistry.ts
ki/src/animation-library/prototypes/ExperimentalVariantPrototype.tsx
ki/src/animation-library/ExpandedPrototypeGalleryRoot.tsx
ki/src/animation-library/expanded-remotion-entry.tsx
```

`ExperimentalVariantPrototype.tsx` enthält 22 unterschiedliche Mechanismen. Gemeinsame Typografie, Safe-Zones und Grundflächen werden wiederverwendet; die vollständige Animation wird nicht als identisches Template wiederholt.

## Renderumfang

### Smoke-Test

```text
44 Animationen × 3 Prüfframes = 132 PNG-Dateien
```

### Vollständiger Test

```text
44 Animationen × 7 Prüfframes = 308 PNG-Dateien
44 Animationen × 1 MP4 = 44 MP4-Dateien
Gesamt = 352 technische Artefakte
```

## Befehle

```bash
npm run animation-library:expanded:verify
npm run animation-library:expanded:plan
npm run animation-library:expanded:smoke
npm run animation-library:expanded:stills
npm run animation-library:expanded:videos
npm run animation-library:expanded:render
npm run animation-library:expanded:check
npm run animation-library:expanded:full-release-check
```

Bericht:

```text
out/animation-library-expanded/release-report.json
```

## Qualitätsstatus

Die 22 neuen Varianten sind als ausführbarer Remotion-Code und als Renderverträge vorhanden. Sie gelten noch nicht als visuell bestätigt.

Offen bleiben:

- TypeScript tatsächlich ausführen
- Vitest tatsächlich ausführen
- 132 Smoke-PNGs prüfen
- 308 vollständige PNGs prüfen
- 44 MP4-Dateien ansehen
- Textüberlauf, Rhythmus, mobile Lesbarkeit und semantische Verständlichkeit bewerten
- nur bestandene Varianten im Creative Brain als `verified` markieren

Kein Prototyp darf allein aufgrund vorhandenen Codes oder erfolgreicher Syntax als hochwertig bezeichnet werden.
