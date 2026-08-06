# KI-Channel

Lies zuerst:

1. `alles/AGENTS.md`
2. `alles/ki/reel-brain/PRODUCTION-BRAIN.md`
3. `alles/ki/reel-brain/FUTURE-REEL-STANDARD.md`
4. `alles/ki/reel-brain/AUDIO-FIRST-SYNC-CONTRACT.md`
5. `alles/ki/reel-brain/brain.json`
6. `alles/ki/reel-brain/VALIDATION.md`

Neue Reels verwenden `ki-animation-only-reel-v2`:

- ungefähr 58 bis 70 Sekunden
- 125 bis 145 Wörter
- 8 bis 9 Szenen
- 100 Prozent Remotion-Animation
- keine generierten Szenenbilder
- ein separates statisches Cover mit einem Satz
- Voiceover bei 1,00x
- ein Hauptobjekt und eine Hauptbewegung pro Szene
- maximal drei Bedeutungsbeats pro Szene
- vollständige Satzuntertitel erscheinen sofort
- keine Wort-für-Wort-Einblendung
- genau eine violette Fortschrittslinie synchron zur echten Satzdauer
- Untertitel-Unterkante 210 bis 235 px

Die finale Timeline wird ausschließlich aus dem echten Voiceover erzeugt. Nach dem Audio muss `timeline/final-sync.json` erstellt werden. Feste Vorab-Szenenframes, geschätzte Untertitel und künstliche Schlussstille dürfen nicht in den finalen Render gelangen.

Benutzerprojekte liegen in `reels/` und `youtube/`. Der technische Code liegt vollständig in `alles/`.

FinanzNeo ist ein eigenständiges Repository. Historische v1-Reels dürfen bestehen bleiben, sind aber keine Vorlage für neue Reels.
