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
| 10 | Rendern | `remotion-render` | Export und technische Kontrolle |
| 11 | Technischer Review | `POST_RENDER_REVIEW.md` | Kollisionen, Safe-Zones, Lesbarkeit, Renderfehler |
| 12 | Creative Review | `CREATIVE_QA.md` | Hook, Leerlauf, Kartenlastigkeit, visuelles Storytelling und Smartphone-Eindruck |

**Schritt 12 ist ein echtes Stop-Gate.** Ein Reel darf technisch fehlerfrei sein
und trotzdem nicht freigegeben werden, wenn es langsam, repetitiv oder visuell
zu abstrakt ist.

## Technik-Demos

`ki/src/animation-library/demo/` zeigt Mechaniken, die ueber die klassische
Karten-Grammatik hinausgehen: Form-Morphing, Pfad-Reise, Szenenuebergaenge und
reel-spezifische Prozessvisualisierungen.

```bash
npm run motion-demos:stills
```

Sie sind **nicht automatisch** Produktionsanimationen. Erst die Aussage und den
Visual Beat bestimmen, dann entscheiden, ob eine Demo-Technik wirklich passt.

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

Der zweithaeufigste Fehler ist inzwischen das Gegenteil: technisch immer mehr zu
bauen, obwohl der Engpass ein schwacher Hook oder eine repetitive Bildsprache
ist. In diesem Fall zuerst `CREATIVE_QA.md` anwenden und **nicht** die Library
erweitern.

## Prüfung

`ki/src/motion/__tests__/werkzeuge.test.ts` hält die Tabelle ehrlich: jeder
installierte Skill unter `.claude/skills/` muss hier auftauchen, und jedes hier
genannte Werkzeug muss existieren. Ein neu installierter Skill, den niemand
einordnet, lässt den Test fehlschlagen — statt still liegenzubleiben.
