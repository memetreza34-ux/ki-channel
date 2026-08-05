# Assets einfügen

Erzeuge die vier Bilder exakt anhand von `../image-prompts.md` und speichere sie unter:

```text
assets/images/scene-01-confident-answer.png
assets/images/scene-03-pattern-gap-machine.png
assets/images/scene-04-risk-documents.png
assets/images/scene-08-verification-desk.png
```

Speichere das finale deutsche Voiceover unter:

```text
assets/audio/voiceover.wav
```

Keine Datei umbenennen. Keine Platzhalter, fremden Repository-Bilder oder eingebauten Untertitel verwenden.

Danach aus dem Repository-Root ausführen:

```bash
node scripts/prepare-codex-reel.mjs 2026-08-05-warum-ki-halluziniert --ready
```

Codex beginnt erst, wenn diese Prüfung erfolgreich ist.
