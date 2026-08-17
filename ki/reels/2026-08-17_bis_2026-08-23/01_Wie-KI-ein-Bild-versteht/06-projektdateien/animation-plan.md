# Animation Plan — Wie KI ein Bild versteht

Alle Beats: `NEW_BUILD` + `REMOTION_NATIVE`.

## image-01 — Foto wird zu Daten

**Beat 1**
Sprecherstelle → „Für eine KI ist ein Foto nicht zuerst Katze, Auto oder Text.“
→ Bedeutung → menschliche Kategorie ist nicht der technische Startzustand
→ Startzustand → großes stilisiertes Foto ist ab Frame 0 sichtbar
→ Veränderung → Kategorie-Chips „KATZE / AUTO / TEXT“ erscheinen kurz und werden ausgeblendet
→ Endzustand → nur das Bild bleibt
→ NEW_BUILD · REMOTION_NATIVE
→ Timing → frühe erste Satzhälfte

**Beat 2**
Sprecherstelle → „Es beginnt als Bilddaten“
→ Bedeutung → visuelle Eingabe wird numerisch repräsentiert
→ Startzustand → Foto
→ Veränderung → klares 4×3-Raster legt sich über das Bild
→ Endzustand → Raster dominiert
→ NEW_BUILD · REMOTION_NATIVE
→ Timing → Satzwechsel

**Beat 3**
Sprecherstelle → „Helligkeit und Farbe“
→ Bedeutung → Pixel-/Bilddaten tragen numerische Farb-/Intensitätsinformation
→ Startzustand → Raster
→ Veränderung → wenige große RGB-/Helligkeitswerte ersetzen Fotoflächen
→ Endzustand → lesbare Datenkarte statt Mikrotext
→ NEW_BUILD · REMOTION_NATIVE
→ Timing → Szenenende

## image-02 — Bildbereiche werden Merkmale

**Beat 4**
Sprecherstelle → „häufig in kleinere Bereiche“
→ Bedeutung → Bildencoder arbeiten mit lokalen Bildrepräsentationen
→ Startzustand → großes Raster
→ Veränderung → Rasterteile lösen sich als kontrollierte Kacheln
→ Endzustand → Kacheln stehen in einer Pipeline
→ NEW_BUILD · REMOTION_NATIVE
→ Timing → Szenenbeginn

**Beat 5**
Sprecherstelle → „interne Zahlenrepräsentationen“
→ Bedeutung → Bildteile werden zu Vektorrepräsentationen
→ Startzustand → Kacheln
→ Veränderung → jede Kachel wird zu einem kurzen Vektor-/Balkenmuster
→ Endzustand → visuelle Vektorkarten
→ NEW_BUILD · REMOTION_NATIVE
→ Timing → Mitte erster Satz

**Beat 6**
Sprecherstelle → „Formen, Kanten, Farben und Beziehungen“
→ Bedeutung → relevante visuelle Merkmale/Beziehungen werden repräsentiert
→ Startzustand → Vektorkarten
→ Veränderung → vier große Karten FORM / KANTE / FARBE / POSITION aktivieren sich nacheinander und verbinden sich
→ Endzustand → zusammenhängende Merkmalsstruktur
→ NEW_BUILD · REMOTION_NATIVE
→ Timing → zweiter Satz

## image-03 — Visuelles trifft Sprache

**Beat 7**
Sprecherstelle → „mit Sprache verknüpft“
→ Bedeutung → visuelle und sprachliche Repräsentationen werden gemeinsam nutzbar
→ Startzustand → visuelle Merkmalsknoten links, Sprachknoten rechts
→ Veränderung → breite lila Brücke verbindet beide Seiten
→ Endzustand → gemeinsame Multimodal-Zone
→ NEW_BUILD · REMOTION_NATIVE
→ Timing → Szenenbeginn

**Beat 8**
Sprecherstelle → „beschreiben, was es erkennt“
→ Bedeutung → visuelle Information kann in Sprache ausgegeben werden
→ Startzustand → verbundene Zone
→ Veränderung → kurze Antwortkarte entsteht
→ Endzustand → `BESCHREIBUNG` sichtbar
→ NEW_BUILD · REMOTION_NATIVE
→ Timing → Beginn zweiter Satz

**Beat 9**
Sprecherstelle → „Fragen … oder Text im Bild“
→ Bedeutung → mehrere multimodale Aufgaben sind möglich
→ Startzustand → eine Antwortkarte
→ Veränderung → drei große Task-Karten FRAGE / TEXT / OBJEKT wechseln als Fokus
→ Endzustand → drei Aufgaben sauber lesbar
→ NEW_BUILD · REMOTION_NATIVE
→ Timing → Szenenende

## image-04 — Grenzen

**Beat 10**
Sprecherstelle → „kein menschliches Sehen“
→ Bedeutung → Modellwahrnehmung ist nicht identisch mit menschlicher Wahrnehmung
→ Startzustand → klares Auge-Symbol und Modellraster getrennt
→ Veränderung → Gleichheitszeichen kippt zu `≠`
→ Endzustand → eindeutiger Unterschied
→ NEW_BUILD · REMOTION_NATIVE
→ Timing → Szenenbeginn

**Beat 11**
Sprecherstelle → „Kleine Schrift … verdeckte Objekte“
→ Bedeutung → Details und Okklusion können Fehler verursachen
→ Startzustand → 2×2-Problemmatrix neutral
→ Veränderung → SCHRIFT und VERDECKT markieren sich rot
→ Endzustand → zwei Warnzustände
→ NEW_BUILD · REMOTION_NATIVE
→ Timing → erste Hälfte zweiter Satz

**Beat 12**
Sprecherstelle → „Perspektiven … räumliche Beziehungen“
→ Bedeutung → ungewöhnliche Geometrie/Relationen sind ebenfalls schwierig
→ Startzustand → zwei verbleibende Karten neutral
→ Veränderung → PERSPEKTIVE und RAUM markieren sich rot; Fragezeichen erscheint zentral
→ Endzustand → komplette Fehler-Matrix
→ NEW_BUILD · REMOTION_NATIVE
→ Timing → Szenenende

## image-05 — Fokus geben

**Beat 13**
Sprecherstelle → „Sag, welche Aufgabe du hast“
→ Bedeutung → Ziel explizit machen
→ Startzustand → großes Bild links, leere Prompt-Pipeline rechts
→ Veränderung → Chip AUFGABE aktiviert sich
→ Endzustand → erster definierter Schritt
→ NEW_BUILD · REMOTION_NATIVE
→ Timing → frühe Szene

**Beat 14**
Sprecherstelle → „welcher Bereich wichtig ist und in welchem Format“
→ Bedeutung → räumlichen Fokus + Ausgabestruktur definieren
→ Startzustand → AUFGABE aktiv
→ Veränderung → BEREICH und FORMAT aktivieren; Fokusrahmen im Bild zieht sich auf relevanten Ausschnitt zusammen
→ Endzustand → drei klare Vorgaben + enger Bildfokus
→ NEW_BUILD · REMOTION_NATIVE
→ Timing → Mitte

**Beat 15**
Sprecherstelle → „Je klarer der Fokus, desto weniger … erraten“
→ Bedeutung → weniger offene visuelle Suchfläche, klarere Aufgabe
→ Startzustand → fokussiertes Bild + drei Vorgaben
→ Veränderung → breite Suchfläche kollabiert zu einem klaren Pfad; finale Karte `WENIGER RATEN` erscheint erst nahe Schluss
→ Endzustand → `KLARER FOKUS → WENIGER RATEN`
→ NEW_BUILD · REMOTION_NATIVE
→ Timing → bis zur letzten Sprecherphrase; nur kurzer End-Hold
