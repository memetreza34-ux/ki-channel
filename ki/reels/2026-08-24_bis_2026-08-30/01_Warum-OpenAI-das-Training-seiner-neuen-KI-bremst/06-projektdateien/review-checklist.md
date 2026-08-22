# Review Checklist — Post-Render Revision

## Fakten

- [x] Astra-Aussagen bleiben bei OpenAI als Quelle attribuiert.
- [x] Kein „KI außer Kontrolle“-Claim.
- [x] Zweiwöchige RL-Pause und weiterhin angehaltener großer Run werden getrennt dargestellt.
- [x] Monitoring, Alignment und Security werden nicht als identische Funktionen dargestellt.

## Voice-Lock

- [x] bereitgestellter Render als 61.888 s / 30 FPS analysiert
- [x] Composition auf 1857 Frames angepasst
- [x] Szenengrenzen auf natürliche Sprecher-/Pausengrenzen neu gelegt
- [x] Caption-Cues auf tatsächlich gesprochene Abschnitte gelegt
- [x] Wort-Timestamps für jeden Production-Cue vorhanden
- [x] natürliche Pausen erzeugen im Source keine proportionale aktive Wortfortschreibung mehr
- [ ] `node ki/scripts/validate-voice-locked-captions.mjs <reel-package-dir>` tatsächlich ausführen
- [ ] neuen Render anhören: aktives lila Wort folgt der Stimme
- [ ] neuen Render anhören: Szenenwechsel treffen den Sprecherwechsel
- [ ] letzte Caption endet hörbar mit der letzten Phrase

## High-Energy Remotion

- [x] alte kleine Card-Inseln im Source durch größere Full-Frame-Kompositionen ersetzt
- [x] Depth-/Parallax-Hintergründe statt toter Weißfläche ergänzt
- [x] Szene 1: Speed-Lines + Threshold-Impact + Brake-Zustand
- [x] Szene 2: bewegter RL-Conveyor + 2-Wochen-Gate + HOLD-Stamp
- [x] Szene 3: drei audio-ankerte Schutzringe + Threat-Flows + Scanner
- [x] Szene 4: pseudo-3D-Sandbox + Blocked-Network-Pakete + ACTIVITY/DETECT/REVIEW
- [x] Szene 5: Mythos-Crossout + Capability-vs-Safety-Progression
- [x] textbasierte OpenAI-Markenreferenz animiert; kein erfundenes offizielles Logo
- [ ] neuen Render auf Smartphone prüfen: Hauptmechanik wirklich groß genug
- [ ] neuen Render prüfen: keine neue Sprecherbedeutung > ca. 1.8 s ohne sichtbare Reaktion
- [ ] neuen Render prüfen: mindestens ein markanter Hero-Moment pro Szene
- [ ] neuen Render prüfen: Bewegung wirkt semantisch, nicht hektisch/dekorativ

## Caption-Safe

- [x] `REEL_CAPTION_SAFE.bottom = 520`
- [x] `horizontalInset = 104`
- [x] `maxWidth = 820`
- [x] Caption ohne weiße Box
- [x] aktive Sprecherposition lila
- [ ] neuen Feed-/Smartphone-Render auf echte Kollision prüfen
- [ ] rechte Interaktionsleiste gedanklich prüfen
- [ ] maximal 2 sichtbare Caption-Zeilen bestätigen

## Technisch

- [x] Source und Contract auf 1857 Frames aktualisiert
- [x] Contract-Test auf voice-locked Dauer/Wort-Timestamps aktualisiert
- [ ] TypeScript tatsächlich ausführen
- [ ] Vitest tatsächlich ausführen
- [ ] Remotion-Bundle tatsächlich ausführen
- [ ] Voice-Lock-Validator tatsächlich ausführen
- [ ] Smoke-Frames des **neuen** Source-Stands rendern
- [ ] finalen MP4 des **neuen** Source-Stands rendern

## Freigabe

- [ ] neuer Render visuell freigegeben
- [ ] neuer Render akustisch/caption-synchron freigegeben
- [ ] finaler MP4 gehört exakt zum aktuellen Source-Stand

Der alte bereitgestellte Render darf nach dieser Revision nicht als Freigabe verwendet werden.
