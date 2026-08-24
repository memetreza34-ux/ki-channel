# KI-Channel — kanonischer Repository-Stand

**Status:** 2026-08-24

Diese Datei ist der Einstiegspunkt für jeden neuen Chat, Codex-, Antigravity- oder anderen Coding-Agenten.

## 1. Kanonischer Branch

`main` ist der einzige kanonische Produktionsstand.

Andere `feature/*`, `fix/*`, `codex/*` und `backup/*` Branches sind Historie, Sicherungen oder frühere Arbeitsstände. Sie dürfen nicht als aktuelle Wahrheit verwendet werden, außer der Nutzer nennt einen solchen Branch ausdrücklich.

Neue normale Änderungen starten von `main` auf einem neuen Arbeitsbranch. `main` wird nicht direkt verändert, außer der Nutzer verlangt ausdrücklich eine Repository-Stabilisierung oder Kanonisierung.

Aktuelle Stabilisierung läuft über Draft-PR **#28** direkt gegen `main`. Die älteren gestapelten Draft-PRs #26 und #27 sind superseded und geschlossen.

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

Für ausführbaren Source gelten zusätzlich die nächstliegenden Source-Verträge:

- Reels → `ki/src/reels/AGENTS.md`
- Longform → `ki/src/longform/AGENTS.md`

Ältere Dokumente, alte PR-Beschreibungen und historische Branches dürfen diese Reihenfolge nicht überschreiben.

## 3. Kanonische Short-Form-Produktionsstruktur

Planung, Audio, Assets und Export eines Reels liegen ausschließlich hier:

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

Ausführbarer Remotion-Code liegt getrennt hier:

```text
ki/src/reels/<slug>/
```

Planungsdateien werden niemals in `ki/src/reels/` verschoben. Ein Produktionspaket wird niemals direkt unter `ki/` oder flach unter `ki/reels/<slug>/` angelegt.

## 4. Produktions-Audio

Short-Form-Production verwendet eine lokale, deterministische Runtime-Audiospur:

```text
public/runtime-audio/<compositionId>.wav
```

Sie wird vor dem Render aus dem kanonischen lokalen Voiceover-Master erzeugt. Remotion lädt kein Voiceover während des Renders aus dem Netz. Die Runtime-Datei ist 48-kHz-Stereo-PCM-WAV, um ein zweites verlustbehaftetes MP3-Encoding und Encoder-Delay zu vermeiden.

Kanonische Details: `ki/gehirn/AUDIO_PIPELINE.md`.

## 5. Kanonische Caption-Geometrie

Für neue 1080×1920-Production-Reels gilt als aktueller gemeinsamer Standard:

- `bottom: 250`
- `horizontalInset: 104`
- `maxWidth: 860`
- maximal 2 Zeilen
- Glass-/Blur-Overlay statt separatem Footer
- Fullscreen-Szenenhintergrund läuft hinter der Caption weiter
- echte Feed-/Smartphone-Prüfung bleibt Pflicht

Quelle: `ki/src/reels/captionSafe.ts` + `ki/gehirn/CAPTION_SAFE_POSITION.md`.

## 6. Verbindliches Produktionsmodell

```text
PHASE 1 — ChatGPT
Idee + Fakten + Skript + Copy-Text + Szenen + Visual Beats + Source + Preview-Timing

PHASE 2 — Audio
reales Voiceover: tatsächlich per verfügbarem Voice-Tool erzeugt oder vom Nutzer bereitgestellt

PHASE 3 — Codex / Antigravity
lokales Audio + Voice-Lock + finale Szenengrenzen + Pre-Render-Gate + Render + 1x-Review + Final-Gates + Export
```

Vor Production-Render:

```bash
node ki/scripts/prepare-reel-render.mjs <reel-package-dir>
```

Dieser Schritt blockiert geschätzte Plan-Timings als Finalzustand und bereitet die lokale Runtime-Audiospur vor.

Nach Final-Render:

```bash
node ki/scripts/finalize-reel-export.mjs <reel-package-dir> <rendered-video.mp4>
node ki/scripts/validate-reel-export-package.mjs <reel-package-dir>
```

## 7. Globale Produktions-Regressionen

Vor Merge/Release ausführen:

```bash
npm run production:contracts
```

Der Check schützt unter anderem vor:

- statischen Audio-/Video-Binary-Imports in `Root.tsx`
- Remote-Media-URLs im Production-Source
- Rückkehr alter Caption-Geometrien
- fehlender Runtime-Audio-Pipeline
- fehlenden Final-/Voice-/Motion-Gates

`npm run repo:verify` führt diesen Produktionsvertrag ebenfalls zuerst aus.

## 8. Verbindliche visuelle Identität

- Short-Form standardmäßig 1080 × 1920 / 30 FPS
- Longform aktuell 1920 × 1080 / 30 FPS
- Light-First: helle Fullscreen-Szenen als Default
- dunkle Schrift
- mehrere semantische Akzentfarben erlaubt
- faceless
- keine Cyberpunk-/Neon-Standardästhetik
- `REMOTION_NATIVE_MAXIMUM`
- Sprechertext, Caption/Untertitel, Überschrift und Animation haben unterschiedliche Aufgaben
- High Energy ist nicht High Speed: wichtige Zustände brauchen Reveal → Settle → Readable Hold

## 9. Statusbegriffe niemals vermischen

Diese Zustände sind getrennt:

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

## 10. Git-/Medienregel

Große Binärmedien (`mp3`, `wav`, `mp4`, `png` usw.) bleiben standardmäßig lokal/Artifact-Storage, solange Git LFS nicht eingerichtet ist.

In Git bleiben zwingend Source, Skripte, Provenance, Timings, Reviews, Contracts und Export-Manifeste. Kein Vertrag darf gleichzeitig verlangen, global ignorierte Binärmedien normal in Git zu committen.

## 11. Bekannte externe Einschränkungen

- GitHub Actions ist für dieses private Repository derzeit auf Konto-/Billing-/Runner-Ebene blockiert und deshalb kein aktueller Beweis für Codequalität.
- Ein `package-lock.json` ist noch nicht kanonisch erzeugt. Bis ein echter npm-Installationslauf möglich ist, darf kein erfundener Lockfile-Inhalt committed werden.

Diese beiden Punkte sind technische Betriebsgrenzen, keine Erlaubnis, Struktur-, Test- oder Qualitätsregeln zu umgehen.
