# KI-Channel — kanonischer Repository-Stand

**Status:** 2026-08-29

Diese Datei ist der Einstiegspunkt für jeden neuen Chat, Codex-, Antigravity- oder anderen Coding-Agenten.

## 1. Kanonischer Branch

`main` ist der einzige kanonische Produktionsstand nach abgeschlossenen Merges.

Aktuelle Stabilisierung läuft über Draft-PR **#28** direkt gegen `main` auf:

`fix/repo-stabilisierung-2026-08-24`

Solange diese Stabilisierung aktiv ist, wird dieser Branch weitergeführt und nicht still nach `main` gewechselt. Die älteren PRs **#24, #26, #27 und #29** sind superseded/geschlossen. Der GPT-5.6-End-to-End-Test wurde über PR #30 in den Stabilisierungsbranch integriert.

## 2. Verbindliche Lesereihenfolge

Bei KI-Kanal-Arbeit gilt:

1. `REPO-STATE.md`
2. `AGENTS.md`
3. bei Antigravity zusätzlich `GEMINI.md`, `.agents/agents.md` und `.agents/ANTIGRAVITY-LOCAL-SETUP.md`
4. `ki/AGENTS.md`
5. `ki/gehirn/MASTER.md`
6. bei Reels zusätzlich `ki/gehirn/STORYTELLING_MOTION.md`
7. danach die passende Domäne / `ki/reels/AGENTS.md` / `ki/src/reels/AGENTS.md`
8. das ausdrücklich genannte Reel
9. erst danach konkrete Pläne, Source- oder Plattformdateien

## 3. Kanonische Short-Form-Produktionsstruktur

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

Ausführbarer Remotion-Code liegt getrennt unter `ki/src/reels/<slug>/`.

Der Generator erstellt alle sechs Ordner Git-stabil und scaffoldet für neue Reels zusätzlich `story-beats.json` + `STORY-PLAN.md`. Der Strukturcheck überwacht den Generator selbst.

## 4. Phase-1 Script- und Laufzeit-Budget

Für **neue Reels** gilt:

- tatsächliche Voice-Locked-Laufzeit: **60–75 Sekunden**
- bevorzugt **150–175 gesprochene Wörter**
- bis **190 Wörter** ohne Sonderfreigabe
- `reel.json.scriptBudget.targetMinSeconds = 60`
- `reel.json.scriptBudget.targetMaxSeconds = 75`

Vor Production-Render prüft:

```bash
node ki/scripts/validate-reel-script-budget.mjs <reel-package-dir>
```

Nach lokalem Forced Alignment prüft `prepare-reel-render.mjs` zusätzlich die echte Voice-Locked-Laufzeit.

## 5. Produktions-Audio — ausschließlich vom Nutzer

**Harte Regel:** Das Produktions-Voiceover wird ausschließlich vom Nutzer erstellt.

Workflow:

```text
ChatGPT/Codex erstellt nur Skript, Story, Source und Produktionsplan
→ Nutzer erzeugt das vollständige Voiceover selbst
→ Nutzer legt die Datei in 01-script-audio/ ab
→ erst dann darf die technische Audio-/Render-Pipeline starten
```

Normaler Zielpfad:

`01-script-audio/voiceover.mp3`

Agenten dürfen niemals:

- das Produktions-Voiceover erzeugen,
- TTS-/Voice-Tools dafür aufrufen,
- eine Remote-Voiceover-Datei herunterladen,
- Preview-Audio als Ersatz verwenden.

Antigravity hat dafür zusätzlich ein `PreToolUse`-Safety-Gate, das Agent-Schreibversuche auf Produktions-Voiceover und typische Remote-/TTS-Ersatzversuche blockiert.

Fehlt das Nutzer-Audio, lautet der Status:

`PHASE 2 — WARTET AUF NUTZER-AUDIO`

Die lokale Datei wird danach in eine deterministische Runtime-Audiospur umgewandelt:

`public/runtime-audio/<compositionId>.wav`

Diese Runtime-WAV ist Wort-/Frame-/Render-Autorität.

## 6. Storytelling-/Motion-Standard

Neue 60–75-s-Reels werden als **narrative Social-Explainer** gebaut, nicht als Folge langer UI-/PowerPoint-Karten.

Harte Story-Regeln:

- mindestens **15 konkrete Visual Beats**
- jede Szene mindestens zwei erkennbare visuelle Zustandsänderungen
- Story-Arc enthält mindestens `HOOK`, `PROOF`, `CONSEQUENCE`, `PAYOFF`
- jede zentrale Sprecher-Aussage löst eine sichtbare Reaktion aus
- Ziel: kein praktisch unveränderter Visual State länger als **4,5 Sekunden** bei aktivem Voiceover, außer bewusst dokumentierte Lesepause
- Kamera/Zoom/Transition/SFX nur mit Erklär-, Fokus-, Verbindungs- oder Payoff-Funktion

Phase-1-Gate:

```bash
node ki/scripts/validate-storytelling-motion.mjs <reel-package-dir>
```

Story-Stack:

- `ki/src/reels/StoryMotion.tsx`
  - `StoryBeat`
  - `StoryCamera`
  - `ImpactNumber`
  - `StoryProgressRail`
  - `StoryCutFlash`
  - `StoryTexture`
  - Shape-basierte Flow-/Pulse-Pfeile
- `ki/src/reels/StoryMediaLayers.tsx`
  - `StoryThreeHero`
  - lokale Lottie-/Rive-Layer
  - `StorySkiaBackdrop`
- `ki/src/motion-system/StoryTransitionShowcase.tsx`
- `.agents/skills/remotion-storytelling/SKILL.md`
- `.agents/skills/remotion-bits-discovery/SKILL.md`

Der KI-Workspace pinnt den Story-Stack auf Remotion `4.0.488`: Transitions, Effects, SFX-Capability, Shapes, Lottie, Rive, Three und Skia. `@shopify/react-native-skia` ist wegen React 18 auf `1.12.4` gepinnt.

Skia ist verdrahtet:

- `remotion.config.ts` → `Config.setChromiumOpenGlRenderer('angle')`
- `remotion.config.ts` → `enableSkia()` als Webpack-Override
- `ki/src/index.ts` → `LoadSkia()` vor dynamischem Import/`registerRoot()`

## 7. Caption-Geometrie

Für neue 1080×1920-Production-Reels:

- `bottom: 250`
- `horizontalInset: 104`
- `maxWidth: 860`
- maximal 2 Zeilen
- Glass-/Blur-Overlay
- Fullscreen-Szenenhintergrund läuft hinter der Caption weiter

## 8. Visual-, Zoom- und SFX-Standard

Bewährter Default:

- ungefähr **70–80 % Remotion-native** UI/Text/Diagramm/Motion
- ungefähr **20–30 % echte Bilder/Screens**
- normalerweise **1–2 starke externe Proof-/Visual-Momente pro Reel**
- externe Binärvisuals lokal auflösen, lizenzprüfen und per SHA256 binden
- CameraPush, StoryCamera, Pan, Focus, Parallax, Reframe, Three/Skia und Scan nur mit Erklär-/Fokusnutzen
- semantische CC0-SFX folgen sichtbaren Events
- Voiceover bleibt Lautstärke-Priorität
- `@remotion/sfx` ist als Capability installiert, ersetzt aber nicht den lokalen CC0-Produktionspfad
- Lottie/Rive/3D/externe Bilder müssen vor Render lokal sein; keine Render-Time-Remote-Medien

## 9. Antigravity — kanonischer Produktionsmodus

Antigravity wird nicht als einzelner Universal-Agent eingesetzt, sondern als fokussiertes Agent-/Skill-/MCP-/Hook-System.

### 9 echte Workspace Agents

Unter `.agents/agents/<name>/agent.md`:

1. `ki-production-orchestrator`
2. `ki-fact-researcher`
3. `ki-retention-story-auditor`
4. `ki-motion-researcher`
5. `ki-remotion-story-engineer`
6. `ki-audio-sync-engineer`
7. `ki-visual-qa-auditor`
8. `ki-release-verifier`
9. `ki-dependency-auditor`

Unabhängige read-only Audits dürfen parallel laufen. Auf demselben Working Tree arbeitet gleichzeitig genau **ein** Writer. Konkurrenzvarianten nur in isolierten Branches/Worktrees.

### Fokus-MCPs

- Chrome DevTools MCP — Browser/Remotion-Studio-/Console-/Layout-QA
- Remotion Bits MCP — gezielte Suche/FETCH kleiner Motion-Patterns
- GitHub MCP — Remote-PR-/Issue-/Branch-Kontext

Fachfremde MCPs werden nicht blind aktiviert.

### 4 Hook-Ebenen

Plugin: `.agents/plugins/ki-channel-production/`

- `PreInvocation` — Session-/Branch-/Capability-Kontext
- `PreToolUse` — Sicherheitsgate
- `PostToolUse` — leichte Antigravity-/Repo-Regression nach echten Write-Tools
- `Stop` — laufende Background Tasks/Subagents vor Session-Ende einsammeln

### Kanonische Workflows

- `/bootstrap-ki-channel`
- `/sync-chatgpt-handoff`
- `/parallel-audit-ki-reel <path>`
- `/maximize-ki-reel <path>`
- `/visual-qa-ki-reel <path>`
- `/finish-ki-reel <path>`
- `/verify-ki-reel <path>`
- `/audit-remotion-upgrade`

### Capability-/Regression-Commands

```bash
npm run antigravity:skills
npm run antigravity:capabilities
npm run antigravity:verify
```

## 10. Antigravity Visual-QA / unabhängige Audits

Alle geplanten Story Beats können als echte Remotion-PNGs gerendert werden:

```bash
npm run antigravity:story-stills -- <reel-package-dir> --scale=1
```

Ausgabe:

`out/story-beat-stills/<reel-id>/manifest.json`

Danach kann ein Pixel-Delta-Diagnosebericht aufeinanderfolgende Beats auf verdächtig geringe sichtbare Änderung prüfen:

```bash
node scripts/analyze-story-beat-visual-deltas.mjs out/story-beat-stills/<reel-id>/manifest.json
```

`SUSPICIOUS_STATIC` ist nur ein Diagnosehinweis. Pixel-Unterschied ersetzt niemals Story-/Browser-/1x-Review.

Antigravity Headless kann zusätzlich strukturierte Zweit-Audits erzeugen:

```bash
npm run antigravity:audit -- <reel-package-dir> --mode=facts
npm run antigravity:audit -- <reel-package-dir> --mode=retention
npm run antigravity:audit -- <reel-package-dir> --mode=motion
npm run antigravity:audit -- <reel-package-dir> --mode=dependencies
npm run antigravity:audit -- <reel-package-dir> --mode=release
```

Die Runner nutzen Sandbox und keinen Permission-Bypass. Headless-Audits ersetzen keine deterministischen Gates.

Vor Veröffentlichung prüft `ki-release-verifier` zeitkritische Claims erneut gegen aktuelle Primärquellen. Eine materielle Änderung blockiert den Release und kann nach Script-Korrektur ein neues Nutzer-Voiceover erfordern.

## 11. Verbindliches Produktionsmodell

```text
PHASE 1 — ChatGPT / Coding-Agent
Idee + Fakten + 60–75-s-Skript + Copy + Szenen
→ story-beats.json (>=15 Beats)
→ Story-Arc + Visual/SFX-Plan
→ Remotion Story-Source
→ Struktur- + Storytelling-Gate

PHASE 2 — NUR NUTZER
Nutzer erzeugt das vollständige Voiceover und legt es lokal in 01-script-audio/

PHASE 3 — Codex / Antigravity
Capability-Map + relevante Spezialagenten
→ vorhandenes Nutzer-Audio prüfen
→ Runtime-WAV + Pause-Kompression
→ lokales Forced Alignment
→ WORD-TIMINGS + Scene/Caption-Lock
→ Story-Beats an echte Voice-/Szenenzeit anpassen
→ echtes 60–75-s-Dauergate
→ automatische CC0-SFX
→ externe Visuals lokal auflösen
→ Story-Beat-Stills + Pixel-/Browser-QA
→ renderrelevante Dateien committen
→ prepare-reel-render.mjs / Provenance-Lock
→ Remotion-Roh-Render
→ Social-Audio-Master ca. -16 LUFS
→ exakter 1x-Review
→ unabhängiger Release-Verifier inkl. Freshness
→ Finalizer + Export-Paket
```

## 12. Aktueller Abschluss-Test vor Merge von PR #28

Kanonischer Test-Reel:

`ki/reels/2026-08-24_bis_2026-08-30/05_GPT-5-6-API-Preise-und-Fast-Mode/`

Aktueller Sprechertext: **159 Wörter**. Planning-Timeline: **2070 Frames / 69 Sekunden** bei 30 fps.

Nach Review des ersten 61,7-s-Renders wurde die Source auf den Story-Standard umgebaut:

- **18 konkrete Visual Beats**
- 5 Kapitel mit mehreren Zustandsänderungen
- 3D-Hero
- Skia-/Effects-Layer
- Impact-Numbers / Vergleichsrail
- physischer Speed-vs-Cost-Seesaw
- echte `TransitionSeries` für `priority → routing → Fast Mode`
- reales Data-Center-Visual nach lokaler Auflösung, 3D-Fallback im Source
- offizieller OpenAI-Source-Proof

Aktueller Status:

`PHASE 2 — WARTET AUF NUTZER-AUDIO`

Der Nutzer muss sein vollständiges Voiceover selbst als

`01-script-audio/voiceover.mp3`

ablegen. Der GPT-5.6-Test lädt nichts automatisch herunter.

Nach dem Pull in Antigravity zuerst:

`/sync-chatgpt-handoff`

Danach kann `/maximize-ki-reel <GPT-Reel-Pfad>` den kompletten relevanten Capability-Stack nutzen.

Erst mit Nutzer-Audio:

```bash
node ki/scripts/test-gpt56-api-prices-fastmode.mjs
```

Nach Commit der erzeugten Timing-/Contract-Dateien:

```bash
node ki/scripts/test-gpt56-api-prices-fastmode.mjs --render-locked
```

## 13. Globale Produktions-Regressionen

Vor Merge/Release:

```bash
npm run antigravity:verify
npm run ki:reel:structure-check
node ki/scripts/validate-storytelling-motion.mjs <reel-package-dir>
npm run production:contracts
npm run repo:verify
npm run motion:verify
```

`prepare-reel-render.mjs` führt das Storytelling-Gate für den konkreten Reel erneut aus.

## 14. Finaler 1x-Review

Bei storytelling-enabled Reels zusätzlich zu Caption/Kamera/Audio/SFX/Visuals zwingend:

- `STORY_FLOW_1X_REVIEW: PASS`
- `VISUAL_REACTION_1X_REVIEW: PASS`
- `TRANSITIONS_PURPOSE_1X_REVIEW: PASS`
- `STATIC_STATE_OVER_LIMIT_VIOLATIONS: 0`

Der Review gilt ausschließlich für das exakte gemasterte MP4 und ist per SHA256 gebunden.

## 15. Verbindliche visuelle Identität

- Short-Form: 1080 × 1920 / 30 FPS
- Longform: 1920 × 1080 / 30 FPS
- Light-First
- faceless
- keine Cyberpunk-/Neon-Standardästhetik
- clean/premium, aber narrative hohe Visual-Beat-Dichte
- High Energy ist nicht High Speed: `REVEAL → SETTLE → READABLE HOLD`

## 16. Statusbegriffe niemals vermischen

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

## 17. Git-/Medienregel

Große Binärmedien (`mp3`, `wav`, `mp4`, `png` usw.) bleiben standardmäßig lokal/Artifact-Storage, solange Git LFS nicht eingerichtet ist.

In Git bleiben Source, Skripte, Story-Beats, Provenance, Timings, Reviews, Contracts und Export-Manifeste.

## 18. Bekannte externe Einschränkungen

- GitHub Actions ist für dieses private Repository derzeit auf Konto-/Billing-/Runner-Ebene blockiert.
- `main` hat derzeit keine Branch Protection.
- Ein `package-lock.json` ist noch nicht kanonisch erzeugt.
- Der neue Remotion-/Antigravity-Stack wurde über GitHub-Source integriert, aber in dieser ChatGPT-GitHub-Umgebung noch **nicht** per lokalem `npm install`, `npm run antigravity:verify`, TypeScript, MCP-Start, `agy` Headless, Remotion Bundle/Render oder Skia-Runtime ausgeführt.

Diese Betriebsgrenzen sind keine Erlaubnis, Test- oder Qualitätsregeln zu umgehen. Kein Merge-/Final-Ready-Claim, bis die lokalen Runtime-/Render-/Review-Beweise real vorliegen.
