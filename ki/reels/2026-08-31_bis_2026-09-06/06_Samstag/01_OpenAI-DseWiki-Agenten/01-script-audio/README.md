# 01 — Script & Audio

Phase 1 enthält den exakten Sprechertext und die Satz→Szene-Zuordnung.

- `VOICEOVER-ZUM-KOPIEREN.txt`: 163 Wörter
- Ziel: 60–75 s Voice-Locked
- `SCENE-VOICE-MAP.json`: Content-Lock, Timing noch Preview
- Produktions-Voiceover ausschließlich durch den Nutzer
- kein Agent erzeugt oder lädt Produktionsaudio

Nach dem Nutzer-Audio: Pause-Kompression → 1,10× pitch-preserving → Runtime-WAV → lokales Forced Alignment → `WORD-TIMINGS.json`.
