# Creative QA — Zuschauer vor Technik

Dieses Gate wird nach dem technischen Render und vor jeder Freigabe angewendet.
Ein Reel kann alle Tests bestehen und trotzdem langweilig sein. Dann ist es **nicht fertig**.

## 1. Hook-Gate

Die ersten 1–2 Sekunden müssen mindestens eines zeigen:

- sichtbaren Konflikt
- überraschendes Ergebnis
- konkrete Situation, die sofort eine Frage erzeugt
- Vorher/Nachher-Kontrast
- Frage, deren Antwort nicht offensichtlich ist

Nicht als Einstieg:

- Begrüßung
- Kanalname
- „Heute erkläre ich dir …“
- Fachbegriff ohne konkreten Zuschaueranker
- Kontext, der auch nach dem Hook kommen kann

**Test:** Wenn man zuerst erklären muss, warum der Begriff interessant ist, ist der Hook zu abstrakt.

## 2. Themen-Gate

Vor dem visuellen Review prüfen:

- Ist das Thema selbst interessant oder nur technisch korrekt?
- Ist der Payoff mehr als „Begriff verstanden“?
- Gibt es eine konkrete Alltagssituation, Produktwirkung oder sichtbare Konsequenz?
- Würde ein Nicht-Techniker nach 2 Sekunden wissen, warum er bleiben soll?

Wenn nicht: **Reel nicht durch mehr Animation retten. Thema/Angle neu bauen.**

## 3. Visual-Story-Gate

Jeder bedeutungstragende Beat braucht sichtbare Handlung, Beziehung oder Zustandsänderung.

Bevorzugt:

- Objekt reist von A nach B
- etwas wird sortiert, ausgewählt oder verworfen
- zwei Dinge konkurrieren
- Form/Zustand verwandelt sich
- Bild/Objekt zerfällt und setzt sich neu zusammen
- Kamera fokussiert eine relevante Stelle
- Frage löst sichtbare Aufmerksamkeit/Fokus aus
- Ursache erzeugt sichtbar eine Wirkung

Eine Karte ist nur erlaubt, wenn die Karte selbst semantisch das Objekt ist.

## 4. Remotion-Illustrations-Gate

Bei Themen mit realen Dingen oder räumlicher Situation prüfen, ob das Reel mindestens eine größere **Remotion-native Illustration/Objektszene** enthält:

- SVG-/CSS-Szene
- Objekt/Umgebung
- pseudo-fotografische 2.5D-Illustration
- eigene Vector-Icons
- Clipping/Masken/Layer/Perspektive

Nicht akzeptieren, wenn ein anschauliches Thema unnötig auf Karten + Labels reduziert wurde.

## 5. Karten-Budget

Richtwert V2.1:

- höchstens etwa ein Viertel der Visual Beats primär karten-/boxbasiert
- mindestens die Hälfte objekt-, pfad-, form-, raum-, illustration- oder prozessbasiert
- keine zwei langen Szenen hintereinander mit derselben Karten-Grammatik

## 6. Tempo- und Motion-Dichte

Prüfen:

- Konflikt spätestens nach 2 Sekunden klar
- innerhalb der ersten 3 Sekunden echte Zustandsänderung
- ungefähr alle 1,5–3 Sekunden eine bedeutungstragende sichtbare Veränderung
- kein fertiger statischer Zustand länger als etwa 2,5 Sekunden ohne Grund
- längere Szene hat normalerweise mindestens zwei echte Micro-Beats
- Bewegung ist an Sprecherinhalt gekoppelt, nicht nur dekorativ

50–60 Sekunden sind kein Ziel. Wenn 42 Sekunden reichen, wird nicht auf 55 gestreckt.

## 7. Fakten-Gate

Vereinfachung darf das mentale Modell nicht falsch machen.

Besonders prüfen:

- Modellarchitekturen nicht pauschal vereinheitlichen
- produkt-/modellspezifische Details als solche kennzeichnen
- illustrative Zahlen nicht wie Messwerte darstellen
- reale UI/Features bei aktuellem Produktbezug prüfen
- „immer“, „nie“, „alle“ vermeiden, wenn nicht belegt

## 8. Pattern-Interrupt-Gate

Mehrere Bildsprachen nutzen, wenn der Inhalt sie rechtfertigt:

- große Einzelobjekte/Illustration
- Pfad/Prozess
- Formveränderung
- Vergleich/Split
- Dokument/UI
- räumliche 2.5D-/3D-Metapher
- kurzer Typografie-Akzent
- Diagramm nur bei echten Daten-/Gewichtsaussagen

## 9. Text-Gate

Sprecher = Aussage.  
Caption = Lesbarkeit.  
Animation = Erklärung.  
Header = Kapitelmarker.

Animationstext darf nicht nur Sprecher und Caption wiederholen.

## 10. Caption-Gate

Für 1080×1920 gilt der aktuelle Standard aus `CAPTION_SAFE_POSITION.md`:

- Standard `bottom: 400px`
- aktive Wortmarkierung lila
- maximal 2 Zeilen
- Caption darf nicht unnötig hoch in der Bildmitte sitzen
- finaler Sync nur aus echtem Audio

## 11. Schluss-Gate

Das Ende muss eine klare Einordnung, Regel oder Grenze liefern. Kein generischer CTA nötig.

## 12. Smartphone-Test

Finales MP4 auf Smartphone-Größe ansehen.

Fragen:

1. Würde ich nach 1 Sekunde weiterschauen?
2. Ist nach 3 Sekunden klar, worum es geht?
3. Passiert sichtbar genug, ohne hektisch zu werden?
4. Gibt es zu viel weiße/ungenutzte Fläche?
5. Wiederholt sich Kartenlogik?
6. Gibt es mindestens einen erinnerbaren visuellen Moment?
7. Versteht man die Kernmechanik kurz ohne Ton?
8. Sitzt die Caption tief genug, ohne in UI zu geraten?
9. Wirkt irgendeine Demo wie ein echter Messwert?

Wenn bei 1, 2, 5, 7 oder 9 die Antwort schlecht ausfällt: **nicht freigeben**.

## 13. Reihenfolge bei Problemen

Wenn technisch sauber, aber langweilig:

1. Thema/Angle prüfen
2. Hook neu bauen
3. Leerlauf kürzen
4. Kartenbeats durch echte Objekt-/Illustrationsmechaniken ersetzen
5. Motion-Cues dichter an Sprecherbedeutung koppeln
6. erst danach neue Technik bauen

**Keine neue Animation Library als Ersatz für eine schwache Content-Idee.**
