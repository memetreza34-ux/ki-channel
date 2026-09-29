# Open-Source Motion References

Diese Datei dokumentiert die externen Open-Source-Referenzen, aus denen die Motion Engine Architekturprinzipien uebernommen oder adaptiert wurden.

## 1. remotion-motion-graphics-skill

Repository: https://github.com/jturntdev/remotion-motion-graphics-skill
Lizenz: MIT (Promptible, 2026)

Uebernommene Prinzipien:

- eine zusammenhaengende Welt statt voneinander isolierter Panels
- Kamera folgt der Handlung
- Hold -> Move -> Hold als Kamera-Grammatik
- eine primaere Aktion pro Beat
- Micro-Motion waehrend Kamera-Holds
- Voiceover nicht als grosse On-Screen-Erklaerung wiederholen
- echte Assets und semantische Grafik vor generischen Platzhaltern
- Render/Review vor Freigabe

Keine Abhaengigkeit auf das Repository. Die Regeln werden als projektinterne Motion-Direction angewendet.

## 2. remotion-cinematic

Repository: https://github.com/codeverbojan/remotion-cinematic
Lizenz: MIT (remotion-cinematic contributors, 2026)

Adaptierte Architekturidee:

- Kamera als Timeline aus Keyframes statt nur festen Presets
- Fokuspunkt + Zoom werden ueber Frames interpoliert
- wiederholte Kamera-Keyframes erzeugen bewusste Holds
- Szenen liegen in einem groesseren gemeinsamen World-Coordinate-System

Projektinterne Umsetzung:

- `ki/src/motion-engine/WorldCameraRig.tsx`
- eigene API mit `focusX`, `focusY`, `zoom`, `rotation`, `z`
- keine direkte Runtime-Abhaengigkeit auf remotion-cinematic

## 3. remotion-bits

Repository: https://github.com/av/remotion-bits
Lizenz: MIT

Adaptierte Architekturidee:

- Multi-State-Motion fuer ein Objekt ueber mehrere Zustandsphasen
- dieselben Objekte transformieren von Layout A -> B -> C statt ersetzt zu werden
- Stagger ueber mehrere Elemente
- X/Y/Z, Rotation, Scale und visuelle Eigenschaften in einer Timeline
- 3D-Reassemble / Mosaic-Reframe als Referenz fuer echte Transformation statt Fade-Replacement

Projektinterne Umsetzung:

- `ki/src/motion-engine/KeyframedMotion.tsx`
- eigene State-basierte API mit `frame`, Transform- und Visual-Werten
- `staggerIndex` / `staggerFrames`
- keine direkte Runtime-Abhaengigkeit auf remotion-bits

## 4. remotion-scenes

Repository: https://github.com/lifeprompt-team/remotion-scenes
Lizenz: MIT

Verwendung:

- Referenz-/Lookbook-Bibliothek fuer neue Motion-Ideen
- nicht als Produktions-Runtime eingebunden
- einzelne Konzepte muessen fuer unseren Kanal neu interpretiert werden
- keine Szene darf blind kopiert werden, nur weil sie technisch interessant ist

## Kanonische Reihenfolge fuer neue Hero-Motion

```text
Script beat
-> visuelle Metapher
-> eine primaere Aktion
-> World-Positionen
-> Kamera-Keyframes
-> Objektzustands-Timeline
-> Micro-Motion fuer Holds
-> Render
-> visueller Vergleich
-> Revision
```

## Wichtig

Open Source loest nicht automatisch Art Direction oder Story. Die externen Systeme liefern Motion-Mechaniken und Produktionsmuster. Neue Reels muessen weiterhin reel-spezifische visuelle Entscheidungen treffen.
