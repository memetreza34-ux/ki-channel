# 📱 KI-Kanal — Reel-Gehirn

## Ziel

Ein Reel erklärt **eine** KI-Idee mit einem klaren Spannungsbogen und einem sichtbaren Mechanismus. Kein Mini-Vortrag, keine Feature-Liste.

Typische Länge: 15–45 Sekunden, maximal 60 Sekunden, sofern der konkrete Reel-Vertrag nichts anderes festlegt.

## Spannungsbogen

```text
HOOK      Reibung, Frage oder überraschender wahrer Effekt
EINSATZ   warum betrifft das den Zuschauer?
MECHANIK  Ursache / Ablauf / Vergleich sichtbar machen
AHA       klare Einordnung oder Ergebnis
ENDE      kurzer Hold; CTA nur wenn natürlich
```

## Szenenregel

Jede Szene braucht genau einen dominanten Erklärgedanken:

```text
Startzustand
→ sichtbare Veränderung
→ Ergebniszustand
```

Wenn die Bewegung keinen Inhalt erklärt, entfernen.

## Text-Hierarchie — keine Dopplung

### Überschrift

- 3–7 Wörter
- natürliche Zuschauer-Sprache
- ordnet die Szene ein
- niemals interner `goal`, Planner- oder Regietext

### Caption

- deckt den gesprochenen Text vollständig ab
- mit echtem Audio finale Wort-/Cue-Timestamps verwenden
- aktive Fenster kompakt halten, normalerweise 7–10 Wörter

### Animationstext

- 0–3 kurze Labels als Standard
- benennt Objekt, Zustand oder Kategorie
- keine Satzkopie des Voiceovers
- keine langen Erklärsätze

### Verbotene Dopplung

Nicht gleichzeitig denselben Gedanken als Überschrift + Unterzeile + Animationssatz + Caption zeigen. Der Sprecher sagt, die Caption macht lesbar, die Animation erklärt, die Überschrift ordnet ein.

## Visualisierung

Bevorzugte Reihenfolge:

1. passende production-ready Library-Animation
2. vorhandene Low-Level-Primitives
3. reel-spezifischer New-Build
4. Bild/Hybrid, wenn räumliche/illustrative Komplexität echten Mehrwert bringt

Keine generische Animation nur wegen Wiederverwendung. Keine komplette Animation zweimal im selben Reel.

## Bewegungsqualität

- eine dominante Bewegung pro Satz
- maximal drei starke gleichzeitige Bewegungen
- öffnender Zustand muss sofort lesbar sein
- Endzustand braucht Hold
- Hard Cut ist Standard
- Übergang nur bei echter Objekt-/Form-/Zustandskontinuität
- Zoom nur bei tatsächlichem Fokuswechsel
- keine dekorativen Partikel-/Glow-Schichten als Ersatz für Inhalt

## Bilder

Bildbedarf in Phase 1 ausdrücklich entscheiden.

Wenn Bild:

- `ki/BILDSTIL.md` anwenden
- Prompt unter `02-bilder/image-prompts.md`
- Asset in `asset-manifest.json`
- Bild-KI baut 3D-/räumliche Szene
- Remotion baut Überschrift, Caption, Zahlen, Pfeile, Diagramme und präzise Labels

Wenn kein Bild: `BILDER NICHT ERFORDERLICH` dokumentieren. Keine Füllbilder.

## Brand

- 1080 × 1920 / 30 FPS als Standard
- weiß/hell
- dunkler Text
- Marken-Lila `#B98CFF`
- faceless
- Smartphone zuerst

## Fakten und Grounding

- sichtbare Zahlen nur, wenn Sprechertext/Quelle sie trägt
- Gewinner/Ranking/Prozent nur bei echter Grounding-Grundlage
- illustrative interne Motion-Werte dürfen nicht als Fakten sichtbar werden
- Sprechertext → Meaning Contract → derive → sanitize → associate → Render-Props

## Qualitätsgate

Vor Freigabe tatsächlich prüfen:

- keine abgeschnittene Schrift
- keine Überschriften-/Caption-/Visual-Überlappung
- keine internen Regietexte sichtbar
- keine unnötige Textdopplung
- keine leere erste Sekunde
- klarer End-Hold
- mobile Lesbarkeit
- Motion passt semantisch
- Bilder frei von Wasserzeichen, Prompttext, zufälliger Schrift und Gesichtern
- finale MP4 normal abspielen und ansehen
