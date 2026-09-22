# Creative QA — Zuschauer vor Technik

Dieses Gate wird nach dem technischen Render und vor jeder Freigabe angewendet.
Ein Reel kann alle Tests bestehen und trotzdem langweilig sein. Dann ist es **nicht fertig**.

## 1. Hook-Gate

Die ersten 1–2 Sekunden muessen bereits mindestens eines zeigen:

- einen sichtbaren Konflikt
- ein ueberraschendes Ergebnis
- eine konkrete Behauptung, die sofort aufgeloest werden will
- einen Vorher/Nachher-Kontrast
- eine Frage, deren Antwort nicht offensichtlich ist

Nicht als Einstieg verwenden:

- Begruessung
- Kanalname
- "Heute erklaere ich dir ..."
- "Du fragst eine KI etwas ..."
- Kontext, der auch nach dem Hook kommen kann

**Test:** Wenn die ersten zwei Sekunden entfernt werden koennten, ohne dass etwas verloren geht, ist der Hook zu schwach.

## 2. Visual-Story-Gate

Jeder bedeutungstragende Beat braucht eine sichtbare Handlung, Beziehung oder Zustandsaenderung.

Bevorzugte Mechaniken:

- Objekt reist von A nach B
- etwas wird sortiert, ausgewaehlt oder verworfen
- zwei Dinge kollidieren oder konkurrieren
- Form/Zustand verwandelt sich
- ein Prozess umgeht oder passiert ein Gate
- Ursache erzeugt sichtbar eine Wirkung
- Quelle/Werkzeug wird verbunden und liefert etwas zurueck
- ein Objekt zerfaellt in Bestandteile oder setzt sich zusammen

Eine Karte, Box oder Pill ist nur erlaubt, wenn **die Karte selbst semantisch das Objekt ist** — zum Beispiel UI, Dokument, Token oder Datensatz.

**Verbot:** abstrakte Aussage automatisch in eine beschriftete Karte packen.

## 3. Karten-Budget

In einem Reel duerfen nicht mehrere aufeinanderfolgende Beats nur aus
"Karte erscheint → Text lesen → naechste Karte" bestehen.

Richtwert:

- hoechstens etwa ein Drittel der Visual Beats darf primaer karten-/boxbasiert sein
- mindestens die Haelfte der Beats soll objekt-, pfad-, form-, raum- oder prozessbasiert funktionieren
- zwei direkt aufeinanderfolgende Szenen duerfen nicht dieselbe visuelle Grammatik wiederholen, ausser die Wiederholung ist Teil der Erklaerung

## 4. Tempo- und Informationsdichte

Nicht hektisch schneiden. Stattdessen Leerlauf entfernen.

Pruefen:

- der Konflikt ist spaetestens nach 2 Sekunden klar
- innerhalb der ersten 5 Sekunden gibt es mindestens eine echte Zustandsaenderung
- keine Szene haelt mehrere Sekunden lang nur einen fertigen statischen Zustand
- ein langer Cue bekommt Micro-Beats, wenn sich seine Bedeutung waehrend des Satzes veraendert
- Voiceover-Dauer wird nicht mit dekorativer Bewegung gefuellt

50–60 Sekunden sind kein Ziel an sich. Wenn 42 Sekunden reichen, wird nicht auf 55 Sekunden gestreckt.

## 5. Fakten-Gate fuer KI-Erklaerungen

Vereinfachung darf das mentale Modell nicht falsch machen.

Besonders pruefen:

- bei Sprachmodellen besser von **Tokens** als pauschal von "Woertern" sprechen
- Wahrscheinlichkeitsverteilung nicht als "immer gewinnt Platz eins" darstellen
- isoliertes Modell von Systemen mit Websuche, Retrieval, Datenbank oder anderen Tools unterscheiden
- nicht pauschal behaupten, moderne KI "pruefe nie nach"
- illustrative Zahlen, Prozentwerte, Zeiten und Rankings nicht wie Messwerte darstellen
- Demo-Werte sichtbar als Beispiel kennzeichnen oder ganz vermeiden

## 6. Pattern-Interrupt-Gate

Ein gutes Reel braucht nicht staendig neue Effekte, aber sichtbare Rhythmuswechsel.

Ueber ein Reel verteilt sollen mehrere dieser Bildsprachen vorkommen, wenn der Inhalt sie rechtfertigt:

- grosse Einzelobjekte
- Pfad/Prozess
- Formveraenderung
- Vergleich/Split
- Dokument/UI
- raeumliche oder 3D-Metapher
- Typografie als kurzer Akzent
- Diagramm nur bei echten Daten-/Gewichtsaussagen

Nicht alle verwenden. Aber nicht das ganze Reel in einer einzigen Karten-Grammatik bauen.

## 7. Text-Gate

Sprecher = Aussage.
Caption = Lesbarkeit.
Animation = Erklaerung.
Header = Kapitelmarker.

Wenn Animationstext nur noch einmal sagt, was Caption und Sprecher bereits sagen, entfernen oder durch sichtbare Handlung ersetzen.

## 8. Schluss-Gate

Das Ende muss die Entscheidung fuer den Zuschauer klar machen.

Beispiele:

- was jetzt tun?
- wann gilt die Aussage?
- welche Grenze bleibt?
- welche Sache soll der Zuschauer pruefen/vermeiden/nutzen?

Kein generischer CTA notwendig.

## 9. Smartphone-Test

Finales MP4 auf Smartphone-Groesse ansehen, nicht nur Stills pruefen.

Fragen:

1. Wuerde ich nach 1 Sekunde weiterschauen?
2. Ist nach 3 Sekunden klar, worum es geht?
3. Passiert sichtbar genug, ohne hektisch zu werden?
4. Wiederholt sich dieselbe Form-/Kartenlogik zu oft?
5. Gibt es mindestens einen visuellen Moment, an den man sich erinnert?
6. Versteht man die Kernmechanik auch kurz ohne Ton?
7. Konkurrieren Header, Animation und Caption miteinander?
8. Wirkt irgendeine Zahl wie ein echter Messwert, obwohl sie nur Demo ist?

Wenn bei 1, 2, 4, 6 oder 8 die Antwort schlecht ausfaellt: **nicht freigeben**.

## 10. Reihenfolge bei Problemen

Wenn das Reel technisch sauber, aber langweilig ist:

1. Hook neu bauen
2. Leerlauf kuerzen
3. kartenlastige Beats durch echte Mechaniken ersetzen
4. visuelle Kontraste/Pattern Interrupts erhoehen
5. erst danach neue Motion-Technik oder neue Library-Komponenten bauen

**Keine neue Animation Library als Ersatz fuer eine schwache Content-Idee.**
