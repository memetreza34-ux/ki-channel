# Post-Render Diagnosis — KI-ChatGPTForTeens

## Geprüfter Render

Datei beim Nutzer: `KI-ChatGPTForTeens.mp4`

Technisch gemessen:

- 1080 × 1920
- 30 FPS
- Dauer ca. 54.827 s
- H.264 Video
- AAC Audio, 48 kHz Stereo
- mean volume ca. -21.5 dB
- max volume ca. -4.7 dB

Audio ist technisch vorhanden. Diese Diagnose bewertet primär die **semantische visuelle Integrität**.

## Ergebnis

**FAILED — VISUALS ERKLÄREN MEHRFACH EIN ANDERES THEMA**

## Zeitliche Diagnose

### ca. 0–8 s

Gesprochener Kontext: ChatGPT / Teen-Modus.

Sichtbar:

- Phone mit `NOVA`
- Prompt `Mach daraus Werbung`
- Produkt-/Luxuskarte

Bewertung: **komplett falscher visueller Kontext**.

### ca. 9–22 s

Gesprochener Kontext: Altersschätzung / Teen Experience.

Sichtbar:

- `PRODUKT`
- `ZIELGRUPPE`
- `STIMMUNG`
- `CREATIVE BRIEF`
- Prozessschritte wie `Einstieg`, `Produkt`, `Nutzen`, `Detail`, `Abschluss`

Bewertung: **Werbe-/Creative-Brief-Visualisierung statt Altersschätzung**.

### ca. 26–37 s

Gesprochener Kontext: Teen-Modus / Study Mode / Lernen.

Sichtbar:

- mehrere `NOVA`-Produktkarten
- `Hero`, `Nutzen`, `Detail`, `Finale`
- `Produkt bleibt konsistent ✓`

Bewertung: **Produktwerbe-Pipeline statt Lernmechanik**.

### ca. 41 s

Gesprochener Kontext: Schutz / Pause.

Sichtbar:

- `KEYFRAME → MOTION`
- Produktions-/Animationsphasen

Bewertung: **inhaltlich nicht zuordenbar**.

### ca. 46–54 s

Gesprochener Kontext: Elternkontrollen / Chat-Privatsphäre.

Sichtbar:

- `WERBECLIP-CHECK`
- `WORKFLOW`
- Labels `Logo`, `Text`, `Produkt`, `Übergang`

Bewertung: **anderes Reel / andere Pipeline**.

## Root Cause

Der Render scheint generische bzw. bereits vorhandene Produktions-/Werbevisuals als Ersatz für fehlende Teen-spezifische Szenen zu verwenden.

Das verletzt zwei Kernregeln:

1. `REUSE_EXACT` ist nur bei exaktem semantischem Fit zulässig.
2. Product/UI-first bedeutet nicht irgendeine UI, sondern die **inhaltlich richtige UI für genau das aktuelle Produkt und Feature**.

## Neue harte Regel aus diesem Fehler

Ein Reel darf nicht anhand von Bewegung oder optischer Sauberkeit freigegeben werden, solange nicht zusätzlich ein **Semantic Visual Audit** bestanden ist.

Für jedes sichtbare Label, Objekt und jede Hauptmechanik muss mindestens eine konkrete Sprecherphrase benannt werden können, die dieses Element erklärt.

Nicht zuordenbare sichtbare Elemente gelten als Fremdmaterial und blockieren die Freigabe.

## Rebuild-Entscheidung

Kein kosmetischer Patch.

**Alle fünf Hauptvisuals neu bauen.**

Das Voiceover/Skript kann separat weiterverwendet werden, sofern inhaltlich korrekt und gewünscht. Die aktuelle visuelle Implementierung gilt nicht als Basis für die nächste Fassung.
