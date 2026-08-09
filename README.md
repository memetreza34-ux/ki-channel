# KI Channel

Produktions-Repository für einen deutschen, vollständig faceless KI-Erklärkanal mit Remotion.

Das Repository enthält nicht nur einzelne Reels, sondern eine wiederverwendbare Produktionspipeline für Planung, Content-Grounding, Animation-Auswahl, Remotion-Rendering und Release-Prüfung.

## Kanonische Repository-Struktur

```text
.
├── core/                         # @studio/core – gemeinsames Brand-Kit / UI-Bausteine
├── ki/                           # @studio/ki – Kanal, Planung, Brand und ausführbarer Reel-Code
│   ├── brand/
│   ├── gehirn/
│   ├── animation-library/
│   ├── reels/                    # Wochenpakete / Planung / Assets
│   └── src/
│       ├── animation-library/
│       ├── motion-system/
│       └── reels/                # nur ausführbarer TS/TSX-Reel-Code
├── scripts/                      # Render-, Verify- und Release-Runner
├── docs/
├── .github/workflows/
├── package.json
└── tsconfig.base.json
```

Es gibt genau zwei npm-Workspaces:

- `core` -> `@studio/core`
- `ki` -> `@studio/ki`

`channels/ki` ist kein gültiger Pfad dieses Repositories.

## Reel-Pakete

Jedes echte Produktions-Reel liegt ausschließlich unter:

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

Neues Reel anlegen:

```bash
npm run new-video -- "Reel Titel"
```

Struktur prüfen:

```bash
npm run ki:reel:structure-check
```

Planungsdateien bleiben im Wochenpaket. Ausführbarer Remotion-Code entsteht getrennt unter `ki/src/reels/<slug>/`.

## Installation

Voraussetzung: Node.js 20.

```bash
npm install --package-lock=false --no-audit --no-fund
```

Workspaces nicht mit `--workspaces=false` umgehen. Wenn die Workspace-Installation scheitert, ist das ein Repository-Fehler und soll behoben statt versteckt werden.

### Lockfile-Status

Aktuell ist noch kein `package-lock.json` committed. Dadurch ist die transitive Dependency-Auflösung noch nicht vollständig reproduzierbar. Sobald ein Runner bzw. eine Entwicklungsumgebung mit funktionierendem npm-Registry-Zugriff verfügbar ist, soll ein Lockfile erzeugt, geprüft und committed werden. Bis dahin werden bestehende Dependency-Versionen nicht ohne technischen Grund verändert.

## Technische Standardprüfungen

```bash
npm run typecheck
npm test
npm run content:runtime:verify
```

Alles zusammen:

```bash
npm run repo:verify
```

`repo:verify` ersetzt die alten Studio-Validatoren, deren Skriptdateien in diesem Repository nicht mehr existieren.

## Content-Grounding

Der kanonische Produktionspfad ist:

```text
spokenText
→ SceneMeaningContract
→ derivePrototypeRuntimeContent()
→ sanitizePrototypeRuntimeContent()
→ associatePrototypeRuntimeContent()
→ createPrototypeRenderProps()
→ Remotion composition
```

Eine vorhandene Animation darf in echter Produktion nur wiederverwendet werden, wenn sie technisch ausführbar, nativ content-aware, renderbar und mit einem Runtime-Deriver verbunden ist. Die maßgebliche Implementierung liegt in:

`ki/src/animation-library/productionEligibility.ts`

Bei schwacher semantischer Passung wird ein `new-build` bevorzugt statt eine unpassende Library-Animation zu erzwingen.

## Release-Gates

Technische Verifikation:

```bash
npm run release:verify
```

Smoke-Release inklusive Kontrollrendern:

```bash
npm run release:smoke
```

Vollständiger technischer Content-Release:

```bash
npm run release:full
```

Ein erfolgreicher technischer Render ist noch keine visuelle Freigabe. Kontrollframes und finales Video müssen tatsächlich geprüft werden.

## GitHub Actions

`.github/workflows/motion-system-checks.yml` nutzt dieselben kanonischen Workspace-, Motion- und Content-Release-Gates.

Der Workflow bleibt derzeit bewusst `workflow_dispatch`, weil GitHub Actions für dieses private Repository auf Kontoebene bereits vor Step 1 durch den Billing/Spending-Zustand blockiert wurde. Sobald der Runner wieder verfügbar ist, kann der Workflow wieder als verpflichtender PR-Check aktiviert werden.

## Visuelle Identität

Verbindliche Quellen:

- Kanalidentität: `ki/gehirn/KANAL.md`
- Reel-Regeln: `ki/gehirn/REELS.md`
- Bildstil: `ki/BILDSTIL.md`
- Brand-Code: `ki/brand/brand.ts`
- Gemeinsame Komponenten: `core/brand-kit/`

Der aktuelle Standard ist hell und editorial: weißer bzw. sehr heller Hintergrund, dunkle Schrift und Marken-Lila `#B98CFF` als gezielter KI-/Fokus-Akzent. Kein generischer Cyberpunk-/Neon-Look.

## Agenten-Regeln

Vor Änderungen immer lesen:

1. `AGENTS.md`
2. `ki/AGENTS.md` für Dateien unter `ki/`
3. bei Reel-Arbeit zusätzlich `ki/reels/AGENTS.md`

`main` wird nicht direkt verändert. Technische und visuelle Prüfungen dürfen nur als bestanden bezeichnet werden, wenn sie tatsächlich ausgeführt bzw. geprüft wurden.
