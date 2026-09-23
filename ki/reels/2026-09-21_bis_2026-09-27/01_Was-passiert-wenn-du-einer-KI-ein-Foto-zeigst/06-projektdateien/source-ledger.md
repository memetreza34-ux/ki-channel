# Source Ledger — Was passiert, wenn du einer KI ein Foto zeigst?

**Status:** FERTIG

| Claim-ID | Claim | Typ | Quelle / Referenz | geprüft am | Primärquelle | Einschränkung | Recheck | Status |
|---|---|---|---|---|---|---|---|---|
| C1 | Transformer-basierte Vision-Systeme können Bilder als Sequenz von Patches verarbeiten. | Architekturprinzip | https://arxiv.org/abs/2010.11929 | 2026-09-23 | JA | ViT ist ein Architekturbeispiel, nicht Beschreibung jedes Modells. | vor Publish nicht nötig | VERIFIED |
| C2 | Aktuelle Vision-Modelle können interne visuelle Tokens/Token-Budgets aus Bild-Patches bilden. | Hersteller-Doku | https://ai.google.dev/gemma/docs/capabilities/vision | 2026-09-23 | JA | Gemma-spezifische Details nicht auf alle Modelle übertragen. | vor Publish bei Current-Claims | VERIFIED |
| C3 | Höhere visuelle Auflösung/mehr visuelle Tokens können für feine Details nützlich sein; weniger Detail kann Geschwindigkeit gegen Genauigkeit tauschen. | Hersteller-Doku | https://ai.google.dev/gemma/docs/capabilities/vision | 2026-09-23 | JA | Script formuliert allgemein und ohne feste Tokenzahlen. | vor Publish bei Produktänderung | VERIFIED |
| C4 | Fokuslinien im Reel sind nur eine Erklärmetapher für relevante Bildinformation, keine echte gemessene Attention-Heatmap. | Darstellungsregel | Creative Brief / Visual Strategy | 2026-09-23 | NEIN | Keine interne Modellmessung behaupten. | nein | QUALIFIED |
