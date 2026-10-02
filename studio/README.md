# Studio – so machst du ein Video

Sag Claude einfach, was du willst, z. B.:

> „Mach ein 30-Sekunden-Reel: Was sind KI-Agenten?“
> „Werbevideo 1:1 für Instagram, 15 Sekunden, Thema: unser Kanal.“

Claude baut das Video, schaut sich die Bilder selbst an, verbessert sie und schickt dir das Ergebnis.

## Was du selbst machst

1. **Voiceover aufnehmen** (oder mit deinem Tool erzeugen) und speichern als
   `studio/public/projekte/<projektname>/voiceover.mp3`
2. Claude sagen: „Voiceover liegt drin.“ – Untertitel und Timing macht Claude.
3. Fertiges Video anschauen: `studio/out/<Name>.mp4`

## Befehle (falls du selbst etwas machen willst)

```bash
npm run studio
```
Öffnet Remotion Studio im Browser – dort kannst du jedes Video abspielen.

```bash
npm run render -- So-Antwortet-KI
```
Rendert ein Video als MP4 nach `studio/out/`.

```bash
npm run neu -- mein-thema
```
Legt ein neues Projekt an (Hochformat). Mit `landscape` am Ende für YouTube 16:9.

## Formate

| Name | Größe | Für |
|---|---|---|
| `vertical` | 1080 × 1920 | Reels, Shorts, TikTok |
| `landscape` | 1920 × 1080 | YouTube |
| `square` | 1080 × 1080 | Feed-Posts |
| `portrait` | 1080 × 1350 | Instagram-/Facebook-Werbung |
