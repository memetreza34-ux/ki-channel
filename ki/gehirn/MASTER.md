# 🧠 KI-Channel — MASTER-GEHIRN

Diese Datei verbindet Identität, Themenwahl, Story, Fakten, Reel-Logik, Visualstrategie, Bildstil, Plattformen und Produktionsablauf zu einem einzigen Entscheidungsrahmen.

## Autoritative Quellen

1. `REPO-STATE.md` — Repository-Wahrheit und Branch
2. `AGENTS.md` / `ki/AGENTS.md` — technische und strukturelle Regeln
3. **diese Datei** — kanalweite Entscheidungslogik
4. `KANAL.md` — Identität, Zielgruppe, Ton und Current-AI-Positionierung
5. `THEMENWAHL.md` — aktuelle Releases, News, GitHub/Open Source, Vergleiche und Rankings
6. `STORY_RETENTION.md` — Hook-/Story-Gate vor Script und Code
7. `FAKTENQUELLEN.md` — Claim-Klassifikation, Quellen und Recheck-Regeln
8. `REELS.md` — Reel-Struktur, Text-Hierarchie, Visual Beats
9. `VISUAL_STRATEGY.md` — Wahl der besten Bildsprache pro Beat
10. `REMOTION_VISUAL_SYSTEM.md` — Remotion als universelle finale Composition und code-first Visual-System
11. `../BILDSTIL.md` — Qualitätsregeln, wenn externe Still-/Hybrid-Assets gewählt wurden
12. `BEWEGUNG.md` — Bewegungssprache: Kurven, Takt, Hierarchie, Zurückhaltung
13. `CREATIVE_QA.md` — Zuschauer-/Retention-Gate nach dem Render
14. `../youtube-longform/AGENTS.md` — aktiver YouTube-Longform-Produktionsvertrag
15. `YOUTUBE_VISUAL_LANGUAGE.md` — kanonische Longform-Bildsprache und Motion Direction
16. `APPROVED_KI_VISUALS.md` — kleiner freigegebener Production-Baukasten
17. `PLATTFORMEN.md` — Publishing und Plattform-Packaging
18. `PRODUKTIONSABLAUF.md` — Phase 1/2/3
19. `WERKZEUGE.md` — welcher Skill und welcher Agent in welchem Schritt
20. named reel/longform package — konkrete Inhalte

Wenn zwei ältere Dokumente kollidieren, gilt diese Reihenfolge. Nicht raten.

## Kernziel

> Aktuelle KI-Entwicklungen für einen normalen deutschsprachigen Zuschauer schnell verständlich und sichtbar einordnen — neue Modelle, neue Funktionen, relevante KI-News, GitHub/Open-Source-Neuheiten, Vergleiche und Rankings; sachlich geerdet und ohne Hype-Lärm.

## Kanalprinzipien

- deutsch
- vollständig faceless
- **Current-AI vor zeitloser Grundlagen-Erklärung**
- neue Fähigkeit/Änderung vor abstraktem Fachbegriff
- sichtbarer Beweis/Demo vor Herstellerclaim
- Bedeutung vor Effekt
- Verständlichkeit vor technischer Selbstdarstellung
- Nutzen/Aha vor Feature-Liste
- Wahrheit vor Reichweitenversprechen
- Vergleich nur mit klaren Kriterien
- Grundlagen nur dann als Hauptteil, wenn sie eine aktuelle Story verständlicher machen
- echter sichtbarer Mechanismus oder echtes Produktverhalten vor beschrifteter Karte
- **Remotion ist die universelle finale Composition- und Render-Ebene**
- eigene Erklärvisuals bevorzugt code-first mit React/SVG/CSS/Shapes/Paths/Three bauen
- echte Screenshots/Captures nur als Wahrheits-/Beweisebene in Remotion einbetten
- kein UI-Nachbau darf als realer Screenshot ausgegeben werden
- beste Bildsprache vor dekorativem Asset
- ein kanonischer Content-Master; Plattformen sind Packaging, keine zweite Produktionswahrheit
- Short-Form endet, sobald das Versprechen erfüllt ist; 50–60 Sekunden sind erlaubt, aber kein Streckziel
- **YouTube Longform ist das primäre Videoformat des Kanals**; Short-Form bleibt eigenständig und ergänzend
- YouTube Longform ist eigenständig und wird nie bloß aus einem Reel aufgeblasen
- Longform folgt `Cinematic Editorial Tech` statt generischer Dashboard-, Neon- oder Template-Ästhetik

## Editoriales Current-AI-Gate

Vor Story und Script wird zuerst `THEMENWAHL.md` angewendet.

Der Standardfeed soll hauptsächlich aus diesen Themen bestehen:

- neue KI-Modelle und Releases
- wichtige Updates bestehender KIs
- KI-News mit konkreter Auswirkung
- neue relevante GitHub-/Open-Source-Projekte
- Modell-/Tool-Vergleiche
- Rankings nach klaren Kriterien
- Vor-/Nachteile und Nutzungsempfehlungen
- aktuelle Marktüberblicke

Zeitlose Themen wie Tokens, Embeddings, Attention, RAG oder Transformer sind **kein bevorzugter Startpunkt**. Sie werden eingesetzt, wenn sie eine aktuelle Entwicklung erklären.

Redaktionelle Orientierung: ungefähr `85–90 % BREAKING/FRESH/CURRENT/HYBRID`, `10–15 % Evergreen/Grundlagen`.

Bei zwei ähnlich starken Themen gewinnt normalerweise das aktuellere Thema mit dem besseren sichtbaren Beweis.

## Produktionsreihenfolge — niemals überspringen

```text
THEMA / VIEWER PROMISE
↓
HOOK + STORY + PAYOFF
↓
FAKTEN / QUELLEN / RISIKEN
↓
FINALER SPRECHERTEXT
↓
VISUAL BEATS
↓
VISUAL STRATEGY / BEWEISQUELLE
↓
REMOTION-BUILD / SHOT / ART DIRECTION
↓
SOURCE
↓
VOICEOVER
↓
TIMELINE + RENDER
↓
TECHNISCHER REVIEW
↓
CREATIVE REVIEW
```

**Verboten:** direkt von Thema zu Remotion-Code springen.

## Entscheidungsreihenfolge für jede Reel-Szene

```text
1. Was sagt der Sprecher genau?
2. Was ist die gemeinte Aussage hinter den Worten?
3. In welche bedeutungstragenden Visual Beats zerfällt die Stelle?
4. Was muss der Zuschauer bei jedem Beat sichtbar sehen?
5. Welches Verb beschreibt die Hauptaktion?
6. Braucht die Aussage einen echten Beweis-Capture oder reicht ein nativer Remotion-Build?
7. Welche Remotion-Mechanik erklärt den Beat am besten?
8. Gibt es bereits etwas mit EXAKTEM semantischem Fit?
9. Wenn nein: NEW_BUILD statt Kompromiss-Reuse.
10. Welche wenigen Labels sind wirklich nötig?
11. Endet alles oberhalb der Caption-Zone und bleibt smartphone-lesbar?
```

Die Library wird **nach** Story, Beat und Visualstrategie geprüft. Sie ist Werkzeugkasten, nicht Quelle der kreativen Entscheidung.

## Story Contract

Vor finalem Script muss `06-projektdateien/creative-brief.md` konkret beantworten:

- Viewer promise
- Hook tension
- 3-second proof
- Why care
- Core mechanism
- Payoff
- Memorable moment
- Truth risk

Fehlen Hook, Mechanismus oder sichtbarer Höhepunkt, wird nicht mit Source begonnen.

Details: `STORY_RETENTION.md`.

## Fakten Contract

Aktuelle, messbare oder produktabhängige Aussagen werden in `06-projektdateien/source-ledger.md` geerdet.

Pflichtfälle:

- sichtbare Zahlen/Prozentwerte
- Preise/Limits/Pläne
- aktuelle Features/Modelle
- Benchmarks/Rankings
- reale Quellen/Paper
- aktuelle News
- Aussagen, die durch zu starke Vereinfachung ein falsches Mentalmodell erzeugen könnten

Keine scheinpräzisen Demo-Werte als Fakten. Details: `FAKTENQUELLEN.md`.

## Visual Beat Contract

Jede bedeutungstragende Sprecherstelle erhält eine bewusste visuelle Reaktion.

Für jeden Beat dokumentiert `06-projektdateien/visual-strategy.md` mindestens:

```text
Sprecherstelle
→ Bedeutung
→ Zuschauer muss sehen
→ Hauptverb
→ Startzustand
→ sichtbare Veränderung
→ Endzustand
→ Beweisquelle nötig? JA/NEIN
→ Remotion-Build-Idee
→ Mechanikfamilie
→ Hero beat JA/NEIN
→ echter Capture/Asset, falls Beweis nötig
```

Erst danach entsteht `animation-plan.md`.

## Remotion Composition Contract

Für neue Short-Form-Reels gilt:

> **Jeder finale Frame wird in Remotion komponiert und gerendert.**

Standard:

- `REMOTION_NATIVE` für konstruierte Erklärvisuals
- `REAL_CAPTURE` nur als echte Beweisquelle, anschließend in Remotion eingebettet
- `HYBRID` für echten Capture + Remotion-Overlays
- externe Stills/Motion nur begründete Ausnahme

Remotion-native umfasst ausdrücklich:

- Illustrationen
- SVG-Icons
- UI-Mockups
- Browser/App-Szenen
- Code/Terminal
- GitHub-/Repo-Szenen
- Rankings/Vergleiche
- Diagramme/Daten
- Geräte/Objekte
- 2.5D
- Three bei echter Tiefenlogik

Ein UI-Nachbau ist eine Illustration. Wenn reales Produktverhalten eine Behauptung belegt, muss ein echter Capture verwendet werden.

Details: `VISUAL_STRATEGY.md` und `REMOTION_VISUAL_SYSTEM.md`.

## Diversity Contract

Ein Reel darf eine konsistente Identität haben, aber nicht in monotone Karten-Grammatik kippen.

Richtwerte:

- nicht mehr als zwei aufeinanderfolgende Beats mit derselben Hauptgrammatik
- karten-/panelbasierte Hauptbeats normalerweise höchstens etwa ein Viertel
- mindestens die Hälfte objekt-, pfad-, form-, raum-, code-, illustration- oder prozessbasiert
- mindestens ein bewusst geplanter visueller Höhepunkt
- Wiederholung ist erlaubt, wenn sie Teil desselben fortlaufenden Prozesses ist

Eine Karte ist semantisch sinnvoll bei UI, Dokument, Datensatz, Nachricht, Datei oder Token. Sie ist **kein Standardcontainer für abstrakte Aussagen**.

## Timeline Contract

Die finale Phase behandelt Stimme, Visual Beats, Animation, Pausen und Untertitel-Timing als **eine gemeinsame Timeline**.

Grundsatz:

```text
Gesprochene Bedeutung
= sichtbarer Zustandswechsel
= Caption-/Textfokus, falls verwendet
= Beat-Timing
```

Phase 3 passt zuerst Animation, Holds und Szenengrenzen an die echte Stimme an.

Dabei gilt:

- niemals Speedwechsel mitten im Wort
- keine abrupt hörbaren Sprünge
- Wortlaut/Reihenfolge bleiben unverändert
- bevorzugt `0.97x–1.03x`, bei echtem Bedarf bis ungefähr `0.94x–1.06x`
- stärkere Abweichung → neues Voiceover statt hörbarer Verzerrung
- finale Caption-/Wort-Timestamps immer gegen das tatsächlich verwendete Audio synchronisieren

Short-Form wird nicht künstlich auf exakt 60 Sekunden gezwungen.

## Visual Hierarchy Short-Form

```text
ZWISCHENÜBERSCHRIFT + ICON
= oben mittig; kompakter Kapitel-/Kerngedanke
= dunkles Marken-Lila #6E45C9
= keine zusätzliche erklärende Unterzeile

HAUPTVISUAL
= individuelle sichtbare Erklärung
= primär Remotion-native oder echter Capture in Remotion
= kritische Inhalte enden vollständig oberhalb der Caption-Zone

ANIMATIONSTEXT
= nur Objekt-/Zustandslabels, keine Satzkopie

UNTERTITEL / CAPTION
= unten in eigener sicheren Zone, ohne Hintergrundkarte
= am final verwendeten Audio ausgerichtet
= nur aktueller Sprechfokus in Marken-Lila
```

Interne Regie-, `goal`-, Debug- und Planner-Texte sind niemals Zuschauertext.

## Visual Hierarchy Longform

- Kapitelmarker kurz und sparsam
- UI, Captures, Diagramme und Illustrationen groß genug für 16:9/Laptop/TV
- keine dauerhaft eingebrannten Volltext-Untertitel als Standard
- Animationstext nur für Objekt, Zustand, echte UI oder kurze Orientierung
- kein Transcript als Design-Ersatz
- pro Kapitel klare Zustandsentwicklung
- End-Hold vor Kapitelwechsel

Auch Longform wird final in Remotion komponiert.

## Harte Reel-Caption-Zone

Bei vertikalem 1080 × 1920 Short-Form gilt:

- ungefähr ab `y=1440` beginnt die reservierte Caption-/Bottom-Safe-Zone
- **unterhalb dieser Grenze darf keine erklärende Animation sichtbar sein**
- keine Karte, Linie, Node, Partikel, Illustration oder Animationsbeschriftung hinter oder unter den Untertiteln
- Hauptvisual höher, kleiner oder neu komponieren, wenn es nicht passt
- Untertitel nicht nach unten verdrängen

## Externe Assets und Captures

Das Repository darf Bedarf, Quelle, Dateiname und Manifest definieren. Es darf fehlende Medien **nicht vortäuschen**.

Ein echter Capture bleibt erforderlich, wenn die aktuelle Produktoberfläche oder das echte Ergebnis Teil des Beweises ist.

Externe generierte Bilder/Videos sind kein Standardweg für neue Reels. Vor einer solchen Ausnahme muss dokumentiert sein, warum der Remotion-native Build sichtbar schlechter oder fachlich ungeeignet wäre.

## Markenakzent

- Hintergrund: weiß/nahezu weiß
- Text: `#1A1A2E`
- primärer KI-/Fokus-Akzent: `#B98CFF`
- Tiefe/Kontrast: `#6E45C9`
- Reel-Zwischenüberschrift: `#6E45C9`
- Grün: Vorteil/Lösung
- Rot: Risiko/Fehler/Grenze
- Blau: seltene Info-/Tech-Semantik

## Qualitätsregel

Eine Szene ist nicht gut, weil viel passiert. Sie ist gut, wenn Startzustand → sichtbare Veränderung → Ergebnis ohne zusätzliche Erklärung verstanden werden kann.

Pflicht:

- starker Einstieg ohne Vorrede
- klare Startlage
- dominante bedeutungsgetriebene Veränderung
- lesbarer End-Hold
- eindeutige Beziehung zum Sprechertext
- zeitliche Übereinstimmung von Sprecher und Beat
- mindestens ein geplanter visueller Höhepunkt im Reel
- keine unnötige Textdopplung
- keine erfundenen Fakten
- keine zufällige Reuse-Animation
- keine monotone Kartenserie aus Bequemlichkeit
- kein Fake-Capture
- keine gefälschten Logos
- formatgerechte Lesbarkeit
- aktueller Render gehört exakt zum geprüften Source-Stand

## Creative QA ist Stop-Gate

Technische Tests reichen nicht.

Vor Freigabe zusätzlich `CREATIVE_QA.md` durchführen und in `06-projektdateien/creative-review.md` dokumentieren.

Ein technisch fehlerfreies Reel wird nicht freigegeben, wenn:

- Hook zu langsam ist
- zu viel Leerlauf besteht
- visuelle Grammatik repetitiv ist
- Animation nur Textcontainer bewegt
- kein erinnerbarer Moment existiert
- Kernmechanik ohne Ton nicht zumindest grob erkennbar ist

## Publishing-Modell

Short-Form wird einmal unter `ki/reels/` produziert. YouTube Shorts, Instagram Reels, TikTok, Facebook Reels und Snapchat verwenden denselben freigegebenen Master.

Plattform-spezifische Titel/Captions gehören in `03-caption/platform-copy.md`.

YouTube Longform ist ein eigenes aktives Format unter `ki/youtube-longform/`.

## Produktionsmodell

```text
Phase 1 — ChatGPT
Creative Brief → Fakten → Script → Visual Strategy → Remotion Source, alles außer echtem Audio

Phase 2 — Mensch
Voiceover + nur tatsächlich notwendige echte Captures/Quellenmedien

Phase 3 — Codex/Antigravity
vorhandene Source + Audio/Captures → Timeline-Synchronisierung → Verifikation → Remotion-Render → technische QA → Creative QA
```

Bei fehlendem Phase-3-Audio exakt: `PHASE 2 AUDIO FEHLT`.

## STRIKE KI-Regel — keine künstlichen Beweisassets

Du darfst unter keinen Umständen nicht vorhandene Screenshots, Captures, Audios, Videos oder offizielle Markenassets als real vorhanden behandeln.

Remotion-native Illustrationen dürfen konstruiert werden, solange sie klar **Erklärung** sind und nicht als echter Produktbeweis ausgegeben werden.

## STRIKE Speichern-Regel

Alle Ergebnisse, Zwischenschritte, generierten Dateien, Timings und Exporte werden im Repository nachvollziehbar gespeichert und versioniert. Kein final verwendetes Produktionsartefakt darf nur außerhalb des Repos existieren.
