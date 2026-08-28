# Motion Readability Review — ChatGPT for Teens

Die Datei wurde bei der Repo-Stabilisierung nachgezogen. Ein PASS darf erst aus einem Render entstehen, der **nach** dem aktuellen Fullscreen-/Caption-/Audio-Source-Stand gerendert und anschließend als Social-Master geprüft wurde.

STATUS: PENDING
LIGHT_FIRST: PENDING
DARK_FULL_FRAME_SCENES: 0
DARK_EXCEPTION_APPROVED: NO
TOO_FAST_BEATS: 0
SIMULTANEOUS_INFO_OVERLOADS: 0
MIN_CRITICAL_HOLD_FRAMES: 12
POST_RENDER_1X_REVIEW: PENDING
CAPTION_SYNC_1X_REVIEW: PENDING
CAMERA_EFFECTS_1X_REVIEW: PENDING
AUDIO_MIX_1X_REVIEW: PENDING
REVIEWED_VIDEO_SHA256: PENDING
REVIEWED_VIDEO_DURATION_SECONDS: PENDING

## Pflicht vor PASS

- aktuelles Source/Timing committen
- lokales Audio vorbereiten und exakt locken
- neuen Roh-Render erzeugen und Social-Audio-Master erstellen
- exakt den gemasterten MP4 bei 1x ansehen **und anhören**
- Caption-/Voice-Sync prüfen
- Zoom/Kamera/Focus/Transitions auf Lesbarkeit und Zweck prüfen
- Gesamtmix und Voice-Verständlichkeit prüfen
- Light-First, Holds und Informationsstapel prüfen
- neue SHA256 + Dauer eintragen
- erst danach Werte real auf PASS setzen
