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

## Continuous World ist der neue Default fuer komplexe Hero-Sequenzen

Wenn mehrere Beats logisch zusammengehoeren, liegen sie bevorzugt in **einer groesseren Welt** statt in drei getrennten Fullscreen-Szenen.

Beispiel:

```text
Viewport 1080x1920
World 3000x3400

Station A -> Station B -> Station C
          Kamera reist durch dieselbe Welt
```

Dafuer existiert `WorldCameraRig`.

Die Kamera wird nicht mehr nur ueber Presets wie `push-in` oder `orbit-right` gesteuert, sondern kann eine freie Timeline besitzen:

```ts
[
  {frame: 0, focusX: 540, focusY: 850, zoom: 1.05},
  {frame: 60, focusX: 540, focusY: 850, zoom: 1.05}, // Hold
  {frame: 84, focusX: 1650, focusY: 1100, zoom: 0.72},
]
```

Wiederholte Werte erzeugen absichtliche Holds. Bewegung zwischen den Keyframes ist die Kamerafahrt.

Regel:

> Kamera bewegt sich zur naechsten Handlung. Die eigentliche Handlung passiert moeglichst waehrend eines Kamera-Holds.

## Kamera

Zwei Systeme existieren bewusst nebeneinander:

### `WorldCameraRig`

Bevorzugt fuer zusammenhaengende Hero-Sequenzen und mehrere Stationen in derselben Welt.

Steuert:

- `focusX`
- `focusY`
- `zoom`
- `rotation`
- `z`

### `CinematicCameraRig`

Weiterhin erlaubt fuer lokale Einzelbewegungen:

- push-in
- pull-back
- track-left/right
- push-through
- whip-left/right
- impact-push
- controlled orbit
- authored path-follow camera

Kamera muss auf eine Handlung reagieren, ein Objekt verfolgen oder eine raeumliche Beziehung erklaeren.

## Multi-State Motion

`KeyframedMotion` ist die kanonische Primitive fuer Objekte, die sich ueber mehrere Zustaende entwickeln.

Statt:

```text
Objekt A verschwindet
-> Objekt B erscheint
```

bevorzugt:

```text
dasselbe Objekt
A -> B -> HOLD -> C
```

Moegliche Zustandswerte:

- x / y / z
- scale / scaleX / scaleY
- rotate / rotateX / rotateY / rotateZ
- opacity
- blur
- borderRadius
- `staggerIndex` + `staggerFrames`

Damit koennen Grid -> Mosaic -> Cascade, Fracture -> Reassemble und andere echte Transformationen gebaut werden, ohne jedes Mal dutzende einzelne `interpolate()`-Bloecke zu schreiben.

## Objektbewegung

Fuer freie Trajectories bleibt `ChoreographedObject` bestehen.

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

`ChoreographedObject` eignet sich fuer ein Objekt mit klarer Flugbahn. `KeyframedMotion` eignet sich fuer mehrere authored Zustaende. Beide duerfen kombiniert werden.

## Layered Depth / Parallax

Fuer Szenen mit Raumwirkung stehen `ParallaxStage` und `ParallaxLayer` zur Verfuegung.

Regeln:

- Vordergrund, Mittelgrund und Hintergrund reagieren unterschiedlich stark.
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

Typografie darf selbst der Hero sein, wenn die Aussage dadurch staerker wird.

## Motion Direction fuer gesprochene Videos

Kanonische Regeln:

- eine primaere Aktion pro Beat
- unter etwa zwei Sekunden visuell erfassbar
- Bewegung erklaert Ursache/Wirkung statt nur zu dekorieren
- Kamera: Hold -> Move -> Hold
- waehrend Holds bleibt sinnvolle Micro-Motion erlaubt
- Voiceover nicht als grosse Erklaerung auf dem Screen wiederholen
- wenn eine Szene ohne Text leer wirkt, braucht sie meist eine bessere visuelle Metapher statt mehr Labels
- echte Assets vor generischen Platzhaltern, wenn passende Assets vorhanden sind

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

Der kanonische Runtime-Pfad erzwingt:

- `authoredNewBuild` fuer finale NEW_BUILD-Szenen
- `allowRecipeScaffold=true` nur fuer Preview/Tests
- ohne authored Runtime wird ein finaler NEW_BUILD geblockt

## Capability-Regel

Capabilities sind Werkzeuge. Es gibt keine kreative Pflicht, drei verschiedene Capabilities oder eine bestimmte Quote einzusetzen.

Ein Hero mit nur `paths + WorldCameraRig + KeyframedMotion` darf korrekt sein, wenn diese Kombination die Aussage am besten animiert.

Die Capability-Pruefung bleibt ein Truth-/Evidence-Gate: Was deklariert wird, muss wirklich im Beat implementiert sein.

## Qualitaetsfrage vor Source

Vor einer Hero-Sequenz beantworten:

1. Was ist das Hauptobjekt?
2. Welche visuelle Metapher erklaert den Beat ohne Voiceover-Text zu wiederholen?
3. Liegen mehrere Beats in derselben Welt?
4. Welche Kamera-Keyframes und Holds braucht die Welt?
5. Welche Zustaende durchlaeuft das Hauptobjekt?
6. Wo ist Anticipation?
7. Wo ist Impact/Reveal?
8. Was ueberschwingt oder folgt nach?
9. Wie settled die Bewegung?
10. Welche Micro-Motion bleibt waehrend Holds aktiv?
11. Braucht die Szene Parallax, Blur, Masking oder 3D wirklich?

Wenn diese Fragen nicht beantwortet sind, ist die Motion Direction noch nicht fertig.

## Motion Engine Lab

Studio-only Composition:

```text
KI-MotionEngine-V1
```

Das Lab ist jetzt bewusst **eine einzige Continuous World** und muss zeigen:

1. Hero beginnt bereits in Bewegung und trifft auf den ersten Zustand.
2. Kamera reist zur zweiten Station und haelt dort fuer eine Grid -> Mosaic -> Cascade Transformation.
3. Kamera reist zur dritten Station und zeigt Fracture -> Reassemble mit echter Z-Tiefe.
4. Ein Hero-Objekt bleibt ueber die komplette Sequenz erhalten und transformiert weiter, statt pro Szene ersetzt zu werden.
5. Motion Blur, Stagger und Multi-State Motion werden real genutzt.

Das Lab ist kein Production-Reel und darf nicht in `production-entry.tsx` registriert werden.

## Open-Source-Referenzen

Architektur- und Motion-Referenzen sind dokumentiert in:

`ki/gehirn/OPEN_SOURCE_MOTION_REFERENCES.md`

Die wichtigsten Quellen sind:

- `jturntdev/remotion-motion-graphics-skill`
- `codeverbojan/remotion-cinematic`
- `av/remotion-bits`
- `lifeprompt-team/remotion-scenes`
