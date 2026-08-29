# Antigravity / Gemini — KI-Channel Contract

Vor jeder Aufgabe zuerst `REPO-STATE.md`, danach `AGENTS.md` lesen. Für KI-Reels zusätzlich `ki/AGENTS.md`, `ki/gehirn/MASTER.md` und `ki/reels/AGENTS.md`. Für Plattform-/YouTube-Aufgaben zusätzlich `ki/gehirn/PLATTFORMEN.md` und `ki/plattformen/AGENTS.md`.

## Kanonischer Stand

`main` ist die Produktionswahrheit nach abgeschlossenen Merges. Wenn `REPO-STATE.md` oder der Nutzer ausdrücklich einen aktiven Stabilisierung-/Task-Branch nennt, wird **dieser bestehende Branch weitergeführt**. Nicht still zu `main` wechseln und die laufende Arbeit neu beginnen.

Normale neue Änderungen auf einem Arbeitsbranch; `main` nur nach bestandenem Produktionspfad und ausdrücklicher Merge-/Kanonisierungsentscheidung aktualisieren.

## Antigravity Session-Start

Für eine längere Antigravity-Session zuerst den Workspace vollständig bootstrappen:

`/bootstrap-ki-channel`

Wenn der Slash-Workflow nicht verfügbar ist, dieselben Schritte manuell ausführen:

```bash
npm run antigravity:skills
node scripts/list-antigravity-capabilities.mjs
npm run antigravity:verify
```

Der Capability-Scanner listet Workspace-Agenten, Skills, Workflows, Plugins, Plugin-Skills/-Rules, Hooks und MCP-Server. Diese Liste ist die Capability-Map der Session.

**Pflichtregel:** Antigravity nutzt für jede Aufgabe **jede verfügbare Fähigkeit, die die konkrete Aufgabe materiell verbessert**. Es soll aber nicht blind jedes Tool starten. Irrelevante MCPs/Plugins erzeugen Latenz, Tool-Noise und schlechtere Auswahl.

## Antigravity Customizations — immer nutzen, wenn relevant

Dieses Repo stellt native Antigravity-Customizations bereit:

- `.agents/agents.md` — spezialisierte Rollen für Orchestrierung, Remotion Story, Audio/Sync, Browser-QA und Release-Verifikation.
- `.agents/skills/` — Workspace Skills; für Story-Reels insbesondere `remotion-storytelling`, `remotion-bits-discovery` sowie die offiziell synchronisierten Remotion Skills.
- `.agents/workflows/` — Slash-Workflows `/bootstrap-ki-channel`, `/finish-ki-reel` und `/verify-ki-reel`.
- `.agents/plugins/ki-channel-production/` — KI-Channel Workspace-Plugin mit Regeln, Orchestrator-Skill, Hooks und MCP-Konfiguration.
- **Chrome DevTools MCP** — für Remotion Studio, Browser-Konsole, Screenshots, Layout-/Performance-/Visual-QA.
- **Remotion Bits MCP** — für gezielte Suche und Source-Inspektion wiederverwendbarer Remotion-Motion-Bausteine, wenn der vorhandene Story-Stack eine konkrete Anforderung nicht abdeckt.
- **GitHub MCP** — für Remote-Repo-, PR-, Issue- und Branch-Kontext; lokale Source-Edits nicht parallel über mehrere Write-Pfade erzeugen.

Offizielle Remotion Agent Skills nach Installation der Dependencies synchronisieren:

```bash
npm run antigravity:skills
```

Später aktualisieren:

```bash
npm run antigravity:skills:update
```

Vor längeren Aufgaben und nach Antigravity-Konfigurationsänderungen:

```bash
npm run antigravity:verify
```

**Keine irrelevanten MCPs/Plugins aktivieren.** Für dieses Repo sind Chrome DevTools, Remotion Bits und GitHub die fokussierten MCPs. Datenbank-, Payment-, Flutter- oder andere fachfremde Server nur dann hinzufügen, wenn eine konkrete spätere Aufgabe sie wirklich benötigt.

Wenn Docker fehlt, darf ein nicht verfügbarer GitHub-MCP-Server nicht die lokale Reel-Arbeit blockieren. Dann lokale Git-Tools verwenden und den MCP-Status ehrlich als nicht verfügbar melden.

## Capability-Routing

- **Story/Remotion-Source:** `remotion-storytelling` + alle synchronisierten offiziellen Remotion Skills, die direkt zur Aufgabe passen.
- **neue Motion-Idee, die Shared Components nicht abdecken:** `remotion-bits-discovery` + Remotion Bits MCP; Source vor Übernahme prüfen.
- **Browser-/Remotion-Studio-QA:** Chrome DevTools MCP.
- **Remote-PR-/Branch-/Issue-Kontext:** GitHub MCP.
- **komplexe Aufgabe über mehrere Bereiche:** Rollen aus `.agents/agents.md` verwenden.
- **End-to-End Phase 3:** `/finish-ki-reel`.
- **strikte Verifikation:** `/verify-ki-reel`.

## 3 Phasen

### Phase 1 — ChatGPT

Phase 1 erstellt bereits die komplette Code- und Planungsgrundlage. Dazu gehören Skript, `VOICEOVER-ZUM-KOPIEREN.txt`, `SCENE-VOICE-MAP.json`, `story-beats.json`, Szenen, Visual Beats, individuelle Animationen/New-Build-Entscheidungen, Bildprompts/Manifest falls nötig, SFX-Events, Captions, `03-caption/platform-copy.md`, `reel.json`, Remotion-Source, Composition und fokussierte Checks.

**Audio darf in Phase 1 fehlen.** Das ist normal.

### Phase 2 — Mensch

Der Mensch erzeugt ausschließlich das vollständige Produktions-Voiceover als `voiceover.wav` oder `voiceover.mp3` aus dem freigegebenen Text.

Agenten dürfen niemals fehlendes Produktions-Audio durch TTS, Remote-Download oder Preview-Dateien ersetzen.

### Phase 3 — Antigravity / Codex

Antigravity arbeitet auf der vorhandenen Phase-1-Implementierung. Nicht von Null neu bauen.

Bevorzugter Slash-Workflow:

`/finish-ki-reel <reel-package-dir>`

Ablauf:

1. Capability-Map erzeugen und alle für diese Aufgabe relevanten Skills/MCPs/Rollen auswählen.
2. `PHASE-STATUS.md` und `reel.json` lesen.
3. bei Storytelling `remotion-storytelling` verpflichtend laden; passende offizielle Remotion Skills ebenfalls verwenden.
4. Struktur und Antigravity-Integration prüfen.
5. vorhandenen Source und Composition prüfen.
6. echtes Nutzer-Voiceover suchen.
7. fehlt Audio: `PHASE 2 — WARTET AUF NUTZER-AUDIO` und stoppen.
8. Audio-Dauer messen, Runtime-WAV erzeugen und Pause-Kompression anwenden.
9. lokales Forced Alignment gegen den bekannten Text ausführen.
10. Captions, Wort-Timestamps, Szenengrenzen und Story Beats gegen das final tatsächlich verwendete Audio ausrichten.
11. falls ein lokaler Sprecherabschnitt danach noch zu schnell/zu langsam für den geplanten Beat ist: zuerst Pause an natürlicher Grenze korrigieren, dann bei Bedarf die komplette Phrase/den Cue **pitch-erhaltend leicht time-stretchen**.
12. Speedwechsel niemals mitten im Wort oder abrupt; Wortlaut/Reihenfolge unverändert lassen.
13. bevorzugter Retiming-Bereich `0.97x–1.03x`, bei echtem Bedarf bis ungefähr `0.94x–1.06x`; stärkere Korrektur → neues Phase-2-Voiceover statt hörbarer Verzerrung.
14. genehmigte Visual Beats, Story-Rollen, `REUSE_EXACT`/`NEW_BUILD` und Grounding-Pipeline erhalten.
15. wenn ein benötigter Motion-Baustein im Shared Stack fehlt: Remotion Bits MCP gezielt durchsuchen, Source prüfen und nur sinnvolle deterministische Muster übernehmen.
16. Chrome DevTools MCP / Browser nutzen, wenn verfügbar, um Remotion Studio, Console, Layout und echte Visual States zu prüfen.
17. fokussierte Tests, TypeScript, `repo:verify` und `motion:verify` ausführen.
18. relevante Smoke-Frames/Beat-Wechsel rendern und visuell prüfen.
19. echte Probleme beheben; keine Validatoren abschwächen.
20. gelockte Contract-/Timing-Dateien committen, dann Production-Provenance-Lock erzeugen.
21. finales Roh-MP4 rendern, Social-Audio-Master erzeugen und technisch prüfen.
22. exaktes gemastertes MP4 in normaler Geschwindigkeit vollständig ansehen **und anhören**.
23. Storyfluss, Caption-Sync, Camera/Transitions, SFX/Voice-Priorität, Proof-Visuals und statische Zustände explizit prüfen.
24. Checkliste/Status nur für tatsächlich ausgeführte Prüfungen aktualisieren.
25. im Abschlussbericht lokale Audio-Retiming-Stellen + Faktoren nennen oder `kein Retiming nötig` sowie die für die Aufgabe verwendeten Antigravity-Capabilities melden.

## Repository-Struktur

Planung:

`ki/reels/YYYY-MM-DD_bis_YYYY-MM-DD/NN_Reel-Titel/`

Source:

`ki/src/reels/<slug>/`

Nie Planung nach `ki/src/reels/` verschieben. Nie flache Reel-Pakete unter `ki/reels/<slug>/` erzeugen.

## Storytelling / Remotion

Für neue Story-Reels gilt der Vertrag aus `ki/gehirn/STORYTELLING_MOTION.md`.

Kernregeln:

- 60–75 Sekunden Voice-Locked-Laufzeit;
- bevorzugt 150–175 Wörter, bis 190 ohne Sonderfreigabe;
- mindestens 15 konkrete Visual Beats;
- jede Szene mindestens zwei sichtbare Zustandsänderungen;
- Story-Arc mindestens `HOOK`, `PROOF`, `CONSEQUENCE`, `PAYOFF`;
- zentrale Sprecher-Aussagen lösen sichtbare Reaktionen aus;
- Ziel: kein praktisch unveränderter Visual State länger als 4,5 Sekunden bei aktivem Voiceover;
- Camera/Zoom/Transition/SFX nur mit Erklär-, Fokus-, Verbindungs- oder Payoff-Nutzen;
- Render-Time-Medien lokal; keine Remote-Lottie/Rive/Bild/Audio/Video-URLs.

## Publishing / Plattformen

Short-Form wird einmal produziert. YouTube Shorts, Instagram Reels, TikTok, Facebook Reels und Snapchat verwenden denselben freigegebenen Master, solange keine technische Anpassung erforderlich ist.

Plattform-Copy liegt im Reel unter:

`03-caption/platform-copy.md`

Keine zweite Skript-/Source-Kopie in `ki/plattformen/` erzeugen. YouTube Longform ist ein separates Format und wird nicht automatisch aus einem Reel verlängert.

Aktuelle Plattformlimits/Monetarisierungsregeln bei konkreter Veröffentlichung neu prüfen.

## Bilder

`ki/BILDSTIL.md` ist verbindlich. Phase 1 entscheidet zuerst, ob ein Bild überhaupt nötig ist. Falls ja, liegt der Prompt unter `02-bilder/image-prompts.md`; der Prompt ist standardmäßig Englisch, sichtbare Labels im Bild nur kurz und deutsch. Überschriften, Captions, Pfeile, Zahlen und längere Texte gehören in Remotion.

## Aktuelles Context-Overload-Reel

Wenn ausdrücklich dieses Reel fortgesetzt/fertiggestellt wird:

`ki/reels/2026-08-03_bis_2026-08-09/02_Warum-mehr-Kontext-KI-schlechter-macht/`

Phase-3-Skill:

`.agents/skills/build-context-overload-reel/SKILL.md`

Der vorhandene Source liegt unter:

`ki/src/reels/antigravity-context-overload/`

Er wird wiederverwendet und nicht neu erfunden.

## Verifikation

Canonical gates:

```bash
node scripts/list-antigravity-capabilities.mjs
npm run antigravity:verify
npm run repo:wiring-check
npm run ki:reel:structure-check
npm run typecheck
npm test
npm run content:runtime:verify
npm run repo:verify
npm run motion:verify
```

Workspaces nie mit `--workspaces=false` umgehen. Keine Demo-Werte, Fake-Assets oder erfundene Erfolgsmeldungen.
