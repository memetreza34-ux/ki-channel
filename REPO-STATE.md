# KI-Channel — kanonischer Repository-Stand

**Status:** 2026-09-02

Diese Datei ist der Einstiegspunkt für jeden neuen Chat, Codex-, Antigravity- oder anderen Coding-Agenten.

## 1. Kanonischer Branch

`main` ist der kanonische Produktionsstand nach abgeschlossenen Merges.

Aktuelle Stabilisierung läuft über Draft-PR **#28** direkt gegen `main` auf:

`fix/repo-stabilisierung-2026-08-24`

Solange diese Stabilisierung aktiv ist, wird dieser Branch weitergeführt und nicht still nach `main` gewechselt. PR #28 bleibt Draft, bis lokale Runtime-, Render- und 1x-Review-Beweise real vorliegen.

## 2. Verbindliche Lesereihenfolge

Bei KI-Kanal-Arbeit gilt:

1. `REPO-STATE.md`
2. `AGENTS.md`
3. bei Antigravity zusätzlich `GEMINI.md`, `.agents/agents.md` und `.agents/ANTIGRAVITY-LOCAL-SETUP.md`
4. `ki/AGENTS.md`
5. `ki/gehirn/MASTER.md`
6. bei Reels `ki/gehirn/STORYTELLING_MOTION.md`
7. bei neuen Reels zusätzlich `ki/gehirn/LEVEL_UP_STANDARD.md`
8. danach passende Domäne / `ki/reels/AGENTS.md` / `ki/src/reels/AGENTS.md`
9. das ausdrücklich genannte Reel
10. erst danach konkrete Pläne, Source- oder Plattformdateien

## 3. Kanonische Short-Form-Struktur

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

`scripts/new-ki-reel.mjs` erzeugt die 01–06-Struktur Git-stabil und scaffoldet Story-, Level-Up-, Visual-, SFX- und Review-Verträge.

- Reels vom 2026-09-01 bis 2026-09-02 bleiben Level-Up-v2-kompatibel.
- Neue Reels ab **2026-09-03** verwenden **Level-Up v3**.

Der Strukturcheck überwacht den Generator selbst:

```bash
npm run ki:reel:structure-check
```

## 4. Script- und Laufzeit-Budget

Für Standard-Reels:

- tatsächliche Voice-Locked-Laufzeit: **60–75 Sekunden**
- bevorzugt **150–175 gesprochene Wörter**
- Hard-Limit **190 Wörter** ohne dokumentierte Ausnahme
- 1080×1920 / 30 FPS

Vor Production-Render:

```bash
node ki/scripts/validate-reel-script-budget.mjs <reel-package-dir>
```

Finale Laufzeitautorität ist das Nutzer-Audio nach Pause-Kompression und lokalem Forced Alignment.

## 5. Produktions-Audio — ausschließlich Nutzer

**Harte Regel:** Das Produktions-Voiceover wird ausschließlich vom Nutzer erstellt und manuell abgelegt.

Normaler Pfad:

`01-script-audio/voiceover.mp3`

Agenten dürfen niemals:

- Produktions-Voiceover erzeugen;
- TTS-/Voice-Tools dafür aufrufen;
- Remote-Voiceover herunterladen;
- Preview-Audio als Ersatz verwenden.

Fehlt die Datei:

`PHASE 2 — WARTET AUF NUTZER-AUDIO`

Nach Nutzer-Audio:

```text
voiceover.mp3
→ Pause-Kompression
→ Runtime-WAV
→ lokales Forced Alignment
→ WORD-TIMINGS.json
→ Scene/Caption/Reveal/SFX-Lock
```

Runtime-Ziel:

`public/runtime-audio/<compositionId>.wav`

## 6. Storytelling-Baseline

Neue Reels sind narrative Social-Explainer, keine Folge langer UI-/PowerPoint-Karten.

Basisregeln:

- Story-Arc mindestens `HOOK`, `PROOF`, `CONSEQUENCE`, `PAYOFF`;
- jede zentrale Sprecher-Aussage löst eine sichtbare Reaktion aus;
- jede Hauptszene enthält mehrere sichtbare Zustände;
- Kamera/Zoom/Transition/SFX nur mit Erklär-, Fokus-, Verbindungs- oder Payoff-Funktion;
- ein praktisch unveränderter Hauptzustand über ca. 4 s ist ein Review-Risiko.

Basis-Gate:

```bash
node ki/scripts/validate-storytelling-motion.mjs <reel-package-dir>
```

## 7. Level-Up v3 — Zukunftsstandard ab 03.09.2026

Level-Up v3 ist aus den realen Render-Reviews von Montag bis Mittwoch abgeleitet.

### Cover

- fertiger Cover-Kandidat in der ersten Sekunde;
- Default Frame 15 / 0,5 s;
- mindestens 12 Frames sauber haltbar;
- kompletter Hold innerhalb Frame 0–30;
- caption-frei;
- branded Story: Marke/Produkt im Cover erkennbar.

### Brand Fidelity

Bei branded/current-news Reels:

- mindestens **2 erkennbare Brand-Momente**;
- normalerweise in mindestens **2 unterschiedlichen Szenen**;
- mindestens ein echtes offizielles Logo/Wordmark, echte Produkt-UI oder anderer genuine Brand-/Produkt-Moment;
- wenn nur Typografie sauber möglich ist, Ausnahme dokumentieren;
- nie generisches Funktionsicon als Fake-Logo;
- nie ungenaues frei erfundenes Logo nachbauen.

Priorität:

```text
offizielles Logo/Wordmark
→ echte Produkt-UI
→ offizieller Source-/Docs-Crop
→ klarer typografischer Markenname
```

### Visual Beats / Welten

Für ein normales 60–75-s-v3-Reel:

- mindestens **20 konkrete Visual Beats**;
- sichtbare Entwicklung ungefähr alle **1,5–3,0 s**;
- mindestens **4 unterscheidbare visuelle Welten/Grammatiken**;
- mindestens **2 Mid-Reel-Reframes/World-Breaks**;
- Textwechsel in derselben Card zählt nicht automatisch als neue Welt;
- mindestens eine räumliche/full-frame Hauptszene, wenn das Thema es erlaubt.

### Real Media

Bei branded/current-news v3 normalerweise mindestens **3 purposeful real/official Momente über mindestens 2 Szenen**:

1. Brand-/Produkt-Identität;
2. echter offizieller Proof;
3. echte UI, reales Bild oder reales Video.

Wenn Bewegung selbst der Claim ist, echtes Produktvideo/B-Roll bevorzugen. Ist kein sauber nutzbarer Clip verfügbar, Ausnahme dokumentieren statt Füllmaterial erzwingen.

### Overlap

- pro Moment ein primärer Fokus;
- normalerweise höchstens zwei unterstützende Details;
- Caption darf kein kritisches Visual verdecken;
- Brand, Proof, Datum, Diagramm und Caption werden progressiv statt gleichzeitig gestapelt.

### Voice Sync

Nach Forced Alignment werden wichtige Namen, Marken, Daten, Zahlen und Statuswechsel an echte Wörter/Phrasen gekoppelt. `sentenceId + progress` ist nur Fallback.

Level-Up-Gate:

```bash
node ki/scripts/validate-reel-level-up.mjs <reel-package-dir>
```

## 8. Caption-Geometrie

Für neue 1080×1920-Reels gilt der user-reviewte Shared Default:

- `bottom: 330`
- `horizontalInset: 76`
- `maxWidth: 928`
- Text ca. `40 px`
- maximal 2 Zeilen
- Ziel max. 6 Wörter pro sichtbarer Gruppe
- Glass-/Blur-Overlay
- Cover-Fenster in der ersten Sekunde bleibt caption-frei

Shared Source:

`ki/src/reels/captionSafe.ts`

## 9. Visual-/Asset-Standard

Native Motion bleibt Basis, aber reale/official Medien werden gezielt eingesetzt, wenn sie Brand, Beweis, Produkt oder Bewegung besser vermitteln.

Bevorzugte Quellen:

- offizielle Primärquelle / Produktseite;
- offizielle Logo-/Brand-/UI-Assets, wenn sauber nutzbar;
- Wikimedia Commons für dokumentarisch/historisch relevante Visuals;
- Pexels/Pixabay für generisches B-Roll nur mit Story-Zweck;
- Poly Haven für 3D/HDRI/Texturen;
- lokale Lottie/Rive/Three/Skia-Layer nach Bedarf.

Keine Render-Time-Remote-Medien.

Ausgewählte externe Assets werden lokal aufgelöst, Rechte/Provenance geprüft und per SHA256 gebunden.

Lokale Prep-Pfade:

- Bilder: `scripts/prepare-local-image-asset.mjs`
- Videos: `scripts/prepare-local-video-asset.mjs`
- 3D: Blender-Prep nur optional und lokal

Prep-Output bleibt `PREPARED_NOT_PRODUCTION_APPROVED`, bis das exakte Ergebnis visuell geprüft wurde.

## 10. SFX

- semantische Events statt Soundspam;
- jeder Sound braucht sichtbaren Trigger;
- Voice bleibt Lautstärke-Priorität;
- lokale CC0-Bibliothek bleibt Standard;
- optionaler geprüfter Remotion-CC0-Zusatz nur explizit;
- SFX nach finalem Alignment erneut an echte Sprach-/Caption-Zeit synchronisieren.

## 11. Antigravity Produktionsmodus

### Workspace Agents

1. `ki-production-orchestrator`
2. `ki-fact-researcher`
3. `ki-retention-story-auditor`
4. `ki-motion-researcher`
5. `ki-remotion-story-engineer`
6. `ki-audio-sync-engineer`
7. `ki-visual-qa-auditor`
8. `ki-release-verifier`
9. `ki-dependency-auditor`

Unabhängige read-only Audits dürfen parallel laufen. Auf demselben Working Tree arbeitet gleichzeitig genau **ein** Writer.

### Kern-MCPs

- Chrome DevTools MCP
- Remotion Bits MCP
- GitHub MCP

Weitere MCPs/Skills nur, wenn sie die konkrete Aufgabe verbessern.

### Wichtige Workflows

- `/bootstrap-ki-channel`
- `/sync-chatgpt-handoff`
- `/parallel-audit-ki-reel <path>`
- `/maximize-ki-reel <path>`
- `/visual-qa-ki-reel <path>`
- `/finish-ki-reel <path>`
- `/verify-ki-reel <path>`

## 12. Verbindliches Produktionsmodell

```text
PHASE 1 — Inhalt / Story / Source
Fakten + 60–75-s-Skript
→ Story-Arc
→ v3: >=20 Visual Beats
→ Cover + Brand + Proof + Real Media
→ v3: >=4 Visual Worlds + >=2 Mid-Reframes
→ SFX-/Visual-Plan
→ Remotion Source
→ Storytelling + Level-Up Gates

PHASE 2 — NUR NUTZER
Nutzer erstellt vollständiges Voiceover und legt es lokal ab

PHASE 3 — Sync / Render / Review
Runtime-WAV
→ Pause-Kompression
→ Forced Alignment
→ WORD-TIMINGS
→ Phrase-Lock für Animation/SFX
→ lokale Visual-/SFX-Auflösung
→ Story-Beat-Stills + Browser/Pixel QA
→ Render-Provenance-Lock
→ Roh-Render
→ Social Master ca. -16 LUFS
→ exakter 1x Sicht-/Hörreview
→ unabhängiger Release-Verifier
→ Finalizer / Export
```

## 13. Globale Regressionen

Vor Merge/Release bzw. bei großen Repo-Änderungen:

```bash
npm run antigravity:verify
npm run ki:reel:structure-check
node ki/scripts/validate-storytelling-motion.mjs <reel-package-dir>
node ki/scripts/validate-reel-level-up.mjs <reel-package-dir>
npm run production:contracts
npm run repo:verify
npm run motion:verify
```

`prepare-reel-render.mjs` führt Storytelling-/Level-Up-Gates erneut aus, bevor ein Render-Lock entstehen darf.

## 14. Finaler 1x-Review

Der Review gilt ausschließlich für das exakte gemasterte MP4 und ist per SHA256 gebunden.

Storytelling-Pflicht:

- `STORY_FLOW_1X_REVIEW: PASS`
- `VISUAL_REACTION_1X_REVIEW: PASS`
- `TRANSITIONS_PURPOSE_1X_REVIEW: PASS`
- `STATIC_STATE_OVER_LIMIT_VIOLATIONS: 0`

Level-Up-Basis:

- `COVER_FRAME_READY: PASS`
- `COVER_FRAME_CLEAN: PASS`
- `BRAND_FIDELITY: PASS`
- `REAL_PROOF_MOMENT: PASS`
- `REAL_MEDIA_MIX: PASS`
- `NO_FAKE_BRAND_ICON: PASS`
- `WORD_LOCKED_MAJOR_REVEALS: PASS`
- `SCENE_DENSITY: PASS`
- `NO_VISUAL_OVERLAP: PASS`
- `MOTION_GRAMMAR_DIVERSITY: PASS`
- `NO_CARD_DECK_FEEL: PASS`
- `FULL_VERTICAL_STAGE_USE: PASS`
- `MICRODETAILS_PHONE_READABLE: PASS`
- `SFX_SEMANTIC_DENSITY: PASS`
- `VOICE_PRIORITY_OVER_SFX: PASS`

Zusätzlich v3:

- `BRAND_RECOGNIZABLE_WITHOUT_CAPTION: PASS`
- `PRIMARY_BRAND_REAPPEARS: PASS`
- `REAL_BRAND_ASSET_USED_OR_EXCEPTION: PASS`
- `REAL_MEDIA_NOT_JUST_SOURCE_CARDS: PASS`
- `VISUAL_WORLD_VARIETY: PASS`
- `MID_REEL_REFRAMES: PASS`

## 15. Visuelle Identität

- Short-Form: 1080×1920 / 30 FPS
- Longform: 1920×1080 / 30 FPS
- Light-First
- faceless
- clean/premium
- dokumentarischer Social-Explainer statt Präsentationsdeck
- keine Cyberpunk-/Neon-Standardästhetik
- High Energy ist nicht High Speed: `REVEAL → SETTLE → READABLE HOLD`
- echte Marken-/Produktmomente werden dort eingesetzt, wo sie Glaubwürdigkeit und Wiedererkennung erhöhen

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
- Der neue Remotion-/Antigravity-/Level-Up-v3-Stack wurde über GitHub-Source integriert, aber in dieser ChatGPT-GitHub-Umgebung noch **nicht** per lokalem npm/TypeScript/Remotion-Render vollständig ausgeführt.

Diese Betriebsgrenzen sind keine Erlaubnis, Test- oder Qualitätsregeln zu umgehen. Kein Merge-/Final-Ready-Claim, bis lokale Runtime-/Render-/Review-Beweise real vorliegen.
