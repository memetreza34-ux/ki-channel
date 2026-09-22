# Visual Strategy

**Status:** FERTIG

| Beat | Sprecherstelle | Bedeutung | Zuschauer muss sehen | Hauptverb | Start → Veränderung → Ende | Modality | Mechanik | Entscheidung |
|---|---|---|---|---|---|---|---|---|
| B1 | Für dich ist Berlin ein Wort… | Menschliche Wortgrenze ≠ Modellgrenze | Riesiges BERLIN fährt in einen Slicer und zerfällt | schneiden | ein Wort → Schnitt → mehrere Segmente | REMOTION_NATIVE | object-slicer | NEW_BUILD |
| B2 | Bevor ein Sprachmodell… | Tokenisierung geschieht vor Verarbeitung | Segmente werden auf einem Datenband geordnet | zerlegen | Text → Tokenstücke → geordneter Strom | REMOTION_NATIVE | conveyor-tokenizer | NEW_BUILD |
| B3 | Ein Token kann… | Tokens haben unterschiedliche Granularität | Vier Beispiele morphologisch: Wort, Wortteil, Zeichen, Satzzeichen | variieren | gleiche Bühne → vier Größen → gemeinsame Tokenklasse | REMOTION_NATIVE | scale-morph | NEW_BUILD |
| B4 | Welche Stücke entstehen… | Encoding/Modell beeinflusst Zerlegung | Zwei Zahnräder/Encoding-Weichen schicken denselben Text in unterschiedliche abstrakte Segmentmuster | umleiten | Text → Encoding-Weiche → andere Segmentierung | REMOTION_NATIVE | split-routing | NEW_BUILD |
| B5 | Tokenzahl ist nicht Wortzahl… | Wort- und Tokenzählung sind verschiedene Größen | Zwei mechanische Zähler laufen auseinander, ohne konkrete Messzahl als Fakt | vergleichen | gekoppelt → entkoppelt → klare Trennung | REMOTION_NATIVE | dual-counter | NEW_BUILD |
| B6 | Leerzeichen und Großschreibung… | Schreibweise beeinflusst Tokenisierung | Zeichenkette verändert Case/Spacing und die abstrakten Schnittmarken verschieben sich | verändern | Text A → Schreibweise ändert sich → Schnittgrenzen wandern | REMOTION_NATIVE | text-transform-map | NEW_BUILD |
| B7 | Diese Tokens sind… | Tokens sind die eigentlichen Verarbeitungseinheiten | Tokenstücke beschleunigen in einen Modellkern, werden verarbeitet und verlassen ihn als Antwortstrom | verarbeiten | Tokenstrom → Modellkern → Outputstrom | REMOTION_NATIVE | token-core-flow | NEW_BUILD |
| B8 | Deshalb zählen lange Prompts… | Praktischer Schluss | Wörter-Zähler wird zurückgeschoben, Token-Zähler/Tokenstrom bleibt als relevante Größe | priorisieren | Wortzählung im Fokus → Tokenisierung übernimmt → Schlussbild | REMOTION_NATIVE | focus-transfer | NEW_BUILD |

**Hero/Memorable Beat:** B1 – das physische Wort `BERLIN` wird durch einen großen Slicer gezogen und in räumliche Token-Bausteine getrennt.

## Diversity-Regeln
- 0/8 Beats nutzen Card als Hauptprimitive.
- Keine zwei aufeinanderfolgenden Beats verwenden dieselbe Layout-Familie oder Motion-Signatur.
- Mindestens object, path, typography, nodes/mixed und pseudo-3D kommen vor.
- Harte Schnitte zwischen semantisch neuen Beats; fortlaufender Tokenstrom darf innerhalb B1→B2 räumlich anschließen.
