# Level-Up Standard — KI-Reels

## Ziel

Der Baseline-Storytelling-Standard verhindert statische Präsentations-Reels. Der Level-Up-Standard verhindert den nächsten Qualitätsfehler: technisch saubere Reels, die trotzdem generisch wirken, Marken kaum zeigen, farblich driften oder immer dieselben Motion-Grammatiken wiederholen.

Versionen:

- 2026-09-01 bis 2026-09-02: **Level-Up v2**
- ab 2026-09-03: **Level-Up v3**
- ab **2026-09-05: Level-Up v4**

v4 übernimmt alle v3-Regeln und ergänzt echte Brand-Asset-Materialisierung, Brand-/Farbkohärenz, funktionale Icons, offene Animationsfreiheit und Capability-Evolution.

## Gemeinsame Pflichtregeln v3/v4

1. **Cover first:** fertiger Cover-Kandidat inklusive Hold vollständig innerhalb der ersten Sekunde.
2. **Brand erkennbar:** bei Markenstories primäre Marke im Cover und später erneut sichtbar.
3. **Keine Fake-Logos:** offizielles Logo/Wordmark > echte Produkt-UI > offizieller Source-Crop > klare Typografie. Funktionsicon niemals als Markenlogo.
4. **Real Proof:** aktuelle Produkt-/Firmenclaims brauchen echte offizielle Proof-Momente.
5. **Real Media:** branded/current-news normalerweise mindestens drei purposeful real/official Momente über mindestens zwei Szenen: Brand/Produkt + Proof + echte UI/Bild/Video.
6. **Video wenn Bewegung der Claim ist:** echtes Produktvideo/B-Roll bevorzugen oder Ausnahme dokumentieren.
7. **Word/Phrase Lock:** große Namen, Zahlen, Daten, Statuswechsel, Brand-Reveals und SFX nach Forced Alignment an echte Wörter/Phrasen koppeln.
8. **Mindestens 20 Visual Beats** für normale 60–75-s-Reels.
9. **Mindestens vier Visual Worlds** und **zwei Mid-Reel-Reframes**.
10. **Scene Density:** sichtbare Entwicklung ca. alle 1,5–3,0 s; praktisch unverändert >4 s ist Review-Risiko.
11. **Overlap Discipline:** ein primärer Fokus, normalerweise max. zwei unterstützende Details; Caption nie auf kritischem Visual.
12. **Full Vertical Stage:** Fläche von Headline bis zur angehobenen Caption-Safe-Zone bewusst nutzen.
13. **Phone-readable Details:** wichtige Microdetails ca. 22–26 px oder größer.
14. **Semantic SFX:** Sound nur an sichtbaren Aktionen; Voice bleibt dominant.
15. **Real Render Review:** Source-Code allein kann keinen visuellen PASS erzeugen.

## Level-Up v4 — Brand-/Motion-Standard ab 05.09.2026

### 1. Echte lokale Brand-/UI-Assets

Wenn ein offizielles Logo, Wordmark, Produkt-UI-Bild oder offizieller Screenshot sauber lokal vorliegt, wird er nicht mehr nur im Plan erwähnt.

Verwende in `visual-assets.json`:

```json
{
  "provider": "LOCAL_OFFICIAL_MEDIA",
  "sourceFile": "02-bilder/brand-assets/example.png",
  "sourceUrl": "https://official.example/...",
  "sourceKind": "PRESS_KIT",
  "assetRole": "LOGO",
  "rightsStatus": "OFFICIAL_SOURCE_REFERENCE",
  "usageReviewNote": "Manuell geprüfter offizieller Brand-Asset-Ursprung."
}
```

Erlaubte `sourceKind`:

- `PRESS_KIT`
- `OFFICIAL_WEBSITE`
- `OFFICIAL_PRODUCT_UI`
- `USER_PROVIDED_OFFICIAL_EXPORT`

Erlaubte `assetRole`:

- `LOGO`
- `WORDMARK`
- `PRODUCT_UI`
- `SCREENSHOT`
- `PRODUCT_IMAGE`

Der Resolver:

- lädt nichts automatisch herunter;
- akzeptiert nur lokale JPEG/PNG/WebP unter dem Reel-Ordner `02-bilder/`;
- blockiert Symlinks/Path-Escape;
- kopiert das geprüfte lokale Asset nach `public/reel-assets/<compositionId>/`;
- bindet MIME + SHA256;
- hält `manualRightsReviewRequired: true` fest.

`OFFICIAL_SOURCE_REFERENCE` ist Provenance-Metadatum, keine pauschale juristische Freigabe.

### 2. Brand-Farben müssen stimmen

Jedes v4-Reel erhält:

`06-projektdateien/BRAND-MOTION-PLAN.json`

Darin werden festgelegt:

- offizielle/reference Farbquelle;
- Primärfarben;
- Sekundärfarben;
- neutrale Farben;
- Scene-spezifische Farbnotizen;
- bewusste semantische Ausnahmen für Warnung, Erfolg, Heatmaps, Wetterkarten, Daten, Accessibility usw.

Ziel ist **Kohärenz**, nicht monochrome Zwangsbranding.

FAIL-Beispiele:

- falscher Blauton wird wie offizielle Markenfarbe behandelt;
- Szene driftet ohne Story-Grund in fremde Farbwelt;
- Warnrot wird mit Brandrot verwechselt;
- mehrere Markenfarben werden sichtbar vertauscht.

### 3. Funktionale Icons kommen bewusst zurück

Icons sind ausdrücklich erwünscht für Funktionen und Konzepte:

- API / Code
- Cloud / Database
- Security / Lock / Shield
- Map / Location
- Weather / Satellite / Rain / Snow
- Timeline / Clock
- Input / Output / Cache
- Route / Search
- Travel / Agriculture / Energy
- Warning / Success

Aber:

**Funktionsicon ≠ Markenlogo.**

Brand und Funktion müssen visuell getrennt bleiben.

### 4. Animation ohne künstliche Technikgrenze

v4 setzt:

`animationFreedom.policy = OPEN_ENDED_STORY_DRIVEN`

Es gibt **keine feste Whitelist** zulässiger Animationstechniken.

Erlaubt ist jede Technik, die die Story verbessert und Lesbarkeit, Determinismus, Performance und QA besteht — auch wenn sie bisher nicht in der Shared Library existiert.

Beispiele, nicht Begrenzung:

- 2D Motion / Kinetic Type
- SVG-/Path-Morphs
- prozedurale Diagramme
- Camera / Depth / Parallax
- Three.js / 3D
- Skia
- Lottie / Rive
- Partikel
- Masken / Wipes / Reveal-Systeme
- Maps / Routing / Netzwerke
- simulierte UI-Interaktion
- reale Bild-/Video-Compositing-Szenen
- physische Metaphern / Collision / Orbit / Gates
- Custom Shaders bzw. neue kompatible Techniken

Wenn die bestehende Library einen Beat nicht stark genug löst, darf der Story Engineer eine neue Technik recherchieren oder implementieren.

**Offene Motion ≠ Effektspam.** Jede Animation muss erklären, fokussieren, vergleichen, beweisen, überleiten oder einen Payoff erzeugen.

### 5. Capability-Evolution

Vor größeren Reels wird geprüft, ob neue Skills, Agenten, MCPs, Remotion-Pakete oder lokale Tools einen **echten** Qualitätsgewinn bringen oder einen wiederkehrenden Engpass lösen.

Neue Capability nur wenn:

- neue Fähigkeit statt redundanter Duplikation;
- möglichst official/free/local-first;
- Kompatibilität geprüft;
- optional, solange nicht als Release-Abhängigkeit bewiesen;
- bei nicht-trivialer Integration mit Skill/Workflow/Checker.

Kein Tool-Sammeln um des Tool-Sammelns willen.

## Per-Reel Contract v4

Pflicht:

- `06-projektdateien/LEVEL-UP-PLAN.json` Version >=4
- `06-projektdateien/BRAND-MOTION-PLAN.json`
- `reel.json -> levelUp.standardVersion: 4`

Phase-1 Gate:

```bash
node ki/scripts/validate-reel-level-up.mjs <reel-package-dir>
node ki/scripts/validate-reel-brand-motion-v4.mjs <reel-package-dir>
```

Production-Render ruft den v4-Brand/Motion-Gate automatisch erneut auf und bindet `BRAND-MOTION-PLAN.json` per SHA256 in den Render-Lock.

## Caption-Standard

Shared Default:

- `bottom: 330`
- horizontal inset `76`
- max width `928`
- ca. `40 px`
- max. zwei Zeilen
- Ziel max. sechs Wörter pro sichtbarer Gruppe
- Cover-Fenster caption-frei

## Pflichtfelder im echten 1x-Review

Zusätzlich zu bisherigen Level-Up-Gates gelten für v4:

- `BRAND_ASSET_VISIBLE_OR_JUSTIFIED`
- `BRAND_COLOR_COHERENCE`
- `FUNCTIONAL_ICONS_ARE_NOT_FAKE_LOGOS`
- `MOTION_NOT_TEMPLATE_LOCKED`
- `ANIMATION_TECHNIQUE_FITS_STORY`
- `NO_ACCIDENTAL_COLOR_DRIFT`
- `REAL_MEDIA_MATERIALIZED_OR_JUSTIFIED`

Der exakte gemasterte MP4 entscheidet PASS/FAIL.
