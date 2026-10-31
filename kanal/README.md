# Kanal

```text
youtube/<Montag>_bis_<Sonntag>/<thema>/
  audio/    script.txt zum 1:1-Vorlesen · Aufnahme hier rein
  export/   cover.png · video.mp4 · caption.txt (Titel, Beschreibung, Kapitel, Quellen, 5 Hashtags) · untertitel-zeitstempel.txt
```

Phase 1: Claude legt den Ordner an und schreibt `audio/script.txt`.
Phase 2: Arman legt die Aufnahme in `audio/`.
Phase 3: Claude baut das Video im Studio (`studio/projekte/<thema>/`) und füllt `export/`.

## Branding

`branding/profilbild.png` (800×800, YouTube schneidet rund) · `branding/banner.png` (2560×1440, wichtiger Inhalt in der Mitte 1546×423). Quelle: `studio/projekte/kanal-look/Kanalbild.tsx` → `npm run still -- Kanal-Profilbild` / `npm run still -- Kanal-Banner --scale=1.3334`. Kanalname noch offen – kommt später ins Banner.
