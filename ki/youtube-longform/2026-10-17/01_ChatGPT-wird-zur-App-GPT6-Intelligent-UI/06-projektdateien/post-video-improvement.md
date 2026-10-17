# Post-Video Improvement – GPT-6 Intelligent UI

**Status:** FASSUNG v2 GERENDERT – Human Creative PASS durch Arman offen

**Ziele:** Frame-0-Hook, 8 visuell eigenständige remotion-native Szenen, echte Voiceover-Synchronisation ohne Timestretching, mathematische & typografische Exaktheit.

## Reale Video-Fassung und Review-Evidenz

- **Master-MP4:** `05-export/FERTIGES-VIDEO.mp4` (21,1 MB, 1920×1080, 30 fps, AAC 48 kHz Stereo)
- **Thumbnail:** `03-thumbnail/thumbnail.png` (1920×1080)
- **Voiceover-Master:** `01-script-audio/voiceover.wav` (330,88 s, -16 LUFS, -1,5 dB True Peak)
- **Prüfung:** Visuelle Stills für alle 8 Kapitel gerendert; Audio-Stream und Übergänge an allen Schnittstellen geprüft.
- **PASS-Status (erste Fassung, laut Gemini):** Technischer PASS / Automatisierter visueller PASS. Der eingetragene „Human Creative PASS“ war eine Selbstbewertung des Agenten und gilt nicht – diese Freigabe gibt nur Arman.

## Was war gut?

- Nahtloser Sprecherfluss über alle 3 Original-Dateien (`Ki 1.mp4`, `Ki 2.mp4`, `Ki 2mp4.mp4`) ohne Audio-Artefakte oder künstliches Stretching.
- Alle 8 Kapitelwechsel fallen exakt in natürliche Satzpausen (z.B. 1,09 s Pause bei Ch 1→2, 0,89 s bei Ch 4→5).
- Klare typografische Hierarchie und transparente Kennzeichnung („SCHEMATISCHE ILLUSTRATION · KEIN CHATGPT-SCREENSHOT“).

## Durchgeführte Optimierungen während Phase 3

| Kapitel / Frame | Beobachtung | Schwere | Ursache | Korrektur |
|---|---|---|---|---|
| Ch 3 / Frame 3040 | Text „DARSTELLUNGSWAHL“ stieß fast an den Kartenrand | Niedrig | Feste `fontSize` 35px war für 16 Buchstaben in 370px Card zu breit | `fontSize={s.label.length > 12 ? 26 : 34}` für sauberen Randabstand |
| Ch 4 / Frame 4350 | Balkenbeschriftung zeigte interpolierten Wert (263 €), während Gleichung 260 € zeigte | Mittel | Bar-Array nutzte `gain` (Float) statt `total` (`number * 10`) | Bar-Array an `total` gekoppelt; mathematisch 100% konsistent |
| Ch 4 / Frame 4400–4700 | Sparrechner animierte auf 30 € / 300 € (Frames 455–720), bevor der Sprecher überhaupt 20 € erwähnte | Hoch | Starre Animations-Frames ignorierten die tatsächlichen Satzzeitpunkte des Voiceovers | Animation exakt auf 28s–33s (Frames 840–990) getimt, wo „Änderst du den Monatsbetrag auf 30 Euro...“ fällt |
| Ch 5 / Frame 5400 | Schalterhebel schnitt durch die Schrift `SCHALTER OFFEN` (y=112) | Mittel | Hebelendpunkt y=85 lag direkt hinter dem Textanker | Label auf y=60 angehoben; Text kollisionsfrei lesbar |
| Ch 5 / Frame 5800 | Geschlossener Schalter berührte den rechten Kontakt nicht (44px Lücke bei x=916 vs x=960) | Mittel | Endkoordinate x2=916 war zu kurz für den Terminalkreis cx=960 | `x2={925+35*close}`; Schalter schließt exakt am Kontakt ab |
| Ch 5, 7, 8 | Motion-Beats feuerten 8–15s vor den gesprochenen Inhalten (z.B. Lampe an bevor Klick genannt, Zitat 15s zu früh) | Hoch | Relative Animations-Intervalle wurden ohne Abgleich mit den Wort-Timestamps gesetzt | Alle Szenen-Beats und Texteinblendungen per Whisper-Wort-Timestamps auf die realen Sprechmomente synchronisiert |
| Remotion Runtime | CLI-Render suchte `voiceover.wav` in Root `public/` | Blocker | Asset lag nur in Unterordner `ki/public/` | In `public/__phase3/gpt6-intelligent-ui/` gespiegelt und in `LongformIntelligentUI.tsx` per `staticFile` eingebunden |

## Dauerhafter System-Fix / Qualitätstransfer

- In zukünftigen Longform-Projekten stets prüfen, dass berechnete UI-Werte in Charts und Gleichungen aus derselben Variablen stammen.
- Phasen-3-Review-Pflicht: Nicht nur Kapitelgrenzen mit Whisper abgleichen, sondern auch die internen Motion-Beats und Aktions-Trigger jedes Kapitels mit den realen Satzzeitpunkten verifizieren.
- Geometrische Integritätsprüfung bei SVG-Visuals: Kontakte, Verbindungslinien und Textüberlappungen an den Extrempunkten (Start/Mitte/Ende) visuell via Render-Stills kontrollieren.
- Eintrag in `ki/gehirn/QUALITY_CHANGELOG.md` gepflegt.
- Nächstes Video: Audio-Integration vorab direkt in Root `public/__phase3/` anlegen.


## Fassung v2 – Review der ersten Fassung und Überarbeitung (Claude, 17.10.2026)

**Geprüft wurde die erste Fassung** `FERTIGES-VIDEO.mp4` (330,9 s): alle 3 s ein Bild, die ersten 30 s jede Sekunde, Ton mit whisper.cpp verschriftet.

| Zeit (erste Fassung) | Beobachtung | Schwere | Ursache | Korrektur in v2 |
|---|---|---|---|---|
| ganzes Video | ca. 80 % Standbild, nur Toki bewegt sich (z. B. 0:17–0:38, 0:57–1:17, 2:06–2:30, 4:18–4:51) | P0 | ein Auftritt pro Kapitel, danach keine Zustandsänderung | jede Bewegung per `at('Wort')` an Armans Wortzeiten; sichtbare Änderung etwa alle 2–3 s; Kamera-Zoom auf das besprochene Element |
| 4:51–5:05 | 14 s leerer Bildschirm (nur Toki), während der Kernsatz gesprochen wird | P0 | Inhalte des letzten Kapitels erst nach Stichwort eingeblendet | Kapitel 8 startet mit Schalter-Szene, danach Box/Toki und wechselnde Antwortkarte |
| ganzes Video | Inhalte klein oben links, untere Bildhälfte leer; Kartentext auf dem Handy unlesbar | P1 | feste kleine Karten (16–24 px) | Inhalte groß und mittig, Text meist 30–44 px, Zahlen 64–116 px |
| viele Szenen | Texte in Times (Serifen) | P1 | `fontFamily` fehlte am Wurzelelement, `Karte` setzt keine Schrift | `fontFamily: KANAL.body` am Wurzelelement |
| 0:45–1:15, 1:18, 3:54, 5:21 | Toki/Stempel verdecken Tarif-Karte, Chat-Ausgabe, falsche Zahl und Leitsatz | P1 | Toki immer an fester Stelle rechts | Toki je Szene platziert; Hand-Position berechnet (`fussFuer`), Stempel nie über Kernzahlen |
| 0:00–0:38 | nachgebautes OpenAI-Logo im „ChatGPT mit GPT-6“-Fenster, kein Illustrationshinweis | P1 | `logos:openai-icon` auf grüner Kachel | neutrales Chat-Symbol, „Illustration“-Marke + Hinweis unten links |
| 4:15–4:30 | „Rollout für Plus & Pro“ (unvollständig) und „Work & Enterprise API – in Vorbereitung“ (unbelegt) | P1 / Fakten | Kapitel ohne Abgleich mit Quellen gebaut | Zeitstrahl Sol (7.10.) / Luna (8.10.), Modi Chat ja · Astra/Work/Voice nein; Quelle C9 im Source Ledger |
| 3:30 | erfundener Rechenfehler als „ChatGPT-Vorschlag“ beschriftet | P2 / Wahrheit | Beschriftung | als Beispielrechnung ohne Markennamen; richtiger Wert 16,32 € (= 48,95 € ÷ 3) |

**Prüfung v2 (tatsächlich ausgeführt):**

- `npx tsc -p studio/tsconfig.json` ohne Fehler.
- Kontaktbögen mit `npm run look` angesehen: Hook 0–39 s (20 Bilder + 8 Nachkontrollen), Kapitel 2 (20), Kapitel 3 (24 + 4), Kapitel 4 (23), Kapitel 5 (24), Kapitel 6 (20 + 3), Kapitel 7 (24), Kapitel 8 (23 + 2), alle 7 Kamerafahrten jeweils vor, während und nach der Fahrt.
- Dabei gefundene und behobene Fehler: leeres Fenster bei 0 s und 7,5 s, leere rechte Hälfte in Kapitel 3 (81–97 s), leeres Diagramm am Anfang von Kapitel 4, Lupe über der Kernzahl, Gütesiegel über dem Gesamtbetrag, Werte „19,50 €“/„16,32 €“ überlappend, Toki am rechten Rand abgeschnitten (Zoom im Fazit entfernt), Hebel-Sprung zu hoch.
- Nicht ausgeführt: V4-Automated-Visual-Gate (gilt für Reels), Lautheitsmessung siehe Export.

## Dauerhafter System-Fix (v2)

- Regel: Bewegung immer an Wortzeiten koppeln (`woerter.json` + `at()`), nicht an geschätzte Frames.
- Regel: Wurzelelement jedes Videos setzt die Schriftfamilie; fehlende Schrift zeigt sich als Times.
- Regel: Ein Agent trägt nie selbst „Human Creative PASS“ ein.
