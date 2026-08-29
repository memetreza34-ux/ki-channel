# Antigravity / Gemini — KI-Channel Contract

Vor jeder Aufgabe zuerst `REPO-STATE.md`, danach `AGENTS.md` lesen. Für KI-Reels zusätzlich `ki/AGENTS.md`, `ki/gehirn/MASTER.md` und `ki/reels/AGENTS.md`. Für Plattform-/YouTube-Aufgaben zusätzlich `ki/gehirn/PLATTFORMEN.md` und `ki/plattformen/AGENTS.md`.

## Kanonischer Stand

`main` ist die Produktionswahrheit nach abgeschlossenen Merges. Wenn `REPO-STATE.md` oder der Nutzer ausdrücklich einen aktiven Stabilisierung-/Task-Branch nennt, wird **dieser bestehende Branch weitergeführt**. Nicht still zu `main` wechseln und die laufende Arbeit neu beginnen.

Normale neue Änderungen auf einem Arbeitsbranch; `main` nur nach bestandenem Produktionspfad und ausdrücklicher Merge-/Kanonisierungsentscheidung aktualisieren.

## Antigravity Customizations — immer nutzen, wenn relevant

Antigravity soll nicht nur den nackten Editor benutzen. Dieses Repo stellt native Antigravity-Customizations bereit:

- `.agents/agents.md` — spezialisierte Rollen für Orchestrierung, Remotion Story, Audio/Sync, Browser-QA und Release-Verifikation.
- `.agents/skills/` — Workspace Skills; für Story-Reels insbesondere `remotion-storytelling` sowie die offiziell synchronisierten Remotion Skills.
- `.agents/workflows/` — Slash-Workflows, insbesondere `/finish-ki-reel` und `/verify-ki-reel`.
- `.agents/plugins/ki-channel-production/` — KI-Channel Workspace-Plugin mit Regeln, Skill, Hooks und MCP-Konfiguration.
- **Chrome DevTools MCP** — für Remotion Studio, Browser-Konsole, Screenshots, Layout-/Performance-/Visual-QA.
- **GitHub MCP** — für Remote-Repo-, PR-, Issue- und Branch-Kontext; lokale Source-Edits nicht parallel über mehrere Write-Pfade erzeugen.

Vor längeren Antigravity-Aufgaben:

```bash
npm run antigravity:verify
```

Offizielle Remotion Agent Skills nach Installation der Dependencies synchronisieren:

```bash
npm run antigravity:skills
```

Später aktualisieren:

```bash
npm run antigravity:skills:update
```

**Keine irrelevanten MCPs/Plugins aktivieren.** Mehr Tools sind nicht automatisch besser. Für dieses Repo sind GitHub + Chrome DevTools die primären MCPs; Datenbank-, Payment-, Flutter- oder andere fachfremde Server erzeugen nur Tool-Noise.

Wenn Docker fehlt, darf ein nicht verfügbarer GitHub-MCP-Server nicht die lokale Reel-Arbeit blockieren. Dann lokale Git-Tools verwenden und den MCP-Status ehrlich als nicht verfügbar melden.

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

1. `PHASE-STATUS.md` und `reel.json` lesen.
2. relevante Skills laden; bei Storytelling `remotion-storytelling` verpflichtend.
3. Struktur und Antigravity-Integration prüfen.
4. vorhandenen Source und Composition prüfen.
5. echtes Nutzer-Voiceover suchen.
6. fehlt Audio: `PHASE 2 — WARTET AUF NUTZER-AUDIO` und stoppen.
7. Audio-Dauer messen, Runtime-WAV erzeugen und Pause-Kompression anwenden.
8. lokales Forced Alignment gegen den bekannten Text ausführen.
9. Captions, Wort-Timestamps, Szenengrenzen und Story Beats gegen das final tatsächlich verwendete Audio ausrichten.
10. falls ein lokaler Sprecherabschnitt danach noch zu schnell/zu langsam für den geplanten Beat ist: zuerst Pause an natürlicher Grenze korrigieren, dann bei Bedarf die komplette Phrase/den Cue **pitch-erhaltend leicht time-stretchen**.
11. Speedwechsel niemals mitten im Wort oder abrupt; Wortlaut/Reihenfolge unverändert lassen.
12. bevorzugter Retiming-Bereich `0.97x–1.03x`, bei echtem Bedarf bis ungefähr `0.94x–1.06x`; stärkere Korrektur → neues Phase-2-Voiceover statt hörbarer Verzerrung.
13. genehmigte Visual Beats, Story-Rollen, `REUSE_EXACT`/`NEW_BUILD` und Grounding-Pipeline erhalten.
14. Chrome DevTools MCP / Browser nutzen, wenn verfügbar, um Remotion Studio, Console, Layout und echte Visual States zu prüfen.
15. fokussierte Tests, TypeScript, `repo:verify` und `motion:verify` ausführen.
16. relevante Smoke-Frames/Beat-Wechsel rendern und visuell prüfen.
17. echte Probleme beheben; keine Validatoren abschwächen.
18. gelockte Contract-/Timing-Dateien committen, dann Production-Provenance-Lock erzeugen.
19. finales Roh-MP4 rendern, Social-Audio-Master erzeugen und technisch prüfen.
20. exaktes gemastertes MP4 in normaler Geschwindigkeit vollständig ansehen **und anhören**.
21. Storyfluss, Caption-Sync, Camera/Transitions, SFX/Voice-Priorität, Proof-Visuals und statische Zustände explizit prüfen.
22. Checkliste/Status nur für tatsächlich ausgeführte Prüfungen aktualisieren.
23. im Abschlussbericht lokale Audio-Retiming-Stellen + Faktoren nennen oder `kein Retiming nötig` melden.

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
