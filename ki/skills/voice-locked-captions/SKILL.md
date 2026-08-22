# Skill: Voice-Locked Captions

## Zweck

Dieser Skill gilt ab Phase 3 für jedes Reel mit echtem Voiceover. Er verhindert, dass Phase-1-Schätzungen als finale Caption-, Wort- oder Szenen-Timings verwendet werden.

## Autorität

Sobald echtes Voiceover existiert, gilt:

**final verwendetes Audio → Whisper-/Wort-Timestamps → Caption-Gruppen → Visual Beats → Szenengrenzen → Composition-Dauer**

Nicht umgekehrt.

Phase-1-Timings sind ausschließlich Planwerte.

## Phase-3-Standard: Whisper zuerst

Im Repo ist `@remotion/install-whisper-cpp` bereits vorhanden. Für deutsche Voiceovers wird standardmäßig das **mehrsprachige Modell `medium`** mit `language: 'de'` und Token-Level-Timestamps verwendet.

Vor der finalen Timing-Arbeit ausführen:

```bash
node ki/scripts/align-voiceover-whisper.mjs <reel-package-dir>
```

Optional stärkeres Modell:

```bash
KI_WHISPER_MODEL=large-v3 node ki/scripts/align-voiceover-whisper.mjs <reel-package-dir>
```

Der Preprocessing-Schritt:

1. findet das echte `voiceover.*`
2. misst die echte Audiodauer
3. konvertiert lokal mit ffmpeg auf 16 kHz Mono-WAV
4. installiert/cacht Whisper.cpp außerhalb des Repos unter `.cache/`
5. lädt/cacht ein mehrsprachiges Whisper-Modell
6. transkribiert mit Token-Timestamps
7. richtet die Whisper-Tokens gegen den **kanonischen deutschen Sprechertext** aus
8. schreibt `03-caption/voice-lock.whisper.generated.json`
9. schreibt zusätzlich `03-caption/whisper.raw.generated.json` für Debug/Review

Wichtig: Whisper ist **Timing-Hilfe**, nicht Text-Autorität. Der Sprechertext in `VOICEOVER-ZUM-KOPIEREN.txt` bleibt wortgetreu maßgeblich. STT-Fehler dürfen den Text nicht umschreiben.

## Generated → Production Contract

`voice-lock.whisper.generated.json` wird nicht blind als final erklärt. Der Phase-3-Agent muss daraus:

- `subtitle-cues.json` mit exakten kanonischen Wörtern + Frames aktualisieren
- Szenengrenzen auf natürliche Audio-/Bedeutungsgrenzen aktualisieren
- Source-Contract und Composition-Dauer aktualisieren
- Visual-Trigger auf dieselben Wort-/Phrasenframes legen
- anschließend Render und hörbaren Sync prüfen

Ein niedriger Whisper-/Script-Match ist ein Stop-Signal. Der Alignment-Script schlägt bei zu geringer Übereinstimmung fehl; dann stärkeres Modell verwenden oder Audio prüfen.

## Produktionsregel

Ein finaler Render mit Voiceover ist nicht freigabefähig, wenn Caption-Cues nur proportional über geschätzte Cue-Dauern laufen.

Pflicht für Phase 3:

- tatsächliche Audio-Dauer messen
- Sprechbeginn, Pausen und Phrasenenden aus echtem Audio bestimmen
- pro gesprochenem Wort Whisper-/audio-basierte `startFrame`/`endFrame`-Werte hinterlegen
- Caption-Cues nur während tatsächlich gesprochener Abschnitte anzeigen
- natürliche Pausen als echte Caption-Pausen respektieren
- Szenengrenzen auf natürliche Sprecher-/Bedeutungsgrenzen legen
- Visual Beats auf dieselben Wort-/Phrasenmarker ausrichten
- aktives lila Wort nur dann hervorheben, wenn es tatsächlich gesprochen wird

## Keine Produktions-Fallbacks

Der Source darf einen proportionalen Timing-Fallback für **Phase-1-Preview** besitzen. Sobald ein Reel als Phase 3 / final behandelt wird, ist dieser Fallback nicht ausreichend.

Wenn Word-Timestamps fehlen:

- Status nicht `approved`
- kein finaler Publishing-Render
- Validator muss warnen oder im Production-Modus fehlschlagen

Wenn echte Voiceover-Datei vorhanden ist, soll Phase 3 **Whisper-Alignment vor manueller Schätzung bevorzugen**.

## Caption-Gruppen

- Gruppen nach Sinn und Sprechphrase bilden, nicht blind alle N Wörter
- normalerweise 3–6 Wörter sichtbar
- maximal 2 Zeilen
- kurze Pause innerhalb eines Satzes darf einen neuen Caption-Block auslösen
- Satzzeichen und natürliche Betonung für Gruppierung nutzen
- kein neues Caption-Fenster mitten in einer eng gesprochenen Wortgruppe, nur weil die Wortzahl erreicht wurde

## Szene und Stimme

Eine Szene darf nicht wechseln, während der Sprecher semantisch noch im vorherigen Gedanken ist.

Scene Cut bevorzugt:

- nach Satzende
- nach klarer Pause
- beim hörbaren Wechsel auf einen neuen Gedanken
- wenn ein neues Schlüsselwort den nächsten visuellen Zustand startet

## Visual-Sync

Für jeden starken Visual Beat einen Audio-Anker definieren:

```text
Wort / Phrase
→ Frame im finalen Audio
→ visueller Trigger
→ erwarteter sichtbarer Zustand
```

Beispiele:

- „kritische Schwelle“ → Threshold schlägt sichtbar ein
- „zwei Wochen“ → Pause-Gate verriegelt
- „Monitoring“ → Monitoring-Layer aktiviert sich
- „Netzwerkzugriffe eingeschränkt“ → Netzwerkpaket wird blockiert
- „nicht außer Kontrolle“ → Alarm-Behauptung wird sichtbar verworfen

## Audio-Abweichung zu Phase 1

Wenn die echte Stimme länger oder kürzer ist als die Phase-1-Planung:

1. Composition-Dauer an Audio anpassen
2. Szenen und Beats auf Audio neu verteilen
3. Captions neu ausrichten
4. erst danach bei Bedarf lokale, natürliche Retiming-Korrekturen im erlaubten Bereich verwenden

Nie das echte Voiceover gegen falsche Plan-Cues laufen lassen.

## Validierung

Nach Integration der finalen Timing-Daten:

```bash
node ki/scripts/validate-voice-locked-captions.mjs <reel-package-dir>
```

Dieser Check ersetzt nicht den hörbaren Review, verhindert aber fehlende/inkonsistente Wort-Timings und Audio-Dauer-Drift.

## Freigabe-Gate

Finale Freigabe nur wenn:

- Whisper-/Audio-Alignment wurde erzeugt oder gleichwertig präzise Wort-Timestamps liegen vor
- Caption-Text stimmt wortgleich mit Sprechertext
- Caption erscheint erst mit dem gesprochenen Wort / der Phrase
- aktives Wort folgt der Stimme sichtbar
- keine Caption läuft hörbar vor oder hinterher
- Szenenwechsel treffen den inhaltlichen Audio-Wechsel
- Visual-Trigger treffen die geplanten gesprochenen Schlüsselwörter
- letzte Caption endet mit der letzten gesprochenen Phrase
- Composition endet erst nach dem echten Audio-Ende plus bewusstem kurzen End-Hold
