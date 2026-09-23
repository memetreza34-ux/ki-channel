# Visual Strategy — Was passiert, wenn du einer KI ein Foto zeigst?

**Status:** FERTIG

## Reel-weite Bildidee

**Dominante visuelle Geschichte:** Eine große selbst gezeichnete Remotion-Schreibtischszene wird vom „Foto“ zum Raster, zu Tokens, zum fokussierten Bildbereich und schließlich zur Antwort transformiert.

**Hero/Memorable Beat:** `vision-05-tiles-lift` + `vision-06-visual-tokens`: Das Bild zerfällt räumlich in 20 Kacheln und wird zu einem Tokenstrom.

**Bewusst vermiedene Wiederholung:** Keine Kartenserie. Karten nur dort, wo Frage/Antwort semantisch echte UI-/Nachrichtenobjekte sind. Eigene SVG-Icons statt Emoji.

## Beat Sheet

| Beat | Sprecherstelle | Bedeutung | Zuschauer muss sehen | Hauptverb | Start → Veränderung → Ende | Modality | Mechanikfamilie | Hero | Asset/Capture |
|---|---|---|---|---|---|---|---|---|---|
| vision-01-photo-enters | Du schickst einer KI dieses Foto | konkreter Input | große Schreibtisch-Illustration | fliegt | leer → Foto kommt mit leichter Perspektive → stabil | REMOTION_NATIVE | Illustration/Objekt | NEIN | none |
| vision-02-question-pin | Wo liegt der Schlüssel? | Frage zum Bild | Frage erscheint direkt am Foto | koppelt | Foto → Frage-Chip dockt an → Verbindung sichtbar | REMOTION_NATIVE | UI + Objekt | NEIN | none |
| vision-03-key-focus | Schlüssel | gesuchtes Detail | Fokus-Ring findet kleinen Schlüssel | fokussiert | Gesamtbild → Ring fährt zum Schlüssel → kurzer Hold | REMOTION_NATIVE | Fokus/Kamera | NEIN | none |
| vision-04-grid-overlay | kleinere Bereiche | Bild wird aufgeteilt | Raster legt sich über Illustration | zerlegt | Foto → Rasterlinien → 20 Bereiche | REMOTION_NATIVE | Mask/Grid | NEIN | none |
| vision-05-tiles-lift | kleine Kacheln | Bereiche werden einzeln | Kacheln heben räumlich ab | explodiert | flaches Bild → Tiles versetzen sich → 2.5D-Feld | REMOTION_NATIVE | 2.5D/Objekt | JA | none |
| vision-06-visual-tokens | Zahlenrepräsentationen | interne Repräsentation | Tiles schrumpfen zu Token-Plättchen | verwandelt | Tiles → lila Tokenobjekte → Tokenstrom | REMOTION_NATIVE | Morph/Token | JA | none |
| vision-07-question-tokens | Dann kommt deine Frage | Textinput | Frage zerlegt sich in Wort-Tokens | zerfällt | Satz → Wortchips → Schlüssel-Token aktiv | REMOTION_NATIVE | Typografie/Token | NEIN | none |
| vision-08-attention-focus | Bei Schlüssel werden ... wichtig | Relevanz | Linien verbinden Schlüssel-Wort mit Bildbereich | verbindet | getrennt → Fokuslinien → relevanter Patch glüht kontrolliert | REMOTION_NATIVE | Nodes/Path | NEIN | none |
| vision-09-background-dim | Unwichtige Bereiche | relative Relevanz | andere Bereiche treten zurück | dimmt | gleichwertig → irrelevante Patches dunkler → Fokus klar | REMOTION_NATIVE | Fokus/Contrast | NEIN | none |
| vision-10-key-zoom | Antwort | relevante Stelle | Kamera fährt in Schlüssel/Tasse-Bereich | zoomt | Gesamtfoto → Crop → Schlüssel groß | REMOTION_NATIVE | Kamera/Illustration | NEIN | none |
| vision-11-answer-types | Schritt für Schritt | Textgenerierung | Antwortwörter bauen sich nacheinander auf | schreibt | leer → Wörter sequenziell → vollständiger Satz | REMOTION_NATIVE | Typografie | NEIN | none |
| vision-12-location-arrow | neben der Tasse | Grounding im Bild | Pfeil verbindet Antwort mit Schlüssel | verankert | Text → Pfeil wächst → Zielring | REMOTION_NATIVE | Path/Annotation | NEIN | none |
| vision-13-blur-loss | unscharfe Details | Grenze | Illustration wird unscharf; Schlüssel verschwindet optisch | verwischt | klar → Blur/Downscale → Detail schwach | REMOTION_NATIVE | Filter/Illustration | NEIN | none |
| vision-14-clear-vs-blur | klare Bilddetails | Vergleich | Split zeigt klar vs unscharf | vergleicht | ein Bild → Split → klarer Vorteil sichtbar | REMOTION_NATIVE | Split/Comparison | NEIN | none |
| vision-15-final-rule | klarer Bild + genauere Frage | praktische Regel | Bild-Icon + Frage-Icon laufen in Fokus-Ziel zusammen | kombiniert | zwei Inputs → Pfeile → fokussiertes Ergebnis | REMOTION_NATIVE | Objekt/Pfad | NEIN | none |
