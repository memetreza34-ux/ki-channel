# KI-Channel — kanonischer Repository-Stand

**Status:** 2026-09-04

Diese Datei ist der Einstiegspunkt für jeden neuen Chat, Codex-, Antigravity- oder anderen Coding-Agenten.

## 1. Kanonischer Branch

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
6. `ki/gehirn/STORYTELLING_MOTION.md`
7. `ki/gehirn/LEVEL_UP_STANDARD.md`
8. `ki/gehirn/VISUAL_ASSETS.md`
9. `ki/reels/AGENTS.md`
10. Ziel-Reel + seine Projektdateien

## 3. Kanonische Reel-Ordnerstruktur

Seit `2026-08-31_bis_2026-09-06` und für **alle neuen Reels**:

```text
ki/reels/YYYY-MM-DD_bis_YYYY-MM-DD/
├── 01_Montag/
├── 02_Dienstag/
├── 03_Mittwoch/
├── 04_Donnerstag/
├── 05_Freitag/
├── 06_Samstag/
└── 07_Sonntag/
```

Pro Tag:

```text
NN_Wochentag/
└── 01_Thema/
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

Generator:

```bash
npm run new-video -- "Reel Titel" YYYY-MM-DD
```

`scripts/new-ki-reel.mjs` routet Woche/Wochentag/Topic-Slot. `scripts/new-ki-reel-core.mjs` erzeugt den Basisscaffold. Für Reels ab **2026-09-05** wendet der Wrapper anschließend automatisch `scripts/apply-level-up-v4.mjs` an.

## 4. Aktive Woche

```text
ki/reels/2026-08-31_bis_2026-09-06/
├── 01_Montag/
│   └── 01_OpenAI-Cursor-SpaceX-Vertrag/
├── 02_Dienstag/
│   └── 01_Google-Flow-Gemini-Omni-1-1-Flash/
├── 03_Mittwoch/
│   └── 01_Grok-Bot-X-Integration/
├── 04_Donnerstag/
│   └── 01_Claude-Fable-5-1-Mythos-5-1/
└── 05_Freitag/
    └── 01_Google-WeatherNext-3/
```

Samstag und Sonntag werden beim ersten Reel automatisch angelegt.

## 5. Source-Trennung

Ausführbarer Remotion-Code liegt separat unter:

`ki/src/reels/<slug>/`

Planungs-/Produktionsdateien bleiben im jeweiligen Reel-Paket. JSON-/Caption-/SFX-Imports müssen den vollständigen Woche→Wochentag→Thema-Pfad verwenden.

## 6. Script / Format / Audio

Standard-Reel:

- 1080×1920
- 30 FPS
- tatsächliche Voice-Locked-Laufzeit 60–75 s
- bevorzugt 150–175 Wörter
- Hard-Limit 190 Wörter ohne Ausnahme

Produktions-Voiceover kommt **ausschließlich vom Nutzer** und liegt normalerweise unter:

`01-script-audio/voiceover.mp3`

Agenten erzeugen, ersetzen oder laden kein Produktions-Voiceover.

Für Level-Up v3/v4 gilt aktuell:

- Pitch-erhaltendes Sprachtempo **1,10×**
- lange KI-Pausen vor Forced Alignment komprimieren
- danach lokale Runtime-WAV
- erst dann Forced Alignment
- `WORD-TIMINGS.json` ist Timing-Autorität für Captions, Szenen, Reveals und SFX

## 7. Storytelling-Baseline

Neue Reels sind narrative Social-Explainer, keine Präsentationskartenfolge.

- Story-Arc mindestens Hook → Proof → Consequence → Payoff
- jede zentrale Sprecher-Aussage löst sichtbare Reaktion aus
- mehrere Zustände pro Hauptszene
- sichtbare Entwicklung ca. alle 1,5–3,0 s
- praktisch unverändert >4 s ist Review-Risiko
- Kamera/Zoom/Transition/SFX nur mit Funktion

Gate:

```bash
node ki/scripts/validate-storytelling-motion.mjs <reel-package-dir>
```

## 8. Level-Up-Versionen

- 01.–02.09.2026: v2-kompatibel
- ab 03.09.2026: **Level-Up v3**
- ab **05.09.2026: Level-Up v4**

### v3 bleibt Grundlage

- Cover innerhalb erster Sekunde
- Brand im Cover + später erneut
- keine Fake-Logos
- normalerweise mindestens 3 purposeful real/official Medienmomente
- mindestens 20 Visual Beats
- mindestens 4 Visual Worlds
- mindestens 2 Mid-Reel-Reframes
- Word/Phrase-Lock nach Forced Alignment
- Overlap-/Phone-Readability-/SFX-Gates

### v4 ergänzt Brand-/Motion-Fidelity

Jedes neue Reel ab 05.09. erhält zusätzlich:

`06-projektdateien/BRAND-MOTION-PLAN.json`

Pflichtbereiche:

- `brandIdentity`
- `brandPalette`
- `functionalIconPolicy`
- `animationFreedom`
- `capabilityEvolution`
- `requiredFinalReviewGates`

Gate:

```bash
node ki/scripts/validate-reel-level-up.mjs <reel-package-dir>
node ki/scripts/validate-reel-brand-motion-v4.mjs <reel-package-dir>
```

Der Production-Render führt den v4-Gate erneut aus und bindet `BRAND-MOTION-PLAN.json` per SHA256 in den Render-Lock.

## 9. Echte Logos / Wordmarks / Produkt-UI

Das bisherige Problem „Logo im Plan, aber nicht im Render“ wird über `LOCAL_OFFICIAL_MEDIA` geschlossen.

Wenn ein exaktes offizielles Asset bereits lokal vorliegt:

```text
02-bilder/brand-assets/...png
```

wird es in `visual-assets.json` als `LOCAL_OFFICIAL_MEDIA` registriert.

Pflicht:

- lokales `sourceFile` unter `02-bilder/`
- offizielle HTTPS-`sourceUrl`
- `sourceKind`
- `assetRole`
- `rightsStatus: OFFICIAL_SOURCE_REFERENCE`
- aussagekräftige `usageReviewNote`

Der Resolver lädt **nichts** automatisch herunter. Er prüft die lokale Datei, blockiert Symlinks/Path-Escape, akzeptiert nur JPEG/PNG/WebP, kopiert nach `public/reel-assets/<compositionId>/` und bindet SHA256.

`manualRightsReviewRequired: true` bleibt erhalten. Herkunftsnachweis ist keine pauschale Rechtsfreigabe.

Workflow:

`/use-local-official-media <reel-package-dir>`

## 10. Brand-Farben v4

Vor Source-Freeze enthält `BRAND-MOTION-PLAN.json`:

- offizielle/reference Farbquelle
- Primary/Secondary/Neutral-Palette
- Scene-Farbnotizen
- erlaubte semantische Ausnahmefarben

Ziel: **markentreue Kohärenz**, nicht jede Fläche zwanghaft in Brand-Farben färben.

Final Review muss u. a. `BRAND_COLOR_COHERENCE` und `NO_ACCIDENTAL_COLOR_DRIFT` prüfen.

## 11. Funktionale Icons v4

Funktionsicons sind ausdrücklich erwünscht, z. B. für:

- API / Code
- Cloud / Database
- Security
- Map / Location
- Weather / Satellite / Rain / Snow
- Timeline
- Input / Output / Cache
- Route / Search
- Travel / Agriculture / Energy
- Warning / Success

Aber:

`Funktionsicon ≠ Markenlogo`

Brand und Funktion bleiben visuell getrennt.

## 12. Animation v4 — keine künstliche Technikgrenze

Policy:

`OPEN_ENDED_STORY_DRIVEN`

Es gibt keine feste Animations-Whitelist. Die Shared Library ist ein Werkzeugkasten, **keine Grenze**.

Jede neue Technik ist erlaubt, wenn sie Story, Lesbarkeit, Determinismus, Performance und QA besteht. Dazu gehören auch neue/prozedurale Techniken, die bisher nicht im Repo existieren.

Beispiele: 2D, 3D, SVG-/Path-Morphs, Skia, Lottie, Rive, Partikel, Masks/Wipes, Maps, Routing, UI-Simulation, Compositing, physische Metaphern, Shader-artige Effekte und künftig neu integrierte kompatible Techniken.

Offene Motion bedeutet nicht Effektspam: jede Animation muss erklären, fokussieren, vergleichen, beweisen, überleiten oder Payoff erzeugen.

## 13. Capability-Evolution

Neuer Read-only Agent:

`ki-brand-motion-director`

Er prüft:

- offizielle Brand-/UI-Asset-Möglichkeiten
- Brand-Palette
- funktionale Icons
- Motion-Richtung / Wiederholungen
- neue sinnvolle Skills/MCPs/Packages/Tools

Neue Capability nur bei **materiellem Qualitätsgewinn oder echtem wiederkehrendem Engpass**. Keine redundante Tool-Sammlung.

Neuer Skill:

`brand-motion-fidelity`

## 14. Visual-/Asset-Stack

Native Remotion bleibt Produktionsbasis. Verfügbar:

- `LOCAL_OFFICIAL_MEDIA`
- Official Source Cards
- Wikimedia Commons
- Pexels / Pixabay Discovery
- Poly Haven
- Blender
- Lottie
- lokale Rive-Assets
- Figma Remote optional
- Sharp Bild-Prep
- FFmpeg Video-Prep
- Three / Skia / Shapes / Effects / Transitions

Keine Render-Time-Remote-Medien.

## 15. Caption-Standard

- bottom 330 px
- horizontal inset 76 px
- max width 928 px
- ca. 40 px
- max. 2 Zeilen
- Ziel max. 6 Wörter pro sichtbarer Gruppe
- Cover caption-frei

## 16. SFX

- lokale kuratierte CC0-Bibliothek als Standard
- SFX nur an sichtbaren semantischen Aktionen
- Voice bleibt dominant
- nach finalem Voice-Lock erneut synchronisieren

## 17. Antigravity-Team

Kern-Agenten:

1. `ki-production-orchestrator`
2. `ki-fact-researcher`
3. `ki-retention-story-auditor`
4. `ki-motion-researcher`
5. `ki-brand-motion-director`
6. `ki-remotion-story-engineer`
7. `ki-audio-sync-engineer`
8. `ki-visual-qa-auditor`
9. `ki-release-verifier`
10. `ki-dependency-auditor`

Genau ein write-capable Agent pro Working Tree. Read-only Audits dürfen parallel laufen.

## 18. Produktionsphasen

```text
PHASE 1
Fakten + Skript + Story + Brand/Palette/Proof/Media + freie Motion-Planung + Source

PHASE 2
nur Nutzer-Voiceover

PHASE 3
Pause-Kompression + 1,10× + Forced Alignment
→ Captions/Scenes/Reveals/SFX locken
→ lokale Visuals materialisieren
→ Story-Stills / Browser-QA
→ Render-Lock
→ Roh-Render
→ Social Master
→ exakter 1x Review
→ Release Verifier
```

## 19. Pflichtchecks

```bash
npm run antigravity:verify
npm run ki:reel:structure-check
node ki/scripts/validate-storytelling-motion.mjs <reel-package-dir>
node ki/scripts/validate-reel-level-up.mjs <reel-package-dir>
node ki/scripts/validate-reel-brand-motion-v4.mjs <reel-package-dir>   # v4
node ki/scripts/validate-reel-visual-assets.mjs <reel-package-dir>
npm run production:contracts
npm run repo:verify
npm run motion:verify
```

Zusätzlicher statischer Integrationscheck:

```bash
node scripts/check-brand-motion-v4-integration.mjs
```

Die Befehle gelten nur als bestanden, wenn sie real lokal ausgeführt wurden.

## 20. Finaler 1x-Review v4

Zusätzlich zu bisherigen Gates:

- `BRAND_ASSET_VISIBLE_OR_JUSTIFIED`
- `BRAND_COLOR_COHERENCE`
- `FUNCTIONAL_ICONS_ARE_NOT_FAKE_LOGOS`
- `MOTION_NOT_TEMPLATE_LOCKED`
- `ANIMATION_TECHNIQUE_FITS_STORY`
- `NO_ACCIDENTAL_COLOR_DRIFT`
- `REAL_MEDIA_MATERIALIZED_OR_JUSTIFIED`

Source-Code allein kann keinen Visual-PASS beweisen.

## 21. Statusbegriffe niemals vermischen

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

## 22. Externe Einschränkungen

- GitHub Actions ist für dieses private Repository derzeit kein verlässlicher Runtime-Beweis.
- `main` hat derzeit keine verlässliche Branch-Protection als Qualitätsbeweis.
- viele neue Repo-/Antigravity-/Remotion-Schichten wurden über GitHub-Source integriert, aber nicht alle lokal ausgeführt.

Diese Einschränkungen erlauben niemals das Umgehen von Tests, Render- oder Review-Gates.
