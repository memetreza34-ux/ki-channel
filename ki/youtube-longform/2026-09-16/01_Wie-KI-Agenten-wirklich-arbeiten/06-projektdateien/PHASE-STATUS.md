# Produktionsstatus — Wie KI-Agenten wirklich arbeiten

## Phase 1 — Planung und Source

**Status:** ABGESCHLOSSEN

## Phase 2 — Audio

**Status:** ABGESCHLOSSEN

`01-script-audio/voiceover.mp3`, 336,5 Sekunden, 779 Wörter.

Transkription mit Wort-Timestamps liegt unter
`01-script-audio/transcript/voiceover.json` (Whisper `medium`, deutsch,
`--word_timestamps True`). Sie ist die Grundlage für die gesamte Bildtaktung
und wird gebraucht, um das Video zu bauen — nicht nur einmalig.

Erzeugt mit:

```bash
python3 -m whisper 01-script-audio/voiceover.mp3 --model medium --language de \
  --word_timestamps True --output_format json --output_dir 01-script-audio/transcript
```

## Phase 3 — Bild und Schnitt

**Status:** NEU GEBAUT (2026-09-18)

### Warum neu gebaut

Die erste Fassung hatte zu wenig Bewegung. Gemessen: jedes Bild fuhr in 24
Frames ein und stand danach bis zu 1200 Frames still. Bei neun Bildern je
Kapitel waren rund 200 von 1200 Frames bewegt — über 80 Prozent der Laufzeit
war ein Standbild, das sich langsam füllte. Kapitel 1 stand nach Frame 463
volle 8,5 Sekunden unverändert.

### Was jetzt anders ist

- **Sprech-Signal** (`speech.ts`): aus den Wort-Timestamps entsteht ein
  fortlaufendes Signal — Impuls auf jedem Wort, Sprech-Energie, Satzfortschritt.
  Daran hängen die Bilder, statt nur an ihrem Auftrittsframe.
- **Drei Zustände je Bild** (`LiveScene.tsx`): wartend, aktiv, gesetzt. Das
  aktive Bild pulst mit der Stimme mit, gesetzte treten zurück und atmen weiter.
  Der Fokus wandert mit dem Sprecher durch das Bild.
- **Wortsynchroner Text**: Zitate und Kartentexte entstehen Wort für Wort im
  Takt der echten Stimme.
- **Phasen**: Kapitel bestehen aus mehreren Tafeln. Eine neue Tafel räumt die
  vorige als verkleinerte Leiste nach oben ab. Dadurch passen deutlich mehr
  Bilder in ein Kapitel, und alle paar Sekunden bewegt sich das ganze Bild.
- **Laufende Mechanik**: Punkte auf Verbindungen, drehende Agenten-Schleifen,
  Balken, die mit dem Satz wachsen.

### Drei Fehler, die dabei aufgefallen und behoben sind

1. **Kapitelgrenzen lagen auf runden Zahlen** (720, 1770, 2970 …) statt auf
   Sprechpausen. Kapitel 2 begann 14 Sekunden bevor der Sprecher es anfing; die
   Verschiebung zog sich durch das ganze Video. Bilder erklärten Sätze, die erst
   später kamen. Die Grenzen kommen jetzt aus der Transkription
   (`scripts/derive-longform-chapters.mjs`).
2. **Der zehnte Absatz hatte kein Kapitel.** „Das wichtigste mentale Modell …"
   lief stumm unter „Wann ein Agent sinnvoll ist" mit. Es gibt jetzt Kapitel 10
   („Das mentale Modell").
3. **Das Video war kürzer als das Voiceover.** 10020 Frames gegen 10096 Frames
   letztes gesprochenes Wort — der Schluss wurde abgeschnitten. Jetzt 10151
   Frames.

### Bilder hängen an Wörtern, nicht an Zahlen

In `chapterScenes.ts` steht kein Frame mehr, sondern das gesprochene Wort:

```ts
{on: 'Aktionen ausführen', kind: 'chip', text: 'AKTIONEN AUSFÜHREN'}
```

`anchor.ts` löst das zur Laufzeit in einen Frame auf. Verschiebt sich die
Aufnahme, verschiebt sich das Bild mit. Vertippte oder im Kapitel nicht
gesprochene Ankerwörter lässt der Test `anchor.test.ts` durchfallen.

### Abgesicherte Regeln (`npx vitest run ki/src/longform/agent-loop-explained`)

- jedes Ankerwort wird im eigenen Kapitel wirklich gesprochen
- kein Kapitel beginnt mitten in einem Wort
- kein Kapitel startet mit mehr als 2,6 Sekunden Leerbild
- nirgends vergehen mehr als 9 Sekunden ohne neues Bild
- im Schnitt unter 5 Sekunden je Bild
- das Voiceover läuft vollständig aus

## Offen

- Thumbnail rendern (`KI-Longform-AgentLoop-Thumbnail`)
- Review-Checkliste durchgehen
- finale Kapitel-Timestamps in `04-metadata/youtube.md` eintragen

## Lokale Vorbedingung für den Render

Die Reel-Voiceover unter `ki/reels/**/01-script-audio/` sind gitignored und in
frischen Arbeitskopien nicht vorhanden. `ki/src/Root.tsx` importiert sie hart,
sodass ein fehlendes File das gesamte Remotion-Bundle bricht — auch für dieses
Longform-Video. Fehlen sie, legt man stille Platzhalter an:

```bash
ffmpeg -f lavfi -i anullsrc=r=44100:cl=mono -t 45 -c:a aac <pfad>/voiceover.mp4
```
