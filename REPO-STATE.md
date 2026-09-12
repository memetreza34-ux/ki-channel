# KI-Channel — kanonischer Repository-Stand

**Status:** 2026-09-12 — Pre-Test-Stabilisierung

Diese Datei ist der operative Einstiegspunkt für neue Chats, Codex-, Antigravity- und andere Coding-Agenten. Detailregeln bleiben in den jeweils zuständigen Dateien; hier stehen nur der aktuelle Arbeitszustand, die verbindlichen Gates und die unveränderlichen Produktionsregeln.

## 1. Aktueller Arbeitsstand

- Aktueller Testbranch: `feat/remotion-showcase-test-2026-09-12`
- Arbeitsbranch nie still wechseln.
- Keine neuen Features vor bestandenem Showcase-Test.
- `main` ist aktuell nicht automatisch der freigegebene Produktionsstand.
- Bei Widerspruch zwischen dieser Datei, Code, Contracts oder ausführbaren Gates: **Test stoppen, Drift reparieren und erst danach weiterarbeiten.**
- Ein Status darf nur als bestanden gemeldet werden, wenn der zugehörige Befehl auf genau dem genannten Commit real ausgeführt wurde.

## 2. Verbindliche Lesereihenfolge

Bei KI-Kanal-Arbeit:

1. `REPO-STATE.md`
2. `AGENTS.md`
3. bei Antigravity zusätzlich `GEMINI.md`, `.agents/agents.md`, `.agents/ANTIGRAVITY-LOCAL-SETUP.md`
4. `ki/AGENTS.md`
5. `ki/gehirn/MASTER.md`
6. `ki/gehirn/STORYTELLING_MOTION.md`
7. `ki/gehirn/LEVEL_UP_STANDARD.md`
8. `ki/gehirn/VISUAL_ASSETS.md`
9. `ki/reels/AGENTS.md`
10. Ziel-Reel und seine Projektdateien

## 3. Kanonische Reel-Struktur

```text
ki/reels/YYYY-MM-DD_bis_YYYY-MM-DD/
├── 01_Montag/
├── 02_Dienstag/
├── 03_Mittwoch/
├── 04_Donnerstag/
├── 05_Freitag/
├── 06_Samstag/
└── 07_Sonntag/
```

Pro Thema:

```text
NN_Wochentag/
└── 01_Thema/
    ├── README.md
    ├── 01-script-audio/
    ├── 02-bilder/
    ├── 03-caption/
    ├── 04-pdf/
    ├── 05-export/
    └── 06-projektdateien/
```

Kurzform: `Woche → Wochentag → Thema/Reel → 01–06`

Neues Reel:

```bash
npm run new-video -- "Reel Titel" YYYY-MM-DD
```

Ausführbarer Remotion-Code liegt separat unter `ki/src/reels/<slug>/`.

## 4. Nicht verhandelbare Produktionsverträge

- Produktions-Voiceover kommt ausschließlich vom Nutzer.
- `WORD-TIMINGS.json` ist nach Voice-Lock die Timing-Autorität für Captions, Szenen, Reveals und SFX.
- Für aktuelle Level-Up-v4-Reels ist `BRAND-MOTION-PLAN.json` Bestandteil des Produktionsvertrags.
- Native Remotion-Visuals bleiben die Produktionsbasis; Remote-Medien werden nicht zur Renderzeit geladen.
- Offizielle/lokale Assets brauchen nachvollziehbare Herkunft und bleiben reviewpflichtig.
- Source-Code allein beweist niemals einen visuellen PASS.

Caption-Safe-Zone bleibt zentral synchronisiert mit `ki/src/reels/captionSafe.ts`:

- bottom 330 px
- horizontal inset 76 px
- max width 928 px
- maximal 2 Zeilen

## 5. Ein kanonischer Pre-Test

Vor dem nächsten echten Showcase-/Produktions-Test wird genau dieser Gate-Einstieg verwendet:

```bash
npm run test:readiness
```

`test:readiness` muss auf einem sauberen tracked Worktree laufen und bindet den Lauf an den aktuellen Git-Commit. Es führt nacheinander aus:

1. `npm run antigravity:verify`
2. `npm run repo:verify`
3. `npm run motion:verify`
4. `npm run release:verify`

Der maschinenlesbare Nachweis wird unter `out/test-readiness/summary.json` geschrieben und enthält mindestens Commit, Branch, Node-Version, Einzelschritte, Laufzeiten und Gesamtstatus.

Ein fehlgeschlagener Schritt beendet den Pre-Test. Danach gilt: Fehler beheben → neuer Commit → `npm run test:readiness` erneut ausführen.

## 6. Bedeutung der Gates

- `npm run repo:wiring-check`: prüft kanonische Repo-Verdrahtung, Dokumentationsmarker und Kernpfade.
- `npm run production:contracts`: prüft Produktionsverträge.
- `npm test`: prüft Wiring, Reel-Struktur und Vitest-Suite.
- `npm run repo:verify`: bündelt Contracts, Typecheck, Tests und Content-Runtime-Verifikation.
- `npm run motion:verify`: prüft Motion-Skripte, Motion-Tests, Typecheck und Render-Plan.
- `npm run release:verify`: prüft den statischen Release-Pfad ohne teuren Vollrender.
- `npm run test:readiness`: ist der verbindliche Pre-Test-Einstieg und protokolliert den konkreten Commit.

## 7. Showcase-Freigabe

Der echte Showcase-Test darf erst starten, wenn:

- `npm run test:readiness` mit `status: "passed"` endet,
- der im Report gespeicherte Commit dem getesteten HEAD entspricht,
- der tracked Worktree während des Laufs sauber geblieben ist,
- keine offenen Drift-/Wiring-Fehler bestehen.

Danach wird erst der eigentliche Render-/Showcase-Test ausgeführt. Neue Libraries, Agenten, Effekte oder zusätzliche Architektur sind bis dahin nachrangig.

## 8. Externe Einschränkungen

GitHub Actions ist für dieses private Repository derzeit wegen des Account-/Billing-/Spending-Zustands kein verlässlicher automatischer Runtime-Beweis. Solange das so ist, ist der lokale `test:readiness`-Report der verbindliche technische Nachweis für den getesteten Commit.

## 9. Statusbegriffe niemals vermischen

```text
geplant
implementiert
technisch getestet
gerendert
visuell geprüft
freigegeben
veröffentlicht
```

Nur tatsächlich ausgeführte Prüfungen dürfen als bestanden gemeldet werden.
