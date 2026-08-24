# Motion Readability Review — ChatGPT Study Mode

Review-Grundlage: tatsächlich vom Nutzer bereitgestellter Render `KI-ChatGPTStudyMode.mp4`, bei 1x und als Contact Sheet geprüft.

STATUS: FAIL
LIGHT_FIRST: FAIL
DARK_FULL_FRAME_SCENES: 1
DARK_EXCEPTION_APPROVED: NO
TOO_FAST_BEATS: 3
SIMULTANEOUS_INFO_OVERLOADS: 2
MIN_CRITICAL_HOLD_FRAMES: 8
POST_RENDER_1X_REVIEW: FAIL
REVIEWED_VIDEO_SHA256: 0e690b36dacb0bc46ba943c203cc11bc40bde2f7c101ca3374320e7385a92298
REVIEWED_VIDEO_DURATION_SECONDS: 40.192

## Konkrete Fails

### Szene 2 — Schnell, aber oberflächlich

Antwort, `SCHNELL` und `NIEDRIG` kommen zu dicht. Reihenfolge staffeln und nach jedem wichtigen Zustand lesbaren Hold geben.

### Szene 3 — Schritt für Schritt

Transformation in Lernpfad + mehrere Lernkarten kommt zu schnell. Kerntransformation zuerst, danach Karten einzeln/gestaffelt.

### Szene 4 — Verstehen statt Kopieren

Dunkle Fullscreen-Szene bricht den Light-First-Stil. Zusätzlich Copy-/Verstehen-Wege ruhiger nacheinander entwickeln.

### Szene 5 — Schluss

Finalen Nutzen-/Endzustand länger halten.

## Pflicht vor PASS

- dunkle Fullscreen-Szene entfernen oder explizit genehmigte Ausnahme dokumentieren
- TOO_FAST_BEATS = 0
- SIMULTANEOUS_INFO_OVERLOADS = 0
- kritische Holds mindestens 12 Frames
- neuen Render bei 1x prüfen
- neue SHA256 + Dauer eintragen
- erst danach `STATUS: PASS` und Validator gegen **genau diesen MP4** ausführen
