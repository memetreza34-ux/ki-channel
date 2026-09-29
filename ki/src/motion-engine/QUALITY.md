# Motion Engine Quality Bar

Eine Hero-Szene gilt nicht als hochwertig, nur weil eine Remotion-Capability technisch vorhanden ist.

## Mindeststandard fuer Hero-Motion

Mindestens zwei der folgenden Qualitaetsmerkmale muessen real zusammenarbeiten:

- authored trajectory statt reinem linearem slide
- camera reaction / camera follow
- anticipation vor der Hauptbewegung
- impact/reveal mit klarer Zustandsaenderung
- overshoot/follow-through
- damped settle
- speed readability durch blur/stretch/camera
- depth/parallax mit echter Raumfunktion
- mask/morph mit semantischer Transformation
- alive hold nach dem Payoff

## Nicht ausreichend

- Fade + 20–50px translate
- Scale-in + langer Stillstand
- reine Spring-Entrance fuer alle Elemente
- Kamera-Drift ohne Bezug zur Handlung
- Glow/Pulsing als einzige Bewegung
- mehrere kleine UI-Elemente statt einer choreografierten Hauptaktion

## Bewertungsgrundsatz

Die Szene soll bei ausgeschaltetem Text immer noch einen klaren Bewegungsbogen besitzen:

`vorher -> Handlung -> Konsequenz`
