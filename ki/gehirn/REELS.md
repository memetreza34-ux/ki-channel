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

### Zwischenüberschrift oben

- pro Szene genau eine kurze Zwischenüberschrift, normalerweise 3–7 Wörter
- **oben mittig** statt linksbündiger großer Headline
- direkt mit einem **semantisch passenden Icon** kombinieren
- Icon und Zwischenüberschrift bilden zusammen einen kompakten Kapitelmarker
- die komplette Zuschauer-Zwischenüberschrift ist **Lila**, bevorzugt dunkles Marken-Lila `#6E45C9`
- das Icon ist ebenfalls lila, visuell deutlich genug und etwas größer als ein normales UI-Icon
- Richtwert bei 1080 × 1920: Icon-Container ungefähr 68–76 px, Icon selbst ungefähr 38–44 px
- keine zweite Unterzeile direkt unter der Zwischenüberschrift
- keine lange Erklärung im Header
- niemals interner `goal`, Planner-, Debug- oder Regietext
- Zwischenüberschrift ordnet die Szene ein, sie kopiert nicht den gesprochenen Satz

### Untertitel unten

- Untertitel decken den gesprochenen Text vollständig ab
- **kein weißer Kasten, keine Caption-Card, kein flächiger Hintergrund**
- Text steht frei auf dem Bild und erhält nur so viel Schatten/Outline, wie für Lesbarkeit nötig ist
- Untertitel liegen in einer sicheren unteren Zone, **nicht am unteren Bildschirmrand**
- bei 1080 × 1920 gilt als Produktionsrichtwert: kritischen Untertiteltext ungefähr 240–380 px über dem unteren Rand halten
- links/rechts mindestens ungefähr 70 px Sicherheitsabstand
- Untertitel sind klarer Sans-Serif-Text, keine dekorative Serifenschrift
- aktives Wort bzw. aktive Wortgruppe wird synchron zum Sprecher in Marken-Lila hervorgehoben
- bereits gesprochene Wörter bleiben normal dunkel; nur der aktuelle Sprechfokus wird lila
- mit echtem Audio in Phase 3 echte Cue-/Wort-Timestamps an das Voiceover anpassen; nur proportional geschätzte Wortzeiten sind niemals die finale Freigabe
- aktive Textfenster kompakt halten und auf dem Smartphone schnell erfassbar machen

### Animationstext

- 0–3 kurze Labels als Standard
- benennt Objekt, Zustand oder Kategorie
- keine Satzkopie des Voiceovers
- keine langen Erklärsätze

### Verbotene Dopplung

Nicht gleichzeitig denselben Gedanken als Zwischenüberschrift + zusätzliche Unterzeile + Animationssatz + Untertitel zeigen.

```text
Sprecher = Aussage
Untertitel = sprachliche Lesbarkeit + Sprechersynchronität
Animation = visuelle Erklärung
Zwischenüberschrift + Icon = Kapitel/Kerngedanke
```

## Safe Zones — 1080 × 1920

Die Plattform-UI und die Untertitel dürfen keine wichtigen Animationsteile verdecken.

Als dauerhafte Produktionsrichtlinie:

- keine kritische Schrift direkt am oberen Rand
- Zwischenüberschrift + Icon kompakt im oberen sicheren Bereich platzieren
- seitlich mindestens ca. 70 px Luft für kritischen Text
- unteren Bereich von ungefähr 0–220 px nicht für wichtige Untertitel oder Kernlabels verwenden
- Untertitel bevorzugt oberhalb dieser No-Go-Zone platzieren
- **kritische Remotion-Animationen und deren wichtige Labels müssen oberhalb des Untertitelbereichs enden**
- bei 1080 × 1920 kritische Animationslabels möglichst nicht tiefer als ungefähr y=1450 platzieren
- zwischen Hauptanimation und Untertitel möglichst ungefähr 80–120 px sichtbare Luft lassen
- Library-Animationen im Production-Shell werden standardmäßig etwas nach oben versetzt; nicht zusätzlich blind doppelt verschieben
- wenn ein Mechanismus trotzdem in die Caption-Zone ragt, zuerst Animation höher setzen oder leicht kompakter machen statt Untertitel nach unten zu drücken
- Hauptanimation darf nicht dauerhaft von Untertiteln verdeckt werden
- dekorative Fortschrittsleisten oder andere UI direkt am unteren Rand sind im Production-Reel zu vermeiden

Vor finaler Freigabe zusätzlich den tatsächlichen Plattform-Crop bzw. die UI-Safe-Zone visuell prüfen.

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
- Remotion baut Zwischenüberschrift + Icon, Untertitel, Zahlen, Pfeile, Diagramme und präzise Labels

Wenn kein Bild: `BILDER NICHT ERFORDERLICH` dokumentieren. Keine Füllbilder.

## Brand

- 1080 × 1920 / 30 FPS als Standard
- weiß/hell
- dunkler Fließ-/Animations-Text
- Marken-Lila `#B98CFF`
- dunkles Lila `#6E45C9` für Zwischenüberschrift und aktiven Fokus
- faceless
- Smartphone zuerst

## Fakten und Grounding

- sichtbare Zahlen nur, wenn Sprechertext/Quelle sie trägt
- Gewinner/Ranking/Prozent nur bei echter Grounding-Grundlage
- illustrative interne Motion-Werte dürfen nicht als Fakten sichtbar werden
- Sprechertext → Meaning Contract → derive → sanitize → associate → Render-Props

## Qualitätsgate

Vor Freigabe tatsächlich prüfen:

- Zwischenüberschrift oben mittig, vollständig lila und mit deutlich lesbarem passendem Icon
- keine zusätzliche Header-Unterzeile
- Untertitel ohne Hintergrundkarte
- Untertitel nicht zu tief und nicht von Plattform-UI gefährdet
- aktive lila Hervorhebung folgt dem echten Sprecher
- Hauptanimation und wichtige Animationslabels enden sichtbar oberhalb der Untertitelzone
- keine abgeschnittene Schrift
- keine Zwischenüberschriften-/Caption-/Visual-Überlappung
- keine internen Regietexte sichtbar
- keine unnötige Textdopplung
- keine leere erste Sekunde
- klarer End-Hold
- mobile Lesbarkeit
- Motion passt semantisch
- Bilder frei von Wasserzeichen, Prompttext, zufälliger Schrift und Gesichtern
- finale MP4 normal abspielen und ansehen
