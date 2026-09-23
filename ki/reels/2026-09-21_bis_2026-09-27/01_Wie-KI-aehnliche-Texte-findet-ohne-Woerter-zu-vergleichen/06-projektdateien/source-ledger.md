# Source Ledger — Wie KI ähnliche Texte findet, ohne Wörter zu vergleichen

**Status:** PHASE 1 FERTIG

| Claim-ID | Claim | Typ | Quelle / Referenz | geprüft am | Primärquelle | Einschränkung | Recheck | Status |
|---|---|---|---|---|---|---|---|---|
| C1 | Ein Text-Embedding ist ein Vektor beziehungsweise eine Liste aus Gleitkommazahlen. | technische Definition | https://developers.openai.com/api/docs/guides/embeddings | 2026-09-23 | ja | Reel zeigt keine realen Dimensionswerte. | vor Veröffentlichung nur bei API-/Dokuwechsel nötig | VERIFIED |
| C2 | Die Distanz beziehungsweise Ähnlichkeit zwischen Embedding-Vektoren kann die inhaltliche Verwandtschaft von Texten abbilden. | technische Funktionsbeschreibung | https://developers.openai.com/api/docs/guides/embeddings | 2026-09-23 | ja | 2D-Punktwolke ist nur Visualisierung, nicht echter Dimensionsraum. | nein | VERIFIED |
| C3 | Embeddings werden unter anderem für Suche, Clustering und Empfehlungen eingesetzt. | Anwendungsfälle | https://developers.openai.com/api/docs/guides/embeddings | 2026-09-23 | ja | keine Behauptung, dass jedes System exakt dieselbe Implementierung nutzt. | nein | VERIFIED |
| C4 | Semantische Suche kann relevante Resultate mit wenigen oder keinen gemeinsamen Schlüsselwörtern finden. | Retrieval-Prinzip | https://developers.openai.com/api/docs/guides/retrieval | 2026-09-23 | ja | Reel sagt bewusst „kaum dieselben Wörter“ statt absolute Garantie. | vor Veröffentlichung bei wesentlicher Dokuänderung | VERIFIED |
| C5 | Kosinusähnlichkeit ist eine gängige und von OpenAI für Embeddings empfohlene Vergleichsfunktion. | technische Methode | https://developers.openai.com/api/docs/guides/embeddings | 2026-09-23 | ja | nur als Beispiel genannt; andere Distanzmaße existieren. | nein | QUALIFIED |
| C6 | Embedding-Nähe ist keine automatische Wahrheitsprüfung. | Einordnung | Ableitung aus C1–C5: Ähnlichkeitsfunktion bewertet Relatedness, nicht Faktizität | 2026-09-23 | abgeleitete Einordnung | ausdrücklich als Grenze formuliert | nein | QUALIFIED |
