# Audio Generation

**Status:** AUDIO ERZEUGT UND DIREKT INTEGRIERT

- Sprache: Deutsch
- Voice: synthetische deutsche Männerstimme (`de+m3`)
- Tempo: ungefähr 198 WPM
- Rohproduktion: satzweise TTS, damit Satzgrenzen messbar bleiben
- Mastering: Highpass 75 Hz, Lowpass 12 kHz, leichte Kompression, Loudness-Ziel ca. -16 LUFS / -1.5 dBTP
- Zielformat: MP3, mono, 48 kHz, 96 kbit/s
- gemessene Master-Dauer: **54.432 s**

## Timing-Methode

Die zehn Sätze wurden separat synthetisiert und anschließend in unveränderter Reihenfolge zusammengefügt. Dadurch sind die Satzgrenzen direkt messbar. Wortgrenzen wurden innerhalb der Satzsegmente mit den tatsächlich erzeugten Audiodaten angenähert: erkannte kurze Sprechpausen/Word-Gaps wurden mit per-Wort-TTS-Dauern als Alignment-Prior kombiniert.

Das ist für dieses direkt erzeugte, deterministische TTS präziser als eine gleichmäßige Zeichenverteilung. `03-caption/subtitle-cues.json` enthält die resultierenden Wortframes.

Wenn später eine andere Stimme verwendet wird, sind Audio, Worttimings, Szenengrenzen und Visual Trigger vollständig neu zu alignen.
