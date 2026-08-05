# Warum KI halluziniert – und wie du es erkennst

Vollständiges Codex-Produktionspaket für ein hybrides KI-Erklärreel aus generierten Editorial-Bildern, UI-Nachbauten und individuellen Remotion-Animationen.

## Produktionsdaten

- Format: 1080 × 1920
- Bildrate: 30 FPS
- Dauer: 36 Sekunden / 1080 Frames
- Sprache: Deutsch
- Szenen: 8
- Composition-ID: `Reel-WhyAIHallucinates`
- Audio: finales Voiceover, SFX standardmäßig aus
- Stil: hochwertige vereinfachte 3D-Editorial-Illustration, fast weißer Hintergrund, dunkle Typografie, violetter Akzent

## Thema

Das Reel erklärt:

1. warum KI überzeugend klingen und trotzdem Fakten erfinden kann
2. dass Sprachmodelle Fortsetzungen berechnen statt Wahrheit automatisch nachzuschlagen
3. warum fehlende Quellen zu plausiblen Lückenfüllern führen
4. welche Inhalte besonders riskant sind
5. drei konkrete Warnzeichen
6. einen einfachen Prüfworkflow

## Zuständigkeiten

### Bereits fest geplant

- finaler Voiceover-Text
- acht Szenen und exakte Framebereiche
- vier Bildmotive
- vier Remotion-/UI-Szenen
- Bildprompts
- Hauptanimationen
- wichtige Wortreaktionen
- Untertitel-Cues
- Übergänge
- Asset-Dateinamen
- Codex-Auftrag
- Review-Gates

### Noch einzufügen

Die folgenden Pflichtassets müssen anhand von `image-prompts.md` erzeugt und exakt unter den Pfaden aus `asset-manifest.json` gespeichert werden:

- `assets/images/scene-01-confident-answer.png`
- `assets/images/scene-03-pattern-gap-machine.png`
- `assets/images/scene-04-risk-documents.png`
- `assets/images/scene-08-verification-desk.png`
- `assets/audio/voiceover.wav`

Codex darf fehlende Assets nicht durch Platzhalter oder fremde Repository-Bilder ersetzen.

## Vorbereitung

Planung prüfen:

```bash
node scripts/prepare-codex-reel.mjs 2026-08-05-warum-ki-halluziniert
```

Nach Einfügen aller Pflichtassets:

```bash
node scripts/prepare-codex-reel.mjs 2026-08-05-warum-ki-halluziniert --ready
```

Danach dient `CODEX-BRIEF.generated.md` als primärer Codex-Kontext.
