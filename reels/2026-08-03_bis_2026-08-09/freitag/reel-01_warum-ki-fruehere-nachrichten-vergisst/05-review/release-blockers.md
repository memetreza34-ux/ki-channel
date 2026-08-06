# Release-Blocker

Ein Release ist blockiert, solange mindestens einer dieser Punkte zutrifft:

- `final-sync.json` ist `planned-placeholder`
- finale Audiodatei fehlt
- Wort-Transcript fehlt
- Wort-für-Wort-Unterti tel sind aktiv
- Untertitel liegen außerhalb 210–235 px
- Triggerabweichung liegt über 5 Frames
- Szenengrenzenabweichung liegt über 6 Frames
- Schluss-Hold liegt außerhalb 1,2–2,2 Sekunden
- TypeScript oder Tests fehlen
- aktueller Kontaktbogen wurde nicht geprüft
- aktuelles MP4 wurde nicht normal und in Smartphone-Größe angesehen
- Nutzerfreigabe fehlt