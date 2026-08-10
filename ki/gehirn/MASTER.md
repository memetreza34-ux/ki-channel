# 🧠 KI-Channel — MASTER-GEHIRN

Diese Datei verbindet Identität, Reel-Logik, Bildstil, Plattformen und Produktionsablauf zu einem einzigen Entscheidungsrahmen.

## Autoritative Quellen

1. `REPO-STATE.md` — Repository-Wahrheit und Branch
2. `AGENTS.md` / `ki/AGENTS.md` — technische und strukturelle Regeln
3. **diese Datei** — kanalweite Entscheidungslogik
4. `KANAL.md` — Identität, Zielgruppe, Ton
5. `REELS.md` — Reel-Struktur, Text-Hierarchie, Visualisierung
6. `PLATTFORMEN.md` — Publishing und YouTube/Instagram/TikTok/Facebook/Snapchat
7. `PRODUKTIONSABLAUF.md` — Phase 1/2/3
8. `../BILDSTIL.md` — Bild- und Prompt-Qualität
9. named reel package — konkrete Inhalte

Wenn zwei ältere Dokumente kollidieren, gilt diese Reihenfolge. Nicht raten.

## Kernziel

> Komplexe KI so erklären, dass ein normaler deutschsprachiger Zuschauer den Mechanismus innerhalb weniger Sekunden versteht — visuell stark, sachlich geerdet und ohne Hype-Lärm.

## Kanalprinzipien

- deutsch
- vollständig faceless
- verständlich vor technisch beeindruckend
- Nutzen/Aha vor Feature-Liste
- Wahrheit vor Reichweitenversprechen
- ein kanonischer Content-Master; Plattformen sind Packaging, keine zweite Produktionswahrheit
- Short-Form-Skripte standardmäßig ausführlicher: ungefähr 50–60 Sekunden statt unnötig kurz

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

## Visual Beat Contract

Jede bedeutungstragende Sprecherstelle erhält eine bewusste visuelle Reaktion. Die passende Einheit kann sein:

- Wort
- Phrase
- Halbsatz
- Satz
- zusammenhängende Satzgruppe

Nicht jedes Wort muss wackeln oder springen. Aber wenn sich die Bedeutung ändert, muss sich sichtbar Fokus, Zustand, Objektbeziehung oder Mechanik passend ändern.

Bei mehreren Aussagen innerhalb einer Szene sind mehrere Micro-Animationen ausdrücklich erwünscht.

## Timeline Contract

Die finale Phase behandelt Stimme, Visual Beats, Animation, Pausen und Untertitel als **eine gemeinsame Timeline**.

Grundsatz:

```text
Gesprochene Bedeutung
= sichtbarer Zustandswechsel
= Caption-Fokus
= Beat-Timing
```

Phase 3 passt zuerst Animation/Holds/Szenen an die echte Stimme an. Wenn eine einzelne Phrase danach noch zu schnell oder zu langsam wirkt, darf der Agent:

1. natürliche Pausen an Phrase-/Satzgrenzen leicht verändern
2. bei Bedarf die ganze Phrase / den ganzen Cue **pitch-erhaltend lokal retimen**

Dabei gilt:

- niemals Speedwechsel mitten im Wort
- keine abrupt hörbaren Sprünge
- Wortlaut/Reihenfolge bleiben unverändert
- bevorzugt `0.97x–1.03x`, bei echtem Bedarf bis ungefähr `0.94x–1.06x`
- stärkere Abweichung → neues Voiceover statt hörbarer Verzerrung
- Captions/Wort-Timestamps immer gegen das final verwendete Audio neu synchronisieren

**Perfekte Timeline heißt nicht exakt 60,0 Sekunden.** Sie heißt: Stimme klingt natürlich und alle visuellen Beats treffen die gemeinte Sprecherstelle präzise.

## Visual Hierarchy

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

## Harte Reel-Caption-Zone

Bei vertikalem 1080 × 1920 Short-Form gilt:

- ungefähr ab `y=1440` beginnt die reservierte Caption-/Bottom-Safe-Zone
- **unterhalb dieser Grenze darf keine Remotion-Animation sichtbar sein**
- keine Karte, Linie, Node, Partikel, Illustration oder Animationsbeschriftung hinter oder unter den Untertiteln
- Animation höher, kleiner oder individuell neu komponieren, wenn sie nicht in den oberen Bereich passt
- Untertitel nicht nach unten verdrängen
- die technische Production-Shell clippt als letzte Sicherung; sichtbares Abschneiden ist trotzdem ein Review-Fehler und muss im Layout behoben werden

## Remotion oder Bild?

**Remotion zuerst**, wenn die Aussage mit UI, Diagramm, Prozess, Vergleich, Daten, Text, Karten, Pfeilen, Netzwerk oder Motion-Mechanismus klar erklärt werden kann.

Dabei zuerst eine **inhaltsspezifische Mechanik** entwerfen. Bestehende Library-Komponenten nur bei exaktem Fit nutzen; ansonsten reel-spezifisch bauen.

**Bild-KI**, wenn eine hochwertige räumliche 3D-Editorial-Szene, Objektgruppe oder Alltagssituation die Aussage deutlich besser und schneller verständlich macht.

Kein Bild nur, weil ein Bild hübsch aussieht.

## Markenakzent

- Hintergrund: weiß/nahezu weiß
- Text: `#1A1A2E`
- primärer KI-/Fokus-Akzent: `#B98CFF`
- Tiefe/Kontrast: `#6E45C9`
- Reel-Zwischenüberschrift: vollständig `#6E45C9`
- Grün: Vorteil/Lösung
- Rot: Risiko/Fehler/Grenze
- Blau: seltene Info-/Tech-Semantik

Lila wird gezielt akzentuiert. Die Zwischenüberschrift ist bewusst vollständig lila; bei Untertiteln ist nur die aktive Sprecherposition der Lila-Fokus.

## Qualitätsregel

Eine Szene ist nicht gut, weil sie viel Bewegung hat. Sie ist gut, wenn Startzustand → sichtbare Veränderung → Ergebnis ohne Erklärung neben dem Video verstanden werden können.

Jede Szene braucht:

- klare Startlage
- eine dominante Veränderung pro Visual Beat
- lesbaren End-Hold
- eindeutige Beziehung zum Sprechertext
- zeitliche Übereinstimmung von Sprecher, Beat und Caption
- keine unnötige Textdopplung
- keine erfundenen Fakten
- keine zufällige Reuse-Animation
- keine Animation in oder unter der Caption-Zone

## Publishing-Modell

Short-Form wird einmal unter `ki/reels/` produziert. YouTube Shorts, Instagram Reels, TikTok, Facebook Reels und Snapchat verwenden denselben freigegebenen Master, solange keine technisch notwendige Anpassung erforderlich ist.

Plattform-spezifische Titel/Captions gehören in `03-caption/platform-copy.md`. Strategie: `PLATTFORMEN.md` und `ki/plattformen/`.

YouTube Longform ist ein eigenes Format und darf nicht automatisch aus Reels aufgeblasen werden.

## Produktionsmodell

```text
Phase 1 — ChatGPT: alles außer echtem Audio
Phase 2 — Mensch: nur Voiceover
Phase 3 — Codex/Antigravity: Audio + Timeline-Synchronisierung + Verifikation + Render
```

Phase 1 entscheidet Inhalt und individuelle Visual Beats. Phase 3 darf diese Kreativentscheidung nicht durch bequemere vorhandene Animationen ersetzen, außer ein nachweisbarer technischer oder visueller Fehler verlangt eine Korrektur.
