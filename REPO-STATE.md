# KI-Channel — kanonischer Repository-Stand

**Status:** 2026-08-29

Diese Datei ist der Einstiegspunkt für jeden neuen Chat, Codex-, Antigravity- oder anderen Coding-Agenten.

## 1. Kanonischer Branch

`main` ist der einzige kanonische Produktionsstand.

Aktuelle Stabilisierung läuft über Draft-PR **#28** direkt gegen `main` auf:

`fix/repo-stabilisierung-2026-08-24`

Die älteren PRs **#24, #26, #27 und #29** sind superseded/geschlossen. Der GPT-5.6-End-to-End-Test wurde über PR #30 in den Stabilisierungsbranch integriert.

## 2. Verbindliche Lesereihenfolge

Bei KI-Kanal-Arbeit gilt:

1. `REPO-STATE.md`
2. `AGENTS.md`
3. `ki/AGENTS.md`
4. `ki/gehirn/MASTER.md`
5. danach die passende Domäne
6. das ausdrücklich genannte Reel/Longform-Video/Format
7. erst danach konkrete Pläne, Source- oder Plattformdateien

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
ChatGPT/Codex erstellt nur Skript und Produktionsplan
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

Fehlt das Nutzer-Audio, lautet der Status:

`PHASE 2 — WARTET AUF NUTZER-AUDIO`

Die lokale Datei wird danach in eine deterministische Runtime-Audiospur umgewandelt:

`public/runtime-audio/<compositionId>.wav`

Diese Runtime-WAV ist Wort-/Frame-/Render-Autorität.

## 6. Caption-Geometrie

Für neue 1080×1920-Production-Reels:

- `bottom: 250`
- `horizontalInset: 104`
- `maxWidth: 860`
- maximal 2 Zeilen
- Glass-/Blur-Overlay
- Fullscreen-Szenenhintergrund läuft hinter der Caption weiter

## 7. Visual-, Zoom- und SFX-Standard

Bewährter Default:

- ungefähr **70–80 % Remotion-native** UI/Text/Diagramm/Motion
- ungefähr **20–30 % echte Bilder/Screens**
- normalerweise **1–2 starke externe Visual-Momente pro Reel**
- externe Binärvisuals lokal auflösen, lizenzprüfen und per SHA256 binden
- CameraPush, Pan, Focus, Parallax und Scan nur mit Erklär-/Fokusnutzen
- semantische CC0-SFX folgen sichtbaren Events
- Voiceover bleibt Lautstärke-Priorität
- SFX und Kameraeffekte werden beim echten 1x-Review geprüft

## 8. Verbindliches Produktionsmodell

```text
PHASE 1 — ChatGPT / Coding-Agent
Idee + Fakten + 60–75-s-Skript + Copy + Szenen + Visual Beats + Source + Preview-Timing

PHASE 2 — NUR NUTZER
Nutzer erzeugt das vollständige Voiceover und legt es lokal in 01-script-audio/

PHASE 3 — Codex / Antigravity
vorhandenes Nutzer-Audio prüfen
→ Runtime-WAV + Pause-Kompression
→ lokales Forced Alignment
→ WORD-TIMINGS + Scene/Caption-Lock
→ echtes 60–75-s-Dauergate
→ automatische CC0-SFX
→ externe Visuals lokal auflösen
→ renderrelevante Dateien committen
→ prepare-reel-render.mjs / Provenance-Lock
→ Remotion-Roh-Render
→ Social-Audio-Master ca. -16 LUFS
→ 1x-Review des gemasterten MP4
→ Finalizer + Export-Paket
```

## 9. Aktueller Abschluss-Test vor Merge von PR #28

Kanonischer Test-Reel:

`ki/reels/2026-08-24_bis_2026-08-30/05_GPT-5-6-API-Preise-und-Fast-Mode/`

Aktueller Sprechertext: **159 Wörter**. Planning-Timeline: **2070 Frames / 69 Sekunden** bei 30 fps.

Aktueller Status:

`PHASE 2 — WARTET AUF NUTZER-AUDIO`

Der Nutzer muss sein vollständiges Voiceover selbst als

`01-script-audio/voiceover.mp3`

ablegen. Der GPT-5.6-Test lädt nichts automatisch herunter.

Erst danach:

```bash
node ki/scripts/test-gpt56-api-prices-fastmode.mjs
```

Nach Commit der erzeugten Timing-/Contract-Dateien:

```bash
node ki/scripts/test-gpt56-api-prices-fastmode.mjs --render-locked
```

## 10. Globale Produktions-Regressionen

Vor Merge/Release:

```bash
npm run production:contracts
npm run repo:verify
npm run motion:verify
```

## 11. Verbindliche visuelle Identität

- Short-Form: 1080 × 1920 / 30 FPS
- Longform: 1920 × 1080 / 30 FPS
- Light-First
- faceless
- keine Cyberpunk-/Neon-Standardästhetik
- `REMOTION_NATIVE_MAXIMUM`
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
- `main` hat derzeit keine Branch Protection.
- Ein `package-lock.json` ist noch nicht kanonisch erzeugt.

Diese Betriebsgrenzen sind keine Erlaubnis, Test- oder Qualitätsregeln zu umgehen.
