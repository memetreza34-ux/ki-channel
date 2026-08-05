# Review-Checkliste

Kein Punkt darf vor tatsächlicher Ausführung als bestanden markiert werden.

## 1. Paket und Assets

- [ ] `node scripts/prepare-codex-reel.mjs 2026-08-05-warum-ki-halluziniert --ready` besteht.
- [ ] Alle vier Pflichtbilder existieren an den exakten Manifestpfaden.
- [ ] `voiceover.wav` existiert und ist nicht leer.
- [ ] Kein Pflichtasset wurde durch einen Platzhalter ersetzt.
- [ ] Bilder enthalten keine Fantasieschrift, Logos, Menschen, Hände oder Roboterfiguren.
- [ ] Alle Bilder besitzen genügend freien Raum für Headline und Untertitel.

## 2. Inhalt

- [ ] Hook ist innerhalb der ersten Sekunde verständlich.
- [ ] Das Reel behauptet nicht, Sprachmodelle würden niemals Quellen verwenden.
- [ ] Szene 2 erklärt Fortsetzungswahrscheinlichkeit statt Wahrheitssuche.
- [ ] Szene 2 kennzeichnet Werte als vereinfachtes Beispiel.
- [ ] Szene 3 unterscheidet plausibles Muster von belegter Aussage.
- [ ] Szene 4 zeigt Namen, Zahlen, Studien und aktuelle Ereignisse klar.
- [ ] Szene 5 erklärt vage Formulierungen mit konkreten Beispielen.
- [ ] Szene 6 verwendet ausschließlich neutrale `.example`-Domains.
- [ ] Szene 7 kennzeichnet alle Vergleichsdaten als fiktives Beispiel.
- [ ] Szene 8 zeigt einen nachvollziehbaren Prüfworkflow.
- [ ] Schlussaussage `SICHER ≠ WAHR` bleibt vollständig lesbar.

## 3. Animation und Abwechslung

- [ ] Acht vollständige Animationen sind visuell eindeutig.
- [ ] Keine Vollanimation wird doppelt verwendet.
- [ ] Keine benachbarten Szenen teilen dieselbe Layoutfamilie.
- [ ] Keine benachbarten Szenen teilen dieselbe Bewegungssignatur.
- [ ] Keine Szene hat mehr als drei konkurrierende starke Bewegungen.
- [ ] Jede Szene besitzt einen sichtbaren Startzustand.
- [ ] Jede Szene endet mit einem stabilen Resultat.
- [ ] Kein Bild wird nur mit einem generischen Dauerzoom gezeigt.
- [ ] Bildszenen verwenden Masken, Fokus, Overlays oder Zustandsänderungen mit inhaltlicher Funktion.
- [ ] Keine dekorativen Partikel oder Dauerpulse lenken ab.

## 4. Szenenprüfung

### Szene 1

- [ ] Confidence-Ring ist sauber und nicht zu dominant.
- [ ] Riss erscheint exakt bei `erfinden`.
- [ ] Glassplitter-Übergang bleibt innerhalb der Safe-Zone.

### Szene 2

- [ ] Kandidatenwerte ergeben exakt 100 Prozent.
- [ ] `WAHRHEIT` liegt sichtbar außerhalb der Auswahlbahn.
- [ ] Gewinner und Satzfortsetzung sind auch ohne Ton verständlich.

### Szene 3

- [ ] Leerer Quellenkanal ist deutlich sichtbar.
- [ ] Musterteile füllen die Lücke nachvollziehbar.
- [ ] Ergebniszustand lautet `PLAUSIBEL`, nicht `BELEGT`.

### Szene 4

- [ ] Vier Dokumente bleiben vollständig sichtbar.
- [ ] Fokusrahmen springt zum gesprochenen Begriff.
- [ ] Datumsprüfung für `AKTUELLES` ist lesbar.

### Szene 5

- [ ] UI ist neutral und keine Marken-Kopie.
- [ ] Vage Phrasen sind gut lesbar.
- [ ] `WER?`, `WELCHE?`, `WANN?` bleiben bewusst unbeantwortet.

### Szene 6

- [ ] 404, Domainfehler und fehlender Beleg sind drei unterschiedliche Zustände.
- [ ] Cursor verdeckt keinen Text.
- [ ] Rote Fehlerzeichen pulsieren nicht dauerhaft.

### Szene 7

- [ ] Antwort A und B bleiben gleichzeitig sichtbar.
- [ ] Jahr, Name und Wert sind korrekt verbunden.
- [ ] Delta zeigt exakt drei Widersprüche.

### Szene 8

- [ ] Alle drei Prüfgates sind in richtiger Reihenfolge.
- [ ] Nur geprüfte Karte wird grün.
- [ ] Ungeprüfte Karte bleibt überzeugend, aber klar ungeprüft.
- [ ] CTA und `SICHER ≠ WAHR` bleiben bis Frame 1079 sichtbar.

## 5. Überschriften und Untertitel

- [ ] Jede Szene besitzt eine lesbare Überschrift.
- [ ] Untertitel zeigen nur bereits gesprochene Wörter.
- [ ] Maximal neun Wörter sind gleichzeitig sichtbar.
- [ ] UI-Text und Untertitel sehen nicht identisch aus.
- [ ] Wichtige Wörter sind synchron zur Hauptbewegung hervorgehoben.
- [ ] Rot wird nur für Risiko, Negation oder Widerspruch verwendet.
- [ ] Grün wird nur für tatsächlich geprüfte Zustände verwendet.
- [ ] Kein Text wird abgeschnitten oder überlappt.
- [ ] Smartphone-Lesbarkeit ist bestätigt.
- [ ] Finale Audio-Wortzeiten haben die Schätzwerte ersetzt.

## 6. Audio

- [ ] Voiceover ist die einzige Audiospur.
- [ ] Keine Musik vorhanden.
- [ ] Keine synthetischen Beeps oder Noise-Sweeps vorhanden.
- [ ] Keine Soundeffekte pro Wort vorhanden.
- [ ] Voiceover ist vollständig und ohne abgeschnittene Satzenden.
- [ ] Szenenwechsel wirken trotz fehlender SFX rhythmisch sauber.

## 7. Technische Prüfung

- [ ] TypeScript besteht für den aktuellen Quellstand.
- [ ] Alle fokussierten Tests bestehen.
- [ ] Composition ist 1080 × 1920 bei 30 FPS.
- [ ] Composition besitzt exakt 1080 Frames.
- [ ] Alle acht Szenen besitzen fortlaufende Framebereiche.
- [ ] Alle 32 Checkpoint-PNGs wurden aus dem aktuellen Quellstand gerendert.
- [ ] Checkpoint-PNGs besitzen gültige Signatur und richtige Abmessungen.
- [ ] Aktuelles MP4 wurde gerendert.
- [ ] MP4 besitzt gültigen Header und ausreichende Dateigröße.
- [ ] Release-Bericht verwendet den aktuellen Quell- und Paketfingerprint.

## 8. Manuelle Endabnahme

- [ ] Alle Checkpoints wurden einzeln visuell geprüft.
- [ ] MP4 wurde vollständig in normaler Geschwindigkeit angesehen.
- [ ] MP4 wurde auf Smartphone-Größe geprüft.
- [ ] Kernaussage ist ohne Ton verständlich.
- [ ] Keine Szene wirkt leer, überladen oder unfertig.
- [ ] Übergänge verdecken weder Headline noch Untertitel.
- [ ] Keine visuellen Platzhalter oder Debug-Elemente sichtbar.
- [ ] Bekannte Restprobleme sind dokumentiert.
- [ ] Finale redaktionelle Freigabe ist ausdrücklich dokumentiert.

## Aktueller Status

```text
PLANUNG VOLLSTÄNDIG
BILDER NOCH NICHT EINGEFÜGT
VOICEOVER NOCH NICHT EINGEFÜGT
CODEX-ASSEMBLY NOCH NICHT AUSGEFÜHRT
TESTS NOCH NICHT AUSGEFÜHRT
RENDER NOCH NICHT AUSGEFÜHRT
VISUELLE FREIGABE NOCH NICHT ERTEILT
```
