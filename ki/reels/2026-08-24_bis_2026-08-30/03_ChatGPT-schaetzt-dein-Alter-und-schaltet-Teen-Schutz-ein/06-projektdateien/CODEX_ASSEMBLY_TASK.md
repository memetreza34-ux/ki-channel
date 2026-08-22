# CODEX ASSEMBLY TASK — KI-ChatGPTForTeens

## Ziel

Den vorhandenen Reel-Source **nicht neu entwerfen**, sondern den aktuellen Audio-locked Stand technisch prüfen, rendern und nur auf Basis echter Renderfehler gezielt korrigieren.

## Pflichtlektüre

- `ki/skills/entertainment-first-reels/SKILL.md`
- `ki/skills/high-energy-remotion-reels/SKILL.md`
- `ki/skills/voice-locked-captions/SKILL.md`
- `ki/skills/final-video-delivery/SKILL.md`

## Reihenfolge

1. prüfen, dass `01-script-audio/voiceover.mp3` vorhanden und hörbar ist
2. echte Audio-Dauer mit ffprobe gegen 54.432 s prüfen
3. `subtitle-cues.json` gegen `voiceover.mp3` stichprobenartig hörbar prüfen
4. `validate-entertainment-review.mjs` ausführen
5. `validate-voice-locked-captions.mjs` ausführen
6. Reel-Contract-Test + TypeScript-Typecheck ausführen
7. Remotion-Bundle/Composition-Auflösung prüfen
8. Smoke-Frames mindestens an Hook, jedem Hero-Moment und Schluss rendern
9. Smoke-Frames in Smartphone-Größe prüfen
10. Contact Sheet über die gesamte Timeline erzeugen; fünf unterschiedliche visuelle Zustände müssen klar erkennbar sein
11. bei Problemen Source gezielt korrigieren; kein Card-Only-Fallback
12. finalen MP4 mit eingebettetem Voiceover rendern
13. `validate-final-video.mjs` ausführen
14. finalen MP4 vollständig in normaler Geschwindigkeit ansehen und anhören
15. erst danach `FINAL VIDEO READY`

## Entertainment-Gate

Nicht freigeben, wenn:

- Hook zuerst wie eine leere weiße Fläche wirkt
- ChatGPT-/Produktbezug erst spät erkennbar wird
- zwei oder mehr Szenen wie dieselbe Card-Komposition aussehen
- Visuals länger stehen, während neue Sprecherbedeutung weiterläuft
- Hero-Momente im echten Render klein oder unlesbar sind
- Szene 3 nicht wie echte Chat-/Study-UI wirkt
- Szene 5 den Unterschied `Eltern steuern Einstellungen` vs. `Chats bleiben privat` nicht ohne Caption verständlich macht

## Brand-Gate

Kein OpenAI-/ChatGPT-Logo aus Erinnerung erzeugen. Solange kein offizielles zulässiges Asset lokal existiert, nur Textreferenz `ChatGPT`/`OpenAI` und eigenständig gebaute Produkt-UI verwenden.

## Audio-Gate

Kein stummer Preview-Export als Abgabe. Audio muss im finalen MP4 hörbar sein, Caption und Voice müssen zusammenlaufen und der letzte Sprechsatz muss vor dem End-Hold vollständig enden.
