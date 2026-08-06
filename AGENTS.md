# KI-Channel – Arbeitsregeln

Neue Reels verwenden `ki-animation-only-reel-v4`.

Vor Reel-Arbeit lesen:

1. `alles/AGENTS.md`
2. `alles/ki/reel-brain/PRODUCTION-BRAIN.md`
3. `alles/ki/reel-brain/FUTURE-REEL-STANDARD.md`
4. `alles/ki/reel-brain/ANTI-REPETITION-CONTRACT.md`
5. `alles/ki/reel-brain/AUDIO-FIRST-SYNC-CONTRACT.md`
6. Animation Director, Sync Auditor und Visual QA
7. `.agents/skills/reel-scene-icon-designer/SKILL.md`
8. die reel-lokale `AGENTS.md`

## V4-Kernregeln

- 1080 × 1920, 30 FPS
- 125 bis 145 Wörter, 8 bis 9 Szenen
- pro Szene ungefähr zwei kurze Voiceover-Sätze, aber immer nur ein Satz sichtbar
- aktueller Satz vollständig sofort anzeigen
- aktuelles gesprochenes Wort violett
- keine Fortschrittslinie, keine große Untertitelbox
- Untertitel-Unterkante 300 bis 350 px, Standard 320 px
- passendes semantisches Vektor-Icon neben jeder Überschrift
- ein großes Hauptobjekt, eine dominante Bewegung und ein klarer Ergebniszustand
- Hauptvisual ungefähr 68 bis 82 Prozent der Animationsfläche
- keine wiederholte Rahmenbühne, Mini-Dashboards oder kleine blasse Kartenansammlungen
- acht Szenen benötigen acht unterscheidbare Hauptmechaniken und Icons
- neue Texte oder Farben allein zählen nicht als neue Animation
- vor dem Coding die letzten zwei vergleichbaren Reels prüfen
- Anti-Wiederholungs-Matrix unter `05-review/anti-repetition-matrix.md` führen
- echtes Audio ist die einzige finale Zeitquelle
- keine Musik, SFX oder generierten Szenenbilder

## Pflichtvalidatoren

```bash
node scripts/validate-reel-v4.mjs <reel-ordner> --final
node scripts/validate-reel-animation-novelty.mjs <reel-ordner> --final
```

Finale Triggerabweichung maximal ±5 Frames. Schluss-Hold 1,2 bis 2,2 Sekunden. `main` nicht verändern, nichts ohne Freigabe mergen.
