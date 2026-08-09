# Szenenplan

## Globale Dramaturgie

Das Reel beginnt mit einer überraschenden Aussage, führt den Zuschauer durch fünf Verarbeitungsschritte und endet mit einer klaren Konsequenz. Die visuelle Energie steigt bis zur Wahrscheinlichkeitsauswahl und wird im letzten Drittel wieder kontrollierter.

### Rhythmus

```text
Hook → Zerlegung → räumliche Erklärung → Beziehungen → Wettbewerb → Verarbeitung → Ausgabe → Warnung
```

## Szene 1 – Satz zerbricht

**Zeit:** 0,0–3,8 s  
**Animation-ID:** `sentence-token-shatter-v1`

Ein vollständiger Satz erscheint groß, scharf und scheinbar stabil in der Mitte. Bei den Worten „nicht wie du“ entsteht eine feine Bruchlinie zwischen den Wörtern. Die Zeile zerfällt nicht chaotisch, sondern kontrolliert in Tokenkapseln. Die Kapseln bewegen sich mit unterschiedlicher Tiefenschärfe, damit der Einstieg räumlicher wirkt als die bisherige flache Demo.

**Nicht verwenden:** gewöhnliches Fade-in, statische Kartenreihe, neuronales Netz als bloßes Hintergrundbild.

## Szene 2 – Token-Scanner

**Zeit:** 3,8–7,8 s  
**Animation-ID:** `token-vector-scanner-v1`

Die Tokenkapseln fallen in eine transparente, vertikale Scannerkammer. Ein Lichtbalken fährt nacheinander über die Kapseln. Während des Scans verwandelt sich sichtbarer Text in kompakte Zahlenvektoren. Der Zuschauer sieht denselben Inhalt vor und nach der Umwandlung.

**Visuelle Aussage:** Text wird für das Modell zu Zahlen.

## Szene 3 – Bedeutungsraum

**Zeit:** 7,8–11,8 s  
**Animation-ID:** `embedding-cluster-orbit-v1`

Die Zahlenpunkte schießen in ein räumliches Feld. Drei Beispielgruppen entstehen:

- `Hund`, `Katze`, `Tier`
- `Auto`, `Bus`, `Fahrzeug`
- `lernen`, `wissen`, `verstehen`

Ähnliche Begriffe ziehen sich an. Die Kamera bewegt sich auf einer kurzen, kontrollierten Kreisbahn um den Hauptcluster. Keine langen erklärenden Texte; die Nähe der Punkte muss die Idee tragen.

## Szene 4 – Attention-Fäden

**Zeit:** 11,8–16,3 s  
**Animation-ID:** `attention-thread-weave-v1`

Ein Beispielsatz wird nicht als Zeile gezeigt, sondern als frei angeordnete Schlüsselwörter. Zwischen den Wörtern entstehen Fäden unterschiedlicher Stärke. Unwichtige Beziehungen verschwinden. Die stärksten Verbindungen reagieren exakt auf die gesprochenen Begriffe `Attention-System` und `wichtig`.

**Beispielwörter:** `Die`, `KI`, `beantwortet`, `deine`, `Frage`.

## Szene 5 – Wörter im Rennen

**Zeit:** 16,3–21,8 s  
**Animation-ID:** `next-token-branch-race-v1`

Links steht der unvollständige Satz:

```text
Die KI erzeugt als Nächstes …
```

Drei Pfade wachsen nach rechts. Auf ihnen bewegen sich Kandidaten:

- `eine` – 42 %
- `die` – 31 %
- `Antwort` – 18 %

Die Werte reagieren dynamisch. Der Gewinner wird nicht einfach grün markiert, sondern überholt die anderen sichtbar und springt aus seinem Pfad in Szene 6.

## Szene 6 – Modellschichten

**Zeit:** 21,8–26,3 s  
**Animation-ID:** `transformer-layer-elevator-v1`

Der Gewinner fährt vertikal durch vier halbtransparente Schichten. Jede Schicht ergänzt einen anderen visuellen Marker: Kontext, Beziehung, Muster, Auswahl. Die Schichten dürfen wie ein technisches Objekt wirken, aber nicht wie ein generisches Prozessdiagramm.

**Kernaussage:** Das Modell setzt gelernte Muster fort; es denkt nicht wie ein Mensch.

## Szene 7 – Antwort entsteht

**Zeit:** 26,3–31,3 s  
**Animation-ID:** `answer-word-assembly-v1`

Wortkapseln fliegen aus verschiedenen Tiefen in eine Satzzeile und rasten nacheinander ein. Der Satz sollte überzeugend und sauber aussehen. Die Bewegung ist rhythmisch mit der Stimme verbunden und nicht als klassischer Typewriter-Effekt umgesetzt.

Beispielausgabe:

```text
Die Antwort klingt klar und überzeugend.
```

## Szene 8 – überzeugend und falsch

**Zeit:** 31,3–36,0 s  
**Animation-ID:** `brilliant-wrong-split-balance-v1`

Die Antwort teilt sich in zwei optisch identische Versionen. Eine erhält ein grünes Prüfsymbol, die andere eine rote Quellenwarnung. Beide liegen auf einer schwebenden Waage. Zuerst wirkt die grüne Seite stärker; dann kippt die Waage zur Warnseite.

Finale Textzeile:

```text
KI-ANTWORTEN PRÜFEN
```

## Übergänge

- Szene 1 → 2: Tokenkapseln fallen direkt in den Scanner.
- Szene 2 → 3: Zahlenvektoren werden zu räumlichen Punkten.
- Szene 3 → 4: Drei Punkte vergrößern sich und werden zu Wortknoten.
- Szene 4 → 5: stärkster Attention-Faden streckt sich zum ersten Wahrscheinlichkeits-Pfad.
- Szene 5 → 6: Gewinnerkapsel wird vertikal aus dem Pfad gezogen.
- Szene 6 → 7: Modellschichten öffnen sich und geben Wortkapseln frei.
- Szene 7 → 8: fertiger Satz klappt mittig auseinander.

Keine Szene darf mit Schwarzblende oder vollständigem Reset enden. Das Reel soll wie eine zusammenhängende visuelle Reise wirken.
