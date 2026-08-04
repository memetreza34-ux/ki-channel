# Review-Checkliste

Die vorherige Fassung wurde technisch erfolgreich gerendert. Danach wurde das echte MP4 visuell und akustisch analysiert und der Code erneut verändert. Alle technischen und visuellen Prüfungen für den **aktuellen** Quellstand sind deshalb wieder offen.

## 1. Inhalt

- [ ] Hook ist innerhalb der ersten Sekunde verständlich.
- [ ] Tokenisierung ist einfach und korrekt dargestellt.
- [ ] Szene 2 zeigt eindeutig `Token → Zahlen-Koordinaten → Punkt`.
- [ ] Beispielvektoren werden als vereinfachte Beispiele und nicht als echte interne Modellwerte verstanden.
- [ ] Szene 3 erklärt kleine und große semantische Distanz mit konkreten Beispielen.
- [ ] Bedeutungsnähe ist ohne Ton verständlich.
- [ ] Attention wird als gewichtete Beziehung dargestellt.
- [ ] Wahrscheinlichkeiten sind als Beispiel-Zwischenstand erkennbar.
- [ ] Modellschichten zeigen Musterverarbeitung, nicht menschliches Verständnis.
- [ ] Wort-für-Wort-Auswahl wird in Szene 7 tatsächlich sichtbar.
- [ ] Schlussaussage `KI-ANTWORTEN PRÜFEN` bleibt mindestens 40 Frames stabil.
- [ ] Quelle, Datum und Beleg sind im Schlussbild lesbar.

## 2. Abwechslung und Choreografie

- [ ] Alle acht vollständigen Animationen sind eindeutig.
- [ ] Keine zwei aufeinanderfolgenden Szenen verwenden dieselbe Layoutfamilie.
- [ ] Keine zwei aufeinanderfolgenden Szenen verwenden dieselbe Hauptbewegung.
- [ ] Szene 1 wirkt geordnet und nicht zufällig verstreut.
- [ ] Szene 2 besitzt keine anonymen Platzhalterboxen oder lange leere Phase.
- [ ] Scanner, Koordinaten und Punktdarstellung reagieren in der richtigen Reihenfolge.
- [ ] Szene 3 besitzt früh erkennbare Cluster und keinen unlesbaren Kamerawinkel.
- [ ] Distanzlinien und Distanzkarten erscheinen ohne Überladung.
- [ ] Szene 5 besitzt einen klaren Gewinner und einen lesbaren End-Hold.
- [ ] Szene 6 besitzt keinen fast leeren Startzustand.
- [ ] Szene 7 nutzt die Bildfläche und erklärt Kandidatenauswahl statt nur Wortkarten einzufliegen.
- [ ] Szene 8 schneidet während der Einflugphase keinen Kartentext ab.
- [ ] Keine Szene zeigt mehr als drei gleichzeitig starke Bewegungen.
- [ ] Keine Szene wird durch dekorative Bewegung unruhig.

## 3. Überschriften und Untertitel

- [ ] Jede Szene besitzt eine lesbare Überschrift innerhalb der Safe-Zone.
- [ ] Untertitel zeigen nur bereits gesprochene Wörter.
- [ ] Das rollende Untertitelfenster zeigt maximal neun Wörter.
- [ ] Kurze Satzanfänge erzeugen keine große leere Untertitelbox.
- [ ] Wichtige Wörter werden deutlich, aber nicht übertrieben hervorgehoben.
- [ ] Warnwörter verwenden die rote Hervorhebung nur inhaltlich begründet.
- [ ] Untertitel kollidieren nicht mit der Hauptanimation.
- [ ] Alle Texte sind auf Smartphone-Größe lesbar.
- [ ] Kein Text wird abgeschnitten.
- [ ] Sekundärtexte und Linien besitzen ausreichenden Kontrast.

## 4. Übergänge

- [ ] Übergänge verdecken weder Überschrift noch Untertitel.
- [ ] Szene 1 → 2 übernimmt den Token-Stack sinnvoll.
- [ ] Szene 2 → 3 übernimmt die vier Punktdarstellungen sinnvoll.
- [ ] Szene 3 → 4 übernimmt Beziehungen sinnvoll.
- [ ] Szene 4 → 5 führt logisch zur Kandidatenauswahl.
- [ ] Szene 5 → 6 übergibt das gewählte Wort verständlich.
- [ ] Szene 6 → 7 übergibt die Ausgabe ohne visuellen Reset.
- [ ] Szene 7 → 8 teilt die fertige Antwort nachvollziehbar.
- [ ] Kein Fade-to-black.
- [ ] Ein Hard Cut wird bevorzugt, falls ein Übergang keinen semantischen Mehrwert besitzt.

## 5. Audio

### Standardfassung

- [ ] `soundMode: "off"` erzeugt ausschließlich Voiceover, falls `voiceoverSrc` gesetzt ist.
- [ ] Ohne Voiceover und mit `soundMode: "off"` ist das MP4 vollständig stumm.
- [ ] Die alte Tonfolge mit 21 Synth-/Noise-Cues ist nicht mehr vorhanden.

### Optionale Minimalfassung

- [ ] `soundMode: "minimal"` rendert höchstens vier Soundereignisse.
- [ ] Keine Noise-Sounds oder hohen Pieptöne.
- [ ] Alle vier Sounds sind deutlich leiser als ein späteres Voiceover.
- [ ] Jeder Sound ist an eine sichtbare Hauptaktion gekoppelt.
- [ ] Die Minimalfassung wirkt im direkten A/B-Vergleich besser als die stumme Fassung.
- [ ] Falls nicht eindeutig besser: finale Fassung bleibt `soundMode: "off"`.

## 6. Technische Prüfung des aktuellen Quellstands

- [ ] `npm run reel:why-ai:verify`
- [ ] `npm run reel:why-ai:smoke`
- [ ] `npm run reel:why-ai:stills`
- [ ] `npm run reel:why-ai:video`
- [ ] `npm run reel:why-ai:check`
- [ ] `npm run reel:why-ai:full-release-check`
- [ ] `npm run motion:verify`
- [ ] Composition besitzt exakt 1080 Frames.
- [ ] MP4 besitzt exakt 1080 × 1920 Pixel.
- [ ] MP4 läuft mit 30 FPS.
- [ ] Alle 32 aktuellen Prüfframes wurden erzeugt.
- [ ] `release-report.json` meldet 33/33 gültige aktuelle Artefakte.
- [ ] Renderplan und Release-Bericht besitzen den aktuellen Quellfingerprint.

## 7. Manuelle Endabnahme

- [ ] Neue stumme Fassung vollständig in normaler Geschwindigkeit angesehen.
- [ ] Kernaussage bleibt ohne Ton verständlich.
- [ ] Neue Fassung auf Smartphone-Größe geprüft.
- [ ] Keine Szene wirkt leer oder unnötig lang.
- [ ] Untertitelrhythmus wirkt nicht hektisch.
- [ ] Szene 1, 2, 3, 6, 7 und 8 wurden besonders auf Zwischenzustände geprüft.
- [ ] Optionaler Minimal-SFX-Render wurde direkt gegen die stumme Fassung verglichen.
- [ ] Finale redaktionelle Freigabe ausdrücklich dokumentiert.

## Abnahmestatus

```text
Status: ZWEITE VISUELLE POLITUR IMPLEMENTIERT, ERNEUTE PRÜFUNG AUSSTEHEND

Vorherige grüne Tests und Render gehören zur alten Fassung.
Der aktuelle Quellstand enthält neue Sound-, Untertitel-, Kontrast- und Szenenänderungen
und darf erst nach neuem Typecheck, Render und visueller Prüfung freigegeben werden.
```
