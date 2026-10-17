# Wie denkt eine KI? – erstes Kanal-Video

Format: landscape (YouTube 16:9) · Look: Kanal-Look, Serie „KI erklärt“ (Gelb) · Länge: ca. 2:00 · Stand: 2026-10-10

## Ziel
Der Zuschauer versteht: Eine KI zerlegt Text in Tokens, macht daraus Zahlen und sagt dann Token für Token das wahrscheinlich nächste Stück vorher – deshalb klingt sie flüssig, ist aber nicht immer richtig.

## Welt
Eine durchgehende, breite Welt (Toki-Land). Die Kamera fährt von Station zu Station, Toki läuft/hüpft mit:
1. Chat-Ecke → 2. Werkstatt (Zerlegen) → 3. Zahlen-Raum → 4. Bibliothek (Training) → 5. Waage (Vorhersage) → 6. Satz-Brücke (Token für Token) → 7. Nebel (Halluzination) → 8. Lexikon vs. Toki → 9. Ausgang (Tipp + Abo).

## Stimme & Musik
- Sprecherstimme: synthetische Stimme „Thorsten“ (Piper, lokal, Stimme CC0), von Arman für dieses Video ausdrücklich freigegeben (2026-10-10). Erzeugt mit `tts/bin/python studio/scripts/stimme-piper.py wie-denkt-ki`.
- Musik: selbst per Code erzeugt (eigene Synthese), keine Lizenzfragen.
- Toki: eigene Laute (Synthese, `studio/scripts/sounds-kanal.py`).

## Sprechertext

1. Du stellst einer KI eine Frage – und Sekunden später steht da eine perfekte Antwort. Aber was passiert eigentlich dazwischen? Das hier ist Toki. Toki zeigt es dir.
2. Schritt eins: Die KI liest keine Wörter so wie wir. Sie zerlegt deinen Text in kleine Stücke – sogenannte Tokens. Das sind ganze Wörter oder Wortteile. Aus „Himmel“ wird zum Beispiel „Him“ und „mel“.
3. Schritt zwei: Jedes Token wird zu einer langen Reihe von Zahlen. Denn ein Computer kann nicht lesen – aber er kann rechnen. Und ähnliche Wörter bekommen ähnliche Zahlen. Stell dir das wie eine riesige Landkarte vor: König und Königin liegen nah beieinander, Banane liegt ganz woanders.
4. Woher weiß die KI, was sie mit diesen Zahlen machen soll? Aus dem Training. Dabei hat das Modell riesige Mengen Text gelesen – Bücher, Webseiten, Artikel. Und immer wieder eine einzige Aufgabe geübt: Welches Wort kommt als Nächstes?
5. Genau das passiert jetzt auch bei deiner Frage. Für das nächste Token berechnet die KI Wahrscheinlichkeiten. „Blau“ ist sehr wahrscheinlich, „grau“ weniger, „schön“ kaum.
6. Sie wählt ein Token aus, hängt es an – und rechnet dann alles noch einmal neu. Token für Token, so lange, bis die Antwort fertig ist. Darum siehst du Antworten oft Stück für Stück erscheinen.
7. Das erklärt auch eine Schwäche: Eine KI klingt immer flüssig – aber nicht immer richtig. Fehlt ihr das Wissen, wählt sie trotzdem das Wort, das am besten passt. Dann erfindet sie Dinge, zum Beispiel eine falsche Höhe für den Mount Everest. Das nennt man Halluzinieren. Und das ist keine Absicht: Die KI weiß einfach nicht, dass sie etwas nicht weiß.
8. Eine KI ist also kein Lexikon, das Fakten nachschlägt. Sie ist ein extrem guter Vorhersager für das nächste Wort.
9. Deshalb gilt: Nutze KI – aber prüfe Wichtiges immer selbst. Und wenn du mehr über KI verstehen willst: Abonnieren. Dann zeigt Toki dir beim nächsten Mal mehr.

## Fakten & Quellen
- Grundprinzip großer Sprachmodelle (Tokenisierung, Einbettung als Zahlenvektoren, Vorhersage des nächsten Tokens, Halluzinationen) – allgemeines Fachwissen, keine konkreten Zahlen.
- Landkarte (König/Königin nah, Banane weit weg): bildliche Vereinfachung von Wort-Einbettungen; im Bild als Skizze, keine echten Koordinaten.
- „Himmel“ → „Him“ + „mel“ ist ein vereinfachtes Beispiel; echte Tokenizer zerlegen je nach Modell anders → im Bild „vereinfacht“.
- Prozentwerte (blau/grau/schön) sind Beispielwerte → im Bild gekennzeichnet.
- Mount Everest: 8.848,86 m (gemeinsame Vermessung China/Nepal, verkündet Dezember 2020) → „rund 8.849 m“. Die falsche Zahl im Video (9.214 m) ist absichtlich falsch.
- Vereinfachung: Modelle nehmen nicht immer das wahrscheinlichste Token (Sampling) → Text sagt „wählt ein Token aus“.

## Plattform-Text
**Titel:** Wie denkt eine KI? In 2 Minuten erklärt
**Beschreibung:** Was passiert zwischen deiner Frage und der Antwort von ChatGPT & Co.? Toki zeigt dir Tokens, Zahlen, Wahrscheinlichkeiten – und warum KI manchmal Dinge erfindet. Hinweis: Die Sprecherstimme ist synthetisch erzeugt (Piper, Stimme „Thorsten“).
**Hashtags:** #KI #ChatGPT #KünstlicheIntelligenz #EinfachErklärt
