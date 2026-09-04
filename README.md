# KI Channel

Produktions-Repository für einen deutschen, vollständig faceless KI-Erklärkanal mit Remotion und klarer Multi-Plattform-Publishing-Struktur.

## Für neue Chats und Agenten

**Immer zuerst `REPO-STATE.md` lesen.** Diese Datei bestimmt den aktuell autoritativen Arbeitsstand, die aktive Stabilisierung, die Architektur und die verbindliche Produktionslogik.

`main` bleibt das Ziel für den kanonischen Produktionsstand. Wenn `REPO-STATE.md` ausdrücklich einen laufenden Stabilisierungsbranch nennt, ist dieser für die aktuelle Arbeit autoritativ und darf nicht still durch `main` ersetzt werden.

## Architektur

```text
.
├── REPO-STATE.md
├── AGENTS.md
├── core/                         # @studio/core – Brand/UI-Bausteine
├── ki/                           # @studio/ki – Kanal- und Content-System
│   ├── brand/
│   ├── gehirn/
│   │   ├── MASTER.md
│   │   ├── KANAL.md
│   │   ├── REELS.md
│   │   ├── STORYTELLING_MOTION.md
│   │   ├── LEVEL_UP_STANDARD.md
│   │   ├── VISUAL_ASSETS.md
│   │   ├── PLATTFORMEN.md
│   │   └── PRODUKTIONSABLAUF.md
│   ├── animation-library/
│   ├── reels/                    # kanonische Short-Form-Produktionspakete
│   ├── plattformen/              # Publishing-Regeln, keine Medien-Duplikate
│   │   ├── youtube/
│   │   ├── instagram/
│   │   ├── tiktok/
│   │   ├── facebook/
│   │   └── snapchat/
│   └── src/
│       ├── animation-library/
│       ├── motion-system/
│       ├── longform/
│       └── reels/                # ausführbarer TS/TSX-Code
├── scripts/
├── docs/
└── .github/workflows/
```

Workspaces:

- `core` → `@studio/core`
- `ki` → `@studio/ki`

## Short-Form-Produktionspaket

Für neue Reels gilt seit der Woche `2026-08-31_bis_2026-09-06` die Struktur **Woche → Wochentag → Thema/Reel → Produktionsordner**:

```text
ki/reels/YYYY-MM-DD_bis_YYYY-MM-DD/
└── NN_Wochentag/
    └── NN_Reel-Titel/
        ├── README.md
        ├── 01-script-audio/
        ├── 02-bilder/
        ├── 03-caption/
        ├── 04-pdf/
        ├── 05-export/
        └── 06-projektdateien/
```

Wochentage sind `01_Montag` bis `07_Sonntag`. Ausführbarer Source bleibt separat unter `ki/src/reels/<slug>/`.

Neues Reel:

```bash
npm run new-video -- "Reel Titel" YYYY-MM-DD
```

Strukturprüfung:

```bash
npm run ki:reel:structure-check
```

## Publishing / Plattformen

Ein Short-Form-Reel wird **einmal** produziert. YouTube Shorts, Instagram Reels, TikTok, Facebook Reels und Snapchat verwenden denselben freigegebenen Master, solange keine technisch notwendige Anpassung erforderlich ist.

Plattform-spezifische Copy liegt pro Reel in:

```text
03-caption/platform-copy.md
```

YouTube-Regeln:

```text
ki/plattformen/youtube/
├── README.md
├── SHORTS.md
├── LONGFORM.md
├── THUMBNAILS.md
└── UPLOAD.md
```

YouTube Longform ist ein eigenes Format und wird nicht automatisch aus Reels aufgeblasen.

## Produktionsphasen

```text
Phase 1 — Inhalt + Source
Fakten + finales Skript + Story + Brand/Proof/Media + Visual Beats + Remotion-Code-Grundlage

Phase 2 — Voiceover: ausschließlich Nutzer
Der Nutzer erzeugt und hinterlegt das Produktions-Voiceover.

Phase 3 — Sync, Review, Render, Export
Runtime-Audio + Forced Alignment + Voice-Lock + SFX/Visuals + Tests + Render + Social Master + 1x Review + Release-Verifier
```

Details: `REPO-STATE.md` und `ki/gehirn/PRODUKTIONSABLAUF.md`.

## Visuelle Wahrheit

- hell, editorial, premium
- Marken-Lila `#B98CFF`
- dunkle Schrift `#1A1A2E`
- faceless
- keine Cyberpunk-/Neon-Standardoptik
- Animation erklärt statt dekoriert
- echte Brand-/Produktassets statt Fake-Logos, wenn Markenpräzision relevant ist
- Überschrift, Caption und Animationstext duplizieren sich nicht unnötig
- Plattformtitel/Thumbnail versprechen nie mehr als der Inhalt liefert

Caption-Geometrie hat genau eine technische Quelle: `ki/src/reels/captionSafe.ts`. Die zugehörige menschlich lesbare Dokumentation liegt in `ki/gehirn/CAPTION_SAFE_POSITION.md`.

Details: `ki/gehirn/MASTER.md`, `ki/gehirn/REELS.md`, `ki/gehirn/PLATTFORMEN.md`, `ki/BILDSTIL.md`.

## Technische Gates

```bash
npm run antigravity:verify
npm run ki:reel:structure-check
npm run production:contracts
npm run repo:wiring-check
npm run typecheck
npm test
npm run content:runtime:verify
npm run repo:verify
npm run motion:verify
```

Reel-spezifische Storytelling-, Level-Up-, Brand-/Motion- und Visual-Asset-Gates stehen in `REPO-STATE.md`.

Release:

```bash
npm run release:verify
npm run release:smoke
npm run release:full
```

Ein technischer Render ist keine visuelle Freigabe.

## Bekannte Betriebsgrenzen

- GitHub Actions ist derzeit kein verlässlicher Runtime-Beweis, solange der private Runner auf Konto-/Billing-/Runner-Ebene blockiert ist.
- Ein vertrauenswürdig erzeugter `package-lock.json` fehlt noch. Er darf erst nach einem echten npm-Installationslauf committed werden; bis dahin keine erfundenen Lockfile-Inhalte.
- Source-, Test-, Render- und Review-Erfolge dürfen nur behauptet werden, wenn sie tatsächlich ausgeführt wurden.
