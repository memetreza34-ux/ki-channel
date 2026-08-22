# Skill: Voice-Locked Captions

## Zweck

Dieser Skill gilt ab Phase 3 für jedes Reel mit echtem Voiceover. Er verhindert, dass Phase-1-Schätzungen als finale Caption-, Wort- oder Szenen-Timings verwendet werden.

## Autorität

Sobald echtes Voiceover existiert, gilt:

**final verwendetes Audio → Wort-Timestamps → Caption-Gruppen → Visual Beats → Szenengrenzen → Composition-Dauer**

Nicht umgekehrt.

Phase-1-Timings sind ausschließlich Planwerte.

## Produktionsregel

Ein finaler Render mit Voiceover ist nicht freigabefähig, wenn Caption-Cues nur proportional über geschätzte Cue-Dauern laufen.

Pflicht für Phase 3:

- tatsächliche Audio-Dauer messen
- Sprechbeginn, Pausen und Phrasenenden aus echtem Audio bestimmen
- pro gesprochenem Wort echte oder audio-nahe `startFrame`/`endFrame`-Werte hinterlegen
- Caption-Cues nur während tatsächlich gesprochener Abschnitte anzeigen
- natürliche Pausen als echte Caption-Pausen respektieren
- Szenengrenzen auf natürliche Sprecher-/Bedeutungsgrenzen legen
- Visual Beats auf dieselben Wort-/Phrasenmarker ausrichten
- aktives lila Wort nur dann hervorheben, wenn es tatsächlich gesprochen wird

## Keine Produktions-Fallbacks

Der Source darf einen proportionalen Timing-Fallback für **Phase-1-Preview** besitzen. Sobald ein Reel als Phase 3 / final behandelt wird, ist dieser Fallback nicht ausreichend.

Wenn Word-Timestamps fehlen:

- Status nicht `approved`
- kein finaler Publishing-Render
- Validator muss warnen oder im Production-Modus fehlschlagen

## Caption-Gruppen

- Gruppen nach Sinn und Sprechphrase bilden, nicht blind alle N Wörter
- normalerweise 3–6 Wörter sichtbar
- maximal 2 Zeilen
- kurze Pause innerhalb eines Satzes darf einen neuen Caption-Block auslösen
- Satzzeichen und natürliche Betonung für Gruppierung nutzen
- kein neues Caption-Fenster mitten in einer eng gesprochenen Wortgruppe, nur weil die Wortzahl erreicht wurde

## Szene und Stimme

Eine Szene darf nicht wechseln, während der Sprecher semantisch noch im vorherigen Gedanken ist.

Scene Cut bevorzugt:

- nach Satzende
- nach klarer Pause
- beim hörbaren Wechsel auf einen neuen Gedanken
- wenn ein neues Schlüsselwort den nächsten visuellen Zustand startet

## Visual-Sync

Für jeden starken Visual Beat einen Audio-Anker definieren:

```text
Wort / Phrase
→ Frame im finalen Audio
→ visueller Trigger
→ erwarteter sichtbarer Zustand
```

Beispiele:

- „kritische Schwelle“ → Threshold schlägt sichtbar ein
- „zwei Wochen“ → Pause-Gate verriegelt
- „Monitoring“ → Monitoring-Layer aktiviert sich
- „Netzwerkzugriffe eingeschränkt“ → Netzwerkpaket wird blockiert
- „nicht außer Kontrolle“ → Alarm-Behauptung wird sichtbar verworfen

## Audio-Abweichung zu Phase 1

Wenn die echte Stimme länger oder kürzer ist als die Phase-1-Planung:

1. Composition-Dauer an Audio anpassen
2. Szenen und Beats auf Audio neu verteilen
3. Captions neu ausrichten
4. erst danach bei Bedarf lokale, natürliche Retiming-Korrekturen im erlaubten Bereich verwenden

Nie das echte Voiceover gegen falsche Plan-Cues laufen lassen.

## Freigabe-Gate

Finale Freigabe nur wenn:

- Caption-Text stimmt wortgleich mit Sprechertext
- Caption erscheint erst mit dem gesprochenen Wort / der Phrase
- aktives Wort folgt der Stimme sichtbar
- keine Caption läuft hörbar vor oder hinterher
- Szenenwechsel treffen den inhaltlichen Audio-Wechsel
- letzte Caption endet mit der letzten gesprochenen Phrase
- Composition endet erst nach dem echten Audio-Ende plus bewusstem kurzen End-Hold
