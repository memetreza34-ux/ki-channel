# Studio – so machst du ein Video

Sag Claude einfach, was du willst, z. B.:

> „Mach ein 30-Sekunden-Reel: Was sind KI-Agenten?“
> „Werbeclip, 15 Sekunden, Thema: unser Kanal.“ (kommt automatisch in 9:16, 1:1 und 4:5)

Claude baut das Video, schaut sich die Bilder selbst an, verbessert sie und schickt dir das Ergebnis.

## Selbst erstellen (ohne Code)

1. `npm run studio` starten – öffnet sich im Browser.
2. Links im Ordner **Ersteller** auf **Spot** (8-Sekunden-Werbespot) oder **Erklaerer** (Erklärvideo aus Szenen) klicken.
3. Rechts im Formular Texte, **Design** (editorial, nacht, pop, pastell, minimal, papier), **Format** und Icons eintragen – die Vorschau ändert sich sofort.
4. **Save** speichert, **Render** macht das Video.

Ideen holen: Ordner **Beispiele** (fertige Spots/Erklärvideos in verschiedenen Designs) und **Design-Katalog** (alle Designs nebeneinander).
Icons finden: `npm run icons -- rocket --bild` (englische Wörter), Lottie-Animationen: **Lottie-Katalog-Emoji** / **Lottie-Katalog-UI**.

⚠️ Wenn du animierte Emojis (`emoji/…`) nutzt, muss in die Videobeschreibung: **„Animierte Emojis: Google Noto, CC BY 4.0“**.

## Was du selbst machst

1. **Voiceover aufnehmen** und speichern als
   `studio/public/projekte/<projektname>/voiceover.mp3`
2. **Musik** (falls gewünscht, z. B. aus der YouTube Audio Library) speichern als
   `studio/public/projekte/<projektname>/musik.mp3` – sie wird unter deiner Stimme automatisch leiser.
3. Claude sagen: „Voiceover liegt drin.“ – Untertitel und Timing macht Claude.
4. Fertiges Video anschauen: `studio/out/<Name>.mp4`

**Sounds anhören:** `npm run studio` → links „Sound-Katalog“ anklicken → abspielen. Wenn dir ein Sound nicht gefällt, sag einfach den Namen.

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
Legt ein neues Erklärvideo an (Hochformat). Mit `landscape` am Ende für YouTube 16:9.

```bash
npm run neu -- meine-werbung --vorlage=werbung
```
Legt einen Werbeclip an – gleich in 9:16, 1:1 und 4:5.

```bash
npm run erstellen -- studio/ersteller/beispiele/spot-kanal-pop.json
```
Macht aus einer Beschreibungsdatei fertige Videos in allen darin genannten Formaten.

```bash
npm run still -- So-Antwortet-KI --frame=90
```
Speichert ein Einzelbild als PNG, z. B. als Thumbnail oder Cover.

## Formate

| Name | Größe | Für |
|---|---|---|
| `vertical` | 1080 × 1920 | Reels, Shorts, TikTok |
| `landscape` | 1920 × 1080 | YouTube |
| `square` | 1080 × 1080 | Feed-Posts |
| `portrait` | 1080 × 1350 | Instagram-/Facebook-Werbung |
