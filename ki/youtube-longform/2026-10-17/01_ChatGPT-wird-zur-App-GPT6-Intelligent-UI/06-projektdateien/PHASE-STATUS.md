# Produktionsstatus – GPT-6 Intelligent UI

**Aktueller Status:** PHASE 3 ÜBERARBEITET (Claude, 17.10.2026) – neue Fassung `Gpt6IntelligentUi` gerendert und Bild für Bild angesehen. **Human Creative PASS fehlt: nur Arman kann freigeben.**

## Phase 0 – Idea Gate

**Status:** FERTIG · 12/12 redaktionelle Heuristik, nicht Video-Score.

## Phase 1 – ChatGPT

**Status:** FERTIG

Vorhanden: aktuelle Quellen, Creative Brief, vollständiger finaler deutscher Sprechertext (788 Wörter), 8 Kapitel, Visualstrategie, Bildprompt-Einstieg, eigene Remotion-Build-Pläne, Thumbnail-Brief, YouTube-Texte. Ausführbare Remotion-Source, 8 Longform-Visuals, ProductionRoot-Registrierung, Thumbnail-Composition und Typecheck/Tests sind vorhanden. **Repository and Content System Checks** auf Commit `6de03c9677bee55c1ec7bcc646c3018b97fee91c` bestanden: [GitHub Actions Run #39024765008](https://github.com/memetreza34-ux/ki-channel/actions/runs/39024765008).

## Phase 2 – Mensch

**Status:** FERTIG

Die drei echten Voiceover-Aufnahmen (`Ki 1.mp4`, `Ki 2.mp4`, `Ki 2mp4.mp4`) wurden bereitgestellt, normalisiert (-16 LUFS, 48 kHz mono PCM) und als Master-Voiceover `voiceover.wav` / `voiceover.mp3` zusammengeführt. Externe Bildgenerierung und Produktcapture sind für dieses remotion-native Konzept nicht erforderlich.

## Phase 3 – Codex / Antigravity

**Status:** ERSTE FASSUNG (Gemini/Antigravity) – durch Überarbeitung ersetzt, siehe unten

Angaben dieser ersten Fassung stammen aus dem Gemini-Protokoll und wurden von Claude nicht nachgeprüft.

1. **Audio-Mastering:** `Ki 1.mp4`, `Ki 2.mp4`, `Ki 2mp4.mp4` nahtlos gemastert und loudness-normalisiert (-16 LUFS, -1.5 dB True Peak) in `01-script-audio/voiceover.wav`, `voiceover-master.wav`, `voiceover.mp3` und `public/__phase3/gpt6-intelligent-ui/voiceover.wav`.
2. **Whisper-Alignment:** Mit `whisper.cpp` (`ggml-medium.bin`) token- und satzgenau transkribiert. Exakte Kapitelgrenzen an natürlichen Satzpausen bei 30 fps bestimmt:
   - Kapitel 1 (Hook): 0 – 1.176 Frames (00:00 – 00:39)
   - Kapitel 2 (Format): 1.176 – 2.340 Frames (00:39 – 01:18)
   - Kapitel 3 (Technik): 2.340 – 3.740 Frames (01:18 – 02:04)
   - Kapitel 4 (Sparrechner): 3.740 – 4.977 Frames (02:04 – 02:45)
   - Kapitel 5 (Lernen): 4.977 – 6.285 Frames (02:45 – 03:29)
   - Kapitel 6 (Grenzen): 6.285 – 7.583 Frames (03:29 – 04:12)
   - Kapitel 7 (Verfügbarkeit): 7.583 – 8.775 Frames (04:12 – 04:52)
   - Kapitel 8 (Payoff): 8.775 – 9.927 Frames (04:52 – 05:30.9)
   - Gesamtdauer: 9.927 Frames (00:05:30.9)
3. **Contract, Visuals & Motion-Beat Timing:** `contract.ts`, `ProductionRoot.tsx`, `longform.json`, `youtube.md` aktualisiert. Tiefen-Audit der Animationen durchgeführt:
   - **Ch 5 Stromkreis-Geometrie:** Schalterhebel schloss zuvor mit 44px-Lücke ab (`x2=916` statt 960); korrigiert auf `925 + 35 * close`. SVG-Textkollision mit Schalterlabel behoben (`y=60`).
   - **Wortgenaue Motion-Beats:** In Ch 1, 4, 5, 6, 7, 8 die Keyframes präzise auf die gesprochenen Triggerworte synchronisiert (z. B. Ch 4 Sparbetrag erst bei Frame 840–990 auf 30 € animiert, Ch 5 Schließen des Stromkreises bei Frame 580–700, Ch 7 Modi sequenziell passend zur Erwähnung, Ch 8 Kernzitat bei Frame 890–1.020).
4. **Verifikation:** `npm run repo:wiring-check` PASS, `npm run typecheck` PASS, `npm test` PASS (147 Testdateien, 684 Tests), `check-production-visual-contracts.mjs` PASS.
5. **Renderings:**
   - Thumbnail: `03-thumbnail/thumbnail.png` gerendert und geprüft.
   - 8 Kapitelstills gerendert und visuell verifiziert.
   - Master-Video: `05-export/FERTIGES-VIDEO.mp4` (1080p, 30fps, H.264/AAC Stereo 48kHz, 19 MB) neu gerendert und verifiziert (gespiegelt nach `chatgpt-wird-zur-app-gpt6-intelligent-ui.mp4`).

## Phase 3b – Überarbeitung (Claude)

**Status:** GERENDERT, WARTET AUF ARMANS SICHTPRÜFUNG

Studio-Composition `Gpt6IntelligentUi` (`studio/projekte/gpt6-intelligent-ui/Video.tsx`) neu aufgebaut, gleiche Stimme (`voiceover.wav`), gleicher Kanal-Look mit Toki:

- Wortzeiten der echten Aufnahme mit whisper.cpp (`ggml-medium`) → `studio/projekte/gpt6-intelligent-ui/woerter.json`; jede Bewegung hängt per `at('Wort')` am gesprochenen Wort.
- Inhalte groß und mittig statt kleiner Karten oben links; sichtbare Veränderung etwa alle 2–3 s; Kamera zoomt auf Regler, Schalter und Ergebnis.
- Toki bedient die Oberflächen: schiebt den Gäste-Regler, den Auswahl-Knopf und den Sparregler, springt auf den Schalter, hält die Lupe.
- Behoben: Times-Schrift (fehlende `fontFamily`), Toki/Stempel verdecken Inhalte, 14 s leerer Bildschirm (4:51), nachgebautes OpenAI-Logo im Chatfenster, Bezeichnung „ChatGPT-Vorschlag“ für einen erfundenen Fehler.
- Kapitel 7 korrigiert: Plus · Pro · Business · Enterprise ab 7. Okt. (GPT-6 Sol), Free · Go ab 8. Okt. (GPT-6 Luna); Chat ja; Pro-Reasoning (GPT-6 Astra), Work-Bereich, Voice nein. Erfundenes „Work & Enterprise API – in Vorbereitung“ entfernt.
- Hinweis „Schematische Illustration – kein ChatGPT-Screenshot“ dauerhaft in allen Kapiteln mit nachgebauter Oberfläche, zusätzlich „Illustration“-Marke in jedem Fenster.
- Geprüft: `npx tsc -p studio/tsconfig.json` ohne Fehler; Kontaktbögen aller 8 Kapitel und aller Kamerafahrten gerendert und angesehen (Details in `post-video-improvement.md`).
- Export: `05-export/FERTIGES-VIDEO-v2.mp4`.

## Phase 4 – Quality Learning / Post Publish

**Status:** WARTET AUF ARMANS FREIGABE – vor Upload ansehen (mit Ton, auch klein auf dem Handy)

Nach YouTube-Upload reale Zuschauerdaten in `performance-review.md` pflegen.
