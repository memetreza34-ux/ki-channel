# KI-Agenten auf deutscher Wiki: der DseWiki-Fall

**Woche:** 2026-08-31_bis_2026-09-06
**Wochentag:** Samstag
**Publish-Date:** 2026-09-05
**Level-Up:** v4

## Thema

Aktuelle Einordnung des separat vom Hugging-Face-Zwischenfall berichteten DseWiki-Vorfalls: Forschende berichten von mehr als 15.000 Agenten-Bearbeitungen auf einer deutschen Programmierer-Wiki, die als Kommunikations-/Koordinationsfläche genutzt worden sein soll. OpenAIs Gegenposition und die noch laufende Prüfung werden sichtbar mitgeführt.

## Status nach dem ersten echten Reel-Test

Phase 1 wurde umgesetzt und anhand eines ersten echten Test-Renders überprüft. Dieser Render hat konkrete Verbesserungen ausgelöst und ist deshalb **superseded**; er darf nicht als Final-Review gelten.

Verbessert wurden:
- Caption-Typografie zentral auf Sans-Serif gelockt,
- Cover bereits subtil belebt,
- Szene 3 von statischer Card-Abfolge zu einem sichtbaren Indizien→Einordnung-Flow verdichtet,
- Szene 4 dynamischer zwischen Forscherbefund und OpenAI-Reaktion gewichtet,
- letzter Zustand erhält einen sauberen 0,8-s-Hold,
- neuer kanonischer H.264/CRF18 → -16-LUFS Social-Review-Master-Workflow.

## Produktionsphasen

1. **Phase 1:** Fakten + Skript + Story + Brand/Proof/Media + Level-Up-v4-Plan + Remotion-Source.
2. **Phase 2:** Produktions-Voiceover ausschließlich durch den Nutzer.
3. **Phase 3:** Pause-Kompression → 1,10× → Forced Alignment → Word-/Phrase-Lock → SFX/Visuals lokal materialisieren → Render-Lock → Social-Review-Master → echter 1x Review → Final Export.

Ziel: 60–75 s Voice-Locked, 150–175 Wörter, Hard-Limit 190.

Verbindlicher Review-Render nach Voice-Lock:

```bash
node ki/scripts/render-social-reel.mjs ki/reels/2026-08-31_bis_2026-09-06/06_Samstag/01_OpenAI-DseWiki-Agenten
```

Verbindlich: `REPO-STATE.md`, `ki/gehirn/MASTER.md`, `ki/gehirn/STORYTELLING_MOTION.md`, `ki/gehirn/LEVEL_UP_STANDARD.md`, `ki/gehirn/VISUAL_ASSETS.md`, `ki/gehirn/AUDIO_PIPELINE.md` und `ki/gehirn/PRODUKTIONSABLAUF.md`.
