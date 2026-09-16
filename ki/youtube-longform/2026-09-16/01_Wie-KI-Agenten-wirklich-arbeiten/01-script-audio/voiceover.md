# Voiceover — Wie KI-Agenten wirklich arbeiten

## 1. Hook
Du gibst einer KI ein Ziel – und statt dir nur eine Antwort zu schreiben, öffnet sie Informationen, benutzt Werkzeuge, trifft Zwischenschritte und arbeitet so lange weiter, bis ein Ergebnis vorliegt. Genau das ist die Idee hinter KI-Agenten. Sie wirken auf den ersten Blick wie ein besonders schlauer Chatbot. Technisch passiert aber etwas Entscheidendes zusätzlich: Das Modell steckt in einem System, das Aktionen ausführen, Ergebnisse beobachten und daraus den nächsten Schritt ableiten kann. In diesem Video zerlegen wir genau diesen Ablauf – vom Auftrag bis zur Kontrolle.

## 2. Chatbot gegen Agent
Ein normaler Chatbot arbeitet meistens Zug um Zug. Du fragst, das Modell antwortet, dann bist wieder du dran. Ein Agent bekommt dagegen eher ein Ziel. Zum Beispiel: „Vergleiche drei passende Tools für meinen Anwendungsfall und erstelle eine begründete Empfehlung.“ Dafür reicht eine einzelne Textantwort oft nicht. Das System muss Informationen suchen, Ergebnisse vergleichen, vielleicht rechnen, Zwischenstände speichern und am Ende prüfen, ob die Aufgabe wirklich erfüllt wurde. Der wichtige Unterschied ist also nicht nur ein stärkeres Sprachmodell, sondern ein Arbeitsablauf rund um das Modell.

## 3. Die vier Bausteine
Dieser Ablauf besteht im Kern aus vier Bausteinen. Erstens: das Modell. Es interpretiert die Aufgabe und entscheidet, was als Nächstes sinnvoll ist. Zweitens: Anweisungen und Grenzen. Sie legen fest, welches Ziel gilt, welche Regeln eingehalten werden müssen und wann der Agent stoppen soll. Drittens: Werkzeuge. Das können Suche, Dateien, Datenbanken, Code-Ausführung, ein Browser oder andere Funktionen sein. Und viertens: Kontext beziehungsweise Zustand. Das System muss wissen, was bereits passiert ist, welche Ergebnisse vorliegen und welche Schritte noch fehlen.

## 4. Der Agenten-Loop
Jetzt kommt der eigentliche Agenten-Loop. Am Anfang steht das Ziel. Der Agent betrachtet zuerst den aktuellen Zustand: Welche Informationen habe ich schon? Danach plant er den nächsten sinnvollen Schritt. Anschließend wählt er ein Werkzeug und führt eine Aktion aus. Das Ergebnis dieser Aktion fließt zurück in den Kontext. Jetzt beginnt die Schleife erneut: beobachten, entscheiden, handeln, Ergebnis prüfen. So kann aus einer einzigen Nutzeranweisung eine Kette aus vielen einzelnen Aktionen entstehen.

## 5. Ein konkretes Beispiel
Ein Beispiel macht das klar. Stell dir vor, der Agent soll aus mehreren Dokumenten eine kurze Entscheidungsvorlage erstellen. Zuerst findet und öffnet er die relevanten Dateien. Dann extrahiert er die wichtigsten Punkte. Danach bemerkt er vielleicht, dass zwei Angaben nicht zusammenpassen. Statt einfach weiterzuschreiben, kann er gezielt nach der fehlenden Information suchen. Anschließend erstellt er den Entwurf und prüft zum Schluss, ob die wichtigsten Anforderungen enthalten sind. Das Modell liefert also nicht nur Text – es steuert einen Prozess.

## 6. Warum Werkzeuge entscheidend sind
Genau deshalb sind Werkzeuge so wichtig. Ein Sprachmodell allein kann sehr gut formulieren und Schlussfolgerungen bilden, aber ohne Zugriff auf die nötige Umgebung kann es viele Aufgaben nicht tatsächlich erledigen. Ein Suchwerkzeug liefert aktuelle Informationen. Ein Dateizugriff gibt dem Agenten Projektkontext. Code-Ausführung kann Berechnungen oder Tests übernehmen. Ein Browser kann unterstützte Webseiten bedienen. Entscheidend ist: Der Agent muss nicht jedes Werkzeug immer benutzen. Er wählt abhängig vom aktuellen Zustand das Werkzeug, das für den nächsten Schritt sinnvoll erscheint.

## 7. Wo Agenten scheitern können
Das klingt mächtig, macht Fehler aber auch gefährlicher. Wenn ein Chatbot in einer Antwort falsch liegt, bleibt der Fehler oft in dieser Antwort. Ein Agent kann eine falsche Annahme dagegen in den nächsten Schritt mitnehmen. Dann sucht er nach der falschen Sache, bearbeitet die falsche Datei oder bewertet ein Ergebnis auf einer falschen Grundlage. Außerdem können externe Inhalte problematisch sein: Eine Webseite oder Datei kann Anweisungen enthalten, die gar nicht zum eigentlichen Nutzerziel gehören. Deshalb brauchen Agenten Grenzen, Rechte und Prüfungen.

## 8. Kontrolle und Freigaben
Gute Agentensysteme geben deshalb nicht einfach überall Vollzugriff. Werkzeuge werden gezielt freigegeben. Riskante Aktionen können eine Bestätigung verlangen. Wichtige Ergebnisse werden überprüft. Und der Agent braucht ein klares Stop-Kriterium: Wann ist die Aufgabe wirklich erledigt, und wann sollte er lieber nachfragen? Für sensible oder irreversible Aktionen bleibt menschliche Kontrolle besonders wichtig. Autonomie bedeutet nicht, dass jede Entscheidung automatisch an die KI abgegeben werden sollte.

## 9. Wann ein Agent sinnvoll ist
Und nicht jede Aufgabe braucht überhaupt einen Agenten. Wenn ein Ablauf immer gleich ist und exakt feststeht, kann ein klassischer Workflow schneller, günstiger und vorhersehbarer sein. Agenten werden interessant, wenn der Weg zum Ziel nicht komplett im Voraus bekannt ist: wenn Informationen fehlen, Entscheidungen unterwegs getroffen werden müssen oder verschiedene Werkzeuge je nach Situation zum Einsatz kommen. Mehr Autonomie ist also kein Selbstzweck.

Das wichtigste mentale Modell ist deshalb dieses: Ein KI-Agent ist nicht einfach ein Chatbot mit einem neuen Namen. Er ist ein Modell in einer Schleife aus Ziel, Kontext, Werkzeugen, Aktion und Feedback. Seine Stärke entsteht daraus, dass er mehrere Schritte selbst koordinieren kann. Seine Schwäche entsteht genau an derselben Stelle: Jeder Schritt kann neue Unsicherheit erzeugen. Gute Agenten brauchen deshalb nicht nur ein starkes Modell, sondern ebenso gute Werkzeuge, klare Regeln, begrenzte Rechte und überprüfbare Zwischenstände. Wenn du diesen Loop verstanden hast, verstehst du auch, warum Agenten gerade so viele KI-Produkte verändern.
