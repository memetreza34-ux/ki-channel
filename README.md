# KI Channel

Produktions-Repository für einen deutschen, vollständig faceless KI-Erklärkanal mit Remotion.

## Für neue Chats und Agenten

**Immer zuerst `REPO-STATE.md` lesen.** Dort steht der kanonische Branch, die aktuelle Architektur und die verbindliche Produktionslogik.

`main` ist der kanonische Produktionsstand. Historische Arbeits-/Backup-Branches sind keine aktuelle Quelle, solange der Nutzer sie nicht ausdrücklich nennt.

## Architektur

```text
.
├── REPO-STATE.md
├── AGENTS.md
├── core/                         # @studio/core – Brand/UI-Bausteine
├── ki/                           # @studio/ki – Kanal und Reel-System
│   ├── brand/
│   ├── gehirn/
│   │   ├── MASTER.md
│   │   ├── KANAL.md
│   │   ├── REELS.md
│   │   └── PRODUKTIONSABLAUF.md
│   ├── animation-library/
│   ├── reels/                    # Planung, Audio, Assets, Export
│   └── src/
│       ├── animation-library/
│       ├── motion-system/
│       └── reels/                # nur ausführbarer TS/TSX-Code
├── scripts/
├── docs/
└── .github/workflows/
```

Workspaces:

- `core` → `@studio/core`
- `ki` → `@studio/ki`

## Produktionspaket

```text
ki/reels/YYYY-MM-DD_bis_YYYY-MM-DD/NN_Reel-Titel/
├── README.md
├── 01-script-audio/
├── 02-bilder/
├── 03-caption/
├── 04-pdf/
├── 05-export/
└── 06-projektdateien/
```

Ausführbarer Source bleibt separat unter `ki/src/reels/<slug>/`.

Neues Reel:

```bash
npm run new-video -- "Reel Titel"
```

Strukturprüfung:

```bash
npm run ki:reel:structure-check
```

## Produktionsphasen

```text
Phase 1 — ChatGPT
komplette Planung + Skript + Bildprompts/Manifest + Captions + ausführbare Code-Grundlage

Phase 2 — Mensch
nur Voiceover

Phase 3 — Codex / Antigravity
Audio-Integration + Timing + Tests + Smoke Review + Final Render
```

Details: `ki/gehirn/PRODUKTIONSABLAUF.md`.

## Visuelle Wahrheit

- hell, editorial, premium
- Marken-Lila `#B98CFF`
- dunkle Schrift `#1A1A2E`
- faceless
- keine Cyberpunk-/Neon-Standardoptik
- Animation erklärt statt dekoriert
- Bildprompts erklären genau eine Aussage
- Überschrift, Caption und Animationstext duplizieren sich nicht unnötig

Details: `ki/gehirn/MASTER.md`, `ki/gehirn/REELS.md`, `ki/BILDSTIL.md`.

## Technische Gates

```bash
npm run repo:wiring-check
npm run ki:reel:structure-check
npm run typecheck
npm test
npm run content:runtime:verify
npm run repo:verify
```

Release:

```bash
npm run release:verify
npm run release:smoke
npm run release:full
```

Ein technischer Render ist keine visuelle Freigabe.

## Bekannte Betriebsgrenzen

GitHub Actions ist derzeit auf Konto-/Billing-/Runner-Ebene blockiert und läuft deshalb nur manuell, sobald der Runner wieder verfügbar ist. Außerdem ist noch kein vertrauenswürdig erzeugter `package-lock.json` committed; ein Lockfile darf erst nach einem echten npm-Installationslauf erzeugt werden.
