# KI-Channel

- `reels/` – aktive Reel-Projekte
- `youtube/` – spätere Longform-Projekte
- `alles/` – Remotion-Code, Regeln, Skills, Tests und Buildsystem

Neue Reels verwenden `ki-animation-only-reel-v3`: genau zwei kurze Sätze pro Szene, vollständig sichtbar, aktives Wort violett, keine Fortschrittslinie, ein großes Hauptobjekt und eine dominante Bewegung. Das echte Voiceover erzeugt die finale Timeline.

```bash
cd alles
node scripts/create-future-reel.mjs <woche> <wochentag> <slug> --title "Titel" --hook "Hook" --scenes 8 --seconds 64
```
