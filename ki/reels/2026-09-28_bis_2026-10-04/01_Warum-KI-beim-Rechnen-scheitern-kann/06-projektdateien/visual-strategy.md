# Visual Strategy — Warum KI beim Rechnen scheitern kann

**Status:** FINAL PHASE 1

## Reel-weite Bildidee

**Dominante visuelle Geschichte:** Eine große Rechnung ist das wiederkehrende Objekt. Sie startet als scheinbar sichere Antwort, zerlegt sich in Token/Wahrscheinlichkeiten, produziert eine rote Fehlerkaskade und wird am Ende über eine Tool-Route als grünes verifiziertes Resultat wieder zusammengesetzt.

**Hero/Memorable Beat:** Die falsche rote Ergebnisziffer löst sich aus einem Zwischenschritt, fährt sichtbar durch den Rechenpfad und färbt alle abhängigen Schritte rot. Beim Tool-Switch wird die Fehlerroute abgeschnitten.

**Bewusst vermiedene Wiederholung:** keine Panelserie; Szenen wechseln zwischen riesiger Typografie, Token-Pfad, Rechenbaum, Terminal/Tool-Route und finalem Objekt-Lock.

## Scene Story Contract

### arithmetic-01
- **Start state:** Riesige Gleichung `47 × 18 = 836` steht bereits vollständig im Frame.
- **Visible change:** `836` kippt rot, letzte Ziffer schlägt aus der Gleichung und eine Bruchlinie trennt „klingt sicher“ von „ist falsch“.
- **End state:** Falsche Zahl ist als Problem physisch isoliert.
- **Visual verb:** fractures
- **Hero meaning:** sprachliche Sicherheit ist kein Rechenbeweis.
- **Recognition cues:** Multiplikationszeichen; rotes falsches Resultat; Bruchlinie.
- **Payoff:** Konflikt sofort verstanden.
- **Modality:** REMOTION_NATIVE

### arithmetic-02
- **Start state:** Gleichung bleibt als gemeinsames Objekt erhalten.
- **Visible change:** Zeichen lösen sich nacheinander in Token und Kandidatenbalken auf; Pfad führt von Kontext zu nächstem Token.
- **End state:** Zuschauer sieht Textvorhersage statt Taschenrechnerlogik.
- **Visual verb:** decomposes
- **Hero meaning:** Modell erzeugt nächste Tokens.
- **Recognition cues:** Token-Chips; Kandidatenachse; Pfadpfeil.
- **Payoff:** Mechanismus sichtbar.
- **Modality:** REMOTION_NATIVE

### arithmetic-03
- **Start state:** Mehrere Rechenschritte sind zunächst grün verbunden.
- **Visible change:** Ein Zwischenergebnis kippt rot; roter Fehler läuft cause-to-effect durch alle abhängigen Knoten.
- **End state:** Ganze abhängige Route ist sichtbar kontaminiert.
- **Visual verb:** cascades
- **Hero meaning:** ein falscher Schritt kann Folgefehler erzeugen.
- **Recognition cues:** Rechenschritte; roter Pfad; Endergebnis.
- **Payoff:** Fehlerfortpflanzung sichtbar.
- **Modality:** REMOTION_NATIVE

### arithmetic-04
- **Start state:** Derselbe Input steht links vor einer Weggabelung.
- **Visible change:** Route wechselt in ein Calculator-/Code-Terminal; Berechnung wird dort ausgeführt und Ergebnis kehrt zurück.
- **End state:** Tool-Ergebnis sitzt als klar getrennte, grüne Ausgabe im Flow.
- **Visual verb:** routes
- **Hero meaning:** Werkzeug übernimmt deterministische Rechnung.
- **Recognition cues:** Terminalprompt; Calculator-Symbol; Rückgabepfad.
- **Payoff:** Tool-Trennung verstanden.
- **Modality:** REMOTION_NATIVE

### arithmetic-05
- **Start state:** Falsches und geprüftes Ergebnis stehen kurz nebeneinander.
- **Visible change:** Falsche Zahl wird ausgestrichen; `846` rastet in die ursprüngliche Gleichung und bekommt Prüfsiegel.
- **End state:** Konkrete Prüfregel bleibt groß stehen.
- **Visual verb:** locks
- **Hero meaning:** wichtige Zahlen aktiv verifizieren.
- **Recognition cues:** grünes Resultat; Check; Wörter `RECHNUNG PRÜFEN`.
- **Payoff:** klare Handlungsregel.
- **Modality:** REMOTION_NATIVE

## Beat Sheet

| Beat | Sprecherstelle | Bedeutung | Zuschauer muss sehen | Hauptverb | Start → Veränderung → Ende | Modality | Mechanikfamilie | Primary Remotion capability | Capability rationale | Hero | Asset/Capture |
|---|---|---|---|---|---|---|---|---|---|---|---|
| math-01-wrong-answer | „...trotzdem danebenliegen“ | plausibel klingend ≠ korrekt | falsche Ergebniszahl als Hero | snaps | sichere Zahl → roter Digit-Snap → falsches Ergebnis isoliert | REMOTION_NATIVE | kinetic number | kinetic-typography | Zahl selbst ist die Aussage | ja | nein |
| math-02-equation-fracture | „...kein Taschenrechner“ | zwei Mechaniken trennen | Gleichung physisch aufbrechen | fractures | geschlossene Gleichung → Bruch → getrennte Mechanik | REMOTION_NATIVE | object morph | object-transformation | Zustandswechsel erklärt Unterschied | nein | nein |
| math-03-token-stream | „Text Schritt für Schritt“ | sequenzielle Ausgabe | Zeichen/Token wandern entlang eines Pfads | decomposes | Gleichung → Token → gerichteter Strom | REMOTION_NATIVE | path flow | paths | Weg und Reihenfolge sind Kernaussage | ja | nein |
| math-04-probability-shift | „wahrscheinliche nächste Tokens“ | Kandidatenkonkurrenz | Balken wachsen gestaffelt, Gewinner zieht weiter | ranks | Kandidaten → unterschiedliche Gewichte → Gewinner | REMOTION_NATIVE | candidate axis | data-visualization | gemeinsame Achse erklärt Verhältnis | nein | nein |
| math-05-error-cascade | „falscher Zwischenschritt“ | Folgefehler | roter Fehler reist cause-to-effect | cascades | grüner Rechenpfad → ein Fehler → rote Kaskade | REMOTION_NATIVE | causal path | paths | sichtbarer Pfad erklärt Abhängigkeit | ja | nein |
| math-06-tool-route | „Rechentools oder Code“ | externe Berechnung | Weggabelung in Terminal | routes | Sprachpfad → Toolcall → Terminalresultat | REMOTION_NATIVE | terminal flow | terminal-code | Code/Terminal ist semantisches Werkzeug | ja | nein |
| math-07-verified-answer | „...erklärt das Ergebnis“ | Ergebnis kommt zurück | Ergebnis wird in Gleichung eingesetzt | assembles | Toolausgabe → Rückweg → korrekte Gleichung | REMOTION_NATIVE | object recomposition | object-transformation | dasselbe Objekt wird korrekt rekonstruiert | nein | nein |
| math-08-final-rule | „Rechnung prüfen“ | konkrete Regel | große Regel baut sich wortweise auf | locks | falsche Zahl verblasst → Regel → Check-Siegel | REMOTION_NATIVE | kinetic verdict | kinetic-typography | Text ist hier die Handlung selbst | ja | nein |
