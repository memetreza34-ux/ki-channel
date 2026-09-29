# Motion Engine V1

Diese Datei ist fuer neue Remotion-Hero-Szenen verbindlich.

## Ziel

Gute Animation entsteht nicht durch viele Capabilities, sondern durch saubere Choreografie.

Kanonische Bewegungsphasen:

```text
Anticipation
-> Acceleration / Travel
-> Impact oder Reveal
-> Overshoot / Follow-through
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
- authored path-follow camera

Kamera muss auf eine Handlung reagieren, ein Objekt verfolgen oder eine raeumliche Beziehung erklaeren.

`CinematicCameraRig` kann deshalb optional dieselbe Bezier-Trajectory wie ein Hero-Objekt verfolgen. Kamera-Tracking ist nicht nur Dekoration: Es haelt ein bewegtes Subjekt lesbar und erzeugt echte Bildraumveraenderung statt eines simplen Slide-Eindrucks.

## Objektbewegung

Hero-Objekte bewegen sich bevorzugt auf authored trajectories statt nur linearer X/Y-Interpolation.

Erlaubte Mechaniken:

- Bezier trajectory
- anticipation in Gegenrichtung
- acceleration
- impact pulse
- velocity based stretch/squash
- depth travel ueber translateZ
- overshoot
- damped settle
- follow-through
- subtle alive hold

`ChoreographedObject` besitzt dafuer unter anderem `velocityStretch`, `zStart` und `zEnd`. Geschwindigkeit soll dadurch sichtbar werden und nicht nur mathematisch vorhanden sein.

## Layered Depth / Parallax

Fuer Szenen mit Raumwirkung stehen `ParallaxStage` und `ParallaxLayer` zur Verfuegung.

Regeln:

- Vordergrund, Mittelgrund und Hintergrund reagieren unterschiedlich stark auf die Kamera.
- Parallax nur einsetzen, wenn dadurch Raum oder Fokus klarer wird.
- Kein beliebiges Dauer-Schweben aller Layer.
- Tiefenstaffelung darf Text nicht unlesbar machen.

## Kinetic Typography

`MaskedKineticText` ist fuer starke Headline-/Verdict-Motion gedacht.

Statt einfachem Fade:

```text
Mask Reveal
-> gestaffelte Zeilen
-> Feder/Overshoot
-> Tracking settled
-> stabiler lesbarer Endzustand
```

Typografie darf selbst der Hero sein, wenn die Aussage dadurch staerker wird. Sie soll dann bewusst choreografiert sein und nicht nur als Text ueber einer Animation liegen.

## Geschwindigkeit lesbar machen

Bei schnellen Bewegungen mindestens eine passende Technik:

- echtes zeitlich gesampeltes Remotion Motion Blur (`SampledMotionBlur` / `CameraMotionBlur`)
- Directional Blur
- Stretch/Squash
- speed lines nur semantisch passend
- Kamera-Follow / whip

Motion Blur ist keine Deko. Es soll Geschwindigkeit oder Kamerabewegung plausibel unterstuetzen.

## NEW_BUILD

`NEW_BUILD` bedeutet wirklich reel-spezifischer Source oder eine bewusst passende Motion-Engine-Komposition.

Es bedeutet nicht:

> irgendeines von wenigen generischen Layout-Rezepten mit anderen Labels fuellen.

Die alte Creative-Recipe-Library bleibt als Utility-/Preview-/Fallback-System erhalten. Hero-Beats sollen sie nicht automatisch benutzen.

Der kanonische Runtime-Pfad erzwingt das jetzt technisch:

- `authoredNewBuild` fuer finale NEW_BUILD-Szenen
- `allowRecipeScaffold=true` nur fuer Preview/Tests
- ohne authored Runtime wird ein finaler NEW_BUILD geblockt

## Capability-Regel

Capabilities sind Werkzeuge. Es gibt keine kreative Pflicht, drei verschiedene Capabilities oder eine bestimmte Quote einzusetzen.

Ein Hero mit nur `three + paths` darf korrekt sein, wenn diese Kombination die Aussage am besten animiert.

Die Capability-Pruefung bleibt ein Truth-/Evidence-Gate: Was deklariert wird, muss wirklich im Beat implementiert sein. Sie soll keine kuenstliche Vielfalt erzwingen.

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
9. Braucht die Szene Layered Depth/Parallax?
10. Wie bleibt der anschliessende Hold lebendig?
11. Wenn Text der Hero ist: Wie wird er maskiert, gestaffelt und settled?

Wenn diese Fragen nicht beantwortet sind, ist die Motion Direction noch nicht fertig.

## Motion Engine Lab

Studio-only Composition:

```text
KI-MotionEngine-V1
```

Das Lab muss mindestens drei Dinge zeigen:

1. Impact + Kamera-Reaktion + temporal Motion Blur + Settle
2. authored Routing + path-follow camera + velocity stretch + Parallax
3. Push-through + Tiefenstaffelung + Masked Kinetic Type

Das Lab ist kein Production-Reel und darf nicht in `production-entry.tsx` registriert werden.
