# KI-Channel — kanonischer Repository-Stand

**Status:** 2026-09-02

Diese Datei ist der Einstiegspunkt für jeden neuen Chat, Codex-, Antigravity- oder anderen Coding-Agenten.

## 1. Kanonischer Branch

`main` ist der kanonische Produktionsstand nach abgeschlossenen Merges.

Aktuelle Stabilisierung:

- Draft-PR **#28** gegen `main`
- Branch: `fix/repo-stabilisierung-2026-08-24`
- nicht still nach `main` wechseln
- PR nicht ready/mergebar melden, solange lokale Runtime-, Render- und 1x-Review-Beweise fehlen

## 2. Verbindliche Lesereihenfolge

Bei KI-Kanal-Arbeit:

1. `REPO-STATE.md`
2. `AGENTS.md`
3. bei Antigravity zusätzlich `GEMINI.md`, `.agents/agents.md`, `.agents/ANTIGRAVITY-LOCAL-SETUP.md`
4. `ki/AGENTS.md`
5. `ki/gehirn/MASTER.md`
6. bei Reels `ki/gehirn/STORYTELLING_MOTION.md`
7. bei neuen Reels `ki/gehirn/LEVEL_UP_STANDARD.md`
8. `ki/reels/AGENTS.md`
9. das ausdrücklich genannte Reel
10. erst danach konkrete Source-/Plan-/Plattformdateien

## 3. Kanonische Reel-Ordnerstruktur

Seit der aktiven Woche `2026-08-31_bis_2026-09-06` und für **alle neuen Reels** gilt zwingend:

```text
ki/reels/YYYY-MM-DD_bis_YYYY-MM-DD/
├── 01_Montag/
│   ├── 01_Thema-A/
│   └── 02_Thema-B/
├── 02_Dienstag/
│   └── 01_Thema/
├── 03_Mittwoch/
│   └── 01_Thema/
├── 04_Donnerstag/
├── 05_Freitag/
├── 06_Samstag/
└── 07_Sonntag/
```

Im Themenordner:

```text
NN_Thema/
├── README.md
├── 01-script-audio/
├── 02-bilder/
├── 03-caption/
├── 04-pdf/
├── 05-export/
└── 06-projektdateien/
```

Kurzform:

`Woche → Wochentag → Thema/Reel → 01–06`

### Nummerierung

- Wochentage sind fest `01_Montag` bis `07_Sonntag`.
- Reel-Themen werden **innerhalb des jeweiligen Tages** nummeriert: `01_`, `02_`, `03_` ...
- Eine Reel-Nummer auf Wochenebene ist nicht mehr kanonisch.

### Generator

```bash
npm run new-video -- "Reel Titel" YYYY-MM-DD
```

Implementierung:

- `scripts/new-ki-reel.mjs` → bestimmt Wochentag und Topic-Slot
- `scripts/new-ki-reel-core.mjs` → erzeugt vollständigen 01–06-/Story-/Level-Up-Scaffold

Nach jeder Strukturänderung:

```bash
npm run ki:reel:structure-check
```

Der Strukturcheck ist ab Wochenstart `2026-08-31` fail-closed auf die Tagesebene. Ältere abgeschlossene Wochen davor bleiben Legacy-kompatibel, damit historische Spezialtests nicht unnötig brechen. Sobald ein Legacy-Reel aktiv weiterentwickelt wird, soll es auf die aktuelle Struktur migriert werden.

## 4. Aktive Woche

Aktuell:

```text
ki/reels/2026-08-31_bis_2026-09-06/
├── 01_Montag/
│   └── 01_OpenAI-Cursor-SpaceX-Vertrag/
├── 02_Dienstag/
│   └── 01_Google-Flow-Gemini-Omni-1-1-Flash/
└── 03_Mittwoch/
    └── 01_Grok-Bot-X-Integration/
```

Donnerstag und spätere Tage werden beim ersten Reel automatisch angelegt.

## 5. Source-Trennung

Ausführbarer Remotion-Code liegt separat unter:

`ki/src/reels/<slug>/`

Planungsdateien gehören nicht nach `ki/src/reels/`.

Wenn Source JSON/Captions/SFX aus einem Reel-Paket importiert, muss der Import den vollständigen Pfad inklusive Wochentag verwenden.

## 6. Script- und Laufzeit-Budget

Für Standard-Reels:

- tatsächliche Voice-Locked-Laufzeit: **60–75 Sekunden**
- bevorzugt **150–175 gesprochene Wörter**
- Hard-Limit **190 Wörter** ohne dokumentierte Ausnahme
- Format **1080×1920 / 30 FPS**

Vor Production-Render:

```bash
node ki/scripts/validate-reel-script-budget.mjs <reel-package-dir>
```

Finale Laufzeitautorität ist das Nutzer-Audio nach Pause-Kompression und lokalem Forced Alignment.

## 7. Produktions-Audio — ausschließlich Nutzer

**Harte Regel:** Das Produktions-Voiceover wird ausschließlich vom Nutzer erstellt und manuell abgelegt.

Normaler Pfad innerhalb des Themenordners:

`01-script-audio/voiceover.mp3`

Agenten dürfen niemals:

- Produktions-Voiceover erzeugen
- TTS-/Voice-Tools dafür aufrufen
- Remote-Voiceover herunterladen
- Preview-Audio als Produktionsersatz verwenden

Fehlt das Audio:

`PHASE 2 — WARTET AUF NUTZER-AUDIO`

Danach:

```text
voiceover.mp3
→ Pause-Kompression
→ Runtime-WAV
→ lokales Forced Alignment
→ WORD-TIMINGS.json
→ Scene-/Caption-/Reveal-/SFX-Lock
```

Runtime-Ziel:

`public/runtime-audio/<compositionId>.wav`

## 8. Storytelling-Baseline

Neue Reels sind narrative Social-Explainer, keine Folge langer Präsentationskarten.

Basis:

- Story-Arc mindestens `HOOK`, `PROOF`, `CONSEQUENCE`, `PAYOFF`
- jede zentrale Sprecher-Aussage löst eine sichtbare Reaktion aus
- jede Hauptszene enthält mehrere erkennbare Zustände
- praktisch unveränderter Hauptzustand über ca. 4 s ist Review-Risiko
- Kamera/Zoom/Transition/SFX nur mit Erklär-, Fokus-, Verbindungs- oder Payoff-Funktion

Gate:

```bash
node ki/scripts/validate-storytelling-motion.mjs <reel-package-dir>
```

## 9. Level-Up v3 — Zukunftsstandard ab 03.09.2026

Reels vom 01./02.09. bleiben Level-Up-v2-kompatibel. Neue Reels ab `2026-09-03` benötigen v3.

### Cover

- fertiger Cover-Kandidat innerhalb der ersten Sekunde
- Default Frame 15 / 0,5 s
- mindestens 12 Frames sauber haltbar
- kompletter Hold innerhalb Frame 0–30
- caption-frei
- bei Markenstorys Marke/Produkt im Cover erkennbar

### Brand Fidelity

Bei branded/current-news:

- mindestens 2 erkennbare Brand-Momente
- normalerweise in mindestens 2 unterschiedlichen Szenen
- offizielles Logo/Wordmark oder echte Produkt-UI bevorzugen
- offizieller Source-/Docs-Crop als Proof
- klare Typografie als sauberer Fallback
- kein generisches Funktionsicon als Fake-Logo
- kein ungenau frei erfundenes Logo nachbauen

### Visual Beats / Welten

Normales 60–75-s-v3-Reel:

- mindestens **20 konkrete Visual Beats**
- sichtbare Entwicklung ungefähr alle **1,5–3,0 s**
- mindestens **4 unterscheidbare Visual Worlds**
- mindestens **2 Mid-Reel-Reframes/World-Breaks**
- mindestens eine räumliche/full-frame Hauptszene, wenn sinnvoll
- Textwechsel in derselben Karte zählt nicht automatisch als neue Welt

### Real Media

Branded/current-news v3 plant normalerweise mindestens **3 purposeful real/official Momente** über mindestens 2 Szenen:

1. Brand-/Produkt-Moment
2. echter Proof-/Source-Moment
3. echte Produkt-UI, reales Bild oder reales Video

Video wird bevorzugt, wenn Bewegung selbst Teil des Claims ist. Wenn sauberes Video nicht möglich ist, Ausnahme dokumentieren.

### Timing

Nach Nutzer-Audio werden große Namen, Zahlen, Daten und Statuswechsel an echte Wörter/Phrasen aus `WORD-TIMINGS.json` gekoppelt. `sentenceId + progress` ist nur Fallback.

Gate:

```bash
node ki/scripts/validate-reel-level-up.mjs <reel-package-dir>
```

## 10. Caption-Standard

Einzige technische Wahrheit:

- `ki/src/reels/captionSafe.ts`
- `ki/gehirn/CAPTION_SAFE_POSITION.md`

Aktueller Default:

- bottom **330 px**
- horizontal inset **76 px**
- max width **928 px**
- ca. **40 px** Schrift
- max. 2 Zeilen
- Ziel max. 6 Wörter je sichtbarer Gruppe
- Cover-Fenster caption-frei

## 11. Visual-/Asset-Stack

Native Remotion bleibt Produktionsbasis. Reale Medien werden gezielt eingesetzt, wenn sie Brand, Proof, Produkt oder Bewegung besser vermitteln.

Verfügbare Wege:

- Official Source / Product UI
- Wikimedia Commons Proof Scout
- Pexels Discovery
- Pixabay Discovery
- Poly Haven 3D/HDRI/Texturen
- Blender lokaler 3D-Prep
- Lottie Creator optional
- Rive nur lokale vorhandene `.riv`
- Figma Remote MCP optional/usage-budgeted
- Sharp lokaler Bild-Prep
- FFmpeg lokaler Video-Prep
- Three / Skia / Shapes / Effects / Transitions

Keine Render-Time-Remote-Medien. Ausgewählte externe Medien werden lokal, provenance-backed und per SHA256 gebunden.

## 12. SFX

- lokale kuratierte CC0-Bibliothek bleibt Standard
- zusätzlicher geprüfter `@remotion/sfx`-CC0-Pfad nur explizit
- jeder Sound braucht sichtbaren semantischen Trigger
- Voice bleibt dominant
- SFX nach finalem Voice-/Scene-Lock erneut synchronisieren

## 13. Antigravity

Kern-Agenten:

1. `ki-production-orchestrator`
2. `ki-fact-researcher`
3. `ki-retention-story-auditor`
4. `ki-motion-researcher`
5. `ki-remotion-story-engineer`
6. `ki-audio-sync-engineer`
7. `ki-visual-qa-auditor`
8. `ki-release-verifier`
9. `ki-dependency-auditor`

Genau ein write-capable Agent pro Working Tree. Read-only Audits dürfen parallel laufen.

Wichtige Workflows:

- `/bootstrap-ki-channel`
- `/sync-chatgpt-handoff`
- `/parallel-audit-ki-reel <path>`
- `/maximize-ki-reel <path>`
- `/visual-qa-ki-reel <path>`
- `/finish-ki-reel <path>`
- `/verify-ki-reel <path>`

Fokus-MCPs:

- Chrome DevTools
- Remotion Bits
- GitHub
- optional Figma Remote
- optional Lottie Creator

## 14. Drei Produktionsphasen

```text
PHASE 1 — ChatGPT / Coding-Agent
Fakten + Skript + Story + Cover + Brand/Proof/Media + Motion + Source
→ Struktur-/Story-/Level-Up-Gates

PHASE 2 — NUR NUTZER
vollständiges Produktions-Voiceover lokal ablegen

PHASE 3 — Codex / Antigravity
Pause-Kompression + Forced Alignment
→ WORD-TIMINGS
→ Captions / Scenes / Reveals / SFX locken
→ lokale Visuals/SFX auflösen
→ Story-Stills / Browser-QA
→ Render-Provenance
→ Roh-Render
→ Social Master ca. -16 LUFS
→ exakter 1x Sicht-/Hörreview
→ unabhängiger Release-Verifier
→ Finalizer / Export-Paket
```

## 15. Pflichtchecks

Vor Merge/Release mindestens:

```bash
npm run antigravity:verify
npm run ki:reel:structure-check
node ki/scripts/validate-storytelling-motion.mjs <reel-package-dir>
node ki/scripts/validate-reel-level-up.mjs <reel-package-dir>
npm run production:contracts
npm run repo:verify
npm run motion:verify
```

Die Befehle gelten nur als bestanden, wenn sie real lokal ausgeführt wurden.

## 16. Finaler 1x-Review

Der Review gilt ausschließlich für das exakte gemasterte MP4 und ist per SHA256 gebunden.

Bei v3 zusätzlich unter anderem:

- `BRAND_RECOGNIZABLE_WITHOUT_CAPTION: PASS`
- `PRIMARY_BRAND_REAPPEARS: PASS`
- `REAL_BRAND_ASSET_USED_OR_EXCEPTION: PASS`
- `REAL_MEDIA_NOT_JUST_SOURCE_CARDS: PASS`
- `VISUAL_WORLD_VARIETY: PASS`
- `MID_REEL_REFRAMES: PASS`
- `NO_VISUAL_OVERLAP: PASS`
- `VOICE_PRIORITY_OVER_SFX: PASS`

Source-Code allein kann keinen Visual-PASS beweisen.

## 17. Statusbegriffe niemals vermischen

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

## 18. Git-/Medienregel

Große Binärmedien (`mp3`, `wav`, `mp4`, `png` usw.) bleiben standardmäßig lokal/Artifact-Storage, solange Git LFS nicht eingerichtet ist.

In Git bleiben Source, Skripte, Story-Beats, Provenance, Timings, Reviews, Contracts und Export-Manifeste.

## 19. Bekannte externe Einschränkungen

- GitHub Actions ist für dieses private Repository derzeit auf Konto-/Billing-/Runner-Ebene kein Runtime-Beweis.
- `main` hat derzeit keine verlässliche Branch-Protection als Qualitätsbeweis.
- ein kanonischer `package-lock.json` ist noch nicht vollständig etabliert
- viele neue Repo-/Antigravity-/Remotion-Schichten wurden über GitHub-Source integriert, aber nicht alle in dieser ChatGPT-GitHub-Umgebung lokal ausgeführt

Diese Einschränkungen erlauben niemals das Umgehen von Tests, Render- oder Review-Gates.
