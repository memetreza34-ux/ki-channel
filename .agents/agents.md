# KI-Channel — Antigravity Agent Team

Diese Datei ist die Übersicht. Die **echten Antigravity Custom Agents** liegen unter `.agents/agents/<name>/agent.md` und werden von Antigravity über `/agents` entdeckt.

Sie ersetzen nicht `REPO-STATE.md`, `GEMINI.md` oder die kanonischen Repo-Gates.

## Echte Workspace Agents

### `ki-production-orchestrator`

Hauptagent für lange Reel-Sessions. Koordiniert den 3-Phasen-Prozess, liest den Capability-Scan und delegiert unabhängige Arbeit parallel.

### `ki-longform-production-orchestrator`

Hauptagent für **YouTube `LONGFORM_V1`**. Vor jeder Longform-Produktion führt er `node scripts/check-antigravity-longform-capabilities.mjs` aus und folgt `.agents/workflows/longform-full-cycle.md`. Er besitzt Phase 1 und 3 inklusive konkreter Bild-/B-Roll-Suche, kontrollierter Materialisierung, Rechte-/Provenance-Prüfung, Remotion-Orchestrierung und kanonischem Review-Render. Der Nutzer liefert nur das finale Voiceover.

### `ki-fact-researcher`

Read-only. Verifiziert aktuelle AI-Fakten, Preise, Release-Daten und Primary Sources.

### `ki-retention-story-auditor`

Read-only. Prüft Hook, Progression, Proof, Konsequenz, Payoff, Beat-Dichte und wiederholte visuelle Grammatik. Liefert konkrete Scene-/Beat-Probleme statt generischem „mehr Engagement“.

### `ki-motion-researcher`

Read-only. Sucht passende Remotion-/Motion-Patterns, offizielle APIs und Remotion-Bits-Kandidaten für konkrete Story Beats.

### `ki-brand-motion-director`

Read-only. Prüft echte Brand-/Logo-/UI-Möglichkeiten, markentreue Farbwelten, funktionale Icons, Motion-Vielfalt und neue Capability-Lücken. Er darf neue Animationstechniken empfehlen, auch wenn sie noch nicht in der Shared Library existieren, solange sie Story, Lesbarkeit und Performance verbessern.

### `ki-remotion-story-engineer`

Write-capable für Reels. Implementiert Story Beats, Camera/Reframe, TransitionSeries, Three/Skia/Lottie/Rive/Shapes, neue semantisch sinnvolle Motion-Techniken und Proof-Visuals. Niemals parallel mit einem zweiten Writer auf denselben Dateien arbeiten lassen.

### `ki-longform-remotion-engineer`

Write-capable für **YouTube `LONGFORM_V1`**. Baut ausschließlich voice-gelockte 1920×1080/30-FPS-Compositions aus freigegebenen lokalen Medien und offenen story-getriebenen Remotion-Techniken. Keine gleichen Fix-Dauern pro Kapitel, keine Placeholder, keine Fake-Evidence, keine Remote-Medien. Er ist der einzige visuelle Writer auf dem Longform-Working-Tree.

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
- `browser` — Browser Agent für interaktive UI-/Remotion-Studio-Prüfung und exakte offizielle Source-Captures;
- `self` — paralleler Clone für klar isolierte Aufgaben.

## Parallelisierungsregel

Parallel ist erwünscht für **unabhängige read-only Aufgaben**, z. B.:

```text
Fact Research ──────────┐
Retention Audit ────────┤
Motion Research ────────┤
Brand/Motion Direction ─┼─ parallel → Orchestrator synthesizes
Dependency Audit ───────┤
Existing Visual QA ─────┘
```

Nicht parallel auf demselben Working Tree:

```text
Reel Story Engineer / Longform Remotion Engineer + Audio Sync Engineer + anderer Writer
```

Wenn zwei Schreibvarianten wirklich parallel getestet werden sollen, isolierte Git-Worktrees/Branches verwenden.

## Reel-Orchestrierung

```text
/bootstrap-ki-channel
→ Capability Scan
→ relevante read-only Spezialagenten parallel
→ Brand/Motion Director bei branded/current-news v4
→ Reel-Orchestrator priorisiert Befunde
→ genau ein Reel Implementation Writer
→ Nutzer-Audio-Gate
→ Audio Sync Engineer
→ Story-Beat-Stills + Pixel-Delta + Browser/Chrome DevTools
→ Visual QA Auditor
→ Release Verifier
→ erst bei echten PASS-Beweisen finalisieren
```

## YouTube-Longform-Orchestrierung

```text
ki-longform-production-orchestrator
→ node scripts/check-antigravity-longform-capabilities.mjs
→ .agents/workflows/longform-full-cycle.md
→ Research / Claims / Script / konkrete Media-Discovery
→ Nutzer-Voiceover-Gate
→ Forced Alignment / Voice Lock
→ Media materialisieren → SHA binden → explizit prüfen/APPROVED
→ ki-longform-remotion-engineer als einziger visueller Writer
→ check-ki-longform-render-readiness.mjs
→ render-ki-longform-master.mjs
→ Master-QA + Contact Sheets + kompletter 1x Review
→ Release Verifier
```

## Harte gemeinsame Regeln

- Produktions-Voiceover wird nur vom Nutzer erzeugt und lokal eingelegt.
- Aktiven Stabilisierung-/Task-Branch weiterführen; nicht still nach `main` wechseln.
- Keine Render-Time-Remote-Medien.
- Keine Validatoren abschwächen, um grün zu bekommen.
- Kein `PASS`, `gerendert`, `visuell geprüft`, `freigegeben` oder `veröffentlicht` ohne echte Ausführung/Evidenz.
- Jeder relevante Skill/MCP/Workflow wird genutzt; fachfremde Tools werden nicht nur deshalb gestartet, weil sie existieren.
- Neue Skills/Agenten/MCPs/Packages nur ergänzen, wenn sie eine reale neue Fähigkeit oder einen wiederkehrenden Engpass lösen; keine redundante Tool-Sammlung.
