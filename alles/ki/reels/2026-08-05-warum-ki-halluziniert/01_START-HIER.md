# Warum KI halluziniert – START HIER

In diesem Reel-Ordner musst du normalerweise nur diese sechs Dinge öffnen:

```text
01_START-HIER.md   → diese kurze Anleitung
02_VOICEOVER.md    → finaler Sprechtext
03_SZENEN.md       → alle 8 Szenen mit Bild und Animation
04_BILDER/         → Bildprompts und später die 4 fertigen PNGs
05_AUDIO/          → hier kommt voiceover.wav hinein
06_CODEX.md        → diesen Auftrag bekommt Codex
```

Alles Technische, das du nicht manuell bearbeiten musst, liegt gesammelt in:

```text
99_INTERN/
```

## Was du jetzt tun musst

### 1. Bilder erstellen

Öffne:

```text
04_BILDER/PROMPTS.md
```

Speichere die vier fertigen Bilder exakt als:

```text
04_BILDER/scene-01-confident-answer.png
04_BILDER/scene-03-pattern-gap-machine.png
04_BILDER/scene-04-risk-documents.png
04_BILDER/scene-08-verification-desk.png
```

### 2. Voiceover erstellen

Nutze den Text aus:

```text
02_VOICEOVER.md
```

Speichere die fertige Datei als:

```text
05_AUDIO/voiceover.wav
```

### 3. Paket prüfen

Im Repository-Root:

```bash
npm run codex:reel:prepare -- 2026-08-05-warum-ki-halluziniert --ready
```

### 4. Codex starten

Öffne `06_CODEX.md`, kopiere den Auftrag in Codex und lass Codex das Reel bauen, testen und rendern.

## Reel-Daten

- Titel: **Warum KI halluziniert – und wie du es erkennst**
- Dauer: 36 Sekunden
- Format: 1080 × 1920
- Bildrate: 30 FPS
- Szenen: 8
- Stil: helle hochwertige 3D-Editorial-Optik
- Ton: nur Voiceover, keine Musik und keine SFX
