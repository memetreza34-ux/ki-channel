# Level-Up Standard — KI-Reels

## Ziel

Der Baseline-Storytelling-Standard verhindert statische Präsentations-Reels. Dieser Level-Up-Standard verhindert den nächsten Qualitätsfehler: ein technisch sauberes Reel, das trotzdem wie ein generisches Motion-Template wirkt.

Für neue branded/current-news Reels ab 2026-09-01 gilt zusätzlich zum Storytelling-Standard:

1. **Brand Fidelity:** zentrale Marken/Produkte werden als echtes, provenance-backed Brand-/Produkt-Visual, echter offizieller UI-/Source-Crop oder als klare Typografie gezeigt. Ein generisches Icon darf niemals ein Markenlogo imitieren.
2. **Real Proof:** wenn eine offizielle Quelle visuell sinnvoll ist, mindestens ein echter Proof-Moment (Screenshot/Crop/UI/Dokument) statt nur einer selbstgebauten Source-Card.
3. **Voice Semantic Lock:** große Namen, Zahlen, Daten und Statuswechsel werden nach Forced Alignment an `anchorPhrase`/`anchorWord` gekoppelt. `sentenceId + progress` ist nur der robuste Fallback.
4. **Motion Diversity:** mindestens fünf sinnvolle Motion-Familien pro Standard-Reel; nie mehr als zwei große Beats hintereinander mit derselben Card/Spring/Slide-Grammatik.
5. **Spatial Scene:** mindestens eine Hauptszene soll überwiegend räumlich/full-frame funktionieren statt als Sammlung weißer Cards, sofern das Thema dies zulässt.
6. **Full Vertical Stage:** die Fläche von Kapitel/Headline bis zur Caption-Safe-Zone wird bewusst genutzt. Große leere Mittelzonen sind nur mit Story-Grund erlaubt.
7. **Phone-readable Details:** wichtige Microdetails mindestens ca. 22–26 px; Datum, Status, Route und Quelle progressiv statt als Kleingedrucktes.
8. **Caption Standard:** Shared Default `bottom 330`, horizontal `76`, max width `928`, ca. `40 px`, max zwei Zeilen, Ziel max sechs Wörter pro sichtbarer Gruppe.
9. **Semantic SFX:** mehr Sound nur bei mehr sichtbaren Events. Connector, Impact, Break, Lock, Route, Proof und Payoff sind sinnvolle Trigger; Voice bleibt dominant.
10. **Real Render Review:** `BRAND_FIDELITY`, `REAL_PROOF_MOMENT`, `WORD_LOCKED_MAJOR_REVEALS`, `MOTION_GRAMMAR_DIVERSITY`, `NO_CARD_DECK_FEEL`, `FULL_VERTICAL_STAGE_USE`, `MICRODETAILS_PHONE_READABLE`, `SFX_SEMANTIC_DENSITY` werden ausschließlich am exakten gemasterten MP4 freigegeben.

## Per-Reel Contract

Neue Level-Up-Reels führen zusätzlich:

`06-projektdateien/LEVEL-UP-PLAN.json`

Pflichtbereiche:

- `brandMoments`
- `realProofMoments`
- `majorReveals`
- `motionFamilies`
- `fullFrameSceneIds`
- `captionTarget`
- `microdetails`
- `sfxDesign`

Vor Phase 2 bzw. spätestens vor Source-Freeze:

```bash
node ki/scripts/validate-reel-level-up.mjs <reel-package-dir>
```

Nach Nutzer-Audio müssen die `majorReveals` anhand der echten `WORD-TIMINGS.json` kontrolliert/angepasst werden. Ein Phase-1-Plan ist niemals Timing-Autorität.
