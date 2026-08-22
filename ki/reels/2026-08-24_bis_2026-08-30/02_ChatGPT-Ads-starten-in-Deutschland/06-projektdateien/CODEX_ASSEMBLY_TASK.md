# CODEX ASSEMBLY TASK

## Ziel

Phase 3 für `KI-ChatGPTAdsGermany` auf Basis des vorhandenen Source abschließen. Das Reel nicht neu entwerfen.

## Reihenfolge

1. echtes `voiceover.wav` oder `voiceover.mp3` finden
2. `ki/scripts/align-voiceover-whisper.mjs` ausführen
3. Whisper gegen den exakten kanonischen Sprechertext alignen
4. echte Word-/Phrase-Timestamps in Contract/Captions übernehmen
5. Composition-Dauer auf echte Audio-Dauer setzen
6. Szenengrenzen auf natürliche Sprecher-/Bedeutungsgrenzen anpassen
7. Visual-Trigger aus `animation-plan.md` auf dieselben Audio-Anker legen
8. `validate-voice-locked-captions.mjs` ausführen
9. fokussierte Tests + Typecheck tatsächlich ausführen
10. Smoke-Frames intern rendern und prüfen
11. bei visuellen Problemen Source korrigieren und neu rendern
12. finalen MP4 rendern
13. `node ki/scripts/validate-final-video.mjs <final-video.mp4>` ausführen
14. finalen MP4 in normaler Geschwindigkeit + Smartphone-/Feed-Größe **ansehen und anhören**
15. nur wenn Audio hörbar, Captions synchron und keine offene Revision bleibt: finale Datei zeigen

## High-Energy Gate

Nicht vereinfachen zu statischen Cards. Erhalten bzw. verbessern:

- Launch / Deutschland / Datum / Sponsored-Card
- harte Antwort-vs-Ad-Separation
- blockierter Einfluss-Pfeil
- bewegtes Tarif-Karussell
- Ads-off → Nutzungslimit sinkt
- Relevanz-Datenfluss + Privacy-Wall
- Roh-Chats blockiert / aggregierte Metriken passieren
- Intent-Orbit + 31-Märkte-Schluss

## Logos / Assets

Kein OpenAI-/ChatGPT-Symbol aus Erinnerung nachzeichnen. Der native `ChatGPT`-Marken-Text ist zulässig. Falls später ein offizielles Markenasset bereitgestellt wird, dieses als echtes Asset animieren und nicht neu erfinden.

## Keine vorzeitige Abgabe

Ein Smoke-Render, Preview-Render oder stummer Test-Render ist **keine fertige Abgabe** und wird dem Nutzer nicht als final gezeigt.

Der Agent darf die Aufgabe nicht direkt nach dem Rendern beenden. Er muss zuerst prüfen:

- Videostream vorhanden
- Audiostream vorhanden
- Voiceover tatsächlich hörbar
- Caption hörbar synchron
- Szenen/Visual Beats zur Stimme synchron
- finaler MP4 gehört zum aktuellen Source-Stand

Wenn etwas davon fehlschlägt: Fehler beheben → neu rendern → erneut prüfen.

Erst wenn alles vollständig bestanden ist, die finale MP4 zeigen und danach die Aufgabe beenden.

## Abschlussstatus

Erst `FINAL VIDEO READY`, wenn Audio, Captions, Visual Beats und Szenen hörbar/visuell synchron sind, `validate-final-video.mjs` bestanden hat und der aktuelle Render tatsächlich angesehen **und angehört** wurde.