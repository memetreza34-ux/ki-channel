# 🧰 Werkzeuge — welches wann

Das Repository hat Skills und Agenten, die selten bis nie benutzt wurden. Nicht
weil sie schlecht sind, sondern weil nirgends stand, **wann** sie dran sind.
Diese Datei ist die Antwort. Sie ist bewusst eine Tabelle und kein Aufsatz.

## Die Regel

> Jeder Schritt hat sein eigenes Werkzeug. Wer für alles dasselbe nimmt,
> bekommt für alles dasselbe Ergebnis.

## Reel bauen — in dieser Reihenfolge

| # | Schritt | Werkzeug | Wofür genau |
|---|---|---|---|
| 1 | Reel anlegen | `reel-production-pipeline` | Ordner, Phasen, Pflichtdateien |
| 2 | Tonfall und Hierarchie | `motion-art-direction` | Was ist Held, was Stütze, was bewegt sich **nicht** |
| 3 | Bildaufbau | `shot-composition` | Raster, sichere Zonen, woher Elemente kommen und wohin sie gehen |
| 4 | Mechanik wählen | `REMOTION_ANIMATION_CAPABILITIES.md` | Erst die Mechanik, dann die Technik |
| 4a | Technik ansehen | `npm run motion-demos:list` | Lauffähige Beispiele für Form-Morphing, Pfad-Reise und Übergänge |
| 5 | API nachschlagen | `remotion-docs` | Aktuelle Signaturen statt Erinnerung |
| 6 | Bewegung umsetzen | `animation-principles` + `BEWEGUNG.md` | Kurve, Dauer, Staffelung — die Zahlen |
| 7 | Farbe über Zeit | `color-motion` | Palette, Verläufe, Übergänge ohne matschige Mitte |
| 8 | Rhythmus zum Ton | `beat-sync-editing` | Schnitte und Akzente auf den Beat |
| 9 | Vor dem Render prüfen | `content-grounding-test` | Inhalt trägt wirklich bis in die Render-Props |
| 10 | Rendern | `remotion-render` | Export und Kontrolle |
| 11 | Nach dem Render | `POST_RENDER_REVIEW.md` | Sichtprüfung |

## Technik-Demos

`ki/src/animation-library/demo/` zeigt drei Mechaniken, die im Katalog bisher
nicht vorkommen: echtes Form-Morphing, eine Pfad-Reise mit Tangentenführung und
Szenenübergänge.

```bash
npm run motion-demos:stills
```

Sie sind **nicht** in der Prototypen-Registry. Der Katalog ist auf exakt 88
Einträge und vier Varianten je Familie festgelegt; eine bestehende Variante zu
verdrängen wäre eine inhaltliche Entscheidung. Bis die gefallen ist, dienen die
Demos als Vorlage zum Abschauen, nicht als Produktionsanimation.

## Agenten

| Agent | Wann |
|---|---|
| `content-test-runner` | Grounding-Tests laufen und diagnostizieren lassen, bevor gerendert wird |
| `context-overload-reel-builder` | Phase 3 des freigegebenen Context-Overload-Reels |

Agenten starten nur, wenn der Nutzer sie nennt oder der Schritt sie ausdrücklich
verlangt. Für eine einzelne Frage kein Agent — der kostet mehr, als er bringt.

## Häufigster Fehler

Für jede Bewegungsfrage `animation-principles` zu nehmen. Der Skill liefert
Kurven, Dauern und Staffelabstände — also **wie** sich etwas bewegt.

Er beantwortet nicht, **was** sich bewegen soll (Schritt 2), **wo** es im Bild
steht (Schritt 3) oder **welche Mechanik** die Aussage überhaupt trägt
(Schritt 4). Wer bei 6 anfängt, animiert eine Karte sauber, die gar keine Karte
hätte sein dürfen.

## Prüfung

`ki/src/motion/__tests__/werkzeuge.test.ts` hält die Tabelle ehrlich: jeder
installierte Skill unter `.claude/skills/` muss hier auftauchen, und jedes hier
genannte Werkzeug muss existieren. Ein neu installierter Skill, den niemand
einordnet, lässt den Test fehlschlagen — statt still liegenzubleiben.
