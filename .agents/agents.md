# KI-Channel — Antigravity Agent Team

Diese Datei ist die Übersicht. Die **echten Antigravity Custom Agents** liegen unter `.agents/agents/<name>/agent.md` und werden von Antigravity über `/agents` entdeckt.

Sie ersetzen nicht `REPO-STATE.md`, `GEMINI.md` oder die kanonischen Repo-Gates.

## Echte Workspace Agents

### `ki-production-orchestrator`

Hauptagent für lange Reel-Sessions. Koordiniert den 3-Phasen-Prozess, liest den Capability-Scan und delegiert unabhängige Arbeit parallel.

### `ki-fact-researcher`

Read-only. Verifiziert aktuelle AI-Fakten, Preise, Release-Daten und Primary Sources.

### `ki-retention-story-auditor`

Read-only. Prüft Hook, Progression, Proof, Konsequenz, Payoff, Beat-Dichte und wiederholte visuelle Grammatik. Liefert konkrete Scene-/Beat-Probleme statt generischem „mehr Engagement“.

### `ki-motion-researcher`

Read-only. Sucht passende Remotion-/Motion-Patterns, offizielle APIs und Remotion-Bits-Kandidaten für konkrete Story Beats.

### `ki-remotion-story-engineer`

Write-capable. Implementiert Story Beats, Camera/Reframe, TransitionSeries, Three/Skia/Lottie/Rive/Shapes und Proof-Visuals. Niemals parallel mit einem zweiten Writer auf denselben Dateien arbeiten lassen.

### `ki-audio-sync-engineer`

Write-capable Phase 3. Verarbeitet **nur** das vom Nutzer bereitgestellte Voiceover: Runtime-WAV, Forced Alignment, Timings, Captions, Szenen-Lock, SFX-Sync. Kein TTS und kein Voiceover-Download.

### `ki-visual-qa-auditor`

Read-only unabhängiger visueller Reviewer. Source allein reicht nie für PASS; echte Stills/Studio/Browser-Artefakte bzw. finales MP4 sind nötig.

### `ki-release-verifier`

Read-only/fail-closed. Führt die kanonischen Gates unabhängig aus und bestätigt nur real vorhandene Beweise.

### `ki-dependency-auditor`

Read-only. Prüft Remotion/React/Skia/Three/Rive/Lottie-Kompatibilität und aktuelle offizielle Docs, ohne selbst Upgrades durchzuführen.

## Antigravity Built-ins zusätzlich nutzen

Wenn passend:

- `research` — schnelle Codebase-/Dokurecherche;
- `browser` — Browser Agent für interaktive UI-/Remotion-Studio-Prüfung;
- `self` — paralleler Clone für klar isolierte Aufgaben.

## Parallelisierungsregel

Parallel ist erwünscht für **unabhängige read-only Aufgaben**, z. B.:

```text
Fact Research ──────┐
Retention Audit ────┤
Motion Research ────┼─ parallel → Orchestrator synthesizes
Dependency Audit ───┤
Existing Visual QA ─┘
```

Nicht parallel auf demselben Working Tree:

```text
Story Engineer + Audio Sync Engineer + anderer Writer
```

Wenn zwei Schreibvarianten wirklich parallel getestet werden sollen, isolierte Git-Worktrees/Branches verwenden.

## Standard-Orchestrierung

```text
/bootstrap-ki-channel
→ Capability Scan
→ relevante read-only Spezialagenten parallel
→ Orchestrator priorisiert Befunde
→ genau ein Implementation Writer
→ Nutzer-Audio-Gate
→ Audio Sync Engineer
→ Story-Beat-Stills + Pixel-Delta + Browser/Chrome DevTools
→ Visual QA Auditor
→ Release Verifier
→ erst bei echten PASS-Beweisen finalisieren
```

## Harte gemeinsame Regeln

- Produktions-Voiceover wird nur vom Nutzer erzeugt und lokal eingelegt.
- Aktiven Stabilisierung-/Task-Branch weiterführen; nicht still nach `main` wechseln.
- Keine Render-Time-Remote-Medien.
- Keine Validatoren abschwächen, um grün zu bekommen.
- Kein `PASS`, `gerendert`, `visuell geprüft`, `freigegeben` oder `veröffentlicht` ohne echte Ausführung/Evidenz.
- Jeder relevante Skill/MCP/Workflow wird genutzt; fachfremde Tools werden nicht nur deshalb gestartet, weil sie existieren.
