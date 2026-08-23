# Produktionsstatus — ChatGPT for Teens

## Alte Fassung

**Status:** VERWORFEN / NICHT FREIGABEFÄHIG

Der hochgeladene alte Render bleibt ausschließlich als Fehlerreferenz dokumentiert. Er darf nicht als Source-, Visual- oder Qualitätsbasis weiterverwendet werden.

Fehlerbeispiele: `NOVA`, Werbe-/Creative-Brief-UI, Produkt-Konsistenz, `KEYFRAME → MOTION`, Werbeclip-Workflow.

## Neuer Visual-Rebuild

**Status:** SOURCE REBUILT + ISOLIERT + ROOT REGISTRIERT — NEUER RENDER ERFORDERLICH

Neu vorhanden:

- eigener Source-Ordner `ki/src/reels/chatgpt-for-teens/`
- eigene Composition `KI-ChatGPTForTeens`
- Composition in `ki/src/Root.tsx` registriert
- keine Abhängigkeit von Werbeclip-/Produkt-/Motion-Pipeline-Visuals
- fünf Teen-spezifische Hauptvisuals
- Product/UI-first statt abstraktem Card-Reuse
- breite Farbpalette: Cyan, Blau, Grün, Orange, Gelb, Rot, Lila, Graphit und Weiß
- Chat-/Account-/Study-/Safety-/Parent-Control-UI
- `source-isolation.json` mit Required-/Forbidden-Strings
- Validator `validate-reel-source-isolation.mjs`

## Layout-Revision nach echtem Render-Feedback

**Status:** IMPLEMENTIERT — RERENDER ERFORDERLICH

Im Source geändert:

- Szenen-Header weiter nach unten (`top: 112`)
- Header kompakter und als transparente Glass-Fläche
- Caption auf `bottom: 250` verschoben
- Caption als Blur-Overlay statt optischem Footer
- `SceneLayer` clippt die Visuals nicht mehr auf eine künstliche obere Visual-Zone
- jeder Szenen-Hintergrund läuft über die komplette 1080×1920-Fläche
- alle fünf Hauptvisuals für Fullscreen neu positioniert und tiefer gesetzt
- kein harter weißer Abschnitt unter einer andersfarbigen Szene mehr

Der alte MP4 vor dieser Layout-Revision darf diese Änderungen nicht freigeben.

## Marken / Bilder

**Status:** PRODUKTNAHE UI + TEXT-BRANDING, KEIN ERFUNDENES LOGO

- sichtbare Referenzen `ChatGPT` / `OpenAI` sind erlaubt
- kein Blossom/Logo aus Erinnerung gezeichnet
- derzeit liegt kein freigegebenes offizielles OpenAI-/ChatGPT-Logoasset lokal im Repo
- ein offizielles zulässiges Asset darf später unverändert ergänzt und über Umgebung/Kamera/UI inszeniert werden

## Audio

**Status:** RICHTIGE SPRACHSPUR IM HOCHGELADENEN RENDER VERIFIZIERT UND LOKAL EXTRAHIERT — REPO-BINÄRDATEI FEHLT NOCH

Tatsächlich gemessen:

- Nutzer-Render ca. 54.827 s
- lokal extrahierte MP3 ca. 54.857 s
- Audio ist hörbar und enthält den Teen-Sprechertext

Nicht als final Voice-Locked behandeln, bis dieselbe Datei unter `01-script-audio/voiceover.mp3` im Repo liegt und Whisper/Voice-Lock neu dagegen gelaufen ist.

## Final Export Automation

**Status:** IM REPO IMPLEMENTIERT — MUSS AM NEUEN FINAL-RENDER AUSGEFÜHRT WERDEN

Neu vorhanden:

- `ki/scripts/finalize-reel-export.mjs`
- `ki/scripts/validate-reel-export-package.mjs`
- Pflicht-Skill `ki/skills/final-export-package/SKILL.md`
- kanonische Social-Caption `03-caption/FINAL-CAPTION.txt`
- `reel.json.export.coverTimeSeconds = 6.0` als Szene-1-Hero; nach dem aktuellen Layout-Rerender erneut visuell prüfen

Ein fertiges Reel muss am Ende automatisch dieses Paket besitzen:

```text
05-export/
├── KI-ChatGPTForTeens.mp4
├── KI-ChatGPTForTeens-cover.png
├── KI-ChatGPTForTeens-caption.txt
└── KI-ChatGPTForTeens-export-manifest.json
```

Das Finalize-Script führt **vor dem Kopieren** das Audio-/Video-Gate aus. Ein fehlendes oder praktisch stummes Audio blockiert den finalen Export vollständig.

## Vor `FINAL VIDEO READY — EXPORT PACKAGE READY` noch Pflicht

1. Audio-Binärdatei am kanonischen Repo-Pfad ablegen
2. Whisper/Voice-Lock gegen genau dieses Audio neu ausführen
3. Source-Isolation-Validator ausführen
4. Entertainment-Validator ausführen
5. fokussierte Contract-Tests + TypeScript-Typecheck ausführen
6. Remotion-Composition auflösen/bundlen
7. Smoke-/Hero-Frames aus der neuen Composition und nach der Layout-Revision rendern
8. Contact Sheet prüfen: durchgehende Hintergründe, tiefere Header/Captions, nur Teen-/ChatGPT-Kontext
9. Cover-Zeit `6.0 s` am neuen Render bestätigen oder anpassen
10. finalen MP4 **mit hörbarem Voiceover** rendern
11. `node ki/scripts/validate-final-video.mjs <rendered-video.mp4>`
12. `03-caption/FINAL-CAPTION.txt` final prüfen
13. `node ki/scripts/finalize-reel-export.mjs <reel-package-dir> <rendered-video.mp4>`
14. `node ki/scripts/validate-reel-export-package.mjs <reel-package-dir>`
15. **exportierten** MP4 vollständig ansehen und anhören
16. exportiertes Cover und Caption prüfen
17. erst danach `FINAL VIDEO READY — EXPORT PACKAGE READY`

Bis diese Punkte tatsächlich bestanden sind: **REVISION IMPLEMENTIERT — RERENDER/FINALISIERUNG ERFORDERLICH**.
