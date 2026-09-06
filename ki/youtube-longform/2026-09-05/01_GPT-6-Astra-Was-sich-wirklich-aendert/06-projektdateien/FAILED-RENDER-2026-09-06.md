# Fehlrender-Analyse — 2026-09-06

Status: **REJECTED / NEGATIVE REGRESSION FIXTURE**

Quelle der Analyse: vom Nutzer hochgeladene Datei `GPT6-Astra.mp4`. Diese Datei liegt nicht als kanonisches Produktionsartefakt im Repository und darf nicht weiterverwendet werden.

## Gemessene technische Probleme

- Container-Dauer: ca. **203,35 s** / 3:23
- hörbarer Audioinhalt endet ungefähr bei **118,8 s**
- daraus ca. **84,5 s Tail-Stille**
- Videobitrate nur ca. **141 kbit/s** bei 1920x1080
- Integrated Loudness ca. **-21 LUFS**
- True Peak ca. **+4,72 dBTP**
- Pixelformat im Fehlrender: `yuvj420p` statt Ziel `yuv420p`

## Erkannte statische Segmente

Ungefähr:

- 0,00–33,33 s → 33,33 s
- 33,33–66,67 s → 33,33 s
- 66,67–133,33 s → 66,67 s
- 133,33–166,67 s → 33,33 s
- 166,67–203,35 s → 36,68 s

Das entspricht praktisch einer Kapitel-/Slide-Struktur mit sehr langen unveränderten Zuständen und ist für den geplanten Longform-Stil nicht akzeptabel.

## Visuelle Probleme

- sichtbare Platzhalter wie `Astra praktisch Visual`
- sichtbarer Platzhalter `Payoff Visual`
- praktisch keine reale B-Roll
- geplanter Visual-World-Wechsel nicht umgesetzt
- wiederholtes/fiktiv wirkendes Astra-Webseiten-Mockup statt belastbarer offizieller Evidence
- leere weiße Flächen
- Kapitelüberschriften/Visuals teilweise kollidierend
- zu wenig sichtbare Zustandsentwicklung

## Pipeline-Ursache

Der damalige Ablauf konnte einen Prototype rendern, obwohl:

- Voice-Lock nicht als harter Pre-Render-Gate erzwungen wurde
- Media-Plan noch nicht lokal materialisiert war
- Source im kanonischen Branch nur als README-Grundlage vorlag
- kein verpflichtender Render-Lock existierte
- keine Freeze-/Tail-Silence-/Loudness-Prüfung nach dem Render erzwungen wurde
- Kontaktbogen und kompletter 1x-Review nicht technisch an den Master gebunden waren

## Neue Schutzmaßnahmen

Der Fehler führte direkt zu folgenden neuen Gates:

1. `check-ki-longform-render-readiness.mjs`
2. `create-ki-longform-render-lock.mjs`
3. `render-ki-longform-master.mjs`
4. `check-ki-longform-master.mjs`
5. SHA-gebundener finaler Release-Gate
6. automatischer Kontaktbogen
7. Regressionstest für statische/zu niedrig komprimierte/Tail-Silence-Master

## Lokaler Gate-Test gegen den hochgeladenen Fehlrender

Die neu entwickelte Master-QA-Logik wurde lokal gegen die hochgeladene MP4 ausgeführt und lehnte sie mit **10 Fehlern** ab, darunter:

- falsches Pixelformat
- extrem niedrige Videobitrate
- 84,5 s Tail-Stille
- fünf lange Freeze-/Static-Segmente
- Loudness außerhalb Ziel
- True Peak deutlich zu hoch

Das ist das gewünschte Verhalten.

## Konsequenz

Der nächste Astra-Render wird **komplett neu aus dem echten Voiceover, real materialisierten Assets und finalem TSX-Source gebaut**. Der Fehlrender ist kein Ausgangspunkt für Patch-/Weiterarbeit, sondern ausschließlich ein Regressionstest dafür, was künftig blockiert werden muss.
