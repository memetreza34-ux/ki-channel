# Source Ledger — Warum KI beim Rechnen scheitern kann

**Status:** VERIFIED / QUALIFIED

| Claim-ID | Claim | Typ | Quelle / Referenz | geprüft am | Primärquelle | Einschränkung | Recheck | Status |
|---|---|---|---|---|---|---|---|---|
| C1 | GPT-artige Sprachmodelle erzeugen Text autoregressiv bzw. Token für Token. | Grundlagenclaim | Brown et al., 2020, Language Models are Few-Shot Learners — https://arxiv.org/abs/2005.14165 | 2026-09-30 | ja | Reel vereinfacht „wahrscheinliches nächstes Token“ didaktisch. | nein | VERIFIED |
| C2 | Zahlen werden vom Sprachmodell über Token-Repräsentationen verarbeitet; Tokenisierung kann Ziffern/Zahlen unterschiedlich segmentieren. | Grundlagenclaim | OpenAI tiktoken — https://github.com/openai/tiktoken | 2026-09-30 | ja | Nicht behaupten, jede Ziffer sei immer genau ein Token. | bei Tokenizer-Wechsel | QUALIFIED |
| C3 | Program-/Tool-gestützte Ansätze können Berechnungen an einen Interpreter auslagern und numerisches Reasoning verbessern. | Forschungsclaim | Gao et al., Program-Aided Language Models — https://arxiv.org/abs/2211.10435 | 2026-09-30 | ja | Kein pauschales Versprechen für jedes Produkt; konkrete Tool-Implementierung variiert. | nein | QUALIFIED |
| C4 | Ein falscher Zwischenschritt kann nachfolgende Rechenschritte falsch machen. | logische Mechanik | elementare Rechenlogik; im Reel als Beispiel, nicht als Benchmark | 2026-09-30 | n/a | Keine Fehlerquote oder Modell-Benchmark nennen. | nein | VERIFIED |

## Nicht behaupten

- „KI kann nicht rechnen.“
- „Jede Rechnung ohne Tool ist falsch.“
- „Tool-Nutzung garantiert immer ein korrektes Endergebnis.“
