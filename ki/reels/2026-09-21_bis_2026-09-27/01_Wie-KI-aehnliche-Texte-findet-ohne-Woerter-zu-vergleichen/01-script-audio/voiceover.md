# Voiceover — Wie KI ähnliche Texte findet, ohne Wörter zu vergleichen

## Szene 1 — Bedeutung statt Wörter
Du suchst nach einer Antwort, aber die beste Fundstelle benutzt vielleicht ganz andere Wörter. Eine semantische Suche kann sie trotzdem finden, weil sie nicht nur Wortgleichheit vergleicht.

## Szene 2 — Text wird zum Vektor
Dafür werden Texte oft in sogenannte Embeddings verwandelt. Ein Embedding ist ein Vektor, also eine Liste von Zahlen, die ein Modell aus dem Text erzeugt.

## Szene 3 — Ähnliches liegt näher
Texte, die inhaltlich stärker zusammenhängen, können dadurch im Vektorraum näher beieinander liegen. Deshalb kann eine Frage zu einem Thema auch Formulierungen finden, die kaum dieselben Wörter benutzen.

## Szene 4 — Suche vergleicht Ähnlichkeit
Bei der Suche wird auch deine Anfrage eingebettet. Das System vergleicht ihren Vektor mit gespeicherten Vektoren und ordnet Treffer nach Ähnlichkeit, zum Beispiel mit Kosinusähnlichkeit.

## Szene 5 — Ähnlichkeit ist nicht Wahrheit
Embeddings werden deshalb für Suche, Clustering und Empfehlungen genutzt. Wichtig: Unsere Punktwolke ist nur eine vereinfachte 2D-Darstellung. Nähe bedeutet modellierte Ähnlichkeit, nicht automatisch Wahrheit. Der Vorteil bleibt: Bedeutung kann wichtiger sein als identische Wörter.

**Planungsstand:** ungefähr 145 Wörter. Das echte Voiceover bestimmt in Phase 3 die finale Laufzeit.
