# Level-Up Standard — KI-Reels

## Ziel

Der Baseline-Storytelling-Standard verhindert statische Präsentations-Reels. Der Level-Up-Standard verhindert den nächsten Qualitätsfehler: ein technisch sauberes Reel, das trotzdem wie ein generisches Motion-Template wirkt oder die genannte Marke visuell kaum erkennen lässt.

- Reels vom 2026-09-01 bis 2026-09-02 bleiben mit **Level-Up v2** kompatibel.
- Für neue Reels ab **2026-09-03** gilt **Level-Up v3**.
- v3 übernimmt alle v2-Regeln und verschärft Brand Recognition, Real Media und visuelle Welten.

## Level-Up v3 — Pflichtregeln

1. **Cover-first Hook:** In den ersten 0–30 Frames muss ein fertiger, cover-tauglicher Frame existieren. Der geplante saubere Hold bleibt vollständig innerhalb der ersten Sekunde und dauert mindestens 12 Frames.
2. **Brand sofort erkennbar:** Bei einer Marken-/Produktstory muss die primäre Marke bereits im Cover oder unmittelbar danach eindeutig erkennbar sein — über offizielles Logo/Wordmark, echte Produkt-UI oder einen klaren typografischen Brand-Lockup.
3. **Brand-Reappearance:** Eine zentrale Marke darf nicht nur einmal im Hook auftauchen. Bei branded/current-news Reels sind normalerweise mindestens zwei erkennbare Brand-Momente in mindestens zwei unterschiedlichen Szenen geplant.
4. **Keine erfundenen Logos:** Offizielles Logo/Wordmark > echte Produkt-UI > offizieller Source-Crop > klarer typografischer Markenname. Ein generisches Icon darf niemals als Markenlogo erscheinen. Ein offizielles Logo wird nicht frei „nachgebaut“, wenn dadurch eine ungenaue Fake-Version entsteht.
5. **Real Proof:** Mindestens ein echter offizieller Proof-Moment, wenn die Story auf einer aktuellen Produkt-/Firmenbehauptung basiert. Eine selbstgebaute Source-Card allein zählt nicht als echter Proof-Crop.
6. **Real-Media Mix v3:** Bei branded/current-news Reels normalerweise mindestens drei purposeful real/official Momente über mindestens zwei Szenen: mindestens ein Brand-/Produkt-Moment, mindestens ein offizieller Proof und mindestens ein immersiver Produkt-/Real-Media-Moment wie echte UI, reales Bild oder kurzes reales Video. Ausnahmen müssen dokumentiert werden.
7. **Video, wenn Bewegung der Claim ist:** Wenn die Aussage eine echte Produktbewegung, Bedienung oder Video-Funktion beschreibt, wird reales Produktvideo/B-Roll bevorzugt. Ist kein sauber nutzbarer Clip verfügbar, wird die Ausnahme im Plan dokumentiert statt beliebiges Stockmaterial zu erzwingen.
8. **Voice Semantic Lock:** Namen, Zahlen, Daten, Statuswechsel und Brand-Reveals werden nach Forced Alignment an echte Wörter/Phrasen gekoppelt. `sentenceId + progress` bleibt Fallback.
9. **Mindestens 20 Visual Beats:** Für ein normales 60–75-s-Reel werden in v3 mindestens 20 konkrete Story-/Visual-Beats geplant. Mehr Beats bedeuten neue verständliche Zustände, nicht Effektspam.
10. **Visual-World Variety:** Mindestens vier unterscheidbare visuelle Welten/Grammatiken pro Reel, z. B. Brand-Hook, echte Product-UI, räumliche Diagrammwelt, Real-Media/Proof und Payoff. Nur dieselbe weiße Card mit anderem Text zählt nicht als neue Welt.
11. **Mid-Reel Reframes:** Mindestens zwei bewusst geplante Mid-Reel-Reframes/World-Breaks verhindern, dass der Mittelteil trotz vieler kleiner Animationen gleich aussieht.
12. **Scene Density:** Aktive Voiceover-Strecken entwickeln sich ungefähr alle 1,5–3,0 s sichtbar weiter. Praktisch unveränderte Hauptzustände über 4,0 s sind ein Review-Risiko.
13. **Motion Diversity:** Mindestens fünf sinnvolle Motion-Familien; nie mehr als zwei große Beats hintereinander mit derselben Card/Spring/Slide-Grammatik.
14. **Spatial Scene:** Mindestens eine Hauptszene soll überwiegend räumlich/full-frame funktionieren, sofern das Thema es zulässt.
15. **Full Vertical Stage:** Die Fläche von Kapitel/Headline bis zur Caption-Safe-Zone wird bewusst genutzt. Große leere Mittelzonen brauchen Story-Grund.
16. **Overlap Discipline:** Pro Moment ein primärer Fokus und normalerweise höchstens zwei unterstützende Details. Caption, Logo, Proof, Datum und Diagramm dürfen nicht ungeplant um denselben Raum kämpfen.
17. **Phone-readable Details:** Wichtige Microdetails mindestens ca. 22–26 px und progressiv einblenden.
18. **Caption Standard:** Shared Default `bottom 330`, horizontal `76`, max width `928`, ca. `40 px`, max zwei Zeilen, Ziel max sechs Wörter pro sichtbarer Gruppe.
19. **Semantic SFX:** Sound folgt sichtbaren Ereignissen. Mehr SFX nur bei mehr echten semantischen Aktionen; Voice bleibt dominant.
20. **Real Render Review:** Keine Level-Up-Freigabe aus Source-Code. Ausschließlich der exakte gemasterte MP4 kann PASS liefern.

## Brand-Fidelity-Standard

Bei einer zentralen Marke soll ein Zuschauer das Produkt auch dann erkennen können, wenn er die Untertitel kurz ignoriert.

Bevorzugte Reihenfolge:

1. provenance-backed offizielles Logo/Wordmark, wenn sauber nutzbar;
2. echte offizielle Produkt-UI;
3. offizieller Source-/Docs-Crop mit klarer Markenidentität;
4. klarer typografischer Markenname als Fallback.

Nicht erlaubt:

- irgendein Lucide-/Funktionsicon als scheinbares Markenlogo;
- frei erfundene oder ungenaue Rekonstruktion eines Logos;
- Brandname nur im Sprechertext, während das Bild generisch bleibt.

Für branded/current-news v3:

- mindestens zwei erkennbare Brand-Momente;
- normalerweise in mindestens zwei unterschiedlichen Szenen;
- mindestens einer davon soll ein offizielles Logo/Wordmark, echte UI oder anderer echter Brand-/Produkt-Asset-Moment sein;
- wenn nur Typografie sauber möglich ist, `assetExceptionReason` dokumentieren.

## Cover-Frame Standard

Pflichtziel:

- Kandidat zwischen Frame 0 und Frame 30 bei 30 fps;
- `candidateFrame + holdFrames <= 30`;
- mindestens 12 Frames sauber haltbar;
- kurze große Headline;
- ein klarer Hauptgegenstand / Brandname / Produktvisual;
- branded Story: `brandRecognizable: true`;
- kein Caption-Block im Cover-Kandidaten;
- keine winzigen Details als Hauptinformation;
- keine halbfertige Entrance-Animation im Screenshot-Zeitpunkt.

## Scene-/Visual-World-Standard

Mehr Szenen bedeutet mehr klare Zustände, nicht mehr Chaos.

- Ziel: sichtbare Entwicklung etwa alle 1,5–3,0 s;
- v3: mindestens 20 konkrete Visual Beats bei 60–75 s;
- v3: mindestens vier unterscheidbare visuelle Welten;
- v3: mindestens zwei Mid-Reel-Reframes/World-Breaks;
- ein State darf intern animiert werden, wenn sich Fokus und Bedeutung tatsächlich ändern;
- lieber sequenziell: Aussage → Visual → Beweis → Detail;
- wenn ein Frame nicht in ungefähr einer Sekunde verstanden wird, ist er wahrscheinlich zu voll;
- Caption/Brand/Proof-Überlappung mit kritischem Inhalt gilt als FAIL.

## Real-Media-Standard

Für aktuelle Marken-/Produktstories bevorzugte Reihenfolge:

1. offizielles Logo/Wordmark oder echte Produkt-UI;
2. offizieller Source-/Help-/Docs-Crop als Proof;
3. reales Produktbild / reales Bild / kurze reale B-Roll;
4. generisches Stockmaterial nur, wenn es tatsächlich Story-Wert hat;
5. typografischer Markenname als sicherer Brand-Fallback.

v3-Ziel bei branded/current-news:

- mindestens drei purposeful real/official Medienmomente oder dokumentierte Ausnahme;
- mindestens zwei unterschiedliche Szenen;
- mindestens ein Brand-/Produkt-Moment;
- mindestens ein echter Proof-Moment;
- mindestens ein immersiver Nicht-Source-Card-Moment: echte UI, reales Bild oder echtes Video;
- wenn Bewegung selbst der Claim ist, echtes Video bevorzugen oder `videoExceptionReason` dokumentieren.

## Per-Reel Contract

`06-projektdateien/LEVEL-UP-PLAN.json`

v2-Pflichtbereiche bleiben erhalten. v3 ergänzt:

- `brandFidelity`
- `visualWorlds`
- `midReelReframes`
- erweiterte `realMediaMix`-Ausnahmen

Vor Phase 2 bzw. spätestens vor Source-Freeze:

```bash
node ki/scripts/validate-reel-level-up.mjs <reel-package-dir>
```

Nach Nutzer-Audio werden `majorReveals` anhand `WORD-TIMINGS.json` kontrolliert/angepasst. Phase-1-Timing ist niemals finale Autorität.

## Pflichtfelder im echten 1x-Review

Für alle Level-Up-Reels:

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

Zusätzlich für v3:

- `BRAND_RECOGNIZABLE_WITHOUT_CAPTION`
- `PRIMARY_BRAND_REAPPEARS`
- `REAL_BRAND_ASSET_USED_OR_EXCEPTION`
- `REAL_MEDIA_NOT_JUST_SOURCE_CARDS`
- `VISUAL_WORLD_VARIETY`
- `MID_REEL_REFRAMES`
