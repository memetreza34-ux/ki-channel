# KI-Kanal — Bild- und Asset-Stil

## Zweck

Diese Datei ist **kein Top-Level-Router mehr**.

Zuerst entscheidet `ki/gehirn/VISUAL_STRATEGY.md` pro Visual Beat die primäre Bildsprache:

- `REMOTION_NATIVE`
- `REAL_CAPTURE`
- `HYBRID`
- `EXTERNAL_STILL_REQUIRED`
- `EXTERNAL_MOTION_REQUIRED`

Diese Datei wird vor allem dann angewendet, wenn `HYBRID` oder `EXTERNAL_STILL_REQUIRED` gewählt wurde. Für externe Motion-Assets liefert sie die Art-Direction-Basis; Bewegung/Shot-Brief wird zusätzlich reel-spezifisch beschrieben.

## Grundsatz

Externe/generierte Bilder sind **Erklärassets**, keine Dekoration.

Ein Still-/Hybrid-Asset ist sinnvoll, wenn räumliche, physische, organische oder alltägliche Anschaulichkeit die Aussage deutlich stärker trägt als reine Code-Grafik.

Standardstil für solche Assets:

> hochwertige vereinfachte 3D-Editorial-Illustration, hell, faceless, wenige große Objekte, klare Tiefenwirkung, kontrollierter Marken-Lila-Akzent.

Das ist ein Markenstandard, kein Zwang. Wenn ein reales Produkt/Tool selbst Beweis ist, gilt `REAL_CAPTURE` statt einer künstlich nachgebauten 3D-Version.

## Was bewusst Remotion-native bleibt

Auch bei Hybrid-/externen Assets bleiben präzise Informationsschichten standardmäßig kontrollierbar:

- Überschriften und Captions
- exakte Zahlen und Rankings
- Charts/Diagramme
- Pfeile/Connectoren
- Fokus-/Highlight-Zustände
- UI-Texte
- Buttons/Inputs/Labels, wenn sie nicht Teil eines echten Captures sind
- Quellenmarker
- animierte Zustandsänderungen

Keine generierte Interface-Grafik als Ersatz für präzise UI, wenn Remotion oder ein echter Capture die bessere Quelle ist.

## Wann ein Still-/Hybrid-Asset echten Mehrwert hat

Typische Fälle:

- räumliche 3D-Szene
- reale/stilisierte Alltagssituation
- komplexe organische Objektgruppe
- physische Metapher
- Material/Licht/Perspektive sind Teil des Verständnisses
- Produkt-/Umgebungsszene, die als Code unverhältnismäßig oder sichtbar schwächer wäre
- fotografisch/cinematic geprägtes Motiv

Kein externes Asset nur deshalb erzeugen, um „mehr Abwechslung“ vorzutäuschen. Die Bildidee muss semantisch tragen.

## REAL_CAPTURE hat Vorrang, wenn Realität der Beweis ist

Wenn aktuelle Tool-Oberfläche, Feature-Verhalten oder echtes Ergebnis selbst Teil der Aussage ist:

- nicht als 3D-Illustration faken
- nicht als generierte UI nachbauen
- `REAL_CAPTURE` verwenden
- Produkt/Datum/Plan/Version soweit relevant dokumentieren
- aktuelle Fakten im `source-ledger.md` prüfen

## Feste visuelle Regeln für externe Still-/Hybrid-Assets

- vertikal 9:16, komponiert für 1080 × 1920
- weiß, sehr hellgrau oder leicht lila getönter Grund
- leicht isometrisch oder klare redaktionelle Perspektive
- weiche realistische Schatten
- hochwertige matte/halbmatte Materialien
- 3–5 große Hauptobjekte als Richtwert
- ein klarer Fokus
- großzügige Abstände
- `#B98CFF` nur gezielt als KI-/Fokus-Akzent
- `#6E45C9` für Tiefe/Kontrast
- Grün nur Lösung/Vorteil
- Rot nur Risiko/Fehler/Grenze
- wichtige Objekte so komponieren, dass spätere Caption-/Header-Ebenen nicht kollidieren

## Faceless

- keine erkennbaren Gesichter
- keine Porträts
- keine Face-Cam-Optik
- Person nur wenn inhaltlich nötig: von hinten, angeschnitten, Hände oder stilisierte gesichtslose Figur
- keine generische Roboterfigur als KI-Symbol

## Kompositions-/Safe-Zones

Für ein 1080 × 1920 Reel-Asset:

- oberer Headerbereich ruhig halten
- Hauptmotiv bevorzugt im oberen/mittleren visuellen Arbeitsraum
- bedeutungstragende Hauptobjekte möglichst oberhalb des späteren Caption-Blocks abschließen
- keine wichtigen Details in den letzten ungefähr 420px unten
- keine wichtigen Hände/Objekte/Labels am Rand
- rechts Feed-Interaktionsleiste mitdenken
- keine sichtbaren Safe-Zone-Linien rendern

Die finale Caption-Geometrie kommt aus `ki/gehirn/CAPTION_SAFE_POSITION.md`; das Asset selbst enthält keine Caption.

## Text im generierten/externen Bild

Standard: **kein eingebrannter Erklärungstext**.

Nur wenn Text physisch zum Motiv gehört und nicht sinnvoll als Overlay getrennt werden kann:

- maximal 0–3 kurze Labels
- Deutsch
- 1–3 Wörter je Label
- keine Überschrift
- kein Untertitel
- kein Erklärungssatz
- keine präzisen Zahlen, die Remotion kontrollierter darstellen kann

## Sprache der Prompts

Der vollständige Generierungs-/Art-Direction-Prompt wird standardmäßig auf **Englisch** geschrieben, weil räumliche, Material-, Kamera- und Lichtanweisungen so konsistent formuliert werden können.

Sichtbarer Text bleibt, falls unvermeidbar, deutsch.

## Pflichtstruktur jedes Still-/Hybrid-Prompts

Jeder finale Prompt in `02-bilder/image-prompts.md` dokumentiert:

1. **Beat / Scene ID**
2. **Scene intent** — was muss der Zuschauer verstehen?
3. **Selected modality** — `HYBRID` oder `EXTERNAL_STILL_REQUIRED`
4. **Why this modality** — warum ist diese Form besser als Remotion-native oder Real Capture?
5. **Visual metaphor / situation** — eine klare Bildidee
6. **Main subjects** — wenige konkrete Objekte
7. **State / relationship** — was muss sichtbar wahr sein?
8. **Composition** — Fokus, Raum, spätere Overlays
9. **Camera** — Perspektive/Brennweitencharakter
10. **Materials and lighting**
11. **Brand accents**
12. **Faceless constraints**
13. **Text policy**
14. **Safe zones**
15. **Remotion separation** — was wird später präzise ergänzt?
16. **Negative constraints**
17. **Output filename**
18. **Manifest status** — zunächst `MISSING_REQUIRED`, bis reale Datei vorliegt

## Canonical Prompt-Template

```text
Create a premium stylized 3D editorial illustration for a German faceless AI explainer reel, vertical 9:16, composed for 1080x1920.

BEAT / SCENE:
[id]

SCENE INTENT:
[one precise idea the viewer must understand]

SELECTED MODALITY:
[HYBRID or EXTERNAL_STILL_REQUIRED]

WHY THIS MODALITY:
[why a spatial/physical still is clearer than Remotion-native graphics and why REAL_CAPTURE is not the right proof]

VISUAL CONCEPT:
[one simple physical scene or metaphor; no infographic collage]

MAIN SUBJECTS:
[3–5 large concrete objects, positions and relationships]

VISIBLE STATE / RELATIONSHIP:
[what must be visually true]

COMPOSITION AND CAMERA:
clean editorial composition, strong hierarchy, slightly isometric or natural product-illustration perspective, no extreme wide-angle distortion, important subjects in the upper/middle safe working area, calm room for a compact header and later captions, no essential detail in the bottom platform-safe region.

MATERIALS AND LIGHTING:
premium simplified 3D forms, refined matte and semi-matte materials, soft realistic contact shadows, subtle ambient occlusion, controlled studio lighting, crisp silhouettes.

BRAND:
white or very light warm-gray/lilac background; #B98CFF only as the main AI/focus accent; #6E45C9 only for depth or contrast; natural object colors elsewhere.

FACELESS:
no recognizable faces, no portraits, no face-cam framing; if human presence is essential, use a back view, crop, hands, or a simplified faceless figure.

TEXT:
no headline, no subtitle, no paragraph text, no random letters, no watermark. If physically unavoidable, only these short German labels: [labels or NONE].

REMOTION WILL ADD:
[headline / captions / arrows / exact numbers / UI / labels / state changes / source markers / NONE]. Do not bake these elements into the image.

AVOID:
cyberpunk, neon sci-fi, dark server rooms, generic robots, overloaded infographic layouts, tiny objects, excessive icons, excessive arrows, random text, watermarks, distorted anatomy, cropped key objects, duplicate objects, inconsistent perspective, generated UI that should be real capture or a controlled Remotion layer.

OUTPUT:
clean premium editorial image, mobile-readable composition, filename: [scene-XX-description.png].
```

## Externes Motion-Asset

Wenn `EXTERNAL_MOTION_REQUIRED` gewählt wurde, zusätzlich zu visueller Art Direction dokumentieren:

- welche **physische Bewegung** die Aussage trägt
- Start- und Endzustand
- Kamerabewegung nur wenn semantisch nötig
- gewünschte Dauer / Loop ja-nein
- was später in Remotion ergänzt wird
- keine eingebrannten Captions/Header
- erwarteter Dateiname
- Manifest-Status

Ein Motion-Asset ist nicht gerechtfertigt, wenn lediglich ein statisches Motiv leicht schweben/zoomen soll; das übernimmt Remotion besser.

## Dateinamen

Still:

```text
scene-01-<kurzer-name>.png
scene-02-<kurzer-name>.png
```

Mehrere Layer:

```text
scene-03-bg.png
scene-03-subject.png
scene-03-overlay-mask.png
```

Motion:

```text
scene-04-<kurzer-name>.mp4
```

Keine Namen wie `final2.png`, `image123.png`, `neu.png`.

## Asset-Manifest

Das Manifest beschreibt die **reale Existenz**, nicht die Absicht.

Empfohlene Status:

- `NOT_REQUIRED`
- `MISSING_REQUIRED`
- `PROVIDED`
- `VERIFIED`

Phase 1 darf `MISSING_REQUIRED` setzen. Phase 3 darf daraus nicht automatisch `PROVIDED` machen, wenn die Datei nicht wirklich existiert.

## Qualitätsgate für jedes externe Still-/Hybrid-Asset

Vor Freigabe tatsächlich prüfen:

- Modality in `visual-strategy.md` begründet
- Aussage ohne Header grundsätzlich erkennbar
- richtige 9:16-Komposition
- keine erkennbaren Gesichter
- kein Wasserzeichen
- kein zufälliger/fehlerhafter Text
- keine Fake-UI, wenn Real Capture nötig wäre
- keine abgeschnittenen Hauptobjekte
- keine deformierten Hände/Objekte
- konsistente Perspektive/Schatten
- Marken-Lila gezielt statt flächig
- genügend Raum für kontrollierte Header-/Caption-Ebenen
- Smartphone-Lesbarkeit
- kein unnötiges Objekt
- reale Datei entspricht dem Manifest

Wenn zwei oder mehr dieser Punkte scheitern: Asset neu erstellen/bereitstellen oder Visual Strategy ändern; nicht mit Overlays kaschieren.
