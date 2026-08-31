# Level-Up Standard — KI-Reels

## Ziel

Der Baseline-Storytelling-Standard verhindert statische Präsentations-Reels. Dieser Level-Up-Standard verhindert den nächsten Qualitätsfehler: ein technisch sauberes Reel, das trotzdem wie ein generisches Motion-Template wirkt.

Für neue branded/current-news Reels ab 2026-09-01 gilt zusätzlich zum Storytelling-Standard:

1. **Cover-first Hook:** In den ersten 0–30 Frames muss mindestens ein bewusst geplanter, cover-tauglicher Frame existieren. Er braucht eine große klare Headline, ein eindeutiges Hauptmotiv/Produkt/Brand-Signal, starken Kontrast und darf nicht von Captions oder Kleingedrucktem überlagert werden. Der geplante saubere Hold muss vollständig innerhalb der ersten Sekunde liegen und mindestens 12 Frames dauern.
2. **Brand Fidelity:** zentrale Marken/Produkte werden als echtes, provenance-backed Brand-/Produkt-Visual, echter offizieller UI-/Source-Crop oder als klare Typografie gezeigt. Ein generisches Icon darf niemals ein Markenlogo imitieren.
3. **Real Proof:** wenn eine offizielle Quelle visuell sinnvoll ist, mindestens ein echter Proof-Moment (Screenshot/Crop/UI/Dokument) statt nur einer selbstgebauten Source-Card.
4. **Real-Media Mix:** bei aktuellen Marken-/Produktstories sollen normalerweise mindestens zwei reale/official Visual-Momente geplant werden — z. B. Logo/Wordmark, echte UI, offizieller Source-Crop, reales Bild oder kurze reale B-Roll. Wenn das nicht sinnvoll/rechtlich sauber möglich ist, muss die Ausnahme dokumentiert werden. Video/B-Roll wird bevorzugt, wenn echte Bewegung selbst Teil des Claims ist.
5. **Voice Semantic Lock:** große Namen, Zahlen, Daten und Statuswechsel werden nach Forced Alignment an `anchorPhrase`/`anchorWord` gekoppelt. `sentenceId + progress` ist nur der robuste Fallback.
6. **Motion Diversity:** mindestens fünf sinnvolle Motion-Familien pro Standard-Reel; nie mehr als zwei große Beats hintereinander mit derselben Card/Spring/Slide-Grammatik.
7. **Scene Density:** aktive Voiceover-Strecken sollen sich ungefähr alle 1,5–3,0 Sekunden sichtbar weiterentwickeln — neuer Zustand, Reframe, Objekt, Proof, Route oder klarer Fokuswechsel. Ein harter Schnitt ist nicht jedes Mal nötig. Praktisch unveränderte Hauptzustände über 4,0 Sekunden sind ein Review-Risiko.
8. **Spatial Scene:** mindestens eine Hauptszene soll überwiegend räumlich/full-frame funktionieren statt als Sammlung weißer Cards, sofern das Thema dies zulässt.
9. **Full Vertical Stage:** die Fläche von Kapitel/Headline bis zur Caption-Safe-Zone wird bewusst genutzt. Große leere Mittelzonen sind nur mit Story-Grund erlaubt.
10. **Overlap Discipline:** pro Moment genau ein primärer Fokus. Richtwert: höchstens 1 Hauptaussage/Hauptobjekt plus 1–2 unterstützende Details. Caption, Headline, Proof, Logo und Daten dürfen nicht ungeplant denselben visuellen Raum beanspruchen. Kritische Visuals dürfen nicht unter Caption/Overlay verschwinden.
11. **Phone-readable Details:** wichtige Microdetails mindestens ca. 22–26 px; Datum, Status, Route und Quelle progressiv statt als Kleingedrucktes.
12. **Caption Standard:** Shared Default `bottom 330`, horizontal `76`, max width `928`, ca. `40 px`, max zwei Zeilen, Ziel max sechs Wörter pro sichtbarer Gruppe.
13. **Semantic SFX:** mehr Sound nur bei mehr sichtbaren Events. Connector, Impact, Break, Lock, Route, Proof und Payoff sind sinnvolle Trigger; Voice bleibt dominant.
14. **Real Render Review:** die Level-Up-Zustände werden ausschließlich am exakten gemasterten MP4 freigegeben.

## Cover-Frame Standard

Der erste starke Frame ist gleichzeitig Hook und potenzielles Social-Cover.

Pflichtziel:

- Kandidat liegt zwischen Frame 0 und Frame 30 bei 30 fps;
- `candidateFrame + holdFrames <= 30`, damit der geplante saubere Hold vollständig in der ersten Sekunde liegt;
- mindestens 12 Frames stabil genug für einen sauberen Screenshot;
- Headline kurz und groß;
- ein klarer Hauptgegenstand / Brandname / Produktvisual;
- kein Caption-Block im Cover-Kandidaten;
- keine winzigen Quellen-/Statusdetails im Hauptfokus;
- keine Animation darf den Kandidaten zu einem halbfertigen Zwischenframe machen.

Das Cover muss zum Inhalt passen. Kein Clickbait-Cover, das im Reel nicht eingelöst wird.

## Scene-/Overlap-Standard

Mehr Szenen bedeutet **mehr klare Zustände**, nicht mehr Chaos.

- Ziel: sichtbare Entwicklung etwa alle 1,5–3,0 s bei aktiver Sprache;
- ein State darf intern animiert werden, wenn der Fokus wirklich wechselt;
- nicht mehrere neue Texte, Logos, Zahlen und Wege gleichzeitig einblenden;
- lieber sequenziell: Aussage → Visual → Beweis → Detail;
- wenn ein Frame nicht in einer Sekunde verständlich ist, ist er wahrscheinlich zu voll;
- Überlappungen zwischen Caption und wichtigen Visuals gelten als FAIL.

## Real-Media-Standard

Für aktuelle Marken-/Produktstories bevorzugte Reihenfolge:

1. offizielles Logo/Wordmark oder echte Produkt-UI, wenn sauber nutzbar;
2. offizieller Source-/Help-/Docs-Crop als Proof;
3. reale Bilder / reale B-Roll, wenn sie die Aussage visuell tragen;
4. erst danach generisches Stockmaterial;
5. typografischer Markenname als sauberer Fallback.

Echte Bilder/Videos sind keine Pflicht-Deko. Jeder reale Medienmoment braucht einen Zweck: Brand erkennen, Claim beweisen, Ort/Produkt zeigen oder Bewegung demonstrieren.

## Per-Reel Contract

Neue Level-Up-Reels führen zusätzlich:

`06-projektdateien/LEVEL-UP-PLAN.json`

Pflichtbereiche:

- `coverHook`
- `brandMoments`
- `realProofMoments`
- `realMediaMix`
- `majorReveals`
- `motionFamilies`
- `sceneDensity`
- `overlapPolicy`
- `fullFrameSceneIds`
- `captionTarget`
- `microdetails`
- `sfxDesign`

Vor Phase 2 bzw. spätestens vor Source-Freeze:

```bash
node ki/scripts/validate-reel-level-up.mjs <reel-package-dir>
```

Nach Nutzer-Audio müssen die `majorReveals` anhand der echten `WORD-TIMINGS.json` kontrolliert/angepasst werden. Ein Phase-1-Plan ist niemals Timing-Autorität.

## Pflichtfelder im echten 1x-Review

- `COVER_FRAME_READY`
- `COVER_FRAME_CLEAN`
- `BRAND_FIDELITY`
- `REAL_PROOF_MOMENT`
- `REAL_MEDIA_MIX`
- `NO_FAKE_BRAND_ICON`
- `WORD_LOCKED_MAJOR_REVEALS`
- `SCENE_DENSITY`
- `NO_VISUAL_OVERLAP`
- `MOTION_GRAMMAR_DIVERSITY`
- `NO_CARD_DECK_FEEL`
- `FULL_VERTICAL_STAGE_USE`
- `MICRODETAILS_PHONE_READABLE`
- `SFX_SEMANTIC_DENSITY`
- `VOICE_PRIORITY_OVER_SFX`
