# Motion Semantics

## Ziel

Die Bewegung einer Animation darf nicht nur dekorativ oder thematisch ähnlich sein. Für jede der 22 registrierten Kernkompositionen gilt jetzt ein expliziter Bewegungsvertrag: **Welche Zustandsänderung muss der Zuschauer durch die Bewegung verstehen?**

`scripts/check-native-prototype-bindings.mjs` prüft zusätzlich zur Content-Bindung, dass für alle 22 Kernprototypen eine Motion-Semantik-Regel existiert. Entfernte Fehlmuster werden teilweise ausdrücklich als verbotene Source-Fragmente geschützt.

## 22 Kernverträge

| Familie | Prototyp | Bewegungsvertrag |
| --- | --- | --- |
| Error Detection | Anomaly X-Ray Scanner | Scanner erreicht reale Fehlerstelle → Ursache wird isoliert → Reparatur breitet sich ab der Fehlerstelle durch Folgeschritte aus. |
| Generation | Answer Loom | Kontextfäden fließen ein → Antwortwörter entstehen nacheinander → semantischer Endzustand wird als Antwort gezeigt. |
| Comparison | Benchmark Racetrack | Jede Rennzone entspricht einer Metrik → Metrik bestimmt Zwischenstand → Metrikführer und Gesamtsieger stammen aus denselben Checkpoints. |
| Cost Efficiency | Budget Leak Meter | Leckbeträge besitzen Gewichte → jedes Abdichten erzeugt anteilige Einsparung → Gesamtpreis fällt auf den Zielwert. |
| Risk Contrast | Confidence Glass Crack | Quelle/Datum/Beleg werden nacheinander geprüft → jeder fehlende Check erzeugt sichtbare Schäden → unbelegte Confidence verliert Tragfähigkeit. |
| Context Window | Context Window Train | Slots entsprechen echter Kapazität → neue Nachrichten erzeugen Überlauf → Fenster verschiebt sich → angeheftete Information bleibt. |
| Decision Logic | Decision Tree Burst | Ungültige Äste verschwinden → alle gültigen Kriterien bleiben → gültige Kriterien laufen in einen gemeinsamen begründeten Pfad. |
| Relationship Network | Dependency Bridge Builder | Verbindungen tragen sichtbare Gewichte → starke Beziehungen bleiben → schwache Direktverbindung wird verworfen. |
| Ranking | Dynamic Podium Rise | Kriterien werden nacheinander eingerechnet → Scores ändern sich → aktueller Rang ändert sich → Endrang folgt finalen Scores. |
| Security Privacy | Encryption Vault Layers | Schutzschichten werden nacheinander geprüft → jede Schicht wird aktiv → Tresor verriegelt erst nach allen Schichten. |
| Input Output | Funnel Compression Output | Quellen werden auf Relevanz geprüft → unpassende Inputs werden verworfen → nur relevante Inputs fließen in das verdichtete Ergebnis. |
| Human AI Collaboration | Human AI Relay | Task wechselt anhand tatsächlicher Stage-Owner → Übergaben werden explizit gezeigt → Rollenfolge bestimmt Paketfarbe und Status. |
| Retrieval Search | Knowledge Magnet | Quellen erhalten echte Relevanzwerte → relevante Quellen werden angezogen → irrelevante abgestoßen → Ergebniszahl stammt aus derselben Menge. |
| Learning Update | Knowledge Tree Graft | Neue Information wird geprüft → Vertrauensschwelle entscheidet → nur akzeptierte Information wird eingepfropft und ersetzt den schwächeren Stand. |
| Scale Performance | Latency Tunnel Race | Gleicher Start → reale Latenzwerte bestimmen Fortschrittsgeschwindigkeit → schnellerer Pfad erreicht proportional früher das Ziel. |
| Tokenization | Magnetic Phrase Slicer | Satz bleibt lesbar → Schnittgrenzen entstehen → Tokens trennen sich ohne Reihenfolgeverlust → Tokenfolge geht in Weiterverarbeitung. |
| Semantic Space | Meaning Terrain | Begriffe starten verteilt → explizite Cluster-Zugehörigkeit bestimmt Zielbereich → semantisch verwandte Begriffe rücken zusammen. |
| Probability | Probability Fluid Columns | Kontextsignale treffen nacheinander ein → erst dadurch ändern sich Wahrscheinlichkeiten → finaler Kandidat folgt dem Endwert. |
| Model Processing | Residual River | Eingangssignal erreicht Layer 1 → Layer 2 → Layer 3 → jeder Layer zeigt Warten/Verarbeiten/Fertig → Output erst nach Verarbeitung. |
| Process Flow | Subway Workflow Map | Prozess läuft Station für Station → aktueller Schritt bleibt aktiv → abgeschlossene Schritte werden markiert → Rückfallroute nur bei passendem Inhalt. |
| Time Change | Timeline Microscope | Zeitlinie läuft chronologisch → inhaltlich relevanter Zielstand wird fokussiert → Änderungen zwischen vorherigem und fokussiertem Stand werden sichtbar. |
| Data Transformation | Vector Prism Converter | Lesbarer Input geht in Transformation → Dimensionen entstehen nacheinander mit Werten → finaler Vektor baut sich aus denselben Werten auf. |

## Entfernte Fehlmuster

Unter anderem wurden folgende Mechanismen entfernt oder entkoppelt:

- geometrische Zufallsauswahl eines Decision-Tree-Gewinnerasts,
- willkürliche Token-Zuordnung per `index % 3`,
- Wahrscheinlichkeitsänderung unabhängig von eintreffenden Kontextsignalen,
- permanente Rotationen von Sicherheitsringen und Datenobjekten,
- sinusförmiges Partikelwackeln ohne Informationswert,
- hart codierte Mensch/KI-Farbe anhand von Zeitintervallen,
- fest verdrahtete Retrieval-Relevanz,
- Funnel-Kompression aller Inputs trotz behaupteter Filterung,
- gleichzeitig grün werdende Fehlerdiagnose-Schritte,
- Latenzrennen mit Bewegungsgeschwindigkeit unabhängig von den ms-Werten,
- immer sichtbare Workflow-Alternativroute ohne Fehlerinhalt,
- Wissenserneuerung ohne Verifikationsschwelle.

## Gate

Der Source-Gate verlangt:

1. 22 registrierte native Kernkomponenten,
2. 22 Content-Fixtures,
3. echte Runtime-Key-Nutzung,
4. **22/22 Motion-Semantik-Regeln**,
5. erforderliche Mechanismen pro Prototyp,
6. ausgewählte verbotene alte Fehlmuster dürfen nicht zurückkehren.

Das Gate ist bewusst zusätzlich zu TypeScript, Vitest und Remotion-Renderchecks. Es ist kein Ersatz für visuelle Kontrolle.

## Reale Freigabe

Nach jeder Motion-Änderung ist der Source-Fingerprint veraltet. Vor Merge müssen deshalb erneut ausgeführt werden:

```bash
node scripts/verify-content-matched-runtime.mjs
npm run animation-library:verify
npm run animation-library:full-release-check
```

Der vollständige `all`-Release umfasst weiterhin 286 technische Artefakte: 154 Demo-Stills, 88 Content-Stills, 22 Demo-Videos und 22 Content-Videos. Zusätzlich müssen die Content-Varianten visuell auf Lesbarkeit, Überlagerungen, Timing und tatsächliche Verständlichkeit geprüft werden.
