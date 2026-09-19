# 🧠 KI-Channel — MASTER-GEHIRN

Diese Datei verbindet Identität, Reel-Logik, Longform, Bildstil, Plattformen und Produktionsablauf zu einem einzigen Entscheidungsrahmen.

## Autoritative Quellen

1. `REPO-STATE.md` — Repository-Wahrheit und Branch
2. `AGENTS.md` / `ki/AGENTS.md` — technische und strukturelle Regeln
3. **diese Datei** — kanalweite Entscheidungslogik
4. `KANAL.md` — Identität, Zielgruppe, Ton
5. `REELS.md` — Reel-Struktur, Text-Hierarchie, Visualisierung
6. `../youtube-longform/AGENTS.md` — aktiver YouTube-Longform-Produktionsvertrag
7. `PLATTFORMEN.md` — Publishing und YouTube/Instagram/TikTok/Facebook/Snapchat
8. `PRODUKTIONSABLAUF.md` — Phase 1/2/3
9. `../BILDSTIL.md` — Bild- und Prompt-Qualität
10. `BEWEGUNG.md` — Bewegungssprache: Kurven, Takt, Hierarchie, Zurückhaltung
11. named reel/longform package — konkrete Inhalte

Wenn zwei ältere Dokumente kollidieren, gilt diese Reihenfolge. Nicht raten.

## Kernziel

> Komplexe KI so erklären, dass ein normaler deutschsprachiger Zuschauer den Mechanismus schnell versteht — visuell stark, sachlich geerdet und ohne Hype-Lärm.

## Kanalprinzipien

- deutsch
- vollständig faceless
- verständlich vor technisch beeindruckend
- Nutzen/Aha vor Feature-Liste
- Wahrheit vor Reichweitenversprechen
- ein kanonischer Content-Master; Plattformen sind Packaging, keine zweite Produktionswahrheit
- Short-Form-Skripte standardmäßig ungefähr 50–60 Sekunden, wenn der Inhalt das trägt
- YouTube Longform ist eigenständig und aktuell auf 5:00–6:00 Minuten ausgelegt
- Longform wird nie bloß aus einem Reel aufgeblasen

## Entscheidungsreihenfolge für jede Reel-Szene

```text
1. Was sagt der Sprecher genau?
2. In welche bedeutungstragenden Visual Beats zerfällt Satz/Phrase/Wortfolge?
3. Was muss bei jedem Beat sichtbar passieren, damit die Aussage verstanden wird?
4. Welcher individuelle Remotion-Mechanismus erklärt genau diesen Beat?
5. Gibt es dafür bereits eine Animation mit EXAKTEM semantischem Fit?
6. Wenn nein: NEW_BUILD statt Kompromiss-Reuse.
7. Welche kurze Zwischenüberschrift ordnet die Szene ein?
8. Welches passende Icon gehört dazu?
9. Welche wenigen Labels sind wirklich nötig?
10. Endet jede Animation oberhalb der Caption-Zone?
11. Ist alles smartphone-lesbar und geerdet?
```

**Verboten:** „Diese Animation haben wir schon, also benutzen wir sie irgendwie.“

Die Library wird erst nach der visuellen Mechanik geprüft. Sie ist Werkzeugkasten, nicht Quelle der kreativen Entscheidung.

## Entscheidungsreihenfolge für YouTube Longform

```text
1. Braucht das Thema wirklich mehrere zusammenhängende Schritte/Mechanismen?
2. Was ist das klare Versprechen des Videos?
3. Welche Kapitel ergeben einen logischen Erkenntnisweg statt bloßer Länge?
4. Welche bedeutungsgetriebenen Visual Beats braucht jedes Kapitel?
5. Wie wird jeder Beat mit REMOTION_NATIVE_MAXIMUM sichtbar erklärt?
6. Welche UI/Diagramme/Illustrationen müssen für 16:9 groß und lesbar sein?
7. Welche Grenzen/Fehler/Gegenposition gehören zwingend hinein?
8. Welche Schlussprüfung zeigt, dass das Versprechen wirklich eingelöst wurde?
9. Welches eigenständige Thumbnail ergänzt den Titel statt ihn nur zu wiederholen?
```

Aktueller Longform-Standard:

- 1920 × 1080
- 30 FPS
- 16:9
- finale Dauer nach echtem Voiceover 5:00–6:00 Minuten
- Produktion unter `ki/youtube-longform/`
- Source unter `ki/src/longform/`
- Thumbnail als eigene Remotion-Composition

## Visual Beat Contract

Jede bedeutungstragende Sprecherstelle erhält eine bewusste visuelle Reaktion. Die passende Einheit kann sein:

- Wort
- Phrase
- Halbsatz
- Satz
- zusammenhängende Satzgruppe

Nicht jedes Wort muss wackeln oder springen. Aber wenn sich die Bedeutung ändert, muss sich sichtbar Fokus, Zustand, Objektbeziehung oder Mechanik passend ändern.

Bei mehreren Aussagen innerhalb einer Szene oder eines Longform-Kapitels sind mehrere Micro-Animationen ausdrücklich erwünscht.

## Timeline Contract

Die finale Phase behandelt Stimme, Visual Beats, Animation, Pausen und Untertitel/Transcript-Timing als **eine gemeinsame Timeline**.

Grundsatz:

```text
Gesprochene Bedeutung
= sichtbarer Zustandswechsel
= Text-/Caption-Fokus, falls verwendet
= Beat-Timing
```

Phase 3 passt zuerst Animation/Holds/Szenen bzw. Kapitel an die echte Stimme an. Wenn eine einzelne Phrase danach noch zu schnell oder zu langsam wirkt, darf der Agent:

1. natürliche Pausen an Phrase-/Satzgrenzen leicht verändern
2. bei Bedarf die ganze Phrase / den ganzen Cue **pitch-erhaltend lokal retimen**

Dabei gilt:

- niemals Speedwechsel mitten im Wort
- keine abrupt hörbaren Sprünge
- Wortlaut/Reihenfolge bleiben unverändert
- bevorzugt `0.97x–1.03x`, bei echtem Bedarf bis ungefähr `0.94x–1.06x`
- stärkere Abweichung → neues Voiceover statt hörbarer Verzerrung
- finale Text-/Caption-Timestamps immer gegen das tatsächlich verwendete Audio synchronisieren

Short-Form wird nicht künstlich auf exakt 60,0 Sekunden gezwungen. Longform wird nicht durch unnatürliches Retiming in 5–6 Minuten gepresst; bei deutlicher Abweichung zurück zu Phase 2.

## Visual Hierarchy Short-Form

```text
ZWISCHENÜBERSCHRIFT + ICON
= oben mittig; kompakter Kapitel-/Kerngedanke
= komplette Überschrift in dunklem Marken-Lila #6E45C9
= Icon ebenfalls lila und deutlich sichtbar
= keine zusätzliche Unterzeile darunter

ANIMATION / BILD
= individuelle visuelle Erklärung des aktuellen Sprecher-Beats
= kritische Inhalte enden vollständig oberhalb der Caption-Zone

ANIMATIONSTEXT
= nur Objekt-/Zustandslabels, keine Satzkopie

UNTERTITEL / CAPTION
= unten in eigener sicherer Zone, ohne Hintergrundkarte
= exakt am final verwendeten Audio ausgerichtet
= nur aktueller Sprechfokus in Marken-Lila
= unterste inhaltliche Ebene des Videos
```

Interne Regie-, `goal`-, Debug- und Planner-Texte sind niemals Zuschauertext.

## Visual Hierarchy Longform

- Kapitelmarker kurz und sparsam statt permanenter großer Titel
- UI, Diagramme und Illustrationen groß genug für 16:9/Laptop/TV
- keine dauerhaft eingebrannten Volltext-Untertitel als Standard
- Animationstext nur für Objekt, Zustand, echte UI oder kurze Orientierung
- kein Transcript als Design-Ersatz
- pro Kapitel klare Zustandsentwicklung, aber keine Dauerbewegung ohne Erklärfunktion
- End-Hold vor Kapitelwechsel

## Harte Reel-Caption-Zone

Bei vertikalem 1080 × 1920 Short-Form gilt:

- ungefähr ab `y=1440` beginnt die reservierte Caption-/Bottom-Safe-Zone
- **unterhalb dieser Grenze darf keine Remotion-Animation sichtbar sein**
- keine Karte, Linie, Node, Partikel, Illustration oder Animationsbeschriftung hinter oder unter den Untertiteln
- Animation höher, kleiner oder individuell neu komponieren, wenn sie nicht in den oberen Bereich passt
- Untertitel nicht nach unten verdrängen
- die technische Production-Shell clippt als letzte Sicherung; sichtbares Abschneiden ist trotzdem ein Review-Fehler und muss im Layout behoben werden

Diese spezifische Caption-Zone gilt nicht als Longform-Layoutregel; dort gelten 16:9-Komposition, Titel-/Thumbnail-Verträge und realer Sichttest.

## Maximum-Remotion oder externes Asset?

**Maximum-Remotion zuerst.** Nicht nur UI, Diagramme und Prozesse, sondern auch Icons, Hero-Motive, Mockups, Cover, technische Illustrationen, visuelle Metaphern, pseudo-3D-Objekte und einfache Umgebungen werden so weit wie sinnvoll mit React/SVG/CSS/Canvas/WebGL/Remotion gebaut.

Wenn das Ergebnis zu flach wirkt, zuerst verbessern:

- Perspektive
- Layering
- Schatten
- Tiefe
- Materialwirkung
- Objektgröße
- Komposition
- Motion

Bestehende Library-Komponenten nur bei exaktem semantischem Fit nutzen; ansonsten formatspezifisch bauen.

Externe Bilder/Medien nur, wenn ein Motiv realistisch/organisch/physisch so komplex ist, dass Code klar schlechter wäre, und nur wenn das Asset tatsächlich bereitgestellt wurde. Keine künstlichen Assets erfinden.

## Markenakzent

- Hintergrund: weiß/nahezu weiß
- Text: `#1A1A2E`
- primärer KI-/Fokus-Akzent: `#B98CFF`
- Tiefe/Kontrast: `#6E45C9`
- Reel-Zwischenüberschrift: vollständig `#6E45C9`
- Grün: Vorteil/Lösung
- Rot: Risiko/Fehler/Grenze
- Blau: seltene Info-/Tech-Semantik

Lila wird gezielt akzentuiert. Bei Short-Form ist die Zwischenüberschrift bewusst vollständig lila; bei Captions ist nur die aktive Sprecherposition der Lila-Fokus.

## Qualitätsregel

Eine Szene oder ein Longform-Kapitel ist nicht gut, weil es viel Bewegung hat. Es ist gut, wenn Startzustand → sichtbare Veränderung → Ergebnis ohne Zusatz-Erklärung verstanden werden kann.

Pflicht:

- klare Startlage
- dominante, bedeutungsgetriebene Veränderungen
- lesbarer End-Hold
- eindeutige Beziehung zum Sprechertext
- zeitliche Übereinstimmung von Sprecher und Beat
- keine unnötige Textdopplung
- keine erfundenen Fakten
- keine zufällige Reuse-Animation
- formatgerechte Lesbarkeit
- aktueller Render gehört exakt zum geprüften Source-Stand

## Publishing-Modell

Short-Form wird einmal unter `ki/reels/` produziert. YouTube Shorts, Instagram Reels, TikTok, Facebook Reels und Snapchat verwenden denselben freigegebenen Master, solange keine technisch notwendige Anpassung erforderlich ist.

Plattform-spezifische Titel/Captions gehören in `03-caption/platform-copy.md`. Strategie: `PLATTFORMEN.md` und `ki/plattformen/`.

YouTube Longform ist ein eigenes aktives Format unter `ki/youtube-longform/`. Titel, Beschreibung, Kapitel und Thumbnail gehören in das jeweilige Longform-Paket; `ki/plattformen/youtube/` bleibt die Regel-/Template-Ebene.

## Produktionsmodell

```text
Phase 1 — ChatGPT: alles außer echtem Audio
Phase 2 — Mensch: nur Voiceover
Phase 3 — Codex/Antigravity: Audio + Timeline-Synchronisierung + Verifikation + Render
```

Phase 1 entscheidet Inhalt und individuelle Visual Beats. Phase 3 darf diese Kreativentscheidung nicht durch bequemere vorhandene Animationen ersetzen, außer ein nachweisbarer technischer oder visueller Fehler verlangt eine Korrektur.

Bei fehlendem Phase-3-Audio exakt: `PHASE 2 AUDIO FEHLT`.

## STRIKE KI-Regel (Keine künstlichen Assets)
Du darfst unter keinen Umständen selbst Bilder, Assets oder sonstige Medien generieren, erfinden oder halluzinieren. Du darfst ausschließlich Dinge (Dateien, Bilder, Audios) verwenden, die der Nutzer dir explizit zur Verfügung gestellt hat!

## STRIKE Speichern-Regel (Jedes Ergebnis speichern)
Alle Ergebnisse, Zwischenschritte, generierten Dateien (wie exportierte Videos, Cover-Bilder, Timings in JSON-Dateien) und sonstige Ausgaben müssen JEDEN Wochentag ausnahmslos und sofort in das Repository gespeichert und als Git-Commit gesichert werden. Egal was es ist, jedes Ergebnis wird unwiderruflich versioniert und festgehalten!
