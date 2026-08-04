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
- [ ] Ergänzende Animationen erklären den Inhalt und sind nicht rein dekorativ.

## 2. Abwechslung

- [ ] Alle acht `animationId`s sind eindeutig.
- [ ] Keine vollständige Szenenkomposition wird wiederholt.
- [ ] Keine zwei aufeinanderfolgenden Szenen besitzen dieselbe Layoutfamilie.
- [ ] Mindestens acht visuelle Familien sind sichtbar unterscheidbar.
- [ ] Nicht mehr als zwei Szenen verwenden Kartenformen als Hauptelement.
- [ ] Bewegungsrichtungen wechseln sinnvoll.
- [ ] Alle sieben Übergangsstile sind visuell unterscheidbar.
- [ ] Übergänge entstehen aus dem vorherigen Inhalt und nicht aus einem universellen Effekt.
- [ ] Keine Szene wirkt wie eine bloße Variante der vorhandenen zehn Standard-Stages.

## 3. Überschriften, Untertitel und Layout

- [ ] Jede Szene besitzt eine klar lesbare obere Überschrift.
- [ ] Alle Sätze werden durch kinetische Untertitel begleitet.
- [ ] Wichtige Wörter reagieren nahe am gesprochenen Zeitpunkt sichtbar stärker.
- [ ] Warnwörter verwenden die Gefahr-Hervorhebung nur inhaltlich begründet.
- [ ] Alle wichtigen Inhalte liegen innerhalb der Safe-Zone.
- [ ] Kein Text wird abgeschnitten.
- [ ] Überschrift, Hauptanimation und Untertitel überlagern sich nicht.
- [ ] Hook und Schluss sind auf einem Mobiltelefon sofort lesbar.
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

- [ ] Szene 1 → 2: Scanner-Wipe übernimmt die Tokens.
- [ ] Szene 2 → 3: Punkt-Tunnel übernimmt die Vektorpunkte.
- [ ] Szene 3 → 4: Thread-Pull übernimmt die Beziehungen.
- [ ] Szene 4 → 5: Branch-Flash öffnet die Wahrscheinlichkeitswege.
- [ ] Szene 5 → 6: Layer-Lift übernimmt den Gewinner.
- [ ] Szene 6 → 7: Word-Stream übernimmt die Ausgabe.
- [ ] Szene 7 → 8: Split-Fold teilt die fertige Antwort.
- [ ] Kein Übergang benötigt eine Schwarzblende.

## 6. Audio

- [ ] Synthetischer Hook-Impact ist sauber und nicht zu laut.
- [ ] Scanner-, Attention-, Layer-, Wort- und Warnakzente liegen auf den vorgesehenen Bewegungen.
- [ ] Soundeffekte unterstützen Bewegungen statt sie zu überladen.
- [ ] Die unterschiedlichen Szenen verwenden nicht denselben universellen Whoosh.
- [ ] Data-URI-WAV-Sounds rendern zuverlässig im finalen MP4.
- [ ] Finale Voiceover-Datei wurde über `voiceoverSrc` eingebunden.
- [ ] Voiceover ist vollständig und ohne Clipping.
- [ ] Voiceover überdeckt die Soundeffekte nicht und wird nicht von ihnen überdeckt.
- [ ] Letzter Satz ist langsamer und verständlich.

## 7. Technische Tests

- [ ] `npm run reel:why-ai:verify`
- [ ] `npm run reel:why-ai:smoke`
- [ ] `npm run reel:why-ai:full-release-check`
- [ ] Composition besitzt exakt 1080 Frames.
- [ ] MP4 besitzt exakt 1080 × 1920 Pixel.
- [ ] MP4 läuft mit 30 FPS.
- [ ] Alle 32 geplanten Testframes wurden gerendert.
- [ ] `release-report.json` meldet 33 von 33 gültigen Artefakten.
- [ ] Renderplan und Release-Bericht besitzen den aktuellen Reel-Quellfingerprint.

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
Status: PHASE 2 IMPLEMENTIERT, NOCH NICHT GETESTET
Grund: Remotion-Code, Überschriften, Untertitel, Übergänge und Sounddesign sind vorhanden; Typecheck, echte Render und visuelle Abnahme stehen aus.
```
