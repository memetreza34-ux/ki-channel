# Antigravity / Gemini — KI-Channel Contract

Vor jeder Aufgabe zuerst `REPO-STATE.md`, danach `AGENTS.md` lesen. Für KI-Reels zusätzlich `ki/AGENTS.md`, `ki/gehirn/MASTER.md`, `ki/gehirn/STORYTELLING_MOTION.md` und `ki/reels/AGENTS.md` lesen.

## 1. Kanonischer Stand / Branch

`main` ist die Produktionswahrheit nach abgeschlossenen Merges. Wenn `REPO-STATE.md` oder der Nutzer ausdrücklich einen aktiven Stabilisierung-/Task-Branch nennt, wird **dieser bestehende Branch weitergeführt**.

Nicht still zu `main` wechseln, nicht Phase 1 neu erfinden und nicht vorhandene Remote-Arbeit durch alte lokale Chat-Erinnerung ersetzen.

Nach neuen ChatGPT/Codex-Änderungen am Remote-Branch zuerst:

`/sync-chatgpt-handoff`

## 2. Antigravity Session-Start

Für eine längere Produktionssession zuerst:

`/bootstrap-ki-channel`

Manueller Fallback:

```bash
npm install --package-lock=false --no-audit --no-fund
npm run antigravity:skills
npm run antigravity:capabilities
npm run antigravity:verify
```

Lokales Setup und UI-/Permission-Hinweise stehen in:

`.agents/ANTIGRAVITY-LOCAL-SETUP.md`

**Pflichtregel:** Nutze jede verfügbare Fähigkeit, die die konkrete Aufgabe materiell verbessert. Starte nicht blind fachfremde Tools nur weil sie existieren.

## 3. Echte Custom Agents

Die eigentlichen Antigravity-Agenten liegen unter:

`.agents/agents/<name>/agent.md`

Übersicht: `.agents/agents.md`.

Verfügbare KI-Channel-Spezialisten:

- `ki-production-orchestrator` — End-to-End-Koordination;
- `ki-fact-researcher` — aktuelle Fakten/Primary Sources, read-only;
- `ki-motion-researcher` — Remotion-/Motion-Recherche, read-only;
- `ki-remotion-story-engineer` — einziger Story-/Visual-Writer im aktuellen Working Tree;
- `ki-audio-sync-engineer` — Phase-3 Audio/Forced Alignment/Timing;
- `ki-visual-qa-auditor` — unabhängige Pixel-/Artefaktprüfung, read-only;
- `ki-release-verifier` — unabhängiger fail-closed Abschlussprüfer;
- `ki-dependency-auditor` — Remotion/React/Skia/Three/Rive/Lottie-Kompatibilität, read-only.

Antigravity Built-ins `research`, `browser` und `self` dürfen zusätzlich genutzt werden, wenn sie besser zur Teilaufgabe passen.

### Parallelisierungsregel

Unabhängige **read-only** Arbeit parallelisieren:

```text
Fact Research ─────┐
Motion Research ───┼─ parallel → Orchestrator synthetisiert
Dependency Audit ──┤
Visual QA ─────────┘
```

Auf demselben Working Tree arbeitet gleichzeitig **genau ein Writer**. Für konkurrierende Schreibexperimente isolierte Branches/Worktrees verwenden.

## 4. Skills / Plugin / MCP / Hooks

### Skills

- `remotion-storytelling` ist bei storytelling-enabled Reels verpflichtend.
- `remotion-bits-discovery` nur nutzen, wenn der Shared StoryMotion/StoryMedia-Stack eine konkrete Motion-Anforderung nicht sinnvoll abdeckt.
- `figma-design-reference` nur nutzen, wenn ein konkreter Figma-Link/Frame oder eine hochwertige Layout-/Motion-Referenz die Aufgabe wirklich verbessert; Figma bleibt reference-only.
- `rive-local-motion` nur für bereits vorhandene lokale `.riv`-Dateien; keine neue kostenpflichtige Export-Abhängigkeit erzeugen.
- synchronisierte offizielle Remotion Agent Skills passend zur Aufgabe nutzen.

Offizielle Remotion Skills:

```bash
npm run antigravity:skills
npm run antigravity:skills:update
```

### Plugin

Workspace-Plugin:

`.agents/plugins/ki-channel-production/`

Es bündelt Repo-Regeln, Orchestrator-Skill, Hooks und MCP-Konfiguration.

### Fokus-MCPs

- **Chrome DevTools MCP** — Remotion Studio, Browser-Konsole, Screenshots, Layout-/Visual-QA;
- **Remotion Bits MCP** — gezielte Suche/FETCH kleiner wiederverwendbarer Motion-Patterns;
- **GitHub MCP** — Remote-Repo-/PR-/Issue-/Branch-Kontext;
- **Lottie Creator MCP** — optional, standardmäßig deaktiviert, nur für einen konkreten Motion-Beat;
- **Figma Remote MCP** — optional, standardmäßig deaktiviert, read-oriented Designkontext über `https://mcp.figma.com/mcp`.

Figma nur bei konkretem Referenzbedarf temporär aktivieren. Schreib-/Create-/Asset-Download-Tools bleiben deaktiviert; Figma-URLs oder Figma-gehostete Medien dürfen nie Render-Abhängigkeit werden. Nach dem Referenzpass Figma wieder deaktivieren.

Wenn GitHub MCP wegen Docker/OAuth fehlt, lokale Git-Arbeit fortsetzen und MCP ehrlich als unavailable melden. Keine Datenbank-/Payment-/Flutter-/Cloud-MCPs ohne konkrete Aufgabe hinzufügen.

### Hooks

Das Plugin erzwingt:

- `PreInvocation` — Session-/Branch-/Capability-Erinnerung;
- `PreToolUse` — Sicherheitsgate für Commands und Dateiänderungen;
- `PostToolUse` — leichte Repo-Regression nach echten Antigravity-Write-Tools;
- `Stop` — nicht stoppen, solange Background Tasks/Subagents noch aktiv sind.

Produktions-Voiceover-Erzeugung/-Download wird zusätzlich technisch blockiert.

## 5. Höchste Qualitäts-Workflows

### Nach Remote-Änderung von ChatGPT/Codex

`/sync-chatgpt-handoff`

### Unklar, warum ein Reel noch nicht stark genug ist

`/parallel-audit-ki-reel <reel-package-dir>`

### Maximale Reel-Qualität

`/maximize-ki-reel <reel-package-dir>`

Dieser Workflow nutzt parallele read-only Intelligence, danach einen Implementation Writer, danach Audio-Sync, Browser/Pixel-QA und unabhängige Release-Verifikation.

### Kostenlose externe Visual-Kandidaten finden

`/scout-free-assets <query>`

Pexels/Pixabay bleiben Discovery-only; keine automatische Produktionsfreigabe.

### Kleine eigene Lottie-Motion bauen

`/create-lottie-motion <reel-package-dir> <beat-id>`

Lottie Creator MCP nur temporär aktivieren; Export lokal prüfen.

### Konkrete Figma-Referenz prüfen

`/inspect-figma-reference <figma-link> <beat-id>`

Figma nur read-oriented als Designkontext verwenden und danach wieder deaktivieren.

### Nur visuell prüfen

`/visual-qa-ki-reel <reel-package-dir>`

### Phase 3 fertigstellen

`/finish-ki-reel <reel-package-dir>`

### Nur streng verifizieren

`/verify-ki-reel <reel-package-dir>`

### Remotion-Versionen prüfen, ohne Stabilisierung zu gefährden

`/audit-remotion-upgrade`

## 6. 3 Phasen

### Phase 1 — ChatGPT / Coding-Agent

Erstellt:

- Idee/Fakten/Quellen;
- finales 60–75-s-Skript;
- `VOICEOVER-ZUM-KOPIEREN.txt`;
- `SCENE-VOICE-MAP.json`;
- `story-beats.json`;
- Szenen/Visual Beats/SFX-Events;
- Visual-/Bildplan;
- Caption-/Platform-Copy;
- `reel.json`;
- Remotion-Source und Composition;
- fokussierte Phase-1-Gates.

Audio darf fehlen. Das ist normal.

### Phase 2 — ausschließlich Nutzer

Der Nutzer erzeugt das vollständige Produktions-Voiceover selbst und legt es normalerweise hier ab:

`01-script-audio/voiceover.mp3`

oder als `.wav`.

Kein Agent darf:

- Produktions-TTS erzeugen;
- Remote-Voiceover herunterladen;
- Preview-Audio einsetzen;
- fehlendes Audio ersetzen.

Fehlt es in Phase 3:

`PHASE 2 — WARTET AUF NUTZER-AUDIO`

und stoppen.

### Phase 3 — Antigravity / Codex

1. vorhandenes Nutzer-Audio prüfen;
2. Runtime-WAV / Pause-Kompression;
3. lokales Forced Alignment gegen bekannten Text;
4. `WORD-TIMINGS.json`, Captions und Szenengrenzen locken;
5. Story Beats an echte Voice-Zeiten anpassen;
6. semantische lokale CC0-SFX nach Voice-/Scene-Lock;
7. externe Visuals lokal auflösen + Rechte/SHA256;
8. TypeScript/Repo-/Motion-Gates;
9. Story-/Beat-Stills + Browser/Studio-QA;
10. renderrelevante Verträge committen;
11. Provenance-Lock;
12. Raw Render;
13. Social-Audio-Master;
14. technische A/V-Prüfung;
15. exaktes gemastertes MP4 vollständig bei 1x ansehen **und anhören**;
16. Finalizer/Export-Gate.

Bei lokalem Audio-Retiming zuerst natürliche Pausen korrigieren, danach nur komplette Phrase/Cue pitch-erhaltend leicht stretchen. Bevorzugt `0.97x–1.03x`, nur bei echtem Bedarf ungefähr `0.94x–1.06x`; stärkere Korrektur → neues Nutzer-Voiceover statt hörbarer Verzerrung.

## 7. Storytelling / Remotion

Neue Standard-Reels:

- echte Voice-Locked-Laufzeit 60–75 Sekunden;
- bevorzugt 150–175 Wörter, bis 190 ohne Sonderfreigabe;
- mindestens 15 konkrete Visual Beats;
- jede Szene mindestens zwei sichtbare Zustandsänderungen;
- Arc mindestens `HOOK`, `PROOF`, `CONSEQUENCE`, `PAYOFF`;
- jede Kern-Aussage löst eine sichtbare Reaktion aus;
- Ziel: kein praktisch unveränderter Visual State >4,5 s bei aktivem Voiceover;
- Kamera/Zoom/Transition/SFX nur mit Erklär-, Fokus-, Verbindungs- oder Payoff-Nutzen;
- ungefähr 70–80 % Remotion-native Motion/UI/Diagramm/Typografie;
- ungefähr 20–30 % reale Visuals, typischerweise 1–2 starke Proof-Momente;
- keine Render-Time-Remote-Medien.

## 8. Pixel-/Browser-QA

Jeder Story Beat kann als echtes PNG gerendert werden:

```bash
npm run antigravity:story-stills -- <reel-package-dir> --scale=1
```

Danach Pixel-Deltas zwischen Beats diagnostizieren:

```bash
node scripts/analyze-story-beat-visual-deltas.mjs out/story-beat-stills/<reel-id>/manifest.json
```

`SUSPICIOUS_STATIC` ist ein manueller Prüfhinweis, kein automatisches Qualitätsurteil. Hoher Pixel-Unterschied beweist ebenfalls kein gutes Storytelling.

Chrome DevTools MCP / Browser Agent und echte Remotion-Studio-/Render-Artefakte nutzen. Source allein reicht nie für `VISUAL PASS`.

## 9. Headless-Audits

Antigravity CLI kann unabhängige strukturierte Zweitprüfungen ausführen:

```bash
npm run antigravity:audit -- <reel-package-dir> --mode=facts
npm run antigravity:audit -- <reel-package-dir> --mode=motion
npm run antigravity:audit -- <reel-package-dir> --mode=dependencies
npm run antigravity:audit -- <reel-package-dir> --mode=release
```

Die Runner verwenden Sandbox und **keinen** Permission-Bypass. Ergebnisse landen unter `out/antigravity-audits/`.

Headless-Audits ersetzen niemals deterministische Gates oder den finalen 1x-Review.

## 10. Optionale Antigravity-Hochleistungsfunktionen

- **Modern Web Guidance** aus `Build with Google Plugins`: optional für aktuelle React/Web-Implementierungsqualität; keine Remotion-/Repo-Regel überschreiben.
- **Teamwork `/teamwork-preview`**: nur für wirklich große, unabhängige Multi-Workstream-Systemänderungen, wenn auf dem aktuellen Antigravity-Plan verfügbar. Für ein einzelnes Reel sind unsere fokussierten Custom Agents normalerweise geeigneter.
- Background Tasks/Subagents immer vor Session-Ende einsammeln; Stop-Hook schützt zusätzlich.

## 11. Repository-Struktur

Planung:

`ki/reels/YYYY-MM-DD_bis_YYYY-MM-DD/NN_Reel-Titel/`

Source:

`ki/src/reels/<slug>/`

Nie Planung nach `ki/src/reels/` verschieben. Nie flache Reel-Pakete erzeugen.

## 12. Publishing

Short-Form wird einmal produziert. YouTube Shorts, Instagram Reels, TikTok, Facebook Reels und Snapchat nutzen denselben freigegebenen Master, solange keine technische Anpassung erforderlich ist.

Plattform-Copy:

`03-caption/platform-copy.md`

YouTube Longform ist separat und wird nicht automatisch aus einem Reel verlängert.

## 13. Bilder

`ki/BILDSTIL.md` ist verbindlich. Erst entscheiden, ob ein Bild inhaltlich nötig ist. Längere Texte, Captions, Zahlen, Pfeile und UI-Labels gehören bevorzugt in Remotion statt ins generierte Bild.

## 14. Verifikation

Canonical basis:

```bash
npm run antigravity:capabilities
npm run antigravity:verify
npm run repo:wiring-check
npm run ki:reel:structure-check
npm run typecheck
npm test
npm run content:runtime:verify
npm run repo:verify
npm run motion:verify
```

Optionale Erweiterungen zusätzlich separat prüfen, wenn sie geändert/verwendet wurden:

```bash
node scripts/check-pexels-scout-integration.mjs
node scripts/check-pixabay-scout-integration.mjs
node scripts/check-lottie-creator-integration.mjs
node scripts/check-rive-local-motion-integration.mjs
node scripts/check-figma-mcp-integration.mjs
```

Zusätzlich die reel-spezifischen Story-/Audio-/Visual-/Render-/Master-/Final-Gates ausführen.

Workspaces nie mit `--workspaces=false` umgehen. Keine Demo-Werte, Fake-Assets oder erfundene Erfolgsmeldungen.

Statusbegriffe nicht vermischen:

```text
geplant
implementiert
technisch getestet
gerendert
visuell geprüft
freigegeben
veröffentlicht
```

Nur real ausgeführte Prüfungen als bestanden melden.
