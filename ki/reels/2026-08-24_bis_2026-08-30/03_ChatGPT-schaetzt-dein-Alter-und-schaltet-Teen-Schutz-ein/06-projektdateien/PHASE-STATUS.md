# Produktionsstatus — ChatGPT for Teens

## Alte Fassung

**Status:** VERWORFEN / NICHT FREIGABEFÄHIG

Der hochgeladene alte Render bleibt ausschließlich als Fehlerreferenz dokumentiert. Er darf nicht als Source-, Visual- oder Qualitätsbasis weiterverwendet werden.

Fehlerbeispiele: `NOVA`, Werbe-/Creative-Brief-UI, Produkt-Konsistenz, `KEYFRAME → MOTION`, Werbeclip-Workflow.

## Neuer Visual-Rebuild

**Status:** SOURCE REBUILT + ISOLIERT + ROOT REGISTRIERT — NEUER RENDER ERFORDERLICH

Vorhanden:

- eigener Source-Ordner `ki/src/reels/chatgpt-for-teens/`
- eigene Composition `KI-ChatGPTForTeens`
- Composition in `ki/src/Root.tsx` registriert
- keine Abhängigkeit von Werbeclip-/Produkt-/Motion-Pipeline-Visuals
- fünf Teen-spezifische Hauptvisuals
- Product/UI-first statt abstraktem Card-Reuse
- Chat-/Account-/Study-/Safety-/Parent-Control-UI
- `source-isolation.json` + Validator
- Fullscreen-Light-First-Layout
- Header `top:112`, Shared-Caption `bottom:250`

## Phase-1-Migration

**Status:** AUF AKTUELLEN PRODUKTIONSVERTRAG MIGRIERT

- exaktes `SCENE-VOICE-MAP.json` ergänzt
- `reel.json` nutzt jetzt `finalDurationInFrames` als echten Audio-Lock-Zielwert
- lokales Forced Alignment ist die Timing-Autorität
- Script-Budget-Ausnahme dokumentiert: bestehender Legacy-Sprechertext hat 129 Wörter; er wird während der Stabilisierung nicht heimlich umgeschrieben
- neue Reels dürfen diese Legacy-Ausnahme nicht als Standard übernehmen

## Marken / Bilder

**Status:** PRODUKTNAHE UI + TEXT-BRANDING, KEIN ERFUNDENES LOGO

- sichtbare Referenzen `ChatGPT` / `OpenAI` sind erlaubt
- kein Logo aus Erinnerung zeichnen
- offizielles zulässiges Asset später nur unverändert lokal ergänzen

## Audio

**Status:** RICHTIGE SPRACHSPUR VERIFIZIERT — KANONISCHE LOKALE DATEI + FORCED ALIGNMENT FEHLEN

Referenzmessung:

- Nutzer-Render ca. 54.827 s
- extrahierte Referenz-MP3 ca. 54.857 s

Pflicht:

1. verifizierte Referenzspur unter `01-script-audio/voiceover.mp3` lokal ablegen
2. `node ki/scripts/align-reel-local.mjs <reel-package-dir>`
3. Pause-Kompression + exaktes lokales Forced Alignment gegen den bekannten Sprechertext
4. `WORD-TIMINGS.json`, Captions, Scene-Voice-Map und Szenengrenzen auf VOICE_LOCKED schreiben
5. generierte getrackte Timing-Dateien reviewen und committen
6. auf sauberem Worktree `prepare-reel-render.mjs` ausführen

Whisper ist für diesen bekannten Sprechertext nicht mehr der kanonische Standardpfad.

## Final Export Automation

**Status:** IMPLEMENTIERT — MUSS AUF NEUEM SOCIAL-MASTER AUSGEFÜHRT WERDEN

Finaler Pfad:

```text
Forced Alignment / Scene Lock
→ vollständige Repo-/Motion-/Remotion-Gates
→ Roh-Render
→ Social-Audio-Master ca. -16 LUFS
→ exakter 1x Review des gemasterten MP4
→ Finalizer
→ Export-Package-Gate
```

Ein fertiges Reel besitzt:

```text
05-export/
├── KI-ChatGPTForTeens.mp4
├── KI-ChatGPTForTeens-cover.png
├── KI-ChatGPTForTeens-caption.txt
└── KI-ChatGPTForTeens-export-manifest.json
```

## Vor `FINAL VIDEO READY — EXPORT PACKAGE READY`

- lokales Audio + Forced Alignment/Voice-Lock PASS
- Source-Isolation + Entertainment PASS
- Script-Budget-Gate mit dokumentierter Legacy-Ausnahme PASS
- vollständiges `repo:verify` + `motion:verify`
- Remotion Composition + Bundle erfolgreich
- neuer Roh-Render aus aktuellem Source
- Social-Audio-Master ca. -16 LUFS
- Contact Sheet + Cover-Zeit erneut prüfen
- **genau den gemasterten MP4** vollständig bei 1x ansehen und anhören
- Caption-Sync, Kamera/Zoom und Audio-Mix explizit PASS
- `validate-final-video.mjs` PASS
- Finalizer + Export-Package-Gate PASS
- exportierten MP4, Cover und Caption abschließend prüfen

Bis dahin: **REVISION IMPLEMENTIERT — RERENDER/FINALISIERUNG ERFORDERLICH**.
