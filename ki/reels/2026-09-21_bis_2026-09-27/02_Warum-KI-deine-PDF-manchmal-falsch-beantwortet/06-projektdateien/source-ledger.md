# Source Ledger — Warum KI deine PDF manchmal falsch beantwortet

**Status:** FERTIG

| Claim-ID | Claim | Typ | Quelle / Referenz | geprüft am | Primärquelle | Einschränkung | Recheck | Status |
|---|---|---|---|---|---|---|---|---|
| C1 | Dateien in OpenAI Vector Stores werden automatisch gechunkt, eingebettet und indexiert. | Produktmechanik | https://developers.openai.com/api/docs/guides/retrieval | 2026-09-23 | JA | gilt für OpenAI Retrieval/Vector Stores | vor Veröffentlichung bei API-Änderung | VERIFIED |
| C2 | OpenAI File Search kann semantische und Keyword-Suche nutzen, um relevante Dateiinhalte vor der Antwort abzurufen. | Produktmechanik | https://developers.openai.com/api/docs/guides/tools-file-search | 2026-09-23 | JA | gilt für OpenAI File Search | vor Veröffentlichung bei API-Änderung | VERIFIED |
| C3 | Vector-Store-Suche liefert relevante Chunks zu einer Query und unterstützt Ranking-Optionen. | Produktmechanik | https://developers.openai.com/api/reference/typescript/resources/vector_stores/methods/search | 2026-09-23 | JA | konkrete Ranking-Implementierung nicht verallgemeinern | vor Veröffentlichung bei API-Änderung | VERIFIED |
| C4 | Andere KI-Produkte können PDFs anders verarbeiten. | Qualifizierung | Script begrenzt die allgemeine Aussage bewusst auf Retrieval-Systeme; OpenAI wird nur für dokumentierte Eigenschaften genannt. | 2026-09-23 | N/A | keine universelle Architektur behaupten | nein | QUALIFIED |
