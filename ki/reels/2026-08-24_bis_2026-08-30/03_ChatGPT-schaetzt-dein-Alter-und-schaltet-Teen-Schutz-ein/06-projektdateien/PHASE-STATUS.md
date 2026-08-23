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
- deutlich breitere Farbpalette: Cyan, Blau, Grün, Orange, Gelb, Rot, Lila, Graphit und Weiß
- Chat-/Account-/Study-/Safety-/Parent-Control-UI
- `source-isolation.json` mit Required-/Forbidden-Strings
- Validator `validate-reel-source-isolation.mjs`

## Layout-Revision nach echtem Render-Feedback

**Status:** IMPLEMENTIERT — RERENDER ERFORDERLICH

Der zuletzt geprüfte neue Render war inhaltlich deutlich besser, aber noch zu kopflastig und wirkte durch die alte Visual-Clipping-Zone wie zwei getrennte Hintergründe.

Im Source geändert:

- Szenen-Header von oben weiter nach unten gesetzt (`top: 112`)
- Header kompakter und als kleine transparente Glass-Fläche statt eigener oberer Zone
- Caption von der alten hohen Safe-Position auf `bottom: 250` verschoben
- Caption als transparente Blur-Overlay-Kapsel statt optischem Footer
- `SceneLayer` clippt die Visuals nicht mehr auf `top: 175` / `CHATGPT_TEENS_VISUAL_END_Y`
- jeder Szenen-Hintergrund läuft jetzt über die komplette 1080×1920-Fläche
- alle fünf Hauptvisuals wurden für Fullscreen neu positioniert und deutlich tiefer gesetzt
- dunkle Szenen behalten ihren dunklen Hintergrund bis ganz unten; helle Szenen ihren eigenen Verlauf ebenfalls bis ganz unten
- kein harter weißer Abschnitt unter einer andersfarbigen Szene mehr

Der alte MP4 vor dieser Layout-Revision darf diese Änderungen nicht freigeben.

## Marken / Bilder

**Status:** PRODUKTNAHE UI + TEXT-BRANDING, KEIN ERFUNDENES LOGO

- sichtbare Referenzen `ChatGPT` / `OpenAI` sind erlaubt
- kein Blossom/Logo aus Erinnerung gezeichnet
- derzeit liegt kein freigegebenes offizielles OpenAI-/ChatGPT-Logoasset lokal im Repo
- sobald ein offizielles zulässiges Asset bereitgestellt wird, darf es unverändert als zusätzlicher Layer eingebaut und über Container/Kamera/UI inszeniert werden
- externe Bilder sind für den Kernmechanismus nicht nötig; die fünf Szenen sind Remotion-native aufgebaut

## Audio

**Status:** RICHTIGE SPRACHSPUR IM HOCHGELADENEN RENDER VERIFIZIERT UND LOKAL EXTRAHIERT — REPO-BINÄRDATEI FEHLT NOCH

Tatsächlich gemessen:

- Nutzer-Render ca. 54.827 s
- lokal extrahierte MP3 ca. 54.857 s
- Audio ist hörbar und enthält den Teen-Sprechertext

Die lokale Referenz dieser Sitzung liegt unter `/mnt/data/teen_rebuild/voiceover.mp3`.

Nicht als final Voice-Locked behandeln, bis dieselbe Datei unter `01-script-audio/voiceover.mp3` im Repo liegt und Whisper/Voice-Lock neu dagegen gelaufen ist.

## Vor `FINAL VIDEO READY` noch Pflicht

1. Audio-Binärdatei am kanonischen Repo-Pfad ablegen
2. Whisper/Voice-Lock gegen genau dieses Audio neu ausführen
3. Source-Isolation-Validator ausführen
4. Entertainment-Validator ausführen
5. fokussierte Contract-Tests + TypeScript-Typecheck ausführen
6. Remotion-Composition auflösen/bundlen
7. Smoke-/Hero-Frames aus **der neuen** Composition und **nach der Layout-Revision** rendern
8. Contact Sheet prüfen: durchgehende Hintergründe, tiefere Header/Captions, nur Teen-/ChatGPT-Kontext, keine Fremdvisuals
9. finalen MP4 mit hörbarem Voiceover rendern
10. `validate-final-video.mjs` ausführen
11. finalen MP4 vollständig ansehen und anhören

Bis diese Punkte tatsächlich bestanden sind: **REVISION IMPLEMENTIERT — RERENDER ERFORDERLICH**.
