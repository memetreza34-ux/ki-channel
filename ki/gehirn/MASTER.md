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
10. `../BILDSTIL.md` — Qualitätsregeln, wenn externe Still-/Hybrid-Assets gewählt wurden
11. `BEWEGUNG.md` — Bewegungssprache: Kurven, Takt, Hierarchie, Zurückhaltung
12. `CREATIVE_QA.md` — Zuschauer-/Retention-Gate nach dem Render
13. `../youtube-longform/AGENTS.md` — aktiver YouTube-Longform-Produktionsvertrag
14. `PLATTFORMEN.md` — Publishing und Plattform-Packaging
15. `PRODUKTIONSABLAUF.md` — Phase 1/2/3
16. `WERKZEUGE.md` — welcher Skill und welcher Agent in welchem Schritt
17. named reel/longform package — konkrete Inhalte

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
- beste Bildsprache vor bevorzugtem Tool
- ein kanonischer Content-Master; Plattformen sind Packaging, keine zweite Produktionswahrheit
- Short-Form endet, sobald das Versprechen erfüllt ist; 50–60 Sekunden sind erlaubt, aber kein Streckziel
- YouTube Longform ist eigenständig und wird nie bloß aus einem Reel aufgeblasen

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

Redaktionelle Orientierung: ungefähr `70–80 % CURRENT/HYBRID`, `20–30 % Evergreen/Grundlagen`.

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
VISUAL MODALITY PRO BEAT
↓
MECHANIK / SHOT / ART DIRECTION
↓
ERST JETZT: Library / Remotion / Asset-Prompts / Capture
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
5. Welches Verb beschreibt die Hauptaktion? (z. B. wählt, prüft, zerfällt, verbindet)
6. Welche Bildsprache erklärt den Beat am besten?
   REMOTION_NATIVE | REAL_CAPTURE | HYBRID | EXTERNAL_STILL_REQUIRED | EXTERNAL_MOTION_REQUIRED
7. Welcher konkrete Mechanismus trägt diese Bildsprache?
8. Gibt es bereits etwas mit EXAKTEM semantischem Fit?
9. Wenn nein: NEW_BUILD bzw. neues benötigtes Asset/Capture statt Kompromiss-Reuse.
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

Jede bedeutungstragende Sprecherstelle erhält eine bewusste visuelle Reaktion. Die passende Einheit kann sein:

- Wort
- Phrase
- Halbsatz
- Satz
- zusammenhängende Satzgruppe

Nicht jedes Wort muss animiert werden. Aber wenn sich Bedeutung, Ursache, Vergleich oder Zustand ändert, muss die visuelle Entscheidung diesen Wechsel tragen.

Für jeden Beat dokumentiert `06-projektdateien/visual-strategy.md` mindestens:

```text
Sprecherstelle
→ Bedeutung
→ Zuschauer muss sehen
→ Hauptverb
→ Startzustand
→ sichtbare Veränderung
→ Endzustand
→ Visual Modality
→ Mechanikfamilie
→ Hero beat JA/NEIN
→ Asset/Capture, falls nötig
```

Erst danach entsteht `animation-plan.md`.

## Visual Modality Contract

Es gibt **keine automatische Maximum-Remotion-Regel mehr**.

Die beste Erklärung gewinnt:

- `REMOTION_NATIVE` — exakte UI, Daten, Prozesse, technische Mechanismen
- `REAL_CAPTURE` — tatsächliches Produktverhalten ist der Beweis
- `HYBRID` — räumliches/physisches Hero-Motiv plus präzise Remotion-Schichten
- `EXTERNAL_STILL_REQUIRED` — komplexe räumliche/organische Momentaufnahme
- `EXTERNAL_MOTION_REQUIRED` — komplexe physische Bewegung ist selbst Bedeutungsträger

Remotion ist nicht automatisch premium. Externe Assets sind nicht automatisch abwechslungsreicher. Jede Wahl braucht eine semantische Begründung.

Details: `VISUAL_STRATEGY.md`.

## Diversity Contract

Ein Reel darf eine konsistente Identität haben, aber nicht in monotone Karten-Grammatik kippen.

Richtwerte:

- nicht mehr als zwei aufeinanderfolgende Beats mit derselben Hauptgrammatik
- karten-/panelbasierte Hauptbeats normalerweise höchstens etwa ein Drittel
- mindestens ein bewusst geplanter visueller Höhepunkt
- unterschiedliche Mechanikfamilien nur dort einsetzen, wo die Aussage sie trägt
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

Phase 3 passt zuerst Animation, Holds und Szenengrenzen an die echte Stimme an. Wenn eine einzelne Phrase danach noch unnatürlich zur geplanten Erklärung passt, darf lokal pitch-erhaltend leicht retimed werden.

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
= kann Remotion, Real Capture, Hybrid oder externes Asset sein
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

- Kapitelmarker kurz und sparsam statt permanenter großer Titel
- UI, Captures, Diagramme und Illustrationen groß genug für 16:9/Laptop/TV
- keine dauerhaft eingebrannten Volltext-Untertitel als Standard
- Animationstext nur für Objekt, Zustand, echte UI oder kurze Orientierung
- kein Transcript als Design-Ersatz
- pro Kapitel klare Zustandsentwicklung, aber keine Dauerbewegung ohne Erklärfunktion
- End-Hold vor Kapitelwechsel

Auch Longform wählt die Bildsprache nach Inhalt, nicht automatisch `REMOTION_NATIVE_MAXIMUM`.

## Harte Reel-Caption-Zone

Bei vertikalem 1080 × 1920 Short-Form gilt:

- ungefähr ab `y=1440` beginnt die reservierte Caption-/Bottom-Safe-Zone
- **unterhalb dieser Grenze darf keine erklärende Animation sichtbar sein**
- keine Karte, Linie, Node, Partikel, Illustration oder Animationsbeschriftung hinter oder unter den Untertiteln
- Hauptvisual höher, kleiner oder neu komponieren, wenn es nicht passt
- Untertitel nicht nach unten verdrängen
- technischer Clip-Guard ist nur letzte Sicherung; sichtbares Abschneiden bleibt Review-Fehler

Diese spezifische Zone gilt nicht als Longform-Layoutregel.

## Externe Assets und Captures

Das Repository darf Bedarf, Prompt, Shot-Brief, Dateiname und Manifest definieren. Es darf fehlende Medien **nicht vortäuschen**.

Phase 1 darf ein Pflichtasset als `MISSING_REQUIRED` markieren.

Phase 3 darf nur tatsächlich vorhandene Dateien verwenden. Fehlt ein Pflichtasset oder Capture, wird nicht stillschweigend durch generische Karten ersetzt.

Für Still-/Hybrid-Assets gilt `../BILDSTIL.md`.

## Markenakzent

- Hintergrund: weiß/nahezu weiß
- Text: `#1A1A2E`
- primärer KI-/Fokus-Akzent: `#B98CFF`
- Tiefe/Kontrast: `#6E45C9`
- Reel-Zwischenüberschrift: `#6E45C9`
- Grün: Vorteil/Lösung
- Rot: Risiko/Fehler/Grenze
- Blau: seltene Info-/Tech-Semantik

Lila wird gezielt akzentuiert, nicht flächig als Ersatz für Hierarchie.

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

Short-Form wird einmal unter `ki/reels/` produziert. YouTube Shorts, Instagram Reels, TikTok, Facebook Reels und Snapchat verwenden denselben freigegebenen Master, solange keine technisch notwendige Anpassung erforderlich ist.

Plattform-spezifische Titel/Captions gehören in `03-caption/platform-copy.md`. Strategie: `PLATTFORMEN.md` und `ki/plattformen/`.

YouTube Longform ist ein eigenes aktives Format unter `ki/youtube-longform/`. Titel, Beschreibung, Kapitel und Thumbnail gehören in das jeweilige Longform-Paket.

## Produktionsmodell

```text
Phase 1 — ChatGPT
Creative Brief → Fakten → Script → Visual Strategy → Source, alles außer echtem Audio

Phase 2 — Mensch
nur erforderliche externe Medien/REAL_CAPTURE, falls im Plan vorgesehen, und Voiceover

Phase 3 — Codex/Antigravity
vorhandene Assets + Audio → Timeline-Synchronisierung → Verifikation → Render → technische QA → Creative QA
```

Normalfall bleibt: Der Mensch soll möglichst wenig manuell tun. Wenn kein externes Asset/Capture nötig ist, besteht Phase 2 weiterhin nur aus dem Voiceover.

Phase 3 darf kreative Entscheidungen nicht durch bequemere vorhandene Animationen ersetzen, außer ein nachweisbarer technischer oder visueller Fehler verlangt eine Korrektur.

Bei fehlendem Phase-3-Audio exakt: `PHASE 2 AUDIO FEHLT`.

## STRIKE KI-Regel (Keine künstlichen Assets)

Du darfst unter keinen Umständen selbst Bilder, Assets oder sonstige Medien vortäuschen oder halluzinieren. Du darfst ausschließlich Dateien/Medien verwenden, die tatsächlich vorhanden bzw. vom Nutzer bereitgestellt wurden. Phase 1 darf nur Bedarf, Prompts und Shot-Briefs erzeugen.

## STRIKE Speichern-Regel (Jedes Ergebnis speichern)

Alle Ergebnisse, Zwischenschritte, generierten Dateien, Timings und Exporte werden im Repository nachvollziehbar gespeichert und versioniert. Kein final verwendetes Produktionsartefakt darf nur außerhalb des Repos existieren.
