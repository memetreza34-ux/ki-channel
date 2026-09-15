# KI-Channel — kanonischer Repository-Stand

**Status:** 2026-09-15 — Strict Reel Master Sync + Generated-Media Auto-Wiring + Render-Provenance

Diese Datei ist der operative Einstiegspunkt für neue Chats, Codex-, Antigravity- und andere Coding-Agenten. Sie beschreibt nur den aktuellen Arbeitszustand und die öffentlichen Produktions-Einstiege. Detailregeln und numerische Konstanten bleiben in ihren ausführbaren Source-of-Truth-Dateien.

## 1. Aktueller Arbeitsstand

- Aktueller Testbranch: `fix/strict-reel-master-sync-2026-09-14`
- Arbeitsbranch nie still wechseln.
- `main` ist aktuell nicht automatisch der freigegebene Produktionsstand.
- Generated Media kann über `scripts/materialize-generated-media.mjs` als lokale Bild-/B-Roll-Dateien materialisiert werden.
- `reel.visuals.generatedMediaBindings` verbindet Generated-Media-Asset-IDs deterministisch mit Remotion-Props; der Produktionsrenderer löst daraus automatisch die lokalen `publicPath`-Werte auf.
- Der Render-Lock bindet vorhandene Generated-Media-Manifeste und die SHA256-Werte der lokalen Assets.
- Das aktuelle Timing-System nutzt `align-reel-synced.mjs` als Orchestrator für Alignment, Master-Timeline, Choreografie, SFX und finale Timing-Gates.
- Keine neuen Features vor bestandenem Showcase-Test.
- Bei Widerspruch zwischen Dokumentation, Code, Contracts oder ausführbaren Gates: **Test stoppen, Drift reparieren und erst danach weiterarbeiten.**
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
9. `ki/gehirn/AUDIO_PIPELINE.md`
10. `ki/src/reels/AGENTS.md`
11. Ziel-Reel und seine Projektdateien

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

## 4. Öffentliche Produktions-Einstiege

Generated-Media-Requests können ohne API-Kosten vorab geprüft werden:

```bash
npm run reel:media:verify -- <reel-package-dir>
```

Echte Materialisierung wird bewusst explizit gestartet, weil sie externe API-Kosten auslösen kann:

```bash
GEMINI_API_KEY=... npm run reel:media:materialize -- <reel-package-dir>
```

Nach dem vom Nutzer bereitgestellten vollständigen Voiceover ist der kanonische Sync-Befehl:

```bash
npm run reel:sync -- <reel-package-dir>
```

Er orchestriert intern Runtime-Audio, Forced Alignment, unabhängigen Alignment-Gegencheck, Master-Timeline, explizite Speech-to-Animation-Choreografie, SFX-Auflösung, Timeline-Audit und finale Timing-Gates. `align-reel-local.mjs` ist ein interner Unterbaustein und nicht mehr der öffentliche Produktions-Einstieg.

Nach erfolgreichem Sync und Commit der erzeugten Timing-/Contract-Dateien:

```bash
npm run reel:prepare-render -- <reel-package-dir>
```

Dieser Schritt validiert den finalen Produktionsvertrag und erzeugt den Render-Lock mit Provenance. Danach rendert genau der gelockte Zustand mit:

```bash
npm run reel:render -- <reel-package-dir>
```

Der Produktionsrenderer verlangt Node 20, einen sauberen Worktree und einen Render-Lock vom aktuellen Commit. Er prüft Source-/Contract-Lock, löst `generatedMediaBindings` gegen `GENERATED-MEDIA.json` auf, verifiziert lokale Asset-SHAs, übergibt die resultierenden Pfade automatisch als Remotion-Props, rendert H.264/AAC und prüft anschließend mit `ffprobe` Bildgröße, Laufzeit sowie Audio-/Video-Streams. Der technische Render ist noch kein visueller PASS.

## 5. Nicht verhandelbare Produktionsverträge

- Produktions-Voiceover kommt ausschließlich vom Nutzer.
- `WORD-TIMINGS.json` ist nach Voice-Lock die Timing-Autorität für Captions, Szenen, Reveals und SFX.
- Für aktuelle Level-Up-v4-Reels ist `BRAND-MOTION-PLAN.json` Bestandteil des Produktionsvertrags.
- Native Remotion-Visuals bleiben die Produktionsbasis; Remote-Medien werden nicht zur Renderzeit geladen.
- Offizielle/lokale Assets brauchen nachvollziehbare Herkunft und bleiben reviewpflichtig.
- Source-Code allein beweist niemals einen visuellen PASS.
- Caption-Geometrie wird **nicht** in Markdown dupliziert. Numerische Autorität ist ausschließlich `ki/src/reels/captionSafe.ts`; Sources verwenden `REEL_CAPTION_SAFE`, `REEL_CAPTION_WRAPPER_STYLE` und `REEL_CAPTION_GLASS_STYLE`.

## 6. Generated Media — Bilder und B-Roll

Request-Datei pro Reel:

`06-projektdateien/GENERATED-MEDIA-REQUESTS.json`

Manifest nach erfolgreicher Materialisierung:

`06-projektdateien/GENERATED-MEDIA.json`

Optionale deterministische Render-Bindings in `reel.json`:

```json
{
  "visuals": {
    "generatedMediaBindings": {
      "generatedImageSrc": "asset-request-id",
      "generatedBrollSrc": "another-asset-request-id"
    }
  }
}
```

Die linke Seite ist der Remotion-Prop-Name, die rechte Seite die `id` des materialisierten Assets. Bei vorhandenen Bindings rendert die Produktionspipeline nicht still mit einem Fallback weiter, wenn Manifest, Datei oder SHA nicht stimmen.

Erlaubte Typen:

- `IMAGE`
- `BROLL`

Erlaubte Rollen:

- `ILLUSTRATION`
- `ATMOSPHERE`
- `TRANSITION`

KI-generierte Medien dürfen niemals als Proof, Source, offizielle UI, echte Brand Identity, reales Ereignis oder echtes Footage ausgegeben werden. Dafür bleibt echte/offizielle/provenance-backed Media Pflicht.

Standardprovider:

- Bild: `gemini-3.1-flash-image`
- B-Roll: `veo-3.1-generate-preview`

Modelle bleiben über `KI_IMAGE_MODEL` und `KI_VIDEO_MODEL` austauschbar. Binärdateien landen git-ignored unter `public/reel-assets/generated/<reel>/`; das Manifest hält Provider, Modell, Prompt/Fingerprint, SHA256, MIME, Größe und lokalen Remotion-Pfad fest. B-Roll-Provider-Audio wird im Produktionsrender standardmäßig gemutet. Nutzer-Voiceover bleibt Narrationsautorität.

## 7. Ein kanonischer Pre-Test

Vor dem nächsten echten Showcase-/Produktions-Test wird genau dieser Gate-Einstieg verwendet:

```bash
npm run test:readiness
```

`test:readiness` muss auf einem sauberen tracked Worktree laufen und bindet den Lauf an den aktuellen Git-Commit. Es führt nacheinander aus:

1. Syntaxcheck der Generated-Media-Materialisierung
2. `npm run antigravity:verify`
3. `npm run repo:verify`
4. `npm run motion:verify`
5. `npm run release:verify`

Der Pre-Test erzeugt keine kostenpflichtigen Bilder oder Videos. Reale Generierung wird nur über den expliziten `reel:media:materialize`-Befehl gestartet.

Der maschinenlesbare Nachweis wird unter `out/test-readiness/summary.json` geschrieben und enthält mindestens Commit, Branch, Node-Version, Einzelschritte, Laufzeiten und Gesamtstatus.

Ein fehlgeschlagener Schritt beendet den Pre-Test. Danach gilt: Fehler beheben → neuer Commit → `npm run test:readiness` erneut ausführen.

## 8. Gate-Stufen

Für die tägliche Arbeit gilt diese Hierarchie:

- **FAST:** `npm run repo:wiring-check` plus zielbezogene Syntax-/Typechecks; für kleine Source-/Dokumentationsänderungen.
- **SYNC:** `npm run reel:sync -- <reel-package-dir>`; nur wenn Script, Nutzer-Audio oder Timing-/Choreografie-Autorität geändert wurde.
- **RENDER:** `npm run reel:prepare-render -- <reel-package-dir>` → `npm run reel:render -- <reel-package-dir>`; nur für das aktuelle Reel.
- **FULL:** `npm run test:readiness` bzw. Release-Gates vor Showcase, Merge oder Freigabe.

Nicht bei jeder kleinen Reel-Änderung automatisch die gesamte Animation-Library rendern.

## 9. Showcase-Freigabe

Der echte Showcase-Test darf erst starten, wenn:

- `npm run test:readiness` mit `status: "passed"` endet,
- der im Report gespeicherte Commit dem getesteten HEAD entspricht,
- der tracked Worktree während des Laufs sauber geblieben ist,
- keine offenen Drift-/Wiring-Fehler bestehen.

Danach wird erst der eigentliche Render-/Showcase-Test ausgeführt. Neue Libraries, Agenten, Effekte oder zusätzliche Architektur sind bis dahin nachrangig.

## 10. Externe Einschränkungen

GitHub Actions ist für dieses private Repository derzeit wegen des Account-/Billing-/Spending-Zustands kein verlässlicher automatischer Runtime-Beweis. Solange das so ist, ist der lokale `test:readiness`-Report der verbindliche technische Nachweis für den getesteten Commit.

Die Generated-Media-Capability und automatische Render-Verdrahtung sind im Source implementiert. Eine reale Gemini/Veo-API-Generierung sowie ein echter Produktionsrender sind erst bewiesen, wenn die entsprechenden Befehle lokal auf dem genannten Commit tatsächlich erfolgreich ausgeführt wurden.

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
