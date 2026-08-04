# Voiceover

## Finaler Sprechtext

> KI liest deinen Satz nicht wie du. Sie zerlegt ihn zuerst in kleine Textbausteine, sogenannte Tokens. Jedes Token wird in Zahlen übersetzt und in einem Bedeutungsraum eingeordnet. Dort liegen ähnliche Begriffe näher beieinander. Danach entscheidet das Attention-System, welche Wörter füreinander wichtig sind. Schritt für Schritt berechnet das Modell, welches Wort als Nächstes am wahrscheinlichsten passt. So entsteht die Antwort – nicht weil die KI wirklich versteht, sondern weil sie Muster extrem gut fortsetzt. Genau deshalb kann sie brillant klingen und trotzdem falsch liegen.

## Aufnahmevorgaben

- Sprache: Deutsch
- Zieltempo: ungefähr 125 bis 135 Wörter pro Minute
- Ton: ruhig, sicher, neugierig; nicht werblich und nicht kindlich
- Betonung: `nicht wie du`, `Tokens`, `Bedeutungsraum`, `Attention-System`, `wahrscheinlichsten`, `nicht weil`, `trotzdem falsch`
- Keine künstlichen Pausen zwischen jeder Szene
- Zwei kurze Atempausen: nach `Bedeutungsraum eingeordnet` und nach `wahrscheinlichsten passt`
- Letzten Satz langsamer und deutlicher sprechen

## Zeitfenster

| Zeit | Sprechertext | Betonung |
|---|---|---|
| 0,0–3,8 s | KI liest deinen Satz nicht wie du. | `nicht wie du` |
| 3,8–7,8 s | Sie zerlegt ihn zuerst in kleine Textbausteine, sogenannte Tokens. | `Tokens` |
| 7,8–11,8 s | Jedes Token wird in Zahlen übersetzt und in einem Bedeutungsraum eingeordnet. | `Zahlen`, `Bedeutungsraum` |
| 11,8–16,3 s | Dort liegen ähnliche Begriffe näher beieinander. Danach entscheidet das Attention-System, welche Wörter füreinander wichtig sind. | `näher`, `Attention-System` |
| 16,3–21,8 s | Schritt für Schritt berechnet das Modell, welches Wort als Nächstes am wahrscheinlichsten passt. | `Nächstes`, `wahrscheinlichsten` |
| 21,8–26,3 s | So entsteht die Antwort – nicht weil die KI wirklich versteht, sondern weil sie Muster extrem gut fortsetzt. | `nicht weil`, `Muster` |
| 26,3–31,3 s | Genau deshalb kann sie brillant klingen | `brillant` |
| 31,3–36,0 s | und trotzdem falsch liegen. | `trotzdem falsch` |

## Transkriptanforderung

Für die finale Audio-Synchronisierung muss eine Wort-Timestamp-Datei erzeugt werden. Jeder Eintrag benötigt:

```json
{
  "text": "Tokens",
  "startMs": 6100,
  "endMs": 6600
}
```

Die globalen Wortzeiten werden anschließend mit `buildProductionMotionTimelineFromTranscript()` den lokalen Szenen zugeordnet.
