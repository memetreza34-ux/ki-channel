# Animation Plan — Was passiert, wenn du einer KI ein Foto zeigst?

**Status:** FERTIG FÜR PHASE 2  
**Motion-Standard:** Choreography V1 — kurze Objektbewegungen, gestaffelte Gruppenentwicklung, Shared-Object-Continuity

## Szene 1 — Was sieht die KI? (0–240)

1. Foto/Schreibtisch-Illustration kommt schnell und gewichtet auf die Bühne.
2. Frage dockt an der Illustration an.
3. Fokus-Ring fährt sichtbar zum Schlüssel neben der Tasse.
4. Vor dem Cut wird dasselbe Foto räumlich auf Position und Größe der nächsten Szene überführt; dadurch bleibt das semantische Objekt über die Szenengrenze erhalten.

## Szene 2 — Bild wird zu Tokens (240–630)

5. Raster zeichnet sich zügig über das Foto.
6. Die 20 Kacheln sind echte Ausschnitte derselben Illustration, keine farbigen Ersatzflächen.
7. Jede Kachel bewegt sich nur kurz; die Gruppe entwickelt sich länger durch eine deterministische Center-out-Staffelung.
8. Kacheln heben sich mit CSS-3D-Tiefe, rotateX/rotateY und tiefenabhängigem Schatten räumlich aus dem Bild.
9. Danach morphieren die Kacheln erneut gestaffelt zu lila Token-Plättchen und ordnen sich als Tokenfeld/-strom.

### Choreography Szene 2

```text
Raster                 ca. 18–40
Tile-Lift Wave          Start ca. 64, je Tile ~18 Frames, Center-out-Stagger
Token-Morph Wave        Start ca. 176, je Tile ~20 Frames, Center-out-Stagger
Tokenfeld Settle        ca. 258–306
```

Wichtig: Die Gruppe darf über mehrere Sekunden sichtbar in Entwicklung sein, aber **kein einzelnes Tile** soll 3–5 Sekunden lang dieselbe Interpolation ausführen.

## Szene 3 — Die Frage lenkt den Fokus (630–930)

10. Die vier Wort-Tokens erscheinen gestaffelt; `Schlüssel` wird aktiv.
11. Pfade werden tatsächlich als Linien aufgezeichnet (`pathLength`/Dash-Reveal) und verbinden das aktive Wort mit dem relevanten Bildbereich.
12. Unwichtige Bereiche dimmen; der Schlüsselbereich bleibt kontrastreich.
13. Die Bildfläche reagiert leicht auf den Fokus, statt nur statisch neben den Wort-Tokens zu stehen.

## Szene 4 — Antwort entsteht (930–1140)

14. Kamera/Crop kommt schnell in den Schlüssel-und-Tasse-Bereich.
15. Die sechs Antwortwörter bauen sich als kurze gestaffelte Einzelereignisse auf.
16. Ein gezeichneter Pfeil verbindet „Schlüssel“ mit dem Zielobjekt.

## Szene 5 — Klarheit entscheidet (1140–1500)

17. Linke Bildhälfte verliert sichtbar Details durch Blur.
18. Clear-vs-Blur-Split fährt entschieden auseinander.
19. Die finale Regel wird nicht als kompletter Block eingeblendet: klares Bild → genaue Frage → besserer Fokus erscheinen als kausale, gestaffelte Folge.

## Verbindliche Motion-Regeln für dieses Reel

- zentrale Kurven aus `ki/src/motion/easing.ts`
- Gruppenstaffelung über `ki/src/motion/choreography.ts`
- keine lokale Universal-`ease()` für alle Bewegungsarten
- pro Objekt kurze aktive Bewegung; längere Szenendynamik entsteht durch Reihenfolge und Zustandswechsel
- gleicher semantischer Gegenstand soll über Szenengrenzen möglichst weitergeführt werden
- keine dekorative Transition, wenn Objektkontinuität die stärkere Erklärung ist
- Manifest/Fingerprint ist Planprüfung; finaler Render bleibt Pflichtbeweis

## Timing-Regel Phase 3

Nach echtem Voiceover werden die Hauptaktionen auf reale Wortstarts gesetzt. Besonders: `Foto`, `Schlüssel`, `Kacheln`, `Frage`, `Schlüssel`, `Antwort`, `unscharfe`, `klarer`, `genauer`.

Dabei werden primär die **Startframes der Choreography-Phasen** verschoben. Die kurzen Objekt-Dauern und die Staffelungslogik bleiben erhalten, außer das reale Sprechtempo verlangt begründet etwas anderes.
