# Review-Checkliste

Die Checkliste wird erst nach echten Tests und Rendern ausgefüllt. Nicht geprüfte Punkte bleiben offen.

## 1. Inhalt

- [ ] Hook ist innerhalb der ersten Sekunde verständlich.
- [ ] Tokenisierung wird korrekt und einfach dargestellt.
- [ ] Zahlen- beziehungsweise Vektordarstellung wird nicht als echte lesbare Modellrechnung ausgegeben.
- [ ] Bedeutungsnähe wird verständlich visualisiert.
- [ ] Attention wird als Gewichtung von Beziehungen und nicht als menschliche Aufmerksamkeit dargestellt.
- [ ] Wahrscheinlichkeiten werden als Beispielwerte erkennbar.
- [ ] Das Reel behauptet nicht, dass ein Modell menschlich versteht.
- [ ] Schlussaussage `KI-ANTWORTEN PRÜFEN` ist klar sichtbar.

## 2. Abwechslung

- [ ] Alle acht `animationId`s sind eindeutig.
- [ ] Keine vollständige Szenenkomposition wird wiederholt.
- [ ] Keine zwei aufeinanderfolgenden Szenen besitzen dieselbe Layoutfamilie.
- [ ] Mindestens acht visuelle Familien sind sichtbar unterscheidbar.
- [ ] Nicht mehr als zwei Szenen verwenden Kartenformen als Hauptelement.
- [ ] Bewegungsrichtungen wechseln sinnvoll.
- [ ] Übergänge entstehen aus dem vorherigen Inhalt und nicht aus einem universellen Effekt.
- [ ] Keine Szene wirkt wie eine bloße Variante der vorhandenen zehn Standard-Stages.

## 3. Layout und Typografie

- [ ] Alle wichtigen Inhalte liegen innerhalb der Safe-Zone.
- [ ] Kein Text wird abgeschnitten.
- [ ] Maximal zwei Textzeilen gleichzeitig.
- [ ] Hook und Schluss sind auf einem Mobiltelefon sofort lesbar.
- [ ] Erklärtexte sind nicht kleiner als die festgelegte Mindestgröße.
- [ ] Texte kollidieren nicht mit animierten Objekten.
- [ ] Keine unbeabsichtigte leere Fläche dominiert länger als 12 Frames.
- [ ] Kontrast ist auf hellem Hintergrund ausreichend.

## 4. Animation

- [ ] Bewegungen sind deterministisch.
- [ ] Kein `Math.random()` während des Renderns.
- [ ] Keine CSS-Transition hängt von Echtzeit ab.
- [ ] Start-, Mittel- und Endframe jeder Szene sehen bewusst gestaltet aus.
- [ ] Keine Bewegung startet oder stoppt ohne visuelle Ursache.
- [ ] Wichtige Aktionen liegen nahe am gesprochenen Schlüsselwort.
- [ ] Keine unnötige Dauerrotation oder Dauerpulsation.
- [ ] Kameraillusionen verursachen keine Unruhe.
- [ ] Abschlussframe bleibt mindestens 40 Frames stabil.

## 5. Übergänge

- [ ] Szene 1 → 2: Tokens werden logisch in den Scanner übernommen.
- [ ] Szene 2 → 3: Vektoren werden logisch zu Punkten.
- [ ] Szene 3 → 4: Clusterpunkte werden logisch zu Wortknoten.
- [ ] Szene 4 → 5: Attention-Verbindung wird logisch zum Pfad.
- [ ] Szene 5 → 6: Gewinnerkapsel wird logisch in die Schichten übernommen.
- [ ] Szene 6 → 7: Schichten geben logisch die Wortkapseln frei.
- [ ] Szene 7 → 8: Satz wird logisch in zwei Wahrheitsvarianten geteilt.
- [ ] Kein Übergang benötigt eine Schwarzblende.

## 6. Audio

- [ ] Voiceover ist vollständig und ohne Clipping.
- [ ] Musik überdeckt keine Silben.
- [ ] Soundeffekte unterstützen Bewegungen statt sie zu überladen.
- [ ] Keine identische Whoosh-Datei zwischen allen Szenen.
- [ ] Wort-Timestamps wurden erzeugt und validiert.
- [ ] Audio-Keywords lösen die vorgesehenen Kernaktionen aus.
- [ ] Letzter Satz ist langsamer und verständlich.

## 7. Technische Tests

- [ ] `npm run motion:verify`
- [ ] `npm run reel:why-ai:stills`
- [ ] `npm run reel:why-ai:video`
- [ ] `npm run reel:why-ai:check`
- [ ] `npm run motion:full-release-check`
- [ ] Composition besitzt exakt 1080 Frames.
- [ ] MP4 besitzt exakt 1080 × 1920 Pixel.
- [ ] MP4 läuft mit 30 FPS.
- [ ] Alle geplanten Testframes wurden gerendert.
- [ ] Release-Bericht enthält keine fehlenden oder ungültigen Dateien.

## 8. Manuelle Endabnahme

- [ ] Reel einmal ohne Ton angesehen: Kernaussage bleibt verständlich.
- [ ] Reel einmal nur mit Ton angehört: Erklärung bleibt vollständig.
- [ ] Reel auf normaler Smartphone-Größe geprüft.
- [ ] Reel in voller Geschwindigkeit geprüft, nicht nur frameweise.
- [ ] Keine Szene wirkt langweilig oder unnötig lang.
- [ ] Keine Szene muss wegen Wiederholung ersetzt werden.
- [ ] Finale Freigabe ausdrücklich dokumentiert.

## Abnahmestatus

```text
Status: NICHT GETESTET
Grund: Planung abgeschlossen; Remotion-Umsetzung und echter Render stehen aus.
```
