# Review-Checkliste

Stand nach echten Tests und Rendern in diesem Durchlauf. Nur tatsächlich visuell/technisch geprüfte Punkte sind abgehakt. Nicht bestandene oder nicht ausgeführte Punkte bleiben offen.

## 1. Inhalt

- [ ] Hook ist innerhalb der ersten Sekunde verständlich. (nicht mit Zielgruppe/Ton geprüft)
- [x] Tokenisierung wird korrekt und einfach dargestellt. (Frame 38/113, Stills + MP4-Stichprobe)
- [ ] Zahlen- beziehungsweise Vektordarstellung wird nicht als echte lesbare Modellrechnung ausgegeben. (nicht separat geprüft)
- [x] Bedeutungsnähe wird verständlich visualisiert. (Frame 353, Cluster-Szene)
- [x] Attention wird als Gewichtung von Beziehungen und nicht als menschliche Aufmerksamkeit dargestellt. (Frame 399/488)
- [x] Wahrscheinlichkeiten werden als Beispielwerte (%) erkennbar. (Frame 653/938)
- [x] Das Reel behauptet nicht, dass ein Modell menschlich versteht. (Frame 1079: "kein menschliches Verständnis")
- [x] Schlussaussage `KI-ANTWORTEN PRÜFEN` ist klar sichtbar. (Frame 1079)
- [ ] Ergänzende Animationen erklären den Inhalt und sind nicht rein dekorativ. (subjektiv, nicht abschließend bewertet)

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
- [ ] Alle wichtigen Inhalte liegen innerhalb der Safe-Zone. (stichprobenartig ok, nicht für alle 32 Frames einzeln vermessen)
- [x] Kein Text wird abgeschnitten. (in allen geprüften Stills)
- [x] Überschrift, Hauptanimation und Untertitel überlagern sich nicht mehr. (Bug gefunden und behoben: Layer-Lift-Übergang lag vorher mit zIndex 80 über Titel/Untertitel und verdeckte beide am Übergang Szene 5→6; jetzt zIndex 25, unter Titel/Untertitel)
- [ ] Hook und Schluss sind auf einem Mobiltelefon sofort lesbar. (nicht auf echtem Gerät getestet)
- [x] Texte kollidieren nicht mit animierten Objekten in den geprüften Stichproben. (Bug gefunden und behoben: Scanner-Balken in Szene 1 überdeckte "deinen"/"Satz")
- [ ] Keine unbeabsichtigte leere Fläche dominiert länger als 12 Frames. (nicht frameweise vermessen; einzelne Szenenstart-Frames wirken bewusst leer durch Fade-in, nicht als Fehler eingestuft)
- [x] Kontrast ist auf hellem Hintergrund ausreichend. (in allen geprüften Stills)

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

- [x] `npm run reel:why-ai:verify` (grün nach Fixes an vitest.config.ts, ki/tsconfig.json, renderPlan.test.ts, AttentionThreadWeaveScene.tsx)
- [x] `npm run reel:why-ai:smoke` (10 Testbilder erzeugt und geprüft)
- [x] `npm run reel:why-ai:stills` (32 Prüfbilder erzeugt und geprüft)
- [x] `npm run reel:why-ai:video`
- [x] `npm run reel:why-ai:check` (33/33 gültig)
- [x] `npm run reel:why-ai:full-release-check`
- [x] `npm run motion:verify` (bestehendes Motion-System weiterhin grün, 0 Fehler)
- [x] Composition besitzt exakt 1080 Frames. (ffprobe: nb_frames=1080, duration=36.000000)
- [x] MP4 besitzt exakt 1080 × 1920 Pixel. (ffprobe: width=1080, height=1920)
- [x] MP4 läuft mit 30 FPS. (ffprobe: r_frame_rate=30/1)
- [x] Alle 32 geplanten Testframes wurden gerendert.
- [x] `release-report.json` meldet 33 von 33 gültigen Artefakten.
- [x] Renderplan und Release-Bericht besitzen den aktuellen Reel-Quellfingerprint. (sourceFingerprint stimmt in plan- und release-report.json überein)

## 8. Manuelle Endabnahme

- [ ] Reel einmal ohne Ton angesehen: Kernaussage bleibt verständlich. (nur Stichproben-Frames geprüft, nicht vollständig frameweise/als Video abgespielt)
- [ ] Reel einmal nur mit Ton angehört: Erklärung bleibt vollständig. (Audiospur technisch vorhanden/geprüft per ffprobe, nicht angehört)
- [ ] Reel auf normaler Smartphone-Größe geprüft. (nicht auf echtem Gerät)
- [ ] Reel in voller Geschwindigkeit geprüft, nicht nur frameweise. (kein Player verfügbar; stattdessen Stichproben-Frames per ffmpeg aus dem MP4 gezogen und geprüft)
- [ ] Keine Szene wirkt langweilig oder unnötig lang. (nicht abschließend beurteilt)
- [ ] Keine Szene muss wegen Wiederholung ersetzt werden. (nicht abschließend beurteilt)
- [x] Finale technische Freigabe dokumentiert (release-report.json, passed: true).

## Abnahmestatus

```text
Status: TECHNISCH VERIFIZIERT, VISUELL STICHPROBENARTIG GEPRÜFT UND KORRIGIERT
Technische Prüfung (verify, smoke, stills, video, check, full-release-check, motion:verify) ist grün.
Gefundene und behobene Fehler: TS/Test-Konfigurationsfehler (Abschnitt Phase-2-Implementation),
Scanner-Balken-Überlagerung in Szene 1, Übergangs-Overlay über Titel/Untertitel bei allen 7 Übergängen.
Nicht möglich in dieser Umgebung: Abspielen des MP4 in Echtzeit/mit Ton, Test auf echtem Smartphone,
abschließende redaktionelle Bewertung von Tempo/Langeweile/Wiederholungsgefühl.
```
