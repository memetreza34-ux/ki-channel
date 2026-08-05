# Alle 8 Szenen

## Globale Regeln

- Format: 1080 × 1920, 30 FPS
- Headline oben, Hauptvisual in der Mitte, Untertitel unten
- keine Menschen, Hände, Roboter oder leuchtenden Gehirne
- Hintergrund fast weiß, Text dunkel, Akzent violett
- Rot nur für Risiko und Fehler
- Grün nur für wirklich geprüfte Ergebnisse
- keine Bilder nur langsam zoomen
- maximal drei starke Bewegungen gleichzeitig
- jede Szene endet mit einem klaren Ergebnis
- Audio: nur Voiceover, keine Musik und keine SFX

---

## Szene 1 — Klingt sicher. Ist es wahr?

**Zeit:** 0,0–4,2 Sekunden  
**Frames:** 0–125  
**Modus:** Bild + Remotion

### Voiceover

> KI kann völlig überzeugend klingen und trotzdem etwas erfinden.

### Bild

```text
04_BILDER/scene-01-confident-answer.png
```

Eine hochwertige gläserne Antwortplatte wirkt elegant und sicher. Das Bild selbst enthält keinen Text und noch keinen Riss.

### Animation

1. Violetter Confidence-Ring zeichnet sich um die Platte.
2. Bei **„überzeugend“** schließt sich der Ring.
3. Bei **„trotzdem“** verliert er leicht seine Symmetrie.
4. Bei **„erfinden“** zieht sich einmal eine rote SVG-Risslinie durch das Glas.
5. Dahinter erscheint `NICHT BELEGT`.
6. Ein einzelnes Glasfragment wird als Übergangsobjekt in Szene 2 getragen.

### Endzustand

Die Antwort sieht weiterhin hochwertig aus, ist aber sichtbar instabil und nicht belegt.

---

## Szene 2 — KI berechnet Fortsetzungen

**Zeit:** 4,2–8,6 Sekunden  
**Frames:** 126–257  
**Modus:** reine Remotion-Animation

### Voiceover

> Das passiert, weil sie keine Wahrheit nachschlägt, sondern Wort für Wort die wahrscheinlichste Fortsetzung berechnet.

### Animation

1. Das Glasfragment aus Szene 1 wird zum Wortchip.
2. Satzanfang: `Die neue KI ist ...`
3. Vier Kandidaten fahren auf getrennten Bahnen ein:
   - schneller — 46 %
   - hilfreich — 28 %
   - günstig — 17 %
   - perfekt — 9 %
4. Die Werte ergeben exakt 100 % und sind als vereinfachtes Beispiel markiert.
5. `WAHRHEIT` liegt außerhalb der Auswahlbahn.
6. Bei **„keine“** blockiert ein rotes Gate das Wahrheitsziel.
7. Bei **„wahrscheinlichste“** reagieren die Prozentwerte.
8. Der Gewinner fährt in den Satz und rastet ein.

### Endzustand

`WAHRSCHEINLICHSTE FORTSETZUNG` ist sichtbar. Der Gewinnerchip fällt in Szene 3 in eine Maschine.

---

## Szene 3 — Fehlende Quellen werden gefüllt

**Zeit:** 8,6–13,2 Sekunden  
**Frames:** 258–395  
**Modus:** freigestelltes Bild + Remotion

### Voiceover

> Fehlen klare Quellen, füllt sie Lücken mit Mustern aus ihren Trainingsdaten.

### Bild

```text
04_BILDER/scene-03-pattern-gap-machine.png
```

Eine freigestellte Editorial-Maschine besitzt eine linke Eingabe, eine zentrale Lücke, drei Musterkanäle und eine rechte Ausgabe.

### Animation

1. Wortchip fällt in die linke Eingabe.
2. Der Quellenkanal öffnet sich, bleibt aber leer.
3. Bei **„Quellen“** erscheint `QUELLE FEHLT`.
4. Bei **„füllt“** bewegen sich drei Musterteile zur Lücke.
5. Bei **„Trainingsdaten“** wird die Musterbibliothek sichtbar.
6. Die Maschine presst daraus eine vollständige Aussagekarte.
7. Das Ergebnis erhält `PLAUSIBEL`, ausdrücklich nicht `BELEGT`.

### Endzustand

Optisch vollständige Aussage, aber keine echte Quelle. Die Karte teilt sich als Übergang in vier Dokumente.

---

## Szene 4 — Hier wird es besonders riskant

**Zeit:** 13,2–17,6 Sekunden  
**Frames:** 396–527  
**Modus:** Bild + lokale Remotion-Fokusse

### Voiceover

> Besonders gefährlich wird es bei Namen, Zahlen, Studien und aktuellen Ereignissen.

### Bild

```text
04_BILDER/scene-04-risk-documents.png
```

Vier getrennte Dokumentobjekte: Identität, Zahlenbericht, Studie und aktuelle Nachricht.

### Animation

1. Kamera bleibt ruhig.
2. Bei **„Namen“** markiert ein Fokusrahmen das Identitätsdokument.
3. Bei **„Zahlen“** läuft ein kurzer Zähler ein.
4. Bei **„Studien“** erscheint ein Quellenstempel.
5. Bei **„aktuellen“** wird ein Datumsfeld geprüft und rot als veraltet markiert.
6. Ein Risikomesser steigt auf `HOCH`.
7. Ein gemeinsamer Warnrahmen umfasst alle vier Kategorien.

### Endzustand

Alle vier Risikokategorien sind gleichzeitig lesbar. Der Warnrahmen wird zum Chatfenster von Szene 5.

---

## Szene 5 — Warnzeichen 1: vage Antworten

**Zeit:** 17,6–22,2 Sekunden  
**Frames:** 528–665  
**Modus:** neutraler Remotion-Chat

### Voiceover

> Drei Warnzeichen helfen dir: Die Antwort bleibt vage,

### UI-Beispiele

```text
Experten gehen davon aus …
Mehrere Studien zeigen …
In vielen Fällen …
```

### Animation

1. Zähler `1/3` erscheint.
2. Ein neutrales Chatfenster öffnet sich.
3. Drei Textblöcke erscheinen schnell, nicht als langsamer Voll-Typewriter.
4. Ein Scanner markiert `Experten`, `mehrere Studien` und `viele Fälle`.
5. Rechts erscheinen `WER?`, `WELCHE?`, `WANN?`.
6. Alle Detailfelder bleiben leer.
7. Bei **„vage“** fällt ein Detailbalken auf null.

### Endzustand

`WARNZEICHEN 1 · KEINE KONKRETEN DETAILS`. Eine Unterstreichung wird zur Browserzeile in Szene 6.

---

## Szene 6 — Warnzeichen 2: tote Quellen

**Zeit:** 22,2–26,6 Sekunden  
**Frames:** 666–797  
**Modus:** neutraler Remotion-Browser

### Voiceover

> Quellen lassen sich nicht öffnen,

### Animation

1. Zähler `2/3` erscheint.
2. Drei neutrale `.example`-Quellenkarten fahren ein.
3. Erster Link zeigt `404`.
4. Zweiter Link zeigt `DOMAIN NICHT GEFUNDEN`.
5. Dritter Link öffnet, enthält aber keinen genannten Beleg.
6. Jeder Fehler erhält genau ein rotes X ohne Dauerpuls.
7. Bei **„nicht“** blockiert ein Zugriffsgate.

### Endzustand

`WARNZEICHEN 2 · QUELLE NICHT PRÜFBAR`. Die letzte Browserkarte teilt sich in zwei Antwortspalten.

---

## Szene 7 — Warnzeichen 3: Details wechseln

**Zeit:** 26,6–31,2 Sekunden  
**Frames:** 798–935  
**Modus:** Remotion-A/B-Vergleich

### Voiceover

> oder konkrete Details wechseln nach einer Nachfrage.

### Fiktive Beispieldaten

**Antwort A**

```text
Jahr: 2022
Name: Projekt Nova
Wert: 48 Prozent
```

**Antwort B**

```text
Jahr: 2021
Name: Projekt Noma
Wert: 61 Prozent
```

### Animation

1. Zähler `3/3` erscheint.
2. Antwort A friert links ein.
3. Nachfragekarte `Bist du sicher?` erscheint in der Mitte.
4. Antwort B erscheint rechts.
5. Vergleichslinien verbinden Jahr, Name und Wert.
6. Bei **„wechseln“** blinken drei Abweichungen einmal rot.
7. Delta-Zähler zeigt `3 WIDERSPRÜCHE`.

### Endzustand

Beide Antworten bleiben gleichzeitig sichtbar. Drei Vergleichslinien werden zu den Prüfgates aus Szene 8.

---

## Szene 8 — Prüfen statt vertrauen

**Zeit:** 31,2–36,0 Sekunden  
**Frames:** 936–1079  
**Modus:** Bild + Remotion-Prozess

### Voiceover

> Deshalb gilt: wichtige Aussagen gegenprüfen, Originalquellen öffnen und bei Unsicherheit ausdrücklich nach Belegen fragen. Klingt eine Antwort sicher, ist sie noch lange nicht wahr.

### Bild

```text
04_BILDER/scene-08-verification-desk.png
```

Abstrakter Prüfdesk ohne Menschen mit drei Stationen: Antwort, Quellenfenster und Ergebnisfach.

### Animation

1. Drei Gates erscheinen:
   - `AUSSAGE GEGENPRÜFEN`
   - `ORIGINALQUELLE ÖFFNEN`
   - `BELEG VERLANGEN`
2. Eine Aussagekarte fährt nacheinander durch alle Gates.
3. Bei **„gegenprüfen“** erscheint ein Vergleichshaken.
4. Bei **„Originalquellen“** öffnet sich das Quellenfenster per Maske.
5. Bei **„Belegen“** rastet ein Beleg-Token ein.
6. Nur die vollständig geprüfte Karte wird grün und erhält `GEPRÜFT`.
7. Eine zweite elegant wirkende, aber ungeprüfte Karte bleibt violett.
8. Bei **„nicht wahr“** verwandelt sich `=` sichtbar in `≠`.

### Endzustand

```text
KI-ANTWORTEN PRÜFEN
SICHER ≠ WAHR
```

Beide Aussagen bleiben bis zum letzten Frame vollständig lesbar. Kein zusätzlicher Outro-Screen.
