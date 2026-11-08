# Stimmprofil Denkwürfel

Entwurf vom 2026-11-07. Seit 2026-11-08 freigegeben: Arman hat den Klon seiner Stimme (normale Qwen-Version) für das GPS-Video freigegeben. Jeder weitere Klon-Text braucht seine Hörfreigabe.

**Idee:** Die Bauart des Sprechens stammt aus der Vorbild-Analyse in `.claude/skills/wissens-short/SKILL.md`. Die Stimme selbst ist eine andere.

## Gleiche Grundbausteine

| Baustein | Vorgabe |
|---|---|
| Tempo | rund 180 Wörter pro Minute, 60 s ≈ 170–180 Wörter |
| Satzlänge | rund 10 Wörter, ein Satz = ein Bildwechsel |
| Atempausen | etwa alle 3,5 s, zwischen Sätzen auf höchstens 0,5 s gekürzt |
| Einstieg | erster Satz enthält die ganze Behauptung samt Rätsel, höchstens 5 s |
| Ansprache | Du-Form, Alltagsbezug, Zahlen konkret mit Einheit |
| Weglassen | keine Begrüßung, kein „In diesem Video“, kein Abo-Aufruf |
| Schluss | Pointe als Ergebnis oder Wendung, letzter Satz führt in den Anfang zurück |
| Unterlage | leise eigene Musik, Endmischung −14 LUFS |

## Bewusst anders

- **Klang:** eigene Stimme (Klon von Arman oder lizenzierte Stimme), klar erkennbar anders als die Vorbilder.
- **Keine fremden Aufnahmen:** Audio der Vorbilder wird nie als Stimmprobe, Klon-Vorlage oder Stimmwandler-Eingang genutzt.
- **Keine Nachahmung im Prompt:** Vorbild-Namen stehen nie in Stimm-Prompts oder Einstellungen.
- **Eigene Marke:** kein Satz, keine Formel und kein Thema der Vorbilder wird übernommen.

## Prüfung einer Stimme

1. Denselben Probesatz mit jeder Kandidatin oder jedem Kandidaten erzeugen:
   „Dein Handy schickt für GPS kein einziges Signal ins All. Es hört nur zu.“
2. Prüfen: deutsche Aussprache von „GPS“ und „Einstein“, Zahlen, Satzmelodie, Tempo.
3. Arman entscheidet nach Gehör, auch ob die Stimme klar anders klingt als die Vorbilder.
4. Erst danach `.claude/arman-regeln.md`, `studio/CLAUDE.md` und den Skill `wissens-short` anpassen.

## Stand des Stimmklons (2026-11-07)

Arman will prüfen, ob ein Klon seiner eigenen Stimme die Aufnahme ersetzen kann. Die Tests sind von ihm gewollt. Sie landen in `kanal/stimme/proben/`, nicht in Videos.

- **Quelle:** nur Armans eigene Aufnahme `kanal/stimme/stimmprobe.wav`. Audio liegt nicht in Git und muss von Rechner zu Rechner kopiert werden.
- **MOSS-TTS-Nano:** von Arman verworfen, klingt schlecht.
- **Qwen3-TTS 0.6B-Base (PyTorch, Referenz mit Text):** Armans Urteil zu 5 Sekunden: „Klingt nach mir“. Auf dem Windows-Laptop dauerte das 71 Minuten, also zu langsam.
- **Nächster Test auf dem MacBook M4:** `bash kanal/stimme/mac-stimme.sh` nutzt die C-Version von Qwen3-TTS mit `referenz-30s.wav`. Sie arbeitet ohne Referenztext und kann deshalb anders klingen. Arman vergleicht sie nach Gehör mit `proben/qwen-gps-1.wav`.
- **Klingt die C-Version schlechter:** die normale Qwen-Version (`qwen-tts` 0.1.1) auf dem Mac testen.
- **Freigabe:** Erst wenn Arman einen ganzen Text in dieser Stimme freigibt, ändert sich die Regel „Stimme nur Arman“.

## Stand am MacBook M4 (2026-11-08)

- **Neue Referenz:** Arman hat am Mac 26 s neu eingesprochen (`Test.mp4`, als `referenz-30s.wav` umgewandelt). Wortlaut steht in `mac-stimme-normal.py`.
- **Ablage:** Programme und Modell liegen auf der SSD T7. Die C-Version unter `~/stimme-klon` (Verknüpfung auf T7). Die normale Version im Abbild `T7/stimme-klon/stimme-klon.sparseimage`, weil exFAT mit seinen `._`-Dateien Python-Pakete zerstört. Vor dem Lauf `hdiutil attach` (siehe Skriptkopf).
- **C-Version** (`proben/qwen-c-gps-1.wav`): Testsatz in 11,5 s, ohne Referenztext. Arman: schlechter als die normale Version.
- **Normale Version** (`mac-stimme-normal.py`, qwen-tts 0.1.1 auf der Apple-GPU): Arman zieht sie vor. Ganzer GPS-Text als `proben/qwen-normal-gps-ganz.wav`: 67,5 s, 172 Wörter pro Minute, Rechenzeit 340 s plus 77 s Laden.
- **Zu prüfen beim Anhören:** Whisper hört „sieben Hundertstelsekunden“ als „700 stillsekunden“ und „achtunddreißig Millionstelsekunden“ als „38.000.000 Sekunden“. Ob der Klon oder Whisper danebenliegt, entscheidet das Gehör.
- **Nachbesserung:** Absatz 4 und 6 neu mit getrennter Schreibweise („Hundertstel Sekunden“, „Millionstel Sekunden“). Arman wählte beide neu. Ergebnis `proben/qwen-normal-gps-ganz-v2.wav`: 67,0 s, 169 Wörter pro Minute. Für Klon-Texte Bruchzahlen deshalb getrennt schreiben.
- **Freigabe 2026-11-08:** Arman gibt `qwen-normal-gps-ganz-v2.wav` für das GPS-Video frei. Regeln in `.claude/arman-regeln.md`, `studio/CLAUDE.md` und Skill `wissens-short` angepasst.
