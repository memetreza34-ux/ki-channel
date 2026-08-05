# Assets einfügen

Die Bildprompts liegen hier:

```text
../visuals/image-prompts.md
```

Erzeuge die vier Bilder und speichere sie exakt unter:

```text
images/scene-01-confident-answer.png
images/scene-03-pattern-gap-machine.png
images/scene-04-risk-documents.png
images/scene-08-verification-desk.png
```

Speichere das finale deutsche Voiceover unter:

```text
audio/voiceover.wav
```

Die vollständige Maschinenliste liegt in:

```text
asset-manifest.json
```

Keine Datei umbenennen. Keine Platzhalter, fremden Repository-Bilder oder eingebauten Untertitel verwenden.

Danach aus dem Repository-Root ausführen:

```bash
npm run codex:reel:prepare -- 2026-08-05-warum-ki-halluziniert --ready
```

Der generierte Codex-Brief erscheint anschließend unter:

```text
../codex/CODEX-BRIEF.generated.md
```
