# Video-Untertitel v3

Dieses Reel zeigt in jeder Szene genau zwei kurze Sätze gleichzeitig.

- beide Sätze erscheinen vollständig sofort
- nur das aktuell gesprochene Wort wird violett
- alle anderen Wörter bleiben stabil weiß
- keine Fortschrittslinie
- keine Wort-für-Wort-Enthüllung
- keine Größenänderung und kein Bounce
- Unterkante 260 px
- Standardschrift 44 px, mindestens 42 px
- finale Wortzeiten ausschließlich aus `timeline/final-sync.json`

Die geplante Satzaufteilung steht in `caption-segments.md`. Vor dem finalen Render muss jedes Wort reale `startFrame`- und `endFrame`-Werte aus dem Voiceover besitzen.
