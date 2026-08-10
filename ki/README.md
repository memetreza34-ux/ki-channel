# KI-Kanal — kanonischer Einstieg

Dieser Ordner enthält den aktuellen Produktionsstand des deutschen faceless KI-Kanals auf `main`.

## Immer zuerst lesen

1. `../REPO-STATE.md`
2. `../AGENTS.md`
3. `AGENTS.md`
4. `gehirn/MASTER.md`

Für Reel-Produktion zusätzlich `reels/AGENTS.md`. Für Plattform-/Publishing-Fragen zusätzlich `gehirn/PLATTFORMEN.md` und den passenden Ordner unter `plattformen/`.

## Aktuelle Architektur

```text
ki/
├── README.md
├── AGENTS.md
├── BILDSTIL.md
├── brand/                       # technische Markenfarben
├── gehirn/                      # Kanal-, Reel-, Plattform- und Produktionslogik
├── animation-library/           # Dokumentation/Katalog der Animationen
├── bausteine/                   # wiederverwendbare visuelle Bausteine
├── reels/                       # kanonische Short-Form-Produktionspakete
├── plattformen/                 # Publishing-Regeln; keine Medien-Duplikate
│   ├── youtube/
│   ├── instagram/
│   ├── tiktok/
│   ├── facebook/
│   └── snapchat/
├── public/                      # render-zugängliche Assets
└── src/                         # ausführbarer Remotion-/Motion-Code
    ├── animation-library/
    ├── motion-system/
    └── reels/
```

## Short-Form ist format-first

Ein Reel wird **einmal** produziert und bleibt unter:

```text
ki/reels/YYYY-MM-DD_bis_YYYY-MM-DD/NN_Reel-Titel/
```

Der ausführbare Source liegt getrennt unter:

```text
ki/src/reels/<slug>/
```

YouTube Shorts, Instagram Reels, TikTok, Facebook Reels und Snapchat dürfen denselben freigegebenen Master-Export verwenden. Plattform-spezifische Titel, Beschreibungen, Hashtags oder Hinweise werden als Publishing-Metadaten gepflegt; das Reel wird dafür nicht kopiert oder neu erfunden.

## 3-Phasen-Modell

```text
PHASE 1 — ChatGPT
alles vorbereiten außer echtem Voiceover

PHASE 2 — Mensch
nur Voiceover erzeugen

PHASE 3 — Codex / Antigravity
Audio integrieren + prüfen + rendern + freigeben
```

Details: `gehirn/PRODUKTIONSABLAUF.md`.

## YouTube

YouTube ist als eigener Publishing-Bereich unter `plattformen/youtube/` dokumentiert:

- `README.md` — Einstieg und Rollen
- `SHORTS.md` — Wiederverwendung der Reel-Masterdatei
- `LONGFORM.md` — Regeln für spätere längere YouTube-Videos
- `THUMBNAILS.md` — faceless Thumbnail-System
- `UPLOAD.md` — Metadaten- und Veröffentlichungscheck

Wichtig: YouTube Shorts sind **kein zweites Reel-System**. Das kanonische Short-Form-Produkt bleibt `ki/reels/`.

## Visuelle Identität

- hell/weiß, editorial, premium
- Haupttext `#1A1A2E`
- Marken-Lila `#B98CFF`
- dunkles Lila `#6E45C9`
- faceless
- keine generische Cyberpunk-/Neon-Optik
- keine unnötige Textdopplung
- Bilder erklären; sie dekorieren nicht nur

Details: `gehirn/MASTER.md`, `gehirn/REELS.md`, `BILDSTIL.md`.

## Verifikation

```bash
npm run repo:wiring-check
npm run ki:reel:structure-check
npm run typecheck
npm test
npm run content:runtime:verify
npm run repo:verify
```

Nie behaupten, ein Check sei bestanden, wenn er nicht tatsächlich ausgeführt wurde.
