# QA-Checkliste – GPT-6 Intelligent UI

**Status:** v2 gerendert – Armans Freigabe offen

> Die Haken unten stammen aus der ersten Fassung (Gemini). Für v2 gilt der Abschnitt „Fassung v2“ am Ende.

- [x] Script/Quellen zu allen sichtbaren aktuellen Produkt-Claims am Publish-Datum erneut geprüft (OpenAI Launch 07.10.2026, Help Center)
- [x] Wortgetreues echtes Voiceover eingebunden; Dauer/Satz-Timing verifiziert (9.927 Frames / 330.9s via Whisper.cpp)
- [x] First frame erzählt den Hook, nicht nur Logo/Blank (ANTWORT → WERKZEUG, Text vs. Bedienbar)
- [x] Kapitel 1–8: inhaltlich passende Handlung statt statischer Karte (8 distinkte remotion-native Szenen)
- [x] Illustrative Interfaces als DEMO, nicht als echter Screenshot dargestellt („SCHEMATISCHE ILLUSTRATION · KEIN CHATGPT-SCREENSHOT“)
- [x] Zahlenbeispiel 20×10 = 200, 30×10 = 300; ohne Renditebehauptung (Balken-Label mathematisch exakt synchronisiert)
- [x] kein Fremdlogo/Markenscreenshot als realer Test ausgegeben
- [x] TypeScript/Tests/Visual Contracts tatsächlich gelaufen (npm test, typecheck, wiring, visual contracts: alle PASS)
- [x] Thumbnail bei 320px Breite lesbar; keine falsche „Apps entstehen von selbst“-Behauptung (TEXT → TOOL, 200 € → 300 €)
- [x] Stimme und Ton im Mix geprüft; keine Clip-/Stummschalten-Fehler (-16 LUFS, True Peak -1.5 dB, 48 kHz AAC)
- [x] Finaler MP4 in groß und klein visuell geprüft (1920×1080 30fps H.264, 21.1 MB)
- [x] Creative QA von echter Ausgabe durchgeführt (Stills aller 8 Kapitel am Start, Mitte und Ende gesichtet)
- [x] Post-Video Improvement dokumentiert und kanalweiter Fix geprüft

## Fassung v2 (Claude, 17.10.2026)

- [x] Studio-Typecheck (`npx tsc -p studio/tsconfig.json`) ohne Fehler
- [x] Kontaktbögen aller 8 Kapitel + Kamerafahrten gerendert und angesehen
- [x] Frame 0 zeigt Frage, Chatfenster und Toki
- [x] Kein nachgebautes Markenlogo; jede nachgebaute Oberfläche als Illustration markiert
- [x] Zahlen auf dem Bildschirm aus derselben Variable (Regler, Balken, Summe)
- [x] Kapitel 7 nach OpenAI-Angaben (Sol/Luna/Astra, Chat/Work/Voice), Stand 17.10.2026
- [ ] Vollständiges MP4 mit Ton von Arman angesehen
- [ ] Auf dem Handy (klein) geprüft
- [ ] Verfügbarkeit direkt vor dem Upload erneut geprüft

**Technischer Status:** gerendert · **Automated Visual (V4-Gate):** nicht ausgeführt (Longform) · **Human Creative:** OFFEN (Arman)
