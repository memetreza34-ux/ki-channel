# KI-Channel — kanonischer Repository-Stand

**Status:** 2026-08-29

Diese Datei ist der Einstiegspunkt für jeden neuen Chat, Codex-, Antigravity- oder anderen Coding-Agenten.

## 1. Kanonischer Branch

`main` ist der einzige kanonische Produktionsstand.

Andere `feature/*`, `fix/*`, `codex/*` und `backup/*` Branches sind Historie, Sicherungen oder Arbeitsstände. Sie dürfen nicht als aktuelle Wahrheit verwendet werden, außer der Nutzer nennt einen solchen Branch ausdrücklich.

Aktuelle Stabilisierung läuft über Draft-PR **#28** direkt gegen `main` auf:

`fix/repo-stabilisierung-2026-08-24`

Die älteren PRs **#24, #26, #27 und #29** sind superseded/geschlossen. Der GPT-5.6-End-to-End-Test wurde über PR #30 in den Stabilisierungsbranch integriert.

## 2. Verbindliche Lesereihenfolge

Bei KI-Kanal-Arbeit gilt:

1. `REPO-STATE.md`
2. `AGENTS.md`
3. `ki/AGENTS.md`
4. `ki/gehirn/MASTER.md`
5. danach die passende Domäne:
   - Reel-Arbeit → `ki/reels/AGENTS.md`
   - YouTube Longform → `ki/youtube-longform/AGENTS.md`
   - Plattform/Publishing → `ki/gehirn/PLATTFORMEN.md` + `ki/plattformen/AGENTS.md`
6. das ausdrücklich genannte Reel/Longform-Video/Format und dessen nächstes `AGENTS.md`
7. erst danach konkrete Pläne, Source- oder Plattformdateien

Für ausführbaren Source gelten zusätzlich:

- Reels → `ki/src/reels/AGENTS.md`
- Longform → `ki/src/longform/AGENTS.md`

Ältere Dokumente und historische Branches dürfen diese Reihenfolge nicht überschreiben.

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

Ausführbarer Remotion-Code liegt getrennt unter:

`ki/src/reels/<slug>/`

## 4. Phase-1 Script- und Laufzeit-Budget

Für **neue Reels** gilt:

- tatsächliche Voice-Locked-Laufzeit: **60–75 Sekunden**
- bevorzugt **150–175 gesprochene Wörter**
- bis **190 Wörter** ohne Sonderfreigabe
- `reel.json.scriptBudget.targetMinSeconds = 60`
- `reel.json.scriptBudget.targetMaxSeconds = 75`
- kürzer/länger nur mit bewusst dokumentierter Ausnahme

Vor Production-Render prüft fail-closed:

```bash
node ki/scripts/validate-reel-script-budget.mjs <reel-package-dir>
```

Das Wortbudget ist nur Phase-1-Planung. Nach Pause-Kompression und lokalem Forced Alignment prüft `prepare-reel-render.mjs` zusätzlich die **echte** Voice-Locked-Laufzeit. Unter 60 oder über 75 Sekunden blockiert neue Production-Reels ohne dokumentierte Ausnahme.

## 5. Produktions-Audio

Short-Form-Production verwendet eine lokale deterministische Runtime-Audiospur:

```text
public/runtime-audio/<compositionId>.wav
```

Sie wird als **48-kHz-Stereo-PCM-WAV** aus dem kanonischen lokalen Voiceover-Master erzeugt. Remotion lädt kein Voiceover während des Renders aus dem Netz.

Die Runtime-WAV ist die gemeinsame Wort-/Frame-/Render-Autorität. Bei bekanntem Sprechertext ist **lokales Forced Alignment** der Standard; freies Whisper-Transkribieren ist nur Fallback/Diagnose.

Kanonische Details: `ki/gehirn/AUDIO_PIPELINE.md` und `ki/gehirn/FORCED_ALIGNMENT.md`.

## 6. Caption-Geometrie

Für neue 1080×1920-Production-Reels:

- `bottom: 250`
- `horizontalInset: 104`
- `maxWidth: 860`
- maximal 2 Zeilen
- Glass-/Blur-Overlay statt separatem Footer
- Fullscreen-Szenenhintergrund läuft hinter der Caption weiter
- echte Smartphone-/Feed-Prüfung bleibt Pflicht

Quelle: `ki/src/reels/captionSafe.ts` + `ki/gehirn/CAPTION_SAFE_POSITION.md`.

## 7. Visual-, Zoom- und SFX-Standard

Bewährter Default:

- ungefähr **70–80 % Remotion-native** UI/Text/Diagramm/Motion
- ungefähr **20–30 % echte Bilder/Screens**
- normalerweise **1–2 starke externe Visual-Momente pro Reel**
- externe Binärvisuals werden lokal aufgelöst, lizenzgeprüft und per SHA256 gebunden
- `CameraPush`, Pan, Focus, Parallax und Scan nur mit sichtbarem Erklär-/Fokusnutzen
- keine Effekt-/Zoom-Kaskade nur für Bewegung
- längere 60–75-s-Reels brauchen mehrere Visual Beats innerhalb langer Szenen; kein minutenartiger statischer Hold
- semantische CC0-SFX folgen sichtbaren Events und werden über die gesamte Timeline sinnvoll verteilt
- Voiceover bleibt Lautstärke-Priorität
- SFX und Kameraeffekte werden beim echten 1x-Review geprüft

## 8. Verbindliches Produktionsmodell

```text
PHASE 1 — ChatGPT
Idee + Fakten + 60–75-s-Skript + Copy + Szenen + Visual Beats + Source + Preview-Timing

PHASE 2 — Audio
reales Voiceover per verfügbarem Voice-Tool oder vom Nutzer

PHASE 3 — Codex / Antigravity
Runtime-WAV + Pause-Kompression
→ lokales Forced Alignment
→ WORD-TIMINGS + Scene/Caption-Lock
→ echtes 60–75-s-Dauergate
→ automatische CC0-SFX
→ externe Visuals lokal auflösen
→ renderrelevante getrackte Dateien committen
→ prepare-reel-render.mjs / Provenance-Lock
→ Remotion-Roh-Render
→ Social-Audio-Master ca. -16 LUFS
→ exakter 1x-Review des gemasterten MP4
→ Finalizer + Export-Paket
```

Vor Production-Render:

```bash
node ki/scripts/prepare-reel-render.mjs <reel-package-dir>
```

Der Schritt verlangt einen sauberen tracked Worktree und erzeugt `RENDER_LOCKED` mit Git-Commit sowie Source-/Timing-/Audio-/SFX-/Visual-/Caption-Hashes.

Nach dem Roh-Render:

```bash
node ki/scripts/master-reel-video.mjs <raw-render.mp4> <mastered-render.mp4>
node ki/scripts/validate-social-audio-master.mjs <mastered-render.mp4>
node ki/scripts/validate-final-video.mjs <mastered-render.mp4>
```

Finalizer erst nach echtem 1x-Review des **gemasterten** MP4:

```bash
node ki/scripts/finalize-reel-export.mjs <reel-package-dir> <mastered-render.mp4>
node ki/scripts/validate-reel-export-package.mjs <reel-package-dir>
```

## 9. Aktueller Abschluss-Test vor Merge von PR #28

Kanonischer Test-Reel:

`ki/reels/2026-08-24_bis_2026-08-30/05_GPT-5-6-API-Preise-und-Fast-Mode/`

Aktueller Sprechertext: **159 Wörter**. Planning-Timeline: **2070 Frames / 69 Sekunden** bei 30 fps. Die endgültige Dauer wird erst aus dem frisch erzeugten `clear`-Voiceover nach Pause-Kompression + Forced Alignment akzeptiert und muss 60–75 Sekunden erreichen.

Das Reel wurde für die längere Laufzeit angepasst:

- Preis-Hook bleibt kompakt
- Luna/Terra plus Entwickler-Workflow als mehrere Visual Beats
- Sol Fast Mode mit längerem Smart-Crop/Zoom und 2,5×-Speed-Build
- Speed-vs-Cost-Trade-off über die Szene verteilt
- priority-Routing, Integration bleibt bestehen und Abschluss-Payoff als getrennte Beats
- SFX-Events über die längere Timeline verteilt

### Lauf 1 — lokale Timing-/Asset-Artefakte erzeugen

```bash
node ki/scripts/test-gpt56-api-prices-fastmode.mjs
```

Wenn getrackte Timing-/Contract-Dateien geändert werden, stoppt der Test absichtlich. Änderungen reviewen und committen.

### Lauf 2 — sauber gelockter Production-Render

```bash
node ki/scripts/test-gpt56-api-prices-fastmode.mjs --render-locked
```

Dieser Modus regeneriert die getrackten Timing-/Visual-Verträge nicht und muss auf sauberem Worktree den echten `prepare-reel-render.mjs`-Provenance-Lock erreichen.

Danach muss der erzeugte gemasterte MP4 bei 1x vollständig angesehen und angehört werden. `MOTION-READABILITY-REVIEW.md` wird an genau dessen SHA256 gebunden. Erst danach Finalizer/Export-Gate.

## 10. Globale Produktions-Regressionen

Vor Merge/Release:

```bash
npm run production:contracts
npm run repo:verify
npm run motion:verify
```

Der GitHub-Actions-Workflow ist inzwischen auf diese kanonischen Gates ausgerichtet, kann aber erst als Beweis dienen, sobald der private Actions-Runner/Billing wieder funktioniert.

## 11. Verbindliche visuelle Identität

- Short-Form: 1080 × 1920 / 30 FPS
- Longform: 1920 × 1080 / 30 FPS
- Light-First
- dunkle Schrift
- mehrere semantische Akzentfarben erlaubt
- faceless
- keine Cyberpunk-/Neon-Standardästhetik
- `REMOTION_NATIVE_MAXIMUM`
- Sprechertext, Caption, Überschrift und Animation haben unterschiedliche Aufgaben
- High Energy ist nicht High Speed: `REVEAL → SETTLE → READABLE HOLD`

## 12. Statusbegriffe niemals vermischen

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

## 13. Git-/Medienregel

Große Binärmedien (`mp3`, `wav`, `mp4`, `png` usw.) bleiben standardmäßig lokal/Artifact-Storage, solange Git LFS nicht eingerichtet ist.

In Git bleiben Source, Skripte, Provenance, Timings, Reviews, Contracts und Export-Manifeste.

## 14. Bekannte externe Einschränkungen

- GitHub Actions ist für dieses private Repository derzeit auf Konto-/Billing-/Runner-Ebene blockiert.
- `main` hat derzeit keine Branch Protection; vor langfristigem Team-/Agent-Betrieb sollte sie aktiviert werden.
- Ein `package-lock.json` ist noch nicht kanonisch erzeugt. Erst nach einem echten npm-Installationslauf erzeugen, niemals erfinden.

Diese Betriebsgrenzen sind keine Erlaubnis, Test- oder Qualitätsregeln zu umgehen.
