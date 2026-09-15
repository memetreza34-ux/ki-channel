# KI-Channel — kanonischer Repository-Stand

**Status:** 2026-09-15 — Pre-YouTube-Stabilisierung auf dem aktuellen Showcase-/Longform-Stand

Diese Datei ist der operative Einstiegspunkt für neue Chats, Codex-, Antigravity- und andere Coding-Agenten. Detailregeln bleiben in den jeweils zuständigen Dateien; hier stehen nur der aktuelle Arbeitszustand, die verbindlichen Gates und die unveränderlichen Produktionsregeln.

## 1. Aktueller Arbeitsstand

- Aktueller Stabilisierungsbranch: `fix/pre-youtube-stabilization-2026-09-15`
- Direkte Basis: `feat/remotion-showcase-test-2026-09-12`
- Arbeitsbranch nie still wechseln.
- Ziel dieser Stabilisierung: Longform-/YouTube-Pipeline technisch konsolidieren, bevor ein neues YouTube-Video produziert wird.
- Keine neuen Motion-Libraries, Agenten oder zusätzlichen Capability-Schichten vor bestandenem Readiness-Lauf.
- `main` ist aktuell nicht automatisch der freigegebene Produktionsstand.
- Bei Widerspruch zwischen dieser Datei, Code, Contracts oder ausführbaren Gates: **Test stoppen, Drift reparieren und erst danach weiterarbeiten.**
- Ein Status darf nur als bestanden gemeldet werden, wenn der zugehörige Befehl auf genau dem genannten Commit real ausgeführt wurde.
- GitHub-Source-Änderungen allein sind kein Runtime-, Render- oder Review-PASS.

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
9. bei Reels: `ki/reels/AGENTS.md`
10. bei YouTube Longform: `ki/youtube-longform/AGENTS.md`, `ki/youtube-longform/LONGFORM-V1.md`, `ki/youtube-longform/YOUTUBE-READINESS.md`
11. Ziel-Paket und seine Projektdateien

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
- Longform-Produktionsrender müssen über den kanonischen Readiness-/Render-Lock-/Master-QA-Pfad laufen.

Caption-Safe-Zone bleibt zentral synchronisiert mit `ki/src/reels/captionSafe.ts`:

- bottom 330 px
- horizontal inset 76 px
- max width 928 px
- maximal 2 Zeilen

## 5. Generated Media — Bilder und B-Roll

Der vorhandene Orchestrator besitzt eine Materialisierungsstufe statt nur Asset-Planung.

Request-Datei pro Reel:

`06-projektdateien/GENERATED-MEDIA-REQUESTS.json`

Erlaubte Typen:

- `IMAGE`
- `BROLL`

Erlaubte Rollen:

- `ILLUSTRATION`
- `ATMOSPHERE`
- `TRANSITION`

KI-generierte Medien dürfen niemals als Proof, Source, offizielle UI, echte Brand Identity, reales Ereignis oder echtes Footage ausgegeben werden. Dafür bleibt echte/offizielle/provenance-backed Media Pflicht.

Vor Generierung ohne API-Kosten prüfen:

```bash
node --check scripts/materialize-generated-media.mjs
node scripts/materialize-generated-media.mjs verify <reel-package-dir>
```

Echte Materialisierung:

```bash
GEMINI_API_KEY=... node scripts/materialize-generated-media.mjs materialize <reel-package-dir>
```

Standardprovider:

- Bild: `gemini-3.1-flash-image`
- B-Roll: `veo-3.1-generate-preview`

Modelle bleiben über `KI_IMAGE_MODEL` und `KI_VIDEO_MODEL` austauschbar, damit ein Modellwechsel keine Architekturänderung benötigt.

Binärdateien landen git-ignored unter `public/reel-assets/generated/<reel>/`. Die prüfbare Wahrheit landet in `06-projektdateien/GENERATED-MEDIA.json`: Provider, Modell, Prompt/Fingerprint, SHA256, MIME, Größe, lokaler Remotion-Pfad und Synthetic/Evidence-Flags.

B-Roll-Provider-Audio wird im Produktionsrender standardmäßig gemutet. Nutzer-Voiceover bleibt Narrationsautorität.

Standardmäßig maximal 8 neue Generierungen pro Lauf; gleiche Request-/Model-Fingerprints mit passender lokaler SHA werden wiederverwendet statt erneut generiert.

## 6. Kanonischer Repository-Pre-Test

Vor einem echten Showcase-/Produktions-Test:

```bash
npm run test:readiness
```

`test:readiness` muss auf einem sauberen tracked Worktree laufen und bindet den Lauf an den aktuellen Git-Commit. Es führt nacheinander aus:

1. Syntaxcheck der Generated-Media-Materialisierung
2. `npm run antigravity:verify`
3. `npm run repo:verify`
4. `npm run motion:verify`
5. `npm run release:verify`

Der Pre-Test erzeugt **keine** kostenpflichtigen Bilder oder Videos. Reale Generierung wird nur über den expliziten `materialize`-Befehl gestartet.

Der maschinenlesbare Nachweis wird unter `out/test-readiness/summary.json` geschrieben und enthält mindestens Commit, Branch, Node-Version, Einzelschritte, Laufzeiten und Gesamtstatus.

Ein fehlgeschlagener Schritt beendet den Pre-Test. Danach gilt: Fehler beheben → neuer Commit → `npm run test:readiness` erneut ausführen.

## 7. Kanonischer YouTube-/Longform-Readiness-Gate

Vor dem ersten neuen YouTube-Longform-Paket auf diesem Stand:

```bash
node scripts/run-youtube-readiness.mjs
```

Der Gate erzeugt weder kostenpflichtige Medien noch einen Produktionsrender. Er prüft fail-closed:

- Node 20
- sauberen tracked Worktree
- stabilen Git-HEAD über den gesamten Lauf
- Longform-Skript-Syntax
- Antigravity-Longform-Capabilities
- Longform-v1-Struktur
- Longform-v1-/Master-/Capability-Contract-Tests
- expliziten TypeScript-Scope für `ki/src/longform/**`
- Repository-Wiring
- Produktionsverträge

Report:

```text
out/youtube-readiness/summary.json
```

Nur `status: "passed"` auf dem tatsächlich verwendeten Commit zählt als technischer YouTube-Preproduction-PASS.

Danach neues Paket:

```bash
node scripts/new-ki-longform.mjs "Video Titel" YYYY-MM-DD
```

Neue Pakete ab 2026-09-15 enthalten zusätzlich den vollständigen Phase-1-Handoff mit `VOICEOVER-ZUM-KOPIEREN.txt`, `VISUAL-STORY-PLAN.md` und expliziten Review-Hash-Feldern.

## 8. Bedeutung der Gates

- `npm run repo:wiring-check`: prüft kanonische Repo-Verdrahtung, Dokumentationsmarker und Kernpfade.
- `npm run production:contracts`: prüft Produktionsverträge.
- `npm test`: prüft Wiring, Reel-Struktur und Vitest-Suite.
- `npm run repo:verify`: bündelt Contracts, Typecheck, Tests und Content-Runtime-Verifikation; der kanonische Motion-Typecheck umfasst jetzt auch Longform-Source.
- `npm run motion:verify`: prüft Motion-Skripte, Motion-Tests, Typecheck und Render-Plan.
- `npm run release:verify`: prüft den statischen Release-Pfad ohne teuren Vollrender und bindet den Lauf an einen stabilen Git-HEAD.
- `npm run test:readiness`: ist der verbindliche Repo-Pre-Test-Einstieg und protokolliert den konkreten Commit.
- `node scripts/run-youtube-readiness.mjs`: ist der verbindliche Longform-Preproduction-Einstieg.
- `node scripts/check-ki-longform-render-readiness.mjs <package>`: blockiert Produktionsrender ohne Voice-Lock, lokale freigegebene Medien, sichere Source-Pfade und registrierte Composition.
- `node scripts/render-ki-longform-master.mjs <package>`: erzeugt den kanonischen Review-Kandidaten mit Render-Lock, Audio-Mastering, QA und Kontaktbögen.
- `node scripts/check-ki-longform-release.mjs <package>`: prüft finalen Master, menschlichen Review, Render-Lock-Historie und SHA-Integrität aller gelockten Inputs erneut.

## 9. Produktionsfreigabe

Ein echter Produktions-/Showcase-Test darf erst als bestanden gelten, wenn:

- der passende Readiness-Gate mit `status: "passed"` endet,
- der im Report gespeicherte Commit dem getesteten HEAD entspricht,
- der tracked Worktree während des Laufs sauber geblieben ist,
- keine offenen Drift-/Wiring-Fehler bestehen.

Für YouTube Longform reicht der Preproduction-PASS allein nicht für Release. Danach gelten weiterhin:

`Phase 1 → Nutzer-Voiceover → Voice-Lock/Alignment → Media Approval/SHA → Render Readiness → kanonischer Master → vollständiger 1x Review → Release-Gate`.

Neue Libraries, Agenten, Effekte oder zusätzliche Architektur sind bis zum ersten erfolgreich durchlaufenen neuen Longform-Video nachrangig.

## 10. Externe Einschränkungen

GitHub Actions ist für dieses private Repository derzeit wegen des Account-/Billing-/Spending-Zustands kein verlässlicher automatischer Runtime-Beweis. Solange das so ist, sind die lokalen maschinenlesbaren Readiness-Reports der verbindliche technische Nachweis für den getesteten Commit.

Die Generated-Media-Capability ist technisch implementiert, aber eine reale Gemini/Veo-API-Generierung ist erst bewiesen, wenn sie lokal mit einem gültigen `GEMINI_API_KEY` tatsächlich ausgeführt wurde.

Ein vertrauenswürdig erzeugter `package-lock.json` fehlt weiterhin. Er darf nicht erfunden werden. Nach einem echten Node-20-Installationslauf muss das Lockfile committed und der Installationspfad anschließend auf `npm ci` umgestellt werden.

## 11. Statusbegriffe niemals vermischen

```text
geplant
implementiert
materialisiert
technisch getestet
gerendert
visuell geprüft
freigegeben
veröffentlicht
```

Nur tatsächlich ausgeführte Prüfungen dürfen als bestanden gemeldet werden.
