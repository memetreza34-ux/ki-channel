---
name: erklaervideo
description: Produziert ein Video im Studio dieses Repos – Erklärvideo, Reel/Short/TikTok, YouTube-Video oder Werbung – von der Idee bis zum MP4 mit Remotion. Verwenden, sobald Arman ein Video, Reel, Short, eine Animation, Werbung oder eine Szene haben will oder ein bestehendes Studio-Video verbessern möchte ("mach ein Video über …", "Reel zu …", "Werbung für …", "die Animation sieht schlecht aus", "Voiceover liegt drin").
---

# Erklärvideo produzieren

Zuerst `studio/CLAUDE.md` lesen – dort stehen Ablauf, Gestaltungsregeln und alle Bausteine.

## Kanal-Videos (YouTube): immer in drei Phasen

1. **Phase 1 – nur Skript, keine Animation:** Thema, Recherche (Fakten mit Quelle + Datum), `studio/projekte/<thema>/skript.md` mit Szenenplan und **Themen-Welt** (Kanal-Look + passende Requisiten, Toki-Accessoire). Ordner `kanal/youtube/<Mo>_bis_<So>/<thema>/` anlegen, `audio/script.txt` (nur Sprechtext, 1:1 kopierbar) + `audio/LIES-MICH.txt`. Dann aufhören und auf Armans Audio warten.
2. **Phase 2 – Arman:** legt seine Aufnahme in `audio/`. Nie eine eigene/synthetische Stimme bauen.
3. **Phase 3 – Video aus dem Audio:** säubern + zusammensetzen → `npm run untertitel` → Absätze im Audio finden → Szenen wortgenau auf die Stimme bauen. **Keine Musik**, nur leise Sounds. Regeln aus „Gelernt beim zweiten Video“ beachten (erste 30 s alle 2–3 s Bewegung, Toki ab Sekunde 0, Layouts abwechseln, weniger Text). Prüfen mit `look` + Agent `video-kritiker`. Render → -14 LUFS → `export/`: `video.mp4`, `cover.png` (1280×720), `caption.txt` (Titel, Beschreibung, Kapitel, Quellen, 5 Hashtags), `untertitel-zeitstempel.txt`, `untertitel.srt`.

Vorbild: `studio/projekte/warum-ki-luegt/` und `kanal/youtube/2026-10-05_bis_2026-10-11/warum-ki-luegt/`.

## Erst prüfen: reicht der Ersteller?

Für 8-Sekunden-Spots und Erklärvideos aus Standard-Szenen (Titel, Aussage, Liste, Schritte, Vergleich, Zahl, Chat, Icons, Tokens, Code, Orbit, Mindmap, Ablauf, Wörter, Meldungen, B-Roll, Bildschirm, Ende – jeweils mit optionalem Effekt und 3D-Held) zuerst den Ersteller nehmen: JSON nach `studio/ersteller/beispiele/` schreiben → `npm run erstellen -- <datei> --nur-bilder` ansehen → verbessern → `npm run erstellen -- <datei>`. Design passend wählen (`editorial` ist Marke). Icons: `npm run icons -- <wort> --bild`.

## Kurzablauf (eigenes Projekt)

1. Briefing klären (Thema, Kernaussage, Format, Länge, Plattform).
2. `npm run neu -- <slug> [format]` (Erklärvideo) oder `npm run neu -- <slug> --vorlage=werbung` (Werbeclip in 9:16/1:1/4:5) → `skript.md` füllen, Fakten mit Quelle + Datum.
3. Szenen planen: pro Szene *Start → Veränderung → Ergebnis*, ein Blickfang, passende Bausteine.
4. Szene bauen → `npm run look -- <ID> --range=a-b --count=6` → Bilder ansehen → verbessern. Wiederholen.
5. Gesamtvideo: `npm run look -- <ID> --count=18`, Checkliste unten, optional Agent `video-kritiker`.
6. Mit Voiceover (spricht Arman selbst): `npm run untertitel -- <slug>`, Szenen auf Wortzeiten legen, `VOICEOVER` setzen. Keine Musik, außer Arman will sie ausdrücklich.
7. `npm run render -- <ID>` (bei Werbung jedes Format) → MP4 an Arman schicken (SendUserFile). Cover/Thumbnail: `npm run still`.

## Checkliste vor dem Abgeben (an den Bildern prüfen, nicht am Code)

- [ ] Frame 0 zeigt den Hook.
- [ ] Jede Szene: Was ändert sich sichtbar? Steht am Ende ein klares Ergebnis?
- [ ] Nichts überlappt ungewollt, nichts ist abgeschnitten, nichts steht in den Randzonen.
- [ ] Alles fürs Handy lesbar (Labels ≥ 40 px im Hochformat).
- [ ] Keine großen leeren Flächen, aber auch kein Gedränge.
- [ ] Kein Satz doppelt (Überschrift ≠ Untertitel ≠ Label).
- [ ] Keine erfundenen Zahlen; Beispielwerte als „Beispiel“ markiert.
- [ ] Gruppen erscheinen gestaffelt, Bewegungen haben Kurven, keine Deko-Bewegung.
- [ ] Sound leise und nur an echten Ereignissen.

Arman bekommt am Ende: Video, kurze Liste was gemacht wurde, offene Punkte.
