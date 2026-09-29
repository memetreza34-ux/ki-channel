# Motion Engine V1

Diese Datei ist fuer neue Remotion-Hero-Szenen verbindlich.

## Ziel

Gute Animation entsteht nicht durch viele Capabilities, sondern durch saubere Choreografie.

Kanonische Bewegungsphasen:

```text
Anticipation
-> Acceleration / Travel
-> Impact oder Reveal
-> Overshoot
-> Settle
-> Alive Hold
```

## Verbotener Default

Nicht mehr als Standard:

```text
opacity 0 -> 1
translateY 30 -> 0
scale .95 -> 1
und danach mehrere Sekunden Stillstand
```

Diese Bewegung ist als Utility-Reveal erlaubt, aber nicht als alleinige Hero-Choreografie.

## Kamera

Hero-Szenen duerfen Kamera aktiv nutzen:

- push-in
- pull-back
- track-left/right
- push-through
- whip-left/right
- impact-push
- controlled orbit

Kamera muss auf eine Handlung reagieren oder eine raeumliche Beziehung erklaeren.

## Objektbewegung

Hero-Objekte bewegen sich bevorzugt auf authored trajectories statt nur linearer X/Y-Interpolation.

Erlaubte Mechaniken:

- Bezier trajectory
- anticipation in Gegenrichtung
- acceleration
- impact pulse
- overshoot
- damped settle
- follow-through
- subtle alive hold

## Geschwindigkeit lesbar machen

Bei schnellen Bewegungen mindestens eine passende Technik:

- Motion Blur
- Directional Blur
- Stretch/Squash
- speed lines nur semantisch passend
- Kamera-Follow / whip

## NEW_BUILD

`NEW_BUILD` bedeutet wirklich reel-spezifischer Source oder eine bewusst passende Motion-Engine-Komposition.

Es bedeutet nicht:

> irgendeines von wenigen generischen Layout-Rezepten mit anderen Labels fuellen.

Die alte Creative-Recipe-Library bleibt als Utility-/Fallback-System erhalten. Hero-Beats sollen sie nicht automatisch benutzen.

## Capability-Regel

Capabilities sind Werkzeuge. Es gibt keine kreative Pflicht, drei verschiedene Capabilities oder eine bestimmte Quote einzusetzen.

Ein Hero mit nur `three + paths` darf korrekt sein, wenn diese Kombination die Aussage am besten animiert.

## Qualitaetsfrage vor Source

Vor einer Hero-Szene beantworten:

1. Was ist das Hauptobjekt?
2. Wo startet es?
3. Was antizipiert die Bewegung?
4. Was beschleunigt?
5. Wo ist Impact/Reveal?
6. Was ueberschwingt?
7. Wie settled es?
8. Was macht die Kamera?
9. Wie bleibt der anschliessende Hold lebendig?

Wenn diese Fragen nicht beantwortet sind, ist die Motion Direction noch nicht fertig.
