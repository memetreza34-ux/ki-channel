# Source Ledger — Warum KI auf dieselbe Frage anders antwortet

**Status:** PHASE 1 FERTIG

| Claim-ID | Claim | Typ | Quelle / Referenz | geprüft am | Primärquelle | Einschränkung | Recheck | Status |
|---|---|---|---|---|---|---|---|---|
| C1 | Textgenerationsmodelle liefern Wahrscheinlichkeiten für mögliche nächste Tokens. | Mechanismus | https://huggingface.co/docs/text-generation-inference/conceptual/guidance | 2026-09-22 | nein, offizielle Implementierungsdoku | gilt für autoregressive Textgeneration; Reel sagt bewusst „viele Sprachmodelle“ | vor Publish nur bei Scriptänderung | VERIFIED |
| C2 | Sampling wählt aus einer Wahrscheinlichkeitsverteilung einen nächsten Token; Greedy Decoding wählt dagegen den jeweils wahrscheinlichsten Token. | Decoding | https://huggingface.co/docs/transformers/generation_strategies | 2026-09-22 | nein, offizielle Framework-Doku | Verhalten hängt von Decoding-Konfiguration ab | vor Publish bei fachlicher Änderung | VERIFIED |
| C3 | Temperatur moduliert die Wahrscheinlichkeiten der nächsten Tokens und ist als Streuungs-Stellschraube bei Sampling relevant. | Parameter | https://huggingface.co/docs/transformers/main/llm_tutorial | 2026-09-22 | nein, offizielle Framework-Doku | keine pauschale Aussage „Temperatur 0 = garantiert deterministisch“ | vor Publish | VERIFIED |
| C4 | Eine andere Token-Auswahl verändert den folgenden Kontext und damit die nachfolgenden bedingten Token-Wahrscheinlichkeiten. | Mechanismus | https://huggingface.co/docs/transformers/generation_strategies | 2026-09-22 | nein, offizielle Framework-Doku | als autoregressive Folge erklärt, ohne absolute Produktgarantie | vor Publish bei Scriptänderung | QUALIFIED |
